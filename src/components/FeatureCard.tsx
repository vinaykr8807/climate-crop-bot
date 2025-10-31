import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconColor = "text-primary" }: FeatureCardProps) => {
  return (
    <Card className="gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <CardContent className="pt-6">
        <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
