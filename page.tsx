"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: number
  text: string
  type: "entrada" | "saida" | "assistente" | "reset" | "none"
  amount: number
  timestamp: Date
  month: string
}

const extractAmount = (text: string): number => {
  // First try to match the exact format "R$ X.XXX,XX"
  const match = text.match(/R\$\s*([\d.,]+)/);
  if (match) {
    const normalized = match[1]
      .replace(/\./g, '')  // Remove all dots (thousand separators)
      .replace(',', '.');  // Replace comma with dot for decimal
    const amount = parseFloat(normalized);
    return isNaN(amount) ? 0 : amount;
  }
  
  // If no R$ format found, try to find any number in the text
  const numberMatch = text.match(/\d+([.,]\d{1,2})?/);
  if (numberMatch) {
    const normalized = numberMatch[0].replace(',', '.');
    const amount = parseFloat(normalized);
    return isNaN(amount) ? 0 : amount;
  }
  
  return 0;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

const getMonthKey = (date: Date): string => {
  return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

const getAssistantResponse = (userMsg: string, type: string, amount: number): string => {
  if (type === "reset") {
    return "Saldo zerado com sucesso! Todas as entradas e saídas foram removidas.";
  } else if (type === "entrada" && amount > 0) {
    return `Ótimo! Registrei uma entrada de ${formatCurrency(amount)}. Seu saldo foi atualizado.`;
  } else if (type === "saida" && amount > 0) {
    return `Entendi. Registrei uma saída de ${formatCurrency(amount)}. Continue controlando seus gastos!`;
  }
  return "Como posso ajudar com suas finanças hoje?";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financial-messages')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          month: getMonthKey(new Date(msg.timestamp))
        }))
      }
    }
    return []
  })
  
  const [input, setInput] = useState("")
  const [conversationalMode, setConversationalMode] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(getMonthKey(new Date()))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('financial-messages', JSON.stringify(messages))
    }
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessages: Message[] = [
        {
          id: 1,
          text: "Recebi salário: R$ 3.500,00",
          type: "entrada",
          amount: 3500,
          timestamp: new Date(),
          month: getMonthKey(new Date())
        },
        {
          id: 2,
          text: "Paguei mercado: R$ 850,00",
          type: "saida",
          amount: 850,
          timestamp: new Date(),
          month: getMonthKey(new Date())
        }
      ]
      setMessages(initialMessages)
    }
  }, [])

  const classifyMessage = (text: string): "entrada" | "saida" | "reset" | "none" => {
    const lowerText = text.toLowerCase().trim()
    
    if (lowerText === "zerar saldo") return "reset";
    
    const entradaKeywords = ["salario", "recebi", "ganhei", "entrada"]
    const saidaKeywords = ["paguei", "gastei", "comprei", "saida"]

    if (entradaKeywords.some(keyword => lowerText.includes(keyword))) return "entrada"
    if (saidaKeywords.some(keyword => lowerText.includes(keyword))) return "saida"
    return "none"
  }

  const getMessagesAfterLastReset = (messages: Message[], monthFilter?: string): Message[] => {
    const monthMessages = monthFilter 
      ? messages.filter(msg => msg.month === monthFilter)
      : messages;

    // Find the last reset message
    let lastResetIndex = -1;
    for (let i = monthMessages.length - 1; i >= 0; i--) {
      if (monthMessages[i].type === "reset") {
        lastResetIndex = i;
        break;
      }
    }

    // If we found a reset message, only return messages after it
    return lastResetIndex >= 0 
      ? monthMessages.slice(lastResetIndex + 1)
      : monthMessages;
  }

  const calculateBalance = (monthFilter?: string): number => {
    const relevantMessages = getMessagesAfterLastReset(messages, monthFilter);
    return relevantMessages.reduce((acc, msg) => {
      if (msg.type === "entrada") return acc + msg.amount;
      if (msg.type === "saida") return acc - msg.amount;
      return acc;
    }, 0);
  }

  const calculateEntradas = (monthFilter?: string): number => {
    const relevantMessages = getMessagesAfterLastReset(messages, monthFilter);
    return relevantMessages.reduce((total, msg) => {
      return msg.type === "entrada" ? total + msg.amount : total;
    }, 0);
  }

  const calculateSaidas = (monthFilter?: string): number => {
    const relevantMessages = getMessagesAfterLastReset(messages, monthFilter);
    return relevantMessages.reduce((total, msg) => {
      return msg.type === "saida" ? total + msg.amount : total;
    }, 0);
  }

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const type = classifyMessage(input);
    const amount = type === "reset" ? 0 : extractAmount(input);
    const timestamp = new Date();
    const month = getMonthKey(timestamp);
    
    console.log('Processing message:', { input, type, amount });

    const newMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      type,
      amount,
      timestamp,
      month
    }

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    if (conversationalMode) {
      const responseText = getAssistantResponse(input, type, amount);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        type: "assistente",
        amount: 0,
        timestamp: new Date(),
        month
      }
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
      }, 800);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const filteredMessages = messages.filter(msg => msg.month === currentMonth);

  return (
    <main className="flex flex-col h-screen">
      {/* Header with Balance and Categories */}
      <div className="bg-gray-900 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Controle Financeiro</h1>
          
          <Tabs defaultValue={currentMonth} className="w-full mb-4">
            <TabsList className="w-full overflow-x-auto">
              {getUniqueMonths().map((month) => (
                <TabsTrigger
                  key={month}
                  value={month}
                  onClick={() => setCurrentMonth(month)}
                >
                  {month}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Total Balance */}
            <Card className="bg-gray-800 p-4 text-white">
              <h3 className="text-sm font-medium text-gray-300">Saldo Total</h3>
              <p className={`text-2xl font-bold ${calculateBalance(currentMonth) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatCurrency(calculateBalance(currentMonth))}
              </p>
            </Card>
            
            {/* Entradas */}
            <Card className="bg-gray-800 p-4 text-white">
              <h3 className="text-sm font-medium text-gray-300">Total Entradas</h3>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(calculateEntradas(currentMonth))}
              </p>
            </Card>
            
            {/* Saídas */}
            <Card className="bg-gray-800 p-4 text-white">
              <h3 className="text-sm font-medium text-gray-300">Total Saídas</h3>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(calculateSaidas(currentMonth))}
              </p>
            </Card>
          </div>

          {/* Conversational Mode Toggle */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-gray-300">Modo Conversacional</span>
            <Switch
              checked={conversationalMode}
              onCheckedChange={setConversationalMode}
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100"
      >
        {filteredMessages.map((message) => {
          const alignment = message.type === "entrada" 
            ? "justify-start" 
            : message.type === "assistente" 
              ? "justify-center"
              : "justify-end";

          const bgColor = message.type === "entrada"
            ? "bg-green-100 border-green-200"
            : message.type === "saida"
            ? "bg-red-100 border-red-200"
            : message.type === "assistente"
            ? "bg-blue-100 border-blue-200"
            : message.type === "reset"
            ? "bg-yellow-100 border-yellow-200"
            : "bg-white";

          return (
            <div key={message.id} className={`flex ${alignment}`}>
              <Card className={`p-3 max-w-[80%] shadow-sm border ${bgColor}`}>
                <div className="flex flex-col">
                  <p className="text-gray-800">{message.text}</p>
                  <div className="text-sm text-gray-500 mt-1 flex justify-between items-center gap-4">
                    <span>{formatDate(message.timestamp)}</span>
                    {message.type !== "assistente" && message.type !== "reset" && message.amount > 0 && (
                      <span className={`font-medium ${
                        message.type === "entrada" ? "text-green-600" : "text-red-600"
                      }`}>
                        {formatCurrency(message.amount)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Digite sua mensagem... (ex: "Recebi R$ 1.000,00" ou "Zerar saldo")'
          className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
        <Button 
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Enviar
        </Button>
      </div>
    </main>
  )
}

function getUniqueMonths(): string[] {
  const currentDate = new Date();
  const months = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }));
  }
  
  return months;
}
