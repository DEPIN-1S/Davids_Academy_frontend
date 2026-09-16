export const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918891263199";
export const WA_CHANNEL_URL =
  process.env.REACT_APP_WA_CHANNEL_URL ||
  "https://whatsapp.com/channel/0029Vb70F913AzNSHTbMeg1z";

export const formatWaPhoneDisplay = (number = WA_NUMBER) => {
  if (number.startsWith("91") && number.length === 12) {
    return `+91 ${number.slice(2)}`;
  }
  return `+${number}`;
};

const cleanStudentName = (studentName = "") =>
  studentName
    .replace(/\bnull\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

export const buildDmLink = (
  studentName = "",
  context = "NCLEX-RN preparation"
) => {
  const name = cleanStudentName(studentName);
  const greeting = name
    ? `Hi David Academy! I'm ${name}.`
    : "Hi David Academy!";
  const message = `${greeting} I need help with ${context}.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const buildExamHelpMessage = (
  studentName = "",
  { examContext = "", weakTopics = [] } = {}
) => {
  const name = cleanStudentName(studentName);
  const greeting = name
    ? `Hi David Academy! I'm ${name}.`
    : "Hi David Academy!";
  const contextLine = examContext
    ? `I just completed ${examContext}.`
    : "I just completed an exam and would like help with my preparation.";

  const weakLines = (weakTopics || [])
    .filter((topic) => topic?.name && topic?.percent != null)
    .map((topic) => `- ${topic.name} — ${topic.percent}%`);

  if (weakLines.length > 0) {
    return [
      greeting,
      "",
      contextLine,
      "",
      "My weak areas are:",
      ...weakLines,
      "",
      "Please help me improve these areas.",
    ].join("\n");
  }

  return [
    greeting,
    "",
    examContext
      ? `I just completed ${examContext} and would like help understanding my result and planning my next steps.`
      : "I just completed an exam and would like help understanding my result and planning my next steps.",
  ].join("\n");
};

export const buildExamHelpLink = (studentName, options) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildExamHelpMessage(studentName, options)
  )}`;

export const WA_PHONE_HREF = `tel:+${WA_NUMBER}`;
export const WA_CHAT_HREF = `https://wa.me/${WA_NUMBER}`;
