const searchBtn = document.querySelector("[data-search-btn]");
const getLocationBtn = document.querySelector(".get-device-location-btn");
const searchInput = document.querySelector("[data-search-input]");
const weatherPage = document.querySelector("[data-weather-page]");
const searchPage = document.querySelector("[data-search-page]");
const backBtn = document.querySelector("[data-back-btn]");
const forecastUl = document.querySelector("[data-forecast-ul]");
const searchForm = document.querySelector("[data-search-form]");
const loadingAnimation = document.querySelector("[data-loading-animation]");
const searchInfo = document.querySelector(".search-info");
const baseUrl = "http://api.weatherapi.com/v1";
let searchUrl;
let weatherCollection = [];

getLocationBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, onError);
    // searchForm.style.opacity = 0;
    // loadingAnimation.style.display = "block";
  } else {
    alert("Your browser not support geolocation api");
  }
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInput.value == "") return;
  getSearchValue(searchInput.value);
  // searchForm.style.opacity = 0;
  // loadingAnimation.style.display = "block";
});

backBtn.addEventListener("click", () => {
  resetPage();
});

function resetPage() {
  searchPage.classList.remove("hide");
  weatherPage.classList.remove("active");
  backBtn.style.opacity = 0;
  weatherCollection.length = 0;
  searchForm.style.opacity = 1;
  loadingAnimation.style.display = "none";
  searchInput.value = null;
  while (forecastUl.firstChild) {
    forecastUl.firstChild.remove();
  }
}

function getSearchValue(cityName) {
  searchUrl = `${baseUrl}/forecast.json?key=6c5da7e274314fcd91c22840221505&q=${cityName}&days=3&aqi=no&alerts=no`;
  getWeather();
}

function getPosition(position) {
  const lon = position.coords.longitude;
  const lat = position.coords.latitude;
  searchUrl = `${baseUrl}/forecast.json?key=6c5da7e274314fcd91c22840221505&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
  getWeather();
}

function onError(error) {
  alert(error.message);
}

function getWeather() {
  searchForm.style.opacity = 0;
  loadingAnimation.style.display = "block";
  fetch(searchUrl)
    .then((response) => {
      if (response.ok) {
        let data = response.json();
        return data;
      } else {
        searchForm.style.opacity = 1;
        loadingAnimation.style.display = "none";
        searchInfo.style.display = "block";
        setTimeout(() => (searchInfo.style.display = "none"), 2000);
      }
    })
    .then((data) => {
      parseWeather(data);
    })
    .then(() => {
      displayWeather();
      appendForecastList();
    })
    .catch((error) => {
      console.log("error message:", error);
    });
}

function parseWeather(data) {
  data.forecast.forecastday.forEach((forecast) => {
    const result = {
      location: data.location.name,
      date: dayjs.unix(forecast.date_epoch).format("MMM-D"),
      weekday: dayjs.unix(forecast.date_epoch).format("ddd"),
      currentTemp: data.current.temp_c,
      maxTemp: forecast.day.maxtemp_c,
      minTemp: forecast.day.mintemp_c,
      percipitation: forecast.day.totalprecip_mm,
      visibility: forecast.day.avgvis_km,
      humidity: forecast.day.avghumidity,
      wind: forecast.day.maxwind_kph,
      icon: forecast.day.condition.icon,
      text: forecast.day.condition.text,
    };
    weatherCollection.push(result);
  });
}

function displayWeather() {
  //left card display
  const headerDay = document.querySelector("[data-header-day]");
  const headerDate = document.querySelector("[data-header-date]");
  const headerLocation = document.querySelector("[data-header-location]");
  const footerIcon = document.querySelector("[data-weather-icon]");
  const footerTemp = document.querySelector("[data-footer-temp]");
  const footerTempInfo = document.querySelector("[data-footer-temp-info]");

  headerDay.innerText = weatherCollection[0].weekday;
  headerDate.innerText = weatherCollection[0].date;
  headerLocation.innerText = weatherCollection[0].location;
  footerIcon.src = weatherCollection[0].icon;
  footerTemp.innerText = `${weatherCollection[0].maxTemp}${String.fromCharCode(176)}C`;
  footerTempInfo.innerText = weatherCollection[0].text;

  //right card display
  const visibility = document.querySelector("[data-visibility]");
  const humidity = document.querySelector("[data-humidity]");
  const wind = document.querySelector("[data-wind]");
  const percipitation = document.querySelector("[data-percipitation]");
  const maxTemp = document.querySelector("[data-max-temp]");
  const minTemp = document.querySelector("[data-min-temp]");

  visibility.innerText = `${weatherCollection[0].visibility}km`;
  humidity.innerText = `${weatherCollection[0].humidity}%`;
  wind.innerText = `${weatherCollection[0].wind}km/h`;
  percipitation.innerText = `${weatherCollection[0].percipitation}mm`;
  maxTemp.innerText = `${weatherCollection[0].maxTemp}${String.fromCharCode(176)}C`;
  minTemp.innerText = `${weatherCollection[0].minTemp}${String.fromCharCode(176)}C`;

  searchPage.classList.add("hide");
  weatherPage.classList.add("active");
  backBtn.style.opacity = 1;
}

function appendForecastList() {
  weatherCollection.forEach((forecastList) => {
    const liElement = document.createElement("li");
    const iconElement = document.createElement("img");
    const dayElement = document.createElement("span");
    const dateElement = document.createElement("span");
    const tempElement = document.createElement("span");
    iconElement.src = forecastList.icon;
    dayElement.innerText = forecastList.weekday;
    dateElement.innerText = forecastList.date;
    tempElement.innerText = `${forecastList.maxTemp}${String.fromCharCode(176)}C`;
    forecastUl.appendChild(liElement);
    liElement.appendChild(iconElement);
    liElement.appendChild(dayElement);
    liElement.appendChild(dateElement);
    liElement.appendChild(tempElement);
  });
}
