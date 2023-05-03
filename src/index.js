import './css/styles.css';
// import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35898178-628df3d5ceb1661a68afdf1ae';
const lightbox = new SimpleLightbox('.gallery a');

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
  } else { loadMoreBtn.style.display = "block"; }
};

loadMoreBtn.style.display = "none";

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    searchQuery = evt.target.searchQuery.value.trim();
    page = 1;
    const data = await fetchImages();
    gallery.innerHTML = "";
    
    if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
        renderImages(data);
        Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images."`);
  }
});

loadMoreBtn.addEventListener('click', async () => {
    const data = await fetchImages();
    if (!data) return;
    renderImages(data);
});




// ----------------------------------------------------------------


// searchForm.addEventListener('submit', debounce(onSearch, DEBOUNCE_DELAY));

// // function onSearch(evt) {
// //   evt.preventDefault();

// //   const { query, days } = evt.currentTarget.elements;

// //   getWeather(query.value, days.value)
// //     .then((data) => list.innerHTML = createMarkup(data.forecast.forecastday))
// //     .catch((err) => console.log(err));
// // }

// function onSearch(evt) {
//     evt.preventDefault()
//     const { query } = evt.currentTarget.elements.searchQuery.value.trim();
//     fetchPixabay(query.value)
//         .then(data => console.log(data))
//         .catch(err => console.log(err))
// }

// function fetchPixabay(query, pageNumber) {
//     // this.page = 1;
//     // this.searchQuery = '';

//     const params = new URLSearchParams({
//         key: KEY_API,
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: 'true',
//         page: pageNumber,
//         per_page: 40,
//     });
//     const URL = `${BASE_URL}?key=${KEY_API}&${params}`
//     return fetch(URL).then((res) => {
//         if (!res.ok) {
//             throw new Error(res.statusText);
//         }
//         return res.json();
//     }); 
// }



// let searchQuery = '';
// let page = 1;

// let query = '';
// let numberOfPage = 1;
// export const per_page = 40;
// const lightbox = new SimpleLightbox('.gallery a');

// form.addEventListener('submit', debounce(onSearch, DEBOUNCE_DELAY));
// loadMoreBtn.addEventListener('click', debounce(onLoadMore, DEBOUNCE_DELAY));
// loadMoreBtn.style.display = "none";

// form.addEventListener("submit", async (e) => {
//   e.preventDefault(); searchQuery = e.target.searchQuery.value.trim();
//   page = 1;
//   loadMoreBtn.style.display = "none";
// if (!searchQuery) { return; }
//   const data = await fetchImages();
//   gallery.innerHTML = "";
//   if (data.hits.length === 0) {
//     Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//   } else {
//     displayImages(data);
//     Notiflix.Notify.success("Hooray! We found ${ data.totalHits } images.");
//   }
// });
//   loadMoreBtn.addEventListener('click', async () => {
//   page += 1;
//   const data = await fetchImages();
//   if (!data) return;
//   displayImages(data);
// });

// ------------- mein

// async function onSearch(evt) {
//     evt.preventDefault();
//     searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
//     page = 1;
//     if (!searchQuery) {
//         return
//     }
//     const data = await fetchPixabay();
//     gallery.innerHTML = '';
//     if (data.hits.length === 0) { 
//         Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//     } else {
//         renderPhotoGallery(data);
//         Notiflix.Notify.success(`"Hooray! We found ${ data.totalHits } images."`);
//     }
//     // fetchPixabay(searchQuery).then(renderPhotoGallery).catch(err => console.error(err));
//     };

// async function onLoadMore(evt) {
//     evt.preventDefault();
//     // console.log(evt.target);
//     page += 1;

//     const data = await fetchPixabay();
//     if (!data) return;
//     renderPhotoGallery(data);
// };

