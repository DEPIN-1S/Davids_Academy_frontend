import React, { useState } from 'react'
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
/* import RevealAnswerComponent from './RevealAnswerComponent'; */

function SortingQuestionView() {
  // ✅ Static data
  const staticQuestion = {
    question: "Arrange the steps for performing CPR in the correct order.",
    sortingoptions: [
      { id: 1, sortItem: "Check the scene for safety", itemOrder: 1 },
      { id: 2, sortItem: "Call emergency services", itemOrder: 2 },
      { id: 3, sortItem: "Begin chest compressions", itemOrder: 3 },
      { id: 4, sortItem: "Give rescue breaths", itemOrder: 4 },
    ],
    explanation: [
      {
        heading: "Why this order matters",
        explanation:
          "Ensuring safety first avoids putting yourself at risk. Calling for help ensures advanced care is on the way, while chest compressions and breaths maintain oxygen flow.",
      },
    ],
    additionalInfo: [
      {
        info: "Always follow the latest medical guidelines for CPR.",
        image: null,
      },
    ],
  };

  // Shuffle user steps
  const initialUserSteps = [...staticQuestion.sortingoptions].sort(
    () => Math.random() - 0.5
  );

  const [steps, setSteps] = useState(initialUserSteps);
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

  // Correct order (sorted by itemOrder)
  const correctOrder = [...staticQuestion.sortingoptions].sort(
    (a, b) => a.itemOrder - b.itemOrder
  );

  return (
    <div className="sort-question-container">
      <h4 className="sort-heading">{staticQuestion.question}</h4>
      <p className="sort-subheading">
        Place the following actions in the order in which they should be performed, starting from first to last.
      </p>

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
                  text={step.text}
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
