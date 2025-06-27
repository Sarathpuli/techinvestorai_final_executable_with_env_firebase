import React, { useState } from 'react';
import { HelpCircle, X, Award } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

const StockQuiz: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "What does P/E ratio stand for?",
      options: ["Price/Earnings", "Profit/Equity", "Price/Equity", "Performance/Earnings"],
      answer: 0,
      explanation: "The P/E ratio (Price-to-Earnings) shows how much investors are willing to pay for each dollar of a company's earnings."
    },
    {
      id: 2,
      text: "What is a dividend?",
      options: ["Company tax", "Profit distribution to shareholders", "Stock split", "Market capitalization measure"],
      answer: 1,
      explanation: "Dividends are portions of a company's profit that are paid out to shareholders as a reward for their investment."
    },
    {
      id: 3,
      text: "What is considered a high Market Cap?",
      options: ["Over $200 Million", "Over $2 Billion", "Over $10 Billion", "Over $100 Billion"],
      answer: 3,
      explanation: "Companies with market capitalization over $100 Billion are considered 'Large Cap' or 'Mega Cap' stocks."
    },
    {
      id: 4,
      text: "What is dollar-cost averaging?",
      options: ["Converting investments to USD", "Investing fixed amounts at regular intervals", "Measuring stock value in dollars", "Calculating average returns in dollars"],
      answer: 1,
      explanation: "Dollar-cost averaging is an investment strategy where you invest a fixed amount at regular intervals, regardless of share price."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;
    
    setSelectedOption(optionIndex);
    setAnswered(true);
    
    if (optionIndex === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const closeQuiz = () => {
    setIsOpen(false);
    resetQuiz();
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-30">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 transform hover:scale-105 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Quiz Time!</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-2xl relative">
            <button 
              onClick={closeQuiz}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {!quizCompleted ? (
              <>
                <h2 className="text-xl font-bold mb-6 text-orange-400">Stock Market Quiz</h2>
                <div className="mb-2 text-xs text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
                  
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`block w-full text-left p-3 rounded transition-colors ${
                          selectedOption === index
                            ? index === currentQuestion.answer
                              ? 'bg-green-700 text-white'
                              : 'bg-red-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        disabled={answered}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {answered && (
                    <div className="bg-gray-900 p-3 rounded border border-gray-700 text-sm">
                      <p className={selectedOption === currentQuestion.answer ? 'text-green-400' : 'text-red-400'}>
                        {selectedOption === currentQuestion.answer ? '✓ Correct!' : '✗ Incorrect!'}
                      </p>
                      <p className="mt-1 text-gray-300">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={!answered}
                  className={`w-full p-2 rounded font-medium transition-colors ${
                    answered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-lg mb-6">
                  Your score: <span className="font-bold text-green-400">{score}</span> out of {questions.length}
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={resetQuiz}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={closeQuiz}
                    className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StockQuiz;