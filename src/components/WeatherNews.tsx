import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const WeatherNews: React.FC = () => {
  const [news, setNews] = useState<string[]>([])

  useEffect(() => {
    // This is a mock function. In a real application, you would fetch news from an API.
    const fetchNews = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setNews([
        "Record-breaking heatwave sweeps across Europe",
        "Tropical storm forms in the Atlantic, may strengthen to hurricane",
        "New study links air pollution to increased rainfall in urban areas",
        "Drought conditions worsen in Western United States",
        "Arctic sea ice reaches second-lowest extent on record",
      ])
    }

    fetchNews()
  }, [])

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-4 bg-secondary rounded-lg shadow-md"
        >
          <p className="text-sm text-primary">{item}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default WeatherNews

