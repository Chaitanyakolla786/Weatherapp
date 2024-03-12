import axios from 'axios';

const API_KEY = '1635890035cbba097fd5c26c8ea672a1';

const WeatherService = {
  getWeatherForecastByCityName: async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return null;
    }
  }
};

export default WeatherService;
