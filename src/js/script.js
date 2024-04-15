'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

function renderCountry(data, className = '') {
  const toRender = `
        <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', toRender);
  countriesContainer.style.opacity = 1;
}

function getCountryAndneighbour(country) {
  // old school way of requests - new way is promises
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    `https://countries-api-836d.onrender.com/countries/name/${country}`
  );
  request.send(); // cant store as variable async so data no there

  // wait for request data to be brough back and load before next functionality
  request.addEventListener('load', () => {
    const [data] = JSON.parse(request.responseText); // if not using arrow could use this, [data] - takes the value out of the array with destructuring
    // The JSON.parse() static method parses a JSON string, constructing the JavaScript value or object described by the string.
    console.log(data);
    renderCountry(data);

    //  Get Neighbour Country (country 2)
    const firstNeighbour = data.borders?.[0]; // optional chaining to avoid error on trying to index undefined
    if (!firstNeighbour) {
      return;
    }

    // AJAX call for neighbour
    const request2 = new XMLHttpRequest();
    request2.open(
      'GET',
      `https://countries-api-836d.onrender.com/countries/alpha/${firstNeighbour}`
    );
    request2.send(); // cant store as variable async so data no there
    request2.addEventListener('load', () => {
      const neighbourData = JSON.parse(request2.responseText); // not an array when search by code no destructuring
      renderCountry(neighbourData, 'neighbour');
    });
  });
}

getCountryAndneighbour('gb');
// getCountryAndneighbour('usa');
// getCountryAndneighbour('republic of india'); // order might differ, data arrives slightly different times

// what if you need data that depends on a previous call?
// need a sequence of calls with the second running only after the first finishes - like above
// what if want neighbour of neighbour of neighbour - callback inside of callback inside of callback
// executing async tasks in sequence :'(

// WELCOME TO CALLBACK HELL!!!!! 🔥
