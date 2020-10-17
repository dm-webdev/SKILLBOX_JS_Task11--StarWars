'strict mode';

let base = [{
    personName: 'Имя персонажа: ',
    personHeight: 'Рост персонажа: ',
    personMass: 'Вес персонажа: ',
    personBirthYear: 'Год рождения: ',
    personFilmsCount: 'В скольки фильмах появлялся: '
  },
  {
    starshipName: 'Название звездолета: ',
    starshipModel: 'Модель звездолета: ',
    starshipClass: 'Класс звездолета: ',
    starshipLength: 'Длина звездолета: ',
    starshipFilmsCount: 'В скольки фильмах появлялся: '
  },
  {
    planetName: 'Название планеты: ',
    planetDiameter: 'Диаметр планеты: ',
    planetClimate: 'Климат планеты: ',
    planetTerrain: 'Ландшафт планеты: ',
    planetFilmsCount: 'В скольки фильмах появлялась: '
  }
];

let selectTarget = document.querySelector('.select__target');
let infoMassageStart = document.querySelector('.info-massage_start');
let infoMassageChoice = document.querySelector('.info-massage_choice');
let errorSearch = document.querySelector('.error-massage_search');
let errorServer = document.querySelector('.error-massage_server');
let errorUrl = document.querySelector('.url');
let responseMessage = document.querySelector('.response-message');
let searchForm = document.querySelector('.search-form');
let url;
let personSearch = document.querySelector('.person__search');
let data;

// выбор цели поиска с формирование списка выходных характеристик

selectTarget.addEventListener('change', function (event) {
  event.preventDefault();
  chooseTarget();
});

function chooseTarget() {
  if (selectTarget.value == 'start') {
    infoMassageStart.setAttribute('hidden', 'false');
  } else {
    infoMassageChoice.setAttribute('hidden', 'true');
    infoMassageStart.setAttribute('hidden', 'true');
    cleanPersonDataList();
    setPersonDataList();
  }
}

function cleanPersonDataList() {
  let personData = document.querySelector('.person__data');
  if (personData != null) {
    personData.remove();
  };
};

function setPersonDataList() {
  let outputContainer = document.querySelector('.output-container');

  let keys = Object.keys(base[selectTarget.value]);
  let obj = base[selectTarget.value];

  let personData = document.createElement('ul');
  personData.className = 'person__data';

  keys.forEach((item) => {
    let personDataItems = document.createElement('li');
    personDataItems.className = 'person__data__items';
    personDataItems.textContent = obj[item];

    let personDataItemsSpan = document.createElement('span');
    personDataItemsSpan.setAttribute('name', item);

    personDataItems.append(personDataItemsSpan);
    personData.append(personDataItems);
  });
  outputContainer.append(personData);
};

// основа

searchForm.addEventListener('click', function (event) {
  event.preventDefault();
  let target = event.target;
  let arr = [...document.querySelectorAll('.search__result_item')];
  let n = arr.indexOf(target);

  if (target.classList.contains('button')) {
    if (selectTarget.value == 'start') {
      infoMassageChoice.removeAttribute('hidden');
    } else {
      infoMassageChoice.setAttribute('hidden', 'true');
      getUrl();
      createDate();
      personSearch.value = '';
      return data;
    }
  };

  if (target.classList.contains('search__result_item')) {
    if (selectTarget.value == 0) {
      document.querySelector('[name="personName"]').innerHTML = data[n].name;
      document.querySelector('[name="personHeight"]').innerHTML = data[n].height;
      document.querySelector('[name="personMass"]').innerHTML = data[n].mass;
      document.querySelector('[name="personBirthYear"]').innerHTML = data[n].birth_year;
      document.querySelector('[name="personFilmsCount"]').innerHTML = data[n].films.length;
    } else if (selectTarget.value == 1) {
      document.querySelector('[name="starshipName"]').innerHTML = data[n].name;
      document.querySelector('[name="starshipModel"]').innerHTML = data[n].model;
      document.querySelector('[name="starshipClass"]').innerHTML = data[n].starship_class;
      document.querySelector('[name="starshipLength"]').innerHTML = data[n].length;
      document.querySelector('[name="starshipFilmsCount"]').innerHTML = data[n].films.length;
    } else if (selectTarget.value == 2) {
      document.querySelector('[name="planetName"]').innerHTML = data[n].name;
      document.querySelector('[name="planetDiameter"]').innerHTML = data[n].diameter;
      document.querySelector('[name="planetClimate"]').innerHTML = data[n].climate;
      document.querySelector('[name="planetTerrain"]').innerHTML = data[n].terrain;
      document.querySelector('[name="planetFilmsCount"]').innerHTML = data[n].films.length;
    }
  }
})

// запрос данных API

function getUrl() {
  url = new URL(`${selectTarget.options[selectTarget.selectedIndex].getAttribute('id')}/`, 'https://swapi.dev/api/');
  url.searchParams.set('search', personSearch.value);
  return url;
};

async function createDate() {
  try {
    let response = await fetch(url);
    console.log(response.status);
    if (response.ok) {
      data = await response.json();
      data = data.results;

      let searchResultBtn = document.querySelector('.search__result');
      if (searchResultBtn != null) {
        searchResultBtn.remove();
      };

      let searchResult = document.createElement('ul');
      searchResult.className = 'search__result';
      data.forEach((item) => {
        let searchResultItem = document.createElement('li');
        searchResultItem.className = 'search__result_item';
        searchResultItem.textContent = item.name;
        searchResult.append(searchResultItem);
        console.log(searchResult);
      });

      searchForm.append(searchResult);

      if (data.length == 0) {
        errorUrl.innerHTML = url;
        errorSearch.removeAttribute('hidden');
        setTimeout(() => errorSearch.setAttribute('hidden', 'true'), 5000)
      }
      return data;
    }
  } catch (err) {
    responseMessage.innerHTML = err;
    errorServer.removeAttribute('hidden');
    setTimeout(() => errorServer.setAttribute('hidden', 'true'), 5000);
  }
}
