import React, { useContext } from "react";
import { WeatherContext } from "../../App"; 
import './WeatherPart.css';


function WeatherPart({ detail }) {
    return (
        <section className="weatherPartHour">
          <p id="hourPart">{detail.type}</p>
          <p id="temperaturePartHour">{detail.value}</p>
        </section>
      );
}

export default WeatherPart;