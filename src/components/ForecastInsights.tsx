"use client"
import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { generateForecastInsights } from "@/utils/ai"
import { motion } from "framer-motion"
import { WiThermometer, WiHumidity, WiStrongWind } from "react-icons/wi"

interface ForecastInsightsProps {
  weatherData: any
}

export default function ForecastInsights({ weatherData }: ForecastInsightsProps) {
  const [insights, setInsights] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const generateInsights = async () => {
      if (weatherData && weatherData.list && weatherData.list.length > 0) {
        setIsLoading(true)
        try {
          const result = await generateForecastInsights(weatherData.list[0])
          setInsights(result)
        } catch (error) {
          console.error("Error generating insights:", error)
          setInsights("Unable to generate weather insights at this time.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    generateInsights()
  }, [weatherData])

  if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
    return null
  }

  const currentWeather = weatherData.list[0]

  return (
    <Card className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">Forecast Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <WiThermometer className="text-3xl text-red-500" />
            <span className="text-lg">Temperature: {Math.round(currentWeather.main.temp - 273.15)}°C</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <WiHumidity className="text-3xl text-blue-500" />
            <span className="text-lg">Humidity: {currentWeather.main.humidity}%</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <WiStrongWind className="text-3xl text-green-500" />
            <span className="text-lg">Wind Speed: {currentWeather.wind.speed} m/s</span>
          </motion.div>
        </div>
        {isLoading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-lg font-semibold text-blue-600 dark:text-blue-300"
          >
            Generating insights...
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-lg text-blue-800 dark:text-blue-200"
          >
            {insights}
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}

