"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Volume2, VolumeX, TicketPercentIcon, X } from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function DyslexiaLearningAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'd like to learn how to spell 'butterfly'.",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Great choice! Let's break down 'butterfly' together. It has 3 parts: but-ter-fly. Would you like me to say each part slowly?",
      isUser: false,
      timestamp: new Date(),
    },
  ])

  const [currentInput, setCurrentInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (currentInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: currentInput,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setCurrentInput("")

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "That's wonderful! Let me help you with that word. Would you like me to break it down into syllables?",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }

  const handleVoiceInput = () => {
    setShowVoiceModal(true)
    setIsListening(!isListening)
  }

  const handleCloseVoiceModal = () => {
    setShowVoiceModal(false)
    setIsListening(false)
    setIsSpeaking(false)
  }

  const handlePlayMessage = (text: string) => {
    if (!isMuted) {
      setIsSpeaking(true)
      setTimeout(() => setIsSpeaking(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center justify-center mb-6 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <TicketPercentIcon className="w-8 h-8 text-lime-600" />
          <h1 className="text-3xl font-bold text-foreground">{"Dyslexia Ai"}</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 p-6">
            {/* Messages Display */}
            <div ref={chatContainerRef} className="h-[450px] overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.isUser ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                    style={{ fontSize: "20px", lineHeight: 1.6 }}
                  >
                    <div className="flex items-start gap-2">
                      <p>{message.text}</p>
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayMessage(message.text)}
                          className="p-1 h-8 w-8"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message here..."
                className="flex-1 p-4 text-xl border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button onClick={handleSendMessage} size="lg" className="px-8 py-4 text-xl">
                Send
              </Button>
            </div>

            <div className="flex justify-center gap-6 mt-6">
              <Button variant="outline" size="lg" onClick={handleVoiceInput} className="p-6 text-lg bg-transparent">
                <Mic className="w-6 h-6 mr-3" />
                Talk
              </Button>

              <Button variant="outline" size="lg" onClick={() => setIsMuted(!isMuted)} className="p-6 text-lg">
                {isMuted ? (
                  <>
                    <VolumeX className="w-6 h-6 mr-3" />
                    Sound Off
                  </>
                ) : (
                  <>
                    <Volume2 className="w-6 h-6 mr-3" />
                    Sound On
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Interface Modal - kept the same as it's already simple */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
            <div className="relative mb-8">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 shadow-2xl ${
                  isListening || isSpeaking ? "animate-pulse" : ""
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(59,130,246,0.9), rgba(29,78,216,1))",
                  boxShadow: "0 0 60px rgba(59,130,246,0.5)",
                }}
              />
              {(isListening || isSpeaking) && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 animate-ping opacity-30" />
              )}
            </div>

            <div className="text-center mb-12">
              <p className="text-white text-xl font-medium mb-2">
                {isListening ? "I'm listening..." : isSpeaking ? "I'm talking..." : "Press the microphone to talk"}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setIsListening(!isListening)
                  setIsSpeaking(false)
                }}
                className={`w-16 h-16 rounded-full p-0 ${
                  isListening
                    ? "bg-white text-black hover:bg-white/90"
                    : isMuted
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                } transition-all duration-200`}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleCloseVoiceModal}
                className="w-16 h-16 rounded-full p-0 bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
