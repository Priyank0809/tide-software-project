import axios from "axios";
import dayjs from "dayjs";

const TIDES_KEY = process.env.REACT_APP_TIDES_KEY;
const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

export async function getTideEvents(lat, lon, hoursAhead = 48) {
  const since = Math.floor(Date.now() / 1000);
  const until = since + hoursAhead * 3600;
  const url = `https://www.worldtides.info/api/v3?extremes&lat=${lat}&lon=${lon}&start=${since}&end=${until}&key=${TIDES_KEY}`;
  const resp = await axios.get(url);

  const data = resp.data.extremes || [];
  return {
    events: data.map((e) => ({
      date: dayjs.unix(e.dt),
      type: e.type,
      height: e.height,
    })),
    station: resp.data.station?.name || null,
  };
}

export async function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  const resp = await axios.get(url);
  return {
    temp: resp.data.main.temp,
    desc: resp.data.weather[0].description,
  };
}
