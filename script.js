/**
 * Makes the API calls to retrieve the current weather and hourly forecast data for the entered city.
 */
function getWeather() {

    const apiKey = 'd4f7929649def7e3fd7a10482510509e';
    const city = document.getElementById('city').value;  // The city entered by the user

    if (!city) {  // No city entered
        alert('Please enter a city');
        return;
    }

    /* Define API calls to retirve weather data from OpenWeather API */
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    /* Retrieve the current weather for the entered city */
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    /* Retrieve the hourly forecast for the entered city */
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}


/**
 * Updates the app with the given weather data.
 * @param {Object} data Weather data returned by the OpenWeather API
 */
function displayWeather(data) {

    /* Define references to each HTML element displaying weather data */
    const tempInfoDiv = document.getElementById('temperature');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    /* Clear any existing content */
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempInfoDiv.innerHTML = '';

    if (data.cod === '404') {  // If an error occurred
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Display error message
    } else {  // No error occurred

        /* Extract relevant information from the data */
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);  // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        /* Create and set HTML content */
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempInfoDiv.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();  // Display the weather icon
    
    }
}


/**
 * Parses the hourly forecast and displays the data for the next 24 hours.
 * @param {Object} hourlyData Hourly forecast data returned by the OpenWeather API
 */
function displayHourlyForecast(hourlyData) {

    const hourlyForecastDiv = document.getElementById('hourly-forecast');  // Reference to the HTML element displaying the hourly forecast data

    /* Define data for the next 24 hours */
    const next24Hours = hourlyData.slice(0, 8); // Slice into 3 hour intervals

    next24Hours.forEach(item => {  // Iterate over each interval

        /* Extract relevant information from the interval's data */
        const dateTime = new Date(item.dt * 1000); // Convert to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);  // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        /* Create and set HTML content for the interval */
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;  // Append to the existing content in the hourly forecast

    });
}


/**
 * Displays a weather icon image.
 */
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');  // Reference to the HTML element containing the weather icon
    weatherIcon.style.display = 'block'; // Make the image visible once loaded
}