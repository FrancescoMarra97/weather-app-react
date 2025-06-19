import { useState, useEffect } from 'react'
import Searchbar from './components/Searchbar'
import WeatherInfo from './components/WeatherInfo'
import SearchedHistory from './components/SearchedHistory'
import './App.css'
import Forecast3H from './components/Forecast3H'
import DailyForecast from './components/DailyForecast'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [forecast, setForecast] = useState(null)
  const [coords, setCoords] = useState(null)

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
      setError(null);

      const currentCity = city.trim();
      if (!currentCity) return; // esce se city è vuota o solo spazi

      setCity('');
      setSearchHistory(prevHistory => {
        const cityLower = currentCity.toLowerCase();
        const filtered = prevHistory.filter(c => c.toLowerCase() !== cityLower);
        const newHistory = [currentCity, ...filtered].slice(0, 20);
        return newHistory;
      });


    } catch (error) {
      console.error('Errore:', error);
      setError(error);
      setWeather(null); // Resetta le informazioni meteo in caso di errore
      setForecast(null); // Resetta le previsioni in caso di errore
    }
  }

  const fetchWeatherFromHistory = async (selectedCity) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric&lang=it`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=metric&lang=it`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Errore nella richiesta');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setError(null);

      setSearchHistory((prevHistory) => {
        const lowerCity = selectedCity.toLowerCase();
        const filtered = prevHistory.filter(
          (c) => c.toLowerCase() !== lowerCity
        );
        return [selectedCity, ...filtered].slice(0, 20);
      });

      setCity(selectedCity);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {
      console.error(error);
      setError(error);
      setWeather(null);
      setForecast(null);
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=it`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=it`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Errore nella richiesta');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setError(null);

      setSearchHistory((prevHistory) => {
        const cityName = weatherData.name;
        const filtered = prevHistory.filter(
          (c) => c.toLowerCase() !== cityName.toLowerCase()
        );
        return [cityName, ...filtered].slice(0, 20);
      });

      setCity(weatherData.name);
    } catch (error) {
      console.error(error);
      setError(null);
      setWeather(null);
      setForecast(null);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocalizzazione non supportata dal browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Errore nella geolocalizzazione:', error);
        setError(null);
      }
    );
  }, []);







  return (
    <div className="app-container">
      <h1>Meteo</h1>
      <Searchbar
        city={city}
        onCityChange={setCity}
        onSearch={fetchWeather}
      />

      {weather && <WeatherInfo weather={weather} />}

      {error && (
        <div className="error-message">
          <p>{error.message}</p>
        </div>
      )}

      {forecast && <Forecast3H forecast={forecast} />}

      {dailyForecast && <DailyForecast dailyForecast={dailyForecast} />}



      <SearchedHistory
        searchHistory={searchHistory}
        onSelect={fetchWeatherFromHistory}
      />


    </div>
  )

}

export default App
