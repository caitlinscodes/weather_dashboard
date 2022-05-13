// Global Variables
var searchHistory = JSON.parse(localStorage.getItem('history')) ?? []

$(document).ready(function () {
    var searchBtn = $('#citySearch');
    var apiKey = "fe26f57c2c8868b05e39afb09fead7ee";
    const prevList = document.getElementById("list")


    searchBtn.on("click", function (event) {
        event.preventDefault()
        var searchValue = $("#search").val()
        searchHistory.push(searchValue)
        localStorage.setItem("history", JSON.stringify(searchHistory))
        $("#currentWeather").empty()
        $("#fiveDayWeather").empty()
        getCurrentWeather(searchValue)

        searchHistory.forEach((item => {
            let history = document.createElement('li');
            history.textContent = `City: ${item}`;
            prevList.appendChild(history)
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
        let fiveDayData = await (await fetch(fiveDayUrl)).json()

        let cityName = data.name;
        let temp = data.main.temp;
        let wind = data.wind.speed;
        let humiditiy = data.main.humidity;
        let uvi = fiveDayData.daily[0].uvi

        let card = $("<div class='card'>");
        let cardHeader = $("<div class='card-header'>");
        let cardBody = $("<div class='card-body'>");
        let currentIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        let tempEl = $("<p class='card-text'>").text("Temperature: " + temp)
        let windEl = $("<p class='card-text'>").text("Wind Speed: " + wind + " MPH")
        let humidEl = $("<p class='card-text'>").text("Humidity: " + humiditiy + "%")
        let nameEl = $("<p class='card-title'>").text(cityName)
        let bgColor = "#CEBECF"
        if (uvi >= 6 && uvi <= 10) bgColor = "#D59A4B"
        if (uvi >= 11) bgColor = "#CD0CCF"
        let uviEl = $("<p class='card-text'>")
            .text(`UV Index: ${uvi}`)
            .css({
                "color": bgColor,
                "background-color": "#506B2C"
            })
        cardHeader.append(nameEl);
        cardBody.append(tempEl, windEl, humidEl, currentIcon, uviEl)
        card.append(cardHeader, cardBody)
        $("#currentWeather").append(card)

        fiveDayData.daily
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

