
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="bg-secondary/50 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
      <div className="mb-4 relative">
        <Avatar className="w-24 h-24 border-2 border-primary/20">
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
        {strengths.map((strength) => (
          <Badge key={strength} variant="secondary" className="text-xs">
            {strength}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TeamMember;
