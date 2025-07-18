"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AddMCQForm() {
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    subject: "",
    difficulty: "",
    university: "",
    year: new Date().getFullYear(),
    marks: 1,
    explanation: "",
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "Urdu",
    "General Knowledge",
    "Islamic Studies",
    "Pakistan Studies",
  ];

  const universities = [
    "University of Punjab",
    "FAST University",
    "LUMS",
    "NUST",
    "Aga Khan University",
    "University of Karachi",
    "IBA Karachi",
    "COMSATS University",
    "GCU Lahore",
    "UET Lahore",
  ];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      subject: "",
      difficulty: "",
      university: "",
      year: new Date().getFullYear(),
      marks: 1,
      explanation: "",
      tags: [],
    });
  };

  const isFormValid =
    formData.question.trim() &&
    formData.options.every((option) => option.trim()) &&
    formData.correctAnswer &&
    formData.subject &&
    formData.difficulty &&
    formData.university;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add New MCQ</span>
          <Button variant="outline" onClick={resetForm}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              MCQ added successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter your MCQ question here..."
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label>Answer Options *</Label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="font-medium text-sm w-8">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer */}
          <div className="space-y-3">
            <Label>Correct Answer *</Label>
            <RadioGroup
              value={formData.correctAnswer}
              onValueChange={(value) =>
                setFormData({ ...formData, correctAnswer: value })
              }
              className="flex space-x-6"
            >
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    Option {String.fromCharCode(65 + index)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Subject and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* University and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>University *</Label>
              <Select
                value={formData.university}
                onValueChange={(value) =>
                  setFormData({ ...formData, university: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                type="number"
                min="2000"
                max={new Date().getFullYear() + 5}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Marks */}
          <div className="space-y-2">
            <Label>Marks</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.marks}
              onChange={(e) =>
                setFormData({ ...formData, marks: parseInt(e.target.value) })
              }
              className="w-32"
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label>Explanation (Optional)</Label>
            <Textarea
              placeholder="Provide an explanation for the correct answer..."
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    #{tag}
                    <X
                      className="w-3 h-3 ml-1"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-[#5C5FC8] hover:bg-[#4A4DBF]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save MCQ
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
