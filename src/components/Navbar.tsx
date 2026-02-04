import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Heart className="w-8 h-8 text-primary fill-primary animate-heartbeat" />
          </div>
          <span className="text-xl font-display font-bold gradient-text">
            VMET
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground hover:bg-white/5">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="btn-primary text-sm px-6 py-2">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
