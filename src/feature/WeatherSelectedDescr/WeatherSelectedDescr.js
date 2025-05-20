import React, {useContext, useEffect} from "react"
import { WeatherContext } from "../../App";
import './WeatherSelectedDescr.css'

function WeatherSelectedDescr({ day }) {
     const { weatherData, setWeatherData } = useContext(WeatherContext);
      useEffect(() => {
        //console.log(weatherData)
      }, [weatherData, setWeatherData]);

      //console.log("day в WeatherSelectedDescr:", day);

    return(<section className="weatherSelectedDescr">
        <div className="descr">
            <img className="imgWeatherSelectedDescr" alt="Изображение погоды" src={`https://openweathermap.org/img/wn/${day?.icon}@2x.png`}/>
            <p id="DescrSelected">{day?.descriptions}</p>
        </div>
    </section>)
}

export default WeatherSelectedDescr