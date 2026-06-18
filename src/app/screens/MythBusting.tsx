import { ArrowLeft, X, Check, AlertCircle, Lightbulb } from "lucide-react";
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
import { BottomNav } from "../components/BottomNav";

interface Myth {
  id: string;
  myth: string;
  truth: string;
  explanation: string;
  category: string;
}

export function MythBusting() {
  const navigate = useNavigate();
  const [selectedMyth, setSelectedMyth] = useState<string | null>(null);

  const myths: Myth[] = [
    {
      id: "1",
      category: "Pregnancy Facts",
      myth: "You can&apos;t get pregnant the first time",
      truth:
        "FALSE - You can get pregnant any time you engage in sexual activity, including the first time.",
      explanation:
        "Once a girl starts menstruating, pregnancy is possible. The risk exists regardless of whether it's the first time or not. This is why understanding reproductive health and making informed decisions is crucial.",
    },
    {
      id: "2",
      category: "Pregnancy Facts",
      myth: "You can&apos;t get pregnant during your period",
      truth:
        "FALSE - While less likely, pregnancy can still occur during menstruation.",
      explanation:
        "Sperm can live inside the body for several days. If you have a short menstrual cycle, ovulation could occur soon after your period, making pregnancy possible. There is no 'completely safe' time.",
    },
    {
      id: "3",
      category: "Prevention",
      myth: "Jumping up and down after sex prevents pregnancy",
      truth:
        "FALSE - Physical activities like jumping, douching, or urinating do not prevent pregnancy.",
      explanation:
        "Once conception occurs, no physical action can reverse it. The only sure way to prevent pregnancy is abstinence. Methods like these are dangerous myths that put young people at risk.",
    },
    {
      id: "4",
      category: "Education",
      myth: "Talking about reproductive health encourages sexual activity",
      truth:
        "FALSE - Education actually helps young people make safer, more informed decisions.",
      explanation:
        "Research shows that comprehensive reproductive health education delays sexual activity and reduces teen pregnancy rates. Knowledge empowers you to make responsible choices about your future.",
    },
    {
      id: "5",
      category: "Health",
      myth: "You can tell if someone has an STI by looking at them",
      truth:
        "FALSE - Many sexually transmitted infections have no visible symptoms.",
      explanation:
        "STIs often have no obvious signs, which is why they spread so easily. This is another reason why abstinence until you're ready and with the right person is the safest choice for young people.",
    },
    {
      id: "6",
      category: "Pregnancy Facts",
      myth: "You can&apos;t get pregnant if you don't reach orgasm",
      truth: "FALSE - Pregnancy has nothing to do with orgasm or pleasure.",
      explanation:
        "Pregnancy occurs when sperm meets egg, regardless of anyone's feelings or physical sensations. This myth is completely false and dangerously misleading.",
    },
    {
      id: "7",
      category: "Education",
      myth: "Only 'bad girls' need reproductive health information",
      truth: "FALSE - Every young person deserves accurate health information.",
      explanation:
        "Seeking knowledge about your body and health is responsible and smart, not shameful. Understanding reproductive health helps you protect your future, make informed decisions, and achieve your goals.",
    },
    {
      id: "8",
      category: "Prevention",
      myth: "Early pregnancy isn't that serious",
      truth:
        "FALSE - Early pregnancy has serious consequences for health, education, and future opportunities.",
      explanation:
        "Teen mothers are more likely to drop out of school, face health complications, experience poverty, and have limited career options. Early pregnancy affects not just you, but your entire future and your family.",
    },
    {
      id: "9",
      category: "Health",
      myth: "You can&apos;t get pregnant while breastfeeding",
      truth:
        "FALSE - Breastfeeding is not a reliable form of pregnancy prevention.",
      explanation:
        "While breastfeeding can delay the return of menstruation, ovulation can occur before your period returns, making pregnancy possible. This myth has led to many unplanned pregnancies.",
    },
    {
      id: "10",
      category: "Support",
      myth: "I can't talk to my parents about reproductive health",
      truth:
        "FALSE - Many parents want to support their children but may need help starting the conversation.",
      explanation:
        "While it might feel awkward, most parents care deeply about your wellbeing and safety. They can be valuable sources of guidance. If talking to parents is difficult, seek help from school counselors, trusted teachers, or youth-friendly health services.",
    },
  ];

  const categories = Array.from(new Set(myths.map((m) => m.category)));

  return (
    <div className="min-h-screen bg-[#D95F8A] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-coral-600 to-coral-500 text-white px-6 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl">Myth vs. Fact</h1>
            </div>
          </div>
          <p className="text-coral-100 text-sm ml-14">
            Learn the truth about common myths
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Intro Card */}
        <Card className="bg-gradient-to-br from-coral-50 to-white border-coral-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-coral-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm mb-2">
                  <strong className="text-coral-900">
                    Fight Misinformation
                  </strong>
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  There are many dangerous myths about reproductive health
                  spread through friends, social media, and the internet. Let&apos;s
                  separate fact from fiction to help you make informed
                  decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-1">10</div>
              <div className="text-xs text-gray-600">Common Myths</div>
            </CardContent>
          </Card>
          <Card className="shadow-md text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-1">100%</div>
              <div className="text-xs text-gray-600">Fact-Checked</div>
            </CardContent>
          </Card>
        </div>

        {/* Myths by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Badge
                variant="secondary"
                className="bg-coral-100 text-coral-700"
              >
                {category}
              </Badge>
            </div>

            <div className="space-y-3">
              {myths
                .filter((m) => m.category === category)
                .map((myth) => (
                  <Card
                    key={myth.id}
                    className={`shadow-md hover:shadow-lg transition-all cursor-pointer ${
                      selectedMyth === myth.id ? "ring-2 ring-coral-500" : ""
                    }`}
                    onClick={() =>
                      setSelectedMyth(selectedMyth === myth.id ? null : myth.id)
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base text-gray-800 leading-snug mb-2">
                            {myth.myth}
                          </CardTitle>
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            MYTH
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    {selectedMyth === myth.id && (
                      <CardContent className="space-y-4 pt-0 border-t">
                        <div className="flex items-start gap-3 mt-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">
                              FACT
                            </Badge>
                            <p className="text-sm text-gray-900 font-medium leading-relaxed">
                              {myth.truth}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-3">
                          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-amber-900 font-medium mb-1">
                              Why this matters:
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {myth.explanation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        ))}

        {/* Action Card */}
        <Card className="shadow-md bg-gradient-to-br from-teal-50 to-white border-teal-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm mb-4">
              Have you heard a myth that&apos;s not listed here?
            </p>
            <Button
              onClick={() => navigate("/chat")}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Ask via Anonymous Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
