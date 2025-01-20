import type React from "react"
import { motion } from "framer-motion"
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi"

interface WeatherAnimationsProps {
  weatherCode: number
}

const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({ weatherCode }) => {
  const getWeatherIcon = () => {
    if (weatherCode >= 200 && weatherCode < 300) return WiThunderstorm
    if (weatherCode >= 300 && weatherCode < 600) return WiRain
    if (weatherCode >= 600 && weatherCode < 700) return WiSnow
    if (weatherCode >= 700 && weatherCode < 800) return WiFog
    if (weatherCode === 800) return WiDaySunny
    if (weatherCode > 800) return WiCloudy
    return WiDaySunny
  }

  const WeatherIcon = getWeatherIcon()

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <WeatherIcon className="text-8xl text-primary" />
    </motion.div>
  )
}

export default WeatherAnimations

