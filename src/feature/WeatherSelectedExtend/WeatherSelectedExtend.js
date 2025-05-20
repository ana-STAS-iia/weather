import React, { useContext, useState, useEffect } from "react";
import { WeatherContext } from "../../App";
import analysisConfig from "../../utils/analysisConfig.json";
import "./WeatherSelectedExtend.css";
import { FireRiskContext } from "../../context/FireContext";


function WeatherSelectedExtend({ day }) {
  const [weatherData, setWeatherData] = useState(null);
  const { setFireRiskLabel } = useContext(FireRiskContext);

  // Функция преобразования градусов ветра в направление
  function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "Север";
    else if (deg >= 22.5 && deg < 67.5) return "Северо-Восток";
    else if (deg >= 67.5 && deg < 112.5) return "Восток";
    else if (deg >= 112.5 && deg < 157.5) return "Юго-Восток";
    else if (deg >= 157.5 && deg < 202.5) return "Юг";
    else if (deg >= 202.5 && deg < 247.5) return "Юго-Запад";
    else if (deg >= 247.5 && deg < 292.5) return "Запад";
    else return "Северо-Запад";
  }

  // Функция для преобразования облачности в текстовое описание
  const getCloudiness = (cloudiness) => {
    if (cloudiness <= 20) return "Ясно";
    if (cloudiness <= 50) return "Малооблачно";
    if (cloudiness <= 70) return "Переменная облачность";
    if (cloudiness <= 90) return "Облачно";
    return "Пасмурно";
  };

  

  // Функция для линейного масштабирования (нечеткая функция принадлежности)
  const fuzzyMembership = (value, low, high) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 0;
    if (numericValue <= low) return 0;
    if (numericValue >= high) return 1;
    return (numericValue - low) / (high - low);
  };

  // Функция расчета пожароопасности
  // Обратите внимание, что осадки снега обрабатываются как дождь: мы суммируем значение дождя и снега.
  const calculateFireRisk = (temp, humidity, windSpeed, rain, snow) => {
    const tempRisk = fuzzyMembership(
      temp,
      analysisConfig.temperature.low,
      analysisConfig.temperature.high
    );
    const humidityRisk = 1 - fuzzyMembership(
      humidity,
      analysisConfig.humidity.low,
      analysisConfig.humidity.high
    );
    const windRisk = fuzzyMembership(
      windSpeed,
      analysisConfig.wind.low,
      analysisConfig.wind.high
    );
    // Суммируем осадки дождя и снега (если есть). Если значение отсутствует, берём 0.
    const totalPrecipitation =
      (parseFloat(rain) || 0) + (parseFloat(snow) || 0);
    const rainRisk = 1 - fuzzyMembership(
      totalPrecipitation,
      analysisConfig.rain.low,
      analysisConfig.rain.high
    );
    return (
      tempRisk * analysisConfig.weights.temperature +
      humidityRisk * analysisConfig.weights.humidity +
      windRisk * analysisConfig.weights.wind +
      rainRisk * analysisConfig.weights.rain
    );
  };

  // Рассчитываем риск пожара, используя данные объекта day.
  // Для осадков используем сумму day.rainDay и day.snowDay (если есть).
  
  const fireRiskValue = calculateFireRisk(
    day?.dayTemperature,
    day?.humidityDay,
    day?.windSpeedDay,
    day?.rainDay,
    day?.snowDay // Если имеется, осадки снега добавляются как дождь
  );
  const fireRiskLabel = fireRiskValue < 0.5 ? "Низкая пожароопасность" : "Высокая пожароопасность";
  //console.log("fireRiskLabel", fireRiskLabel);
  useEffect(() => {
  setFireRiskLabel(fireRiskValue); // Передаем числовое значение, а не строку
}, [fireRiskValue, setFireRiskLabel]);


  return (
      <div className="partOfExtend">
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Изображение давления"
          src={`${process.env.PUBLIC_URL}/images/pressureBlack.png`}
        />
        <p id="valueExtend">{day?.pressures} мм рт. ст.</p>
      </div>
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Изображение ветра"
          src={`${process.env.PUBLIC_URL}/images/wind.png`}
        />
        <p id="valueExtend">{day?.windSpeedDay} м/с</p>
        <p className="windDeg">{getWindDirection(day?.windDegDay)}</p>
      </div>
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Изображение влажности"
          src={`${process.env.PUBLIC_URL}/images/drop.png`}
        />
        <p id="valueExtend">{day?.humidityDay}%</p>
      </div>
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Облака"
          src={`${process.env.PUBLIC_URL}/images/cloudBlack.png`}
        />
        <p id="valueExtend">
          {day?.clouds}%, {getCloudiness(day?.clouds)}
        </p>
      </div>
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Изображение восхода"
          src={`${process.env.PUBLIC_URL}/images/sunriseBlack.png`}
        />
        <p id="valueExtend">{day?.sunriseLocal}</p>
      </div>
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Изображение заката"
          src={`${process.env.PUBLIC_URL}/images/sunsetBlack.png`}
        />
        <p id="valueExtend">{day?.sunsetLocal}</p>
      </div>
      {/* Блок, показывающий информацию о пожароопасности */}
      <div className="extendDiv">
        <img
          className="imgWeatherSelectedExtend"
          alt="Пожароопасность"
          src={`${process.env.PUBLIC_URL}/images/fire.png`}
        />
        <div>
          <p id="valueExtend">{fireRiskLabel}</p>
          <p style={{ fontSize: "0.8em" }}>
            Риск: {(fireRiskValue * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherSelectedExtend;
