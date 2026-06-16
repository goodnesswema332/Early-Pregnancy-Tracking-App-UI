import { ArrowLeft, Play, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
}

export function Videos() {
  const navigate = useNavigate();

  const videos: Video[] = [
    {
      id: "1",
      title: "Understanding Puberty and Body Changes",
      description: "A comprehensive guide to understanding the physical and emotional changes during puberty",
      duration: "8:45",
      views: "12.5K",
      category: "Health Education",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "2",
      title: "Making Smart Decisions About Your Future",
      description: "Learn how your choices today impact your tomorrow and how to set yourself up for success",
      duration: "6:30",
      views: "18.2K",
      category: "Life Skills",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "3",
      title: "The Real Facts About Early Pregnancy",
      description: "Understanding the health, social, and educational impacts of teenage pregnancy",
      duration: "10:15",
      views: "25.8K",
      category: "Awareness",
      thumbnail: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "4",
      title: "How to Talk to Your Parents",
      description: "Tips and strategies for having important conversations with parents and trusted adults",
      duration: "7:20",
      views: "9.4K",
      category: "Communication",
      thumbnail: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "5",
      title: "Building Self-Confidence and Self-Worth",
      description: "Learn to value yourself and make decisions that align with your goals and values",
      duration: "9:00",
      views: "14.1K",
      category: "Mental Health",
      thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "6",
      title: "Recognizing and Avoiding Peer Pressure",
      description: "Strategies to stay true to yourself and resist negative influences from peers",
      duration: "8:10",
      views: "11.7K",
      category: "Life Skills",
      thumbnail: "https://images.unsplash.com/photo-1529390079861-591de354faf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "7",
      title: "Your Educational Journey Matters",
      description: "Why staying in school is crucial for your future and how to overcome challenges",
      duration: "7:45",
      views: "16.3K",
      category: "Education",
      thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "8",
      title: "Finding Support When You Need It",
      description: "Where to find help, who to talk to, and resources available for young people",
      duration: "6:55",
      views: "8.9K",
      category: "Support",
      thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl">Educational Videos</h1>
            </div>
          </div>
          <p className="text-purple-100 text-sm ml-14">Watch and learn at your own pace</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm mb-2">
                <strong className="text-purple-900">Learn Through Video</strong>
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                Our educational videos cover important topics about health, decision-making, and planning for your future. All content is age-appropriate and factually accurate.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <div className="space-y-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => {
                // TODO: Implement video player
                alert(`Video player coming soon: ${video.title}`);
              }}
            >
              <div className="relative">
                <div className="aspect-video relative bg-gray-200">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Play className="w-8 h-8 text-purple-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-base leading-snug flex-1">
                    {video.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {video.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    {video.views} views
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Card */}
        <Card className="shadow-md bg-gradient-to-br from-teal-50 to-white border-teal-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-700">
              More educational videos are being added regularly. Check back soon for new content!
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
