import React, { useContext } from "react";
import { WeatherContext } from "../../App"; 
import './WeatherHour.css';

function WeatherHour({ detail }) {
  return (
    <section className="weatherHour">
      <p id="hour">{detail.type}</p>
      <p id="temperatureHour">{detail.value}</p>
      <img
        id="imageWeatherHour"
        alt={detail.type}
        src={`https://openweathermap.org/img/wn/${detail?.icon}@2x.png`}
      />
    </section>
  );
}

export default WeatherHour;