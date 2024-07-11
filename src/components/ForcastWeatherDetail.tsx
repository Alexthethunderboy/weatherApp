/** @format */

import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsuis";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon2: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon2 = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
  } = props;
  return (
    <Container className="bg-red-300/80 gap-1 md:gap-4 h-full">
      <section className="flex gap-1 md:gap-4 items-center px-2 md:px-4 bg-black h-full border-gray-900 rounded-xl">
        <div className="flex flex-col items-center">
          <WeatherIcon iconName={weatherIcon2} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>
        {/* {left section} */}
        <div className="flex flex-col px-2 md:px-4">
          <span className="text-2xl md:text-5xl ">
            {convertKelvinToCelsius(temp ?? 0)}&deg;&uarr;
          </span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}&deg;&uarr;</span>
          </p>
          <p className="capitalize text-sm">{description}</p>
        </div>
      </section>
      {/* right */}
      <section className="overflow-x-auto flex justify-between gap-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
