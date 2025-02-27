import React from "react";
import { motion } from "framer-motion";
import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

interface WeatherAnimationsProps {
  weatherCode: number;
  isDaytime: boolean;
}

const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({ weatherCode, isDaytime }) => {
  const getWeatherIcon = (code: number, day: boolean) => {
    if (code >= 200 && code < 300) return { icon: WiThunderstorm, color: "#FFD700", animation: "flash" };
    if (code >= 300 && code < 600) return { icon: WiRain, color: "#4169E1", animation: "rain" };
    if (code >= 600 && code < 700) return { icon: WiSnow, color: "#E0FFFF", animation: "snow" };
    if (code >= 700 && code < 800) return { icon: WiFog, color: "#708090", animation: "fog" };
    if (code === 800) return { icon: day ? WiDaySunny : WiNightClear, color: day ? "#FFD700" : "#4B0082", animation: "spin" };
    if (code > 800) return { icon: WiCloudy, color: "#A9A9A9", animation: "float" };
    return { icon: day ? WiDaySunny : WiNightClear, color: day ? "#FFD700" : "#4B0082", animation: "spin" };
  };

  const { icon: WeatherIcon, color, animation } = getWeatherIcon(weatherCode, isDaytime);

  const animations = {
    flash: { opacity: [0, 1, 0], transition: { duration: 1, repeat: Infinity } },
    rain: { y: [0, 10, 0], transition: { duration: 0.5, repeat: Infinity } },
    snow: { y: [0, 10, 0], transition: { duration: 1, repeat: Infinity } },
    fog: { opacity: [0.5, 1, 0.5], transition: { duration: 2, repeat: Infinity } },
    spin: { rotate: [0, 360], transition: { duration: 4, repeat: Infinity } },
    float: { y: [0, 10, 0], transition: { duration: 2, repeat: Infinity } },
  };

  return (
    <motion.div animate={animations[animation as keyof typeof animations]} style={{ color }}>
      <WeatherIcon className="text-8xl" />
    </motion.div>
  );
};

export default WeatherAnimations;
