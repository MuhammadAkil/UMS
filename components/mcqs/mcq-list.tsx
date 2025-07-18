"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Search, Filter, Plus } from "lucide-react";
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
  tags: string[];
  createdAt: string;
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
    tags: ["geography", "pakistan"],
    createdAt: "2024-01-15",
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
    tags: ["programming", "languages"],
    createdAt: "2024-01-14",
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
    tags: ["calculus", "derivative"],
    createdAt: "2024-01-13",
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
    tags: ["cell biology", "organelles"],
    createdAt: "2024-01-12",
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
    tags: ["chemistry", "molecular formula"],
    createdAt: "2024-01-11",
  },
  {
    id: "6",
    question: "Which law states that energy cannot be created or destroyed?",
    options: [
      "Newton's First Law",
      "Law of Conservation of Energy",
      "Ohm's Law",
      "Boyle's Law",
    ],
    correctAnswer: 1,
    subject: "Physics",
    difficulty: "Hard",
    university: "NUST",
    year: 2023,
    marks: 3,
    tags: ["physics", "energy", "conservation"],
    createdAt: "2024-01-10",
  },
];

export function MCQList() {
  const [mcqs, setMcqs] = useState<MCQ[]>(dummyMCQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const subjects = Array.from(new Set(dummyMCQs.map((mcq) => mcq.subject)));
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredMCQs = mcqs.filter((mcq) => {
    const matchesSearch =
      mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || mcq.subject === filterSubject;
    const matchesDifficulty =
      filterDifficulty === "all" || mcq.difficulty === filterDifficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const handleDelete = (id: string) => {
    setMcqs(mcqs.filter((mcq) => mcq.id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>MCQ Management</span>
            <Button className="bg-[#5C5FC8] hover:bg-[#4A4DBF]">
              <Plus className="w-4 h-4 mr-2" />
              Add New MCQ
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search MCQs by question, subject, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
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
              <Select
                value={filterDifficulty}
                onValueChange={setFilterDifficulty}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
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
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#5C5FC8]">
              {filteredMCQs.length}
            </div>
            <div className="text-sm text-gray-600">Total MCQs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredMCQs.filter((mcq) => mcq.difficulty === "Easy").length}
            </div>
            <div className="text-sm text-gray-600">Easy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredMCQs.filter((mcq) => mcq.difficulty === "Medium").length}
            </div>
            <div className="text-sm text-gray-600">Medium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {filteredMCQs.filter((mcq) => mcq.difficulty === "Hard").length}
            </div>
            <div className="text-sm text-gray-600">Hard</div>
          </CardContent>
        </Card>
      </div>

      {/* MCQ List */}
      <div className="space-y-4">
        {filteredMCQs.length === 0 ? (
          <Alert>
            <AlertDescription>
              No MCQs found matching your search criteria.
            </AlertDescription>
          </Alert>
        ) : (
          filteredMCQs.map((mcq) => (
            <Card key={mcq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {mcq.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {mcq.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded border ${
                            index === mcq.correctAnswer
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>{" "}
                          {option}
                          {index === mcq.correctAnswer && (
                            <span className="ml-2 text-xs font-semibold">
                              (Correct)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(mcq.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                  <Badge variant="secondary">{mcq.subject}</Badge>
                  <Badge className={getDifficultyColor(mcq.difficulty)}>
                    {mcq.difficulty}
                  </Badge>
                  <span>•</span>
                  <span>{mcq.university}</span>
                  <span>•</span>
                  <span>Year: {mcq.year}</span>
                  <span>•</span>
                  <span>Marks: {mcq.marks}</span>
                  <span>•</span>
                  <span>Created: {mcq.createdAt}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {mcq.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
