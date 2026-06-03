import { CREDENTIALS } from "../../constants/siteContent.js";

export function CredentialsBanner() {
  return (
    <ul className="credentials-list">
      {CREDENTIALS.map((item) => (
        <li key={item}>
          <span className="credentials-check" aria-hidden="true">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
