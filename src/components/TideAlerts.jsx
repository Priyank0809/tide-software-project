import React, { useEffect, useRef } from "react";

export default function TideAlerts({ events, enabled, setEnabled, minutesBefore = 15 }) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (!("Notification" in window)) {
      alert("Notifications not supported.");
      setEnabled(false);
      return;
    }

    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") {
        setEnabled(false);
        return;
      }

      const now = new Date();
      const next = events.find((e) => e.date.toDate() > now);
      if (!next) return;

      const fireAt = new Date(next.date.toDate().getTime() - minutesBefore * 60 * 1000);
      const ms = fireAt.getTime() - Date.now();

      if (ms <= 0) {
        new Notification(`Upcoming ${next.type} tide`, { body: next.date.format("YYYY-MM-DD HH:mm") });
      } else {
        timeoutRef.current = setTimeout(() => {
          new Notification(`Upcoming ${next.type} tide`, { body: next.date.format("YYYY-MM-DD HH:mm") });
        }, ms);
      }
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, events, minutesBefore, setEnabled]);

  return (
    <div style={{ marginTop: 8 }}>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />{" "}
        Notify me {minutesBefore} minutes before next tide
      </label>
    </div>
  );
}





// testing purpose
// Added a comment here for creating a PR from this Local branch created from the base branch main


// import React, { useEffect, useRef } from "react";

// export default function TideAlerts({ events, enabled, setEnabled, minutesBefore = 15 }) {
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     if (!enabled) {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       return;
//     }

//     if (!("Notification" in window)) {
//       alert("Notifications not supported.");
//       setEnabled(false);
//       return;
//     }

//     Notification.requestPermission().then((perm) => {
//       if (perm !== "granted") {
//         setEnabled(false);
//         return;
//       }

//       // 🚨 DEV MODE: send notification every 10 seconds
//       timeoutRef.current = setInterval(() => {
//         new Notification("Test Tide Alert 🌊", {
//           body: "This is a test notification (every 10s).",
//         });
//       }, 10 * 1000);
//     });

//     return () => {
//       if (timeoutRef.current) clearInterval(timeoutRef.current);
//     };
//   }, [enabled, setEnabled]);

//   return (
//     <div style={{ marginTop: 8 }}>
//       <label>
//         <input
//           type="checkbox"
//           checked={enabled}
//           onChange={(e) => setEnabled(e.target.checked)}
//         />{" "}
//         🔔 Notify me every 10 seconds (test mode)
//       </label>
//     </div>
//   );
// }
