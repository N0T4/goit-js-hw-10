import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = 'live_FuyG1boZ844BfvsEF15hu0eaWFgH6lVETd9Mu1tTqiwgNIrIwj7b9jSqIVcmXyjS';
const breedsUrl = `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`;
const catImageUrl = `https://api.thecatapi.com/v1/images/search?breed_ids=%{breedId}&api_key=${API_KEY}`;

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loadingText = document.querySelector('.loading');
  const loader = document.querySelector('.loader');
  const errorText = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  breedSelect.style.display = 'none';
  loadingText.style.display = 'none';
  loader.style.display = 'none';
  catInfo.style.display = 'none';

  errorText.style.display = 'none';

  const catImage = document.createElement('img');
  const catName = document.createElement('p');
  const catDescription = document.createElement('p');
  const catTemperament = document.createElement('p');

  // Отримати та заповнити список порід
  axios.get(breedsUrl)
    .then(response => {
      const breeds = response.data;
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });

      breedSelect.style.display = 'block';

      // Ініціалізувати бібліотеку вибору після заповнення елементів
      new SlimSelect({
        select: '.breed-select'
      });
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
    catInfo.style.display = 'none';

    // Отримати дані про кота за вибраною породою
    axios.get(catImageUrl.replace('%{breedId}', selectedBreedId))
      .then(response => {
        const catData = response.data[0];

        // Перевірити, чи є дані про породу кота
        if (catData.breeds && catData.breeds.length > 0) {
          const breed = catData.breeds[0];

          // Оновити дані про кота
          catImage.src = catData.url;
          catImage.alt = 'Котик';

          catName.textContent = `Порода: ${breed.name}`;

          catDescription.innerHTML = `Опис: <a href="${breed.wikipedia_url}" target="_blank">${breed.wikipedia_url}</a>`;

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

        // Сховати завантажувач після отримання даних про кота
        loadingText.style.display = 'none';
        loader.style.display = 'none';
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
