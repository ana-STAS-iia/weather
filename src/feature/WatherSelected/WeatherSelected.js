import React, { useContext, useEffect, useRef } from "react";
import WeatherSelectedPart from "../WeatherSelectedPart/WeatherSelectedPart";
import "./WeatherSelected.css";
import WeatherSelectedDescr from "../WeatherSelectedDescr/WeatherSelectedDescr";
import WeatherSelectedExtend from "../WeatherSelectedExtend/WeatherSelectedExtend";
import { WeatherContext } from "../../App";

function WeatherSelected() {
  const { weatherData, setWeatherData } = useContext(WeatherContext);
  useEffect(() => {
    //console.log(weatherData)
  }, [weatherData, setWeatherData]);

  const dayRefs = useRef([]);

  return (
    <section>
      <p id="dayOfWeek">{weatherData?.label?.data}</p>
      <section className="weatherSelected">
        {weatherData?.labels?.map((day, index) => (
          <div key={index} className="weatherSelectedDiv" ref={(el) => dayRefs.current[index] = el}>
            <div className="mainWeatherSelected">
              <p id="dayOfWeek">{day.date}</p>
              <WeatherSelectedDescr day={day} />
              <WeatherSelectedPart day={day} />
            </div>
            <WeatherSelectedExtend day={day} />
          </div>
        ))}
      </section>
    </section>
  );
}

export default WeatherSelected;
