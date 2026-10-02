import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchSampleQuestionData } from "../features/exam/examAPI";
import {
  WA_CHANNEL_URL,
  buildDmLink,
} from "../config/whatsapp";
import { stripHtml } from "../utils/htmlHelper";
import { sanitizeExamHtml } from "../utils/examHtml";
import Dropdown from "../components/StudentComponents/DropdownQuestionComponent";
import Sorting from "../components/StudentComponents/SortQuestionComponent";
import FillIn from "../components/StudentComponents/FillInQuestionComponent";
import DragDrop from "../components/StudentComponents/DragDropQuestionComponent";
import SentenceHighlight from "../components/StudentComponents/SentenceQuestionComponent";
import MultiRadio from "../components/StudentComponents/MultiRadioQuestionComponent";
import TableDropdownQuestionComponent from "../components/StudentComponents/TableDropdownQuestionComponent";
import TableMultipleDropdownComponent from "../components/StudentComponents/TableMultipleDropdownComponent";
import TableHighlightSelectComponent from "../components/StudentComponents/TableHighlightSelectComponent";
import "../styles/DashboardStyles/StudentFuturistic.css";
import "../styles/PublicQuestionPage.css";

const OPTION_LABELS = "ABCDEFGHIJ".split("");

const questionTypeToComponent = {
  Dropdown,
  Sorting,
  "Fill in the Blanks": FillIn,
  "Drag Drop": DragDrop,
  "Sentence Highlight": SentenceHighlight,
  "Multiple Radio": MultiRadio,
  "Table Dropdown": TableDropdownQuestionComponent,
  Multidropdown: TableMultipleDropdownComponent,
  "Table Highlight": TableHighlightSelectComponent,
};

const optionText = (item) => {
  if (item == null) return "";
  if (typeof item === "string") return item;
  return item.option || item.option_value || item.mcqAnswer || item.answer || "";
};

const collectMcqOptions = (question) => {
  const raw = question?.mcqoptions || question?.options || [];
  return raw.map(optionText).filter(Boolean);
};

const collectCorrectAnswers = (question) => {
  const fromAnswers = (question?.mcqAnswers || [])
    .map(optionText)
    .map((t) => t.trim())
    .filter(Boolean);
  if (fromAnswers.length) return fromAnswers;
  return (question?.mcqoptions || [])
    .filter((o) => o?.is_correct === 1 || o?.is_correct === true)
    .map(optionText)
    .map((t) => t.trim())
    .filter(Boolean);
};

const explanationHtml = (question) => {
  const exp = question?.explanation;
  if (!exp) return "";
  if (typeof exp === "string") return exp;
  if (Array.isArray(exp)) {
    return exp
      .map((item) => item?.explanation || item?.explanation_text || item?.text || "")
      .filter(Boolean)
      .join("<br/>");
  }
  return exp.explanation || exp.explanation_text || "";
};

const isTruthyBlank = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

const getQuestionComponent = (type) => {
  if (!type) return null;
  if (questionTypeToComponent[type]) return questionTypeToComponent[type];
  const match = Object.keys(questionTypeToComponent).find(
    (key) => key.toLowerCase() === String(type).toLowerCase()
  );
  return match ? questionTypeToComponent[match] : null;
};

const normalizeQuestion = (question) => {
  if (!question) return question;
  const type = String(question.question_type || "").toLowerCase();
  if (type !== "fill in the blanks") return question;

  const raw = question.question_content || question.FTBquestion_content || [];
  const question_content = raw.map((part) => ({
    ...part,
    question_text: part.question_text || "",
    blank_or_not: isTruthyBlank(part.blank_or_not ?? part.blankOrNot) ? "true" : "false",
    fill_blanks_answer: part.fill_blanks_answer || part.answers || "",
  }));

  let options = question.options;
  const ftbOpts = question.FTBoptions;
  if ((!options || !options.length) && ftbOpts) {
    const values = Array.isArray(ftbOpts.options)
      ? ftbOpts.options.map((o) =>
          typeof o === "string" ? o : o.option_value || o.option || o.value || ""
        )
      : [];
    options = [{ option_heading: ftbOpts.heading || "", option_value: values }];
  }

  return {
    ...question,
    question_content,
    options,
    tabs: question.tabs?.length ? question.tabs : question.tabsInfo || [],
    actions: question.actions || [],
  };
};

