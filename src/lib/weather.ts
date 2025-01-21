import axios from "axios"

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY

export interface WeatherData {
  cod: string
  message: number
  cnt: number
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      sea_level: number
      grnd_level: number
      humidity: number
      temp_kf: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    clouds: {
      all: number
    }
    wind: {
      speed: number
      deg: number
      gust: number
    }
    visibility: number
    pop: number
    sys: {
      pod: string
    }
    dt_txt: string
  }>
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export async function fetchWeatherData(place: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not set")
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`,
    )
    return response.data
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

