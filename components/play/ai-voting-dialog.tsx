"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface AIVotingDialogProps {
  open: boolean
}

export function AIVotingDialog({ open }: AIVotingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">AI Players Voting</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground text-center">Please wait while AI players cast their votes...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
