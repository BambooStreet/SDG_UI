"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatPanel } from "@/components/play/chat-panel"
import { MidCheckDialog } from "@/components/play/mid-check-dialog"
import { FinalVoteDialog } from "@/components/play/final-vote-dialog"
import { PhaseInfoDialog } from "@/components/play/phase-info-dialog"
import { AIVotingDialog } from "@/components/play/ai-voting-dialog"
import { LoadingState } from "@/components/play/loading-state"
import { ErrorState } from "@/components/play/error-state"

type GamePhase =
  | "explanation-intro"
  | "explanation"
  | "mid-check"
  | "discussion-intro"
  | "discussion"
  | "final-vote"
  | "complete"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  timestamp: Date
}

export default function PlayPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentPhase, setCurrentPhase] = useState<GamePhase>("explanation-intro")
  const [messages, setMessages] = useState<Message[]>([])

  const [showPhaseInfo, setShowPhaseInfo] = useState(false)
  const [showMidCheck, setShowMidCheck] = useState(false)
  const [showFinalVote, setShowFinalVote] = useState(false)
  const [showAIVoting, setShowAIVoting] = useState(false)

  const router = useRouter()

  const gameState = {
    round: 1,
    phase: currentPhase.includes("explanation") ? "explanation" : "discussion",
    topic: "Best vacation destination",
    keyword: "Beach resort",
    aiPlayers: [
      { id: "ai1", name: "AI Player 1" },
      { id: "ai2", name: "AI Player 2" },
      { id: "ai3", name: "AI Player 3" },
    ],
  }

  useEffect(() => {
    setShowPhaseInfo(true)
  }, [])

  const handlePhaseInfoClose = () => {
    setShowPhaseInfo(false)

    if (currentPhase === "explanation-intro") {
      // Add dummy explanation messages
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            sender: "ai",
            content: "Beach resorts are perfect for relaxation with beautiful ocean views and warm sand.",
            timestamp: new Date(),
          },
          {
            id: "2",
            sender: "user",
            content: "I think beach resorts offer great water activities like swimming and surfing.",
            timestamp: new Date(),
          },
        ])
        // After messages appear, move to mid-check
        setTimeout(() => {
          setCurrentPhase("mid-check")
          setShowMidCheck(true)
        }, 2000)
      }, 500)
    } else if (currentPhase === "discussion-intro") {
      // Add dummy discussion messages
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "3",
            sender: "ai",
            content: "I noticed you mentioned surfing. Can you elaborate on why that's important to you?",
            timestamp: new Date(),
          },
          {
            id: "4",
            sender: "user",
            content: "Well, surfing is exciting and beach resorts usually have good waves and instructors.",
            timestamp: new Date(),
          },
        ])
        // After messages appear, move to final vote
        setTimeout(() => {
          setCurrentPhase("final-vote")
          setShowFinalVote(true)
        }, 2000)
      }, 500)
    }
  }

  const handleMidCheckClose = () => {
    setShowMidCheck(false)
    // Move to discussion intro
    setCurrentPhase("discussion-intro")
    setShowPhaseInfo(true)
  }

  const handleFinalVoteComplete = () => {
    setShowFinalVote(false)
    setShowAIVoting(true)

    // After 3 seconds, navigate to results
    setTimeout(() => {
      router.push("/results")
    }, 3000)
  }

  const handleFinalVoteClose = () => {
    setShowFinalVote(false)
    setCurrentPhase("complete")
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => setError(null)} />
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <main className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Liar Game Experiment</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Round {gameState.round}</span>
            <span className="capitalize">{gameState.phase} Phase</span>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel messages={messages} />
      </div>

      {/* Phase Info Dialog */}
      <PhaseInfoDialog open={showPhaseInfo} onOpenChange={handlePhaseInfoClose} phase={currentPhase} />

      {/* Mid-Check Dialog */}
      <MidCheckDialog open={showMidCheck} onOpenChange={handleMidCheckClose} aiPlayers={gameState.aiPlayers} />

      {/* Final Vote Dialog */}
      <FinalVoteDialog
        open={showFinalVote}
        onOpenChange={setShowFinalVote}
        aiPlayers={gameState.aiPlayers}
        onVoteComplete={handleFinalVoteComplete}
      />

      {/* AI Voting Dialog */}
      <AIVotingDialog open={showAIVoting} />
    </main>
  )
}
