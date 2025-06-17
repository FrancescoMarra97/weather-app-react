export default function DailyForecast({ dailyForecast }) {
    if (!dailyForecast) return null;
    return (
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
    )
}

