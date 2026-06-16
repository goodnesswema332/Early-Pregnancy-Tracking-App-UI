import { Sparkles, BookOpen, Gamepad2, Target, Award, TrendingUp, MessageCircle, MapPin, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl">Hey there! 👋</h1>
            <Badge className="bg-white/20 text-white border-white/30">Day 5</Badge>
          </div>
          <p className="text-teal-100">Your safe space for learning and growth</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 -mt-6 space-y-6">
        {/* Daily Tip Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-coral-50 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral-100/30 rounded-full -mr-16 -mt-16" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-coral-500" />
              <CardTitle className="text-lg text-coral-700">Today's Insight</CardTitle>
            </div>
            <CardDescription className="text-base text-gray-700">
              "Understanding your body is the first step to making informed choices. Knowledge empowers you to take control of your health and future."
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progress Tracker */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-teal-600" />
                Your Learning Progress
              </CardTitle>
              <Badge variant="secondary" className="bg-teal-100 text-teal-700">42%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion</span>
                <span className="text-teal-600">5/12 modules</span>
              </div>
              <Progress value={42} className="h-3 bg-teal-100" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-gray-600">Badges</div>
                  <div className="font-semibold">3 earned</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-gray-600">Streak</div>
                  <div className="font-semibold">5 days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Goals */}
        <Card className="shadow-md bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                My Future Goals
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/goals")}
                className="text-amber-700 hover:text-amber-800"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm">Complete high school with good grades</p>
                <p className="text-xs text-gray-500 mt-1">Due: 2028</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm">Join university to study medicine</p>
                <p className="text-xs text-gray-500 mt-1">Due: 2029</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Buttons */}
        <div className="space-y-3">
          <h2 className="text-lg px-1">Explore Features</h2>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/learn")}
              className="h-auto py-6 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-2xl flex flex-col gap-2 shadow-md"
            >
              <BookOpen className="w-8 h-8" />
              <div className="text-sm">Learn</div>
            </Button>

            <Button
              onClick={() => navigate("/play")}
              className="h-auto py-6 bg-gradient-to-br from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 rounded-2xl flex flex-col gap-2 shadow-md"
            >
              <Gamepad2 className="w-8 h-8" />
              <div className="text-sm">Quiz & Games</div>
            </Button>

            <Button
              onClick={() => navigate("/chat")}
              className="h-auto py-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex flex-col gap-2 shadow-md"
            >
              <MessageCircle className="w-8 h-8" />
              <div className="text-sm">Anonymous Chat</div>
            </Button>

            <Button
              onClick={() => navigate("/health-services")}
              className="h-auto py-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl flex flex-col gap-2 shadow-md"
            >
              <MapPin className="w-8 h-8" />
              <div className="text-sm">Find Help</div>
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="shadow-md bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm mb-2">
                  <strong className="text-blue-900">Your privacy matters</strong>
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Everything you do here is private and confidential. We're here to support you with accurate information to make informed decisions about your future.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Learning */}
        <div className="space-y-3 pb-4">
          <h2 className="text-lg px-1">Continue Learning</h2>
          <Card className="shadow-md overflow-hidden">
            <div className="aspect-video relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1553729784-e91953dec042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcmVhZGluZyUyMGJvb2slMjBlZHVjYXRpb258ZW58MXx8fHwxNzc5ODg0MzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Learning"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute top-3 right-3 bg-teal-500">In Progress</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-base">Understanding Early Pregnancy Signs</CardTitle>
              <CardDescription>Module 2 • 8 min read</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate("/learn")}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Continue Reading
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
