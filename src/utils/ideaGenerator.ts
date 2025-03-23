
import { v4 as uuidv4 } from 'uuid';

// Input types
type Passion = 'tech' | 'design' | 'fitness' | 'writing' | 'education' | 'gaming';
type Budget = 'low' | 'medium' | 'high';
type Skill = 'creative' | 'analytical' | 'people' | 'technical';

export interface IdeaInputs {
  passions: string[];
  timePerWeek: number;
  budget: string;
  skills: string[];
}

// Business idea interface
export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  passions: Passion[];
  budgetLevel: Budget;
  timeRequired: 'low' | 'medium' | 'high';
  skillsNeeded: Skill[];
}

// Database of business ideas
const businessIdeasDB: BusinessIdea[] = [
  {
    id: uuidv4(),
    title: "Freelance Web Developer",
    description: "Build websites and applications for small businesses and startups.",
    tags: ["Tech-based", "Remote-friendly", "Scalable"],
    passions: ["tech"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["technical", "analytical"]
  },
  {
    id: uuidv4(),
    title: "Online Fitness Coach",
    description: "Create personalized workout plans and provide virtual coaching sessions.",
    tags: ["Health-focused", "Subscription model", "Digital product"],
    passions: ["fitness"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["people", "analytical"]
  },
  {
    id: uuidv4(),
    title: "UX/UI Design Consultant",
    description: "Help companies improve their user experience and interface design.",
    tags: ["Creative", "Service-based", "B2B"],
    passions: ["design", "tech"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["creative", "analytical"]
  },
  {
    id: uuidv4(),
    title: "Content Creator & Copywriter",
    description: "Produce engaging content for blogs, social media, and marketing materials.",
    tags: ["Low startup cost", "Flexible hours", "Portfolio-based"],
    passions: ["writing"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["creative"]
  },
  {
    id: uuidv4(),
    title: "Online Course Creator",
    description: "Develop and sell educational courses based on your expertise.",
    tags: ["Passive income", "Knowledge sharing", "Evergreen"],
    passions: ["education"],
    budgetLevel: "medium",
    timeRequired: "high",
    skillsNeeded: ["analytical", "creative"]
  },
  {
    id: uuidv4(),
    title: "Indie Game Developer",
    description: "Create and publish your own games for mobile or desktop platforms.",
    tags: ["Tech-intensive", "Creative outlet", "Digital product"],
    passions: ["gaming", "tech"],
    budgetLevel: "medium",
    timeRequired: "high",
    skillsNeeded: ["creative", "technical"]
  },
  {
    id: uuidv4(),
    title: "Social Media Management",
    description: "Handle social media accounts and strategy for small businesses.",
    tags: ["Low barrier to entry", "Recurring income", "Remote work"],
    passions: ["writing", "design"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["people", "creative"]
  },
  {
    id: uuidv4(),
    title: "Mobile App Development Studio",
    description: "Create mobile applications for businesses or direct-to-consumer apps.",
    tags: ["Tech-focused", "Scalable", "High earning potential"],
    passions: ["tech"],
    budgetLevel: "high",
    timeRequired: "high",
    skillsNeeded: ["technical", "analytical"]
  },
  {
    id: uuidv4(),
    title: "Virtual Fitness Challenges Platform",
    description: "Create an online platform for hosting fitness challenges and competitions.",
    tags: ["Community-based", "Subscription model", "Health-tech"],
    passions: ["fitness", "tech"],
    budgetLevel: "medium",
    timeRequired: "high",
    skillsNeeded: ["technical", "people"]
  },
  {
    id: uuidv4(),
    title: "Educational YouTube Channel",
    description: "Create educational content and monetize through ads, sponsors, and merchandise.",
    tags: ["Content creation", "Passive income", "Low startup cost"],
    passions: ["education", "writing"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["creative", "analytical"]
  },
  {
    id: uuidv4(),
    title: "Gaming Community Platform",
    description: "Build a community for gamers with forums, events, and exclusive content.",
    tags: ["Community-driven", "Membership model", "Engagement-focused"],
    passions: ["gaming"],
    budgetLevel: "medium",
    timeRequired: "high",
    skillsNeeded: ["people", "creative"]
  },
  {
    id: uuidv4(),
    title: "Digital Product Marketplace",
    description: "Create and sell digital products like templates, fonts, or graphics.",
    tags: ["Passive income", "Creative output", "Scalable"],
    passions: ["design"],
    budgetLevel: "medium",
    timeRequired: "medium",
    skillsNeeded: ["creative", "technical"]
  },
  {
    id: uuidv4(),
    title: "Fitness Equipment Reviewer",
    description: "Create reviews of fitness equipment and earn through affiliate marketing.",
    tags: ["Low startup cost", "Affiliate revenue", "Content-based"],
    passions: ["fitness", "writing"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["analytical", "creative"]
  },
  {
    id: uuidv4(),
    title: "Tech Tutorial Blog",
    description: "Write tutorials on programming, design, or other tech topics.",
    tags: ["Educational", "Monetizable content", "Authority building"],
    passions: ["tech", "writing", "education"],
    budgetLevel: "low",
    timeRequired: "medium",
    skillsNeeded: ["technical", "creative"]
  },
  {
    id: uuidv4(),
    title: "Virtual Interior Design Service",
    description: "Offer interior design services remotely using 3D modeling software.",
    tags: ["Creative service", "Digital delivery", "Portfolio-based"],
    passions: ["design"],
    budgetLevel: "medium",
    timeRequired: "medium",
    skillsNeeded: ["creative", "technical"]
  }
];

// Utility function to map time per week to category
const categorizeTime = (timePerWeek: number): 'low' | 'medium' | 'high' => {
  if (timePerWeek < 10) return 'low';
  if (timePerWeek < 25) return 'medium';
  return 'high';
};

// Function to filter and score ideas based on user inputs
export const generateBusinessIdeas = (inputs: IdeaInputs): BusinessIdea[] => {
  const timeCategory = categorizeTime(inputs.timePerWeek);
  
  // Filter ideas that match at least one passion
  const filteredIdeas = businessIdeasDB.filter(idea => {
    // Must match at least one passion
    const hasMatchingPassion = idea.passions.some(passion => 
      inputs.passions.includes(passion)
    );
    
    // Must match budget level
    const budgetMatch = inputs.budget === idea.budgetLevel;
    
    // Must match at least one skill
    const hasMatchingSkill = idea.skillsNeeded.some(skill => 
      inputs.skills.includes(skill)
    );
    
    // Time requirement should be appropriate
    const timeMatch = timeCategory === idea.timeRequired || 
                      (timeCategory === 'high' && idea.timeRequired !== 'high');
    
    return hasMatchingPassion && (budgetMatch || hasMatchingSkill || timeMatch);
  });
  
  // Score the filtered ideas
  const scoredIdeas = filteredIdeas.map(idea => {
    let score = 0;
    
    // Passion matches
    idea.passions.forEach(passion => {
      if (inputs.passions.includes(passion)) score += 2;
    });
    
    // Budget match
    if (inputs.budget === idea.budgetLevel) score += 3;
    
    // Skills match
    idea.skillsNeeded.forEach(skill => {
      if (inputs.skills.includes(skill)) score += 2;
    });
    
    // Time match
    if (timeCategory === idea.timeRequired) score += 3;
    
    return { idea, score };
  });
  
  // Sort by score and return top 3
  return scoredIdeas
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.idea);
};
