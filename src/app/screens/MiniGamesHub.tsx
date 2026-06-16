import { ArrowLeft, Trophy, Star, Zap, Brain, Target, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";

interface MiniGame {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  difficulty: string;
  points: number;
  completed?: boolean;
  score?: number;
}

export function MiniGamesHub() {
  const navigate = useNavigate();

  const games: MiniGame[] = [
    {
      id: "myth-vs-fact",
      title: "Myth vs. Fact Challenge",
      description: "Test your knowledge by separating pregnancy myths from medical facts",
      icon: Brain,
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-purple-600",
      difficulty: "Easy",
      points: 50,
      completed: true,
      score: 45,
    },
    {
      id: "scenario-quiz",
      title: "Real-Life Scenarios",
      description: "Make informed decisions in realistic situations and learn from outcomes",
      icon: Target,
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      difficulty: "Medium",
      points: 100,
    },
    {
      id: "health-trivia",
      title: "Health & Wellness Trivia",
      description: "Answer questions about nutrition, mental health, and self-care",
      icon: Zap,
      color: "text-amber-600",
      bgGradient: "from-amber-500 to-amber-600",
      difficulty: "Easy",
      points: 75,
      completed: true,
      score: 60,
    },
    {
      id: "support-navigator",
      title: "Support Navigator",
      description: "Learn how to find and access support resources in your community",
      icon: Award,
      color: "text-teal-600",
      bgGradient: "from-teal-500 to-teal-600",
      difficulty: "Medium",
      points: 80,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50 to-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-coral-500 to-coral-600 text-white px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate("/")} className="text-white/90 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl">Mini-Games Hub</h1>
              <p className="text-coral-100 text-sm">Learn while having fun!</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs text-coral-100">Total Points</div>
              <div className="font-semibold">215</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs text-coral-100">Games Won</div>
              <div className="font-semibold">2</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs text-coral-100">Rank</div>
              <div className="font-semibold">Bronze</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${game.bgGradient}`} />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${game.bgGradient} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <CardTitle className="text-lg leading-snug">{game.title}</CardTitle>
                      {game.completed && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {game.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="text-xs">
                    {game.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-600" />
                    <span>{game.points} pts</span>
                  </div>
                  {game.score !== undefined && (
                    <div className="text-gray-600">
                      Score: <span className="font-semibold text-teal-600">{game.score}/{game.points}</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => navigate(`/quiz/${game.id}`)}
                  className={`w-full bg-gradient-to-r ${game.bgGradient} hover:opacity-90`}
                >
                  {game.completed ? "Play Again" : "Start Game"}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Encouragement Card */}
        <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-base">Keep Playing!</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-700">
              Each game you complete earns you points and badges. Climb the leaderboard and unlock achievements!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
