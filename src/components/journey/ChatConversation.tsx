
import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { BusinessIdeaData } from './JourneyWizard';
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
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Define the questions to be asked by the AI
  const questions = [
    "What's your business idea? Please describe it in as much detail as possible, including what product or service you plan to offer.",
    "Are you working on this idea alone or with a team? If you have a team, how many people are involved?",
    "What are the key strengths of you and your team members? What skills, experience, or expertise do you bring to this venture?",
    "What areas do you or your team feel less confident in? Understanding these gaps will help me suggest resources or strategies to address them.",
    "Who are your target customers or clients? Please describe your ideal customer profile, including demographics, needs, and pain points.",
    "Is there anything else you'd like to share about your business idea or requirements that might help me create a better personalized journey for you?"
  ];

  // Scroll to bottom of chat whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize the chat with the first question
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        { sender: 'assistant', text: questions[0] }
      ]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to handle sending a user message
  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    // Add user message to chat
    const newMessages = [...messages, { sender: 'user', text: currentInput }];
    setMessages(newMessages);
    
    // Store the response based on current question
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
      case 5:
        updatedBusinessData.additionalInfo = currentInput;
        break;
    }
    
    setBusinessData(updatedBusinessData);
    setCurrentInput('');
    setIsTyping(true);
    
    // Add thinking delay to simulate AI response
    setTimeout(() => {
      // Check if we have more questions
      if (currentQuestion < questions.length - 1) {
        // Move to next question
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setMessages(prev => [...prev, { sender: 'assistant', text: questions[nextQuestion] }]);
      } else {
        // Final message before completing
        setMessages(prev => [...prev, { 
          sender: 'assistant', 
          text: "Thank you for sharing all this information about your business idea! This will help me create a personalized journey for you. Let me analyze this information now." 
        }]);
        
        // Complete the chat after a brief delay
        setTimeout(() => {
          onComplete(updatedBusinessData);
        }, 2000);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  // Handle pressing Enter to send message
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
