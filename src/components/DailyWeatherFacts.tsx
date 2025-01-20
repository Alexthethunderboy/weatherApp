import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DailyWeatherFactProps {
  className?: string
}

const DailyWeatherFact: React.FC<DailyWeatherFactProps> = ({ className }) => {
  const [fact, setFact] = useState<string>("")

  useEffect(() => {
    const facts = [
      "The highest temperature ever recorded on Earth was 56.7°C (134.1°F) in Death Valley, California.",
      "Lightning strikes the Earth 100 times every second.",
      "The fastest wind speed ever recorded was 407 km/h (253 mph) during Tropical Cyclone Olivia.",
      "Snow is not white, it's actually clear. Snow looks white because of how it reflects light.",
      "A 'moonbow' is a rainbow produced by light reflected off the surface of the moon rather than from direct sunlight.",
    ]
    setFact(facts[Math.floor(Math.random() * facts.length)])
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Weather Fact of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-primary"
        >
          {fact}
        </motion.p>
      </CardContent>
    </Card>
  )
}

export default DailyWeatherFact

