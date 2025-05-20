import React from "react"
import WeatherCurrent from "../WeatherCurrent/WeatherCurrent"
import WeatherHourly from "../WeatherHourly/WeatherHourly"
import WeatherExtraDetails from "../WeatherExtraDetails/WeatherExtraDetails"
import Search from "../Search/Search"
import './MainWeatherComponent.css'
import Graph from "../Graph/Graph"
import WeatherSelected from "../WatherSelected/WeatherSelected"


/*<Search />*/
function MainWeatherComponent() {
    return (
    <div className="mainSection">
        <section className="mainWeatherComponent">
            <Search />
            <div className="allWeather"> 
                <div className="basicWeather">
                    <WeatherCurrent />
                    <WeatherHourly />
                </div>
                <WeatherExtraDetails />
            </div>
        </section>
        <Graph />
        <section>
            <p className="forecast">Прогноз погоды на 7 дней</p>
            <WeatherSelected />
        </section>

    </div>    
    )
}

export default MainWeatherComponent