// function renderPhotoGallery(data) {
//     let photos = '';
//     data.hits.forEach((photo) => {
//         const { webformatURL, largeImageURL, tags, likes, views, downloads } = photo;
//         photos +=   
//  `<div class="photo-card">
//   <a href='${largeImageURL}' class="gallery-link">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes: ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views: ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments: ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads: ${downloads}</b>
//     </p>
//   </div>
// </div>`
//     }).join('');
//     gallery.insertAdjacentHTML('beforeend', photos);
    
//     if (data.hits.length < 40) {
//     loadMoreBtn.style.display = "none";
//     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//     } else {
//         loadMoreBtn.style.display = "block";
//     }
// };

// ----------------

// const API_KEY = "35504205-dd2dec5e4a5642491c73dfb42";
// const form = document.getElementById("search-form");
// const gallery = document.querySelector(".gallery");
// const loadMoreBtn = document.querySelector(".load-more");
// let searchQuery = "";
// let page = 1;
// const fetchImages = async () => {
//   const url = https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page};
//   try {
//     const response = await axios.get(url);
//     const { data } = response; return data;
//   }
//   catch (error) {
//     console.error(error);
//     Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
//     return null;
//   }
// };
// const displayImages = (data) => { let images = "";
//   data.hits.forEach((image) => {
//     const { webformatURL, tags, likes, views, comments, downloads } = image; images +=`
//       <div class="photo-card">
//        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         <div class="info">
//          <p class="info-item"><b>Likes</b>: ${likes}</p>
//           <p class="info-item"><b>Views</b>: ${views}</p>
//           <p class="info-item"><b>Comments</b>: ${comments}</p>
//           <p class="info-item"><b>Downloads</b>: ${downloads}</p>
//           </div>
//           </div>`;
//   });
// gallery.insertAdjacentHTML("beforeend", images);
//   if (data.hits.length < 40) {
//     loadMoreBtn.style.display = "none";
//     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//   } else { loadMoreBtn.style.display = "block"; }
// };
// form.addEventListener("submit", async (e) => {
//   e.preventDefault(); searchQuery = e.target.searchQuery.value.trim();
//   page = 1;
//   loadMoreBtn.style.display = "none";
// if (!searchQuery) { return; }
//   const data = await fetchImages();
//   gallery.innerHTML = "";
//   if (data.hits.length === 0) {
//     Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//   } else {
//     displayImages(data);
//     Notiflix.Notify.success("Hooray! We found ${ data.totalHits } images.");
//   }
// });
//   loadMoreBtn.addEventListener('click', async () => {
//   page += 1;
//   const data = await fetchImages();
//   if (!data) return;
//   displayImages(data);
// });

// ----------------


// const searchForm = document.querySelector('.search-form');
// const searchResult = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');

// const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 200 });

// const link = 'https://pixabay.com/api/';
// const key = '35729721-f6191ed3932b819a8a4bddcd2';
// const params = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
// let page = 1;
// let query = '';

// searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);
// searchResult.addEventListener('click', onClickImage);
// loadMoreBtn.style.display = "none";

// async function onSearch(e) {
//   e.preventDefault();
//   query = e.currentTarget.elements.searchQuery.value.trim();
//   page = 1;

//   if (!query) { return; }
//   const data = await fetchPhoto();
//   searchResult.innerHTML = "";
//   console.log(data);
//   if (data.hits.length === 0) {
//     Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//   };
//   if (data.total > 0) {
//     Notify.success(`Hooray! We found ${data.totalHits} images.`);
//     photosMarkup(data);
//     lightbox.refresh();
//   };
// };

// async function onLoadMore() {
//   page += 1;
//   const data = await fetchPhoto();
//   if (!data) return;
//   photosMarkup(data);
//   lightbox.refresh();

//   window.scrollBy({
//     top: 540,
//     behavior: "smooth",
//   });
// }

// function onClickImage(event) {
//   event.preventDefault();
//   if (event.target.nodeName !== "IMG") { return; }
// }

// async function fetchPhoto() {
//   const url = `${link}?key=${key}${params}&q=${query}&page=${page}`;
//   try {
//     const response = await axios.get(url);
//     const { data } = response; return data;
//   }
//   catch (error) {
//     console.error(error);
//   }
// }

