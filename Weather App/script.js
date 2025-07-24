const API_KEY = '6a2cd5974bf62d5656e044ac7ed7c6a6'; // Your OpenWeatherMap API key
let isDarkMode = true;

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
}

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  showLoading();
  hideError();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    displayWeather(data);
    hideLoading();
  } catch (error) {
    hideLoading();
    showError('Unable to fetch weather data. Please try a valid city name.');
  }
}

function displayWeather(data) {
  const weatherInfo = document.getElementById('weatherInfo');
  const weatherDetails = document.getElementById('weatherDetails');

  document.getElementById('cityName').textContent = data.name;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weatherDescription').textContent = data.weather[0].description;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

  const weatherMain = data.weather[0].main.toLowerCase();
  const iconElement = document.getElementById('weatherIcon');
  const bgElement = document.getElementById('animatedBg');

  switch (weatherMain) {
    case 'clear':
      iconElement.textContent = '☀️';
      bgElement.className = 'animated-bg sunny';
      break;
    case 'clouds':
      iconElement.textContent = '☁️';
      bgElement.className = 'animated-bg cloudy';
      break;
    case 'rain':
      iconElement.textContent = '🌧️';
      bgElement.className = 'animated-bg rainy';
      break;
    case 'snow':
      iconElement.textContent = '❄️';
      bgElement.className = 'animated-bg snowy';
      break;
    default:
      iconElement.textContent = '🌤️';
      bgElement.className = 'animated-bg default';
  }

  weatherInfo.classList.add('show');
  weatherDetails.style.display = 'grid';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

function toggleTheme() {
  const body = document.body;
  const toggleBtn = document.querySelector('.theme-toggle');

  if (isDarkMode) {
    body.style.filter = 'invert(1) hue-rotate(180deg)';
    toggleBtn.textContent = '☀️ Light Mode';
    isDarkMode = false;
  } else {
    body.style.filter = 'none';
    toggleBtn.textContent = '🌙 Dark Mode';
    isDarkMode = true;
  }
}

// Focus on input by default
document.getElementById('cityInput').focus();

// Show placeholder hint
const demoCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
document.getElementById('cityInput').addEventListener('focus', function () {
  if (!this.value) {
    this.placeholder = `Try: ${demoCities[Math.floor(Math.random() * demoCities.length)]}`;
  }
});
