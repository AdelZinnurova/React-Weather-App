import './App.css'
import {useEffect, useState} from "react";
import {CurrentTime} from "./CurrentTime.tsx";

type WeatherApiResponse = {
    "coord": {
        "lon": number,
        "lat": number
    },
    "weather": [
        {
            "id": number,
            "main": string,
            "description": string,
            "icon": string
        }
    ],
    "base": string,
    "main": {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number,
        "sea_level": number,
        "grnd_level": number
    },
    "visibility": number,
    "wind": {
        "speed": number,
        "deg": number
    },
    "clouds": {
        "all": number
    },
    "dt": number,
    "sys": {
        "type": number,
        "id": number,
        "country": string,
        "sunrise": number,
        "sunset": number
    },
    "timezone": number,
    "id": number,
    "name": string,
    "cod": number
}

type ForecastApiResponse = {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastItem[];
    city: {
        id: number;
        name: string;
        coord: { lat: number; lon: number };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
};

type ForecastItem = {
    dt: number;
    main: {
        temp: number; feels_like: number; temp_min: number; temp_max: number;
        pressure: number; sea_level: number; grnd_level: number; humidity: number; temp_kf: number;
    };
    weather: { id: number; main: string; description: string; icon: string }[];
    clouds: { all: number };
    wind: { speed: number; deg: number; gust: number };
    visibility: number;
    pop: number;
    sys: { pod: string };
    dt_txt: string;
}

function App() {

    const API_KEY = 'e2b8e81c26191504257bd05c2e05b7aa'

    const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
    const [city, setCity] = useState<string>("london");
    const [forecast, setForecast] = useState<ForecastItem[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [error, setError] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(false)

    const fetchWeatherData = async (cityName: string) => {
        setCity(cityName);
        try {
            setLoading(true)
            setError(null)
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            console.log(data);

            const foreCastresponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            const forecastdata: ForecastApiResponse = await foreCastresponse.json();

            const dailyForecast = forecastdata.list.filter(
                (item, index) => index % 8 === 0
            );

            setForecast(dailyForecast);
        } catch {
            setError("Couldnt fetch data,please try again")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchWeatherData(city);
    }, [city]);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        fetchWeatherData(searchInput);
    }

    if (loading) return <div className="wrapper">Loading...</div>

    return (
        <div className="wrapper">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter city name"
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
            <CurrentTime timezoneOffsetSec={weatherData?.timezone}/>
            {error && <p className="error">{error}</p>}

            {weatherData && weatherData.main && weatherData.weather && (
                <>
                    <div className='header'>
                        <h1 className='city'>{weatherData.name}</h1>
                        <p className="temperature">{weatherData.main.temp}°C</p>
                        <p className="condition">{weatherData.weather[0].main}</p>
                    </div>
                    <div className="weather-details">
                        <div>
                            <p>Humidity</p>
                            <p>{Math.round(weatherData.main.humidity)}%</p>
                        </div>
                        <div>
                            <p>Wind Speed</p>
                            <p>{Math.round(weatherData.wind.speed)} mph</p>
                        </div>
                    </div>
                    {forecast.length > 0 && (
                        <>
                            <div className="forecast">
                                <h2 className="forecast-header">5-Day Forecast</h2>
                                <div className="forecast-days">
                                    {forecast.map((day, index) => (
                                        <div key={index} className="forecast-day">
                                            <p>
                                                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </p>
                                            <img
                                                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                                alt={day.weather[0].description}
                                            />
                                            <p>{Math.round(day.main.temp)}°C</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default App
