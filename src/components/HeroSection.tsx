import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Calendar, Users } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(330_90%_60%/0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(350_80%_55%/0.1),_transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Model Image - Left side */}
          <div className="relative order-1 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-pink-glow/20 rounded-[3rem] blur-3xl" />

              {/* Main image container */}
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl shadow-primary/20 max-w-md">
                <img
                  src={heroModel}
                  alt="Find your match"
                  className="w-full h-auto object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Matching on
                      </p>
                      <p className="font-semibold text-foreground">
                        Feb 13, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Right side */}
          <div className="order-2 lg:order-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in-up">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm text-primary font-medium">
                VIT Valentine's Day 2026
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up stagger-1">
              Find Your <span className="gradient-text">VMET Match</span>
              <span className="inline-block ml-2 animate-heartbeat">💕</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in-up stagger-2">
              This Valentine's Day, let VMET match you with someone who shares
              your vibe. Connect with VITians across all campuses!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">4 Campuses</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Results on Feb 14</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-4">
              <Link to="/register">
                <Button className="btn-outline w-full sm:w-auto text-lg px-10 py-6 rounded-full">
                  Register Now
                  <Heart className="ml-2 w-5 h-5 fill-current" />
                </Button>
              </Link>
              <Link to="/login">
                <Button className="btn-outline w-full sm:w-auto text-lg px-10 py-6 rounded-full">
                  Login
                </Button>
              </Link>
            </div>

            {/* Campus badges */}
            <div className="mt-10 animate-fade-in-up stagger-5">
              <p className="text-sm text-muted-foreground mb-3">Available at</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {["Vellore", "Chennai", "Amaravati", "Bhopal"].map((campus) => (
                  <span
                    key={campus}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground/80"
                  >
                    VIT {campus}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
