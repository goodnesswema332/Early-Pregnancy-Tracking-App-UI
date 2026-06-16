import {
  ArrowLeft,
  Clock,
  BookOpen,
  Heart,
  Brain,
  Calendar,
  Users,
  Shield,
  HelpCircle,
  AlertCircle,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Topic {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  completed?: boolean;
}

export function EducationalLibrary() {
  const navigate = useNavigate();

  const topics: Topic[] = [
    {
      id: "1",
      title: "Understanding Your Body",
      description:
        "Learn about reproductive health and body changes during adolescence",
      readTime: "5 min",
      category: "Health Basics",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1604480131833-5d7aea770e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3MlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzc5ODg0MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      completed: true,
    },
    {
      id: "2",
      title: "Early Pregnancy Signs",
      description:
        "Recognizing the physical and emotional signs of early pregnancy",
      readTime: "8 min",
      category: "Awareness",
      icon: Calendar,
      image:
        "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFuY3klMjBoZWFsdGglMjBhd2FyZW5lc3N8ZW58MXx8fHwxNzc5ODg0MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "3",
      title: "Mental Health & Wellness",
      description:
        "Taking care of your emotional wellbeing during challenging times",
      readTime: "6 min",
      category: "Mental Health",
      icon: Brain,
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVlbnMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3OTg4NDMxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "4",
      title: "Nutrition & Self-Care",
      description:
        "Essential nutrition tips and self-care practices for your health",
      readTime: "7 min",
      category: "Wellness",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1553729784-e91953dec042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcmVhZGluZyUyMGJvb2slMjBlZHVjYXRpb258ZW58MXx8fHwxNzc5ODg0MzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "5",
      title: "Support Systems",
      description:
        "How to talk to trusted adults and find support when you need it",
      readTime: "5 min",
      category: "Support",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVlbnMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3OTg4NDMxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "6",
      title: "Your Rights & Safety",
      description:
        "Understanding your rights and staying safe in any situation",
      readTime: "6 min",
      category: "Safety",
      icon: Shield,
      image:
        "https://images.unsplash.com/photo-1604480131833-5d7aea770e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3MlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzc5ODg0MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-gray-600">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl">Educational Library</h1>
              <p className="text-sm text-gray-500">Learn at your own pace</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-4">
        {/* Quick Access Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => navigate("/faq")}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50"
          >
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span className="text-xs">FAQ</span>
          </Button>
          <Button
            onClick={() => navigate("/myth-busting")}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-2 border-coral-200 hover:bg-coral-50"
          >
            <AlertCircle className="w-6 h-6 text-coral-600" />
            <span className="text-xs">Myths</span>
          </Button>
          <Button
            onClick={() => navigate("/videos")}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50"
          >
            <Video className="w-6 h-6 text-purple-600" />
            <span className="text-xs">Videos</span>
          </Button>
        </div>

        <h2 className="text-lg px-1 pt-2">Educational Topics</h2>

        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card
              key={topic.id}
              className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 relative">
                  <ImageWithFallback
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent" />
                  {topic.completed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 py-4 pr-4">
                  <div className="flex items-start gap-2 mb-1">
                    <Icon className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-snug mb-1">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {topic.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-teal-100 text-teal-700"
                    >
                      {topic.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {topic.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-teal-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-base">Keep Learning!</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-700">
              New educational content is added weekly. Check back often to
              expand your knowledge.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
