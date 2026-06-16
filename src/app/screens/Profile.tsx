import {
  User,
  Award,
  TrendingUp,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Star,
  Trophy,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { BottomNav } from "../components/BottomNav";

export function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white/30">
              <AvatarFallback className="bg-teal-700 text-white text-2xl">
                A
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl mb-1">Alex</h1>
              <p className="text-teal-100 text-sm">Learning since May 2026</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 -mt-6 space-y-6">
        {/* Stats Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-teal-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-2xl mb-1">5</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl mb-1">3</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl mb-1">42%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-amber-500" />
              Earned Badges
            </CardTitle>
            <CardDescription>Keep learning to unlock more!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="text-xs text-gray-700">First Steps</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-md">
                  <Award className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="text-xs text-gray-700">Quiz Master</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs text-gray-700">On Fire</div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Next badge: Complete 10 quizzes
              </p>
              <Badge variant="secondary" className="bg-gray-100">
                7/10 completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Options */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-gray-700"
            >
              <User className="w-5 h-5 text-teal-600" />
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-gray-700"
            >
              <Bell className="w-5 h-5 text-teal-600" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-gray-700"
            >
              <Settings className="w-5 h-5 text-teal-600" />
              App Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-gray-700"
            >
              <HelpCircle className="w-5 h-5 text-teal-600" />
              Help & Support
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 pb-4">
          <p>Early Pregnancy Tracking App</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
