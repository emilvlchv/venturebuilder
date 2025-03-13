
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeamMember from '@/components/about/TeamMember';
import { Building, Users, Award, Rocket } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Daria Lazarova",
      role: "Co-Founder & CEO",
      image: "https://media.licdn.com/dms/image/C4E03AQFzYhT4aTy5Hg/profile-displayphoto-shrink_800_800/0/1633446850168?e=1718582400&v=beta&t=b9jv7JW5Lr6n5P7_hXfCFxdU3aBk_HfhGhxhOBCgVTk",
      linkedin: "https://www.linkedin.com/in/daria-lazarova/",
      bio: "Daria combines her background in marketing and business development with a passion for empowering young entrepreneurs. Her expertise in growth strategies and market analysis helps users identify their best opportunities.",
      strengths: ["Strategic Vision", "Marketing Expertise", "Mentorship", "Business Development"]
    },
    {
      name: "Dimitrina Pashova",
      role: "Co-Founder & COO",
      image: "https://media.licdn.com/dms/image/C4D03AQGIKl_tRHO2gA/profile-displayphoto-shrink_800_800/0/1661955443477?e=1718582400&v=beta&t=2xPoPmbT--5-5WX_1UoLrvOl8m5TtqJNRCQs_iyLPtY",
      linkedin: "https://www.linkedin.com/in/dimitrina-pashova-5146961aa/",
      bio: "Dimitrina's organizational prowess and operational expertise ensure that VentureWayfinder runs smoothly. She developed our step-by-step journey framework based on her experience with startup operations and process optimization.",
      strengths: ["Operations Management", "Process Optimization", "Project Planning", "Team Leadership"]
    },
    {
      name: "Emil Valchev",
      role: "Co-Founder & CTO",
      image: "https://media.licdn.com/dms/image/C4E03AQFIHdYkbVS4MQ/profile-displayphoto-shrink_800_800/0/1624526355069?e=1718582400&v=beta&t=ZeKO-yZ81hBLCx81Z_8hwg1ZhiE4H7hHe_r-YPSfQyI",
      linkedin: "https://www.linkedin.com/in/emil-valchev/",
      bio: "Emil leads the technical vision for VentureWayfinder. His expertise in AI and software development powers our personalized journey feature, ensuring each user receives tailored guidance for their specific business idea.",
      strengths: ["AI Development", "Technical Architecture", "Software Engineering", "Innovation"]
    },
    {
      name: "Filip Andonov",
      role: "Co-Founder & CFO",
      image: "https://media.licdn.com/dms/image/C4D03AQHaxeN1xOWsWA/profile-displayphoto-shrink_800_800/0/1652175634204?e=1718582400&v=beta&t=RnIBSTkXK18i6r97Kcm_TBPCZAKcNjsG4Xh0rFhM1_4",
      linkedin: "https://www.linkedin.com/in/fandonov/",
      bio: "Filip's financial acumen and investment knowledge shaped the educational content on VentureWayfinder. He ensures that young entrepreneurs receive practical guidance on securing funding and managing finances effectively.",
      strengths: ["Financial Planning", "Investment Strategy", "Risk Management", "Business Modeling"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 animate-fade-in">
            <h1 className="h2 mb-6">Our Story</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              VentureWayfinder was born from a shared vision to democratize entrepreneurship and make the journey of building a business accessible to everyone, regardless of background or experience.
            </p>
          </div>

          {/* Origin Story */}
          <div className="max-w-4xl mx-auto mb-20 animate-fade-in delay-[50ms]">
            <h2 className="h3 mb-6 text-center">How It All Began</h2>
            <div className="bg-secondary/50 rounded-xl p-6 md:p-8 mb-8">
              <p className="mb-4">
                VentureWayfinder began in the summer of 2023 when our four founders met during an intensive startup accelerator program in Sofia, Bulgaria. Each coming from different backgrounds – marketing, operations, technology, and finance – they quickly recognized a common challenge they all faced in their entrepreneurial journeys: the overwhelming complexity of turning a business idea into reality.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 animate-fade-in delay-[100ms]">
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

          {/* Team Section */}
          <div className="max-w-5xl mx-auto animate-fade-in delay-[150ms]">
            <h2 className="h3 text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <TeamMember key={member.name} {...member} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
