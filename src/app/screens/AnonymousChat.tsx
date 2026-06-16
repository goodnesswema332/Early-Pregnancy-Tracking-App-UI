import { ArrowLeft, Send, Shield, MessageCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

export function AnonymousChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to our anonymous support chat. This is a safe, confidential space where you can ask any questions about reproductive health, education, or personal concerns. How can we help you today?",
      sender: "support",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for reaching out. A trained counselor will respond to your message shortly. In the meantime, you can explore our educational resources or FAQs for immediate information.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col pb-20">
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl">Anonymous Chat</h1>
                <Badge className="bg-green-500 text-white border-0">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-blue-100 text-sm ml-14">
            Private &amp; confidential support
          </p>
        </div>
      </header>

      {/* Privacy Notice */}
      <div className="max-w-md mx-auto px-6 py-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-blue-900">100% Anonymous:</strong> We
                    don&apos;t collect personal information. Your conversations are
                  private and confidential.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 space-y-4 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
                  : "bg-white border border-gray-200"
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              {msg.sender === "support" && (
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">
                    Support Team
                  </span>
                </div>
              )}
              <p
                className={`text-sm leading-relaxed ${msg.sender === "user" ? "text-white" : "text-gray-800"}`}
              >
                {msg.text}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Clock
                  className={`w-3 h-3 ${msg.sender === "user" ? "text-teal-100" : "text-gray-400"}`}
                />
                <span
                  className={`text-xs ${msg.sender === "user" ? "text-teal-100" : "text-gray-500"}`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-16 max-w-md mx-auto w-full">
        <div className="flex items-end gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 min-h-[44px] resize-none rounded-xl border-gray-300"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Response time: Usually within 5-10 minutes
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
