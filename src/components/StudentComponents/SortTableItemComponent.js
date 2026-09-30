import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { sanitizeExamHtml } from '../../utils/examHtml';

const SortableItemComponent = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item" {...attributes} {...listeners}>
      <span className="drag-icon">≡</span> <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(text) }} />
    </div>
  );
};

export default SortableItemComponent;
