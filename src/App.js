// App.js
import React, { useState } from 'react';
import WeatherService from './WeatherService';

function App() {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = () => {
    if (cityName) {
      WeatherService.getWeatherForecastByCityName(cityName)
        .then(data => {
          if (data) {
            const nextFiveDaysData = filterNextFiveDaysData(data.list);
            setWeatherData(nextFiveDaysData);
            setError(null);
          } else {
            setError('No data found for the specified city.');
            setWeatherData(null);
          }
        })
        .catch(error => {
          setError('Error fetching weather data. Please try again later.');
          setWeatherData(null);
        });
    }
  };

  const filterNextFiveDaysData = (forecastList) => {
    const currentDate = new Date();
    const nextFiveDays = [];
    const filteredData = [];
    let currentDay = [];
    for (let forecast of forecastList) {
      const forecastDate = new Date(forecast.dt_txt);
      if (forecastDate.getDate() !== currentDate.getDate()) {
        if (currentDay.length > 0) {
          filteredData.push(currentDay);
        }
        if (filteredData.length >= 5) {
          break;
        }
        currentDay = [forecast];
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      } else {
        currentDay.push(forecast);
      }
    }
    return filteredData;
  };

  return (
    <div>
      <h1>Weather Forecast</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={cityName}
        onChange={(event) => setCityName(event.target.value)}
      />
      <button onClick={fetchWeatherData}>Get Weather Data</button>
      {error && <div>{error}</div>}
      {weatherData && (
        <div>
          {weatherData.map((dayData, index) => (
            <div key={index}>
              <h2>Date: {new Date(dayData[0].dt_txt).toLocaleDateString()}</h2>
              <p>
                Min Temperature: {dayData[0].main.temp_min}°C, Max Temperature: {dayData[0].main.temp_max}°C
              </p>
              <p>Pressure: {dayData[0].main.pressure}</p>
              <p>Humidity: {dayData[0].main.humidity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