const PublicQuestionPage = () => {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const questionId = pathId || searchParams.get("n") || searchParams.get("id");

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.classList.add("student-theme");
    return () => document.body.classList.remove("student-theme");
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!questionId) {
        setError("Missing question id.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      setSubmitted(false);
      setSelected([]);
      try {
        const data = await fetchSampleQuestionData(questionId);
        if (!cancelled) setQuestion(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Question not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const normalizedQuestion = useMemo(() => normalizeQuestion(question), [question]);
  const options = useMemo(() => collectMcqOptions(normalizedQuestion), [normalizedQuestion]);
  const correctAnswers = useMemo(
    () => collectCorrectAnswers(normalizedQuestion),
    [normalizedQuestion]
  );
  const isMulti = correctAnswers.length > 1;
  const questionType = normalizedQuestion?.question_type || normalizedQuestion?.questionType || "";
  const InteractiveComponent = getQuestionComponent(questionType);
  const isMcq = String(questionType).toLowerCase() === "mcq" || (!InteractiveComponent && options.length > 0);

  const toggleOption = (text) => {
    if (submitted) return;
    setSelected((prev) => {
      if (isMulti) {
        return prev.includes(text) ? prev.filter((item) => item !== text) : [...prev, text];
      }
      return [text];
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selected.length && isMcq) return;
    setSubmitted(true);
  };

  const isCorrect =
    submitted &&
    isMcq &&
    selected.length === correctAnswers.length &&
    selected.every((item) => correctAnswers.includes(item.trim()));

  const rationale = explanationHtml(normalizedQuestion);

  return (
    <div className="public-q-page student-futuristic">
      <article className="public-q-card student-exam-body">
        <p className="public-q-kicker">
          David&apos;s Academy · Practice Q{questionId ? ` · #${questionId}` : ""}
        </p>

        {loading && <p className="public-q-status">Loading question…</p>}
        {error && !loading && (
          <p className="public-q-status is-error">{error}</p>
        )}

        {!loading && !error && normalizedQuestion && (
          <>
            {isMcq && isMulti && <span className="public-q-badge">Select all that apply</span>}

            {isMcq ? (
              <>
                <div
                  className="public-q-stem q-html"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeExamHtml(
                      normalizedQuestion.question || normalizedQuestion.question_text || ""
                    ),
                  }}
                />
                <form onSubmit={handleSubmit}>
                  <ul className="public-q-options">
                    {options.map((text, index) => {
                      const chosen = selected.includes(text);
                      const isRight = submitted && correctAnswers.includes(text.trim());
                      const isWrongPick = submitted && chosen && !isRight;
                      return (
                        <li key={`${index}-${text}`}>
                          <button
                            type="button"
                            className={`public-q-option ${chosen ? "is-chosen" : ""} ${
                              isRight ? "is-right" : ""
                            } ${isWrongPick ? "is-wrong" : ""}`}
                            onClick={() => toggleOption(text)}
                            disabled={submitted}
                          >
                            <span className="public-q-letter">{OPTION_LABELS[index] || index + 1}</span>
                            <span>{stripHtml(text)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {!submitted && (
                    <button
                      type="submit"
                      className="public-q-submit"
                      disabled={!selected.length}
                    >
                      Check answer
                    </button>
                  )}
                </form>
              </>
            ) : InteractiveComponent ? (
              <div className="public-q-interactive">
                <InteractiveComponent
                  question={normalizedQuestion}
                  onSubmit={() => {}}
                />
              </div>
            ) : (
              <>
                <div
                  className="public-q-stem q-html"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeExamHtml(
                      normalizedQuestion.question || normalizedQuestion.question_text || ""
                    ),
                  }}
                />
                <button
                  type="button"
                  className="public-q-submit"
                  onClick={() => setSubmitted(true)}
                  disabled={submitted}
                >
                  {submitted ? "Answer revealed" : "View answer"}
                </button>
              </>
            )}

            {submitted && isMcq && (
              <div className={`public-q-result ${isCorrect ? "ok" : "no"}`}>
                <p className="public-q-result-title">
                  {isCorrect ? "Correct" : "Not quite"}
                </p>
                {correctAnswers.length > 0 && (
                  <p>
                    <strong>Answer:</strong> {correctAnswers.map(stripHtml).join("; ")}
                  </p>
                )}
                {rationale && (
                  <div
                    className="public-q-rationale q-html"
                    dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(rationale) }}
                  />
                )}
                <p className="public-q-disclaimer">
                  For exam preparation only. Not clinical guidance.
                </p>
              </div>
            )}

            {submitted && !isMcq && !InteractiveComponent && (
              <div className="public-q-result">
                {rationale && (
                  <div
                    className="public-q-rationale q-html"
                    dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(rationale) }}
                  />
                )}
                <p className="public-q-disclaimer">
                  For exam preparation only. Not clinical guidance.
                </p>
              </div>
            )}
          </>
        )}

        <div className="public-q-cta">
          <a
            className="public-q-cta-btn channel"
            href={WA_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow WhatsApp Channel
          </a>
          <a
            className="public-q-cta-btn chat"
            href={buildDmLink("", "today's Channel practice question")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask us on WhatsApp
          </a>
          <Link className="public-q-cta-btn ghost" to="/login">
            Sign in for full Q-bank
          </Link>
        </div>
      </article>
    </div>
  );
};

export default PublicQuestionPage;
