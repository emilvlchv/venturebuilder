
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Lock, User, Eye, FileText, Server } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  const lastUpdated = "May 15, 2023";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-8">
            <section className="bg-secondary/30 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Commitment to Privacy</h2>
                  <p className="text-muted-foreground">
                    At VentureWayfinder, we take your privacy seriously. We understand the importance 
                    of protecting your personal information and are committed to being transparent about 
                    our data practices. This privacy policy explains how we collect, use, and safeguard 
                    your information when you use our platform.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    We collect different types of information to provide and improve our services to you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Personal Information:</strong> When you register, we collect your name, email address, 
                      and other details you provide in your profile.
                    </li>
                    <li>
                      <strong>Business Information:</strong> Details about your business ideas, projects, and goals 
                      that you share on our platform.
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Information about how you interact with our platform, including 
                      pages visited, features used, and time spent.
                    </li>
                    <li>
                      <strong>Payment Information:</strong> If you subscribe to our paid plans, we collect payment 
                      details through our secure payment processor.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-secondary/30 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Eye size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use your information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>To provide and maintain our services</li>
                    <li>To personalize your journey and learning experience</li>
                    <li>To process payments and manage subscriptions</li>
                    <li>To communicate with you about our services and updates</li>
                    <li>To improve our platform based on user feedback and usage patterns</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information 
                    from unauthorized access, alteration, disclosure, or destruction. We use industry-standard 
                    encryption for data transmission and secure servers for data storage. However, no method of 
                    transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee 
                    absolute security.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-secondary/30 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Server size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Data Retention and Storage</h2>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as necessary to fulfill the purposes 
                    outlined in this privacy policy, unless a longer retention period is required or permitted 
                    by law. Your data is stored on secure servers located within the European Union, in compliance 
                    with GDPR requirements.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    If you are a resident of the European Union, you have the following rights under the GDPR:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>The right to access and receive a copy of your personal data</li>
                    <li>The right to rectify or update your personal data</li>
                    <li>The right to erase your personal data (the "right to be forgotten")</li>
                    <li>The right to restrict processing of your personal data</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing of your personal data</li>
                    <li>Rights related to automated decision-making and profiling</li>
                  </ul>
                  <p className="mt-4 text-muted-foreground">
                    To exercise any of these rights, please contact us at privacy@venturewayfinder.com.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-6">
                If you have any questions about our Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@venturewayfinder.com" className="text-primary">privacy@venturewayfinder.com</a>
              </p>
              
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
