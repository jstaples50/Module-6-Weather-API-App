// **GLOBAL VARIABLES**

var apiKey = '4c8c4f602c00e61fcabd2b0efc3a138f';

// Variable to check for errors

var errorFound = false;

var searchBtnEl = $('#search-btn');
$(searchBtnEl).on('click' , renderWeather);
$('#state-search').on()

$('#saved-searches').on('click', rememberWeather);

// Local Storage

if (localStorage.getItem('cityKeyPair') !== null) {
    var cityKeyPair = JSON.parse(localStorage.getItem('cityKeyPair'));
} else {
    var cityKeyPair = {};
}

// Current Weather Variables

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

// Render Weather Variables

var renderCityName;
var renderStateName;


// var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

// var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

var stateAbbreviations = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

// Create state datalist

for (var i = 0; i < stateAbbreviations.length; i++) {
    var optionEl = document.createElement('option');
    optionEl.value = stateAbbreviations[i];
    $('#state-options').append(optionEl);
}


// **FUNCTIONS**

function renderWeather(event) {
    $('#city-weather').empty();
    $('#five-day-forecast').empty();
    event.preventDefault();
    console.log('click');
    renderCityName = $('#city-search').val();
    renderStateName = $('#state-search').val().toLowerCase();

    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${renderCityName},${renderStateName},us&units=imperial&appid=${apiKey}`
    var forecastByCityURL =`https://api.openweathermap.org/data/2.5/forecast?q=${renderCityName},${renderStateName},us&units=imperial&appid=${apiKey}`

    submitMainCityApiCall(weatherURL);
    fiveDayForecastApiCall(forecastByCityURL);
}

function rememberWeather(event) {
    if(event.target.matches('button')) {
        $('#city-weather').empty();
        $('#five-day-forecast').empty();
        event.preventDefault();
        console.log('click');
        var rememberCityName = event.target.textContent;
        var rememberStateName = cityKeyPair[`${rememberCityName}`][1];
        console.log(rememberStateName);

        var cityWeatherEl = $('#city-weather')
        $(cityWeatherEl).addClass(['container', 'p-4', 'm-3', 'j-border']);
        console.log(cityWeatherEl)

        var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${rememberCityName},${rememberStateName},us&units=imperial&appid=${apiKey}`
        var forecastByCityURL =`https://api.openweathermap.org/data/2.5/forecast?q=${rememberCityName},${rememberStateName},us&units=imperial&appid=${apiKey}`

        rememberMainCityApiCall(weatherURL);
        fiveDayForecastApiCall(forecastByCityURL);
    } else {
        throw new Error('Inbetween Buttons')
    }
}

function submitCheckErrorAndRenderSaved() {
        var savedOptionEl = document.createElement('button')
        $(savedOptionEl).addClass(['saved-btn', 'btn', 'btn-primary', 'm-3']);
        $(savedOptionEl).text(renderCityName);
        $('#saved-searches').append(savedOptionEl);
        cityKeyPair[`${renderCityName}`] = [`${renderCityName}`, `${renderStateName}`];
        localStorage.setItem('cityKeyPair', JSON.stringify(cityKeyPair));
}

function submitMainCityApiCall(url) {
    errorFound = false;
    fetch(url)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            errorFound = true;
            
            console.log(`1st ${errorFound}`)

            var cityWeatherEl = $('#city-weather')
            $(cityWeatherEl).addClass(['container', 'p-4', 'm-3']);

            var errorEl = document.createElement('p')
            $(errorEl).text('Enter Valid City Name')
            $('#city-weather').append(errorEl);
            $('#city-weather').addClass('j-border')
            throw new Error('Something went wrong');
        }
    })
    .then (function (data) {
        console.log(data)

        var cityWeatherEl = $('#city-weather')
        $(cityWeatherEl).addClass(['container', 'p-4', 'm-3', 'j-border']);
        
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

        console.log(`2nd ${errorFound}`)

        if (errorFound === false) {
            submitCheckErrorAndRenderSaved()
        }
    })
}

function rememberMainCityApiCall(url) {
    errorFound = false;
    fetch(url)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            errorFound = true;
            var errorEl = document.createElement('p')
            $(errorEl).text('Enter Valid City Name')
            $('#city-weather').append(errorEl);
            $('#city-weather').addClass('j-border')
            throw new Error('Something went wrong');
        }
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
    }) 
}

function fiveDayForecastApiCall(url) {
    var dataCheck = 1;
    fetch(url)
    .then(function (response) {
        if (response.ok) {
        return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then (function (data) {
        var fiveDayForecast = document.createElement('h2');
        $(fiveDayForecast).text('5-Day Forecast');
        $(fiveDayForecast).addClass(['row', 'm-3', 'j-text-color']);
        $('#five-day-forecast').addClass('j-border');
        $('#five-day-forecast').append(fiveDayForecast);
        var dayCardContainer = document.createElement('div');
        $(dayCardContainer).addClass(['d-flex', 'justify-content-evenly', 'flex-row']);
        $('#five-day-forecast').append(dayCardContainer);

        // Loop to check if data is not today, and if data is for noon

        for(var i = 0; i < data.list.length; i++) {
            if (!data.list[i].dt_txt.includes(currentDate) 
                && data.list[i].dt_txt.includes(noon)) {

                console.log(`${dataCheck} ${data.list[i].main}`);

                var dayCard = document.createElement('div');
                $(dayCard).addClass(['card', 'd-flex', 'justify-content-evenly', 'mb-4', 'p-2', 'bg-primary', 'j-text-color']);
                $(dayCardContainer).append(dayCard);

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

function getLocalStorage() {
    if (localStorage.getItem('cityKeyPair') !== null) {
        console.log(cityKeyPair.length);
        keys = Object.entries(cityKeyPair);

        for (var i = 0; i < Object.entries(cityKeyPair).length; i++) {
            var savedOptionEl = document.createElement('button')
            $(savedOptionEl).addClass(['saved-btn', 'btn', 'btn-primary', 'm-3']);
            var cityText = keys[i][0];
            $(savedOptionEl).text(cityText);
            $('#saved-searches').append(savedOptionEl);
        }
    }  
} 

// **TESTS**

function locationTest(url) {
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        console.log(data)
    })
}

// **EXECUTION**

getLocalStorage();
