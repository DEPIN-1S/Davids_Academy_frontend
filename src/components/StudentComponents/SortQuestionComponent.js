// SortQuestionComponent.jsx
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
import '../../styles/DashboardStyles/SortQuestionComponent.css';

const SortQuestionComponent = () => {
  const [steps, setSteps] = useState([
    { id: 'step-1', text: 'Suctions the client as the catheter is removed for a maximum of 15 seconds.' },
    { id: 'step-2', text: 'Suctions the client as the catheter is removed for a maximum of 15 seconds.' },
    { id: 'step-3', text: 'Suctions the client as the catheter is removed for a maximum of 15 seconds.' },
    { id: 'step-4', text: 'Suctions the client as the catheter is removed for a maximum of 15 seconds.' },
    { id: 'step-5', text: 'Suctions the client as the catheter is removed for a maximum of 15 seconds.' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <div className="sort-question-container">
      <h4 className="sort-heading">
        The nurse is preparing to suction a client’s tracheostomy.
      </h4>
      <p className="sort-subheading">
        Place the following actions in the order in which they should be performed, starting from first to last.
      </p>

      <div className="sort-box">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps.map((step) => step.id)} strategy={verticalListSortingStrategy}>
            {steps.map((step) => (
              <SortableItemComponent key={step.id} id={step.id} text={step.text} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="reveal-btn-wrap">
        <button className="reveal-btn">Reveal Answer</button>
      </div>
    </div>
  );
};

export default SortQuestionComponent;
