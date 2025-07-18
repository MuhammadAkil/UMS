"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Award,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  university: string;
  year: number;
  marks: number;
  explanation?: string;
  tags: string[];
}

const dummyMCQs: MCQ[] = [
  {
    id: "1",
    question: "What is the capital of Pakistan?",
    options: ["Karachi", "Lahore", "Islamabad", "Peshawar"],
    correctAnswer: 2,
    subject: "General Knowledge",
    difficulty: "Easy",
    university: "University of Punjab",
    year: 2023,
    marks: 1,
    explanation: "Islamabad has been the capital of Pakistan since 1967.",
    tags: ["geography", "pakistan"],
  },
  {
    id: "2",
    question: "Which of the following is not a programming language?",
    options: ["Python", "JavaScript", "HTML", "C++"],
    correctAnswer: 2,
    subject: "Computer Science",
    difficulty: "Medium",
    university: "FAST University",
    year: 2023,
    marks: 2,
    explanation: "HTML is a markup language, not a programming language.",
    tags: ["programming", "languages"],
  },
  {
    id: "3",
    question: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
    subject: "Mathematics",
    difficulty: "Easy",
    university: "LUMS",
    year: 2024,
    marks: 1,
    explanation: "The derivative of x² is 2x using the power rule.",
    tags: ["calculus", "derivative"],
  },
  {
    id: "4",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
    subject: "Biology",
    difficulty: "Medium",
    university: "Aga Khan University",
    year: 2023,
    marks: 2,
    explanation: "Mitochondria produce ATP, the cell's main energy currency.",
    tags: ["cell biology", "organelles"],
  },
  {
    id: "5",
    question: "What is the molecular formula of water?",
    options: ["H₂O", "CO₂", "NaCl", "CH₄"],
    correctAnswer: 0,
    subject: "Chemistry",
    difficulty: "Easy",
    university: "University of Karachi",
    year: 2024,
    marks: 1,
    explanation: "Water consists of two hydrogen atoms and one oxygen atom.",
    tags: ["chemistry", "molecular formula"],
  },
];

type QuizMode = "practice" | "timed" | "exam";
type QuizState = "setup" | "active" | "paused" | "completed";

