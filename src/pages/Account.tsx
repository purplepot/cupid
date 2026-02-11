import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import FloatingHearts from "@/components/FloatingHearts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    campus: "",
    gender: "",
    interestedIn: "",
    age: "",
    bio: "",
    hobbies: [] as string[],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

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

  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/login");
        return;
      }
      setUser(data.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (profileError) {
        toast({
          title: "Failed to load profile",
          description: profileError.message,
          variant: "destructive",
        });
      } else if (profileData) {
        setFormData({
          name: profileData.name || "",
          campus: profileData.campus || "",
          gender: profileData.gender || "",
          interestedIn: profileData.interested_in || "",
          age: profileData.age ? String(profileData.age) : "",
          bio: profileData.bio || "",
          hobbies: profileData.hobbies || [],
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, [navigate, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.hobbies.length < 3) {
      toast({
        title: "Select more hobbies",
        description: "Please choose at least 3 hobbies.",
        variant: "destructive",
      });
      return;
    }

    const ageNum = Number(formData.age);
    if (
      !formData.name ||
      !formData.campus ||
      !formData.gender ||
      !formData.interestedIn ||
      Number.isNaN(ageNum)
    ) {
      toast({
        title: "Missing fields",
        description: "Name, campus, gender, interest, and age are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        name: formData.name,
        campus: formData.campus as
          | "vellore"
          | "chennai"
          | "amaravati"
          | "bhopal",
        gender: formData.gender as "male" | "female" | "other",
        interested_in: formData.interestedIn as "male" | "female" | "any",
        age: ageNum,
        bio: formData.bio,
        hobbies: formData.hobbies,
        email: user.email,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated" });
      navigate("/dashboard");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FloatingHearts />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 py-12">
      <FloatingHearts />
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(330_90%_60%/0.15),_transparent_50%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Account</p>
              <h1 className="text-2xl font-display font-bold">
                Update Profile
              </h1>
            </div>
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Back
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Campus</Label>
                <Select
                  value={formData.campus}
                  onValueChange={(value) => updateFormData("campus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus.value} value={campus.value}>
                        {campus.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={17}
                  max={30}
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  maxLength={150}
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/150
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Hobbies</p>
                  <p className="text-xs text-muted-foreground">
                    Select at least 3 hobbies.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formData.hobbies.length} / 10 selected
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hobbies.map((hobby) => (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => toggleHobby(hobby.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      formData.hobbies.includes(hobby.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xl">{hobby.icon}</span>
                    <span className="font-medium">{hobby.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
