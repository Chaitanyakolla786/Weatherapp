// App.js
import React, { useState } from 'react';
import WeatherService from './WeatherService';
import './App.css';

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
      <div class="mainDiv">
        <div class="childDiv"><h1>Weather in your city</h1></div>
      <div class="childDiv">
          <input
            type="text"
            placeholder="Enter city name"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
          />
          <button onClick={fetchWeatherData}>? Search</button>
          
      </div>
      </div>
      {error && <div>{error}</div>}
      {weatherData && (
        <div class="dataDiv">
          {weatherData.map((dayData, index) => (
            <table key={index}>
              <tr><th colspan="2" class="dateCol">Date: {new Date(dayData[0].dt_txt).toLocaleDateString()}</th></tr>
              <tr><th colspan="2" class="subData">Temperature</th></tr>
              <tr class="subData"><td>Min</td><td>Max</td></tr> 
              <tr class="subData"> 
                  <td>{dayData[0].main.temp_min}°C</td> 
                  <td>{dayData[0].main.temp_max}°C</td> 
              </tr> 
              <tr> 
                  <td>Pressure</td> 
                  <td>{dayData[0].main.pressure}</td> 
              </tr> 
              <tr> 
                  <td>Humidity</td> 
                  <td> {dayData[0].main.humidity}</td> 
              </tr> 
            </table>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;