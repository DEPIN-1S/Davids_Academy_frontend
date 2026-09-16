import React from "react";
import { useSelector } from "react-redux";
import { buildDmLink, buildExamHelpLink, WA_NUMBER } from "../../config/whatsapp";
import "../../styles/WhatsAppCta.css";

const WhatsAppDMButton = ({
  studentName = "",
  context = "NCLEX-RN preparation",
  examContext,
  weakTopics,
  message,
  label = "Ask us on WhatsApp",
  className = "",
}) => {
  const user = useSelector((state) => state.user.user);
  const name = studentName || user?.name || "";

  let href;
  if (message) {
    href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  } else if (examContext || (weakTopics && weakTopics.length > 0)) {
    href = buildExamHelpLink(name, { examContext, weakTopics });
  } else {
    href = buildDmLink(name, context);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-cta wa-cta-dm ${className}`.trim()}
    >
      {label}
    </a>
  );
};

export default WhatsAppDMButton;
