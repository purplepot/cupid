import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, MapPin, Calendar, LogOut, Sparkles, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";
import type { Tables } from "@/integrations/supabase/types";

const hobbiesMap: Record<string, { label: string; icon: string }> = {
  music: { label: "Music", icon: "🎵" },
  movies: { label: "Movies", icon: "🎬" },
  coding: { label: "Coding", icon: "💻" },
  gaming: { label: "Gaming", icon: "🎮" },
  sports: { label: "Sports", icon: "⚽" },
  reading: { label: "Reading", icon: "📚" },
  traveling: { label: "Traveling", icon: "✈️" },
  food: { label: "Food", icon: "🍕" },
  photography: { label: "Photography", icon: "📸" },
  fitness: { label: "Fitness", icon: "🏋️" },
};

const campusLabels: Record<string, string> = {
  vellore: "VIT Vellore",
  chennai: "VIT Chennai",
  amaravati: "VIT Amaravati",
  bhopal: "VIT Bhopal",
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(profileData);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon! 💕",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  const isProfileComplete = profile?.campus && profile?.gender && profile?.hobbies && profile.hobbies.length > 0;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingHearts />
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(330_90%_60%/0.1),_transparent_50%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-xl font-display font-bold gradient-text">VMET</span>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-bold mb-2">
                Welcome, {profile?.name || user?.user_metadata?.name || "VITian"}! 💕
              </h1>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              {profile?.campus && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  <MapPin className="w-4 h-4" />
                  {campusLabels[profile.campus]}
                </span>
              )}
            </div>

            {/* Status Card */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-sm md:text-base font-medium text-primary">
                Matching on Feb 14 💖
              </span>
            </div>
          </div>
        </div>

        {!isProfileComplete && (
          <div className="glass-card p-6 mb-8 border-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Edit className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Complete Your Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Add your hobbies and preferences to get matched!
                </p>
              </div>
              <Button onClick={() => navigate("/register")} className="btn-primary">
                Complete Profile
              </Button>
            </div>
          </div>
        )}

        {/* Profile Details */}
        {isProfileComplete && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-display font-bold mb-4">Your Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Bio</p>
                <p className="text-foreground">{profile?.bio || "No bio added"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Age</p>
                <p className="text-foreground">{profile?.age || "Not specified"}</p>
              </div>
            </div>

            {profile?.hobbies && profile.hobbies.length > 0 && (
              <div className="mt-6">
                <p className="text-muted-foreground text-sm mb-3">Your Hobbies</p>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm"
                    >
                      <span>{hobbiesMap[hobby]?.icon}</span>
                      <span>{hobbiesMap[hobby]?.label || hobby}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Registration: Before Feb 13
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/50" />
                Matching: Feb 13
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/30" />
                Results: Feb 14 💕
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Campus Matching</h3>
            <p className="text-muted-foreground text-sm">
              You'll be matched with someone from your own campus for easier meetups!
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-muted-foreground text-sm">
              Our algorithm matches you based on shared hobbies and interests!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
