import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sprout, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-2 group-hover:bg-primary-light transition-smooth">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">AgriGenius AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth font-medium">
              Home
            </Link>
            <Link to="/chatbot" className="text-foreground hover:text-primary transition-smooth font-medium">
              Chatbot
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth font-medium">
              About
            </Link>
            <Button variant="hero" size="sm" asChild>
              <Link to="/chatbot">Ask AgriGenius</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-smooth"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <Link
              to="/"
              className="block px-4 py-2 text-foreground hover:bg-accent rounded-md transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/chatbot"
              className="block px-4 py-2 text-foreground hover:bg-accent rounded-md transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Chatbot
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-foreground hover:bg-accent rounded-md transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-4 pt-2">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/chatbot" onClick={() => setIsMenuOpen(false)}>
                  Ask AgriGenius
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
