"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { MdMyLocation, MdOutlineLocationOn } from "react-icons/md"
import { WiDayLightning, WiDaySunny } from "react-icons/wi"
import { FaMoon } from "react-icons/fa"
import SearchBox from "./SearchBox"
import { useAtom } from "jotai"
import { loadingCityAtom, placeAtom } from "@/app/atom"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useQuery } from "react-query"
import { fetchLocationSuggestions, fetchWeatherByCoords, type Suggestion } from "@/lib/api"
import { useDebounce } from "use-debounce"

type Props = { location?: string }

export default function Navbar({ location }: Props) {
  const [mounted, setMounted] = useState(false)
  const [city, setCity] = useState("")
  const [debouncedCity] = useDebounce(city, 300)
  const [place, setPlace] = useAtom(placeAtom)
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)
  const { theme, setTheme } = useTheme()

  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useQuery(
    ["suggestions", debouncedCity],
    () => fetchLocationSuggestions(debouncedCity),
    {
      enabled: debouncedCity.length > 0,
    },
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !place) {
      handleCurrentLocation()
    }
  }, [mounted, place])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value)
  }

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      setLoadingCity(true)
      setPlace(`${suggestion.name}, ${suggestion.country}`)
      setCity("")
    },
    [setLoadingCity, setPlace],
  )

  const handleSubmitSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (city && suggestions.length > 0) {
        handleSuggestionClick(suggestions[0])
      }
    },
    [city, suggestions, handleSuggestionClick],
  )

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        try {
          setLoadingCity(true)
          const data = await fetchWeatherByCoords(latitude, longitude)
          setPlace(data.name)
          setLoadingCity(false)
        } catch (error) {
          console.error("Error fetching current location weather:", error)
          setLoadingCity(false)
        }
      })
    }
  }, [setLoadingCity, setPlace])

  if (!mounted) return null

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-background">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center md:gap-2">
          <h2 className="text-primary md:text-3xl sm:text-lg font-bold">ThunderWeather</h2>
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
              onChange={handleInputChange}
              onSubmit={handleSubmitSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              className="w-[300px]"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:ml-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <WiDaySunny className="text-yellow-300" /> : <FaMoon className="text-slate-800" />}
          </Button>
        </section>
      </div>
      <section className="flex max-w-7xl px-3 md:hidden">
        <SearchBox
          value={city}
          onChange={handleInputChange}
          onSubmit={handleSubmitSearch}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          className="w-full"
        />
      </section>
    </nav>
  )
}

