"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { generateWeatherSentiment } from "@/utils/ai"
import { motion } from "framer-motion"
import { WiDaySunny, WiRain } from "react-icons/wi"

export default function WeatherSentiment() {
  const [query, setQuery] = useState("")
  const [sentiment, setSentiment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const analyzeSentiment = async () => {
    setIsLoading(true)
    try {
      const result = await generateWeatherSentiment(query)
      setSentiment(result)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      setSentiment("Error: Unable to analyze sentiment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-200">
          Weather Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="How's the weather making you feel?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700"
          />
          <Button
            onClick={analyzeSentiment}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
        </div>
        {sentiment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <h3 className="font-semibold text-lg text-purple-800 dark:text-purple-200 mb-2">Analysis Result:</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{sentiment}</p>
            <div className="mt-4 flex justify-center">
              {sentiment.includes("POSITIVE") ? (
                <WiDaySunny className="text-6xl text-yellow-500" />
              ) : sentiment.includes("NEGATIVE") ? (
                <WiRain className="text-6xl text-blue-500" />
              ) : null}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

