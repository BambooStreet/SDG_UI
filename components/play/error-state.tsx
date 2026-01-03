"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle>Connection Error</CardTitle>
              <CardDescription>Unable to load the game session</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error || "An unexpected error occurred. Please try again or contact support if the problem persists."}
          </p>
          <div className="flex gap-2">
            <Button onClick={onRetry} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => (window.location.href = "/")}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
