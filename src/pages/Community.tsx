
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityCard from '@/components/community/CommunityCard';
import { Search, PlusCircle, UserPlus, ArrowRight, Users, CalendarClock } from 'lucide-react';
import Button from '@/components/shared/Button';

const Community = () => {
  // Mock data for discussions
  const discussions = [
    {
      type: 'discussion',
      title: "How did you validate your startup idea?",
      author: {
        name: "Alex Johnson",
        role: "Tech Entrepreneur"
      },
      date: "2 days ago",
      description: "I'm in the early stages of my startup and looking for effective ways to validate my idea before investing too much time and resources. What methods worked for you?",
      tags: ["Validation", "Market Research", "Startup"],
      engagement: {
        comments: 12
      }
    },
    {
      type: 'discussion',
      title: "Best tools for remote team management?",
      author: {
        name: "Sarah Williams",
        role: "Project Manager"
      },
      date: "5 days ago",
      description: "My startup team is fully remote, and I'm looking for recommendations on tools to improve our collaboration and productivity. What's working well for your teams?",
      tags: ["Remote Work", "Team Management", "Tools"],
      engagement: {
        comments: 8
      }
    },
    {
      type: 'success-story',
      title: "From Idea to 10,000 Users in 6 Months",
      author: {
        name: "Michael Chen",
        role: "Founder, TaskMaster"
      },
      date: "1 week ago",
      description: "I want to share my journey of how I took my productivity app from just an idea to 10,000 active users in just 6 months, with a bootstrap budget and no outside funding.",
      tags: ["Success Story", "Growth", "Bootstrapping"],
      engagement: {
        comments: 24
      }
    }
  ];
  
  // Mock data for upcoming events
  const events = [
    {
      type: 'event',
      title: "Startup Funding Masterclass",
      author: {
        name: "VentureWayfinder",
        role: "Official Event"
      },
      date: "May 15, 2023 • 1:00 PM EST",
      description: "Join us for a comprehensive workshop on securing funding for your startup. We'll cover everything from bootstrapping to venture capital.",
      tags: ["Funding", "Workshop", "Virtual"]
    },
    {
      type: 'event',
      title: "Networking Mixer for Young Entrepreneurs",
      author: {
        name: "VentureWayfinder",
        role: "Official Event"
      },
      date: "May 20, 2023 • 6:00 PM EST",
      description: "Connect with fellow entrepreneurs in a casual virtual setting. Share ideas, make connections, and find potential collaborators.",
      tags: ["Networking", "Virtual", "Community"]
    }
  ];
  
  // Mock data for mentors
  const mentors = [
    {
      type: 'mentor',
      title: "Marketing Strategy Consultant",
      author: {
        name: "David Wilson",
        role: "Marketing Director, GrowthCo"
      },
      date: "Available for 30-min sessions",
      description: "With 15+ years of experience in digital marketing and growth strategies for startups, I can help you develop an effective marketing plan for your business.",
      tags: ["Marketing", "Growth", "Strategy"]
    },
    {
      type: 'mentor',
      title: "Financial Planning for Startups",
      author: {
        name: "Lisa Rodriguez",
        role: "CFO, TechVentures"
      },
      date: "Available for 45-min sessions",
      description: "I specialize in helping early-stage startups manage their finances, create sustainable business models, and prepare for funding rounds.",
      tags: ["Finance", "Funding", "Planning"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Join Our Community</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Connect with fellow entrepreneurs, share insights, attend events, and learn from mentors who've been in your shoes.
            </p>
          </div>
          
          {/* Search and Create Post */}
          <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto animate-fade-in delay-[100ms]">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search discussions, events, and mentors..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
            <Button icon={<PlusCircle size={18} />}>
              Create Post
            </Button>
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="card p-5 text-center animate-fade-in delay-[150ms]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
                <Users size={24} />
              </div>
              <div className="text-3xl font-bold mb-1">2,458</div>
              <div className="text-muted-foreground">Community Members</div>
            </div>
            
            <div className="card p-5 text-center animate-fade-in delay-[200ms]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
                <MessageSquare size={24} />
              </div>
              <div className="text-3xl font-bold mb-1">857</div>
              <div className="text-muted-foreground">Active Discussions</div>
            </div>
            
            <div className="card p-5 text-center animate-fade-in delay-[250ms]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
                <CalendarClock size={24} />
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-muted-foreground">Upcoming Events</div>
            </div>
          </div>
          
          {/* Recent Discussions */}
          <div className="mb-12 animate-fade-in delay-[300ms]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Discussions</h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />} iconPosition="right">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {discussions.map((discussion, index) => (
                <CommunityCard key={index} {...discussion} />
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="mb-12 animate-fade-in delay-[350ms]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />} iconPosition="right">
                View Calendar
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <CommunityCard key={index} {...event} />
              ))}
            </div>
          </div>
          
          {/* Featured Mentors */}
          <div className="mb-12 animate-fade-in delay-[400ms]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured Mentors</h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />} iconPosition="right">
                Find Mentors
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor, index) => (
                <CommunityCard key={index} {...mentor} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" icon={<UserPlus size={18} />}>
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
