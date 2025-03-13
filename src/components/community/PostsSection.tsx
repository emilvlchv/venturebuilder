
import React from 'react';
import CommunityCard from '@/components/community/CommunityCard';
import { CommunityPost } from '@/components/community/types';

interface PostsSectionProps {
  title: string;
  posts: CommunityPost[];
  layout?: 'grid' | 'list';
}

const PostsSection: React.FC<PostsSectionProps> = ({ 
  title, 
  posts, 
  layout = 'list'
}) => {
  const gridClass = layout === 'grid' 
    ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
    : "grid grid-cols-1 gap-6";

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className={gridClass}>
        {posts.map((post) => (
          <CommunityCard 
            key={post.id}
            type="discussion"
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
            likes={post.likes}
            comments={post.comments}
            tags={post.tags}
            image={post.image}
          />
        ))}
      </div>
    </>
  );
};

export default PostsSection;
