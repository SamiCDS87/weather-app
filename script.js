// VARIABLES

const weatherDescriptions = {
    0: "Ciel dégagé",
    1: "Principalement clair",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Neige légère",
    73: "Neige modérée",
    75: "Neige forte",
    80: "Averses légères",
    81: "Averses modérées",
    82: "Averses violentes",
    95: "Orage",
};

const weatherIcons = {
    0: "images/soleil.png",
    1: "images/nuages-et-soleil.png",
    2: "images/nuages-et-soleil.png",
    3: "images/nuage.png",
    45: "images/brouillard.png",
    48: "images/brouillard.png",
    51: "images/pluie.png",
    53: "images/pluie.png",
    55: "images/pluie.png",
    61: "images/pluie.png",
    63: "images/pluie.png",
    65: "images/pluie.png",
    71: "images/neige.png",
    73: "images/neige.png",
    75: "images/neige.png",
    80: "images/pluie.png",
    81: "images/pluie.png",
    82: "images/pluie.png",
    95: "images/orage.png",
};

const goodWeatherCodes = [0, 1, 2];

// SUGGESTIONS DE RECHERCHES

async function getSuggestions(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=fr`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erreur lors de la requête");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results.map(result => ({ label: [result.name, result.admin1, result.country].filter(Boolean).join(", "), name: result.name }));

        } else {
            return [];
        }

    } catch (error) {
        console.error(error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";

    for (const suggestion of suggestions) {
        const li = document.createElement("li");
        li.textContent = suggestion.label;
        li.addEventListener("click", () => {
            document.getElementById("research").value = suggestion.name;
            handleSearch();
            clearSuggestions();
        });
        suggestionsList.appendChild(li);
    }
}

const suggestionsInput = document.getElementById("research");
let debounceTimer;
let latestRequestId = 0;

suggestionsInput.addEventListener("input", function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async function() {
        const requestId = ++latestRequestId;
        const query = suggestionsInput.value.trim();

        if (query.length < 2) {
            displaySuggestions([]);
        } else {
            const suggestions = await getSuggestions(query);

            if (requestId === latestRequestId) {
                displaySuggestions(suggestions);
            }
        }
    }, 300);
})

function clearSuggestions() {
    clearTimeout(debounceTimer);
    displaySuggestions([]);
    latestRequestId++;
}

// COORDONNEES

async function getCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=fr`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erreur lors de la requête");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return { latitude: data.results[0].latitude, longitude: data.results[0].longitude};

        } else {
            throw new Error("Aucun résultat")
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

// METEO

async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error ("Erreur")
        }

        const data = await response.json();
        
        if (data.current) {
            return data.current;

        } else {
            throw new Error("Météo indisponible")
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

// PREVISIONS

async function getForecast(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error ("Erreur");
        }

        const data = await response.json();

        if (data.daily) {
            return data.daily;

        } else {
            throw new Error ("Prévisions indisponibles")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// RECHERCHE

async function handleSearch() {
    const city = document.getElementById("research").value.trim();

    if (city === "") {
        return
    }

    clearSuggestions();

    try {
        document.getElementById("description").textContent = "Chargement...";

        const coordinates = await getCoordinates(city);
        const weather = await getWeather(coordinates.latitude, coordinates.longitude);
        const forecast = await getForecast(coordinates.latitude, coordinates.longitude);

        document.getElementById("forecast-list").innerHTML = "";

        for (let i = 0; i < 7; i++) {
            const formattedDay = new Date(forecast.time[i]).toLocaleDateString("fr-FR", { weekday: "short" });
            const displayedDay = (i === 0) ? "Aujourd'hui" : formattedDay;

            const dayHTML = `
                <div class="forecast-day">
                    <p class="day-name">${displayedDay}</p>
                    
                    <div class="forecast-condition">
                        <img class="forecast-icon" src="${weatherIcons[forecast.weathercode[i]] || "images/nuage.png"}" alt="${weatherDescriptions[forecast.weathercode[i]] || "Conditions inconnues"}">
                        <p class="day-condition">${weatherDescriptions[forecast.weathercode[i]] || "Conditions inconnues"}</p>
                    </div>
                    
                    <div class="forecast-temps">
                        <p class="day-min">${forecast.temperature_2m_min[i]}°</p>
                        <p class="day-max">${forecast.temperature_2m_max[i]}°</p>
                    </div>    
                </div>
            `;

            document.getElementById("forecast-list").innerHTML += dayHTML;
        }

        const isGoodWeather = goodWeatherCodes.includes(weather.weathercode);

        if (isGoodWeather) {
            document.body.classList.remove("theme-gloomy");
        } else {
            document.body.classList.add("theme-gloomy");
        }

        document.getElementById("city").textContent = city;
        document.getElementById("description").textContent = weather.temperature_2m + "°C";
        document.getElementById("condition").textContent = weatherDescriptions[weather.weathercode] || "Conditions inconnues";
        document.getElementById("weather-icon").src = weatherIcons[weather.weathercode] || "images/nuage.png";
        document.getElementById("feels-like").textContent = weather.apparent_temperature + "°C";
        document.getElementById("wind").textContent = weather.wind_speed_10m + " km/h";
        document.getElementById("humidity").textContent = weather.relative_humidity_2m + "%";

        document.body.classList.add("has-result");

    } catch (error) {
        console.error(error);
        resetToHome();
        document.getElementById("description").textContent = error.message;
    }
}

function resetToHome() {
    document.getElementById("description").textContent = "Recherchez une ville pour afficher la météo";
    document.getElementById("city").textContent = "";
    document.getElementById("condition").textContent = "";
    document.getElementById("weather-icon").src = "images/nuage.png";
    document.getElementById("feels-like").textContent = "";
    document.getElementById("wind").textContent = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("forecast-list").innerHTML = "";
    document.body.classList.remove("theme-gloomy");
    document.body.classList.remove("has-result");
}

function emptyInput() {
    document.getElementById("research").value = "";
    clearSuggestions();
    resetToHome();
    document.querySelector(".input-wrapper").classList.remove("has-text");
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
document.getElementById("research").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});
document.getElementById("reset-btn").addEventListener("click", emptyInput);

const researchInput = document.getElementById("research");

researchInput.addEventListener("input", function() {
    if (researchInput.value === "") {
        document.querySelector(".input-wrapper").classList.remove("has-text");
    } else {
        document.querySelector(".input-wrapper").classList.add("has-text");
    }
});