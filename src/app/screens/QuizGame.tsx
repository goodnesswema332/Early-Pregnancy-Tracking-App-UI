import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: Record<string, { title: string; questions: Question[] }> = {
  "myth-vs-fact": {
    title: "Myth vs. Fact Challenge",
    questions: [
      {
        id: 1,
        question: "You can tell if you're pregnant just by looking at symptoms within the first week.",
        options: ["Myth", "Fact"],
        correctAnswer: 0,
        explanation: "Most pregnancy symptoms don't appear until at least 1-2 weeks after conception. Early symptoms are often similar to PMS and can be misleading.",
      },
      {
        id: 2,
        question: "Stress and irregular periods can affect menstrual cycles and pregnancy timing.",
        options: ["Myth", "Fact"],
        correctAnswer: 1,
        explanation: "Stress, changes in routine, and health factors can absolutely affect menstrual regularity and ovulation timing.",
      },
      {
        id: 3,
        question: "Home pregnancy tests are most accurate when taken first thing in the morning.",
        options: ["Myth", "Fact"],
        correctAnswer: 1,
        explanation: "Morning urine is most concentrated, which makes it easier for the test to detect pregnancy hormones, especially in early pregnancy.",
      },
      {
        id: 4,
        question: "You can't get pregnant during your period.",
        options: ["Myth", "Fact"],
        correctAnswer: 0,
        explanation: "While less common, it is possible to get pregnant during your period, especially if you have shorter cycles or irregular periods.",
      },
    ],
  },
};

export function QuizGame() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const quiz = quizData[gameId || "myth-vs-fact"];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl">
              🎉
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Great job on finishing the quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {score}/{quiz.questions.length}
              </div>
              <div className="text-gray-600">Questions Correct</div>
              <Badge className="mt-3 bg-purple-100 text-purple-700 text-base px-4 py-1">
                {percentage}% Score
              </Badge>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/play")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90"
              >
                Back to Games
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate("/play")} className="text-gray-600">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              Score: {score}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-purple-100" />
        </div>
      </header>

      {/* Question Card */}
      <div className="max-w-md mx-auto px-6 py-6">
        <Card className="shadow-lg border-2 border-purple-100">
          <CardHeader>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-lg font-semibold">
                {currentQuestion + 1}
              </div>
              <CardTitle className="text-lg leading-snug pt-1.5">
                {question.question}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              let buttonClasses = "w-full h-auto py-4 px-6 text-base justify-start border-2 transition-all ";
              
              if (!showResult) {
                buttonClasses += isSelected
                  ? "bg-purple-100 border-purple-500 text-purple-700"
                  : "bg-white border-gray-200 hover:border-purple-300 text-gray-700";
              } else {
                if (isCorrect) {
                  buttonClasses += "bg-green-100 border-green-500 text-green-700";
                } else if (isSelected && !isCorrect) {
                  buttonClasses += "bg-red-100 border-red-500 text-red-700";
                } else {
                  buttonClasses += "bg-gray-50 border-gray-200 text-gray-500";
                }
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  variant="outline"
                  className={buttonClasses}
                  disabled={showExplanation}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 text-left">{option}</div>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Explanation Card */}
        {showExplanation && (
          <Card className="mt-4 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-base text-blue-900">Did you know?</CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-700">
                {question.explanation}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6">
          {!showExplanation ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 disabled:opacity-50 h-12 text-base"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90 h-12 text-base"
            >
              {currentQuestion < quiz.questions.length - 1 ? "Next Question →" : "See Results"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
