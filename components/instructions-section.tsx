"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function InstructionsSection() {
  const router = useRouter()

  const handleBeginExperiment = () => {
    router.push("/briefing")
  }

  return (
    <section className="min-h-screen px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">How to Play</h2>
          <p className="text-muted-foreground">Follow these simple rules to participate in the experiment</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <Card className="border-2 transition-all hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">Form Groups</h3>
                <p className="leading-relaxed text-muted-foreground">
                  You will be matched with other participants to form groups. Each round involves strategic interactions
                  with your group members.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">Make Decisions</h3>
                <p className="leading-relaxed text-muted-foreground">
                  In each round, you will choose whether to tell the truth or lie. Your choice affects both your outcome
                  and the outcomes of other players.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">Strategic Thinking</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Consider the choices of others and adapt your strategy. The game rewards those who can anticipate
                  opponent behavior and act accordingly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">Complete Rounds</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Play through multiple rounds to complete the experiment. Your performance across all rounds
                  contributes to the research data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Button size="lg" className="h-12 px-8 text-base" onClick={handleBeginExperiment}>
            Begin Experiment
          </Button>
          <p className="text-sm text-muted-foreground">Remember: You can withdraw from the study at any time</p>
        </div>
      </div>
    </section>
  )
}
