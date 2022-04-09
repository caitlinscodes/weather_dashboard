// Global Variables
var searchBtn = document.getElementById("#searchBtn");
var searchInput = "";
var latitude = "";
var longitude = "";
var currentWeatherResults = document.getElementsByClassName(".search-results");

// Open Weather API Key: fe26f57c2c8868b05e39afb09fead7ee
// Geo-Coding API = http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={fe26f57c2c8868b05e39afb09fead7ee}
// Current Weather API = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=fe26f57c2c8868b05e39afb09fead7ee
// 5 Day API = api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt=5&appid=fe26f57c2c8868b05e39afb09fead7ee

// Global Functions
// document.getElementById("#searchBtn").addEventListener("click", myFunction);
$("#searchBtn").on("click", myFunction);



function myFunction(event){
  event.preventDefault();
  searchInput = $("#search-input").val();
  console.log(searchInput);

  citySearchConverter();
  currentWeatherApi();
};

// APIs
function citySearchConverter(){
  fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=fe26f57c2c8868b05e39afb09fead7ee")
  .then(function(response){
    return response.json()
  })
  .then( function(data){
    console.log(data)
    
    for (let i=0; i < data.length; i++){
      latitude = data[0].lat;
      longitude = data[0].lon;
      console.log(latitude, longitude);
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
    }


  })
  .catch(function(error){
    console.log(error)
  });
}

function currentWeatherApi(){
  latitude = JSON.parse(localStorage.getItem("latitude"));
  longitude = JSON.parse(localStorage.getItem("longitude", longitude));

  fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=fe26f57c2c8868b05e39afb09fead7ee")
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data)
        for (let i = 0; i < data.length; i++) {
          //Creating elements
          var cityName = document.createElement('h2');
          var date = document.createElement('<p>');
          var temp = document.createElement('<li>');
          var humidity = document.createElement('<li>');
          var windSpeed = document.createElement('li');
          // var uvIdx = document.createElement('<li>');
          console.log("elements created");


          //Setting the text of the elements.
          cityName.textContent = data[i].name;
          date.textContent = data[i].date; // This should us momentJS (?)
          temp.textContent = data[i].temp;
          humidity.textContent = data[i].humidity;
          windSpeed.textContent = data[i].speed;
          // uvIdx.textContent = data[i].
          console.log("data pulled");
          

          //Append to the html
          currentWeatherResults.append(cityName);
          currentWeatherResults.append(date);
          currentWeatherResults.append(temp);
          currentWeatherResults.append(humidity);
          currentWeatherResults.append(windSpeed);
          console.log("items appended");
    }
    // .catch(function(error){
    //   console.log(error)
    // });
  });


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
}
