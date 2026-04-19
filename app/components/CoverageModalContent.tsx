const coveredItems = [
  "Air Conditioning System",
  "Ceiling and Exhaust Fans",
  "Cooktop",
  "Dishwasher",
  "Clothes Dryer",
  "Drywall",
  "Ductwork",
  "Electrical System",
  "Garage Door Opener",
  "Garbage Disposal",
  "Heating System",
  "Built-In Microwave",
  "Oven Stove Cooktop",
  "Plumbing Stopper",
  "Plumbing System",
  "Refrigerator",
  "Clothes Washer",
  "Water Heater",
  "Whirlpool Bathtub",
];

export default function CoverageModalContent() {
  return (
    <div className="space-y-6">
      {/* What's Covered Section */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800">
          What's Covered:
        </h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          {coveredItems.map((item) => (
            <div key={item} className="flex items-center gap-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Optional Coverage Section */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800">
          Additional Optional Coverage:
        </h3>
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="font-medium text-gray-800">Pool-Spa</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Coverage includes pool and spa equipment, plumbing, and electrical
            components.
          </p>
        </div>
      </div>
    </div>
  );
}
