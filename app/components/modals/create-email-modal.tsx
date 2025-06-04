import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Mail, Loader2, Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface CreateEmailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  onEmailSent: () => void
}

// Discount helpers copied from booking page
const getDiscountInfo = (total: number) => {
  if (total >= 1100) return { percent: 17, min: 1100, max: Infinity };
  if (total >= 900) return { percent: 15, min: 900, max: 1099.99 };
  if (total >= 700) return { percent: 12, min: 700, max: 899.99 };
  if (total >= 500) return { percent: 10, min: 500, max: 699.99 };
  if (total >= 350) return { percent: 5, min: 350, max: 499.99 };
  if (total >= 199.99) return { percent: 3, min: 199.99, max: 349.99 };
  return { percent: 0, min: 0, max: 199.98 };
};
const applyDiscount = (total: number) => {
  const { percent } = getDiscountInfo(total);
  return total * (1 - percent / 100);
};

const EMAIL_TEMPLATES = {
  'final-delivery': {
    name: 'Final Delivery',
    description: 'Insert final media delivery message',
    generateContent: (booking: any) => {
      // Extract variables
      const firstName = booking.agent_name?.split(' ')[0] || '';
      const streetOnly = typeof booking.address === 'string'
        ? booking.address.split(',')[0]
        : booking.address?.street
          ? `${booking.address.street}${booking.address.street2 ? ', ' + booking.address.street2 : ''}`
          : '';
      const address = streetOnly;
      const downloadLink = booking.final_edits_link || '';
      const virtualTourLink = booking.tour_360_link || '';
      // Calculate price after volume discount
      let price = booking.total_amount;
      if (typeof price === 'number') {
        price = applyDiscount(price);
      }
      const priceDisplay = typeof price === 'number' ? `$${price.toFixed(2)}` : '';
      return {
        subject: `${streetOnly} - Final Media Ready`,
        message: `Hi ${firstName},\n\nThe final media for ${address} is ready and available for you to review and download.\n\nDownload the photos here:\n${downloadLink}\n\nAdd this link to your MLS listing for the virtual tour:\n${virtualTourLink}\n\nIf you have any questions, need any edits, or would like anything additional, feel free to reach out—happy to help however I can.\n\nThe total for the shoot is ${priceDisplay}. I'll send the invoice in a separate email shortly. If you prefer to pay via e-transfer, you can send it to cooperthompson55955@gmail.com.\n\nThanks again for choosing me for your listing—I look forward to working together again soon.\n\nBest regards,\nCooper Thompson\n[RePhotos.ca](https://rephotos.ca)`
      }
    }
  },
  'booking-confirmation': {
    name: 'Booking Confirmation',
    description: 'Insert booking confirmation message',
    generateContent: (booking: any) => ({
      subject: '',
      message: ''
    })
  },
  'datetime-change': {
    name: 'Date/Time Change',
    description: 'Insert date/time change notification',
    generateContent: (booking: any) => ({
      subject: '',
      message: ''
    })
  },
  'invoice-reminder': {
    name: 'Invoice Reminder',
    description: 'Insert invoice reminder message',
    generateContent: (booking: any) => ({
      subject: '',
      message: ''
    })
  },
  'thank-you-review': {
    name: 'Thank You + Review',
    description: 'Insert thank you and review request message',
    generateContent: (booking: any) => ({
      subject: '',
      message: ''
    })
  },
  'custom-followup': {
    name: 'Custom Follow-Up',
    description: 'Insert custom follow-up message',
    generateContent: (booking: any) => ({
      subject: '',
      message: ''
    })
  }
}

// Helper to convert URLs in text to clickable HTML links
function linkify(text: string) {
  const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
  return text.replace(urlRegex, (url) => {
    const href = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

export function CreateEmailModal({
  isOpen,
  onClose,
  booking,
  onEmailSent
}: CreateEmailModalProps) {
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Reset sendStatus when modal closes
  useEffect(() => {
    if (!isOpen) setSendStatus('idle')
  }, [isOpen])

  const handleTemplateClick = (templateId: string) => {
    const template = EMAIL_TEMPLATES[templateId as keyof typeof EMAIL_TEMPLATES]
    const { subject, message } = template.generateContent(booking)
    setSubject(subject)
    setMessage(message)
    setSelectedTemplate(templateId)
  }

  const handleSendEmail = async () => {
    try {
      setIsSending(true)
      setSendStatus('sending')
      
      // Prepare HTML version with clickable links
      const html = linkify(message).replace(/\n/g, '<br>');
      
      console.log('Sending email to:', booking.agent_email)
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: booking.agent_email,
          subject,
          message, // plain text
          html,    // clickable links
          bookingId: booking.id,
        }),
      })

      const data = await response.json()
      console.log('Email send response:', data)

      if (!response.ok) {
        setSendStatus('error')
        throw new Error(data.error || data.details || "Failed to send email")
      }

      setSendStatus('sent')
      toast.success("Email sent successfully")
      onEmailSent()
    } catch (error) {
      console.error("Error sending email:", error)
      setSendStatus('error')
      toast.error(error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 w-full">
          <div className="space-y-2 w-full">
            <Label>To</Label>
            <Input
              value={booking.agent_email}
              disabled
              className="bg-muted w-full"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label className="font-semibold">Templates</Label>
            <div className="flex flex-wrap gap-2 w-full">
              {Object.entries(EMAIL_TEMPLATES).map(([id, template]) => (
                <Button
                  key={id}
                  variant={selectedTemplate === id ? "default" : "outline"}
                  className={cn(
                    "flex-shrink-0",
                    selectedTemplate === id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTemplateClick(id)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
            {selectedTemplate && (
              <p className="text-sm text-muted-foreground">
                Loaded: {EMAIL_TEMPLATES[selectedTemplate as keyof typeof EMAIL_TEMPLATES].name} Template
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] w-full"
              placeholder="Enter email message"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending || sendStatus === 'sent'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || sendStatus === 'sent'}
          >
            {sendStatus === 'sending' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sendStatus === 'sent' && <Check className="mr-2 h-4 w-4 text-green-600" />}
            {sendStatus === 'idle' && 'Send Email'}
            {sendStatus === 'sending' && 'Sending...'}
            {sendStatus === 'sent' && 'Sent!'}
            {sendStatus === 'error' && 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 