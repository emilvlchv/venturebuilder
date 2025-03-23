
// Quiz questions with options and entrepreneur type mappings
export const quizQuestions = [
  {
    question: "How do you make decisions?",
    options: [
      { 
        id: "1a", 
        text: "Based on intuition and vision", 
        type: "visionary" 
      },
      { 
        id: "1b", 
        text: "Through careful analysis and planning", 
        type: "operator" 
      },
      { 
        id: "1c", 
        text: "Quickly, ready to adapt as needed", 
        type: "hustler" 
      },
      { 
        id: "1d", 
        text: "Through innovative thinking and experimentation", 
        type: "creator" 
      }
    ]
  },
  {
    question: "What excites you most about starting a business?",
    options: [
      { 
        id: "2a", 
        text: "Creating innovative solutions that change the world", 
        type: "visionary" 
      },
      { 
        id: "2b", 
        text: "Building efficient systems and sustainable growth", 
        type: "operator" 
      },
      { 
        id: "2c", 
        text: "The thrill of closing deals and rapid growth", 
        type: "hustler" 
      },
      { 
        id: "2d", 
        text: "Expressing unique ideas and creating something beautiful", 
        type: "creator" 
      }
    ]
  },
  {
    question: "How do you feel about risk?",
    options: [
      { 
        id: "3a", 
        text: "Comfortable with big risks if the vision is compelling", 
        type: "visionary" 
      },
      { 
        id: "3b", 
        text: "Prefer calculated risks backed by data", 
        type: "operator" 
      },
      { 
        id: "3c", 
        text: "Embrace risk as part of the game", 
        type: "hustler" 
      },
      { 
        id: "3d", 
        text: "Take creative risks but seek feedback often", 
        type: "creator" 
      }
    ]
  },
  {
    question: "What's your ideal work style?",
    options: [
      { 
        id: "4a", 
        text: "Strategic planning and big-picture thinking", 
        type: "visionary" 
      },
      { 
        id: "4b", 
        text: "Structured, methodical, and process-oriented", 
        type: "operator" 
      },
      { 
        id: "4c", 
        text: "Fast-paced, dynamic, and results-driven", 
        type: "hustler" 
      },
      { 
        id: "4d", 
        text: "Creative, flexible, and intuitive", 
        type: "creator" 
      }
    ]
  },
  {
    question: "Which of these inspires you most?",
    options: [
      { 
        id: "5a", 
        text: "The future and its possibilities", 
        type: "visionary" 
      },
      { 
        id: "5b", 
        text: "A well-executed plan and predictable outcomes", 
        type: "operator" 
      },
      { 
        id: "5c", 
        text: "Achievements and visible success stories", 
        type: "hustler" 
      },
      { 
        id: "5d", 
        text: "Creative expression and innovation", 
        type: "creator" 
      }
    ]
  }
];

// Entrepreneur type definitions with descriptions and recommendations
export const entrepreneurTypes: Record<string, {
  title: string;
  description: string;
  strengths: string[];
  idealBusiness: string;
}> = {
  visionary: {
    title: "The Visionary",
    description: "You're a big-picture thinker who sees possibilities where others don't. You thrive when focused on future-oriented goals and inspire others with your clarity of vision.",
    strengths: ["Strategic Thinking", "Innovative", "Inspiring", "Forward-Thinking"],
    idealBusiness: "Tech startups, innovative products, transformative services, or consulting that requires conceptual thinking."
  },
  operator: {
    title: "The Operator",
    description: "You excel at creating systems, processes, and structure. Your methodical approach to problem-solving ensures sustainability and scalability in any business venture.",
    strengths: ["Organized", "Detail-Oriented", "Systematic", "Execution-Focused"],
    idealBusiness: "E-commerce businesses, service agencies, franchises, or operations-heavy businesses that benefit from optimization."
  },
  hustler: {
    title: "The Hustler",
    description: "Your high energy and action-oriented approach help you move quickly and adapt to changing conditions. You're naturally skilled at sales and creating momentum.",
    strengths: ["Persuasive", "Action-Oriented", "Resilient", "Driven"],
    idealBusiness: "Sales-focused ventures, personal brands, real estate, or fast-moving market businesses that reward decisive action."
  },
  creator: {
    title: "The Creator",
    description: "You thrive on innovation, self-expression, and bringing new ideas to life. Your ability to think differently gives you a unique advantage in creating distinctive products and services.",
    strengths: ["Creative", "Intuitive", "Expressive", "Design-Focused"],
    idealBusiness: "Content creation, coaching, product design, or artistic ventures that allow for creative expression."
  }
};
