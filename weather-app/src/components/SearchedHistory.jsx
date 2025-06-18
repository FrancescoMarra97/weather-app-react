export default function SearchedHistory({ searchHistory, onSelect }) {
    if (searchHistory.length === 0) return null;

    return (
        <div className="mt-3">
            <h5>Ricerche recenti:</h5>
            <div className="search-history-container">
                {searchHistory.map((item, index) => (
                    <div
                        key={index}
                        className="search-history-item"
                        onClick={() => onSelect(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') fetchWeatherFromHistory(item); }}
                    >
                        {item}
                    </div>

                ))}
            </div>
        </div>
    );
}


