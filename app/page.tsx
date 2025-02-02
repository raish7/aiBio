"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Smile,
  Coffee,
  Zap,
  Heart,
  Camera,
  Music,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const steps = [
  {
    title: "Let's start with the basics!",
    description: "Who are you?",
    icon: <Smile className="w-6 h-6" />,
  },
  {
    title: "Time to spice things up!",
    description: "What's your flavor of funny?",
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    title: "Personality check!",
    description: "How would others describe you?",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "What lights your fire?",
    description: "Tell us what you're passionate about!",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: "Hobbies & Interests",
    description: "What makes you, well, you?",
    icon: <Camera className="w-6 h-6" />,
  },
  {
    title: "Setting the mood",
    description: "What vibe are you going for?",
    icon: <Music className="w-6 h-6" />,
  },
];

const taglines = [
  "Your Bio, Your Story – Let's Tell It Right!",
  "Crafting the Perfect You in Words",
  "Unleash Your Personality, One Bio at a Time",
  "Your Life, Your Bio – Make It Count!",
];

export default function BioGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: "",
    humor: [],
    personality: [],
    passions: [],
    hobbies: "",
    tone: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [ copied, setCopied ] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.gender !== "";
      case 1:
        return formData.humor.length > 0;
      case 2:
        return formData.personality.length > 0;
      case 3:
        return formData.passions.length > 0;
      case 4:
        return true 
      case 5:
        return formData.tone !== "";
      default:
        return false;
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const generateBios = async (data: typeof formData) => {
    try {
      const response = await fetch("/api/generate-bios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      console.log('response', response)
      if (!response.ok) {
        throw new Error("Failed to generate bios")
      }
      const result = await response.json()
      return result.response
    } catch (error) {
      console.error("Error generating bios:", error)
      return []
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const bios = await generateBios(formData)
      setGeneratedBios(bios)
    } catch (error) {
      console.error("Error in handleSubmit:", error)
    } finally {
      setIsGenerating(false)
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      gender: "",
      humor: [],
      personality: [],
      passions: [],
      hobbies: "",
      tone: "",
    });
    setGeneratedBios([]);
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RadioGroup
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-binary" id="non-binary" />
              <Label htmlFor="non-binary">Non-binary</Label>
            </div>
          </RadioGroup>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            {["Witty", "Sarcastic", "Goofy", "Dark humor", "Dry humor"].map(
              (humor) => (
                <div key={humor} className="flex items-center space-x-2">
                  <Checkbox
                    id={humor}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange("humor", [...formData.humor, humor]);
                      } else {
                        handleInputChange(
                          "humor",
                          formData.humor.filter((h) => h !== humor)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={humor}>{humor}</Label>
                </div>
              )
            )}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {[
              "Outgoing",
              "Shy",
              "Spontaneous",
              "Thoughtful",
              "Introverted",
            ].map((trait) => (
              <div key={trait} className="flex items-center space-x-2">
                <Checkbox
                  id={trait}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleInputChange("personality", [
                        ...formData.personality,
                        trait,
                      ]);
                    } else {
                      handleInputChange(
                        "personality",
                        formData.personality.filter((t) => t !== trait)
                      );
                    }
                  }}
                />
                <Label htmlFor={trait}>{trait}</Label>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            {[
              "Traveling",
              "Art",
              "Fitness",
              "Music",
              "Food",
              "Social causes",
            ].map((passion) => (
              <div key={passion} className="flex items-center space-x-2">
                <Checkbox
                  id={passion}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleInputChange("passions", [
                        ...formData.passions,
                        passion,
                      ]);
                    } else {
                      handleInputChange(
                        "passions",
                        formData.passions.filter((p) => p !== passion)
                      );
                    }
                  }}
                />
                <Label htmlFor={passion}>{passion}</Label>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <Label htmlFor="hobbies">What are your favorite hobbies?</Label>
            <Input
              id="hobbies"
              placeholder="e.g., cooking, photography, sports"
              onChange={(e) => handleInputChange("hobbies", e.target.value)}
            />
          </div>
        );
      case 5:
        return (
          <RadioGroup
            onValueChange={(value) => handleInputChange("tone", value)}
          >
            {[
              "Flirty",
              "Funny",
              "Direct and straightforward",
              "Romantic",
              "Casual and relaxed",
            ].map((tone) => (
              <div key={tone} className="flex items-center space-x-2">
                <RadioGroupItem value={tone} id={tone} />
                <Label htmlFor={tone}>{tone}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Bio Generator</h1>
        <p className="text-xl text-white font-medium">
          {taglines[currentStep % taglines.length]}
        </p>
      </div>
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
            {steps[currentStep].icon}
            <span>{steps[currentStep].title}</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          {
            generatedBios?.length === 0 ? (
              <Button
                onClick={handleNext}
                disabled={ currentStep !== 4 && !isStepValid()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center space-x-1"
              >
                <span>
                  {currentStep === steps.length - 1 ? "Generate Bios" : "Next"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
              onClick={resetForm}
               className="bg-gray-500 text-white flex items-center space-x-1">
                <span>Generate New</span>
               </Button>
            )
          }
        </CardFooter>
      </Card>
      <div className="mt-4 w-full max-w-2xl mx-auto">
        <Progress
          value={((currentStep + 1) / steps.length) * 100}
          className="w-full h-2 bg-white/30"
        />
      </div>
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-white animate-spin" />
        </div>
      )}
              <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
      {generatedBios?.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto mt-8 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Your Amazing Bios!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Here are two options based on your responses:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedBios.map((bio, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-700">
                  Option {index + 1}
                </h3>
                <p className="text-lg text-gray-800 bg-gray-100 p-4 rounded-lg">
                  {bio}
                </p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(bio);
                    toast("Bio copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white w-full"
                >
                  Copy Bio {index + 1}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
