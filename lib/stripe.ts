import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  
  return stripeInstance
}

// For backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const stripeClient = getStripe()
    return (stripeClient as any)[prop]
  }
})
