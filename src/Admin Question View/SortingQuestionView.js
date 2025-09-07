import React, { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItemComponentQuestionView from './SortableItemComponentQuestionView';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionData } from '../features/exam/examSlice'
import { Box, Typography } from '@mui/material';

/* import RevealAnswerComponent from './RevealAnswerComponent'; */

function SortingQuestionView() {
  const { questionId } = useParams()
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);
  console.log("Question id in params", questionId);
  const exhibit = 'https://via.placeholder.com/600x250.png?text=Exhibit+Image';
  useEffect(() => {
    if (questionId) {
      console.log("Dispatching thunk with questionId:", questionId);
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);
  useEffect(() => {
    console.log("Updated SortingQuestionData in state:", questionData);
  }, [questionData]);
  const [steps, setSteps] = useState([]);
  const question = questionData?.data || {};
  const sortingOptions = question?.sortingoptions || [];
const mark = questionData.data.marks;
  const difficulty = questionData.data.difficulty;
  const question_type = questionData.data.question_type;
  useEffect(() => {
    if (sortingOptions.length > 0) {
      // shuffle for user interaction
      setSteps([...sortingOptions].sort(() => Math.random() - 0.5));
    }
  }, [sortingOptions]);

  const [showReveal, setShowReveal] = useState(false);

  // Sensors for DND Kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // On drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleReveal = () => {
    setShowReveal(true);
  };

  return (
    <div className="sort-question-container">
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pb: 5,
      }} >
        <Typography >
          Mark :{mark}
        </Typography>
        <Typography >
          Difficulty :{difficulty}
        </Typography>
        <Typography >
          Question Type : {question_type}
        </Typography>
      </Box>
      <h4 className="sort-heading">{question?.question}</h4>
      {/* <p className="sort-subheading">
        Place the following actions in the order in which they should be performed, starting from first to last.
      </p> */}

      {/* Drag-and-drop before reveal */}
      {!showReveal && (
        <div className="sort-box">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((step) => step.id)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step, idx) => (
                <SortableItemComponentQuestionView
                  key={step.id}
                  id={step.id}
                  text={step.sortItem}
                  index={idx}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Reveal Button */}
      {/*  {!showReveal && (
        <div className="reveal-btn-wrap">
          <button className="reveal-btn" onClick={handleReveal}>
            Reveal Answer
          </button>
        </div>
      )} */}

      {/* Reveal Section */}
      {/* {showReveal && (
        <RevealAnswerComponent
          questionText={staticQuestion.question}
          explanationHeading={staticQuestion.explanation[0].heading}
          explanationParagraphs={staticQuestion.explanation.map(
            (e) => e.explanation
          )}
          additionalInfoHeading="Additional Info"
          additionalInfoParagraphs={staticQuestion.additionalInfo.map(
            (info) => info.info
          )}
          additionalInfoImage={staticQuestion.additionalInfo[0].image}
        >
          <div className="sort-box" style={{ marginBottom: '2rem' }}>
            <ol>
              {correctOrder.map((step) => (
                <li key={step.id} className="sorted-item">
                  {step.sortItem}
                </li>
              ))}
            </ol>
          </div>
        </RevealAnswerComponent>
      )} */}
    </div>
  );
}

export default SortingQuestionView;
