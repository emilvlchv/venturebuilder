import React, { useState, useEffect, useRef } from 'react';
import { Send, User, AlertTriangle } from 'lucide-react';
import Button from '../shared/Button';
import { BusinessIdeaData } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

interface ChatConversationProps {
  onComplete: (data: BusinessIdeaData) => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessIdeaData>({
    businessIdea: '',
    teamComposition: '',
    teamStrengths: '',
    teamWeaknesses: '',
    targetCustomers: '',
    revenueModel: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "What's your business idea? Please describe it in detail.",
    "Who is on your team for this business?",
    "What are the key strengths of you and your team?",
    "What areas might you need help with?",
    "Who are your target customers or clients?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        { sender: 'assistant', text: questions[0] }
      ]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    const newMessages = [...messages, { sender: 'user' as const, text: currentInput }];
    setMessages(newMessages);
    
    const updatedBusinessData = { ...businessData };
    switch (currentQuestion) {
      case 0:
        updatedBusinessData.businessIdea = currentInput;
        break;
      case 1:
        updatedBusinessData.teamComposition = currentInput;
        break;
      case 2:
        updatedBusinessData.teamStrengths = currentInput;
        break;
      case 3:
        updatedBusinessData.teamWeaknesses = currentInput;
        break;
      case 4:
        updatedBusinessData.targetCustomers = currentInput;
        break;
    }
    
    setBusinessData(updatedBusinessData);
    setCurrentInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setMessages(prev => [...prev, { sender: 'assistant' as const, text: questions[nextQuestion] }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'assistant' as const, 
          text: "Thank you for sharing this information about your business idea! I'll create a personalized journey with tasks tailored to your needs." 
        }]);
        
        setTimeout(() => {
          console.log("Chat completed, sending data to parent:", updatedBusinessData);
          onComplete(updatedBusinessData);
        }, 2000);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleSkipToEnd = () => {
    const updatedBusinessData = {
      businessIdea: 'Test business idea',
      teamComposition: 'Solo founder with 2 employees',
      teamStrengths: 'Development, marketing',
      teamWeaknesses: 'Finance, legal',
      targetCustomers: 'Small businesses',
      revenueModel: 'SaaS subscription model',
    };
    
    console.log("Skipping to end, sending data:", updatedBusinessData);
    onComplete(updatedBusinessData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    if (message.sender === 'assistant') {
      return (
        <div key={index} className="flex items-start space-x-3 max-w-3xl animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
            AI
          </div>
          <div className="glass p-4 rounded-xl rounded-tl-none">
            <p className="text-foreground">{message.text}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className="flex items-start space-x-3 max-w-3xl ml-auto animate-fade-in">
          <div className="bg-primary/10 p-4 rounded-xl rounded-tr-none">
            <p className="text-foreground">{message.text}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
            <User size={16} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-6 max-h-[500px] overflow-y-auto p-2">
        {messages.map((message, index) => renderMessage(message, index))}
        
        {isTyping && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
              AI
            </div>
            <div className="glass p-4 rounded-xl rounded-tl-none">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {currentQuestion < questions.length && !isTyping && (
        <div className="relative mt-4">
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type your response here..."
            className="w-full p-3 pr-12 min-h-[120px] rounded-xl border bg-card text-card-foreground resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentInput.trim()}
            className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      )}
      
      <button 
        onClick={handleSkipToEnd}
        className="mt-4 p-2 bg-orange-500 text-white rounded"
      >
        Skip to End (Testing Only)
      </button>
    </div>
  );
};

export default ChatConversation;
