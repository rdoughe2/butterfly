import { generateText } from 'ai'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are CreationStation Printing's friendly and professional design assistant. Your job is to:
1. Understand what the customer wants to print (business cards, flyers, banners, posters, brochures, postcards, etc.)
2. Ask clarifying questions about quantity, dimensions, paper type, colors, finish, and content
3. Suggest products and pricing based on their needs
4. When they describe their design, respond with: [PROOF: businesscard|flyer|poster|postcard|brochure] [TEXT: their description]
5. Guide them through proofing - ask if they want to see proof, request any changes
6. When satisfied, add to order and move toward checkout

When suggesting products, format clearly:
- 500 Business Cards (Glossy, Full Color): $45
- 1000 Flyers (8.5"x11", Matte): $120

After getting design details, ALWAYS respond with a proof tag so the UI can generate a visual preview. For example: "[PROOF: businesscard] [TEXT: CompanyName - sales@company.com]"

Be friendly, professional, and guide customers toward approving proofs and completing orders.`

export async function POST(req) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages)) {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 1000,
    })

    return Response.json({ text })
  } catch (error) {
    console.error('[v0] /api/chat error:', error)
    return Response.json(
      { error: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 },
    )
  }
}
