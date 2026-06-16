import { createBrowserRouter } from "react-router";
import { Dashboard } from "./screens/Dashboard";
import { EducationalLibrary } from "./screens/EducationalLibrary";
import { MiniGamesHub } from "./screens/MiniGamesHub";
import { QuizGame } from "./screens/QuizGame";
import { Profile } from "./screens/Profile";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { FAQ } from "./screens/FAQ";
import { MythBusting } from "./screens/MythBusting";
import { AnonymousChat } from "./screens/AnonymousChat";
import { HealthServices } from "./screens/HealthServices";
import { Goals } from "./screens/Goals";
import { Videos } from "./screens/Videos";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/learn",
    Component: EducationalLibrary,
  },
  {
    path: "/play",
    Component: MiniGamesHub,
  },
  {
    path: "/quiz/:gameId",
    Component: QuizGame,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/faq",
    Component: FAQ,
  },
  {
    path: "/myth-busting",
    Component: MythBusting,
  },
  {
    path: "/chat",
    Component: AnonymousChat,
  },
  {
    path: "/health-services",
    Component: HealthServices,
  },
  {
    path: "/goals",
    Component: Goals,
  },
  {
    path: "/videos",
    Component: Videos,
  },
]);
