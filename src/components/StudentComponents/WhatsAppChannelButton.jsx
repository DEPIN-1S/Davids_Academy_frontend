import React from "react";
import { WA_CHANNEL_URL } from "../../config/whatsapp";
import "../../styles/WhatsAppCta.css";

const WhatsAppChannelButton = ({
  message = "Follow Channel",
  className = "",
}) => {
  if (!WA_CHANNEL_URL) return null;

  return (
    <a
      href={WA_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-cta wa-cta-channel ${className}`.trim()}
    >
      {message}
    </a>
  );
};

export default WhatsAppChannelButton;
