import express from "express";

const router = express.Router();

// Get health services in Kiambu area
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      services: [
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
        // Add more from HealthServices screen
      ],
      helplines: [
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
      ],
    },
  });
});

export default router;
