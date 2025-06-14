import { useState } from 'react'

import './App.css'

function App() {
const [city, setCity] = useState('')
const [weather, setWeather] = useState(null)

const apiKey= import.meta.env.VITE_API_KEY


const fetchWeather = async () => {
  if (!city) return;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Errore nella richiesta');
    }
    const data = await response.json();
    setWeather(data);
    setCity(''); // Pulisce il campo di input dopo la ricerca
    
  } catch (error) {
    console.error('Errore:', error);
  }
}
  return (
  <div className="app-container">
    <h1>Meteo</h1>
    <div className="input-group">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Inserisci una città"
      />
      <button onClick={fetchWeather}>Cerca</button>
    </div>

  {weather && (
  <div className="weather-info">
    <h2>{weather.name}</h2>
    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt={weather.weather[0].description}
    />
    <p>Temperatura: {weather.main.temp}°C</p>
    <p>Condizioni: {weather.weather[0].description}</p>
  </div>
)}
  </div>
)

}

export default App
