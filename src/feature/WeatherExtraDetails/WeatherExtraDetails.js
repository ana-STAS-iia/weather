import React, {useEffect, useContext} from "react"
import WeatherDetail from "../WeatherDetail/WeatherDetail"
import './WeatherExtraDetails.css'
import { WeatherContext } from "../../App";
import { FireRiskContext } from "../../context/FireContext";


function WeatherExtraDetails() {
    const {weatherData, setWeatherData} = useContext(WeatherContext);
        useEffect(() => {
    //console.log(weatherData)
    }, [weatherData, setWeatherData]);

    const { fireRiskLabel } = useContext(FireRiskContext);
    console.log("f", fireRiskLabel);

    const getCloudiness = (cloudiness) => {
        if (cloudiness <= 20) return "Ясно";
        if (cloudiness <= 50) return "Малооблачно";
        if (cloudiness <= 70) return "Переменная облачность";
        if (cloudiness <= 90) return "Облачно";
        return "Пасмурно";
    };

    const getMoonPhase = (date) => {
        const synodicMonth = 29.5305882; // Длина синодического месяца в днях
        const newMoonDate = new Date('2025-01-29'); // Дата известного новолуния
    
        const diffInDays = (date - newMoonDate) / (1000 * 60 * 60 * 24); //вычитания одной даты из другой и деления результата на количество миллисекунд в одном дне
        const daysSinceNewMoon = diffInDays % synodicMonth; //сколько дней прошло с последнего новолуния в текущем лунном цикле
    
        if (daysSinceNewMoon < 1.84566) {
            return 'Новолуние';
        } else if (daysSinceNewMoon < 5.53699) {
            return 'Растущий серп';
        } else if (daysSinceNewMoon < 9.22831) {
            return 'Первая четверть';
        } else if (daysSinceNewMoon < 12.91963) {
            return 'Растущая луна';
        } else if (daysSinceNewMoon < 16.61096) {
            return 'Полнолуние';
        } else if (daysSinceNewMoon < 20.30228) {
            return 'Убывающая луна';
        } else if (daysSinceNewMoon < 23.99361) {
            return 'Последняя четверть';
        } else {
            return 'Стареющий серп';
        }
    }

    const getVisibilityLevel = (visibility) => {
        if (visibility <= 100) return "Очень низкая";
        if (visibility <= 500) return "Низкая";
        if (visibility <= 2000) return "Средняя";
        if (visibility <= 5000) return "Хорошая";
        return "Отличная";
    };

    const weatherArray = [
  {
    type: "Влажность",
    value:
      weatherData?.humidity !== undefined
        ? `${weatherData.humidity}%`
        : "Загрузка...",
    icon: "dropWhite.png",
  },
  {
    type: "Индекс УФ",
    value:
      weatherData?.uvIndex !== undefined ? weatherData.uvIndex : "Загрузка...",
    icon: "index.png",
  },
  {
    type: "Почва",
    value:
      weatherData?.soilTempCelsius !== undefined
        ? `${weatherData.soilTempCelsius}°`
        : "Загрузка...",
    icon: "soil.png",
  },
  {
    type: "Давление, мм рт. ст.",
    value:
      weatherData?.pressure !== undefined ? weatherData.pressure : "Загрузка...",
    icon: "pressure.png",
  },
  {
    type: "Восход",
    value:
      weatherData?.sunrise !== undefined ? weatherData.sunrise : "Загрузка...",
    icon: "sunrise.png",
  },
  {
    type: "Заход",
    value:
      weatherData?.sunset !== undefined ? weatherData.sunset : "Загрузка...",
    icon: "sunset.png",
  },
  {
    type: `Облачность ${
      weatherData?.cloudiness !== undefined ? weatherData.cloudiness + "%" : "Загрузка..."
    }`,
    value:
      weatherData?.cloudiness !== undefined
        ? getCloudiness(weatherData.cloudiness)
        : "Загрузка...",
    icon: "cloud.png",
  },
  {
    type: "Фаза луны",
    value: weatherData ? getMoonPhase(new Date()) : "Загрузка...",
    icon: "moon.png",
  },
  {
    type: `Видимость ${
      weatherData?.visibility !== undefined
        ? (weatherData.visibility / 1000).toFixed(1) + " км"
        : "Загрузка..."
    }`,
    value:
      weatherData?.visibility !== undefined
        ? getVisibilityLevel(weatherData.visibility)
        : "Загрузка...",
    icon: "visibility.png",
  },
  { type: "Пожароопасность", value: `${(fireRiskLabel * 100).toFixed(0)}%`, icon: "fireWhite.png"}
];
    
    return (<section className="weatherExtraDetails">
        {weatherArray.map((detail, index) => (
            <WeatherDetail key={index} detail={detail}/>
        ))}
    </section>)
}

export default WeatherExtraDetails