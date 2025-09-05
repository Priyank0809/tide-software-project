import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatDate(d) {
  return d.format("YYYY-MM-DD HH:mm");
}

// Countdown until the event (detailed: HH:mm:ss)
export function detailedCountdown(target, now = dayjs()) {
  const diffMs = target.diff(now);
  if (diffMs <= 0) return "passed";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
