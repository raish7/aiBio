"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Twitter,
  Instagram,
  Users,
  Linkedin,
  Briefcase,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const platforms = [
  { name: "Twitter", icon: <Twitter className="w-6 h-6" /> },
  { name: "Instagram", icon: <Instagram className="w-6 h-6" /> },
  { name: "Dating Sites", icon: <Users className="w-6 h-6" /> },
  { name: "LinkedIn", icon: <Linkedin className="w-6 h-6" /> },
];

const baseSteps = [
  {
    title: "Let's start with the basics!",
    description: "Who are you?",
    icon: <Smile className="w-6 h-6" />,
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

const platformSpecificSteps = {
  Twitter: [
    {
      title: "Hashtag game strong",
      description: "Pick your favorite hashtags",
      icon: <Coffee className="w-6 h-6" />,
    },
  ],
  Instagram: [
    {
      title: "Visual storyteller",
      description: "Describe your Instagram aesthetic",
      icon: <Camera className="w-6 h-6" />,
    },
  ],
  "Dating Sites": [
    {
      title: "Relationship goals",
      description: "What are you looking for?",
      icon: <Heart className="w-6 h-6" />,
    },
  ],
  LinkedIn: [
    {
      title: "Professional journey",
      description: "Highlight your career path",
      icon: <Briefcase className="w-6 h-6" />,
    },
  ],
};

const taglines = [
  "Your Bio, Your Story – Let's Tell It Right!",
  "Crafting the Perfect You in Words",
  "Unleash Your Personality, One Bio at a Time",
  "Your Life, Your Bio – Make It Count!",
];

export default function BioGenerator() {
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for platform selection
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [formData, setFormData] = useState({
    platform: "",
    gender: "",
    personality: [],
    passions: [],
    hobbies: "",
    tone: "",
    // Platform-specific fields
    hashtags: [],
    aesthetic: "",
    relationshipGoals: "",
    careerPath: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);

  const steps = selectedPlatform
    ? [
        ...baseSteps,
        ...(platformSpecificSteps[
          selectedPlatform as keyof typeof platformSpecificSteps
        ] || []),
      ]
    : [];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (currentStep === -1) return selectedPlatform !== "";
    switch (currentStep) {
      case 0:
        return formData.gender !== "";
      case 1:
        return formData.personality.length > 0;
      case 2:
        return formData.passions.length > 0;
      case 3:
        return true;
      case 4:
        return formData.tone !== "";
      case 5:
        switch (selectedPlatform) {
          // case "Twitter":
          //   return formData.hashtags.length > 0;
          // case "Instagram":
          //   return formData.aesthetic !== "";
          case "Dating Sites":
            return formData.relationshipGoals !== "";
          case "LinkedIn":
            return formData.careerPath !== "";
          default:
            return true;
        }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid()) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === steps.length - 1 && isStepValid()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-bios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      const filteredResult = result.response.filter(
        (bio: string) => bio !== ""
      );
      setGeneratedBios(filteredResult);
    } catch (err) {
      console.log(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(-1);
    setFormData({
      gender: "",
      personality: [],
      passions: [],
      hobbies: "",
      tone: "",
      platform: "",
      // Platform-specific fields
      hashtags: [],
      aesthetic: "",
      relationshipGoals: "",
      careerPath: "",
    });
    setGeneratedBios([]);
  };

  const renderStep = () => {
    if (currentStep === -1) {
      return (
        <RadioGroup
          onValueChange={(value) => {
            setSelectedPlatform(value);
            handleInputChange("platform", value);
          }}
        >
          {platforms.map((platform) => (
            <div key={platform.name} className="flex items-center space-x-2">
              <RadioGroupItem value={platform.name} id={platform.name} />
              <Label
                htmlFor={platform.name}
                className="flex items-center space-x-2"
              >
                {platform.icon}
                <span>{platform.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }
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
            {["Outgoing", "Shy", "Spontaneous", "Thoughtful", "Creative"].map(
              (trait) => (
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
              )
            )}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {[
              "Traveling",
              "Art",
              "Fitness",
              "Music",
              "Food",
              "Technology",
              "Movies",
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
      case 3:
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
      case 4:
        return (
          <RadioGroup
            onValueChange={(value) => handleInputChange("tone", value)}
          >
            {[
              "Friendly",
              "Professional",
              "Humorous",
              "Inspirational",
              "Casual",
            ].map((tone) => (
              <div key={tone} className="flex items-center space-x-2">
                <RadioGroupItem value={tone} id={tone} />
                <Label htmlFor={tone}>{tone}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 5:
        switch (selectedPlatform) {
          case "Twitter":
            return (
              <div className="space-y-2">
                <Label htmlFor="hashtags">Select your favorite hashtags</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "TechLife",
                    "Foodie",
                    "TravelBug",
                    "FitnessFanatic",
                    "ArtLover",
                  ].map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("hashtags", [
                              ...formData.hashtags,
                              tag,
                            ]);
                          } else {
                            handleInputChange(
                              "hashtags",
                              formData.hashtags.filter((t) => t !== tag)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={tag}>#{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          case "Instagram":
            return (
              <div className="space-y-2">
                <Label htmlFor="aesthetic">
                  Emojis that represent your aesthetic
                </Label>
                <Input
                  id="aesthetic"
                  placeholder="Enter emojis separated by ,"
                  onChange={(e) =>
                    handleInputChange("aesthetic", e.target.value)
                  }
                />
              </div>
            );
          case "Dating Sites":
            return (
              <RadioGroup
                onValueChange={(value) =>
                  handleInputChange("relationshipGoals", value)
                }
              >
                {[
                  "Long-term relationship",
                  "Casual dating",
                  "Friendship",
                  "Not sure yet",
                ].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <RadioGroupItem value={goal} id={goal} />
                    <Label htmlFor={goal}>{goal}</Label>
                  </div>
                ))}
              </RadioGroup>
            );
          case "LinkedIn":
            return (
              <div className="space-y-2">
                <Label htmlFor="careerPath">
                  Describe your career path or industry
                </Label>
                <Input
                  id="careerPath"
                  placeholder="e.g., Marketing Professional, Software Engineer"
                  onChange={(e) =>
                    handleInputChange("careerPath", e.target.value)
                  }
                />
              </div>
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Bio Generator
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
          {currentStep === -1
            ? "Choose Your Platform"
            : taglines[currentStep % taglines.length]}
        </p>
      </div>
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
            {currentStep === -1 ? (
              <Users className="w-6 h-6" />
            ) : (
              steps[currentStep]?.icon
            )}
            <span>
              {currentStep === -1
                ? "Select Platform"
                : steps[currentStep]?.title}
            </span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {currentStep === -1
              ? "Where will you use this bio?"
              : steps[currentStep]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className="flex justify-between">
          {generatedBios.length === 0 ? (
            <Button
              onClick={handleBack}
              disabled={currentStep === -1}
              variant="outline"
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div></div>
          )}
          {generatedBios?.length === 0 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
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
              className="bg-black text-white flex items-center space-x-1"
            >
              <span>Generate New</span>
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="mt-4 w-full max-w-2xl mx-auto">
        <Progress
          value={((currentStep + 2) / (steps.length + 1)) * 100}
          className="w-full h-2 bg-gray-300 dark:bg-gray-700"
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
