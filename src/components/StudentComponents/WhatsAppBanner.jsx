import React from "react";
import { useLocation } from "react-router-dom";
import WhatsAppChannelButton from "./WhatsAppChannelButton";
import WhatsAppDMButton from "./WhatsAppDMButton";
import "../../styles/WhatsAppCta.css";

const HIDE_BANNER_PATH =
  /\/student\/(exam|mcq|dropdown-question|dragdrop-question|multi-radio-question|sort-question|sentence-question|fill-in-question|reveal-answer)/;

const WhatsAppBanner = () => {
  const { pathname } = useLocation();

  if (HIDE_BANNER_PATH.test(pathname)) {
    return null;
  }

  return (
    <div className="wa-banner" role="region" aria-label="WhatsApp Channel">
      <span className="wa-banner-text">
        Get free daily NCLEX questions on WhatsApp
      </span>
      <div className="wa-banner-actions">
        <WhatsAppChannelButton message="Follow Channel" />
        <WhatsAppDMButton label="Ask us" />
      </div>
    </div>
  );
};

export default WhatsAppBanner;
