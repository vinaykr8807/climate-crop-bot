import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! 🙏 I'm AgriGenius AI, your agricultural assistant. How can I help you today? Ask me about crops, weather, soil conditions, or any farming advice you need.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: Connect to backend API
      // For now, simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        role: "assistant",
        content: `I understand you're asking about: "${input}". To provide you with accurate agricultural advice, I'll need to integrate with the weather and soil data APIs. Please ensure the backend API keys are configured.`,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
            Chat with AgriGenius AI
          </h1>
          <p className="text-muted-foreground">
            Get personalized agricultural advice in your preferred language
          </p>
          
          {/* Language Selector */}
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">Language:</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="mb-6 p-4 sm:p-6 min-h-[400px] max-h-[500px] overflow-y-auto shadow-medium">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crops, weather, soil conditions..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            variant="hero"
            size="icon"
            className="h-10 w-10"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Note: Backend API integration required for full functionality
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Chatbot;
