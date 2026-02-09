import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff, User, MapPin } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";

const hobbies = [
  { id: "music", label: "Music", icon: "🎵" },
  { id: "movies", label: "Movies", icon: "🎬" },
  { id: "coding", label: "Coding", icon: "💻" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "reading", label: "Reading", icon: "📚" },
  { id: "traveling", label: "Traveling", icon: "✈️" },
  { id: "food", label: "Food", icon: "🍕" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "fitness", label: "Fitness", icon: "🏋️" },
  { id: "sleeping", label: "Sleeping", icon: "😴" },
  { id: "drawing", label: "Drawing", icon: "✏️" },
  { id: "painting", label: "Painting", icon: "🎨" },
  { id: "writing", label: "Writing", icon: "🖋️" },
  { id: "singing", label: "Singing", icon: "🎤" },
  { id: "instruments", label: "Playing musical instruments", icon: "🎸" },
  { id: "dancing", label: "Dancing", icon: "💃" },
  { id: "podcasts", label: "Podcast listening", icon: "🎧" },
  { id: "meditation", label: "Meditation", icon: "🧘" },
  { id: "yoga", label: "Yoga", icon: "🧘" },
  { id: "hiking", label: "Hiking", icon: "🥾" },
  { id: "cycling", label: "Cycling", icon: "🚴" },
  { id: "running", label: "Running", icon: "🏃" },
  { id: "swimming", label: "Swimming", icon: "🏊" },
  { id: "chess", label: "Chess", icon: "♟️" },
  { id: "board_games", label: "Board games", icon: "🎲" },
  { id: "blogging", label: "Blogging", icon: "📝" },
  { id: "vlogging", label: "Vlogging", icon: "📹" },
  { id: "uiux", label: "UI/UX designing", icon: "🖥️" },
  { id: "game_dev", label: "Game development", icon: "🕹️" },
  { id: "robotics", label: "Robotics", icon: "🤖" },
  { id: "electronics", label: "Electronics tinkering", icon: "🔧" },
  { id: "3d_modeling", label: "3D modeling", icon: "📐" },
  { id: "video_editing", label: "Video editing", icon: "🎞️" },
  { id: "animation", label: "Animation", icon: "🎬" },
  { id: "calligraphy", label: "Calligraphy", icon: "✒️" },
  { id: "origami", label: "Origami", icon: "🦢" },
  { id: "gardening", label: "Gardening", icon: "🌱" },
  { id: "cooking", label: "Cooking (home recipes)", icon: "🍳" },
  { id: "baking", label: "Baking", icon: "🧁" },
  { id: "language_learning", label: "Language learning", icon: "🗣️" },
  { id: "public_speaking", label: "Public speaking", icon: "🎙️" },
  { id: "volunteering", label: "Volunteering", icon: "🤝" },
  { id: "astronomy", label: "Astronomy", icon: "🔭" },
  { id: "stargazing", label: "Stargazing", icon: "🌌" },
  { id: "puzzles", label: "Puzzle solving", icon: "🧩" },
];

const campuses = [
  { value: "vellore", label: "VIT Vellore" },
  { value: "chennai", label: "VIT Chennai" },
  { value: "amaravati", label: "VIT Amaravati" },
  { value: "bhopal", label: "VIT Bhopal" },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    interestedIn: "",
    campus: "",
    age: "",
    bio: "",
    hobbies: [] as string[],
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleHobby = (hobbyId: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobbyId)
        ? prev.hobbies.filter((h) => h !== hobbyId)
        : [...prev.hobbies, hobbyId],
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.hobbies.length < 3) {
      toast({
        title: "Select more hobbies",
        description: "Please select at least 3 hobbies for better matching",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            gender: formData.gender,
            interested_in: formData.interestedIn,
            campus: formData.campus,
            age: parseInt(formData.age),
            bio: formData.bio,
            hobbies: formData.hobbies,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Sign up did not complete. Please try again.");
      }

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          user_id: authData.user.id,
          name: formData.name,
          gender: formData.gender as "male" | "female" | "other",
          interested_in: formData.interestedIn as "male" | "female" | "any",
          campus: formData.campus as
            | "vellore"
            | "chennai"
            | "amaravati"
            | "bhopal",
          age: parseInt(formData.age),
          bio: formData.bio,
          hobbies: formData.hobbies,
        },
        { onConflict: "user_id" },
      );

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Registration successful!",
        description: "You're ready to sign in.",
      });

      if (authData.session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.password;
    }
    if (step === 2) {
      return (
        formData.gender &&
        formData.interestedIn &&
        formData.campus &&
        formData.age
      );
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 py-12">
      <FloatingHearts />

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(330_90%_60%/0.15),_transparent_50%)]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
          <span className="text-2xl font-display font-bold gradient-text">
            VMET
          </span>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-12 h-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Register Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleRegister}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-display font-bold mb-2">
                    Create Account
                  </h1>
                  <p className="text-muted-foreground">
                    Let's start with the basics 💕
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="pl-10 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="pl-10 pr-10 bg-input border-border focus:border-primary"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-display font-bold mb-2">
                    Tell Us About You
                  </h1>
                  <p className="text-muted-foreground">
                    Help us find your perfect match 💘
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Interested In</Label>
                    <Select
                      value={formData.interestedIn}
                      onValueChange={(value) =>
                        updateFormData("interestedIn", value)
                      }
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Campus</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select
                      value={formData.campus}
                      onValueChange={(value) => updateFormData("campus", value)}
                    >
                      <SelectTrigger className="pl-10 bg-input border-border">
                        <SelectValue placeholder="Select your campus" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {campuses.map((campus) => (
                          <SelectItem key={campus.value} value={campus.value}>
                            {campus.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    min={17}
                    max={30}
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="bg-input border-border focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself in 150 characters..."
                    maxLength={150}
                    value={formData.bio}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                    className="bg-input border-border focus:border-primary resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.bio.length}/150
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Hobbies */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-display font-bold mb-2">
                    Your Interests
                  </h1>
                  <p className="text-muted-foreground">
                    Select at least 3 hobbies 🎯
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {hobbies.map((hobby) => (
                    <button
                      key={hobby.id}
                      type="button"
                      onClick={() => toggleHobby(hobby.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        formData.hobbies.includes(hobby.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl">{hobby.icon}</span>
                      <span className="font-medium">{hobby.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Selected: {formData.hobbies.length} / 10
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-6"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  className="flex-1 btn-primary py-6"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 btn-primary py-6"
                  disabled={loading || formData.hobbies.length < 3}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <Heart className="w-5 h-5 fill-current" />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
