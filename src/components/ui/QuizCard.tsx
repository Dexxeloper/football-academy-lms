'use client';

import React, { useState } from 'react';
import { Quiz } from '@/types/database';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { Badge } from './Badge';
import { useTranslation } from '@/lib/i18n';

interface QuizCardProps {
  quiz: Quiz;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const { t } = useTranslation();
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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-50 border border-green-200/80 text-green-700 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{quiz.description}</p>
          </div>
        </div>
        <Badge variant="purple" size="md">
          {t('quiz.passingScore')}: {quiz.passing_score}%
        </Badge>
      </div>

      {!isSubmitted ? (
        <div>
          {/* Question Indicator & Progress */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
            <span>
              {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {totalQuestions}
            </span>
            <span className="text-green-700 font-bold">
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
            </span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-green-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%` }}
            />
          </div>

          {/* Question Text */}
          <h4 className="text-base font-bold text-gray-900 mb-6 leading-snug">
            {question.question_text}
          </h4>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              const selected = selectedOptions[currentQuestionIndex] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    selected
                      ? 'bg-green-50 border-green-500 text-green-950 font-medium shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/70'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                      selected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              {t('quiz.previousQuestion')}
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={!isSelected}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-40 disabled:hover:bg-green-600"
              >
                {t('quiz.nextQuestion')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(selectedOptions).length < totalQuestions}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-40 shadow-green-600/20"
              >
                {t('quiz.submitQuiz')}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6">
          <div className="inline-flex p-4 rounded-2xl bg-green-50 border border-green-200/80 mb-4 shadow-sm">
            {passed ? (
              <Award className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-rose-600" />
            )}
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-1">
            {passed ? t('quiz.passed') : t('quiz.failed')}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {t('quiz.yourScore')}: <span className="text-green-700 font-bold text-lg">{score}%</span> ({t('quiz.passingScore')}: {quiz.passing_score}%)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all border border-gray-200"
            >
              <RotateCcw className="w-4 h-4" /> {t('quiz.retakeQuiz')}
            </button>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl text-xs transition-all border border-green-200"
            >
              {showExplanation ? t('quiz.hideExplanations') : t('quiz.viewExplanations')}
            </button>
          </div>

          {showExplanation && (
            <div className="mt-8 text-left space-y-4 border-t border-gray-100 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                {t('quiz.tacticalRationale')}
              </h4>
              {quiz.questions.map((q, idx) => {
                const userChoice = selectedOptions[idx];
                const isCorrect = userChoice === q.correct_option_index;
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                    <div className="flex items-center gap-2 mb-2 font-semibold">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <span className="text-gray-900 font-bold">{idx + 1}. {q.question_text}</span>
                    </div>
                    <p className="text-gray-600 pl-6 leading-relaxed">
                      <strong className="text-green-700">{t('quiz.tacticalRationale')}:</strong> {q.explanation}
                    </p>
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
