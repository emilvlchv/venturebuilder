
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  bio: string;
  strengths: string[];
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  image,
  linkedin,
  bio,
  strengths
}) => {
  // Get initials for avatar fallback
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('');

  return (
    <Card className="bg-secondary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6 flex flex-col items-center text-center h-full">
        <div className="mb-4 relative">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <a 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
            aria-label={`${name}'s LinkedIn profile`}
          >
            <Linkedin size={16} />
          </a>
        </div>
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-primary text-sm mb-3">{role}</p>
        <p className="text-muted-foreground text-sm mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2 justify-center mt-auto">
          {strengths.map((strength, index) => (
            <Badge 
              key={index} 
              variant={index === 0 ? "default" : "secondary"} 
              className={`text-xs ${index === 0 ? "bg-primary" : ""}`}
            >
              {strength}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TeamMember;
