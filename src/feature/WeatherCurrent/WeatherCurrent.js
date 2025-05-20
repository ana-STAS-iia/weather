import React, { useContext, useEffect } from "react";
import "./WeatherCurrent.css";
import { WeatherContext } from "../../App";

function WeatherCurrent() {
  const { weatherData, setWeatherData } = useContext(WeatherContext);
  useEffect(() => {
    //console.log(weatherData)
  }, [weatherData, setWeatherData]);
  console.log("wether", weatherData);

  function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) {
      return "Север";
    } else if (deg >= 22.5 && deg < 67.5) {
      return "Северо-Восток";
    } else if (deg >= 67.5 && deg < 112.5) {
      return "Восток";
    } else if (deg >= 112.5 && deg < 157.5) {
      return "Юго-Восток";
    } else if (deg >= 157.5 && deg < 202.5) {
      return "Юг";
    } else if (deg >= 202.5 && deg < 247.5) {
      return "Юго-Запад";
    } else if (deg >= 247.5 && deg < 292.5) {
      return "Запад";
    } else {
      return "Северо-Запад";
    }
  }

  return (
    <section className="weatherCurrent">
      <div className="weatherNow">
        <p id="temperatureNow">
          {weatherData?.temperature !== undefined
            ? `${weatherData.temperature}°`
            : "Загрузка..."}
        </p>
        <img
          id="imageWeatherNow"
          alt="Изображение погоды"
          src={
            weatherData?.iconUrl
              ? weatherData.iconUrl
              : `${process.env.PUBLIC_URL}/images/index.png`
          }
        />
      </div>
      <p id="feelsLike">
        ощущается как:{" "}
        {weatherData?.feelsLike !== undefined
          ? `${weatherData.feelsLike}°`
          : "Загрузка..."}
      </p>
      <p id="description">
        {weatherData?.description ? weatherData.description : "Загрузка..."}
      </p>
      <div className="windNow">
        <p id="windSpeed">
          ветер:{" "}
          {weatherData?.windSpeed !== undefined
            ? `${weatherData.windSpeed} м/с`
            : "Загрузка..."}
        </p>
        <p id="windDirection">
        {weatherData?.windDeg !== undefined
          ? getWindDirection(weatherData.windDeg)
          : "Загрузка..."}
      </p>
      </div>
    </section>
  );
}

export default WeatherCurrent;
