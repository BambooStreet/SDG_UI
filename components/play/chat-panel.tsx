"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatTranscript } from "./chat-transcript"
import { Send, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  messages: Message[]
}

export function ChatPanel({ messages }: ChatPanelProps) {
  const [message, setMessage] = useState("")
  const [issueReport, setIssueReport] = useState("")

  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    sender: msg.sender === "user" ? "You" : "AI Player",
    content: msg.content,
    timestamp: msg.timestamp,
    isAI: msg.sender === "ai",
  }))

  const handleSendMessage = () => {
    if (!message.trim()) return
    console.log("[v0] Sending message:", message)
    // In production: send message to server
    setMessage("")
  }

  const handleReportIssue = () => {
    console.log("[v0] Reporting issue:", issueReport)
    // In production: send issue report to server
    setIssueReport("")
  }

  return (
    <div className="h-full flex flex-col bg-background max-w-4xl mx-auto">
      {/* Chat Transcript */}
      <div className="flex-1 overflow-hidden">
        <ChatTranscript messages={formattedMessages} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2 mb-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        {/* Report Issue Link */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <AlertCircle className="h-3 w-3" />
              Report issue
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
              <DialogDescription>
                Please describe any technical issues or concerns you're experiencing during the experiment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={issueReport}
                onChange={(e) => setIssueReport(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button onClick={handleReportIssue}>Submit Report</Button>
                </DialogTrigger>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
