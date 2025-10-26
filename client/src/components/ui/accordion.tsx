import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface AccordionProps {
  type: 'single' | 'multiple'
  collapsible?: boolean
  className?: string
  children: React.ReactNode
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

interface AccordionTriggerProps {
  className?: string
  children: React.ReactNode
}

interface AccordionContentProps {
  className?: string
  children: React.ReactNode
}

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextType | null>(null)

const Accordion: React.FC<AccordionProps> = ({ type, collapsible = false, className, children }) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    if (type === 'single') {
      if (openItems.includes(value)) {
        setOpenItems(collapsible ? [] : openItems)
      } else {
        setOpenItems([value])
      }
    } else {
      setOpenItems(prev => 
        prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItem: React.FC<AccordionItemProps> = ({ value, className, children }) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionItem must be used within Accordion')

  const isOpen = context.openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={className}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionItemContextType {
  value: string
  isOpen: boolean
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null)

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ className, children }) => {
  const accordionContext = React.useContext(AccordionContext)
  const itemContext = React.useContext(AccordionItemContext)
  
  if (!accordionContext || !itemContext) {
    throw new Error('AccordionTrigger must be used within AccordionItem')
  }

  const handleClick = () => {
    accordionContext.toggleItem(itemContext.value)
  }

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline text-left",
        className
      )}
      onClick={handleClick}
    >
      {children}
      <ChevronDown 
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          itemContext.isOpen && "rotate-180"
        )} 
      />
    </button>
  )
}

const AccordionContent: React.FC<AccordionContentProps> = ({ className, children }) => {
  const itemContext = React.useContext(AccordionItemContext)
  
  if (!itemContext) {
    throw new Error('AccordionContent must be used within AccordionItem')
  }

  if (!itemContext.isOpen) return null

  return (
    <div className={cn("pb-4 pt-0 text-sm", className)}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }