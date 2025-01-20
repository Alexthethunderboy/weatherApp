"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { generateWeatherSentiment } from "@/utils/ai"

export default function HuggingFaceTest() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testHuggingFace = async () => {
    setIsLoading(true)
    try {
      const sentiment = await generateWeatherSentiment("It's a sunny day")
      setResult(sentiment)
    } catch (error) {
      console.error("Error testing Hugging Face:", error)
      setResult("Error: Unable to connect to Hugging Face API")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hugging Face API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testHuggingFace} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Hugging Face"}
        </Button>
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold">Result:</h3>
            <p className="whitespace-pre-line">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

