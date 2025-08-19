import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import SortableItemComponent from './SortTableItemComponent'; // Make sure this supports `id` prop
import '../../styles/DashboardStyles/DropSortQuestionComponent.css';

const DropSortQuestionComponent = () => {
  const [risk, setRisk] = useState('');
  const [condition, setCondition] = useState('');

  const [steps, setSteps] = useState([
    'Administer high-flow oxygen via a non-rebreather mask.',
    'Administer high-flow oxygen via a non-rebreather mask.',
    'Administer high-flow oxygen via a non-rebreather mask.',
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
      setSteps((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="dropsort-container">
      <h4 className="dropsort-question">
        The nurse knows that the client is at risk for developing&nbsp;
        <select value={risk} onChange={(e) => setRisk(e.target.value)}>
          <option value="">Select</option>
          <option value="pulmonary edema">Pulmonary Edema</option>
          <option value="cardiogenic shock">Cardiogenic Shock</option>
        </select>
        &nbsp;and&nbsp;
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select</option>
          <option value="respiratory failure">Respiratory Failure</option>
          <option value="arrhythmia">Arrhythmia</option>
        </select>
        &nbsp;if the condition is not managed.
      </h4>

      <div className="sort-box">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps} strategy={verticalListSortingStrategy}>
            {steps.map((step) => (
              <SortableItemComponent key={step} id={step} />
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

export default DropSortQuestionComponent;
