import React, { useEffect, useState } from "react";
import "../../styles/DashboardStyles/QuestionFooterComponent.css";
import { Box, Button, Typography } from "@mui/material";
import { PiCheckCircleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionBankResult } from "../../features/exam/examSlice";
import QuestionBankProgressCard from "./QuestionBankProgressCard";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import SampleQuestionnaireProgressCard from "./SampleQuestionnaireProgressCard";




const QuestionFooterComponent = ({
  onEnd,
  onNext,
  disablePrevious = false,
  onPrevious,
  onSkip,
  skipCount,
  questionNumber,
  totalQuestions,
  customButtonText = "Submit & Exit",
  customOnClick = onEnd,
}) => {

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate()
  const [showProgressCard, setShowProgressCard] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isQuestionBankRoute = searchParams.get("mode") === "question-bank";
  const topicsQuery = searchParams.get("topics") || "";
  const isSampleRoute = searchParams.get("mode") === "sample";
  const [, setIsRevealed] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);

  const handleSubmitAndExit = () => {
    dispatch(getQuestionBankResult({ token, topicsQuery }));
    setShowProgressCard(true);
  };
  
  const resultData = useSelector((state) => state.exam.questionBankResult);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showSampleProgressCard, setShowSampleProgressCard] = useState(false);

  useEffect(() => {
    const checkRevealStatus = () => {
      const status = sessionStorage.getItem("isRevealed") === "true";
      setIsRevealed(status);
    };

    checkRevealStatus();
    const interval = setInterval(checkRevealStatus, 200);
    return () => clearInterval(interval);
  }, []);

  const [showSampleCompletedModal, setShowSampleCompletedModal] = useState(false);


  return (
    <Box className="question-footer">

      {!isSampleRoute && (
        <div className="left-buttons">
          <Button
            onClick={onPrevious}
            className="footer-button"
            color="error"
            disabled={disablePrevious || questionNumber === 1}
          >
            <span style={{ paddingBottom: "4px", fontSize: "25px" }} >
              <IoIosArrowBack />
            </span>
            Previous
          </Button>
        </div>
      )}


      <div className="center-info">
        {questionNumber && totalQuestions && (
          <>
            <Typography className="questionNo" variant="body2" style={{ color: "white" }}>
              Question {questionNumber} of {totalQuestions}
            </Typography>

            {/* display only on Q-Bank question */}
            {isQuestionBankRoute && customButtonText !== "Submit & Exit" && (
              <Button
                className="submit-and-exit-button"
                onClick={handleSubmitAndExit}
              >
                Submit & Exit{" "}
                <span style={{ paddingLeft: "3px", paddingBottom: "4px" }}>
                  <PiCheckCircleBold style={{ fontSize: "19px" }} />
                </span>
              </Button>
            )}

            {isSampleRoute && (
              <Button
                className="submit-and-exit-button"
                onClick={() => setShowSampleProgressCard(true)}
              >
                Finish & View Progress{" "}
                <span style={{ paddingLeft: "3px", paddingBottom: "4px" }}>
                  <PiCheckCircleBold style={{ fontSize: "19px" }} />
                </span>
              </Button>
            )}
          </>
        )}
      </div>



      <div className="right-buttons">
        <Button
          className="footer-button"
          onClick={onSkip}
          variant="outlined"
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", mr: { xs: 1, md: 2 }, textTransform: "none", borderRadius: "8px", '&:hover': { borderColor: "white" } }}
        >
          Skip
        </Button>
        <Button
          disabled={false}
          onClick={() => {
            const hasAnswered = sessionStorage.getItem("hasAnswered") === "true";
            const hasRevealed = sessionStorage.getItem("isRevealed") === "true";

            if (!hasAnswered || !hasRevealed) {
              setShowNotAnsweredModal(true); // Show modal
              return;
            }

            // SAMPLE QUESTIONNAIRE COMPLETION CHECK
            if (isSampleRoute && questionNumber === totalQuestions) {
              setShowSampleCompletedModal(true);
              return;
            }

            if (questionNumber === totalQuestions) {
              setShowCompletedModal(true);
            } else {
              onNext();
            }
          }}

          className="footer-button"

        >
          Next  <span style={{ paddingBottom: "3px", fontSize: "25px" }}  ><IoIosArrowForward /></span>
        </Button>
      </div>

      {/* Render card only when needed */}
      {/*  {showProgressCard && (
        <QuestionBankProgressCard
          data={resultData}

          onClose={() => {
            setShowProgressCard(false);
            navigate("/student/question-bank");
          }}
        />
      )} */}

      {showProgressCard && (
        <QuestionBankProgressCard data={resultData} />
      )}

      {showSampleProgressCard && (
        <SampleQuestionnaireProgressCard
          onClose={() => {
            setShowSampleProgressCard(false);
            navigate("/");
          }}
        />
      )}


      {showCompletedModal && (
        <div className="mocktest-modal-overlay">
          <div className="mocktest-modal simple-modal">
            <img src="/images/logo.png" width={70} alt="logo" className="card-logo" />
            <h3 className="mock-modal-title">Mock Test Completed</h3>
            <p className="modal-text">You have successfully answered all questions.</p>

            <button
              onClick={() => {
                setShowCompletedModal(false);
                const testId = searchParams.get("testId");
                navigate("/student/tests", {
                  state: testId ? { analyzeTestId: testId } : undefined,
                });
              }}
              className="mock-modal-btn"
            >
              View Result
            </button>
          </div>
        </div>
      )}

      {showNotAnsweredModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: "12px",
              width: "90%",
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#2e3760",
              }}
            >
              Please answer the question and reveal the answer before moving to the
              next question.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setShowNotAnsweredModal(false)}
              sx={{ backgroundColor: "#2e3760" }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}

      {showSampleCompletedModal && (
        <div className="mocktest-modal-overlay">
          <div className="mocktest-modal simple-modal">
            <img
              src="/images/logo.png"
              width={70}
              alt="logo"
              className="card-logo"
            />

            <h3 className="mock-modal-title">Sample Test Completed</h3>

            <p className="modal-text">
              You have successfully completed the sample questionnaire.
            </p>

            <button
              onClick={() => {
                setShowSampleCompletedModal(false);
                setShowSampleProgressCard(true); // ⬅ open the report card
              }}
              className="mock-modal-btn"
            >
              Submit & View Progress
            </button>
          </div>
        </div>
      )}

    </Box>
  );
};

export default QuestionFooterComponent;
