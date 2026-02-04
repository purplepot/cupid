import { Heart } from "lucide-react";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 4}s`,
    size: 12 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute text-primary fill-primary floating-heart"
          style={{
            left: heart.left,
            top: `${Math.random() * 100}%`,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingHearts;
