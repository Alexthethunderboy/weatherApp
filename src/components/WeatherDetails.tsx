import React from 'react';
import { LuEye, LuDroplet, LuWind, LuGauge, LuSunrise, LuSunset } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = "25km",
    humidity = '61%',
    windSpeed = "7 km/h",
    airPressure = "1012 hPa",
    sunrise = "6:20",
    sunset = "18:48"
  } = props;

  const details = [
    { 
      icon: LuEye, 
      label: "Visibility", 
      value: visibility,
      description: "Visibility affects how far you can see clearly. It's important for activities like driving and can be reduced by fog, haze, or precipitation."
    },
    { 
      icon: LuDroplet, 
      label: "Humidity", 
      value: humidity,
      description: "Humidity is the amount of water vapor in the air. High humidity can make it feel warmer and can affect comfort levels, especially in warm weather."
    },
    { 
      icon: LuWind, 
      label: "Wind Speed", 
      value: windSpeed,
      description: "Wind speed affects how quickly heat is carried away from your body, impacting how cold it feels. Strong winds can also affect outdoor activities and travel."
    },
    { 
      icon: LuGauge, 
      label: "Air Pressure", 
      value: airPressure,
      description: "Air pressure is the force exerted by the weight of the air. Changes in pressure often indicate incoming weather changes. Rising pressure typically means improving weather, while falling pressure can signal approaching storms or precipitation."
    },
    { 
      icon: LuSunrise, 
      label: "Sunrise", 
      value: sunrise,
      description: "Sunrise marks the beginning of daylight. It affects the length of the day and can influence daily activities and routines."
    },
    { 
      icon: LuSunset, 
      label: "Sunset", 
      value: sunset,
      description: "Sunset marks the end of daylight. It affects the length of the day and can influence evening activities and routines."
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {details.map((detail, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <SingleWeatherDetail {...detail} />
        </motion.div>
      ))}
    </div>
  );
}

function SingleWeatherDetail({ icon: Icon, label, value, description }: { icon: React.ElementType, label: string, value: string, description: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn("bg-white/10 backdrop-blur-lg cursor-help")}  role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()} // Prevent unwanted propagation
         >
            <CardContent className="flex flex-col items-center p-4">
              <Icon className="text-2xl mb-2 text-blue-400" />
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-sm font-bold">{value}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent  side="top" align="center">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

