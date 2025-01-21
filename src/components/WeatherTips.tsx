import React from "react";
import { motion } from "framer-motion";

interface WeatherTipsProps {
  condition: string;
  aqi: number;
}

const WeatherTips: React.FC<WeatherTipsProps> = ({ condition, aqi }) => {
  const tips = {
    sunny: "Stay hydrated and use sunscreen.",
    rainy: "Carry an umbrella and wear waterproof shoes.",
    snowy: "Bundle up and tread carefully on snowy paths.",
    cloudy: "It might rain later; keep a jacket handy.",
    windy: "Secure outdoor items and wear windproof clothing.",
    default: "Stay prepared for any weather!",
  };

  const airQualityTips = aqi < 50
    ? "Air quality is great. Enjoy the outdoors!"
    : aqi < 100
    ? "Air quality is moderate. Sensitive groups should take precautions."
    : "Poor air quality. Minimize outdoor activities.";

  const getTip = (condition: string) => {
    if (condition.toLowerCase().includes("sun")) return tips.sunny;
    if (condition.toLowerCase().includes("rain")) return tips.rainy;
    if (condition.toLowerCase().includes("snow")) return tips.snowy;
    if (condition.toLowerCase().includes("cloud")) return tips.cloudy;
    if (condition.toLowerCase().includes("wind")) return tips.windy;
    return tips.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="bg-background text-foreground rounded-lg p-6 shadow-md flex flex-col justify-between h-full"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Weather Tips</h2>
        <p className="text-lg mb-4">{getTip(condition)}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Air Quality Index (AQI)</h3>
        <p className="text-md mb-2">Current AQI: {aqi}</p>
        <p className="text-md text-muted-foreground">{airQualityTips}</p>
      </div>
    </motion.div>
  );
};

export default WeatherTips;