'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Eye, Check } from 'lucide-react'
import ProofPreview from '@/components/proof-preview'

const PrintShopChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content:
        "Welcome to CreationStation Printing! I'm your design assistant. What would you like to create today? (business cards, flyers, banners, posters, brochures, postcards, etc.)",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [proofs, setProofs] = useState([])
  const [currentProof, setCurrentProof] = useState(null)
  const messagesEndRef = useRef(null)
  const messageIdRef = useRef(2)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: messageIdRef.current++,
      type: 'user',
      content: input,
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ type: m.type, content: m.content })),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Request failed')

      const assistantContent = data.text

      const assistantMessage = {
        id: messageIdRef.current++,
        type: 'assistant',
        content: assistantContent,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Parse for proof tags [PROOF: type] [TEXT: content]
      const proofMatch = assistantContent.match(/\[PROOF:\s*(\w+)\]\s*\[TEXT:\s*([^\]]+)\]/)
      if (proofMatch) {
        const proofType = proofMatch[1]
        const proofContent = proofMatch[2]

        const newProof = {
          id: Date.now(),
          type: proofType,
          content: proofContent,
          approved: false,
        }

        setProofs((prev) => [...prev, newProof])
        setCurrentProof(newProof)
      }
    } catch (error) {
      console.error('[v0] chat error:', error)
      const errorMessage = {
        id: messageIdRef.current++,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleApproveProof = (proofId) => {
    setProofs((prev) => prev.map((p) => (p.id === proofId ? { ...p, approved: true } : p)))

    const approvedProof = proofs.find((p) => p.id === proofId)
    const userMessage = {
      id: messageIdRef.current++,
      type: 'user',
      content: `I approve the ${approvedProof.type} proof. Let's add this to my order.`,
    }
    setMessages((prev) => [...prev, userMessage])
    setCurrentProof(null)

    setTimeout(() => {
      const assistantMessage = {
        id: messageIdRef.current++,
        type: 'assistant',
        content: `Excellent! I've added the ${approvedProof.type} to your order. Would you like to create more items or proceed to checkout?`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleReviseProof = (proofId) => {
    const proof = proofs.find((p) => p.id === proofId)
    const userMessage = {
      id: messageIdRef.current++,
      type: 'user',
      content: `I need some changes to the ${proof.type} design. Can we adjust it?`,
    }
    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const assistantMessage = {
        id: messageIdRef.current++,
        type: 'assistant',
        content:
          'Of course! What would you like to change? Tell me about:\n- Different text or content\n- Color preferences\n- Layout adjustments\n- Any other details\n\nI\u2019ll create a revised proof for you.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleCheckout = () => {
    const approvedProofsCount = proofs.filter((p) => p.approved).length
    const checkoutMessage = {
      id: messageIdRef.current++,
      type: 'user',
      content: 'I\u2019d like to proceed with checkout',
    }
    setMessages((prev) => [...prev, checkoutMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const confirmMessage = {
        id: messageIdRef.current++,
        type: 'assistant',
        content: `Perfect! Your order is ready:\n\n\u2713 ${approvedProofsCount} item(s) approved\n\u2713 Estimated delivery: 5-7 business days\n\u2713 Free shipping on orders over $100\n\nClick "Complete Payment" below to finalize your order!`,
      }
      setMessages((prev) => [...prev, confirmMessage])
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Section */}
      <main className="flex-1 flex flex-col bg-white min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 text-white">
          <h1 className="text-2xl font-serif font-bold tracking-tight">CreationStation</h1>
          <p className="text-blue-200 text-sm mt-1">Premium Printing Solutions</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-blue-50 text-gray-900 rounded-bl-none border border-blue-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-blue-50 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none border border-blue-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your design (text, colors, style, quantity...)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={loading}
              aria-label="Describe your design"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </main>

      {/* Proof Review Sidebar */}
      <aside className="w-96 bg-gray-50 border-l border-gray-200 flex-col hidden lg:flex">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-white" />
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Proof Review</h2>
              <p className="text-blue-100 text-xs mt-1">Approve designs before printing</p>
            </div>
          </div>
        </div>

        {/* Proofs Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {proofs.length === 0 ? (
            <div className="text-center py-12">
              <Eye size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-medium">No proofs yet</p>
              <p className="text-gray-400 text-xs mt-2">
                Describe what you want to print to see a preview
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentProof && !currentProof.approved ? (
                <div>
                  <ProofPreview
                    proof={currentProof}
                    onApprove={() => handleApproveProof(currentProof.id)}
                    onRevise={() => handleReviseProof(currentProof.id)}
                  />
                </div>
              ) : null}

              {proofs.filter((p) => p.approved).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    Approved Items ({proofs.filter((p) => p.approved).length})
                  </h3>
                  <div className="space-y-2">
                    {proofs
                      .filter((p) => p.approved)
                      .map((proof) => (
                        <div
                          key={proof.id}
                          className="bg-green-50 border border-green-200 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2">
                            <Check size={16} className="text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 capitalize">
                                {proof.type}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {proof.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-6 bg-white space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-xs font-semibold text-blue-900">Ready to Order?</p>
            <p className="text-xs text-blue-800 mt-1">
              You have {proofs.filter((p) => p.approved).length} approved design(s)
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={proofs.filter((p) => p.approved).length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Payment
          </button>
          <p className="text-xs text-gray-500 text-center">Free shipping on orders over $100</p>
        </div>
      </aside>
    </div>
  )
}

export default PrintShopChatbot
