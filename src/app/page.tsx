"use client";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsuis";
import axios from "axios";
import { format, parseISO } from "date-fns";
// import Image from "next/image";
import { useQuery } from "react-query";
import { RingLoader } from "react-spinners";

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
        <RingLoader color="#36d7b7" />
      </div>
    );

  return (
    <div className="flex  flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p> {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")} </p>
              <p>
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}){" "}
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 0)}&deg;
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                    &deg;
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                    &deg;&uarr;{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                    &deg;&darr;{" "}
                  </span>
                </p>
              </div>
              {/* Time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {data?.list.map((d,i)=>
              <div 
              key={i} 
              className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
              >
              <p className="whitespace-nowrap">
                {format(parseISO(d.dt_txt), "h:mm a")}
              </p>
              <WeatherIcon iconName={d.weather[0].icon} />
              <p>
                  {convertKelvinToCelsius(d?.main.temp ?? 0)}&deg;
              </p>
              </div>
              
              )}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
              {/* left */}
              <Container className="w-fit justify-center flex-col px-4 items-center">

                <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                <WeatherIcon iconName={firstData?.weather[0].icon ?? ""} />
              </Container>
              <Container className="bg-red-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails/>  
              </Container>
              {/* right */}

          </div>      
        </section>
        {/* 7days data */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forcast (7 days)</p>
          <Container>
            <div></div>
          </Container>

        </section>
      </main>
    </div>
  );
}
