import { useEffect, useState } from "react";
import { getHealth } from "../../lib/apiClient";

export function useApiHealth() {
  const [apiStatus, setApiStatus] = useState("Connecting...");

  useEffect(() => {
    getHealth()
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("API offline"));
  }, []);

  return apiStatus;
}
