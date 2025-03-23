
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessIdeaData } from './types';
import { formatBusinessDataForAI } from '@/utils/businessProfileUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AIChatAssistantProps {
  journeyId?: string;
  businessData?: BusinessIdeaData;
  isFloating?: boolean;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ 
  journeyId,
  businessData,
  isFloating = true
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Initial greeting message
  useEffect(() => {
    if (!hasGreeted && !isMinimized) {
      setIsTyping(true);
      
      // Artificial delay to simulate typing
      const timeout = setTimeout(() => {
        const initialMessage = {
          id: `assistant-${Date.now()}`,
          content: `Hi${user?.displayName ? ` ${user.displayName}` : ''}! I'm your AI business assistant. I can answer questions about your journey, provide guidance on business concepts, or help you overcome any blockers you're facing. How can I help you today?`,
          sender: 'assistant' as const,
          timestamp: new Date()
        };
        
        setMessages([initialMessage]);
        setIsTyping(false);
        setHasGreeted(true);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [hasGreeted, isMinimized, user?.displayName]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Generate AI response based on user input
    generateAIResponse(inputValue, businessData);
  };

  const generateAIResponse = (userInput: string, businessData?: BusinessIdeaData) => {
    // Simulate AI thinking time
    setTimeout(() => {
      // Context awareness for responses
      let responseContent = '';
      const lowerCaseInput = userInput.toLowerCase();
      
      // Basic context-aware responses
      if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        responseContent = `Hello! How can I assist you with your business journey today?`;
      } 
      else if (lowerCaseInput.includes('business plan') || lowerCaseInput.includes('plan')) {
        responseContent = `Creating a solid business plan is crucial. Start with your executive summary, business description, market analysis, organization structure, products/services description, marketing strategy, financial projections, and funding requirements. Would you like more specific guidance on any of these sections?`;
      } 
      else if (lowerCaseInput.includes('market research') || lowerCaseInput.includes('research')) {
        responseContent = `Market research is essential for validating your business idea. Consider these approaches: online surveys, competitor analysis, industry reports, customer interviews, and focus groups. This will help you understand your target market and refine your value proposition. Would you like me to elaborate on any of these methods?`;
      } 
      else if (lowerCaseInput.includes('funding') || lowerCaseInput.includes('money') || lowerCaseInput.includes('invest')) {
        responseContent = `There are several funding options for startups: bootstrapping, friends & family, angel investors, venture capital, crowdfunding, small business loans, and grants. Each has advantages depending on your business stage and goals. Which options would you like to learn more about?`;
      } 
      else if (lowerCaseInput.includes('stuck') || lowerCaseInput.includes('help') || lowerCaseInput.includes('blocker')) {
        responseContent = `I'm sorry to hear you're facing challenges. Could you provide more details about what specific blocker you're experiencing? I'd be happy to suggest strategies or resources to help you overcome it.`;
      }
      else if (businessData && (lowerCaseInput.includes('my business') || lowerCaseInput.includes('business idea'))) {
        const formattedData = formatBusinessDataForAI(businessData);
        responseContent = `Based on the information you've shared about your business idea:\n\n${formattedData}\n\nThis shows potential! To strengthen your concept, consider validating it with potential customers and refining your target market definition. Would you like specific advice on next steps?`;
      }
      else {
        responseContent = `That's an interesting question. To give you the most helpful response, could you provide a bit more context about your business idea or the specific challenge you're facing? I'm here to help with everything from ideation to execution.`;
      }
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        content: responseContent,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isFloating) {
    // Render inline chat
    return (
      <Card className="border rounded-xl overflow-hidden shadow-md">
        <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot size={18} />
            <h3 className="font-medium">AI Business Assistant</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your business journey..."
              className="resize-none"
              rows={2}
              onKeyDown={handleKeyDown}
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Floating chat widget
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isMinimized ? (
        <div className="flex flex-col w-80 h-96 bg-background border rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <h3 className="font-medium">AI Business Assistant</h3>
            </div>
            <div className="flex gap-1">
              <button onClick={toggleMinimize} className="p-1 hover:bg-primary-foreground/10 rounded">
                <Minimize2 size={16} />
              </button>
              <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-primary-foreground/10 rounded">
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-3 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="resize-none"
                rows={1}
                onKeyDown={handleKeyDown}
              />
              <Button 
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          className="flex items-center gap-2 rounded-full shadow-lg" 
          onClick={toggleMinimize}
        >
          <Bot size={18} />
          <span>AI Assistant</span>
        </Button>
      )}
    </div>
  );
};

export default AIChatAssistant;
