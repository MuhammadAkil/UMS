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
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function BulkUploadMCQForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [defaultSubject, setDefaultSubject] = useState("");
  const [defaultUniversity, setDefaultUniversity] = useState("");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate results
    setUploadResult({
      success: 8,
      failed: 2,
      errors: [
        "Row 3: Missing correct answer",
        "Row 7: Invalid difficulty level",
      ],
    });

    setIsUploading(false);
    clearInterval(interval);
  };

  const downloadTemplate = () => {
    const csvContent = `Question,Option A,Option B,Option C,Option D,Correct Answer,Subject,Difficulty,University,Year,Marks,Tags,Explanation
"What is the capital of Pakistan?","Karachi","Lahore","Islamabad","Peshawar","C","General Knowledge","Easy","University of Punjab","2024","1","geography,pakistan","Islamabad is the capital city of Pakistan"
"Which programming language is used for web development?","Python","JavaScript","C++","Java","B","Computer Science","Medium","FAST University","2024","2","programming,web","JavaScript is primarily used for web development"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcq_template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Bulk Upload Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please follow the template format exactly. Download the template
                below to ensure proper formatting.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">CSV Format Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>
                  Include headers: Question, Option A, Option B, Option C,
                  Option D, Correct Answer, Subject, Difficulty, University,
                  Year, Marks, Tags, Explanation
                </li>
                <li>Correct Answer should be A, B, C, or D</li>
                <li>Difficulty should be Easy, Medium, or Hard</li>
                <li>Year should be a valid year (2000-2030)</li>
                <li>Marks should be a number between 1-10</li>
                <li>Tags should be comma-separated (optional)</li>
                <li>Use double quotes for text containing commas</li>
              </ul>
            </div>

            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload MCQs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Default Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Subject (Optional)</Label>
                <Select
                  value={defaultSubject}
                  onValueChange={setDefaultSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Used when subject is not specified in CSV
                </p>
              </div>
              <div className="space-y-2">
                <Label>Default University (Optional)</Label>
                <Select
                  value={defaultUniversity}
                  onValueChange={setDefaultUniversity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university} value={university}>
                        {university}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Used when university is not specified in CSV
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label>Upload CSV File</Label>
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your CSV file here
                    </p>
                    <p className="text-gray-500">or click to browse</p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="mx-auto w-64"
                    />
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetUpload}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading and processing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload Results */}
            {uploadResult && (
              <Alert
                className={
                  uploadResult.failed === 0
                    ? "border-green-200 bg-green-50"
                    : "border-yellow-200 bg-yellow-50"
                }
              >
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Upload completed!</p>
                    <div className="text-sm">
                      <p className="text-green-600">
                        ✓ {uploadResult.success} MCQs uploaded successfully
                      </p>
                      {uploadResult.failed > 0 && (
                        <>
                          <p className="text-red-600">
                            ✗ {uploadResult.failed} MCQs failed
                          </p>
                          <div className="mt-2">
                            <p className="font-medium">Errors:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {uploadResult.errors.map((error, index) => (
                                <li key={index} className="text-red-600">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={resetUpload}
                disabled={isUploading || !file}
              >
                Clear
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="bg-[#5C5FC8] hover:bg-[#4A4DBF]"
              >
                {isUploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload MCQs
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
