// App.js
import React, { useState } from 'react';
import WeatherService from './WeatherService';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <main>
      <header>
        <div class="header-content">
            <h1>Weather in your city  </h1>
            <div class="input-button-group">
            <input
            type="text"
            placeholder="Enter location"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
          />
                <button onClick={fetchWeatherData}><span class="button-q">?</span> Search</button>
            </div>
        </div>
    </header>


      {error && <div>{error}</div>}
      {weatherData && (
       <div class="row parentDiv">
          {weatherData.map((dayData, index) => (
               <div class="col-12 col-md-2 mb-3">
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;