
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeamMember from '@/components/about/TeamMember';
import { Building, Users, Award, Rocket } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Daria Lazarova",
      role: "Co-founder",
      image: "/lovable-uploads/4e9daaea-6b6d-4f93-9b88-36c9f40790b8.png",
      linkedin: "https://www.linkedin.com/in/daria-lazarova/",
      bio: "Daria combines her background in AI and business development with a passion for empowering young entrepreneurs. Her expertise in AI training and optimization helps create personalized guidance for users.",
      strengths: ["AI Guru", "Machine Learning", "User Experience", "Content Development"]
    },
    {
      name: "Filip Andonov",
      role: "Co-founder",
      image: "/lovable-uploads/e992d80e-c485-491a-90a1-e77c7f9a396d.png",
      linkedin: "https://www.linkedin.com/in/fandonov/",
      bio: "Filip's technological expertise and software development skills form the backbone of VentureWayfinder. He ensures our platform is robust, scalable, and delivers an exceptional user experience.",
      strengths: ["Tech Guru", "Software Engineering", "Architecture Design", "Systems Integration"]
    },
    {
      name: "Emil Valchev",
      role: "Co-founder",
      image: "/lovable-uploads/cae0f508-f4c9-45e7-ab61-8073354f43fa.png",
      linkedin: "https://www.linkedin.com/in/emil-valchev/",
      bio: "Emil leads marketing and business development strategies for VentureWayfinder. His expertise in growth strategies and market analysis helps users identify their best opportunities.",
      strengths: ["Marketing & Sales Guru", "Growth Strategy", "Business Development", "Market Analysis"]
    },
    {
      name: "Dimitrina Pashova",
      role: "Co-founder",
      image: "/lovable-uploads/5ca2a881-98be-484e-bdce-0e5588eeb74a.png",
      linkedin: "https://www.linkedin.com/in/dimitrina-pashova-5146961aa/",
      bio: "Dimitrina's product vision and organizational prowess ensure that VentureWayfinder meets the needs of aspiring entrepreneurs. She developed our step-by-step journey framework based on her product experience.",
      strengths: ["Product Guru", "UX Design", "Product Strategy", "User Research"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          {/* Team Section - Now First */}
          <div className="max-w-5xl mx-auto mb-20 animate-fade-in">
            <h1 className="h2 text-center mb-8">Our Founding Team</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mb-12">
              We're a passionate team of founders committed to democratizing entrepreneurship and making the journey of building a business accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <TeamMember key={member.name} {...member} />
              ))}
            </div>
          </div>

          {/* Origin Story */}
          <div className="max-w-4xl mx-auto mb-20 animate-fade-in delay-[50ms]">
            <h2 className="h3 mb-6 text-center">Our Story</h2>
            <div className="bg-secondary/50 rounded-xl p-6 md:p-8 mb-8">
              <p className="mb-4">
                VentureWayfinder began in the summer of 2023 when our four founders met during an intensive startup accelerator program in Sofia, Bulgaria. Each coming from different backgrounds – AI, technology, marketing, and product – they quickly recognized a common challenge they all faced in their entrepreneurial journeys: the overwhelming complexity of turning a business idea into reality.
              </p>
              <p className="mb-4">
                During late-night brainstorming sessions and countless cups of coffee, they realized that many young entrepreneurs abandon promising ideas simply because they don't know where to start or feel overwhelmed by the process. The team decided to combine their diverse expertise to create a platform that would guide aspiring entrepreneurs through their journey, step by step.
              </p>
              <p>
                After three months of development and testing with early users, VentureWayfinder was launched with a mission to empower the next generation of entrepreneurs by providing personalized guidance, educational resources, and community support – all in one accessible platform.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in delay-[100ms]">
            <div className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-muted-foreground">We believe entrepreneurship should be accessible to everyone. Our platform removes barriers and simplifies complex concepts into actionable steps.</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Building size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-muted-foreground">No entrepreneur should walk alone. We foster a supportive community where knowledge is shared and connections are made.</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Excellence</h3>
                <p className="text-muted-foreground">We're committed to providing high-quality, practical guidance based on real-world experience and current best practices.</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Rocket size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                <p className="text-muted-foreground">We continuously evolve our platform, incorporating new technologies and methodologies to best serve entrepreneurs in a changing world.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
