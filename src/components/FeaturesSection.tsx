import { Heart, Users, Lock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Smart Matching",
    description: "Our algorithm finds your perfect match based on shared hobbies and interests.",
  },
  {
    icon: Users,
    title: "Campus-Based",
    description: "Connect with students from your own campus for easier meetups.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is safe. Matches are revealed only on Valentine's Day.",
  },
  {
    icon: Sparkles,
    title: "Personality Match",
    description: "Go beyond looks. Find someone who truly gets you.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(330_90%_60%/0.08),_transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why <span className="gradient-text">VMET</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're not just another dating app. We're built specifically for VIT students 
            to find meaningful connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
