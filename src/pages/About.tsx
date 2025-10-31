import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Database, Brain, Languages, MessageSquare, Sprout } from "lucide-react";

const About = () => {
  const technologies = [
    {
      icon: Cloud,
      title: "OpenWeatherMap API",
      description: "Real-time weather data including temperature, humidity, and rainfall forecasts to help farmers plan their activities.",
    },
    {
      icon: Database,
      title: "Satellite Soil Data",
      description: "Advanced soil analysis providing moisture levels, nutrient content, and texture properties for optimal crop management.",
    },
    {
      icon: Brain,
      title: "Ollama Cloud LLM",
      description: "Domain-specific agricultural intelligence powered by advanced language models for contextual advice and recommendations.",
    },
    {
      icon: Languages,
      title: "iFlytek Translation",
      description: "Multilingual support enabling farmers to interact in Hindi, Tamil, Marathi, and other regional languages.",
    },
    {
      icon: MessageSquare,
      title: "Twilio Integration",
      description: "SMS and WhatsApp connectivity for farmers without internet access, ensuring inclusive agricultural support.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-white">
                About AgriGenius AI
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Bridging the gap between farmers and modern agricultural technology through 
                AI-powered climate resilience solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
            <Card className="gradient-card border-border/50 shadow-medium">
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  AgriGenius AI is dedicated to empowering farmers with cutting-edge technology 
                  that makes climate-smart agriculture accessible to everyone. We believe that 
                  every farmer deserves access to real-time data and AI-driven insights to make 
                  informed decisions about their crops.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  By combining weather forecasts, soil analysis, and agricultural expertise 
                  through an intelligent chatbot interface, we're helping farmers adapt to 
                  climate change and improve their yield while preserving sustainable practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
                Powered by Advanced Technology
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We integrate multiple APIs and AI services to provide comprehensive agricultural support
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technologies.map((tech, index) => (
                  <Card
                    key={index}
                    className="gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <tech.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{tech.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tech.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Key Features</h2>
            <div className="space-y-6">
              <Card className="gradient-card border-border/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    🌤️ Real-Time Weather Insights
                  </h3>
                  <p className="text-muted-foreground">
                    Access accurate weather forecasts, rainfall predictions, and temperature data 
                    specific to your region to plan farming activities effectively.
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-border/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    🌱 Soil Health Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Get detailed information about soil moisture, nutrient levels, and texture to 
                    optimize crop selection and fertilizer application.
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-border/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    🧠 AI-Powered Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Receive personalized crop advisory based on your location, season, and current 
                    weather and soil conditions through our intelligent chatbot.
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-border/50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    🌐 Multilingual Support
                  </h3>
                  <p className="text-muted-foreground">
                    Interact with AgriGenius in your preferred language - English, Hindi, Tamil, 
                    Marathi, and more regional languages supported.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
