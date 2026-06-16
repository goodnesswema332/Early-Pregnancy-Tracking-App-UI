import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BottomNav } from "../components/BottomNav";

interface HealthService {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  services: string[];
}

export function HealthServices() {
  const navigate = useNavigate();

  const services: HealthService[] = [
    {
      id: "1",
      name: "Kiambu Youth Friendly Clinic",
      type: "Youth Health Center",
      address: "Kiambu Town, Market Street",
      phone: "0700 123 456",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      distance: "1.2 km",
      services: [
        "Reproductive Health Counseling",
        "Health Education",
        "Confidential Services",
      ],
    },
    {
      id: "2",
      name: "Kiambu County Referral Hospital",
      type: "Public Hospital",
      address: "Hospital Road, Kiambu",
      phone: "0722 234 567",
      hours: "24/7 Emergency Services",
      distance: "2.5 km",
      services: ["Emergency Care", "Youth Clinic", "Counseling Services"],
    },
    {
      id: "3",
      name: "Marie Stopes Kiambu",
      type: "Health Clinic",
      address: "Biashara Street, Kiambu Town",
      phone: "0733 345 678",
      hours: "Mon-Sat: 8AM-6PM",
      distance: "1.8 km",
      services: ["Reproductive Health", "Family Planning", "Youth Services"],
    },
    {
      id: "4",
      name: "Thika Road Youth Center",
      type: "Community Health Center",
      address: "Thika Road, Near Kiambu",
      phone: "0711 456 789",
      hours: "Mon-Fri: 9AM-5PM",
      distance: "3.2 km",
      services: ["Health Education", "Peer Counseling", "Confidential Support"],
    },
  ];

  const helplines = [
    {
      name: "National Adolescent Helpline",
      number: "1190",
      description: "Free 24/7 support for young people",
    },
    {
      name: "Gender Violence Helpline",
      number: "1195",
      description: "Report abuse or get help",
    },
    {
      name: "ChildLine Kenya",
      number: "116",
      description: "Support for children and teens",
    },
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
              <h1 className="text-xl">Health Services</h1>
            </div>
          </div>
          <p className="text-purple-100 text-sm ml-14">
            Find youth-friendly support near you
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm mb-2">
                  <strong className="text-purple-900">
                    Youth-Friendly Services
                  </strong>
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  These facilities provide confidential, non-judgmental
                  healthcare for young people. You can visit them for
                  reproductive health information, counseling, and support
                  without fear of stigma.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Toggle */}
        <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md">
          <Navigation className="w-5 h-5 mr-2" />
          Use My Location
        </Button>

        {/* Services List */}
        <div className="space-y-4">
          <h2 className="text-lg px-1">Nearby Facilities</h2>

          {services.map((service) => (
            <Card
              key={service.id}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-1">
                      {service.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      {service.type}
                    </Badge>
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 border-0">
                    {service.distance}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{service.address}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <a
                    href={`tel:${service.phone}`}
                    className="text-purple-600 hover:underline"
                  >
                    {service.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{service.hours}</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-2">
                    Services offered:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.services.map((s, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Helplines */}
        <div className="space-y-4">
          <h2 className="text-lg px-1">Emergency Helplines</h2>

          <Card className="shadow-md bg-gradient-to-br from-red-50 to-white border-red-200">
            <CardHeader>
              <CardTitle className="text-base text-red-900">
                Need Immediate Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {helplines.map((helpline, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {helpline.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {helpline.description}
                    </p>
                  </div>
                  <a
                    href={`tel:${helpline.number}`}
                    className="ml-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {helpline.number}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="shadow-sm bg-gray-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              All services listed are youth-friendly and respect your privacy.
              You have the right to confidential healthcare. Don't hesitate to
              seek help when you need it.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
