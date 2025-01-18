"use client";

import Navbar from "@/components/Navbar";
import ForecastWeatherDetail from "@/components/ForcastWeatherDetail";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
import { fetchWeatherData, WeatherData } from "@/lib/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsuis";
import { format, fromUnixTime, parseISO } from "date-fns";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData, Error>(
    ["weatherData", place],
    () => fetchWeatherData(place),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  if (isLoading) return <WeatherSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar location={data?.city.name} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <Card className={cn("col-span-2 overflow-hidden")}>
            <CardHeader>
              <CardTitle className="text-2xl">
                Current Weather in {data?.city.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-6xl font-bold"
                  >
                    {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C
                  </motion.p>
                  <p className="text-xl capitalize">
                    {firstData?.weather[0].description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(firstData?.dt_txt ?? new Date().toISOString()), "EEEE, d MMMM yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(firstData?.dt_txt ?? new Date().toISOString()), "HH:mm")}
                  </p>
                </div>
                <motion.div
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <WeatherIcon
                    iconName={firstData?.weather[0].icon ?? ""}
                    className="w-24 h-24"
                  />
                </motion.div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <WeatherDetail
                  title="Feels like"
                  value={`${convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°C`}
                  description={`The "feels like" temperature takes into account wind chill (when it's cold) or heat index (when it's warm) to give a more accurate representation of how the weather will feel on your skin.`}
                />
                <WeatherDetail
                  title="Wind"
                  value={convertWindSpeed(firstData?.wind.speed ?? 0)}
                  description={`Wind speed affects how quickly heat is carried away from your body, impacting how cold it feels. Strong winds can also affect outdoor activities and travel.`}
                />
                <WeatherDetail
                  title="Humidity"
                  value={`${firstData?.main.humidity}%`}
                  description={`Humidity is the amount of water vapor in the air. High humidity can make it feel warmer and can affect comfort levels, especially in warm weather.`}
                />
                <WeatherDetail
                  title="Visibility"
                  value={metersToKilometers(firstData?.visibility ?? 0)}
                  description={`Visibility is how far you can see clearly. It's affected by things like fog, haze, and precipitation. Good visibility is typically considered to be 10 km or more.`}
                />
                <WeatherDetail
                  title="Pressure"
                  value={`${firstData?.main.pressure} hPa`}
                  description={`Atmospheric pressure is the force exerted by the weight of the air. Changes in pressure often indicate incoming weather changes. Rising pressure typically means improving weather, while falling pressure can signal approaching storms or precipitation.`}
                />
                <WeatherDetail
                  title="Cloudiness"
                  value={`${firstData?.clouds.all}%`}
                  description={`Cloudiness represents the percentage of the sky covered by clouds. It affects the amount of sunlight reaching the ground and can influence temperature and the likelihood of precipitation.`}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.list
                  .filter((_, index) => index % 8 === 0)
                  .map((forecast, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {format(parseISO(forecast.dt_txt), "EEEE")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(forecast.dt_txt), "MMM d")}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <WeatherIcon
                          iconName={forecast.weather[0].icon}
                          className="w-10 h-10 mr-2"
                        />
                        <p className="text-lg font-semibold">
                          {convertKelvinToCelsius(forecast.main.temp)}°C
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Detailed Forecast</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((forecast, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ForecastWeatherDetail
                  weatherIcon={forecast.weather[0].icon}
                  date={format(parseISO(forecast.dt_txt), "MMM d")}
                  day={format(parseISO(forecast.dt_txt), "EEEE")}
                  temp={forecast.main.temp}
                  feels_like={forecast.main.feels_like}
                  temp_min={forecast.main.temp_min}
                  temp_max={forecast.main.temp_max}
                  description={forecast.weather[0].description}
                  visibility={metersToKilometers(forecast.visibility)}
                  humidity={`${forecast.main.humidity}%`}
                  windSpeed={convertWindSpeed(forecast.wind.speed)}
                  airPressure={`${forecast.main.pressure} hPa`}
                  sunrise={format(fromUnixTime(data.city.sunrise), "HH:mm")}
                  sunset={format(fromUnixTime(data.city.sunset), "HH:mm")}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function WeatherDetail({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help"
            role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()} // Prevent unwanted propagation
          >
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function WeatherSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <Skeleton className="h-8 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-16 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-6 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full mr-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <section className="mt-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(6)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

