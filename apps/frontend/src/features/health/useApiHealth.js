import { useEffect, useState } from "react";
import { getHealth } from "../../lib/apiClient";

export function useApiHealth() {
  const [apiStatus, setApiStatus] = useState("Connecting...");

  useEffect(() => {
    getHealth()
      .then((data) => {
        const dbLabel = data.database === "connected" ? "PostgreSQL connected" : "PostgreSQL offline";
        setApiStatus(`${data.message} · ${dbLabel}`);
      })
      .catch(() => setApiStatus("API offline"));
  }, []);

  return apiStatus;
}
