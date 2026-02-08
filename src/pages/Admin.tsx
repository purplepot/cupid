import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Users,
  Play,
  Eye,
  RefreshCw,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import FloatingHearts from "@/components/FloatingHearts";
import { useToast } from "@/hooks/use-toast";

// Admin detection: allow role=admin or email present in VITE_ADMIN_EMAILS (comma-separated)
const isAdminUser = (user: any) => {
  const email = (user?.email || "").toLowerCase();
  const role = user?.app_metadata?.role;
  const envAdmins = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
  return role === "admin" || envAdmins.includes(email);
};

type Profile = Tables<"profiles">;
type MatchRow = Tables<"matches">;

type Pair = {
  a: Profile;
  b: Profile;
  score: number;
};

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: false });

    if (profileError || matchError) {
      toast({
        title: "Error fetching data",
        description: profileError?.message || matchError?.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setProfiles(profileData || []);
    setMatches(matchData || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const authedUser = data.user;
      if (!authedUser) {
        navigate("/login");
        return;
      }
      if (!isAdminUser(authedUser)) {
        toast({
          title: "Access denied",
          description: "You need admin access to view this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setUser(authedUser);
      fetchData();
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const byUserId = useMemo(() => {
    const map: Record<string, Profile> = {};
    profiles.forEach((p) => {
      map[p.user_id] = p;
    });
    return map;
  }, [profiles]);

  const existingMatchedUsers = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => {
      set.add(m.user_id);
    });
    return set;
  }, [matches]);

  const intersectCount = (a: string[] = [], b: string[] = []) => {
    const setB = new Set(b);
    return a.filter((x) => setB.has(x)).length;
  };

  const compatible = (a: Profile, b: Profile) => {
    // Require both campus set and matching
    if (!a.campus || !b.campus || a.campus !== b.campus) return false;
    const aOk = a.interested_in === "any" || a.interested_in === b.gender;
    const bOk = b.interested_in === "any" || b.interested_in === a.gender;
    return Boolean(aOk && bOk);
  };

  const buildPairsForCampus = (campusProfiles: Profile[]): Pair[] => {
    const shuffled = [...campusProfiles].sort(() => Math.random() - 0.5);
    const used = new Set<string>();
    const pairs: Pair[] = [];

    for (let i = 0; i < shuffled.length; i++) {
      const a = shuffled[i];
      if (used.has(a.user_id)) continue;

      const candidate = shuffled.find((b, idx) => {
        if (idx <= i) return false;
        if (used.has(b.user_id)) return false;
        if (!compatible(a, b)) return false;
        const score = intersectCount(a.hobbies || [], b.hobbies || []);
        return score > 0; // at least one shared hobby
      });

      if (candidate) {
        const score = intersectCount(a.hobbies || [], candidate.hobbies || []);
        pairs.push({ a, b: candidate, score });
        used.add(a.user_id);
        used.add(candidate.user_id);
      }
    }

    return pairs;
  };

  const generateMatches = async () => {
    setGenerating(true);

    // Keep unmatched only
    const eligible = profiles.filter(
      (p) => !existingMatchedUsers.has(p.user_id),
    );
    const byCampus: Record<string, Profile[]> = {};
    eligible.forEach((p) => {
      if (!p.campus) return;
      if (!byCampus[p.campus]) byCampus[p.campus] = [];
      byCampus[p.campus].push(p);
    });

    const pairs: Pair[] = [];
    Object.values(byCampus).forEach((campusProfiles) => {
      pairs.push(...buildPairsForCampus(campusProfiles));
    });

    if (pairs.length === 0) {
      toast({
        title: "No new pairs",
        description: "Not enough compatible users.",
      });
      setGenerating(false);
      return;
    }

    const now = new Date().toISOString();
    const rows: MatchRow[] = pairs.flatMap((pair) => [
      {
        user_id: pair.a.user_id,
        matched_user_id: pair.b.user_id,
        campus: pair.a.campus!,
        match_score: pair.score,
        match_date: now,
        revealed: false,
        created_at: now,
        id: crypto.randomUUID(),
      },
      {
        user_id: pair.b.user_id,
        matched_user_id: pair.a.user_id,
        campus: pair.a.campus!,
        match_score: pair.score,
        match_date: now,
        revealed: false,
        created_at: now,
        id: crypto.randomUUID(),
      },
    ]);

    const { error } = await supabase.from("matches").insert(rows);
    if (error) {
      toast({
        title: "Failed to create matches",
        description: error.message,
        variant: "destructive",
      });
      setGenerating(false);
      return;
    }

    toast({
      title: "Matches created",
      description: `${pairs.length} pairs added.`,
    });
    await fetchData();
    setGenerating(false);
  };

  const revealAll = async () => {
    setRevealing(true);
    const { error } = await supabase
      .from("matches")
      .update({ revealed: true })
      .neq("revealed", true);
    if (error) {
      toast({
        title: "Failed to reveal",
        description: error.message,
        variant: "destructive",
      });
      setRevealing(false);
      return;
    }
    toast({ title: "Matches revealed" });
    await fetchData();
    setRevealing(false);
  };

  const totalMatchedUsers = useMemo(
    () => new Set(matches.map((m) => m.user_id)).size,
    [matches],
  );
  const totalPairs = totalMatchedUsers / 2;
  const totalProfiles = profiles.length;
  const unmatched = totalProfiles - totalMatchedUsers;

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
              VMET Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="w-4 h-4" /> Admin
            </Badge>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-10 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">{totalProfiles}</p>
              <p className="text-sm text-muted-foreground">Total users</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Pairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">{totalPairs}</p>
              <p className="text-sm text-muted-foreground">Active pairs</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" /> Unmatched
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">{unmatched}</p>
              <p className="text-sm text-muted-foreground">
                Waiting for a match
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-display font-bold">Matchmaking</h2>
              <p className="text-muted-foreground text-sm">
                Greedy matches within the same campus when preferences align and
                there is at least one shared hobby (aims to match everyone
                possible; leaves the rest unmatched).
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={generateMatches}
                disabled={generating || loading}
                className="btn-primary"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> Generate Matches
                  </span>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={revealAll}
                disabled={revealing || loading}
              >
                {revealing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Revealing
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Reveal All
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">User</th>
                  <th className="py-2">Matched With</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Campus</th>
                  <th className="py-2">Revealed</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-t border-border/50">
                    <td className="py-2">
                      <div className="font-medium">
                        {byUserId[m.user_id]?.name || m.user_id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {byUserId[m.user_id]?.gender}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="font-medium">
                        {byUserId[m.matched_user_id]?.name || m.matched_user_id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {byUserId[m.matched_user_id]?.gender}
                      </div>
                    </td>
                    <td className="py-2">{m.match_score ?? 0}</td>
                    <td className="py-2">{m.campus}</td>
                    <td className="py-2">
                      {m.revealed ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-200 bg-amber-50"
                        >
                          No
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matches.length === 0 && (
              <div className="text-muted-foreground text-center py-6">
                No matches yet.
              </div>
            )}
          </div>

          {!loading && profiles.length === 0 && (
            <div className="text-muted-foreground text-sm mt-3">
              No profiles found. Ask users to register first.
            </div>
          )}
        </div>

        <div className="glass-card p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Notes</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Access is restricted to users whose email is in VITE_ADMIN_EMAILS
              or have role "admin" in app_metadata.
            </li>
            <li>
              Matching pairs users within the same campus who have mutual
              interest and share at least one hobby.
            </li>
            <li>
              You may need Supabase RLS policies that allow admin
              inserts/updates on the matches table.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Admin;
