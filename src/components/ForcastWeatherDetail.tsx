'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsuis";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
    ...weatherDetails
  } = props;

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Card className={cn("bg-white/10 backdrop-blur-lg")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {day}, {date}
        </CardTitle>
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <WeatherIcon iconName={weatherIcon} className="h-8 w-8" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <TooltipProvider>
            <Tooltip
              open={isTooltipOpen}
              onOpenChange={setIsTooltipOpen}
            >
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-2xl font-bold">{convertKelvinToCelsius(temp)}°C</p>
                  <p className="text-xs">Feels like {convertKelvinToCelsius(feels_like)}°C</p>
                  <p className="text-sm mt-1 capitalize">{description}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>The actual temperature is {convertKelvinToCelsius(temp)}°C, but it feels like {convertKelvinToCelsius(feels_like)}°C due to factors like humidity and wind.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild 
                  onMouseEnter={() => setIsTooltipOpen(true)}
                  onFocus={() => setIsTooltipOpen(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTooltipOpen((prev) => !prev);
                  }}
                >
                  <div  
                    className="cursor-help"
                    role="button"
                    tabIndex={0}
                  >
                    <p className="text-sm">
                      H: {convertKelvinToCelsius(temp_max)}°C
                    </p>
                    <p className="text-sm">
                      L: {convertKelvinToCelsius(temp_min)}°C
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  align="center"
                  className="p-2 max-w-sm overflow-auto break-words rounded-md shadow-md"
                  style={{
                    maxHeight: "200px",
                  }}
                  onMouseLeave={() => setIsTooltipOpen(false)}
                >
                  <p>The highest temperature expected is {convertKelvinToCelsius(temp_max)}°C, while the lowest is {convertKelvinToCelsius(temp_min)}°C. Plan your day accordingly!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
        <div className="mt-4">
          <WeatherDetails {...weatherDetails} />
        </div>
      </CardContent>
    </Card>
  );
}

