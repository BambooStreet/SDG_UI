"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Target, ArrowRight } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()

  // Dummy data - in production, this would come from game state
  const results = {
    winner: "citizens",
    liar: {
      id: "ai2",
      name: "AI Player 2",
    },
    topic: "Best vacation destination",
    keyword: "Beach resort",
    votes: {
      player: "AI Player 3",
      ai1: "AI Player 2",
      ai2: "AI Player 1",
      ai3: "AI Player 2",
    },
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Winner Announcement */}
        <Card className="border-2 border-chart-4/50 bg-chart-4/5">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-chart-4/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-chart-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-balance">Citizens Win!</CardTitle>
            <CardDescription className="text-base mt-2">The liar has been successfully identified</CardDescription>
          </CardHeader>
        </Card>

        {/* Game Details */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Liar Reveal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg">The Liar</CardTitle>
                  <CardDescription className="text-sm">Who was deceiving</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{results.liar.name}</span>
                <Badge variant="destructive">Liar</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Topic & Keyword */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <CardTitle className="text-lg">Topic & Keyword</CardTitle>
                  <CardDescription className="text-sm">What was discussed</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Topic:</span>
                <p className="font-medium">{results.topic}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Keyword:</span>
                <p className="font-medium">{results.keyword}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Voting Results</CardTitle>
            <CardDescription>How each player voted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-medium">You</span>
                <span className="text-sm text-muted-foreground">voted for {results.votes.player}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-medium">AI Player 1</span>
                <span className="text-sm text-muted-foreground">voted for {results.votes.ai1}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-medium">AI Player 2</span>
                <span className="text-sm text-muted-foreground">voted for {results.votes.ai2}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">AI Player 3</span>
                <span className="text-sm text-muted-foreground">voted for {results.votes.ai3}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={() => router.push("/survey")} className="gap-2">
            Continue to Survey
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
