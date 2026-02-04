import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="text-lg font-display font-bold gradient-text">VMET</span>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            Made with <Heart className="inline w-4 h-4 text-primary fill-primary mx-1" /> for VITians
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-primary transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
