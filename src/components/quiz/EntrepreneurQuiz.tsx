
import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, entrepreneurTypes } from './quizData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface QuizState {
  currentStep: number;
  answers: Record<number, string>;
  isComplete: boolean;
  result: string | null;
}

const EntrepreneurQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 0, // 0 is start screen, 1-5 are questions, 6 is results
    answers: {},
    isComplete: false,
    result: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const totalSteps = quizQuestions.length;
  const progress = 
    quizState.currentStep === 0 ? 0 : 
    quizState.currentStep > totalSteps ? 100 : 
    (quizState.currentStep / totalSteps) * 100;
  
  const handleStart = () => {
    setQuizState({
      ...quizState,
      currentStep: 1,
    });
  };
  
  const handleAnswer = (answer: string) => {
    const updatedAnswers = {
      ...quizState.answers,
      [quizState.currentStep]: answer,
    };
    
    if (quizState.currentStep < totalSteps) {
      setQuizState({
        ...quizState,
        answers: updatedAnswers,
        currentStep: quizState.currentStep + 1,
      });
    } else {
      setIsLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        const result = calculateResult(updatedAnswers);
        setQuizState({
          ...quizState,
          answers: updatedAnswers,
          currentStep: totalSteps + 1,
          isComplete: true,
          result,
        });
        setIsLoading(false);
      }, 1500);
    }
  };
  
  const calculateResult = (answers: Record<number, string>) => {
    // Simple scoring system 
    const scores: Record<string, number> = {
      visionary: 0,
      operator: 0,
      hustler: 0,
      creator: 0,
    };
    
    // Loop through answers and increment scores based on answer types
    Object.entries(answers).forEach(([questionKey, answer]) => {
      const qIndex = parseInt(questionKey);
      const question = quizQuestions[qIndex - 1];
      const answerObj = question.options.find(opt => opt.id === answer);
      
      if (answerObj && answerObj.type) {
        scores[answerObj.type]++;
      }
    });
    
    // Find highest score
    let highestType = "visionary";
    let highestScore = scores.visionary;
    
    Object.entries(scores).forEach(([type, score]) => {
      if (score > highestScore) {
        highestType = type;
        highestScore = score;
      }
    });
    
    return highestType;
  };
  
  const handleRestart = () => {
    setQuizState({
      currentStep: 0,
      answers: {},
      isComplete: false,
      result: null,
    });
  };
  
  const handleGenerateRoadmap = () => {
    if (quizState.result) {
      // Store the entrepreneur type in local storage to use it in the journey
      localStorage.setItem('entrepreneurType', quizState.result);
      
      // Navigate to the Journey page
      navigate('/journey');
      
      // Show a toast notification
      toast({
        title: "Entrepreneur Type Saved",
        description: "We'll use this to customize your business journey.",
      });
    }
  };
  
  const renderStep = () => {
    // Start screen (step 0)
    if (quizState.currentStep === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="h3 mb-4">Find Your Entrepreneur Type</h2>
          <p className="text-muted-foreground mb-6">
            Take this quick 5-question quiz to discover your entrepreneurial strengths and
            ideal business type. It only takes 2 minutes!
          </p>
          <Button 
            size="lg"
            onClick={handleStart}
            className="px-8"
          >
            Start Quiz
          </Button>
        </motion.div>
      );
    }
    
    // Results screen
    if (quizState.isComplete && quizState.result) {
      const typeData = entrepreneurTypes[quizState.result];
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-accent/20 shadow-md">
            <CardHeader className="bg-accent/10 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-center">
                You are: {typeData.title}
              </CardTitle>
              <CardDescription className="text-center text-accent pt-1">
                Your Entrepreneur Personality
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 px-6">
              <p className="text-muted-foreground mb-4">
                {typeData.description}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Your Strengths:</h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.strengths.map((strength, i) => (
                    <span 
                      key={i} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Ideal Business Types:</h4>
                <p>{typeData.idealBusiness}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={handleRestart}>
                Retake Quiz
              </Button>
              <Button onClick={handleGenerateRoadmap}>
                Generate Personalized Roadmap
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    }
    
    // Loading screen
    if (isLoading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Analyzing your answers...</p>
        </motion.div>
      );
    }
    
    // Questions (steps 1-5)
    const currentQuestion = quizQuestions[quizState.currentStep - 1];
    
    if (!currentQuestion) return null;
    
    return (
      <motion.div
        key={quizState.currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-6">
          {currentQuestion.question}
        </h3>
        
        <RadioGroup className="gap-3">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center"
            >
              <div 
                className="border rounded-lg p-4 w-full cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
                onClick={() => handleAnswer(option.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{option.text}</div>
                  <RadioGroupItem value={option.id} id={option.id} className="cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </motion.div>
    );
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        {quizState.currentStep > 0 && quizState.currentStep <= totalSteps && (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Question {quizState.currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default EntrepreneurQuiz;
