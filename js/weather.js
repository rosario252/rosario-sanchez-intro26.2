// footer using DOM manipulation
const body = document.body;
const footerElement = document.createElement('footer');
body.appendChild(footerElement);

// getting the current year and adding it to the footer
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector('footer');
const copyright = document.createElement('p');
copyright.innerHTML = `Rosario Sanchez &copy; ${thisYear}`;
footer.appendChild(copyright);

// Weather App
const weatherForm = document.querySelector('#weatherForm');
const search = document.querySelector('#search');
const tempBtn = document.querySelector('#tempBtn');
const conditionBtn = document.querySelector('#conditionBtn');
const message1 = document.querySelector('#message1');
const cityState = document.querySelector('#cityState');
const currentTemp = document.querySelector('#currentTemp');
const currentWeather = document.querySelector('#currentWeather');

// variables that store city's information
let latitude = null;
let longitude = null;
let selectedCity = '';
let selectedState = '';

// function clears old results before new one appears
function clearResults() {
    message1.textContent = '';
    cityState.textContent = '';
    currentTemp.textContent ='';
    currentWeather.textContent ='';
}

// function changes weather code number into simpler words
// codes are found on the WMO API documentation: https://open-meteo.com/en/docs
function getConditionName(code) {
    // 0: Clear sky
    if (code === 0) {
        return 'Sunny';
    }
   
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    else if (code >= 1 && code <= 3) {
        return 'Cloudy';
    }


    // 45, 48: Fog and depositing rime fog
    else if (code >= 45 && code >=48) {
        return 'Foggy';
    }


    //51, 53, 55: Drizzle: Light, moderate, and dense intensity
    else if (code >= 51 && code <= 55) {
        return 'Drizzle';
    }


    // 56, 57: Freezing Drizzle: Light and dense intensity
    else if (code >= 56 && code <= 57) {
        return 'Freezing Drizzle';
    }


    // 61, 63, 65: Rain: Slight, moderate and heavy intensity
    else if (code >= 61 && code <= 65) {
        return 'Rainy';
    }


    // 66, 67: Freezing Rain: Light and heavy intensity
    else if (code >= 66 && code <= 67) {
        return 'Freezing Rain';
    }


    // 71, 73, 75, 77: Snow fall: Slight, moderate, and violent
    else if (code >= 71 && code <= 77) {
        return 'Snowy';
    }


    // 80, 81, 82: Rain Showers: Slight, moderate, and violent
    else if (code >= 81 && code <= 82) {
        return 'Rain Showers';
    }


    // 85, 86: Snow showers slight and heavy
    else if (code >=85 && code <=86) {
        return 'Snow showers';
    }


    // If code does not match
    else {
        return 'Condition unavailable';
    }
}

// Input event listener
// If user deletes the city, we clear the saved city info
search.addEventListener('input', function (event) {
    if (search.value.trim() === '') {
        latitude = null;
        longitude = null;
        selectedCity = '';
        selectedState = '';

        clearResults();
    }
});

// City search form event listener
weatherForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get city name from input and remove extra spaces
    const city = search.value.trim();

    // Clear old results
    clearResults();

    // Show loading message
    message1.textContent = 'Searching for city...';

    // Fetch geocoding data to get latitude and longitude
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        
        // Send the GET request
        const response = await fetch(geoUrl);

        // Throw an error if the response is not ok
        if (!response.ok) {
            throw new Error('Could not search for city.');
        }

        // Convert response into JS data
        const data = await response.json();

        // Throw an error if city was not found
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found.');
        }

        // Get the first matching city from results
        const location = data.results[0];

        // Save the city name
        selectedCity = location.name;

        // Save latitude and longitude
        latitude = location.latitude;
        longitude = location.longitude;

        // Reset selectedState so that if user searches for another city, it does not show the previous state
        selectedState = '';

        // Save statename if API provides it
        if (location.admin1) {
            selectedState = location.admin1;
        }

        // Show success message
        message1.textContent = 'City found! Click a button to get the weather information.';

        // Show city and state (if available)
        if (selectedState) {
            cityState.textContent = `${selectedCity}, ${selectedState}`;
        } else {
            cityState.textContent = selectedCity;
        }
    
    } catch (error) {
        // If something goes wrong, show error message
        message1.textContent = error.message;
    }
});

// Event listener for temperature button
tempBtn.addEventListener('click', async function () {
    // If no city has been searched yet, stop and show a message
    if (latitude === null || longitude === null) {
        message1.textContent = 'Please search for a city first.';
        return;
    }

    // Clear only the old weather results
    currentTemp.textContent = '';
    currentWeather.textContent = '';

    // Show loading message
    message1.textContent = 'Getting temperature...';

    try {
        // Fetch temperature data using latitude and longitude
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit&timezone=auto`;
        const response = await fetch(weatherUrl);

        // Throw an error if the response is not ok
        if (!response.ok) {
            throw new Error('Could not get temperature.');
        }

        // Convert response into JS data
        const weatherData = await response.json();
            
        // Pull out the current temp value
        const temp = weatherData.current.temperature_2m;

        // Show the results
        message1.textContent = 'Current temperature:';
        currentTemp.textContent = `${temp} °F`;

    } catch (error) {
        message1.textContent = error.message;
    }
});

// Event listener for Condition Button
conditionBtn.addEventListener('click', async function() {
    // If no city has been searched yet, stop and show a message
    if (latitude === null || longitude === null) {
        message1.textContent = 'Please search for a city first.';
        return;
    }

    // Clear only the old weather results
    currentTemp.textContent = '';
    currentWeather.textContent = '';

    // Show loading message
    message1.textContent = 'Getting condition...';
    
    try {
        // Fetch condition data using latitude and longitude
        const conditionUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code&timezone=auto`;        
    
        // Send the GET request
        const response = await fetch(conditionUrl);

        // Throw an error if the response is not ok
        if (!response.ok) {
            throw new Error('Could not get condition.');
        }

        // Convert response into JS data
        const weatherData = await response.json();
            
        // Pull out the current temp value
        const weatherCode = weatherData.current.weather_code;

        // Use function to get simple word of the condition code
        const conditionName = getConditionName(weatherCode);
        
        // Show the results
        message1.textContent = 'Current condition:';
        currentWeather.textContent = conditionName;
        
    } catch (error) {
        message1.textContent = error.message;
    }
})
