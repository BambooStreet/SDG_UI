"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, Vote, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameState {
  round: number
  phase: "discussion" | "voting" | "result"
  timeRemaining: number
  topic: string
  hint: string
  isPlayerLiar: boolean
}

interface GameStatusPanelProps {
  gameState: GameState
}

export function GameStatusPanel({ gameState }: GameStatusPanelProps) {
  const [timeLeft, setTimeLeft] = useState(gameState.timeRemaining)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setTimeLeft(gameState.timeRemaining)
  }, [gameState.timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPhaseConfig = () => {
    switch (gameState.phase) {
      case "discussion":
        return {
          label: "Discussion Phase",
          icon: MessageSquare,
          color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
          ctaText: "Go to Vote",
          ctaVariant: "default" as const,
        }
      case "voting":
        return {
          label: "Voting Phase",
          icon: Vote,
          color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
          ctaText: "Submit Vote",
          ctaVariant: "default" as const,
        }
      case "result":
        return {
          label: "Round Result",
          icon: Trophy,
          color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
          ctaText: "Continue to Next Round",
          ctaVariant: "default" as const,
        }
    }
  }

  const phaseConfig = getPhaseConfig()
  const PhaseIcon = phaseConfig.icon

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-6 space-y-4">
      {/* Round & Phase */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Round {gameState.round}</CardTitle>
            <Badge variant="outline" className={cn("font-medium border", phaseConfig.color)}>
              <PhaseIcon className="h-3 w-3 mr-1" />
              {phaseConfig.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Countdown Timer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono text-center">{formatTime(timeLeft)}</div>
        </CardContent>
      </Card>

      {/* Topic & Hint */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-base font-medium text-foreground">{gameState.topic}</div>
          <div className="pt-2 border-t border-border">
            <CardDescription className="text-xs mb-1">Hint</CardDescription>
            <p className="text-sm text-muted-foreground leading-relaxed">{gameState.hint}</p>
          </div>
        </CardContent>
      </Card>

      {/* Your Role (Hidden Info) */}
      {gameState.isPlayerLiar && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive/90">
              You are the <strong>Liar</strong> this round. Try to blend in!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Primary CTA */}
      <Button
        size="lg"
        className="w-full"
        variant={phaseConfig.ctaVariant}
        onClick={() => console.log("[v0] CTA clicked:", phaseConfig.ctaText)}
      >
        {phaseConfig.ctaText}
      </Button>
    </div>
  )
}
