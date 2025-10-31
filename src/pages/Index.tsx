import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Cloud, Droplets, Brain, Languages, MessageSquare, TrendingUp } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Cloud,
      title: "Weather Forecast",
      description: "Real-time weather data with temperature, humidity, and rainfall predictions for your region.",
      iconColor: "text-primary",
    },
    {
      icon: Droplets,
      title: "Soil Analysis",
      description: "Detailed soil moisture, nutrient levels, and texture information from satellite data.",
      iconColor: "text-secondary",
    },
    {
      icon: Brain,
      title: "AI Crop Advisory",
      description: "Personalized agricultural recommendations powered by advanced AI language models.",
      iconColor: "text-accent",
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Interact in Hindi, Tamil, Marathi, and other regional languages for better accessibility.",
      iconColor: "text-primary-light",
    },
    {
      icon: MessageSquare,
      title: "24/7 Chat Support",
      description: "Get instant answers to your farming queries anytime through our intelligent chatbot.",
      iconColor: "text-secondary-light",
    },
    {
      icon: TrendingUp,
      title: "Data Analytics",
      description: "Track your queries and get insights on crop trends and regional farming patterns.",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                Comprehensive Agricultural Intelligence
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make informed decisions about your crops, 
                powered by cutting-edge AI and real-time data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  iconColor={feature.iconColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center gradient-card rounded-2xl p-8 sm:p-12 shadow-strong">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start getting personalized agricultural advice powered by AI and real-time data today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/chatbot"
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 bg-accent text-accent-foreground hover:bg-accent-light shadow-medium hover:shadow-strong transition-all duration-300 font-semibold"
                >
                  <MessageSquare className="h-5 w-5" />
                  Start Chatting Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
