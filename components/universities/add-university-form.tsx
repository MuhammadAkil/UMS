"use client";

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUniversityStore } from "@/lib/store/university-store";
import { AddProgramDrawer } from "./add-program-drawer";

interface Program {
  id: number;
  name: string;
  degree: string;
  deadline: string;
  merit: string;
  fee: string;
  duration: string;
  status: "Open" | "Closed";
}

export function AddUniversityForm() {
  const { toast } = useToast();
  const { addUniversity } = useUniversityStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: "Civil Engineering",
      degree: "Bachelors",
      deadline: "10 August 2025",
      merit: "617 %",
      fee: "500000 Rs",
      duration: "4 years",
      status: "Open",
    },
    {
      id: 2,
      name: "Environmental Engineering",
      degree: "Masters (MPhil)",
      deadline: "10 August 2025",
      merit: "617 %",
      fee: "500000 Rs",
      duration: "4 years",
      status: "Open",
    },
    {
      id: 3,
      name: "Computer Engineering",
      degree: "PhD",
      deadline: "10 August 2025",
      merit: "617 %",
      fee: "500000 Rs",
      duration: "4 years",
      status: "Open",
    },
    {
      id: 4,
      name: "Electrical Engineering",
      degree: "Bachelors",
      deadline: "10 August 2025",
      merit: "617 %",
      fee: "500000 Rs",
      duration: "4 years",
      status: "Open",
    },
    {
      id: 5,
      name: "Electronics Engineering",
      degree: "Bachelors",
      deadline: "10 August 2025",
      merit: "617 %",
      fee: "500000 Rs",
      duration: "4 years",
      status: "Closed",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    sector: "",
    fieldOfStudy: "",
    city: "",
    website: "",
    applyUrl: "",
    email: "",
    phone: "",
    address: "",
    about: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addUniversity({
        name: formData.name,
        code: formData.shortName,
        type: formData.sector as "Public" | "Private" | "Community",
        established: new Date().getFullYear(),
        country: "Pakistan",
        city: formData.city,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.about,
        status: "Inprogress",
      });

      toast({
        title: "Success",
        description: "University has been added successfully.",
      });

      // Reset form
      setFormData({
        name: "",
        shortName: "",
        sector: "",
        fieldOfStudy: "",
        city: "",
        website: "",
        applyUrl: "",
        email: "",
        phone: "",
        address: "",
        about: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add university.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProgram = (program: Omit<Program, "id">) => {
    const newProgram = {
      ...program,
      id: Date.now(),
    };
    setPrograms((prev) => [...prev, newProgram]);
    setShowAddProgram(false);
    toast({
      title: "Success",
      description: "Program added successfully.",
    });
  };

  const handleDeleteProgram = (id: number) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Success",
      description: "Program deleted successfully.",
    });
  };

  const programStats = {
    bachelors: programs.filter((p) => p.degree === "Bachelors").length,
    masters: programs.filter(
      (p) => p.degree.includes("Masters") || p.degree.includes("MPhil")
    ).length,
    phd: programs.filter((p) => p.degree === "PhD").length,
  };

  return (
    <div className="bg-white">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]"
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value="programs"
              className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]"
            >
              Programs
            </TabsTrigger>
            <TabsTrigger
              value="merit"
              className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]"
            >
              Test Merit Formula
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <Card>
              <div className="p-6 ">
                <div className="flex items-center justify-between pb-10">
                  <h3 className="text-lg text-black font-semibold">
                    {" "}
                    Basic Information
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-black">
                        University Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="University of engineering and technology, taxila"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black">
                        University Logo / Pic
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag & drop image or Browse
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortName" className="text-black">
                        University Short Name
                      </Label>
                      <Input
                        id="shortName"
                        placeholder="eg UET Taxila, LUMS etc"
                        value={formData.shortName}
                        onChange={(e) =>
                          handleInputChange("shortName", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-black">
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sector" className="text-black">
                        Sector
                      </Label>
                      <Select
                        value={formData.sector}
                        onValueChange={(value) =>
                          handleInputChange("sector", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector eg Government" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Government</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Community">
                            Semi Government
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applyUrl" className="text-black">
                        Apply Url
                      </Label>
                      <Input
                        id="applyUrl"
                        placeholder="https://"
                        value={formData.applyUrl}
                        onChange={(e) =>
                          handleInputChange("applyUrl", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy" className="text-black">
                        Field of Study
                      </Label>
                      <Select
                        value={formData.fieldOfStudy}
                        onValueChange={(value) =>
                          handleInputChange("fieldOfStudy", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field of study eg Business" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="arts">Arts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="select your course type"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-black">
                        City
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lahore">Lahore</SelectItem>
                          <SelectItem value="Karachi">Karachi</SelectItem>
                          <SelectItem value="Islamabad">Islamabad</SelectItem>
                          <SelectItem value="Taxila">Taxila</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-black">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="select your course type"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-black">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter University address"
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-black">
                      About
                    </Label>
                    <Textarea
                      id="about"
                      placeholder="Write about university"
                      rows={4}
                      value={formData.about}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      className="bg-[#5C5FC8] hover:bg-blue-400"
                      onClick={() => setActiveTab("programs")}
                    >
                      Next Programs
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <Card>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg text-black font-semibold">
                      Degree Program listing
                    </h3>
                    <Button
                      className="bg-[#5C5FC8] hover:bg-blue-400"
                      onClick={() => setShowAddProgram(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Program
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 bg-white rounded-lg border p-2">
                    <div className=" p-4 ">
                      <div className="text-3xl font-bold text-black">
                        {programStats.bachelors.toString().padStart(2, "0")}
                      </div>
                      <div className="text-sm text-gray-600">Bachelors</div>
                    </div>
                    <div className="border-l p-4">
                      <div className="text-3xl font-bold text-black">
                        {programStats.masters.toString().padStart(2, "0")}
                      </div>
                      <div className="text-sm text-gray-600">
                        Masters/ MPhil
                      </div>
                    </div>
                    <div className="border-l p-4">
                      <div className="text-3xl font-bold text-black">
                        {programStats.phd.toString().padStart(2, "0")}
                      </div>
                      <div className="text-sm text-gray-600">PhD</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-black">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3">Program Name</th>
                          <th className="text-left py-3">Degrees</th>
                          <th className="text-left py-3">Deadline</th>
                          <th className="text-left py-3">Last Year Merit</th>
                          <th className="text-left py-3">Fee Per Semester</th>
                          <th className="text-left py-3">Duration</th>
                          <th className="text-left py-3">Admission Status</th>
                          <th className="text-left py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {programs.map((program, index) => (
                          <tr key={program.id} className="border-b">
                            <td className="py-3">{program.name}</td>
                            <td className="py-3">{program.degree}</td>
                            <td className="py-3">{program.deadline}</td>
                            <td className="py-3">{program.merit}</td>
                            <td className="py-3">{program.fee}</td>
                            <td className="py-3">{program.duration}</td>
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  program.status === "Open"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {program.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProgram(program.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-sm text-gray-600">
                    1-{programs.length} of {programs.length}
                  </div>

                  <div className="flex items-center bg-transparent justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      Previous
                    </Button>
                    <Button
                      className="bg-[#5C5FC8] hover:bg-blue-400"
                      onClick={() => setActiveTab("merit")}
                    >
                      Next Merit Calculator
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="merit" className="mt-6">
            <Card>
              <div className="p-6 text-black">
                <div className="space-y-6">
                  <TabsList className="bg-gray-100 w-full justify-start">
                    <TabsTrigger
                      value="bachelors"
                      defaultChecked
                      className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1"
                    >
                      Bachelors
                    </TabsTrigger>
                    <TabsTrigger
                      value="masters"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1"
                      disabled
                    >
                      Masters
                    </TabsTrigger>
                    <TabsTrigger
                      value="mphil"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1"
                      disabled
                    >
                      MPhil
                    </TabsTrigger>
                    <TabsTrigger
                      value="phd"
                      className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1"
                      disabled
                    >
                      PhD
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Admission Test Type</h3>
                    <div className="grid grid-cols-6 gap-4">
                      <div className="space-y-2 col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="ecat" />
                          <Label htmlFor="ecat">Ecat</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mcat" />
                          <Label htmlFor="mcat">Mcat</Label>
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="own-test" />
                          <Label htmlFor="own-test">Own Test</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="nts" />
                          <Label htmlFor="nts">NTS</Label>
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sat" />
                          <Label htmlFor="sat">SAT</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="gat" />
                          <Label htmlFor="gat">GAT</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Matric Weightage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="0%" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 border border-gray-300 rounded-md px-4 py-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>FSC Weightage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="0%" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 border border-gray-300 rounded-md px-4 py-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Test Weightage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="0%" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 border border-gray-300 rounded-md px-4 py-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" className="bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <Button
                      className=" bg-transparent"
                      variant="outline"
                      onClick={() => setActiveTab("programs")}
                    >
                      Previous
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        className="bg-transparent text-[#5C5FC8] border-[#5C5FC8] hover:bg-blue-400"
                      >
                        Move to Inprogress
                      </Button>
                      <Button
                        className="bg-[#5C5FC8] hover:bg-blue-400"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? "Uploading..." : "Upload University"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddProgramDrawer
        open={showAddProgram}
        onClose={() => setShowAddProgram(false)}
        onAdd={handleAddProgram}
      />
    </div>
  );
}