// function photosMarkup(data) {
//   let cards = "";
//   data.hits.forEach((card) => {
//     const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = card; cards +=
//       `<div class="photo-card">
//         <a href="${largeImageURL}">
//         <img width="320" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
//         <div class="info">
//           <p class="info-item">
//             <b>Likes</b> <br> ${likes}
//           </p>
//           <p class="info-item">
//             <b>Views</b> <br> ${views}
//           </p>
//           <p class="info-item">
//             <b>Comments</b> <br> ${comments}
//           </p>
//           <p class="info-item">
//             <b>Downloads</b> <br> ${downloads}
//           </p>
//         </div>
//       </div>`;
//   });
//   searchResult.insertAdjacentHTML("beforeend", cards);

//   if (data.hits.length < 40 || page === 13) {
//     loadMoreBtn.style.display = "none";
//     Notify.info("We're sorry, but you've reached the end of search results.");
//   } else {
//     loadMoreBtn.style.display = "block";
//   }
// };


// -------------


// refs.btnLoadMore.addEventListener('click', onLoadMoreBtnClick);

// let query = '';
// let numberOfPage = 1;
// export const per_page = 40;

// const lightbox = new SimpleLightbox('.gallery a');

// function onFormSubmit(evt) {
//   evt.preventDefault();
//   numberOfPage = 1;
//   refs.gallery.innerHTML = '';
//   refs.btnLoadMore.classList.add('hidden');
//   const { searchQuery } = evt.target.elements;

//   if (!searchQuery.value.trim()) {
//     Notify.failure('Enter the query in the search!');
//     return;
//   }

//   query = searchQuery.value;
//   addGallery();
//   evt.currentTarget.reset();
// }

// async function addGallery() {
//   try {
//     const { hits, totalHits } = await fetchImages(query, numberOfPage);

//     if (!hits.length) {
//       refs.gallery.innerHTML = '';
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       renderGallery(hits);
//       Notify.success(`Hooray! We found ${totalHits} images.`);
//       lightbox.refresh();
//       if (totalPage > 1) {
//         refs.btnLoadMore.classList.remove('hidden');
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function addMoreImages() {
//   try {
//     const { hits } = await fetchImages(query, numberOfPage);
//     renderGallery(hits);
//     lightbox.refresh();
//     scrolling();
//   } catch (error) {
//     console.error(error);
//   }
// }

// function onLoadMoreBtnClick(evt) {
//   numberOfPage += 1;
//   if (numberOfPage > totalPage) {
//     evt.target.classList.add('hidden');
//     Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
//   addMoreImages();
// }

// const lightbox = new SimpleLightbox('.gallery a');

// function onFormSubmit(evt) {
//   evt.preventDefault();
//   numberOfPage = 1;
//   refs.gallery.innerHTML = '';
//   refs.btnLoadMore.classList.add('hidden');
//   const { searchQuery } = evt.target.elements;

//   if (!searchQuery.value.trim()) {
//     Notify.failure('Enter the query in the search!');
//     return;
//   }

//   query = searchQuery.value;
//   addGallery();
//   evt.currentTarget.reset();
// }

// async function addGallery() {
//   try {
//     const { hits, totalHits } = await fetchImages(query, numberOfPage);

//     if (!hits.length) {
//       refs.gallery.innerHTML = '';
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       renderGallery(hits);
//       Notify.success(`Hooray! We found ${totalHits} images.`);
//       lightbox.refresh();
//       if (totalPage > 1) {
//         refs.btnLoadMore.classList.remove('hidden');
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function addMoreImages() {
//   try {
//     const { hits } = await fetchImages(query, numberOfPage);
//     renderGallery(hits);
//     lightbox.refresh();
//     scrolling();
//   } catch (error) {
//     console.error(error);
//   }
// }

// function onLoadMoreBtnClick(evt) {
//   numberOfPage += 1;
//   if (numberOfPage > totalPage) {
//     evt.target.classList.add('hidden');
//     Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
//   addMoreImages();
// }