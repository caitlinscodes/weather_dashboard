// Global Variables
var searchHistory = JSON.parse(localStorage.getItem('history')) ?? []
var searchBtn = $('#locationSearch');
var apiKey = "fe26f57c2c8868b05e39afb09fead7ee";

// Main Function
$(document).ready(function () {
    const prevSearchList = document.getElementById("previous-search")

    // Search for City
    searchBtn.on("click", function (event) {
        event.preventDefault()

        var searchInput = $("#search").val()

        searchHistory.push(searchInput)
        localStorage.setItem("history", JSON.stringify(searchHistory))
        $("#currentWeather").empty()
        $("#fiveDayWeather").empty()
        getCurrentWeather(searchInput)

        searchHistory.forEach((item => {
            let history = document.createElement('li');
            history.textContent = `City: ${item}`;
            prevSearchList.appendChild(history)
        }))
    })

    // Get Current Weather & Five Day Forecast
    async function getCurrentWeather(searchInput) {
        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=imperial`;
        
        // Get Searched City Coordinates
        let data = await (await fetch(requestUrl)).json()
        const coord = {
            lat: data.coord.lat,
            lon: data.coord.lon
        };

        // API for Five Day Forecast
        const fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`
        let fiveDayData = await (await fetch(fiveDayUrl)).json()

        // Weather Data Variables
        let cityName = data.name;
        let temp = data.main.temp;
        let wind = data.wind.speed;
        let humiditiy = data.main.humidity;
        let uvi = fiveDayData.daily[0].uvi

        // Set Current Weather to Current Forecast
        let card = $("<div class='card'>");
        let cardHeader = $("<div>");
        let cardBody = $("<div>");
        let currentIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        let tempEl = $("<p>").text("Temperature: " + temp)
        let windEl = $("<p>").text("Wind Speed: " + wind + " mph")
        let humidEl = $("<p>").text("Humidity: " + humiditiy + "%")
        let nameEl = $("<p>").text(cityName)
        let bgColor = "#CEBECF"
        if (uvi >= 6 && uvi <= 10) bgColor = "#D59A4B"
        if (uvi >= 11) bgColor = "#CD0CCF"
        let uviEl = $("<p>")
            .text(`UV Index: ${uvi}`)
            .css({
                "color": bgColor,
                "background-color": "#506B2C"
            })
        cardHeader.append(nameEl);
        cardBody.append(tempEl, windEl, humidEl, currentIcon, uviEl)
        card.append(cardHeader, cardBody)
        $("#currentWeather").append(card)
        
        // Set Five Day Weather to Fivde Day Forecast
        fiveDayData.daily
            .slice(1, 6)
            .forEach((day) => {
                let temp = day.temp.day;
                let wind = day.wind_speed;
                let humiditiy = day.humidity;
                let date = new Date(day.dt * 1000)

                // Insert into index.html
                card = $("<div class='card'>");
                let cardBody = $("<div>");
                let icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`)
                let tempEl = $("<p>").text("Temperature: " + temp)
                let windEl = $("<p>").text("Wind Speed: " + wind + " mph")
                let humidEl = $("<p>").text("Humidity: " + humiditiy + "%")
                let dayEl = $("<p>").text(date.toLocaleDateString())
                cardBody.append(tempEl, windEl, humidEl, dayEl, icon)
                card.append(cardBody)
                $("#fiveDayWeather").append(card)
            })
    }
})

