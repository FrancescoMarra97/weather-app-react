export default function Searchbar({ city, onCityChange, onSearch }) {
    return (
        <div className="input-group">
            <input
                type="text"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="Inserisci una città"
            />
            <button onClick={onSearch}>Cerca</button>
        </div>
    )
}
