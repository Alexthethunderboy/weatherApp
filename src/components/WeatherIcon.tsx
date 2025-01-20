import type React from "react"
import { motion } from "framer-motion"
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiRain,
  WiDayRain,
  WiNightAltRain,
  WiThunderstorm,
  WiSnow,
  WiDayFog,
  WiNightFog,
} from "react-icons/wi"

interface Props {
  iconName: string
  className?: string
}

const iconMap: { [key: string]: React.ElementType } = {
  "01d": WiDaySunny,
  "01n": WiNightClear,
  "02d": WiDayCloudy,
  "02n": WiNightAltCloudy,
  "03d": WiCloud,
  "03n": WiCloud,
  "04d": WiCloudy,
  "04n": WiCloudy,
  "09d": WiRain,
  "09n": WiRain,
  "10d": WiDayRain,
  "10n": WiNightAltRain,
  "11d": WiThunderstorm,
  "11n": WiThunderstorm,
  "13d": WiSnow,
  "13n": WiSnow,
  "50d": WiDayFog,
  "50n": WiNightFog,
}

const colorMap: { [key: string]: string } = {
  "01d": "text-yellow-400",
  "01n": "text-blue-200",
  "02d": "text-yellow-300",
  "02n": "text-blue-300",
  "03d": "text-gray-400",
  "03n": "text-gray-500",
  "04d": "text-gray-600",
  "04n": "text-gray-700",
  "09d": "text-blue-400",
  "09n": "text-blue-500",
  "10d": "text-blue-500",
  "10n": "text-blue-600",
  "11d": "text-yellow-600",
  "11n": "text-yellow-700",
  "13d": "text-blue-200",
  "13n": "text-blue-300",
  "50d": "text-gray-400",
  "50n": "text-gray-500",
}

export default function WeatherIcon({ iconName, className }: Props) {
  const IconComponent = iconMap[iconName] || WiDaySunny
  const colorClass = colorMap[iconName] || "text-gray-500"

  return (
    <motion.div
      className={`${className} ${colorClass}`}
      initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6,
      }}
      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
    >
      <IconComponent
        className="w-full h-full drop-shadow-lg"
        style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))" }}
      />
    </motion.div>
  )
}

