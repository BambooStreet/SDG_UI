"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ClipboardList } from "lucide-react"
import { logEvent } from "@/lib/api"
import surveyItems from "@/data/survey_item.json"

type SurveySection = Record<string, Record<string, string>>
type SectionQuestion = { id: string; text: string; responseKey: string }
type SectionGroup = { key: string; questions: SectionQuestion[] }

type SurveyPageProps = {
  pageIndex: number
}

const POST_SURVEY = (surveyItems as { post_survey: SurveySection }).post_survey

const stripLeadingCondition = (text: string) =>
  text
    .replace(/^\s*\(\s*(Only if|If)\b[^)]*\)\s*/i, "")
    .replace(/^\s*(Only if|If)\s+U\d+\s*=\s*Yes\b[:.)-]*\s*/i, "")
    .replace(/^\s*\)\s*/, "")
    .trim()
const normalizeQuestionText = (text: string) =>
  stripLeadingCondition(text).replace(/\bU\d+\s*=\s*Yes\b/gi, "").replace(/\s+/g, " ").trim()

const parseNumberedOptions = (text: string) => {
  const cleaned = normalizeQuestionText(text)
  const matches = [...cleaned.matchAll(/(\d+)\s*=\s*([^,]+)/g)]
  if (matches.length < 2) return null
  return matches.map((match) => ({
    value: match[1],
    label: match[2].replace(/^[()\s]+/, "").replace(/[()\s]+$/, "").trim(),
  }))
}

