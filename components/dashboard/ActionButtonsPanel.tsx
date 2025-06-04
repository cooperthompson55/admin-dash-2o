import { Button } from "@/components/ui/button"
import { User, FileText, Calendar, PlusCircle } from "lucide-react"
import Link from "next/link"

export function ActionButtonsPanel() {
  const actions = [
    {
      label: "Editor Profile",
      icon: <User className="w-4 h-4" />,
      href: "https://app.pixlmob.com/maidanghung",
      external: true
    },
    {
      label: "Generate Invoice",
      icon: <FileText className="w-4 h-4" />,
      href: "https://app.squareup.com/dashboard/invoices/new",
      external: true
    },
    {
      label: "Open Calendar",
      icon: <Calendar className="w-4 h-4" />,
      href: "#",
      disabled: true
    },
    {
      label: "New Booking",
      icon: <PlusCircle className="w-4 h-4" />,
      href: "https://www.rephotos.ca/book-now",
      external: true
    },
    {
      label: "Agent Reach",
      icon: <User className="w-4 h-4" />,
      href: "https://courageous-melba-d599a1.netlify.app/",
      external: true
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px] w-full max-w-[400px] flex-1">
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <div key={action.label} className="relative">
            {index > 0 && (
              <div className="absolute -top-1 left-0 right-0 h-px bg-gray-100" />
            )}
            {action.external ? (
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {action.icon}
                {action.label}
              </a>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-3 py-2 h-auto text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={action.disabled}
                asChild
              >
                <Link href={action.href}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 