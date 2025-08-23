"use client"

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Volume2, VolumeX, TicketPercentIcon, X, Loader2 } from "lucide-react"
import { callGemmaAPI } from "@/lib/gemma-api"
import { ApiStatus } from "@/components/api-status"

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
  const [isLoading, setIsLoading] = useState(false)
  const [isApiConnected, setIsApiConnected] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [voiceStatus, setVoiceStatus] = useState("ready")

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscribedText(transcript)
        setIsListening(false)
        setVoiceStatus("processing")
        
        // Automatically send the transcribed message
        if (transcript.trim()) {
          handleVoiceMessage(transcript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        // Handle different error types
        if (event.error === 'no-speech') {
          // This is normal - just restart listening
          setTimeout(() => {
            if (showVoiceModal && !isListening) {
              try {
                recognitionRef.current?.start()
                setIsListening(true)
              } catch (error) {
                console.error('Error restarting speech recognition:', error)
              }
            }
          }, 100)
        } else if (event.error === 'audio-capture') {
          alert('No microphone detected. Please check your microphone connection.')
          setIsListening(false)
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.')
          setIsListening(false)
        } else {
          // For other errors, just stop listening
          setIsListening(false)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (showVoiceModal && voiceStatus !== "processing") {
          setVoiceStatus("ready")
        }
      }
    }
  }, [])

  // Initialize text-to-speech
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance()
      speechRef.current.rate = 0.8 // Slightly slower for dyslexia-friendly speech
      speechRef.current.pitch = 1.0
      speechRef.current.volume = 1.0
      
      speechRef.current.onend = () => {
        setIsSpeaking(false)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (currentInput.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: currentInput,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      const userInput = currentInput
      setCurrentInput("")
      setIsLoading(true)

      try {
        const gemmaResponse = await callGemmaAPI(userInput)
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: gemmaResponse.response,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        
        // Automatically speak the AI response if not muted
        if (!isMuted && speechRef.current) {
          speechRef.current.text = gemmaResponse.response
          setIsSpeaking(true)
          window.speechSynthesis.speak(speechRef.current)
        }
      } catch (error) {
        console.error('Error getting AI response:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        setVoiceStatus("ready")
      }
    }
  }

  const handleVoiceMessage = async (transcript: string) => {
    console.log('Voice message received:', transcript)
    console.log('API connected:', isApiConnected)
    console.log('Currently loading:', isLoading)
    
    if (transcript.trim() && !isLoading) {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text: transcript,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setVoiceStatus("processing")
      
      // Try to call API even if status check failed
      try {
        console.log('Calling Gemma API with:', transcript)
        const gemmaResponse = await callGemmaAPI(transcript)
        console.log('Gemma API response:', gemmaResponse)
        
        if (!gemmaResponse || !gemmaResponse.response) {
          throw new Error('No response from API')
        }
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: gemmaResponse.response,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        
        // Automatically speak the AI response
        if (!isMuted && speechRef.current) {
          speechRef.current.text = gemmaResponse.response
          setIsSpeaking(true)
          window.speechSynthesis.speak(speechRef.current)
        }
      } catch (error) {
        console.error('Error getting AI response:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'm sorry, I'm having trouble connecting right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        setVoiceStatus("ready")
      }
    }
  }

  const handleVoiceInput = () => {
    setShowVoiceModal(true)
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }
    
    if (!isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setVoiceStatus("listening")
        setTranscribedText("")
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        alert('Unable to start speech recognition. Please check your microphone permissions.')
      }
    }
  }

  const handleCloseVoiceModal = () => {
    setShowVoiceModal(false)
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setIsSpeaking(false)
    setTranscribedText("")
    setVoiceStatus("ready")
  }

  const handlePlayMessage = (text: string) => {
    if (!isMuted && speechRef.current) {
      speechRef.current.text = text
      setIsSpeaking(true)
      window.speechSynthesis.speak(speechRef.current)
    }
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
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

      <div className="max-w-4xl mx-auto space-y-4">
        {/* API Status */}
        <div className="flex justify-center">
          <ApiStatus onStatusChange={setIsApiConnected} />
        </div>
        
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
                placeholder={isApiConnected ? "Type your message here..." : "Please configure API key to start chatting..."}
                className="flex-1 p-4 text-xl border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading || !isApiConnected}
              />
              <Button 
                onClick={handleSendMessage} 
                size="lg" 
                className="px-8 py-4 text-xl"
                disabled={isLoading || !currentInput.trim() || !isApiConnected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  "Send"
                )}
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
                {voiceStatus === "listening" ? "I'm listening... Speak now!" : 
                 isSpeaking ? "I'm talking..." : 
                 voiceStatus === "processing" ? "Processing your message..." :
                 "Press the microphone to talk"}
              </p>
              {transcribedText && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 max-w-md mx-auto">
                  <p className="text-white text-lg">"{transcribedText}"</p>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <p className="text-white">Getting AI response...</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  if (isListening) {
                    recognitionRef.current?.stop()
                    setIsListening(false)
                  } else if (!isMuted) {
                    handleVoiceInput()
                  }
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

              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={stopSpeaking}
                  className="w-16 h-16 rounded-full p-0 bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                >
                  <VolumeX className="w-6 h-6" />
                </Button>
              )}

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
