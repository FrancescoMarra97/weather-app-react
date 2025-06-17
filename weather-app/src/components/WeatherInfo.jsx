import { Thermometer, Wind, Droplet, CloudSun } from 'lucide-react'


export default function WeatherInfo({ weather }) {
    if (!weather) return null

    return (
        <div className="weather-info">
            <h2>{weather.name}</h2>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            <p><Thermometer size={16} /> Temperatura: {weather.main.temp.toFixed(1)}°C</p>
            <p><CloudSun size={16} /> Condizioni: {weather.weather[0].description}</p>
            <p><Droplet size={16} /> Umidità: {weather.main.humidity}%</p>
            <p><Wind size={16} /> Vento: {weather.wind.speed.toFixed(1)} m/s</p>
        </div>
    )
}