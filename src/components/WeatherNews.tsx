"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface WeatherNewsProps {
  location: string;
}

const WeatherNews: React.FC<WeatherNewsProps> = ({ location }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = `weather+${encodeURIComponent(location)}`;
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&pageSize=20&page=${page}&sortBy=popularity`
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const articles = response.data.articles.map((article: any) => ({
        title: article.title,
        url: article.url,
        source: article.source.name,
        publishedAt: new Date(article.publishedAt).toLocaleDateString(),
      }));

      setNews((prevNews) => [...prevNews, ...articles]);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Unable to fetch news at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [location, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center mb-2">
          🌍 Popular Global News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-full rounded-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-lg font-semibold">{error}</p>
            <Button
              className="mt-4 bg-white text-blue-500"
              onClick={fetchNews}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-md shadow-md hover:bg-opacity-30 transition-all duration-300"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col"
                >
                  <p className="text-lg font-medium mb-2">{item.title}</p>
                  <div className="flex justify-between text-sm opacity-75">
                    <span>{item.source}</span>
                    <span>{item.publishedAt}</span>
                  </div>
                </a>
              </motion.div>
            ))}
            <div className="text-center mt-4">
              <Button
                className="bg-white text-blue-500"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherNews;