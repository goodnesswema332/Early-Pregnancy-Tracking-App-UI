import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FAQ() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const faqs: FAQItem[] = [
    {
      id: "1",
      category: "Reproductive Health",
      question: "What is reproductive health education?",
      answer:
        "Reproductive health education teaches you about your body, how it works, and how to make informed decisions about your health and future. It includes understanding puberty, menstruation, relationships, and how to protect yourself.",
    },
    {
      id: "2",
      category: "Reproductive Health",
      question: "At what age can pregnancy occur?",
      answer:
        "Pregnancy can occur once a girl starts menstruating (having periods), which typically happens between ages 10-15. This is why it's crucial to understand your body and make informed decisions about relationships.",
    },
    {
      id: "3",
      category: "Prevention",
      question: "How can I prevent early pregnancy?",
      answer:
        "The most effective way is abstinence - choosing not to engage in sexual activity. Other important steps include: focusing on your education, setting personal goals, seeking guidance from trusted adults, and avoiding peer pressure situations.",
    },
    {
      id: "4",
      category: "Education",
      question: "Why is education important for my future?",
      answer:
        "Education opens doors to career opportunities, financial independence, and a better quality of life. Completing your education helps you achieve your dreams, support yourself and your future family, and make informed life decisions.",
    },
    {
      id: "5",
      category: "Support",
      question: "Where can I get help if I have questions?",
      answer:
        "You can talk to trusted adults like parents, teachers, or school counselors. You can also visit youth-friendly health clinics in your area. Remember, seeking information and help is a sign of strength, not weakness.",
    },
    {
      id: "6",
      category: "Health Services",
      question: "What are youth-friendly health services?",
      answer:
        "These are health facilities that provide confidential, non-judgmental healthcare specifically designed for young people. They offer reproductive health information, counseling, and support in a safe and private environment.",
    },
    {
      id: "7",
      category: "Decision Making",
      question: "How do I handle peer pressure?",
      answer:
         "Remember your goals and values. Practice saying &apos;no&apos; confidently. Surround yourself with friends who respect your choices. It&apos;s okay to walk away from situations that make you uncomfortable. Your future is more important than fitting in.",
    },
    {
      id: "8",
      category: "Consequences",
      question: "What are the consequences of early pregnancy?",
      answer:
        "Early pregnancy can lead to dropping out of school, health complications, limited career opportunities, financial challenges, and emotional stress. It affects not just you, but your family and your future child as well.",
    },
    {
      id: "9",
      category: "Goal Setting",
      question: "How can I set and achieve my life goals?",
      answer:
        "Start by identifying what you want to achieve (education, career, personal growth). Write down specific goals with timelines. Break them into smaller steps. Stay focused on your education, and avoid situations that could derail your plans.",
    },
    {
      id: "10",
      category: "Privacy",
      question: "Is my information private when I use this app?",
      answer:
        "Yes! This app is designed to protect your privacy. All your activity, learning progress, and any questions you ask are kept confidential. Your personal information is secure and not shared with anyone.",
    },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl">Frequently Asked Questions</h1>
            </div>
          </div>
          <p className="text-blue-100 text-sm ml-14">
            Get answers to common questions
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Intro Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm mb-2">
                  <strong className="text-blue-900">Have questions?</strong>
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  We&apos;ve compiled answers to the most common questions about
                  reproductive health, education, and making informed decisions.
                  If you don&apos;t find what you&apos;re looking for, use our anonymous
                  chat feature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {category}
              </Badge>
            </div>

            <div className="space-y-2">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq) => (
                  <Collapsible
                    key={faq.id}
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleItem(faq.id)}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                      <CollapsibleTrigger className="w-full text-left">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-base text-gray-800 leading-snug">
                              {faq.question}
                            </CardTitle>
                            <ChevronDown
                              className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                                openItems.includes(faq.id)
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
            </div>
          </div>
        ))}

        {/* Help Card */}
        <Card className="shadow-md bg-gradient-to-br from-teal-50 to-white border-teal-200">
          <CardContent className="pt-6">
            <p className="text-sm text-center mb-4">
              Didn&apos;t find what you were looking for?
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md"
            >
              Ask via Anonymous Chat
            </button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
