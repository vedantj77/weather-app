import React, { useState } from "react";
import { useEffect } from "react";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  
  const currentDate = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const month = months[currentDate.getMonth()];
  const dayName = days[currentDate.getDay()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${dayName}, ${month} ${day}, ${year}`;

  const API_KEY = "2d92e5358c72968eae569f34cf0fbe6f";

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();
      
      if (weatherData.cod === 200) {
        setWeatherData(weatherData);
        
        // 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData);
        
        // Air quality (using coordinates from current weather)
        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
        );
        const airQualityData = await airQualityResponse.json();
        setAirQuality(airQualityData);
        
      } else {
        setError("City not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (city.trim()) {
      fetchWeatherData();
    }
  };

  const getWeatherIconUrl = (main) => {
    switch (main) {
      case "Clouds":
        return "/thunder.png"; 
      case "Rain":
        return "/rain_with_cloud.png"; 
      case "Mist":
        return "/Tornado.png"; 
      case "Haze":  
      case "Clear":
        return "/sun.png"; 
      case "Snow":
        return "/Tornado.png";
      default:
        return "/thunder.png";
    }
  };

  const getAirQualityText = (aqi) => {
    const quality = {
      1: { text: "Good", color: "#10B981" },
      2: { text: "Fair", color: "#F59E0B" },
      3: { text: "Moderate", color: "#F97316" },
      4: { text: "Poor", color: "#EF4444" },
      5: { text: "Very Poor", color: "#7C2D12" }
    };
    return quality[aqi] || { text: "Unknown", color: "#6B7280" };
  };

  const getUVIndexLevel = (uvi) => {
    if (uvi <= 2) return { level: "Low", color: "#10B981" };
    if (uvi <= 5) return { level: "Moderate", color: "#F59E0B" };
    if (uvi <= 7) return { level: "High", color: "#EF4444" };
    return { level: "Very High", color: "#7C2D12" };
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="App">
      <div className="app-container">
        {/* Main Weather Card */}
        <div className="main-weather-card">
          {weatherData && (
            <>            
              <div className="header">
                <h1 className="container_date">{formattedDate}</h1>
                <div className="location">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h2 className="container_city">{weatherData.name}, {weatherData.sys.country}</h2>
                </div>
              </div>

              <div className="weather_main">
                <div className="temperature-section">
                  <img
                    className="container_img"
                    src={getWeatherIconUrl(weatherData.weather[0].main)}
                    alt="Weather Icon"
                  />
                  <div className="temp-display">
                    <h2 className="container_degree">{Math.round(weatherData.main.temp)}</h2>
                    <span className="degree_symbol">°C</span>
                  </div>
                </div>
                
                <div className="weather-status">
                  <h3 className="weather_main_desc">{weatherData.weather[0].main}</h3>
                  <p className="weather_desc">{weatherData.weather[0].description}</p>
                </div>

                <div className="weather_details">
                  <div className="detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Wind</span>
                    <span className="detail-value">{weatherData.wind.speed} m/s</span>
                  </div>
                </div>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <div className="search-container">
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit" className="search-btn" disabled={loading}>
                    {loading ? (
                      <div className="spinner"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {error && <div className="error-message">{error}</div>}
              </form>
            </>
          )}
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* Air Quality & UV Index Card */}
          <div className="info-card">
            <h3 className="card-title">Environment</h3>
            <div className="environment-grid">
              <div className="env-item">
                <div className="env-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                    <path d="M12 2a10 10 0 0 1 10 10H12V2z"></path>
                  </svg>
                </div>
                <div className="env-info">
                  <span className="env-label">Air Quality</span>
                  {airQuality && (
                    <span 
                      className="env-value"
                      style={{ color: getAirQualityText(airQuality.list[0].main.aqi).color }}
                    >
                      {getAirQualityText(airQuality.list[0].main.aqi).text}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="env-item">
                <div className="env-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                  </svg>
                </div>
                <div className="env-info">
                  <span className="env-label">UV Index</span>
                  {weatherData && (
                    <span 
                      className="env-value"
                      style={{ color: getUVIndexLevel(weatherData.uvi || 0).color }}
                    >
                      {getUVIndexLevel(weatherData.uvi || 0).level}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="env-item">
                <div className="env-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 15h18M12 3v18"></path>
                  </svg>
                </div>
                <div className="env-info">
                  <span className="env-label">Pressure</span>
                  <span className="env-value">{weatherData?.main.pressure} hPa</span>
                </div>
              </div>
              
              <div className="env-item">
                <div className="env-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </div>
                <div className="env-info">
                  <span className="env-label">Visibility</span>
                  <span className="env-value">{weatherData ? (weatherData.visibility / 1000).toFixed(1) : 0} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Card */}
          <div className="info-card">
            <div className="card-header">
              <h3 className="card-title">5-Day Forecast</h3>
            </div>
            <div className="forecast-list">
              {forecastData && forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                <div key={index} className="forecast-item">
                  <span className="forecast-day">
                    {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <img 
                    src={getWeatherIconUrl(item.weather[0].main)} 
                    alt="Weather" 
                    className="forecast-icon"
                  />
                  <div className="forecast-temps">
                    <span className="forecast-high">{Math.round(item.main.temp_max)}°</span>
                    <span className="forecast-low">{Math.round(item.main.temp_min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sunrise & Sunset Card */}
        </div>
        
        {loading && !weatherData && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;