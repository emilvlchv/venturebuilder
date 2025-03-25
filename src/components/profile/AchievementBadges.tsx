
import React from 'react';
import { Award, Star, TrendingUp, Lightbulb, Clock, Users, Target, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'business' | 'learning' | 'engagement' | 'milestone';
  color: string;
};

export function AchievementBadges() {
  const { user } = useAuth();
  
  // In a real application, this would come from the user's data
  // For now, we'll use some sample badges
  const badges: Badge[] = [
    {
      id: 'first-idea',
      name: 'Ideator',
      description: 'Created your first business idea',
      icon: <Lightbulb />,
      unlocked: Boolean(user?.businessIdea),
      category: 'business',
      color: 'bg-yellow-500'
    },
    {
      id: 'journey-start',
      name: 'First Steps',
      description: 'Started your entrepreneurial journey',
      icon: <TrendingUp />,
      unlocked: true,
      category: 'milestone',
      color: 'bg-blue-500'
    },
    {
      id: 'complete-research',
      name: 'Market Researcher',
      description: 'Completed the market research phase',
      icon: <Target />,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      category: 'business',
      color: 'bg-purple-500'
    },
    {
      id: 'edu-starter',
      name: 'Knowledge Seeker',
      description: 'Completed 5 educational resources',
      icon: <BookOpen />,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      category: 'learning',
      color: 'bg-green-500'
    },
    {
      id: 'community-joiner',
      name: 'Networker',
      description: 'Connected with 3 other entrepreneurs',
      icon: <Users />,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      category: 'engagement',
      color: 'bg-pink-500'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'One of the first 100 platform users',
      icon: <Clock />,
      unlocked: true,
      category: 'milestone',
      color: 'bg-orange-500'
    },
    {
      id: 'milestone-1',
      name: 'Rising Star',
      description: 'Completed 25% of your journey',
      icon: <Star />,
      unlocked: false,
      progress: 15,
      maxProgress: 100,
      category: 'milestone',
      color: 'bg-yellow-500'
    },
    {
      id: 'milestone-2',
      name: 'Entrepreneur',
      description: 'Completed 50% of your journey',
      icon: <Award />,
      unlocked: false,
      progress: 15,
      maxProgress: 100,
      category: 'milestone',
      color: 'bg-blue-500'
    }
  ];

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'business', name: 'Business' },
    { id: 'learning', name: 'Learning' },
    { id: 'engagement', name: 'Community' },
    { id: 'milestone', name: 'Milestones' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Achievements & Badges</h2>
        <div className="text-sm font-medium">
          <span className="text-primary">{unlockedBadges.length}</span>
          <span className="text-muted-foreground">/{badges.length} Unlocked</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === category.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <TooltipProvider>
          {filteredBadges.map(badge => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <Card className={`relative overflow-hidden transition-all ${
                  badge.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-70'
                }`}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-white mb-2 mt-1`}>
                      {badge.icon}
                    </div>
                    <h3 className="font-medium text-sm">{badge.name}</h3>
                    {!badge.unlocked && badge.progress !== undefined && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.progress}/{badge.maxProgress}
                      </div>
                    )}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <div className="rounded-full border-2 border-muted p-1">
                          <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs">{badge.description}</p>
                {!badge.unlocked && badge.progress !== undefined && (
                  <p className="text-xs mt-1">Progress: {badge.progress}/{badge.maxProgress}</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Achievement statistics */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{unlockedBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{badges.length - unlockedBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Locked</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {badges.filter(b => b.category === 'milestone' && b.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Milestones</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
