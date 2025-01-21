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
      "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, California.",
    "Lightning strikes the Earth about 8 million times a day.",
    "A single hurricane can release the energy of 10,000 nuclear bombs.",
    "Snowflakes can fall at speeds of up to 9 mph.",
    "The coldest temperature ever recorded was -128.6°F (-89.2°C) in Antarctica.",
    "The wettest place on Earth is Mawsynram, India, with an average annual rainfall of 467.4 inches.",
    "The driest place on Earth is the Atacama Desert in Chile, where some areas have never recorded rainfall.",
    "The fastest wind speed ever recorded was 253 mph during a tornado in Oklahoma, USA.",
    "The largest hailstone ever recorded weighed 2.25 pounds and fell in Bangladesh in 1986.",
    "The longest drought in recorded history lasted 400 years in the Atacama Desert.",
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

