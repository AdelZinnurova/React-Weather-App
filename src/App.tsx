import './App.css'
import {useEffect, useState} from "react";
import {CurrentTime} from "./CurrentTime.tsx";
import {CurrentDate} from "./CurrentDate.tsx";
import Humidity from "./assets/humidity.png"
import Wind from "./assets/wind.png"
import Sunrise from "./assets/sunrise.png"
import Sunset from "./assets/sunset.png"

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
            {error && <p className="error">{error}</p>}

            {weatherData && weatherData.main && weatherData.weather && (
                <>
                    <div className='header'>
                        <p className='city'>{weatherData.name}</p>
                        <CurrentTime timezoneOffsetSec={weatherData?.timezone}/>
                        <CurrentDate dt={weatherData?.dt ?? 0} timezone={weatherData?.timezone ?? 0} />
                        <div className="temperature-wrapper">
                            <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}/>
                            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
                        </div>
                        <p className="condition">{weatherData.weather[0].description}</p>
                    </div>
                    <div className="weather-details">
                        <div className='humidity-wind'>
                            <div>
                                <img className='weather-details-icon' src={Humidity} alt="Humidity"/>
                                <p>{Math.round(weatherData.main.humidity)}%</p>
                                <p className='humidity-wind-text'>Humidity</p>
                            </div>
                            <div>
                                <img className='weather-details-icon' src={Wind} alt="Wind"/>
                                <p>{Math.round(weatherData.wind.speed)} mph</p>
                                <p className='humidity-wind-text'>Wind Speed</p>
                            </div>
                        </div>
                        <div className='sunrise-sunset'>
                            <div>
                                <img className='weather-details-icon' src={Sunrise} alt="Sunrise"/>
                                <p>
                                    {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                                <p className='humidity-wind-text'>Sunrise</p>
                            </div>
                            <div>
                                <img className='weather-details-icon' src={Sunset} alt="Sunset"/>
                                <p>
                                    {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                                <p className='humidity-wind-text'>Sunset</p>
                            </div>
                        </div>
                    </div>
                    {forecast.length > 0 && (
                        <>
                            <div className="forecast">
                                <p className="forecast-header">Next Days Forecasts</p>
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
