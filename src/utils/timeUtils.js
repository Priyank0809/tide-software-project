import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatDate(d) {
  return d.format("YYYY-MM-DD HH:mm");
}

export function timeUntil(d) {
  return dayjs().to(d); // e.g. "in 2 hours"
}
