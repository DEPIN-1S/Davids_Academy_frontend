import React from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { WA_CHANNEL_URL } from "../config/whatsapp";
import "../styles/WhatsAppCta.css";

const HIDE_FLOAT_PATH =
  /\/(admin|student\/(exam|mcq|dropdown-question|dragdrop-question|multi-radio-question|sort-question|sentence-question|fill-in-question|reveal-answer))/;

const WhatsAppChannelFloat = () => {
  const { pathname } = useLocation();

  if (!WA_CHANNEL_URL || HIDE_FLOAT_PATH.test(pathname)) {
    return null;
  }

  return (
    <a
      href={WA_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-channel-float"
      aria-label="Follow David's Academy WhatsApp Channel"
    >
      <span className="wa-channel-float-icon" aria-hidden="true">
        <FaWhatsapp />
      </span>
      <span className="wa-channel-float-text">
        <strong>WhatsApp Channel</strong>
        <span>Follow for daily questions</span>
      </span>
    </a>
  );
};

export default WhatsAppChannelFloat;
