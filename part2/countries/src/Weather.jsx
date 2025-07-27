import { useEffect } from "react";
import weatherService from './services/weather'
import { useState } from "react";
const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null);
    useEffect(() => {
        const getCurrentWeather = (lat, long) => {
            weatherService.getWeather(lat, long).then(data => {
                setWeather(data)
            })
        };
        getCurrentWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
    }, [])

    if (weather !== null) {
        return (
            <div>
                <h2>Weather in {country.name.common}</h2>
                <div>Temperature {weather.main.temp} Celsius</div>
                <img src={`https://openweathermap.org/img/wn/10d@2x.png`} alt="" />
                <div>Wind {weather.wind.speed} m/s</div>
            </div>
        )
    }
}

export default Weather;