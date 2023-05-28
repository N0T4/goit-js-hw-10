import SlimSelect from 'slim-select'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const apiKey = 'live_FuyG1boZ844BfvsEF15hu0eaWFgH6lVETd9Mu1tTqiwgNIrIwj7b9jSqIVcmXyjS';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loadingText = document.querySelector('.loading');
  const loader = document.querySelector('.loader');
  const errorText = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  // Отримати та заповнити список порід
  fetchBreeds(apiKey)
    .then(breeds => {
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });

      // Ініціалізувати бібліотеку красивого вибору
      new SlimSelect({
        select: '.breed-select',
      });
    })
    .catch(error => {
      errorText.style.display = 'block';
      console.error(error);
    });

  // Обробник події для зміни вибраної породи
  breedSelect.addEventListener('change', event => {
    const selectedBreedId = event.target.value;

    // Очистити попередню інформацію про кота
    catInfo.innerHTML = '';

    // Показати завантажувач під час отримання даних про кота
    loadingText.style.display = 'block';
    loader.style.display = 'block';
    errorText.style.display = 'none';

    // Отримати дані про кота за вибраною породою
    fetchCatByBreed(selectedBreedId, apiKey)
      .then(catData => {
        // Сховати завантажувач після отримання даних про кота
        loadingText.style.display = 'none';
        loader.style.display = 'none';

        // Вивести отримані дані про кота
        const catImage = document.createElement('img');
        catImage.src = catData.url;
        catImage.alt = 'Котик';
        catInfo.appendChild(catImage);

        const catName = document.createElement('p');
        catName.textContent = `Ім'я: ${catData.name}`;
        catInfo.appendChild(catName);

        const catDescription = document.createElement('p');
        catDescription.textContent = `Опис: ${catData.description}`;
        catInfo.appendChild(catDescription);
      })
      .catch(error => {
        // Сховати завантажувач у разі помилки
        loadingText.style.display = 'none';
        loader.style.display = 'none';

        // Показати повідомлення про помилку
        errorText.style.display = 'block';
        console.error(error);
      });
  });
});
