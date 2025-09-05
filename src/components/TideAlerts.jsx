import React, { useEffect, useRef, useState } from "react";

export default function TideAlerts({ events, enabled, setEnabled, minutesBeforeDefault = 15 }) {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [minutesBefore, setMinutesBefore] = useState(minutesBeforeDefault);
  const [heightThreshold, setHeightThreshold] = useState(2.5); // meters

  useEffect(() => {
    // cleanup helpers
    function clearAll() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    if (!enabled) {
      clearAll();
      return;
    }

    if (!("Notification" in window)) {
      alert("Notifications not supported in this browser.");
      setEnabled(false);
      return;
    }

    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") {
        setEnabled(false);
        return;
      }

      // find the next tide event
      const now = new Date();
      const next = events.find((e) => e.date.toDate() > now);

      // send immediate notification for any "extreme" tide (height >= threshold) within the events list (upcoming)
      const extreme = events.find((e) => e.date.toDate() > now && e.height >= heightThreshold);
      if (extreme) {
        const body = `Extreme ${extreme.type} tide at ${extreme.date.format("YYYY-MM-DD HH:mm")} — ${extreme.height} m`;
        new Notification("Extreme tide alert ⚠️", { body });
      }

      if (next) {
        const fireAt = new Date(next.date.toDate().getTime() - minutesBefore * 60 * 1000);
        const ms = fireAt.getTime() - Date.now();

        if (ms <= 0) {
          // if the scheduled time already passed, notify immediately
          new Notification(`Upcoming ${next.type} tide`, {
            body: `${next.date.format("YYYY-MM-DD HH:mm")} (${next.height} m)`,
          });
        } else {
          timeoutRef.current = setTimeout(() => {
            new Notification(`Upcoming ${next.type} tide`, {
              body: `${next.date.format("YYYY-MM-DD HH:mm")} (${next.height} m)`,
            });
          }, ms);
        }
      }

      // As a safety: keep a periodic check (every 10 minutes) to re-evaluate events and thresholds,
      // so that if user keeps the app open we send alerts for newly available extremes.
      intervalRef.current = setInterval(() => {
        const now2 = new Date();
        const extreme2 = events.find((e) => e.date.toDate() > now2 && e.height >= heightThreshold);
        if (extreme2) {
          const body = `Extreme ${extreme2.type} tide at ${extreme2.date.format("YYYY-MM-DD HH:mm")} — ${extreme2.height} m`;
          new Notification("Extreme tide alert ⚠️", { body });
        }
      }, 10 * 60 * 1000); // 10 minutes
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, events, minutesBefore, heightThreshold, setEnabled]);

  return (
    <div style={{ marginTop: 8 }} className="card">
      <h3>Alerts & Safety</h3>

      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          Notify me {minutesBefore} minutes before next tide
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          Minutes before:
          <input
            type="number"
            min={0}
            max={180}
            value={minutesBefore}
            onChange={(e) => setMinutesBefore(Math.max(0, Number(e.target.value)))}
            style={{ width: 70, marginLeft: 6 }}
          />
        </label>

        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          Extreme threshold (m):
          <input
            type="number"
            min={0}
            step={0.1}
            value={heightThreshold}
            onChange={(e) => setHeightThreshold(Math.max(0, Number(e.target.value)))}
            style={{ width: 70, marginLeft: 6 }}
          />
        </label>
      </div>

      <p className="small">
        Tip: use the threshold to get notified if upcoming tide height crosses a value (e.g.,
        storm/high tides). Notifications require browser permission.
      </p>
    </div>
  );
}
