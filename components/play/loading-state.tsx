import { Loader2 } from "lucide-react"

export function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Loading Game</h2>
          <p className="text-sm text-muted-foreground">Preparing your session...</p>
        </div>
      </div>
    </div>
  )
}
