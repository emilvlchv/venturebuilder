
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, Star, TrendingUp, Zap, Target, Users, BookOpen, Lightbulb } from 'lucide-react';

// Mock data - in a real app, this would come from your backend
const ACHIEVEMENTS = [
  {
    id: 'profile-complete',
    title: 'Profile Pioneer',
    description: 'Completed your entrepreneur profile',
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    earned: true,
    date: '2023-09-15',
  },
  {
    id: 'business-idea',
    title: 'Idea Innovator',
    description: 'Defined your business idea clearly',
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    earned: true,
    date: '2023-09-18',
  },
  {
    id: 'first-journey',
    title: 'Journey Starter',
    description: 'Started your entrepreneurial journey',
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    earned: true,
    date: '2023-09-20',
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Completed 10 tasks in your journey',
    icon: <Zap className="h-6 w-6 text-indigo-500" />,
    earned: false,
    progress: 60,
  },
  {
    id: 'validation-pro',
    title: 'Validation Pro',
    description: 'Completed the validation phase',
    icon: <Target className="h-6 w-6 text-red-500" />,
    earned: false,
    progress: 65,
  },
  {
    id: 'community-member',
    title: 'Community Contributor',
    description: 'Connected with 5 other entrepreneurs',
    icon: <Users className="h-6 w-6 text-purple-500" />,
    earned: false,
    progress: 40,
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Completed 5 educational resources',
    icon: <BookOpen className="h-6 w-6 text-teal-500" />,
    earned: false,
    progress: 80,
  },
  {
    id: 'first-milestone',
    title: 'Milestone Achiever',
    description: 'Reached your first business milestone',
    icon: <Award className="h-6 w-6 text-amber-500" />,
    earned: false,
    progress: 25,
  },
];

export default function AchievementBadges() {
  const { user } = useAuth();
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned);
  const inProgressAchievements = ACHIEVEMENTS.filter(a => !a.earned);

  return (
    <div className="space-y-8">
      {/* Achievement Summary */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-medium">Your Achievements</h3>
            <p className="text-muted-foreground">Track your entrepreneurial milestones</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <p className="text-3xl font-bold">{earnedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Earned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{inProgressAchievements.length}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{Math.round((earnedAchievements.length / ACHIEVEMENTS.length) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
      </div>

      {/* Earned Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Earned Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {earnedAchievements.map((achievement) => (
            <Card key={achievement.id} className="border-2 border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {achievement.icon}
                  </div>
                  <Badge variant="outline" className="bg-primary/10">Earned</Badge>
                </div>
                <CardTitle className="mt-2">{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{achievement.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Earned on {achievement.date}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* In Progress Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Badges In Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgressAchievements.map((achievement) => (
            <Card key={achievement.id} className="border border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="bg-muted p-2 rounded-full">
                    {achievement.icon}
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <CardTitle className="mt-2">{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{achievement.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Keep going to earn this badge!</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
