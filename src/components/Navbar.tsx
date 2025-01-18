"use client";
import React, { useState, useEffect } from "react";
import { MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import { WiDayLightning, WiDaySunny } from "react-icons/wi";
import { FaMoon } from "react-icons/fa";
import SearchBox from "./SearchBox";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios";
import { useTheme } from "next-themes";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
  }, [theme, setTheme]);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (city) {
      setLoadingCity(true);
      setPlace(city);
      setShowSuggestions(false);
      setCity("");
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
          setError("Error fetching location data");
        }
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-background">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center md:gap-2">
          <h2 className="text-primary text-3xl font-bold">Weather</h2>
          <WiDayLightning className="text-4xl mt-1 text-primary" />
        </div>
        <section className="flex gap-1 md:gap-2 items-center">
          <MdMyLocation
            title="Your Current Location"
            onClick={handleCurrentLocation}
            className="text-2xl text-primary hover:opacity-80 cursor-pointer"
          />
          
          <p className="text-primary md:text-sm text-xs">{location}</p>
          <div className="relative hidden md:flex">
            <SearchBox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <SuggestionBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error,
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:ml-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "light" ? <FaMoon /> : <WiDaySunny />}
          </Button>
        </section>
      </div>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative flex-grow">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </nav>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 0) || error) && (
        <ul className="mb-4 bg-background border border-primary absolute top-[44px] left-0 w-full rounded-md shadow-lg z-10">
          {error && suggestions.length === 0 && (
            <li className="px-4 py-2 text-destructive">{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

