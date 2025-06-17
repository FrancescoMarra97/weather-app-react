import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [forecast, setForecast] = useState(null)

  const dailyForecast = forecast?.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  const apiKey = import.meta.env.VITE_API_KEY

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    console.log('Caricata history da localStorage:', storedHistory);
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=it`;
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);


      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Città non trovata o errore nella richiesta');
      }
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setForecast(forecastData);
      setWeather(weatherData);
      setCity(''); // Pulisce il campo di input dopo la ricerca
      setError(null);

      setSearchHistory(prevHistory => {
        if (!city || city.trim() === '') return prevHistory; // esce se city è vuota o solo spazi

        const cityLower = city.toLowerCase();
        const filtered = prevHistory.filter(c => c.toLowerCase() !== cityLower);
        const newHistory = [city, ...filtered].slice(0, 20);
        return newHistory;
      });


    } catch (error) {
      console.error('Errore:', error);
      setError(error);
      setWeather(null); // Resetta le informazioni meteo in caso di errore
    }
  }

  const fetchWeatherFromHistory = async (selectedCity) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric&lang=it`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Errore nella richiesta');
      const data = await response.json();
      setWeather(data);
      setError(null);

      // Aggiorna lo storico anche quando clicchi da lì
      setSearchHistory((prevHistory) => {
        const lowerCity = selectedCity.toLowerCase();
        const filtered = prevHistory.filter(
          (c) => c.toLowerCase() !== lowerCity
        );
        return [selectedCity, ...filtered].slice(0, 5);
      });

      setCity(selectedCity);
    } catch (error) {
      console.error(error);
      setError(error);
      setWeather(null);
    }
  };

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
          <p>Temperatura: {weather.main.temp.toFixed(1)}°C</p>
          <p>Condizioni: {weather.weather[0].description}</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error.message}</p>
        </div>
      )}

      {forecast && (
        <div className="forecast-3h">
          <h3>Andamento ogni 3 ore</h3>
          <div className="forecast-grid">
            {forecast.list.slice(0, 8).map((item, index) => (
              <div key={index} className="forecast-card">
                <p>{item.dt_txt.slice(11, 16)}</p>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
                <p>{item.main.temp.toFixed(1)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyForecast && (
        <div className="forecast-daily">
          <h3>Previsioni prossimi giorni</h3>
          <div className="forecast-grid">
            {dailyForecast.map((item, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(item.dt_txt).toLocaleDateString('it-IT', { weekday: 'long' })}</p>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
                <p>{item.main.temp.toFixed(1)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {searchHistory.length > 0 && (
        <div className="mt-3">
          <h5>Ricerche recenti:</h5>
          <div className="search-history-container">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="search-history-item"
                onClick={() => fetchWeatherFromHistory(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchWeatherFromHistory(item); }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )

}

export default App
