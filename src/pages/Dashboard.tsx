import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  User,
  MapPin,
  Calendar,
  LogOut,
  Sparkles,
  Edit,
  Sparkle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  food: { label: "Food", icon: "🍜" },
  photography: { label: "Photography", icon: "📸" },
  fitness: { label: "Fitness", icon: "🏋️" },
  sleeping: { label: "Sleeping", icon: "😴" },
  drawing: { label: "Drawing", icon: "✏️" },
  painting: { label: "Painting", icon: "🎨" },
  writing: { label: "Writing", icon: "🖋️" },
  singing: { label: "Singing", icon: "🎤" },
  instruments: { label: "Playing musical instruments", icon: "🎸" },
  dancing: { label: "Dancing", icon: "💃" },
  podcasts: { label: "Podcast listening", icon: "🎧" },
  meditation: { label: "Meditation", icon: "🧘" },
  yoga: { label: "Yoga", icon: "🧘" },
  hiking: { label: "Hiking", icon: "🥾" },
  cycling: { label: "Cycling", icon: "🚴" },
  running: { label: "Running", icon: "🏃" },
  swimming: { label: "Swimming", icon: "🏊" },
  chess: { label: "Chess", icon: "♟️" },
  board_games: { label: "Board games", icon: "🎲" },
  blogging: { label: "Blogging", icon: "📝" },
  vlogging: { label: "Vlogging", icon: "📹" },
  uiux: { label: "UI/UX designing", icon: "🖥️" },
  game_dev: { label: "Game development", icon: "🕹️" },
  robotics: { label: "Robotics", icon: "🤖" },
  electronics: { label: "Electronics tinkering", icon: "🔧" },
  "3d_modeling": { label: "3D modeling", icon: "📐" },
  video_editing: { label: "Video editing", icon: "🎞️" },
  animation: { label: "Animation", icon: "🎬" },
  calligraphy: { label: "Calligraphy", icon: "✒️" },
  origami: { label: "Origami", icon: "🦢" },
  gardening: { label: "Gardening", icon: "🌱" },
  cooking: { label: "Cooking (home recipes)", icon: "🍳" },
  baking: { label: "Baking", icon: "🧁" },
  language_learning: { label: "Language learning", icon: "🗣️" },
  public_speaking: { label: "Public speaking", icon: "🎙️" },
  volunteering: { label: "Volunteering", icon: "🤝" },
  astronomy: { label: "Astronomy", icon: "🔭" },
  stargazing: { label: "Stargazing", icon: "🌌" },
  puzzles: { label: "Puzzle solving", icon: "🧩" },
};

const campusLabels: Record<string, string> = {
  vellore: "VIT Vellore",
  chennai: "VIT Chennai",
  amaravati: "VIT Amaravati",
  bhopal: "VIT Bhopal",
};

