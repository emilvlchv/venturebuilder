
export interface CommunityPost {
  id: number | string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
  content?: string;
  featured?: boolean;
}
