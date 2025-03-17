
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
    content: 'After six months of rejection, I finally landed my first investor. The key was listening to feedback and iterating my pitch deck. I realized my original value proposition wasn\'t clear enough, and my financial projections were too optimistic without proper backing. Once I addressed these issues and focused on traction, everything changed.',
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
    content: 'Content marketing, social media engagement, and community building were my go-to strategies. I wrote valuable content that addressed my target audience\'s pain points, engaged authentically on social platforms, and built a small but loyal community of early adopters who became my brand ambassadors.',
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
    content: 'I was heading down a path of building the "perfect" product with all the features I thought users would want. Six months in, I realized I was building something nobody asked for. Switching to an MVP approach, I built and released a basic version in just two weeks and got real user feedback that completely changed our direction.',
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
    content: 'I started by identifying the skills I lacked. Then, I attended industry meetups, hackathons, and entrepreneurship events. I met my technical co-founder at a local hackathon and my business co-founder through a mutual connection. The key was finding people with complementary skills but aligned values and vision.',
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
    content: 'Many founders overlook essential legal considerations: business structure (LLC vs Corporation), intellectual property protection, founder agreements, employee/contractor classifications, and regulatory compliance. These decisions have long-term implications for taxes, liability, and fundraising capabilities.',
    featured: false
  },
];
