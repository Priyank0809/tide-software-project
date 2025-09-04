import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./index.css";
import TideInfo from "./components/TideInfo";
import TideChart from "./components/TideChart";
import TideMap from "./components/TideMap";
import TideAlerts from "./components/TideAlerts";
import { getTideEvents, getWeather } from "./services/tideService";

export default function App() {
  const [coords, setCoords] = useState(null);
  const [tides, setTides] = useState([]);
  const [coastName, setCoastName] = useState("Nearest coast");
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(dayjs());
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [error, setError] = useState(null);

  // Load saved location or request fresh
  useEffect(() => {
    const saved = localStorage.getItem("last_location");
    if (saved) {
      setCoords(JSON.parse(saved));
    } else {
      requestLocation();
    }

    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!coords) return;
    async function fetchData() {
      try {
        setError(null);
        const tideResp = await getTideEvents(coords.lat, coords.lon, 48);
        setTides(tideResp.events);
        if (tideResp.station) setCoastName(tideResp.station);

        const w = await getWeather(coords.lat, coords.lon);
        setWeather(w);
      } catch (e) {
        setError("Failed to load tide/weather data. Check API keys.");
      }
    }
    fetchData();
  }, [coords]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      // fallback to Miami Beach
      setCoords({ lat: 25.7907, lon: -80.1300 });
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(loc);
        localStorage.setItem("last_location", JSON.stringify(loc));
      },
      (err) => {
        // Show the real error message
        setError("Location error: " + err.message);
  
        // fallback to Miami Beach
        setCoords({ lat: 25.7907, lon: -80.1300 });
      },
      {
        enableHighAccuracy: true, // ask for GPS if available
        timeout: 10000,           // wait up to 10s
        maximumAge: 0             // don’t use cached position
      }
    );
  }

  function clearSaved() {
    localStorage.removeItem("last_location");
    setCoords(null);
    requestLocation();
  }

  return (
    <div className="app-container">
      <div className="card">
        <h1>Tides Information 🌊</h1>
        <p className="small">Nearest coast: {coastName}</p>
        <p>Current time: {now.format("YYYY-MM-DD HH:mm:ss")}</p>

        <TideInfo events={tides} now={now} coastName={coastName} onRefresh={requestLocation} clearSaved={clearSaved} />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <TideChart events={tides} />
        <TideMap coords={coords} />

        {weather && (
          <div className="card">
            <h3>Weather at Coast ☁️</h3>
            <p>
              {weather.temp}°C, {weather.desc}
            </p>
          </div>
        )}

        <TideAlerts events={tides} enabled={alertsEnabled} setEnabled={setAlertsEnabled} />
      </div>
    </div>
  );
}
