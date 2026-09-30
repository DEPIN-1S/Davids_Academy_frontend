import React from 'react';
import { render, screen } from '@testing-library/react';
import SortQuestionComponent from './SortQuestionComponent';

// Mock react-redux and react-router-dom
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/student/exam',
    search: '?testId=123',
  }),
}));

describe('SortQuestionComponent', () => {
  const mockQuestion = {
    id: 1,
    question: 'Arrange the steps for intermediate-acting insulin administration.',
    sortingoptions: [
      { id: 1, sortItem: 'Step A: Inspect the bottle.', itemOrder: 1 },
      { id: 2, sortItem: 'Step B: Draw the insulin.', itemOrder: 2 },
    ],
    explanation: [],
    additionalInfo: [],
    marks: 5,
    tabsInfo: [],
  };

  test('renders the sorting question component and options correctly', () => {
    const mockOnSubmit = jest.fn();
    render(
      <SortQuestionComponent question={mockQuestion} onSubmit={mockOnSubmit} />
    );

    // Verify question text is rendered
    expect(screen.getByText(/Arrange the steps for intermediate-acting insulin/i)).toBeInTheDocument();
    
    // Verify instruction is rendered
    expect(screen.getByText(/Place the following actions in the order/i)).toBeInTheDocument();
    
    // Verify sorting items are rendered
    expect(screen.getByText(/Step A: Inspect the bottle/i)).toBeInTheDocument();
    expect(screen.getByText(/Step B: Draw the insulin/i)).toBeInTheDocument();
  });
});
