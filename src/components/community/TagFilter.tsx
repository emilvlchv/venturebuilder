
import React from 'react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={selectedTag === null ? "default" : "outline"}
        onClick={() => onSelectTag(null)}
        size="sm"
      >
        All
      </Button>
      {tags.map((tag, index) => (
        <Button
          key={index}
          variant={selectedTag === tag ? "default" : "outline"}
          onClick={() => onSelectTag(tag)}
          size="sm"
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagFilter;
