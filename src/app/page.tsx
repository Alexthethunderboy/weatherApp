'use client';

import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { loadingCityAtom, placeAtom } from './atom';
import { fetchWeatherData } from '@/lib/weather';
import Navbar from '@/components/Navbar';
import ForecastWeatherDetail from '@/components/ForcastWeatherDetail';
import WeatherTips from '@/components/WeatherTips';
import WeatherAnimations from '@/components/WeatherAnimations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsuis';
import { format, fromUnixTime, parseISO } from 'date-fns';
import WeatherDetails from '@/components/WeatherDetails';

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery(
    ['weatherData', place],
    () => fetchWeatherData(place),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  if (isLoading) return <WeatherSkeleton />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const firstData = data?.list?.[0];
  const { name: cityName, sunrise, sunset } = data?.city ?? {};
  const sunriseTime = sunrise ? fromUnixTime(sunrise) : null;
  const sunsetTime = sunset ? fromUnixTime(sunset) : null;
  const isDaytime = sunriseTime && sunsetTime ? new Date() >= sunriseTime && new Date() < sunsetTime : true;

  // Simulate AQI data
  const aqi = Math.floor(Math.random() * 200);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar location={cityName ?? 'Unknown Location'} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Weather Section */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Current Weather in {cityName ?? 'Unknown Location'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {/* Main Weather Information */}
                <div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-6xl font-bold"
                  >
                    {convertKelvinToCelsius(firstData?.main?.temp ?? 0)}°C
                  </motion.p>
                  <p className="text-xl capitalize">
                    {firstData?.weather?.[0]?.description ?? 'No description available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      parseISO(firstData?.dt_txt ?? new Date().toISOString()),
                      'EEEE, d MMMM yyyy'
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      parseISO(firstData?.dt_txt ?? new Date().toISOString()),
                      'HH:mm'
                    )}
                  </p>
                </div>

                {/* Weather Animation */}
                <WeatherAnimations
                  weatherCode={firstData?.weather?.[0]?.id ?? 0}
                  isDaytime={isDaytime}
                />
              </div>

              {/* Weather Details */}
              <div className="mt-4">
                <WeatherDetails
                  visibility={`${(firstData?.visibility ?? 0) / 1000} km`}
                  humidity={`${firstData?.main?.humidity ?? 0}%`}
                  windSpeed={`${(firstData?.wind?.speed ?? 0).toFixed(1)} m/s`}
                  airPressure={`${firstData?.main?.pressure ?? 0} hPa`}
                  sunrise={sunriseTime ? format(sunriseTime, 'HH:mm') : 'N/A'}
                  sunset={sunsetTime ? format(sunsetTime, 'HH:mm') : 'N/A'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weather Tips Section */}
          <Card className="col-span-full lg:col-span-1 overflow-hidden">
            <WeatherTips
              condition={firstData?.weather?.[0]?.main ?? 'Unknown'}
              aqi={aqi}
            />
          </Card>

          {/* Forecast Section */}
          <section className="col-span-full mt-8">
            <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data?.list
                ?.filter((_, index) => index % 8 === 0)
                ?.slice(0, 5)
                ?.map((forecast, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ForecastWeatherDetail
                      weatherIcon={forecast.weather?.[0]?.icon ?? ''}
                      date={format(parseISO(forecast.dt_txt), 'MMM d')}
                      day={format(parseISO(forecast.dt_txt), 'EEEE')}
                      temp={forecast.main?.temp ?? 0}
                      feels_like={forecast.main?.feels_like ?? 0}
                      temp_min={forecast.main?.temp_min ?? 0}
                      temp_max={forecast.main?.temp_max ?? 0}
                      description={
                        forecast.weather?.[0]?.description ?? 'No description available'
                      }
                      visibility={`${(forecast?.visibility ?? 0) / 1000} km`}
                      humidity={`${forecast?.main?.humidity ?? 0}%`}
                      windSpeed={`${(forecast?.wind?.speed ?? 0).toFixed(1)} m/s`}
                      airPressure={`${forecast?.main?.pressure ?? 0} hPa`}
                      sunrise={sunriseTime ? format(sunriseTime, 'HH:mm') : 'N/A'}
                      sunset={sunsetTime ? format(sunsetTime, 'HH:mm') : 'N/A'}
                    />
                  </motion.div>
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="col-span-2">
              <CardHeader>
                <Skeleton className="h-8 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-16 w-24" />
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}