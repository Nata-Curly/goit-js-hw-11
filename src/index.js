import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35898178-628df3d5ceb1661a68afdf1ae';
const lightbox = new SimpleLightbox('.gallery a', {captionDelay: 100});

let searchQuery = "";
let page = 1;

async function fetchImages() {
const params = new URLSearchParams({
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
    });
  const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&${params}&page=${page}`;
  try {
    const response = await axios.get(URL);
    const { data } = response;
    return data;
  }
  catch (error) {
    console.error(error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
    return null;
  }
};

async function renderImages(data) {
    let images = "";
    data.hits.forEach((image) => {
    const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
    images +=`
      <div class="photo-card">
      <a href="${largeImageURL}">
       <img src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
        <div class="info">
         <p class="info-item"><b>Likes</b>: ${likes}</p>
          <p class="info-item"><b>Views</b>: ${views}</p>
          <p class="info-item"><b>Comments</b>: ${comments}</p>
          <p class="info-item"><b>Downloads</b>: ${downloads}</p>
          </div>
          </div>`;
    });
    
    gallery.insertAdjacentHTML("beforeend", images);
        
    if (data.hits.length < 40) {
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
        loadMoreBtn.style.display = "block";
        lightbox.refresh();
    }
};

loadMoreBtn.style.display = "none";

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    searchQuery = evt.target.searchQuery.value.trim();
    
    if (!searchQuery) { return; }
    const data = await fetchImages();
    gallery.innerHTML = "";
    
    if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
        Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images."`);
        renderImages(data);
        lightbox.refresh();
  }
});

loadMoreBtn.addEventListener('click', async () => {
    page += 1;
    const data = await fetchImages();
    if (!data) return;
    renderImages(data);
    lightbox.refresh();
    
    window.scrollBy({
    top: 720,
    behavior: "smooth",
     });
    
});

