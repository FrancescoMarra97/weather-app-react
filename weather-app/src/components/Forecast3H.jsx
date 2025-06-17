export default function Forecast3H({ forecast }) {
    if (!forecast) return null;

    return (
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
    );
}