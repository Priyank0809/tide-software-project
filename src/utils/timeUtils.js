import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// guess user's timezone once
const USER_TZ = dayjs.tz.guess ? dayjs.tz.guess() : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export function formatDate(d) {
  // Format with user's local timezone for clarity
  try {
    return d.tz(USER_TZ).format("YYYY-MM-DD HH:mm");
  } catch (e) {
    return d.format("YYYY-MM-DD HH:mm");
  }
}

// returns "in 2 hours" style using relativeTime
export function timeUntil(d) {
  return dayjs().to(d);
}

// returns detailed countdown string: "01:23:45" or "2d 03:12:45" if >24h
export function detailedCountdown(target, now = dayjs()) {
  const t = target;
  let diff = t.diff(now, "second");
  if (diff <= 0) return "now";

  const days = Math.floor(diff / (3600 * 24));
  diff -= days * 24 * 3600;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
