import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import axios from "axios"

interface NewsItem {
  title: string
  url: string
}

interface WeatherNewsProps {
  location: string
}

const WeatherNews: React.FC<WeatherNewsProps> = ({ location }) => {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=weather+${encodeURIComponent(location)}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&pageSize=5`,
        )
        setNews(
          response.data.articles.map((article: any) => ({
            title: article.title,
            url: article.url,
          })),
        )
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews([{ title: "Unable to fetch news at this time.", url: "#" }])
      }
    }

    if (location) {
      fetchNews()
    }
  }, [location])

  return (
    <Card className="bg-gradient-to-br from-blue-400 to-purple-500 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Weather News for {location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md hover:bg-opacity-30 transition-all duration-300"
              >
                <p className="text-sm font-medium">{item.title}</p>
              </a>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherNews

