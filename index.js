const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessCont = document.querySelector(".grant-location-container");
const weatherInfo = document.querySelector(".weather-info-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingContainer = document.querySelector(".loading-container");
const errorContainer = document.querySelector(".erorr-container");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

getFromSessionStorage();

// errorContainer.classList.add("active");

currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    errorContainer.classList.remove("active");

    if(clickedTab == currentTab) return;

    //to change background color of clicked tab through CSS class
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    //to show the element in clicked tab

    if(!searchForm.classList.contains("active")){
        // errorContainer.classList.remove("active");
        grantAccessCont.classList.remove("active");
        weatherInfo.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // errorContainer.classList.remove("active");
        searchForm.classList.remove("active");
        weatherInfo.classList.remove("active");
        getFromSessionStorage();
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(setCoordinate);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function setCoordinate(position){
    const userCoordinates={
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-Coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInformation(userCoordinates);
}

function getFromSessionStorage(){
    const localCoord = sessionStorage.getItem("user-Coordinates");

    if(!localCoord){
        grantAccessCont.classList.add("active");
    }
    else{
        const Coordinates = JSON.parse(localCoord);
        fetchUserWeatherInformation(Coordinates); 
    }
}

async function fetchUserWeatherInformation(Coordinates){

    let {lat , lon} = Coordinates;

    grantAccessCont.classList.remove("active");
    loadingContainer.classList.add("active");

    try{
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        let data = await response.json();

        loadingContainer.classList.remove("active");
        weatherInfo.classList.add("active");
        renderUserWeatherInfo(data);
    }
    catch(e){
        loadingContainer.classList.remove("active");
        console.log("Error Found ---> " , e);
    }
    
}

async function fetchSearchWeatherInformation(city){
    grantAccessCont.classList.remove("active");
    weatherInfo.classList.remove("active");
    errorContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    
    try{
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        let data = await response.json();
        loadingContainer.classList.remove("active");
        weatherInfo.classList.add("active");
        renderUserWeatherInfo(data);
    }
    catch(e){
        // errorContainer.classList.add("active");
    }
}

function renderUserWeatherInfo(weatherInfo){
    let cityName = document.querySelector("[data-cityName]");
    let countryIcon = document.querySelector("[data-countryIcon]");
    let weatherDesc = document.querySelector("[data-weatherDesc]");
    let weatherIcon = document.querySelector("[data-weatherIcon]");
    let temp = document.querySelector("[data-temp]");
    let windspeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let cloudiness = document.querySelector("[data-cloudiness]");

    if(weatherInfo?.name === undefined){
        const weatherInfoContainer = document.querySelector(".weather-info-container");


        weatherInfoContainer.classList.remove("active");
        errorContainer.classList.add("active");
        return;
    }

    cityName.innerText = weatherInfo?.name ;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");

grantAccessBtn.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else{
        fetchSearchWeatherInformation(cityName);
    }
})