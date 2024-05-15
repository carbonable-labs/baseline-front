"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import biomassDataRaw from './biomassData.json';

// Définir l'interface pour les données de biomasse
interface BiomassData {
  [key: string]: number | null;
}

const biomassData = biomassDataRaw as BiomassData;

const questions = [
  { id: 1, question: 'In which country is your project located?', type: 'select', options: Object.keys(biomassData) },
  { id: 2, question: 'Number of hectares (ha) of the project area', type: 'number' },
  { id: 3, question: 'Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)', type: 'number' },
  { id: 4, question: 'Provide the shrub crown cover (e.g., 0.10 for 10%)', type: 'number' },
  { id: 5, question: 'Provide the area (ha) occupied by shrub biomass', type: 'number' },
  { id: 6, question: 'Is there transparent and verifiable information to justify a different root-shoot ratio for trees? If yes, provide the value. Otherwise, leave it as 0.25.', type: 'number', default: 0.25 },
  { id: 7, question: 'Is there transparent and verifiable information to justify a different root-shoot ratio for shrubs? If yes, provide the value. Otherwise, leave it as 0.40.', type: 'number', default: 0.40 },
  { id: 8, question: 'Is there transparent and verifiable information to justify a different shrub biomass ratio (BDRSF)? If yes, provide the value. Otherwise, leave it as 0.10.', type: 'number', default: 0.10 }
];

const FormPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number >(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [bFOREST, setBFOREST] = useState<number | null>(null);

  // Load saved answers from localStorage on component mount
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('formAnswers') || '[]');
    if (savedAnswers.length === questions.length) {
      setAnswers(savedAnswers);
    } else {
      // Set default values for specific questions
      const newAnswers = [...answers];
      questions.forEach((question, index) => {
        if (question.default !== undefined) {
          newAnswers[index] = question.default.toString();
        }
      });
      setAnswers(newAnswers);
    }
    // Trigger fade-in effect after component mounts
    setFadeIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('formAnswers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (answers[0]) {
      const region = answers[0];
      const biomassValue = biomassData[region as keyof BiomassData];
      setBFOREST(biomassValue);
    }
  }, [answers[0]]);

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
      setError('Please enter a valid answer');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
    localStorage.setItem('formAnswers', JSON.stringify(newAnswers));
  };

  const validateAnswer = (answer: string) => {
    if (questions[currentQuestion].type === 'number') {
      const value = Number(answer);
      if (isNaN(value)) return false;

      if (currentQuestion === 3 && (value < 0 || value > 1)) {
        setError('Crown cover must be between 0 and 1');
        return false;
      }
    }
    return true;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleCalculate = () => {
    if (!bFOREST) {
      setError('Please select a region');
      return;
    }
    if (validateAnswer(answers[currentQuestion])) {
      const [region, ha, treeCrownCover, shrubCrownCover, shrubArea, treeRootShoot, shrubRootShoot, shrubBiomass] = answers.map(Number);
      const bFOREST = biomassData[region];
      const CFTREE = 0.47;
      const CFS = 0.47;

      // Calculating CTREE_BASELINE
      const CTREE_BASELINE = (44 / 12) * CFTREE * bFOREST * (1 + treeRootShoot) * treeCrownCover * ha;

      // Calculating CSHRUB_t
      const CSHRUB_t = (44 / 12) * CFS * (1 + shrubRootShoot) * shrubArea * shrubBiomass * bFOREST * shrubCrownCover;

      // Final CO2 estimated value
      const finalCO2Estimated = CTREE_BASELINE + CSHRUB_t;

      setResult(finalCO2Estimated);
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
    setCurrentQuestion(0);
    setShowResult(false);
    localStorage.removeItem('formAnswers');
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
    <div className={`min-h-screen flex flex-col items-center justify-center bg-white p-4 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="text-center p-4">
          <Link href="/">
            <span className="text-4xl font-bold hover:underline cursor-pointer">Baseline Calculator</span>
          </Link>
          <p className="text-xl text-gray-600">by Carbonable</p>
        </div>
      </header>
      {!showResult ? (
        <div className="bg-white p-8 rounded w-full max-w-xl sm:max-w-2xl relative overflow-hidden border-transparent h-64 grid grid-cols-5">
          <div className={`absolute inset-0 ${animating ? 'slide-down' : 'slide-active'}`}>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{questions[currentQuestion].question}</h2>
            <p className="text-gray-500 mb-4">Put zero if you don't have it</p>
            {questions[currentQuestion].type === 'select' ? (
              <select
                value={answers[currentQuestion]}
                onChange={handleChange}
                className="border-b-2 border-gray-300 p-2 mb-4 w-full focus:outline-none focus:border-blue-500 text-gray-800"
              >
                <option value="">Select your region</option>
                {questions[currentQuestion].options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={questions[currentQuestion].type}
                value={answers[currentQuestion]}
                onChange={handleChange}
                className="border-b-2 border-gray-300 p-2 mb-4 w-full focus:outline-none focus:border-blue-500 text-gray-800"
                placeholder="Type your answer here..."
              />
            )}
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