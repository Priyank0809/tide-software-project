import React from "react";
import { formatDate, detailedCountdown } from "../utils/timeUtils";

export default function TideInfo({ events = [], now, coastName, onRefresh, clearSaved }) {
  // sort events just in case
  const sorted = [...events].sort((a, b) => a.date.diff(b.date));

  const nextOfType = (type) => sorted.find((e) => e.date.isAfter(now) && (!type || e.type === type));

  const nextHigh = nextOfType("High");
  const nextLow = nextOfType("Low");

  return (
    <div className="card">
      <h2>Tide Info</h2>
      <p className="small">Nearest Coast: {coastName}</p>

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