// Admin detection: allow role=admin or email present in VITE_ADMIN_EMAILS (comma-separated)
const isAdminUser = (currentUser: any) => {
  const email = (currentUser?.email || "").toLowerCase();
  const role = currentUser?.app_metadata?.role;
  const envAdmins = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((entry: string) => entry.trim().toLowerCase())
    .filter(Boolean);
  return role === "admin" || envAdmins.includes(email);
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [match, setMatch] = useState<Tables<"matches"> | null>(null);
  const [matchPartner, setMatchPartner] = useState<Tables<"profiles"> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  const fetchLatestMatch = async (uid: string) => {
    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("user_id", uid)
      .order("match_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (matchError) {
      toast({
        title: "Failed to load match",
        description: matchError.message,
        variant: "destructive",
      });
    }
    setMatch(matchData);

    if (matchData?.matched_user_id && matchData.revealed) {
      const { data: partnerData } = await supabase
        .from("profiles")
        .select("user_id,name,gender,bio,hobbies,campus,email")
        .eq("user_id", matchData.matched_user_id)
        .maybeSingle();
      setMatchPartner(partnerData);
    } else {
      setMatchPartner(null);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          toast({
            title: "Auth error",
            description: error.message,
            variant: "destructive",
          });
        }

        const authed = data?.user;
        if (!authed) {
          setLoading(false);
          navigate("/login");
          return;
        }
        setUser(authed);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", authed.id)
          .maybeSingle();

        if (profileError) {
          toast({
            title: "Failed to load profile",
            description: profileError.message,
            variant: "destructive",
          });
        }
        setProfile(profileData);

        await fetchLatestMatch(authed.id);
      } catch (err: any) {
        toast({
          title: "Unexpected error",
          description: err?.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => data.subscription?.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`matches-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLatestMatch(user.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you soon! ���" });
    navigate("/");
  };

  const isProfileComplete =
    profile?.campus &&
    profile?.gender &&
    profile?.hobbies &&
    profile.hobbies.length > 0;

  const sharedHobbies = useMemo(() => {
    if (!matchPartner || !profile?.hobbies || !matchPartner.hobbies)
      return [] as string[];
    const setB = new Set(matchPartner.hobbies);
    return profile.hobbies.filter((h) => setB.has(h));
  }, [profile?.hobbies, matchPartner]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingHearts />
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(330_90%_60%/0.1),_transparent_50%)]" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-xl font-display font-bold gradient-text">
              VMET
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/account")}
              className="inline-flex"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
            {isAdmin && (
              <Button
                variant="secondary"
                onClick={() => navigate("/admin")}
                className="inline-flex"
                size="sm"
              >
                Admin
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-bold mb-2">
                Welcome,{" "}
                {profile?.name || user?.user_metadata?.name || "VITian"}!
              </h1>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              {profile?.campus && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  <MapPin className="w-4 h-4" />
                  {campusLabels[profile.campus]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/20">
              <span className="text-sm md:text-base font-medium text-primary">
                Matching on Feb 14
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
                <h3 className="text-lg font-semibold mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-muted-foreground text-sm">
                  Add your hobbies and preferences to get matched!
                </p>
              </div>
              <Button
                onClick={() => navigate("/account")}
                className="btn-primary"
              >
                Complete Profile
              </Button>
            </div>
          </div>
        )}

        {isProfileComplete && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-xl font-display font-bold">Your Profile</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/account")}
              >
                <Edit className="w-4 h-4 mr-2" /> Update Profile
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Bio</p>
                <p className="text-foreground">
                  {profile?.bio || "No bio added"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Age</p>
                <p className="text-foreground">
                  {profile?.age || "Not specified"}
                </p>
              </div>
            </div>

            {profile?.hobbies && profile.hobbies.length > 0 && (
              <div className="mt-6">
                <p className="text-muted-foreground text-sm mb-3">
                  Your Hobbies
                </p>
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

            {match && !match.revealed && (
              <div className="glass-card p-6 mb-8 border-dashed border-primary/40">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your match is locked
                    </p>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> Reveals soon
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      We have a match for you. It will be revealed on the
                      announcement date.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-200 bg-amber-50"
                  >
                    Locked
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Campus</p>
                    <p className="font-medium">
                      {campusLabels[match.campus] || match.campus}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Match Status
                    </p>
                    <p className="font-medium">Pending reveal</p>
                  </div>
                </div>
              </div>
            )}

            {match && match.revealed && matchPartner && (
              <div className="glass-card p-6 mb-8 border-primary/50">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Match Revealed
                    </p>
                    <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                      <Sparkle className="w-5 h-5 text-primary" />
                      Congrats!
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      You and your match are live side-by-side.
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    Revealed
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-card border border-primary/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        You
                      </p>
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/30"
                      >
                        {campusLabels[match.campus] || match.campus}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-display font-bold">
                      {profile?.name || "You"}
                    </h3>
                    {profile?.gender && (
                      <p className="text-muted-foreground text-sm capitalize">
                        {profile.gender}
                      </p>
                    )}
                    {profile?.bio && (
                      <p className="mt-3 text-foreground text-sm leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  <div className="glass-card border border-primary/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Your Match
                      </p>
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        {campusLabels[match.campus] || match.campus}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-primary" />
                      {matchPartner.name}
                    </h3>
                    {matchPartner.gender && (
                      <p className="text-muted-foreground text-sm capitalize">
                        {matchPartner.gender}
                      </p>
                    )}
                    {matchPartner.email ? (
                      <a
                        href={`mailto:${matchPartner.email}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {matchPartner.email}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Email not provided yet.
                      </p>
                    )}
                    {matchPartner.bio && (
                      <p className="mt-3 text-foreground text-sm leading-relaxed">
                        {matchPartner.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                    <p className="font-medium">{match.match_score ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Shared Hobbies
                    </p>
                    <p className="font-medium">{sharedHobbies.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Match Date</p>
                    <p className="font-medium">
                      {match.match_date?.slice(0, 10)}
                    </p>
                  </div>
                </div>

                {sharedHobbies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sharedHobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-sm"
                      >
                        <span>{hobbiesMap[hobby]?.icon}</span>
                        <span>{hobbiesMap[hobby]?.label || hobby}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
                Results: Feb 14
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Campus Matching</h3>
            <p className="text-muted-foreground text-sm">
              You'll be matched with someone from your own campus for easier
              meetups!
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
