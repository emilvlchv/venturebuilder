
import React from 'react';
import { User, MessageSquare, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunityCardProps {
  type: 'discussion' | 'event' | 'mentor' | 'success-story';
  title: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  date: string;
  description: string;
  tags?: string[];
  engagement?: {
    comments?: number;
    likes?: number;
  };
  className?: string;
}

const CommunityCard = ({
  type,
  title,
  author,
  date,
  description,
  tags = [],
  engagement,
  className,
}: CommunityCardProps) => {
  
  const cardStyles = cn(
    "card p-5 hover:shadow-md transition-all",
    className
  );
  
  const getTypeLabel = () => {
    switch (type) {
      case 'discussion': return 'Discussion';
      case 'event': return 'Event';
      case 'mentor': return 'Mentor';
      case 'success-story': return 'Success Story';
      default: return 'Post';
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'discussion': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'mentor': return 'bg-green-100 text-green-800';
      case 'success-story': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cardStyles}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {author.avatar ? (
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium">{author.name}</div>
            {author.role && (
              <div className="text-xs text-muted-foreground">{author.role}</div>
            )}
          </div>
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          getTypeColor()
        )}>
          {getTypeLabel()}
        </span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
        <div className="flex items-center">
          <CalendarDays size={14} className="mr-1" />
          {date}
        </div>
        
        {engagement && engagement.comments !== undefined && (
          <div className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            {engagement.comments} comment{engagement.comments !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
