import React from "react";
import { formatDate, timeUntil } from "../utils/timeUtils";

export default function TideInfo({ events, now, coastName, onRefresh, clearSaved }) {
  const next = (type) => events.find((e) => e.date.isAfter(now) && (!type || e.type === type));

  return (
    <div className="card">
      <h2>Tide Info</h2>
      <p className="small">Nearest Coast: {coastName}</p>

      <h3>Next High Tide</h3>
      {next("High") ? (
        <p>
          {formatDate(next("High").date)} ({timeUntil(next("High").date)})
        </p>
      ) : (
        <p>No data</p>
      )}

      <h3>Next Low Tide</h3>
      {next("Low") ? (
        <p>
          {formatDate(next("Low").date)} ({timeUntil(next("Low").date)})
        </p>
      ) : (
        <p>No data</p>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={onRefresh}>Refresh Location</button>
        <button onClick={clearSaved} style={{ marginLeft: 8 }}>
          Clear Saved Location
        </button>
      </div>
    </div>
  );
}
