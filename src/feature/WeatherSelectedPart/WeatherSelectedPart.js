import React, { useContext, useEffect } from "react";
import { WeatherContext } from "../../App";
import WeatherPart from "../WeatherPart/WeatherPart";
import "./WeatherSelectedPart.css";

function WeatherSelectedPart({ day }) {
  const { weatherData, setWeatherData } = useContext(WeatherContext);
  useEffect(() => {
    //console.log(weatherData)
  }, [weatherData, setWeatherData]);

  const selectedPartHours = [
    { type: "ночь", value: `${day.nightTemperature}°` },
    { type: "утро", value: `${day.mornTemperature}°` },
    { type: "день", value: `${day.dayTemperature}°` },
    { type: "вечер", value: `${day.eveTemperature}°` },
  ];

  //console.log("selectedPartHours", selectedPartHours);

  return (
    <section className="weatherSelectedPart">
      <div className="weatherHours">
        {selectedPartHours.map((detail, i) => (
          <WeatherPart key={i} detail={detail} />
        ))}
      </div>
    </section>
  );
}

export default WeatherSelectedPart;
