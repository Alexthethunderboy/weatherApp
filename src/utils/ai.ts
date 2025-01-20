import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function generateWeatherSentiment(query: string): Promise<string> {
  try {
    const response = await hf.textClassification({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      inputs: query,
    })

    const sentiment = response[0].label
    const score = response[0].score

    let recommendation = ""
    if (sentiment === "POSITIVE") {
      recommendation = "Enjoy the pleasant weather!"
    } else if (sentiment === "NEGATIVE") {
      recommendation = "Be prepared for challenging weather conditions."
    } else {
      recommendation = "Check the forecast for more details."
    }

    return `Sentiment: ${sentiment} (confidence: ${(score * 100).toFixed(2)}%)\nRecommendation: ${recommendation}`
  } catch (error) {
    console.error("Error generating weather sentiment:", error)
    return "Unable to analyze sentiment at this time."
  }
}

export async function generateForecastInsights(weatherData: any): Promise<string> {
  try {
    const response = await hf.textGeneration({
      model: "gpt2",
      inputs: `Summarize this weather data: Temperature ${weatherData.main.temp}°C, Humidity ${weatherData.main.humidity}%, Wind ${weatherData.wind.speed} m/s, Description: ${weatherData.weather[0].description}`,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
      },
    })
    return response.generated_text
  } catch (error) {
    console.error("Error generating forecast insights:", error)
    return "Unable to generate weather insights at this time."
  }
}

export async function generatePersonalizedNotification(preference: string): Promise<string> {
  try {
    const response = await hf.textGeneration({
      model: "gpt2",
      inputs: `Generate a weather notification based on: ${preference}`,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
      },
    })
    return response.generated_text
  } catch (error) {
    console.error("Error generating personalized notification:", error)
    return "Unable to generate a personalized notification at this time."
  }
}

