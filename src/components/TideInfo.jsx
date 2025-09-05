import React from "react";
import { formatDate, detailedCountdown } from "../utils/timeUtils";

export default function TideInfo({ events, now, coastName, onRefresh, clearSaved }) {
  // helper: find next event of a type
  const next = (type) =>
    events.find((e) => e.date.isAfter(now) && (!type || e.type === type));

  // helper: find previous event of a type
  const prev = (type) => {
    const pastEvents = events.filter((e) => e.date.isBefore(now) && (!type || e.type === type));
    return pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;
  };

  const nextHigh = next("High");
  const nextLow = next("Low");
  const prevHigh = prev("High");
  const prevLow = prev("Low");

  // helper: show how long ago (for previous events)
  const timeSince = (date) => {
    const diff = now.diff(date, "second");
    if (diff <= 0) return "just now";
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="card">
      <h2>Tide Info</h2>
      <p className="small">Nearest Coast: {coastName}</p>

      <section style={{ marginTop: 8 }}>
        <h3>Prev High Tide 🌊</h3>
        {prevHigh ? (
          <p>
            {formatDate(prevHigh.date)} — <strong>{prevHigh.height} m</strong>{" "}
            <small style={{ marginLeft: 8, color: "#555" }}>
              ({timeSince(prevHigh.date)})
            </small>
          </p>
        ) : (
          <p>No data</p>
        )}
      </section>

      <section style={{ marginTop: 8 }}>
        <h3>Prev Low Tide 🏖️</h3>
        {prevLow ? (
          <p>
            {formatDate(prevLow.date)} — <strong>{prevLow.height} m</strong>{" "}
            <small style={{ marginLeft: 8, color: "#555" }}>
              ({timeSince(prevLow.date)})
            </small>
          </p>
        ) : (
          <p>No data</p>
        )}
      </section>

      <section style={{ marginTop: 8 }}>
        <h3>Next High Tide 🌊</h3>
        {nextHigh ? (
          <p>
            {formatDate(nextHigh.date)} — <strong>{nextHigh.height} m</strong>{" "}
            <small style={{ marginLeft: 8, color: "#555" }}>
              ({detailedCountdown(nextHigh.date, now)})
            </small>
          </p>
        ) : (
          <p>No data</p>
        )}
      </section>

      <section style={{ marginTop: 10 }}>
        <h3>Next Low Tide 🏖️</h3>
        {nextLow ? (
          <p>
            {formatDate(nextLow.date)} — <strong>{nextLow.height} m</strong>{" "}
            <small style={{ marginLeft: 8, color: "#555" }}>
              ({detailedCountdown(nextLow.date, now)})
            </small>
          </p>
        ) : (
          <p>No data</p>
        )}
      </section>

      <div style={{ marginTop: 12 }}>
        <button onClick={onRefresh}>Refresh Location</button>
        <button onClick={clearSaved} style={{ marginLeft: 8 }}>
          Clear Saved Location
        </button>
      </div>
    </div>
  );
}
