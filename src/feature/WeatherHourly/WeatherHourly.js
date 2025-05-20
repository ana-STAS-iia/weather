import React, {useEffect, useContext} from "react"
import WeatherHour from "../WeatherHour/WeatherHour"
import './WeatherHourly.css'
import { WeatherContext } from "../../App";

function WeatherHourly() {
    const {weatherData, setWeatherData} = useContext(WeatherContext);
        useEffect(() => {
    //console.log(weatherData)
    }, [weatherData, setWeatherData]);

    const hoursArray = [
  {
    type: "Ночь",
    value:
      weatherData?.nightTemp !== undefined
        ? `${weatherData.nightTemp}°`
        : "Загрузка...",
    icon: weatherData?.nightIcon?.weather[0]?.icon,
  },
  {
    type: "Утро",
    value:
      weatherData?.morningTemp !== undefined
        ? `${weatherData.morningTemp}°`
        : "Загрузка...",
    icon: weatherData?.morningIcon?.weather[0]?.icon,
  },
  {
    type: "День",
    value:
      weatherData?.dayTemp !== undefined
        ? `${weatherData.dayTemp}°`
        : "Загрузка...",
    icon: weatherData?.dayIcon?.weather[0]?.icon,
  },
  {
    type: "Вечер",
    value:
      weatherData?.eveningTemp !== undefined
        ? `${weatherData.eveningTemp}°`
        : "Загрузка...",
    icon: weatherData?.eveningIcon?.weather[0]?.icon,
  },
];

    
    //console.log("hoursArray", hoursArray);

    return (<section className="weatherHourly">
        {hoursArray.map((detail, index) => (
            <WeatherHour key={index} detail={detail} />
        ))}
    </section>)
}

export default WeatherHourly