// Global Variables
var searchHistory = JSON.parse(localStorage.getItem('history')) ?? []
$(document).ready(function () {
    var searchBtn = $('#citySearch');
    var apiKey = "fe26f57c2c8868b05e39afb09fead7ee";
    const prevList = document.getElementById("list")


    searchBtn.on("click", function (e) {
        e.preventDefault()
        var searchValue = $("#search").val()
        searchHistory.push(searchValue)
        localStorage.setItem("history", JSON.stringify(searchHistory))
        $("#currentWeather").empty()
        $("#fiveDayWeather").empty()
        getCurrentWeather(searchValue)

        searchHistory.forEach((item => {
            //console.log(searchHistory)
            let historyList = document.createElement('li');
            historyList.textContent = `City: ${item}`;
            prevList.appendChild(historyList)
        }))
    })

    async function getCurrentWeather(searchValue) {
        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}&units=imperial`;
        console.log('requestUrl', requestUrl)
        let data = await (await fetch(requestUrl)).json()
        const coords = {
            lat: data.coord.lat,
            lon: data.coord.lon
        };

        const fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`
        let data5Day = await (await fetch(fiveDayUrl)).json()

        console.log("data from api", data)

        let cityName = data.name;
        let temp = data.main.temp;
        let wind = data.wind.speed;
        let humiditiy = data.main.humidity;
        let uvi = data5Day.daily[0].uvi

        let card = $("<div class='card'>");
        let cardHeader = $("<div class='card-header'>");
        let cardBody = $("<div class='card-body'>");
        let currentIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        let tempEl = $("<p class='card-text'>").text("Temperature: " + temp)
        let windEl = $("<p class='card-text'>").text("Wind Speed: " + wind + " MPH")
        let humidEl = $("<p class='card-text'>").text("Humidity: " + humiditiy + "%")
        let nameEl = $("<p class='card-title'>").text(cityName)
        let bgColor = "green"
        if (uvi >= 6 && uvi <= 10) bgColor = "yellow"
        if (uvi >= 11) bgColor = "red"
        let uviEl = $("<p class='card-text'>")
            .text(`UV Index: ${uvi}`)
            .css({
                "color": bgColor,
                "background-color": "black"
            })
        cardHeader.append(nameEl);
        cardBody.append(tempEl, windEl, humidEl, currentIcon, uviEl)
        card.append(cardHeader, cardBody)
        $("#currentWeather").append(card)
        console.log("FIVEDAY DATA", data)

        data5Day.daily
            .slice(1, 6)
            .forEach((day) => {
                let temp = day.temp.day;
                let wind = day.wind_speed;
                let humiditiy = day.humidity;
                let date = new Date(day.dt * 1000)
                card = $("<div class='card'>");
                let cardHeader = $("<div class='card-header'>");
                let cardBody = $("<div class='card-body'>");
                let icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`)
                let tempEl = $("<p class='card-text'>").text("Temperature: " + temp)
                let windEl = $("<p class='card-text'>").text("Wind Speed: " + wind + " MPH")
                let humidEl = $("<p class='card-text'>").text("Humidity: " + humiditiy + "%")
                let dayEl = $("<p class='card-text'>").text(date.toLocaleDateString())
                cardBody.append(tempEl, windEl, humidEl, dayEl, icon)
                card.append(cardBody)
                $("#fiveDayWeather").append(card)
            })
    }
})




// Old Code
// var searchInput = "";
// var latitude = "";
// var longitude = "";
// var currentWeatherResults = document.getElementsByClassName(".search-results");

// // Open Weather API Key: fe26f57c2c8868b05e39afb09fead7ee
// // Geo-Coding API = http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={fe26f57c2c8868b05e39afb09fead7ee}
// // Current Weather API = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=fe26f57c2c8868b05e39afb09fead7ee
// // 5 Day API = api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt=5&appid=fe26f57c2c8868b05e39afb09fead7ee

// // Global Functions
// // document.getElementById("#searchBtn").addEventListener("click", myFunction);
// $("#searchBtn").on("click", myFunction);



// function myFunction(event){
//   event.preventDefault();
//   searchInput = $("#search-input").val();
//   console.log(searchInput);

//   citySearchConverter();
//   currentWeatherApi();
// };

// // APIs
// function citySearchConverter(){
//   fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=fe26f57c2c8868b05e39afb09fead7ee")
//   .then(function(response){
//     return response.json()
//   })
//   .then( function(data){
//     console.log(data)
    
//     for (let i=0; i < data.length; i++){
//       latitude = data[0].lat;
//       longitude = data[0].lon;
//       console.log(latitude, longitude);
//       localStorage.setItem("latitude", latitude);
//       localStorage.setItem("longitude", longitude);
//     }


//   })
//   .catch(function(error){
//     console.log(error)
//   });
// }

// function currentWeatherApi(){
//   latitude = JSON.parse(localStorage.getItem("latitude"));
//   longitude = JSON.parse(localStorage.getItem("longitude", longitude));

//   fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=fe26f57c2c8868b05e39afb09fead7ee")
//     .then(function(response){
//       return response.json()
//     })
//     .then(function(data){
//       console.log(data)
//         for (let i = 0; i < data.length; i++) {
//           //Creating elements
//           var cityName = document.createElement('h2');
//           var date = document.createElement('<p>');
//           var temp = document.createElement('<li>');
//           var humidity = document.createElement('<li>');
//           var windSpeed = document.createElement('li');
//           // var uvIdx = document.createElement('<li>');
//           console.log("elements created");


//           //Setting the text of the elements.
//           cityName.textContent = data[i].name;
//           date.textContent = data[i].date; // This should us momentJS (?)
//           temp.textContent = data[i].temp;
//           humidity.textContent = data[i].humidity;
//           windSpeed.textContent = data[i].speed;
//           // uvIdx.textContent = data[i].
//           console.log("data pulled");
          

//           //Append to the html
//           currentWeatherResults.append(cityName);
//           currentWeatherResults.append(date);
//           currentWeatherResults.append(temp);
//           currentWeatherResults.append(humidity);
//           currentWeatherResults.append(windSpeed);
//           console.log("items appended");
//     }
//     // .catch(function(error){
//     //   console.log(error)
//     // });
//   });


//currently broken - Need another API key?
// function fiveDayWeatherApi(){
//   fetch("https://api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=5&appid=fe26f57c2c8868b05e39afb09fead7ee")
//     .then(function(response){
//       return response.json();
//     })
//     .then( function(data){
//       console.log(data)
//     })
//     .catch(function(error){
//       console.log(error)
//     });
// }

//User can search for a city




//User is presented with current weather conditions


  // Current weather view includes; City Name, Date (momentjs?), icon representing weather, temperature, humidity, wind speed, and UV index.


  // When user views the UV index they are presented with a color that indicates if conditions are favorable, moderate, or severe.


//User is also presented with 5 day forecast


  // Display includes; date, weather conditions icon, temperature, wind speed, and humidity.


//City is saved in local storage and can be referenced in sidebar


  //When user selects city from search history they can view the information again.

