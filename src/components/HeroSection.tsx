import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful agricultural landscape at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Agricultural Intelligence</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Empowering Farmers Through{" "}
            <span className="gradient-sunrise bg-clip-text text-transparent">
              Climate Resilience
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
            Get personalized agricultural advice powered by real-time weather data, soil analysis, 
            and AI-driven insights. Available in your language, right on your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" asChild className="group">
              <Link to="/chatbot">
                <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Ask AgriGenius
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/50">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">Multi</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