const stripNumberedOptions = (text: string) => {
  const cleaned = normalizeQuestionText(text)
  const start = cleaned.indexOf("1=")
  if (start === -1) return cleaned.trim()
  const trimmed = cleaned.slice(0, start).trim()
  return trimmed.replace(/\(\s*$/, "").trim()
}

export default function SurveyPage({ pageIndex }: SurveyPageProps) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [lastEnded, setLastEnded] = useState<any>(null)
  const [storedDescriptions, setStoredDescriptions] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId")
    if (!sessionId) return
    const key = `postSurveyStartedAt:${sessionId}`
    if (localStorage.getItem(key)) return
    const startedAt = new Date().toISOString()
    localStorage.setItem(key, startedAt)
    logEvent({ sessionId, type: "POST_SURVEY_STARTED", ts: startedAt }).catch(() => {})
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem("lastEnded")
    if (!raw) return
    try {
      setLastEnded(JSON.parse(raw))
    } catch {
      setLastEnded(null)
    }
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem("lastDescriptions")
    if (!raw) return
    try {
      setStoredDescriptions(JSON.parse(raw))
    } catch {
      setStoredDescriptions(null)
    }
  }, [])

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId")
    if (!sessionId) return
    const key = `postSurveyResponses:${sessionId}`
    const raw = localStorage.getItem(key)
    if (!raw) return
    try {
      setResponses(JSON.parse(raw))
    } catch {
      setResponses({})
    }
  }, [])

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId")
    if (!sessionId) return
    const key = `postSurveyResponses:${sessionId}`
    localStorage.setItem(key, JSON.stringify(responses))
  }, [responses])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pageIndex])

  const sections = useMemo<SectionGroup[]>(() => {
    return Object.entries(POST_SURVEY).map(([sectionKey, items]) => ({
      key: sectionKey,
      questions: Object.entries(items).map(([id, text]) => ({ id, text, responseKey: `${sectionKey}.${id}` })),
    }))
  }, [])

  const pages = useMemo<SectionGroup[][]>(() => {
    const messageStrength = sections.find((section) => section.key === "message_strength")
    const finalGuess = sections.find((section) => section.key === "final_guess")
    const attitudeKeys = ["attitude_clarity", "attitude_correctness", "susceptibility_consensus"]
    const attitudeSections = sections.filter((section) => attitudeKeys.includes(section.key))
    const otherSections = sections.filter(
      (section) =>
        section.key !== "message_strength" &&
        section.key !== "final_guess" &&
        !attitudeKeys.includes(section.key),
    )
    const perPage = Math.ceil(otherSections.length / 2)
    const pagesList: SectionGroup[][] = []
    if (messageStrength) pagesList.push([messageStrength])
    const otherPages = [otherSections.slice(0, perPage), otherSections.slice(perPage)].filter(
      (page) => page.length > 0,
    )
    pagesList.push(...otherPages)
    if (attitudeSections.length > 0 || finalGuess) {
      const lastPageSections = [...attitudeSections]
      if (finalGuess) lastPageSections.push(finalGuess)
      pagesList.push(lastPageSections)
    }
    return pagesList
  }, [sections])

  const totalPages = pages.length
  const currentSections = pages[pageIndex] ?? []

  const isMessageStrengthPage =
    currentSections.length === 1 && currentSections[0]?.key === "message_strength"
  const hasAttitudeSection = currentSections.some((section) => section.key === "attitude_clarity")

  const finalGuessData = useMemo(() => {
    const liveDescriptions = lastEnded?.descriptions ?? {}
    const fallbackDescriptions = storedDescriptions ?? {}
    const hasLiveDescriptions = Object.values(liveDescriptions).some((text) => (text ?? "").trim().length > 0)
    const descriptions = hasLiveDescriptions
      ? { ...fallbackDescriptions, ...liveDescriptions }
      : fallbackDescriptions
    const order = lastEnded?.publicState?.turn?.order ?? []
    const players = lastEnded?.publicState?.players ?? []
    const myName = lastEnded?.privateState?.myName ?? null
    const orderedNames = order.length ? order : players.map((p: any) => p.name)
    const filteredNames = myName ? orderedNames.filter((name: string) => name !== myName) : orderedNames
    const seen = new Set<string>()
    const orderedEntries = filteredNames.map((name: string) => {
      seen.add(name)
      return { name, text: descriptions[name] ?? "" }
    })
    const extraEntries = Object.keys(descriptions)
      .filter((name) => !seen.has(name) && name !== myName)
      .map((name) => ({ name, text: descriptions[name] ?? "" }))
    const allEntries = [...orderedEntries, ...extraEntries]
    let playerOptions = filteredNames.length ? filteredNames : players.map((p: any) => p.name)
    if (myName) {
      playerOptions = playerOptions.filter((name: string) => name !== myName)
    }
    if (!playerOptions.length) {
      playerOptions = Object.keys(descriptions)
    }
    if (!playerOptions.length) {
      playerOptions = ["Unknown"]
    }
    return {
      entries: allEntries,
      playerOptions,
      myName,
      hasDescriptions: allEntries.some((entry) => (entry.text ?? "").trim().length > 0),
    }
  }, [lastEnded, storedDescriptions])

  const handleSubmit = async () => {
    const sessionId = localStorage.getItem("sessionId")
    if (sessionId) {
      const payload = sections.reduce<Record<string, Record<string, string>>>((acc, section) => {
        const sectionResponses: Record<string, string> = {}
        section.questions.forEach((question) => {
          const value = responses[question.responseKey]
          if (value) sectionResponses[question.id] = value
        })
        if (Object.keys(sectionResponses).length > 0) acc[section.key] = sectionResponses
        return acc
      }, {})

      await logEvent({ sessionId, type: "POST_SURVEY", payload })

      const consentedAt = localStorage.getItem("consentedAt")
      if (consentedAt) {
        const endedAt = new Date().toISOString()
        const startedMs = Date.parse(consentedAt)
        const endedMs = Date.parse(endedAt)
        if (!Number.isNaN(startedMs) && !Number.isNaN(endedMs) && endedMs >= startedMs) {
          const durationSeconds = Math.round((endedMs - startedMs) / 1000)
          await logEvent({
            sessionId,
            type: "SESSION_DURATION",
            payload: {
              started_at: consentedAt,
              ended_at: endedAt,
              duration_seconds: durationSeconds,
            },
          })
        }
      }
    }
    router.push("/complete")
  }

  const requiredIds = sections.flatMap((section) => section.questions.map((question) => question.responseKey))
  const isComplete = requiredIds.every((id) => Boolean(responses[id]))
  const pageRequiredIds = currentSections.flatMap((section) => section.questions.map((question) => question.responseKey))
  const isPageComplete = pageRequiredIds.every((id) => Boolean(responses[id]))

  const goToPage = (index: number) => {
    if (index < 0) {
      router.push("/survey1")
      return
    }
    if (index >= totalPages) {
      router.push(`/survey${totalPages}`)
      return
    }
    router.push(`/survey${index + 1}`)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Post-Experiment Survey</CardTitle>
            <CardDescription className="text-base mt-2">
              Please share your experience with the Liar Game experiment
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Survey Questions */}
        <Card>
          <CardContent className="pt-6 space-y-10">
            {isMessageStrengthPage || pageIndex === 0 || pageIndex === 1 || pageIndex === 2 ? (
              <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
                <p>
                  The following questions concern the AI agents you interacted with during the game.
                </p>
                <p className="mt-2 font-medium">
                  Based on your experience in the game, please respond honestly.
                </p>
              </div>
            ) : null}
            {hasAttitudeSection ? (
              <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
                <p>
                  The following questions ask about your general attitudes and beliefs.
                </p>
                <p className="mt-2 font-medium">
                  Please respond based on your usual thoughts and experiences.
                </p>
              </div>
            ) : null}
            {currentSections.map((section) => (
              <div key={section.key} className="space-y-4">
                {section.key === "final_guess" ? (
                  <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-foreground space-y-2">
                    <p>Before you finish, please review the descriptions from the game.</p>
                    <p className="font-medium">Then make one final guess about the liar.</p>
                  </div>
                ) : null}
                <div className="rounded-lg border border-border/70 bg-muted/20 p-5 space-y-6">
                {section.questions.map((question) => {
                  const numberedOptions = parseNumberedOptions(question.text)
                  const bipolarMatch = question.text.match(/(.+)\s*(?:↔|<->)\s*(.+)/)
                  const labelText = numberedOptions
                    ? stripLeadingCondition(stripNumberedOptions(question.text))
                    : stripLeadingCondition(question.text)
                  const idBase = question.responseKey.replace(/\./g, "-")
                  const isBinaryMessageStrength = section.key === "message_strength"
                  const isFinalGuess = section.key === "final_guess"

                  return (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-base font-medium leading-6">{labelText}</Label>
                      {isFinalGuess ? (
                        <div className="space-y-4">
                          <div className="grid gap-3">
                            {finalGuessData.entries.map((entry) => (
                              <div key={entry.name} className="rounded-md border border-border bg-background/60 p-3">
                                <div className="text-sm font-semibold">
                                  {entry.name === finalGuessData.myName ? "You" : entry.name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {entry.text?.trim().length ? entry.text : "No description recorded."}
                                </div>
                              </div>
                            ))}
                          </div>
                          {!finalGuessData.hasDescriptions ? (
                            <div className="text-xs text-muted-foreground">
                              Descriptions are unavailable for this session.
                            </div>
                          ) : null}
                          <RadioGroup
                            value={responses[question.responseKey] ?? ""}
                            onValueChange={(value) => setResponses({ ...responses, [question.responseKey]: value })}
                          >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {finalGuessData.playerOptions.map((name: string) => (
                                <div key={name} className="flex items-center gap-2">
                                  <RadioGroupItem value={name} id={`${idBase}-${name}`} />
                                  <Label htmlFor={`${idBase}-${name}`} className="text-sm cursor-pointer">
                                    {name === finalGuessData.myName ? "You" : name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      ) : isBinaryMessageStrength ? (
                        <RadioGroup
                          value={responses[question.responseKey] ?? ""}
                          onValueChange={(value) => setResponses({ ...responses, [question.responseKey]: value })}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((option) => (
                              <div key={option.value} className="flex flex-col items-center gap-2">
                                <RadioGroupItem value={option.value} id={`${idBase}-${option.value}`} />
                                <Label
                                  htmlFor={`${idBase}-${option.value}`}
                                  className="text-xs cursor-pointer text-muted-foreground"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : numberedOptions ? (
                        <RadioGroup
                          value={responses[question.responseKey] ?? ""}
                          onValueChange={(value) => setResponses({ ...responses, [question.responseKey]: value })}
                        >
                          <div className="grid grid-cols-3 gap-4">
                            {numberedOptions.map((option) => (
                              <div key={option.value} className="flex flex-col items-center gap-2">
                                <RadioGroupItem value={option.value} id={`${idBase}-${option.value}`} />
                                <Label
                                  htmlFor={`${idBase}-${option.value}`}
                                  className="text-xs cursor-pointer text-muted-foreground text-center leading-4"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : bipolarMatch ? (
                        <RadioGroup
                          value={responses[question.responseKey] ?? ""}
                          onValueChange={(value) => setResponses({ ...responses, [question.responseKey]: value })}
                        >
                          <div className="grid grid-cols-7 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                              <div key={score} className="flex flex-col items-center gap-2">
                                <RadioGroupItem value={score.toString()} id={`${idBase}-${score}`} />
                                <Label
                                  htmlFor={`${idBase}-${score}`}
                                  className="text-[10px] cursor-pointer text-muted-foreground"
                                >
                                  {score}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{bipolarMatch[1].trim()}</span>
                            <span>{bipolarMatch[2].trim()}</span>
                          </div>
                        </RadioGroup>
                      ) : (
                        <RadioGroup
                          value={responses[question.responseKey] ?? ""}
                          onValueChange={(value) => setResponses({ ...responses, [question.responseKey]: value })}
                        >
                          <div className="grid grid-cols-7 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                              <div key={score} className="flex flex-col items-center gap-2">
                                <RadioGroupItem value={score.toString()} id={`${idBase}-${score}`} />
                                <Label
                                  htmlFor={`${idBase}-${score}`}
                                  className="text-xs cursor-pointer text-muted-foreground"
                                >
                                  {score}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Strongly disagree</span>
                            <span>Strongly agree</span>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  )
                })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
          {pageIndex > 0 && (
            <Button size="lg" variant="outline" onClick={() => goToPage(pageIndex - 1)}>
              Back
            </Button>
          )}
          {pageIndex < totalPages - 1 ? (
            <Button size="lg" onClick={() => goToPage(pageIndex + 1)} disabled={!isPageComplete}>
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} disabled={!isComplete}>
              Submit Survey
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
