import axios from "axios";
import dayjs from "dayjs";

const TIDES_KEY = process.env.REACT_APP_TIDES_KEY;
const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

// Hardcoded tide stations (India’s west coast + nearby)
const STATIONS = [
  { name: "Veraval", lat: 20.9000, lon: 70.3667 },
  { name: "Okha", lat: 22.4700, lon: 69.0700 },
  { name: "Dwarka", lat: 22.2400, lon: 68.9700 },
  { name: "Porbandar", lat: 21.6422, lon: 69.6093 },
  { name: "Mumbai", lat: 18.9400, lon: 72.8350 },
  { name: "Vadinar", lat: 22.4800, lon: 69.7300 },
  { name: "Kandla", lat: 23.0330, lon: 70.2200 },
];

// Haversine distance formula (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 🔹 Step 1: Pick nearest station from hardcoded list
export async function getNearestStation(lat, lon) {
  let nearest = STATIONS[0];
  let minDist = Infinity;

  for (const s of STATIONS) {
    const dist = getDistance(lat, lon, s.lat, s.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = s;
    }
  }

  console.log("Nearest hardcoded station:", nearest.name, "distance:", minDist.toFixed(2), "km");
  return nearest;
}

// 🔹 Step 2: Fetch tide events for that station
export async function getTideEvents(lat, lon, hoursAhead = 48) {
  const nearestStation = await getNearestStation(lat, lon);

  const since = Math.floor(Date.now() / 1000);
  const until = since + hoursAhead * 3600;

  const url = `https://www.worldtides.info/api/v3?extremes&lat=${nearestStation.lat}&lon=${nearestStation.lon}&start=${since}&end=${until}&key=${TIDES_KEY}`;
  const resp = await axios.get(url);

  const data = resp.data.extremes || [];

  return {
    events: data.map((e) => ({
      date: dayjs.unix(e.dt),
      type: e.type,
      height: e.height,
    })),
    station: nearestStation.name,
  };
}

// 🔹 Step 3: Fetch weather for current location
export async function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  const resp = await axios.get(url);
  return {
    temp: resp.data.main.temp,
    desc: resp.data.weather[0].description,
  };
}
