const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherBox = document.getElementById("weatherBox");
const error = document.getElementById("error");

/* SEARCH WEATHER */

async function getWeather(city){

    try{

        error.textContent = "";

        const response = await fetch(
            `https://wttr.in/${city}?format=j1`
        );

        const data = await response.json();

        displayWeather(data, city);

    }catch{

        weatherBox.style.display = "none";
        error.textContent = "City not found";
    }
}

/* LOCATION WEATHER */

async function getWeatherByCoords(lat, lon){

    try{

        error.textContent = "";

        /* GET WEATHER */

        const weatherResponse = await fetch(
            `https://wttr.in/${lat},${lon}?format=j1`
        );

        const weatherData = await weatherResponse.json();

        /* GET CITY NAME */

        const locationResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const locationData = await locationResponse.json();

        const city =
            locationData.address.city ||
            locationData.address.town ||
            locationData.address.village ||
            "Your Location";

        /* DISPLAY WEATHER */

        displayWeather(weatherData, city);

    }catch{

        weatherBox.style.display = "none";
        error.textContent = "Unable to fetch location";
    }
}

/* DISPLAY WEATHER */

function displayWeather(data, city){

    weatherBox.style.display = "block";

    const current = data.current_condition[0];

    /* CITY NAME */

    document.getElementById("cityName").textContent = city;

    /* TEMPERATURE */

    document.getElementById("temperature").textContent =
    `${current.temp_C}°C`;

    /* DESCRIPTION */

    document.getElementById("description").textContent =
    current.weatherDesc[0].value;

    /* HUMIDITY */

    document.getElementById("humidity").textContent =
    `${current.humidity}%`;

    /* WIND */

    document.getElementById("wind").textContent =
    `${current.windspeedKmph} km/h`;

    /* FEELS LIKE */

    document.getElementById("feelsLike").textContent =
    `${current.FeelsLikeC}°C`;

    /* PRESSURE */

    document.getElementById("pressure").textContent =
    `${current.pressure} hPa`;
}

/* SEARCH BUTTON */

searchBtn.addEventListener("click", ()=>{

    const city = cityInput.value.trim();

    if(city === ""){

        error.textContent = "Please enter city name";
        return;
    }

    getWeather(city);
});

/* ENTER KEY */

cityInput.addEventListener("keypress",(e)=>{

    if(e.key === "Enter"){

        const city = cityInput.value.trim();

        if(city !== ""){

            getWeather(city);
        }
    }
});

/* LOCATION BUTTON */

locationBtn.addEventListener("click", ()=>{

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(

            (position)=>{

                getWeatherByCoords(
                    position.coords.latitude,
                    position.coords.longitude
                );
            },

            ()=>{

                error.textContent = "Location access denied";
            }
        );

    }else{

        error.textContent = "Geolocation not supported";
    }
});