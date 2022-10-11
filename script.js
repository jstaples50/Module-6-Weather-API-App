// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// **GLOBAL VARIABLES**

var apiKey = '4c8c4f602c00e61fcabd2b0efc3a138f';
var lat = 39.778166251060085;
var lon = -86.15738136464999;

var searchBtnEl = $('#search-btn');
$(searchBtnEl).on('click', renderWeather);


var currentDayMonthYear = moment().format('L');
var currentDate = moment().format('YYYY-MM-DD');
var noon = '12:00:00'

// Source for Icons
// http://openweathermap.org/img/wn/{icon id}@2x.png

var iconImgUrl = '';
var iconImgEl = document.createElement('img');

var cityNameAndDate = 'Default City (Indianpolis)';
var cityNameAndDateEl = document.createElement('h2');

var cloudCover = '';
var cloudCoverEl = document.createElement('h3');
cloudCoverEl.setAttribute('class', 'cloud-cover');

var temp = '';
var tempEl = document.createElement('p');

var wind = '';
var windEl = document.createElement('p');

var humidity = '';
var humidityEl = document.createElement('p');

var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

// **FUNCTIONS**



function mainCityApiCall(url) {
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        console.log(data)
        cityNameAndDate = `${data.name} ${currentDayMonthYear}`;
        $(cityNameAndDateEl).text(cityNameAndDate);
        $('#city-weather').append(cityNameAndDateEl);

        iconImgUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconImgEl.setAttribute('src', iconImgUrl);
        $('#city-weather').append(iconImgEl);

        cloudCover = data.weather[0].description;
        $(cloudCoverEl).text(cloudCover);
        $('#city-weather').append(cloudCoverEl);

        temp = `Temp: ${data.main.temp}°F`;
        $(tempEl).text(temp);
        $('#city-weather').append(tempEl);

        wind = `Wind: ${data.wind.speed} MPH`;
        $(windEl).text(wind);
        $('#city-weather').append(windEl);

        humidity = `Humidity: ${data.main.humidity}%`;
        $(humidityEl).text(humidity);
        $('#city-weather').append(humidityEl);
    }); 
}

function fiveDayForecastApiCall(url) {
    var dataCheck = 1;
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        var fiveDayForecast = document.createElement('h2');
        $(fiveDayForecast).text('5-Day Forecast');
        $('#five-day-forecast').append(fiveDayForecast);

        // Loop to check if data is not today, and if data is for noon

        for(var i = 0; i < data.list.length; i++) {
            if (!data.list[i].dt_txt.includes(currentDate) 
                && data.list[i].dt_txt.includes(noon)) {

                console.log(`${dataCheck} ${data.list[i].main}`);

                var dayCard = document.createElement('div');
                $(dayCard).addClass('card');
                $('#five-day-forecast').append(dayCard);

                // Sets the unix variable from data and formats it

                var unixVariable = data.list[i].dt;
                var indexDate = moment(unixVariable * 1000).format('MM/DD/YYYY');
                var indexDateEl = document.createElement('h3');
                $(indexDateEl).text(indexDate);
                $(dayCard).append(indexDateEl);

                // Cloud cover for 5 day

                var fiveDayCloudCover = data.list[i].weather[0].description;
                var fiveDayCloudCoverEl = document.createElement('p');
                fiveDayCloudCoverEl.setAttribute('class', 'cloud-cover')
                $(fiveDayCloudCoverEl).text(fiveDayCloudCover);
                $(dayCard).append(fiveDayCloudCoverEl);

                // Temp for 5 day

                var fiveDayTemp = `Temp: ${data.list[i].main.temp}°F`;
                var fiveDayTempEl = document.createElement('p');
                $(fiveDayTempEl).text(fiveDayTemp);
                $(dayCard).append(fiveDayTempEl);

                // Wind for 5 day

                var fiveDayWind = `Wind: ${data.list[i].wind.speed} MPH`;
                var fiveDayWindEl = document.createElement('p');
                $(fiveDayWindEl).text(fiveDayWind);
                $(dayCard).append(fiveDayWindEl);

                // Humidity for 5 day

                var fiveDayHumidity = `Humidity: ${data.list[i].main.humidity}%`;
                var fiveDayHumidityEl = document.createElement('p');
                $(fiveDayHumidityEl).text(fiveDayHumidity);
                $(dayCard).append(fiveDayHumidityEl);
            }
            dataCheck++;
        }
        console.log(data);
    })
}

function renderWeather(event) {
    event.preventDefault();
    console.log('click');
    mainCityApiCall(weatherURL);
    fiveDayForecastApiCall(forecastURL);
}

// **TESTS**

var fiveDayTest = $('#five-day-forecast')
$(fiveDayTest).css('height:100px;')
console.log($(searchBtnEl).text());

// **EXECUTION**

// mainCityApiCall(weatherURL);
// fiveDayForecastApiCall(forecastURL);

