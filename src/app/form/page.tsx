"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const questions = [
  { id: 1, question: 'What is the Above-Ground Biomass (AGB) from the dMRV per ha?', type: 'number' },
  { id: 2, question: 'Number of ha of the project', type: 'number' },
  { id: 3, question: 'Provide your crown cover if you have it', type: 'number' },
];

const FormPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  // Load saved answers from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAnswers = JSON.parse(localStorage.getItem('formAnswers') || '[]');
      if (savedAnswers.length === questions.length) {
        setAnswers(savedAnswers);
      }
    }
  }, []);



  const handleNext = () => {
    if (validateAnswer(answers[currentQuestion])) {
      setError('');
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 300);
    } else {
      setError('Please enter a valid number');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setCurrentQuestion(currentQuestion - 1);
        setError('');
      }, 300);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
    localStorage.setItem('formAnswers', JSON.stringify(newAnswers));
  };

  const validateAnswer = (answer: string) => {
    const value = Number(answer);
    if (isNaN(value)) return false;

    if (currentQuestion === 2 && (value < 0 || value > 1)) {
      setError('Crown cover must be between 0 and 1');
      return false;
    }
    return true;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleCalculate = () => {
    if (validateAnswer(answers[currentQuestion])) {
      const [AGB, HA, CROWN] = answers.map(Number);
      const result = 0.47 * 44 / 12 * AGB * 1.25 * HA * CROWN;
      setResult(result);
      setShowResult(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setError('Please enter a valid number');
    }
  };

  const handleRedo = () => {
    // setAnswers(Array(questions.length).fill(''));
    setCurrentQuestion(0);
    setShowResult(false);
    setResult(null);
    // if (typeof window !== "undefined") {
    //   localStorage.removeItem('formAnswers');
    // }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isLastQuestion) {
          handleCalculate();
        } else {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestion, answers]);

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <style jsx>{`
        @layer utilities {
          .slide-up {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
          }
          .slide-down {
            transform: translateY(100%);
            transition: transform 0.3s ease-in-out;
          }
          .slide-active {
            transform: translateY(0);
            transition: transform 0.3s ease-in-out;
          }
        }
      `}</style>
      <header className="text-center mb-8">
        <Link href="/">
          <span className="text-4xl font-bold hover:underline cursor-pointer">Baseline Calculator</span>
        </Link>
        <p className="text-xl text-gray-600">by Carbonable</p>
      </header>
      {!showResult ? (
        <div className="bg-white p-8 rounded w-full max-w-xl sm:max-w-2xl relative overflow-hidden border-transparent h-64">
          <div className={`absolute inset-0 ${animating ? 'slide-down' : 'slide-active'}`}>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{questions[currentQuestion].question}</h2>
            <p className="text-gray-500 mb-4">Put zero if you don't have it</p>
            <input
              type="text"
              value={answers[currentQuestion]}
              onChange={handleChange}
              className="border-b-2 border-gray-300 p-2 mb-4 w-full focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Type your answer here..."
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="text-blue-500 disabled:text-gray-300 flex items-center"
              >
                &uarr; <span className="ml-2">Previous</span>
              </button>
              {!isLastQuestion && <span className="text-gray-500">press Enter</span>}
              {isLastQuestion ? (
                <button
                  onClick={handleCalculate}
                  className="text-2xl font-bold text-blue-500"
                >
                  OK
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="text-blue-500 flex items-center"
                >
                  <span className="mr-2">Next</span> &darr;
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-white p-8 rounded w-full max-w-xl sm:max-w-2xl relative overflow-hidden border-transparent h-64 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-green-500 animate-bounce">
              Result: {formatNumber(result)} tons of CO2
            </h2>
          </div>
          <button
            onClick={handleRedo}
            className="mt-8 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Redo Form
          </button>
        </div>
      )}
    </div>
  );
};

export default FormPage;
