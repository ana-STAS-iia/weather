import React, { useEffect, useRef, useContext } from "react";
import Chart from "chart.js/auto";
import { WeatherContext } from "../../App";
import "./Graph.css";

function Graph() {
  const { weatherData } = useContext(WeatherContext);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvasRef.current || !weatherData?.labels) return; // ✅ Проверка наличия данных перед созданием графика

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: weatherData.labels.map((label) => label.date) || [], // ✅ Исправленный доступ к `date`
        datasets: [
          {
            label: "Температура днём (°C)",
            data: weatherData?.dayTemperatures || [],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: "Температура ночью (°C)",
            data: weatherData?.nightTemperatures || [],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        scales: {
          x: {
            ticks: {
              callback: (value, index) => {
                const label = weatherData?.labels?.[index]; // ✅ Добавил проверку `?.`
                return label?.date || "";
              },
            },
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const datasetLabel = context.dataset.label || "";
              const value = context.raw;
              return `${datasetLabel}: ${value}°C`; // ✅ Форматирование всплывающего окна
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [weatherData]);

  const scrollToDay = (index) => {
    const dayElement = document.querySelectorAll(".weatherSelectedDiv")[index];
    if (dayElement) {
      dayElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="graph">
      <canvas ref={canvasRef}></canvas>
      <div className="weatherIcons">
        {weatherData?.labels?.map((label, index) => (
          <img
            src={`http://openweathermap.org/img/wn/${label.icon}.png`}
            alt="Погода"
            className="weatherIcon"
            onClick={() => scrollToDay(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Graph;
