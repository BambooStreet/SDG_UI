"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const ADMIN_PIN = "0702"
const STORAGE_KEY = "admin-pin-ok"

interface AdminGateProps {
  children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [pin, setPin] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "true") setUnlocked(true)
  }, [])

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(STORAGE_KEY, "true")
      setUnlocked(true)
      setError("")
      return
    }
    setError("Incorrect code. Please try again.")
    setPin("")
  }

  if (unlocked) return <>{children}</>

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-md">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Admin Access</CardTitle>
            <CardDescription>Enter the 4-digit code to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit code"
              type="password"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" onClick={handleSubmit} disabled={pin.length !== 4}>
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
