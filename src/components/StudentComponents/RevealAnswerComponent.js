import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useContext, useEffect } from "react";
import { SampleQuestionnaireResultContext } from '../../context/ResultProvider';
import { sanitizeExamHtml } from '../../utils/examHtml';



const RevealAnswerComponent = ({
  questionText = '',
  explanationHeading = 'Explanation',
  explanationParagraphs = [],
  additionalInfoHeading = 'Additional Info',
  additionalInfoParagraphs = [],
  additionalInfoImage = null, // URL string or null
  isAnswerCorrect, // ← Destructure here
  submittedResult
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  sessionStorage.setItem("isRevealed", "true");

  // for sample questionare result calculation
  const { setSampleQuestionnaireResult } =
    useContext(SampleQuestionnaireResultContext);

  const hasUpdated = React.useRef(false);

  useEffect(() => {

    if (submittedResult?.result || hasUpdated.current) return;

    if (hasUpdated.current) return; // prevent second run
    hasUpdated.current = true;

    setSampleQuestionnaireResult(prev => ({
      ...prev,
      attemptedQuestion: prev.attemptedQuestion + 1,
      corrected: isAnswerCorrect ? prev.corrected + 1 : prev.corrected
    }));
  }, [isAnswerCorrect, setSampleQuestionnaireResult, submittedResult]);



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        pt:3
      }}
    >

      {/* Left - Question & Explanation */}
      <Box
        className="q-attention-section"
        sx={{
          flex: 2,
        }}
      >

        <div
          className={`q-verdict ${isAnswerCorrect ? "q-verdict-ok" : "q-verdict-bad"}`}
          role="status"
          aria-live="polite"
        >
          <span className="q-verdict-mark">{isAnswerCorrect ? "✓" : "✕"}</span>
          <span className="q-verdict-title">
            {isAnswerCorrect ? "Correct" : "Incorrect"}
          </span>
          <span className="q-verdict-sep">·</span>
          <span className="q-verdict-note">
            {isAnswerCorrect ? "locked" : "review below"}
          </span>
        </div>

        {/* Explanation heading (supports custom HTML) */}
        {explanationHeading && (
          <Typography
            className="q-attention-heading q-html"
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            fontWeight={800}
            mb={1.5}
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(explanationHeading) }}
          />
        )}

        {/* Explanation paragraphs (supports HTML) */}
        {explanationParagraphs.map((para, idx) => (
          <Typography
            key={`exp-${idx}`}
            className="q-attention-body q-html"
            variant="body2"
            align="left"
            paragraph
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(para) }}
          />
        ))}


        {/* Show heading only if there is real additional info */}
        {(additionalInfoParagraphs?.some(p => p.trim() !== "") || additionalInfoImage) && (
          <Typography
            className="q-attention-heading q-html"
            fontWeight={800}
            mt={3}
            mb={1.5}
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(additionalInfoHeading) }}
          />
        )}

        {/* Additional Info paragraphs (supports HTML) */}
        {additionalInfoParagraphs.map((para, idx) => (
          <Typography
            key={`info-${idx}`}
            className="q-attention-body q-html"
            variant="body2"
            align="left"
            paragraph
            sx={{
              '& p': { margin: 0, marginBottom: '0.5em' },
              '& p:last-child': { marginBottom: 0 },
            }}
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(para) }}
          />
        ))}

        {/* Additional Info Image */}
        {additionalInfoImage && (
          <Box
            component="img"
            src={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}${additionalInfoImage}`}
            alt="Additional Info"
            sx={{ width: '100%', mt: 2, borderRadius: 2 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default RevealAnswerComponent;
