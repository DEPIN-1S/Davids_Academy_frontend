import React, { useState } from "react";
import "../../styles/DashboardStyles/QuestionFooterComponent.css";
import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PiCheckCircleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionBankResult } from "../../features/exam/examSlice";
import QuestionBankProgressCard from "./QuestionBankProgressCard";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";



const QuestionFooterComponent = ({
  onEnd,
  onNext,
  disableNext = false,
  questionNumber,
  totalQuestions,
  customButtonText = "Submit & Exit",
  customOnClick = onEnd,
}) => {

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate()
  const [showProgressCard, setShowProgressCard] = useState(false);

  const handleSubmitAndExit = () => {
    dispatch(getQuestionBankResult(token));
    setShowProgressCard(true);
  };
  const resultData = useSelector((state) => state.exam.questionBankResult);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isQuestionBankRoute = searchParams.get("mode") === "question-bank";


  return (
    <Box className="question-footer">

      <div className="left-buttons">
        <Button
          /* startIcon={<ArrowBackwardIosIco />} */
          /* onClick={customOnClick} */
          className="footer-button"
          color="error"
        >
          {/* {customButtonText} */}
        <span style={{paddingBottom:"4px", fontSize:"25px"}} ><IoIosArrowBack/></span>  Previous 
        </Button>
      </div>

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


          </>
        )}
      </div>

      <div className="right-buttons">
        <Button
          
          onClick={onNext}
          className="footer-button"
          disabled={disableNext}
        >
          Next <span style={{paddingBottom:"3px", fontSize:"25px"}}  ><IoIosArrowForward /></span>
        </Button>
      </div>

      {/* Render card only when needed */}
      {showProgressCard && (
        <QuestionBankProgressCard
          data={resultData}

          onClose={() => {
            setShowProgressCard(false);
            navigate("/student/question-bank");
          }}
        />
      )}


    </Box>
  );
};

export default QuestionFooterComponent;
