"use client";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsuis";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
// import Image from "next/image";
import { useQuery } from "react-query";
import { RingLoader } from "react-spinners";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "@/components/ForcastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

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
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  // const apiKey =  process.env.NEXT_PUBLIC_WEATHER_KEY;
  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log("data", data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <RingLoader color="#000000" />
      </div>
    );

  return (
    <div className="flex  flex-col gap-4 bg-black min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl text-gray-100 items-end">
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
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
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
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 py-4">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon iconName={d.weather[0].icon} />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}&deg;</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                {/* left */}
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon iconName={firstData?.weather[0].icon ?? ""} />
                </Container>
                <Container className="bg-red-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visibility={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702949452),
                      "H.mm"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702517657),
                      "H.mm"
                    )}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
                {/* right */}
              </div>
            </section>
            {/* 7days data */}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl text-white">Forecast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon2={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa`}
                  humidity={`${d?.main.humidity}%`}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702949452),
                    "H:mm"
                  )}
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)}`}
                  windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
function WeatherSkeleton() {
  return (
    <section>
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl text-gray-100 items-end animate-pulse">
            <div className="w-24 h-6 bg-gray-300 rounded"></div>
            <div className="w-32 h-6 bg-gray-300 rounded"></div>
          </h2>
          <Container className="gap-10 px-6 items-center animate-pulse">
            {/* Temperature */}
            <div className="flex flex-col px-4">
              <span className="w-20 h-12 bg-gray-300 rounded"></span>
              <p className="text-xs space-x-1 whitespace-nowrap">
                <span className="w-16 h-4 bg-gray-300 rounded"></span>
                <span className="w-16 h-4 bg-gray-300 rounded"></span>
              </p>
              <p className="text-xs space-x-2">
                <span className="w-12 h-4 bg-gray-300 rounded"></span>
                <span className="w-12 h-4 bg-gray-300 rounded"></span>
              </p>
            </div>
            {/* Time and weather icon */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 py-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold animate-pulse"
                  >
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
            </div>
          </Container>
        </div>
        <div className="flex gap-4">
          {/* left */}
          <Container className="w-fit justify-center flex-col px-4 items-center animate-pulse">
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </Container>
          <Container className="bg-red-300/80 px-6 gap-4 justify-between overflow-x-auto animate-pulse">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              ))}
          </Container>
          {/* right */}
        </div>
      </section>
      {/* 7days data */}
      <section className="flex w-full flex-col gap-4">
        <div className="w-48 h-6 bg-gray-300 rounded animate-pulse"></div>
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
      </section>
    </section>
  );
}
