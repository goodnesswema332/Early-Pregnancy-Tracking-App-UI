import {
  ArrowLeft,
  Star,
  Plus,
  Target,
  GraduationCap,
  Briefcase,
  Heart,
  Trophy,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { BottomNav } from "../components/BottomNav";

interface Goal {
  id: string;
  title: string;
  category: string;
  deadline: string;
  progress: number;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export function Goals() {
  const navigate = useNavigate();

  const [goals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete high school with good grades",
      category: "Education",
      deadline: "2028",
      progress: 60,
      completed: false,
      icon: GraduationCap,
    },
    {
      id: "2",
      title: "Join university to study medicine",
      category: "Career",
      deadline: "2029",
      progress: 20,
      completed: false,
      icon: Briefcase,
    },
    {
      id: "3",
      title: "Complete all educational modules in the app",
      category: "Learning",
      deadline: "Jun 2026",
      progress: 42,
      completed: false,
      icon: Target,
    },
    {
      id: "4",
      title: "Talk to my parents about my future plans",
      category: "Personal",
      deadline: "May 2026",
      progress: 100,
      completed: true,
      icon: Heart,
    },
  ]);

  const categoryColors: Record<string, { bg: string; text: string }> = {
    Education: { bg: "bg-teal-100", text: "text-teal-700" },
    Career: { bg: "bg-purple-100", text: "text-purple-700" },
    Learning: { bg: "bg-blue-100", text: "text-blue-700" },
    Personal: { bg: "bg-coral-100", text: "text-coral-700" },
  };

  return (
    <div className="min-h-screen bg-[#D95F8A] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl">My Future Goals</h1>
            </div>
          </div>
          <p className="text-amber-100 text-sm ml-14">
            Plan and track your journey to success
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Motivation Card */}
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Trophy className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1 fill-amber-600" />
              <div>
                <p className="text-sm mb-2">
                  <strong className="text-amber-900">
                    Why Goal Setting Matters
                  </strong>
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                        Having clear goals helps you make better decisions today for a
                        brighter tomorrow. Each goal you achieve builds confidence and
                        brings you closer to your dreams. Your future is worth
                        protecting!
                      </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-md text-center">
            <CardContent className="pt-6">
              <div className="text-2xl mb-1">{goals.length}</div>
              <div className="text-xs text-gray-600">Total Goals</div>
            </CardContent>
          </Card>
          <Card className="shadow-md text-center">
            <CardContent className="pt-6">
              <div className="text-2xl mb-1">
                {goals.filter((g) => g.completed).length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="shadow-md text-center">
            <CardContent className="pt-6">
              <div className="text-2xl mb-1">
                {goals.filter((g) => !g.completed).length}
              </div>
              <div className="text-xs text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Button */}
        <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Add New Goal
        </Button>

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-lg px-1">Your Goals</h2>

          {/* Active Goals */}
          {goals
            .filter((g) => !g.completed)
            .map((goal) => {
              const Icon = goal.icon;
              const colors = categoryColors[goal.category];

              return (
                <Card
                  key={goal.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2 leading-snug">
                          {goal.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className={`${colors.bg} ${colors.text}`}
                          >
                            {goal.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {goal.deadline}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className={`font-medium ${colors.text}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className={`h-2 ${colors.bg}`}
                    />
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Update Progress
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {/* Completed Goals */}
          {goals.filter((g) => g.completed).length > 0 && (
            <>
              <h3 className="text-base px-1 text-gray-600 pt-4">Completed</h3>
              {goals
                .filter((g) => g.completed)
                .map((goal) => {
                  
                  return (
                    <Card
                      key={goal.id}
                      className="shadow-sm bg-gray-50 border-gray-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-2 leading-snug text-gray-600">
                              {goal.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700"
                              >
                                Completed
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {goal.deadline}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
            </>
          )}
        </div>

        {/* Inspiration Card */}
        <Card className="shadow-md bg-gradient-to-br from-teal-50 to-white border-teal-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-600 fill-teal-600" />
              Remember
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Every decision you make today affects your future goals
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Protecting your education means protecting your dreams
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                You deserve a bright future - don&apos;t let anyone compromise it
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
