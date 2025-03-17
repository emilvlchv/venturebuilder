
import { CommunityPost } from "@/components/community/types";

export const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: 1,
    title: 'How I Secured My First Investor',
    description: 'After months of pitching, I finally got my first yes! Here are the lessons I learned along the way...',
    author: {
      name: 'Alex Johnson',
      role: 'Founder'
    },
    date: '2 days ago',
    likes: 48,
    comments: 12,
    tags: ['Fundraising', 'Pitch Deck'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
    featured: false
  },
  {
    id: 2,
    title: 'Marketing on a Zero Budget',
    description: 'Discover how I grew my customer base without spending a dime on marketing...',
    author: {
      name: 'Sam Wilson',
      role: 'Marketing Lead'
    },
    date: '1 week ago',
    likes: 124,
    comments: 35,
    tags: ['Marketing', 'Bootstrapping'],
    featured: false
  },
  {
    id: 3,
    title: 'The MVP Mindset: Build Less, Learn More',
    description: 'Why building a minimal viable product saved my startup from failure...',
    author: {
      name: 'Taylor Smith',
      role: 'Product Manager'
    },
    date: '2 weeks ago',
    likes: 87,
    comments: 19,
    tags: ['Product Development', 'MVP'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2940&auto=format&fit=crop',
    featured: true
  },
  {
    id: 4,
    title: 'Finding Co-Founders: My Journey',
    description: 'The story of how I met my co-founders and built a successful team...',
    author: {
      name: 'Jordan Lee',
      role: 'Co-founder'
    },
    date: '3 weeks ago',
    likes: 63,
    comments: 22,
    tags: ['Team Building', 'Co-Founders'],
    featured: false
  },
  {
    id: 5,
    title: 'Legal Essentials for New Startups',
    description: 'A beginner\'s guide to the legal requirements when starting your business...',
    author: {
      name: 'Casey Morgan',
      role: 'Legal Advisor'
    },
    date: '1 month ago',
    likes: 105,
    comments: 41,
    tags: ['Legal', 'Business Formation'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop',
    featured: false
  },
];

