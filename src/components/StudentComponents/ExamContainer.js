import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuestionHeaderComponent from './QuestionHeaderComponent';
import QuestionFooterComponent from './QuestionFooterComponent';

// Import your question components
import MCQ from './MCQQuestionComponent';
import Dropdown from './DropdownQuestionComponent';
import Sorting from './SortQuestionComponent';
import FillIn from './FillInQuestionComponent';
import DragDrop from './DragDropQuestionComponent';
import SentenceHighlight from './SentenceQuestionComponent';
import MultiRadio from './MultiRadioQuestionComponent';

import {
    getQBankQuestions,
    getQBankQuestionData
} from '../../features/exam/examSlice'; // update as per your path

const questionTypeToComponent = {
    'MCQ': MCQ,
    'Dropdown': Dropdown,
    'Sorting': Sorting,
    'Fill in the Blanks': FillIn,
    'Drag Drop': DragDrop,
    'Sentence Highlight': SentenceHighlight,
    'Multiple Radio': MultiRadio,
};

const ExamContainer = ({ user }) => {
    const dispatch = useDispatch();

    const { qBankQuestion: questionIds, qBankQuestionLoading } = useSelector(
        (state) => state.exam // or state.exam depending on your slice
    );
    const {
        qBankQuestionData: currentQuestion,
        qBankQuestionDataLoading
    } = useSelector((state) => state.exam); // or state.exam

    const [currentIndex, setCurrentIndex] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // On mount, fetch all question ids
    useEffect(() => {
        dispatch(getQBankQuestions());
    }, [dispatch]);

    // On change of questionIds or currentIndex, fetch new question data
    useEffect(() => {
        if (questionIds && questionIds.length > 0) {
            dispatch(getQBankQuestionData(questionIds[currentIndex]));
        }
    }, [questionIds, currentIndex, dispatch]);

    // Timer for tracking elapsed time (one timer for the whole exam!)
    useEffect(() => {
        const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Handlers for next/previous
    const handleNext = useCallback(() => {
        if (questionIds && currentIndex < questionIds.length - 1) {
            setCurrentIndex((idx) => idx + 1);
        }
    }, [questionIds, currentIndex]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((idx) => idx - 1);
        }
    }, [currentIndex]);

    const handlePause = () => {
        // Implement pause logic (optional)
    };

    const handleEnd = () => {
        // Implement exam submit/end logic
    };

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
    };

    // Dynamic render
    const QuestionComponent =
        currentQuestion && !qBankQuestionDataLoading
            ? questionTypeToComponent[currentQuestion.question_type]
            : null;

    if (qBankQuestionLoading || (!questionIds || questionIds.length === 0)) {
        return <div>Loading question list...</div>;
    }

    return (
        <>
            <QuestionHeaderComponent
                questionNumber={currentIndex + 1}
                totalQuestions={questionIds.length}
                qid={currentQuestion?.id || 'N/A'}
                user={user?.name || 'Guest'}
                time={formatTime(elapsedSeconds)}
            />

            <div style={{ marginTop: '2rem' }}>
                {qBankQuestionDataLoading ? (
                    <p>Loading question...</p>
                ) : QuestionComponent ? (
                    <QuestionComponent question={currentQuestion} />
                ) : (
                    <p>No question to display.</p>
                )}
            </div>

            <QuestionFooterComponent
                onEnd={handleEnd}
                onPause={handlePause}
                onNext={handleNext}
                onPrevious={handlePrevious}
                disablePrevious={currentIndex === 0}
                disableNext={questionIds && currentIndex === questionIds.length - 1}
                questionNumber={currentIndex + 1}
                totalQuestions={questionIds.length}
            />
        </>
    );
};

export default ExamContainer;
