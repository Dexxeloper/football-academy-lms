'use client';

import React, { useState } from 'react';
import { Quiz } from '@/types/database';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { Badge } from './Badge';

interface QuizCardProps {
  quiz: Quiz;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isSelected = selectedOptions[currentQuestionIndex] !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correct_option_index) {
        correctCount++;
      }
    });
    return Math.round((correctCount / totalQuestions) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const passed = score >= quiz.passing_score;
    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const handleReset = () => {
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const passed = score >= quiz.passing_score;

  return (
    <div className="bg-navy-card border border-navy-border rounded-2xl p-6 shadow-2xl">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
            <p className="text-xs text-slate-400">{quiz.description}</p>
          </div>
        </div>
        <Badge variant="purple">Passing: {quiz.passing_score}%</Badge>
      </div>

      {!isSubmitted ? (
        <div>
          {/* Question Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="text-emerald-400 font-bold">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>

          {/* Question Text */}
          <h4 className="text-base font-semibold text-slate-100 mb-6 leading-snug">
            {question.question_text}
          </h4>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              const selected = selectedOptions[currentQuestionIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    selected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      selected ? 'bg-emerald-500 text-navy' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              Previous Question
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={!isSelected}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy font-bold rounded-xl text-xs transition-colors disabled:opacity-40 disabled:hover:bg-emerald-500"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedOptions).length < totalQuestions}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy font-bold rounded-xl text-xs transition-colors shadow-lg disabled:opacity-40 shadow-emerald-500/20"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6">
          <div className="inline-flex p-4 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-xl">
            {passed ? (
              <Award className="w-12 h-12 text-emerald-400 animate-bounce" />
            ) : (
              <XCircle className="w-12 h-12 text-rose-500" />
            )}
          </div>

          <h3 className="text-2xl font-black text-white mb-1">
            {passed ? 'Quiz Passed!' : 'Requires Review'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            You scored <span className="text-emerald-400 font-bold text-lg">{score}%</span> (Passing score: {quiz.passing_score}%)
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-xs transition-all border border-emerald-500/30"
            >
              {showExplanation ? 'Hide Key Explanations' : 'View Explanations'}
            </button>
          </div>

          {showExplanation && (
            <div className="mt-8 text-left space-y-4 border-t border-slate-800 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tactical Explanations</h4>
              {quiz.questions.map((q, idx) => {
                const userChoice = selectedOptions[idx];
                const isCorrect = userChoice === q.correct_option_index;
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-2 font-semibold">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="text-slate-200">{idx + 1}. {q.question_text}</span>
                    </div>
                    <p className="text-slate-400 pl-6"><strong className="text-emerald-400">Tactical Rationale:</strong> {q.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
