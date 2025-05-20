import React from "react"
import './WeatherDetail.css'

function WeatherDetail({ detail }) {
    //console.dir(detail);
    return (<section className="weatherDetail">
        <div className="information">
            <img id="imageWeatherDetail" alt={detail.type} src={`${process.env.PUBLIC_URL}/images/${detail.icon}`} />
            <p id="weatherValue" >{detail.value !== undefined ? detail.value : "Loading..."}</p>
        </div>
        <p className="weatherType">{detail.type}</p>
    </section>)
}

export default WeatherDetail