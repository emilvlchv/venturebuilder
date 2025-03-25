
import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
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
    industry: '',
    problem: '',
    stage: '',
    solution: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simplified question set for better user experience
  const questions = [
    "What's your business idea in a few sentences?",
    "Who are your target customers?",
    "What industry or market sector are you in?",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        { sender: 'assistant', text: "Hi there! I'll help create your personalized business journey. Let me ask you a few quick questions." },
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
        updatedBusinessData.solution = currentInput;
        break;
      case 1:
        updatedBusinessData.targetCustomers = currentInput;
        break;
      case 2:
        updatedBusinessData.industry = currentInput;
        // Set reasonable defaults for other fields to ensure we have complete data
        updatedBusinessData.problem = "General market needs";
        updatedBusinessData.stage = "Early stage";
        updatedBusinessData.teamComposition = "Solo founder or small team";
        updatedBusinessData.teamStrengths = "Vision and domain knowledge";
        updatedBusinessData.teamWeaknesses = "Scaling and operations";
        updatedBusinessData.revenueModel = "Standard industry model";
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
          text: "Thanks! I have enough information to create your personalized journey now." 
        }]);
        
        setTimeout(() => {
          onComplete(updatedBusinessData);
        }, 1500);
      }
      
      setIsTyping(false);
    }, 1000);
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
    </div>
  );
};

export default ChatConversation;
