import React, { useState } from 'react';
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
import SortableItemComponent from './SortTableItemComponent';
import RevealAnswerComponent from './RevealAnswerComponent'; // Adjust path as needed
import '../../styles/DashboardStyles/SortQuestionComponent.css';

const SortQuestionComponent = ({ question }) => {
  // Build user-sortable steps from API data (randomized)
  const initialUserSteps = (question.sortingoptions || [])
    .map(opt => ({
      id: String(opt.id),
      text: opt.sortItem,
      order: opt.itemOrder ?? null,
    }))
    .sort(() => Math.random() - 0.5); // Randomize for user challenge

  const [steps, setSteps] = useState(initialUserSteps);
  const [showReveal, setShowReveal] = useState(false);

  // Sensors for DND Kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // On drag end, update order
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

  // The correct order (from itemOrder, fallback to insertion if missing)
  const correctOrder = (question.sortingoptions || [])
    .map(opt => ({
      id: String(opt.id),
      text: opt.sortItem,
      order: typeof opt.itemOrder !== 'undefined' ? opt.itemOrder : 9999, // fallback large number
    }))
    .sort((a, b) => a.order - b.order);

  // Explanation and Additional Info
  const explanationHeading = question.explanation?.[0]?.heading || 'Explanation';
  const explanationParagraphs = question.explanation?.map((e) => e.explanation) || [];
  const additionalInfoHeading = 'Additional Info';
  const additionalInfoParagraphs = question.additionalInfo?.map((info) => info.info) || [];
  const additionalInfoImage = question.additionalInfo?.[0]?.image || null;

  return (
    <div className="sort-question-container">
      <h4 className="sort-heading">{question.question}</h4>
      <p className="sort-subheading">
        Place the following actions in the order in which they should be performed, starting from first to last.
      </p>

      {/* Drag-and-drop Sort List: Only before Reveal */}
      {!showReveal && (
        <div className="sort-box">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map((step) => step.id)} strategy={verticalListSortingStrategy}>
              {steps.map((step, idx) => (
                <SortableItemComponent
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
      {!showReveal && (
        <div className="reveal-btn-wrap">
          <button className="reveal-btn" onClick={handleReveal}>
            Reveal Answer
          </button>
        </div>
      )}

      {/* Answer Reveal Section */}
      {showReveal && (
        <RevealAnswerComponent
          questionText={question.question}
          explanationHeading={explanationHeading}
          explanationParagraphs={explanationParagraphs}
          additionalInfoHeading={additionalInfoHeading}
          additionalInfoParagraphs={additionalInfoParagraphs}
          additionalInfoImage={additionalInfoImage}
        >
          <div className="sort-box" style={{ marginBottom: '2rem' }}>
            <ol>
              {correctOrder.map((step, idx) => (
                <li key={step.id} className="sorted-item">
                  {step.text}
                </li>
              ))}
            </ol>
          </div>
        </RevealAnswerComponent>
      )}
    </div>
  );
};

export default SortQuestionComponent;
