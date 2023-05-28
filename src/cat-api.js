// cat-api.js


export function fetchBreeds(apiKey) {
  const url = 'https://api.thecatapi.com/v1/breeds';

  return fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Не вдалося отримати список порід котів');
      }
      return response.json();
    })
    .catch(error => {
      throw new Error('Не вдалося отримати список порід котів');
    });
}

export function fetchCatByBreed(breedId, apiKey) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}`;

  return fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Не вдалося отримати дані про кота');
      }
      return response.json();
    })
    .then(data => data[0])
    .catch(error => {
      throw new Error('Не вдалося отримати дані про кота');
    });
}
