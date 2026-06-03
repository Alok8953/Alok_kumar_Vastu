import { PHONE_DISPLAY, PHONE_NUMBER } from "../../constants/contact.js";

export function SiteTopBar() {
  return (
    <div className="site-topbar">
      <div className="container topbar-wrap">
        <a className="topbar-item" href={`tel:${PHONE_NUMBER}`}>
          Phone: {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
