import axios from "axios";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const getWeather = (lat, long) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching weather data:', error);
            throw error;
        });
}
export default { getWeather };