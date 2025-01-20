"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { generatePersonalizedNotification } from "@/utils/ai"
import { motion } from "framer-motion"
import { BellRing } from "lucide-react"

export default function PersonalizedNotifications() {
  const [preference, setPreference] = useState("")
  const [notification, setNotification] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const setNotificationPreference = async () => {
    setIsLoading(true)
    try {
      const result = await generatePersonalizedNotification(preference)
      setNotification(result)
    } catch (error) {
      console.error("Error setting notification:", error)
      setNotification("Error: Unable to generate personalized notification")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
          Personalized Weather Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="E.g., Notify me when it's sunny and above 25°C"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-700"
          />
          <Button
            onClick={setNotificationPreference}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Set Notification"}
          </Button>
        </div>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <h3 className="font-semibold text-lg text-green-800 dark:text-green-200 mb-2">Notification Preview:</h3>
            <p className="text-gray-700 dark:text-gray-300">{notification}</p>
            <div className="mt-4 flex justify-center">
              <BellRing className="text-6xl text-green-500" />
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

