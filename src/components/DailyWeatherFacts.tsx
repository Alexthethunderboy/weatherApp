import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import axios from "axios"
import { WiTime8 } from "react-icons/wi"

interface DailyWeatherFactProps {
  className?: string
}

const DailyWeatherFact: React.FC<DailyWeatherFactProps> = ({ className }) => {
  const [fact, setFact] = useState<string>("")

  useEffect(() => {
    const fetchWeatherFact = async () => {
      try {
        const today = new Date()
        const month = today.getMonth() + 1
        const day = today.getDate()

        const response = await axios.get(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/NewYork/${month}-${day}?key=${process.env.NEXT_PUBLIC_VISUAL_CROSSING_KEY}&include=events&contentType=json`,
        )

        if (response.data.days[0].events && response.data.days[0].events.length > 0) {
          setFact(response.data.days[0].events[0])
        } else {
          setFact("No significant weather event found for today in history.")
        }
      } catch (error) {
        console.error("Error fetching weather fact:", error)
        setFact("Unable to fetch weather fact at this time.")
      }
    }

    fetchWeatherFact()
  }, [])

  return (
    <Card className={`${className} bg-gradient-to-br from-green-400 to-blue-500 text-white overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">This Day in Weather History</CardTitle>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <WiTime8 className="text-4xl text-yellow-300" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-medium"
        >
          {fact}
        </motion.p>
      </CardContent>
    </Card>
  )
}

export default DailyWeatherFact

