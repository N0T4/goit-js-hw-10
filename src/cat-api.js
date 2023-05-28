// Функція для отримання списку порід котів
export function fetchBreeds(apiKey) {
  return fetch('https://api.thecatapi.com/v1/breeds', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
    .then(response => response.json())
    .then(data => data);
}

// Функція для отримання даних про кота певної породи
export function fetchCatByBreed(breedId, apiKey) {
  return fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
    .then(response => response.json())
    .then(data => data[0]);
}
