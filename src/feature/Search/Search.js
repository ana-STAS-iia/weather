import React, { useState, useContext, useEffect } from "react";
import { apiKey, soilApiKey } from "../..";
import { WeatherContext } from "../../App";
import "./Search.css";
import moment from "moment-timezone";
import "moment/locale/ru";
import * as dayjs from "dayjs";

function Search({}) {
  const { weatherData, setWeatherData } = useContext(WeatherContext);
  const [searchQuery, setSearchQuery] = useState("Москва"); // Москва по умолчанию
  const [formattedDate, setFormattedDate] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  //const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getWeather("Москва"); // Загружаем Москву по умолчанию

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });
          getCityFromCoordinates(lat, lon);
        },
        () => {
          console.log("Геолокация отключена. Используется Москва.");
          setCoordinates({ lat: 55.7558, lon: 37.6173 });
          getWeather("Москва");
        }
      );
    }
  }, []);

  //Геолокация
  function getCityFromCoordinates(lat, lon) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}&lang=ru`;

    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const cityName = data[0].local_names?.ru || data[0].name;
          setSearchQuery(cityName); // Название города
          getWeather(cityName); // Загружаем погоду
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении города:", error);
        getWeather("Москва"); // Если ошибка — загружаем Москву
      });
  }

  useEffect(() => {
    if (coordinates.lat) {
      const start = dayjs().startOf("d").unix();
      const foo = `https://history.openweathermap.org/data/2.5/history/city?lat=${coordinates.lat}&lon=${coordinates.lon}&start=${start}&units=metric&appid=${apiKey}&lang=ru`;
      const bar = `https://api.openweathermap.org/data/2.5/forecast/hourly?q=${searchQuery}&cnt=48&appid=${apiKey}&units=metric&lang=ru`;

      fetch(bar)
        .then((response) => response.json())
        .then((forecast) => {
          fetch(foo)
            .then((response) => response.json())
            .then((history) => {
              const nightIcon =
                history.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 0 &&
                    new Date(_.dt * 1000).getHours() <= 6
                  );
                }) ??
                forecast.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 0 &&
                    new Date(_.dt * 1000).getHours() <= 6
                  );
                });

              const morningIcon =
                history.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 6 &&
                    new Date(_.dt * 1000).getHours() <= 12
                  );
                }) ??
                forecast.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 6 &&
                    new Date(_.dt * 1000).getHours() <= 12
                  );
                });

              const dayIcon =
                history.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 12 &&
                    new Date(_.dt * 1000).getHours() <= 18
                  );
                }) ??
                forecast.list.find((_) => {
                  return (
                    new Date(_.dt * 1000).getHours() > 12 &&
                    new Date(_.dt * 1000).getHours() <= 18
                  );
                });

              const eveningIcon =
                history.list.find(
                  (_) => new Date(_.dt * 1000).getHours() > 18
                ) ??
                forecast.list.find(
                  (_) => new Date(_.dt * 1000).getHours() > 18
                );

              console.dir(eveningIcon);

              setWeatherData((prevState) => ({
                ...prevState,
                dayIcon,
                nightIcon,
                morningIcon,
                eveningIcon,
              }));
            });
        });
    }
  }, [coordinates]);

  const getWeather = (city) => {
    if (!navigator.onLine) {
    alert("Проблема с подключением к сети. Проверьте интернет и попробуйте снова.");
    return Promise.reject("Нет соединения");
  }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${apiKey}`;
    const graphUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${apiKey}&units=metric&lang=ru`;
    const pastUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?q=${city}&dt=1745780400&appid=${apiKey}`;

    return fetch(url) // Важно: теперь fetch возвращает Promise
    .then((response) => {
      if (!response.ok) {
        throw new Error("Город не найден");
      }
      return response.json();
    })
      .then((data) => {
        const timezoneOffset = data.timezone / 3600;
        const localSunrise = moment
          .utc(data.sys.sunrise * 1000)
          .utcOffset(timezoneOffset)
          .format("HH:mm");
        const localSunset = moment
          .utc(data.sys.sunset * 1000)
          .utcOffset(timezoneOffset)
          .format("HH:mm");

        const weather = {
          temperature: data.main.temp.toFixed(0),
          feelsLike: data.main.feels_like.toFixed(0),
          windSpeed: data.wind.speed.toFixed(0),
          windDeg: data.wind.deg,
          humidity: data.main.humidity,
          iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          description: data.weather[0].description,
          pressure: (data.main.pressure * 0.75006).toFixed(0),
          sunrise: localSunrise,
          sunset: localSunset,
          cloudiness: data.clouds.all,
          visibility: data.visibility,
        };
        setCoordinates({ lat: data.coord.lat, lon: data.coord.lon });
        setWeatherData(weather);
        getUVIndex(data.coord.lat, data.coord.lon, setWeatherData);
        getSoilTemperature(data.coord.lat, data.coord.lon, setWeatherData);
        //getNightWeather(data.coord.lat, data.coord.lon, setWeatherData)
        

        //Дата на сегодня
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        )
          .then((response) => response.json())
          .then((data) => {
            const timezoneOffset = data.timezone / 3600; // Сдвиг в часах
            moment.locale("ru");
            const localTime = moment
              .utc()
              .utcOffset(timezoneOffset)
              .format("dddd, D MMMM YYYY, HH:mm"); // Локальное время
            setFormattedDate(localTime); // Сохраняем в состояние
          })
          .catch((error) => console.error("Ошибка получения данных:", error));

        //График
        fetch(graphUrl)
          .then((response) => response.json())
          .then((data) => {
            const labels = data.list.map((item) => ({
              date: new Date(item.dt * 1000).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
              }),
              icon: item.weather[0].icon,
              descriptions: item.weather[0].description,
              nightTemperature: item.temp.night.toFixed(0),
              mornTemperature: item.temp.morn.toFixed(0),
              dayTemperature: item.temp.day.toFixed(0),
              eveTemperature: item.temp.eve.toFixed(0),
              pressures: (item.pressure * 0.75006).toFixed(0),
              windDegDay: item.deg,
              windSpeedDay: item.speed.toFixed(0),
              humidityDay: item.humidity,
              clouds: item.clouds,
              precipitationRain: item.rain,
              precipitationSnow: item.snow,
              sunriseLocal: moment
                .unix(item.sunrise)
                .utcOffset(data.city.timezone / 60)
                .format("HH:mm"),
              sunsetLocal: moment
                .unix(item.sunset)
                .utcOffset(data.city.timezone / 60)
                .format("HH:mm"),
            }));

            const mornTemperatures = data.list.map((item) =>
              item.temp.morn.toFixed(0)
            );
            const dayTemperatures = data.list.map((item) =>
              item.temp.day.toFixed(0)
            );
            const eveTemperatures = data.list.map((item) =>
              item.temp.eve.toFixed(0)
            );
            const nightTemperatures = data.list.map((item) =>
              item.temp.night.toFixed(0)
            );

            setWeatherData((prevState) => ({
              ...prevState,
              labels,
              dayTemperatures,
              nightTemperatures,
            }));
          })
          .catch((error) =>
            console.error("Ошибка получения данных для графика:", error)
          );

        //Нормальная температура в течении дня, но нет иконок
        fetch(graphUrl)
          .then((response) => response.json())
          .then((data) => {
            // Получаем дату первого элемента
            const firstDayDate = new Date(
              data.list[0].dt * 1000
            ).toLocaleDateString();

            const firstDayData = data.list.filter(
              (item) =>
                new Date(item.dt * 1000).toLocaleDateString() === firstDayDate
            );

            const nightTemp = firstDayData.map((item) =>
              item.temp.night.toFixed(0)
            );
            const morningTemp = firstDayData.map((item) =>
              item.temp.morn.toFixed(0)
            );
            const dayTemp = firstDayData.map((item) =>
              item.temp.day.toFixed(0)
            );
            const eveningTemp = firstDayData.map((item) =>
              item.temp.eve.toFixed(0)
            );

            console.log("Только за первый день:", firstDayData);
            console.log("ночь", nightTemp);
            console.log("утро", morningTemp);
            console.log("день", dayTemp);
            console.log("вечер", eveningTemp);

            setWeatherData((prevState) => ({
              ...prevState,
              dayTemp,
              nightTemp,
              morningTemp,
              eveningTemp,
            }));
          })
          .catch((error) => console.error("Ошибка получения данных", error));

        fetch(forecastUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Ошибка: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Данные:", data);
          })
          .catch((error) => {
            console.error("Ошибка получения данных:", error);
          });
          return data;
      })
      .catch((error) => {
      if (error.message === "Город не найден") {
        alert("Город не найден. Попробуйте другой запрос.");
      } else {
        alert("Ошибка сети. Проверьте подключение к интернету.");
      }
      console.error("Ошибка получения данных:", error);
    });
    
  };

  //Уф излучение
  function getUVIndex(lat, lon, setWeatherData) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(uvUrl)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData((prevState) => ({
          ...prevState,
          uvIndex: data.value.toFixed(0), // Добавляем УФ-индекс в weatherData
        }));
      })
      .catch((error) => console.error("Ошибка получения УФ-индекса:", error));
  }

  //Температура почвы
  function getSoilTemperature(lat, lon, setWeatherData) {
    const soilTempUrl = `https://api.agromonitoring.com/agro/1.0/soil?lat=${lat}&lon=${lon}&appid=${soilApiKey}`;

    fetch(soilTempUrl)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData((prevState) => ({
          ...prevState,
          soilTempCelsius: (data.t10 - 273.15).toFixed(0),
        }));
      })
      .catch((error) => console.error("Ошибка получения УФ-индекса:", error));
  }

  const handleClick = () => {
  if (!searchQuery.trim()) {
    alert("Введите корректное название города");
    return;
  }

  getWeather(searchQuery)
    .catch(() => alert("Город не найден. Попробуйте другой запрос."));
};

  const handleChangeInput = (event) => {
    setSearchQuery(event.target.value);
  };
 const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    if (!searchQuery.trim()) {
      alert("Введите корректное название города");
      return;
    }

    getWeather(searchQuery)
      .catch(() => alert("Город не найден. Попробуйте другой запрос."));
  }
};


  return (
    <section className="search">
      <div className="inputImage">
        <img
          className="imageGeo"
          alt="Изображение погоды"
          src={`${process.env.PUBLIC_URL}/images/geo.png`}
        />
        <div className="searchInputWrapper">
          <input
            className="searchInput"
            type="search"
            value={searchQuery}
            onChange={handleChangeInput}
            onKeyDown={handleKeyPress}
          ></input>
          <button className="buttonSearch" onClick={handleClick}></button>
        </div>
      </div>
      <p id="data">Сегодня {formattedDate}</p>
    </section>
  );
}

export default Search;
