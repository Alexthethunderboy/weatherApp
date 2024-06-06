"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { format, parseISO } from "date-fns";
// import Image from "next/image";
import { useQuery } from "react-query";


interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface Forecast {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface Coord {
  lat: number;
  lon: number;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: Forecast[];
  city: City;
}

export default function Home() {
  // const apiKey =  process.env.NEXT_PUBLIC_WEATHER_KEY;
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=lagos&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  const firstData = data?.list[0];

  console.log("data", data?.city.country);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex  flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              <p> {format(parseISO(firstData?.dt_txt ?? ''), "EEEE") } </p>
              <p>({format(parseISO(firstData?.dt_txt ?? ''), "dd.MM.yyyy")}) </p>
            </h2>
          </div>
        </section>
        {/* 7days data */}
        <section></section>
      </main>
    </div>
  );
}
