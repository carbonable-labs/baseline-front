"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import biomassDataRaw from './biomassData.json';

// Define the interface for biomass data
interface BiomassData {
  [key: string]: number | null;
}

const biomassData = biomassDataRaw as BiomassData;

const questions = [
  // Questions for baseline data
  { id: 1, question: 'In which country is your project located?', type: 'select', options: Object.keys(biomassData) },
  { id: 2, question: 'Number of hectares (ha) of the project area', type: 'number' },
  { id: 3, question: 'Information - Let\'s estimate the carbon stock before your restauration project', type: 'information', info: 'If you don`t have any data, we will set it to 0.' },
  { id: 4, question: 'Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)', type: 'number' },
  { id: 5, question: 'Provide the shrub crown cover (e.g., 0.10 for 10%)', type: 'number' },
  { id: 6, question: 'Provide the area (ha) occupied by shrub biomass', type: 'number' },
  { id: 7, question: 'Information - Let\'s estimate the carbon stock after your restauration project', type: 'information', info: 'This will help us calculate the CO2 sequestration.' },

  // Questions for project data
  { id: 8, question: 'Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)', type: 'number' },
  { id: 9, question: 'Provide the shrub crown cover (e.g., 0.10 for 10%)', type: 'number' },
  { id: 10, question: 'Provide the area (ha) occupied by shrub biomass', type: 'number' },
  { id: 11, question: 'Different tree root-shoot ratio? Provide or default to 0.25.', type: 'number', default: 0.25 },
  { id: 12, question: 'Different shrub root-shoot ratio? Provide or default to 0.40.', type: 'number', default: 0.40 },
  { id: 13, question: 'Different shrub biomass ratio (BDRSF)? Provide or default to 0.10.', type: 'number', default: 0.10 }
];

const FormPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const initializeAnswers = () => {
    const savedAnswers = JSON.parse(localStorage.getItem('formAnswers') || '[]');
    if (savedAnswers.length === questions.length) {
      return savedAnswers;
    }
    const initialAnswers = questions.map(q => (q.default !== undefined ? q.default.toString() : ''));
    return initialAnswers;
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(initializeAnswers());
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number>(0);
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
    if (validateAnswer(answers[currentQuestion])) {
      const [
        region, ha, _, treeCrownCover, shrubCrownCover, shrubArea,
        __, projectTreeCrownCover, projectShrubCrownCover, projectShrubArea,
        treeRootShoot, shrubRootShoot, shrubBiomass
      ] = answers.map(Number);
      const selectedRegion = answers[0]; // Get the region from the answers array
      const bFOREST = biomassData[selectedRegion as keyof BiomassData]; // Fetch the biomass data for the region
      const CFTREE = 0.47;
      const CFS = 0.47;

      if (!bFOREST) {
        setError('Please select a region');
        return;
      }

      // Calculating CTREE_BASELINE
      const CTREE_BASELINE = (44 / 12) * CFTREE * bFOREST * (1 + treeRootShoot) * treeCrownCover * ha;
      // Calculating CSHRUB_t
      const CSHRUB_t = (44 / 12) * CFS * (1 + shrubRootShoot) * shrubArea * shrubBiomass * bFOREST * shrubCrownCover;
      // Calculating CTREE_PROJECT
      const CTREE_PROJECT = (44 / 12) * CFTREE * bFOREST * (1 + treeRootShoot) * projectTreeCrownCover * ha;
      // Calculating CSHRUB_PROJECT
      const CSHRUB_PROJECT = (44 / 12) * CFS * (1 + shrubRootShoot) * projectShrubArea * shrubBiomass * bFOREST * projectShrubCrownCover;

      // Final CO2 estimated value
      const finalCO2Estimated = CTREE_PROJECT + CSHRUB_PROJECT - CTREE_BASELINE - CSHRUB_t;

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

  const complementaryInfo = (questionId: number) => {
    switch (questionId) {
      case 1:
        return <p>This will help us determine the appropriate biomass data for your region.</p>;
      case 3:
        return (
          <div>
            <p>Tree crown cover refers to the area of ground shaded by the canopy of trees when viewed from above.</p>
            {/* <img src="/crown-cover-tree.jpg" alt="Tree Cover" /> */}
          </div>
        );
      case 4:
        return <p>Shrub crown cover refers to the area of ground shaded by the canopy of shrubs when viewed from above.</p>

      default:
        return
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'url(/background.jpg)' }}>
      <header className="fixed top-0 left-0 w-full bg-green-900 bg-opacity-70 shadow-md z-10">
        <div className="text-center p-4">
          <Link href="/">
            <span className="text-4xl font-bold text-white hover:underline cursor-pointer">Baseline Calculator</span>
          </Link>
          <p className="text-xl text-gray-200">by Carbonable</p>
        </div>
      </header>

      {!showResult ? (
        <div className={`grid ${complementaryInfo(currentQuestion) ? 'grid-cols-5' : 'grid-cols-5'} bg-white p-12 rounded-lg w-full max-w-4xl relative overflow-hidden border-transparent shadow-lg bg-opacity-80`}>
          <div className={`inset-0 ${complementaryInfo(currentQuestion) ? 'col-span-3' : 'col-span-5'} ${animating ? 'slide-down' : 'slide-active'}`}>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{questions[currentQuestion].question}</h2>
            {/* <p className="text-gray-500 mb-4">Put zero if you don't have it</p> */}
            {questions[currentQuestion].type === 'select' ? (
              <select
                value={answers[currentQuestion]}
                onChange={handleChange}
                className="border-2 border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
              >
                <option value="">Select your region</option>
                {questions[currentQuestion].options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : questions[currentQuestion].type === 'information' ? (
              <div>
                <p className="text-gray-800 mb-4">{questions[currentQuestion].info}</p>
              </div>
            ) : (
              <input
                type={questions[currentQuestion].type}
                value={answers[currentQuestion]}
                onChange={handleChange}
                className="border-2 border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                placeholder="Type your answer here..."
              />
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="text-green-700 disabled:text-gray-300 flex items-center"
              >
                &uarr; <span className="ml-2">Previous</span>
              </button>
              {!isLastQuestion && <span className="text-gray-500">press Enter</span>}
              {isLastQuestion ? (
                <button
                  onClick={handleCalculate}
                  className="text-2xl font-bold text-green-700"
                >
                  OK
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="text-green-700 flex items-center"
                >
                  <span className="mr-2">Next</span> &darr;
                </button>
              )}
            </div>
          </div>
          {/* Complementary information div */}
          <div className={`inset-0 grid grid-flow-col col-span-2 slide-down justify-center content-center ml-12 ${complementaryInfo(currentQuestion) ? 'visible' : 'invisible'}`}>
            {complementaryInfo(currentQuestion)}
          </div>
        </div>

      ) : (
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-xl sm:max-w-2xl relative overflow-hidden border-transparent shadow-lg bg-opacity-80">
            <h2 className="text-4xl font-bold text-green-500 animate-bounce mb-4">
              Result: {formatNumber(result)} tons of CO2
            </h2>
            <h2 className="text-2xl font-semibold text-gray-800">
              {result > 0 ? 'Great job! 🎉' : 'Please fill in all the fields'}
            </h2>
            {result > 0 && (
              <h3 className="text-xl text-gray-600 mt-4">
                Here is your proof of computation:
                <a href="https://sepolia.voyager.online/tx/0x3e774a9ce6afb55fc47c9390776a681f6674162b15cfb9bd6d062df01c823ee"
                  className="text-green-700 hover:text-green-900 ml-2">
                  View Transaction
                </a>
              </h3>
            )}
          </div>

          <button
            onClick={handleRedo}
            className="mt-8 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition duration-200"
          >
            Redo Form
          </button>
        </div>
      )}
    </div>
  );
};

export default FormPage;
