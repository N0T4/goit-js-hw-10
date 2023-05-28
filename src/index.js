import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const apiKey = 'live_FuyG1boZ844BfvsEF15hu0eaWFgH6lVETd9Mu1tTqiwgNIrIwj7b9jSqIVcmXyjS';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loadingText = document.querySelector('.loading');
  const loader = document.querySelector('.loader');
  const errorText = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  breedSelect.style.display = 'none';
  loadingText.style.display = 'block';
  loader.style.display = 'block';
  catInfo.style.display = 'none';

  errorText.style.display = 'none';

  const catImage = document.createElement('img');
  const catName = document.createElement('p');
  const catDescription = document.createElement('p');
  const catTemperament = document.createElement('p');

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

      breedSelect.style.display = 'block';
      loadingText.style.display = 'none';
      loader.style.display = 'none';
    })
    .catch(error => {
      Notiflix.Notify.failure('Не вдалося отримати список порід котів');
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

        // Перевірити, чи є дані про породу кота
        if (catData.breeds && catData.breeds.length > 0) {
          const breed = catData.breeds[0];

          // Оновити дані про кота
          catImage.src = catData.url;
          catImage.alt = 'Котик';

          catName.textContent = `Порода: ${breed.name}`;

          catDescription.textContent = `Опис: ${breed.wikipedia_url}`;

          catTemperament.textContent = `Темперамент: ${breed.temperament}`;

          // Додати оновлені елементи до контейнера
          catInfo.appendChild(catImage);
          catInfo.appendChild(catName);
          catInfo.appendChild(catDescription);
          catInfo.appendChild(catTemperament);

          catInfo.style.display = 'block';
        } else {
          Notiflix.Notify.failure('Не вдалося отримати дані про кота');
        }
      })
      .catch(error => {
        // Сховати завантажувач у разі помилки
        loadingText.style.display = 'none';
        loader.style.display = 'none';

        // Показати повідомлення про помилку
        Notiflix.Notify.failure('Не вдалося отримати дані про кота');
        console.error(error);
      });
  });
});
