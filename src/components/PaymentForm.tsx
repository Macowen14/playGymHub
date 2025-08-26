import { useState } from 'react'

export default function PaymentForm() {
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function initiateMpesaPayment(phoneNumber: string, amountValue: number) {
    try {
      const res = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, amount: amountValue })
      })
      const data = await res.json()
      if (data.success) return { status: 'success', message: 'Payment initiated successfully.' }
      return { status: 'error', message: data.error }
    } catch (e) {
      return { status: 'error', message: 'Network error. Try again.' }
    }
  }

  return (
    <form
      className="mt-4 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault()
        const parsed = Number(amount)
        const r = await initiateMpesaPayment(phone, parsed)
        setStatus(`${r.status}: ${r.message}`)
      }}
    >
      <label className="grid gap-1 text-sm">
        Phone Number
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="2547XXXXXXXX" className="px-3 py-2 rounded-md border bg-background" required />
      </label>
      <label className="grid gap-1 text-sm">
        Amount
        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1" placeholder="100" className="px-3 py-2 rounded-md border bg-background" required />
      </label>
      <button className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm" type="submit">Pay with M-Pesa</button>
      {status && <div className="text-sm text-muted-foreground">{status}</div>}
    </form>
  )
}