export function MCQQuizInterface() {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [quizMode, setQuizMode] = useState<QuizMode>("practice");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [quizDuration, setQuizDuration] = useState(300);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showResults, setShowResults] = useState(false);

  const subjects = Array.from(new Set(dummyMCQs.map((mcq) => mcq.subject)));
  const difficulties = ["Easy", "Medium", "Hard"];

  // Filter MCQs based on selected criteria
  const filteredMCQs = dummyMCQs.filter((mcq) => {
    const matchesSubject =
      selectedSubject === "all" || mcq.subject === selectedSubject;
    const matchesDifficulty =
      selectedDifficulty === "all" || mcq.difficulty === selectedDifficulty;
    return matchesSubject && matchesDifficulty;
  });

  const currentMCQ = filteredMCQs[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizState === "active" && quizMode === "timed" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setQuizState("completed");
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState, quizMode, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizState("active");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    if (quizMode === "timed") {
      setTimeRemaining(quizDuration);
    }
  };

  const pauseQuiz = () => {
    setQuizState("paused");
  };

  const resumeQuiz = () => {
    setQuizState("active");
  };

  const resetQuiz = () => {
    setQuizState("setup");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(quizDuration);
    setShowResults(false);
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizState !== "active") return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentMCQ.id]: answerIndex,
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredMCQs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizState("completed");
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    setQuizState("completed");
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let totalMarks = 0;
    let earnedMarks = 0;

    filteredMCQs.forEach((mcq) => {
      totalMarks += mcq.marks;
      if (selectedAnswers[mcq.id] === mcq.correctAnswer) {
        correct++;
        earnedMarks += mcq.marks;
      }
    });

    return {
      correct,
      total: filteredMCQs.length,
      percentage: Math.round((correct / filteredMCQs.length) * 100),
      earnedMarks,
      totalMarks,
    };
  };

  if (quizState === "setup") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Quiz Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Mode Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quiz Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    mode: "practice" as QuizMode,
                    title: "Practice",
                    description: "No time limit, learn at your pace",
                  },
                  {
                    mode: "timed" as QuizMode,
                    title: "Timed",
                    description: "Fixed time limit for challenge",
                  },
                  {
                    mode: "exam" as QuizMode,
                    title: "Exam",
                    description: "Simulation of real exam conditions",
                  },
                ].map((option) => (
                  <Card
                    key={option.mode}
                    className={`cursor-pointer transition-colors ${
                      quizMode === option.mode
                        ? "border-[#5C5FC8] bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setQuizMode(option.mode)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{option.title}</h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Time Duration for Timed Mode */}
            {quizMode === "timed" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration (minutes)
                </label>
                <Select
                  value={quizDuration.toString()}
                  onValueChange={(value) =>
                    setQuizDuration(parseInt(value) * 60)
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="900">15 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="3600">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quiz Summary */}
            <Alert>
              <AlertDescription>
                <strong>{filteredMCQs.length} questions</strong> selected based
                on your criteria.
                {quizMode === "timed" && (
                  <span>
                    {" "}
                    Time limit: <strong>{formatTime(quizDuration)}</strong>
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <Button
              onClick={startQuiz}
              disabled={filteredMCQs.length === 0}
              className="w-full bg-[#5C5FC8] hover:bg-[#4A4DBF]"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-[#5C5FC8]">
                {results.percentage}%
              </div>
              <div className="text-lg text-gray-600">
                {results.correct} out of {results.total} questions correct
              </div>
              <div className="text-md text-gray-600">
                Marks: {results.earnedMarks}/{results.totalMarks}
              </div>
            </div>

            {/* Performance Badge */}
            <div className="flex justify-center">
              <Badge
                className={`text-lg px-4 py-2 ${
                  results.percentage >= 80
                    ? "bg-green-100 text-green-800"
                    : results.percentage >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {results.percentage >= 80
                  ? "Excellent!"
                  : results.percentage >= 60
                    ? "Good Job!"
                    : "Keep Practicing!"}
              </Badge>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Question Review</h3>
              {filteredMCQs.map((mcq, index) => {
                const userAnswer = selectedAnswers[mcq.id];
                const isCorrect = userAnswer === mcq.correctAnswer;
                return (
                  <Card
                    key={mcq.id}
                    className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium">
                          Q{index + 1}. {mcq.question}
                        </span>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {mcq.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${
                              optionIndex === mcq.correctAnswer
                                ? "bg-green-100 text-green-800"
                                : optionIndex === userAnswer &&
                                    userAnswer !== mcq.correctAnswer
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-50"
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                            {optionIndex === mcq.correctAnswer && " ✓"}
                            {optionIndex === userAnswer &&
                              userAnswer !== mcq.correctAnswer &&
                              " ✗"}
                          </div>
                        ))}
                      </div>
                      {mcq.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong>Explanation:</strong> {mcq.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Again
              </Button>
              <Button
                onClick={() => setQuizState("setup")}
                className="bg-[#5C5FC8] hover:bg-[#4A4DBF]"
              >
                New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {filteredMCQs.length}
              </Badge>
              <Badge
                className={`${
                  currentMCQ?.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : currentMCQ?.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {currentMCQ?.difficulty}
              </Badge>
              <Badge variant="secondary">{currentMCQ?.subject}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {quizMode === "timed" && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span
                    className={`font-mono ${timeRemaining < 60 ? "text-red-600" : ""}`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <div className="flex space-x-2">
                {quizState === "active" && quizMode !== "exam" && (
                  <Button onClick={pauseQuiz} variant="outline" size="sm">
                    <Pause className="w-4 h-4" />
                  </Button>
                )}
                {quizState === "paused" && (
                  <Button onClick={resumeQuiz} size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={resetQuiz} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={(currentQuestionIndex / filteredMCQs.length) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {quizState === "paused" && (
        <Alert>
          <AlertDescription>
            Quiz is paused. Click resume to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Question Card */}
      {currentMCQ && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentMCQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentMCQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentMCQ.id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={quizState !== "active"}
                    className={`p-4 text-left rounded-lg border transition-colors ${
                      isSelected
                        ? "border-[#5C5FC8] bg-blue-50 text-[#5C5FC8]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${quizState !== "active" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0 || quizState !== "active"}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentQuestionIndex === filteredMCQs.length - 1 ? (
                  <Button
                    onClick={finishQuiz}
                    disabled={quizState !== "active"}
                    className="bg-[#5C5FC8] hover:bg-[#4A4DBF]"
                  >
                    Finish Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={quizState !== "active"}
                    className="bg-[#5C5FC8] hover:bg-[#4A4DBF]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
