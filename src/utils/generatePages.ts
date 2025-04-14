import fs from "fs";
import path from "path";

const stageTemplate = (stageNumber: number) => `import React from "react";
import Card from "@/components/Card";

export default function Stage${stageNumber}() {
  const cards = [
    {
      title: "Card 1",
      description: "Description for Card 1",
      href: "/stage${stageNumber}/card1",
    },
    {
      title: "Card 2",
      description: "Description for Card 2",
      href: "/stage${stageNumber}/card2",
    },
    {
      title: "Card 3",
      description: "Description for Card 3",
      href: "/stage${stageNumber}/card3",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stage ${stageNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}`;

const cardTemplate = (stageNumber: number, cardNumber: number) => `import React from "react";

export default function Card${cardNumber}Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Card ${cardNumber} Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Upload form or dashboard will be placed here</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Statistics</h3>
              <p className="text-gray-500">Placeholder for statistics</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Activity</h3>
              <p className="text-gray-500">Placeholder for activity feed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export function generatePages() {
  const baseDir = path.join(process.cwd(), "src", "app");

  // Generate stages 2-4
  for (let stage = 2; stage <= 4; stage++) {
    const stageDir = path.join(baseDir, `stage${stage}`);
    fs.mkdirSync(stageDir, { recursive: true });
    fs.writeFileSync(
      path.join(stageDir, "page.tsx"),
      stageTemplate(stage)
    );

    // Generate cards for each stage
    for (let card = 1; card <= 3; card++) {
      const cardDir = path.join(stageDir, `card${card}`);
      fs.mkdirSync(cardDir, { recursive: true });
      fs.writeFileSync(
        path.join(cardDir, "page.tsx"),
        cardTemplate(stage, card)
      );
    }
  }
} 