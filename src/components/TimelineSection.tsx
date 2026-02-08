import { UserPlus, Calendar, Heart } from "lucide-react";

const timeline = [
  {
    date: "Before Feb 13",
    title: "Register & Complete Profile",
    description: "Sign up, select your hobbies, and tell us about yourself.",
    icon: UserPlus,
  },
  {
    date: "Feb 13",
    title: "Matching Day",
    description: "Our algorithm works its magic to find your perfect match.",
    icon: Calendar,
  },
  {
    date: "Feb 14",
    title: "Valentine's Reveal",
    description: "Discover your match and start your love story!",
    icon: Heart,
  },
];

const TimelineSection = () => {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to find your Valentine's match
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

            {timeline.map((item, index) => (
              <div
                key={item.title}
                className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`glass-card p-6 flex-1 ml-8 md:ml-0 md:max-w-md ${
                    index % 2 === 0
                      ? "md:mr-auto md:pr-20"
                      : "md:ml-auto md:pl-20"
                  }`}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {item.date}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
