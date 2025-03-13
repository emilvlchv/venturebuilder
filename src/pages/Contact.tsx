
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real application, this would send the form data to a backend
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you shortly.",
    });
    form.reset();
  }

  const handleCallClick = () => {
    window.location.href = "tel:+359898445579";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="h2 mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Have questions about VentureWayfinder or need assistance with your entrepreneurial journey? 
              Our team is here to help you turn your business ideas into reality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* About Our Business */}
            <div className="animate-fade-in delay-[50ms]">
              <Card>
                <CardHeader>
                  <CardTitle>About VentureWayfinder</CardTitle>
                  <CardDescription>Your guide to entrepreneurial success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    VentureWayfinder was founded by a team of entrepreneurs who understand the challenges of starting a business. 
                    Our platform combines AI-powered guidance with expert knowledge to provide a structured journey that takes you 
                    from idea to successful business launch.
                  </p>
                  <p>
                    We believe that entrepreneurship should be accessible to everyone. That's why we've created a comprehensive 
                    platform that guides you through every step of the process, from idea validation to marketing, legal considerations, 
                    and business plan generation.
                  </p>
                  <p>
                    Our mission is to empower the next generation of entrepreneurs with the tools, knowledge, and community 
                    support they need to succeed. No matter where you are in your entrepreneurial journey, VentureWayfinder is 
                    here to guide you.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href="mailto:hello@venturewayfinder.com" className="text-sm text-muted-foreground hover:text-primary">
                          hello@venturewayfinder.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a href="tel:+359898445579" className="text-sm text-muted-foreground hover:text-primary">
                          +359 898 445 579
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Sofia, Bulgaria
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Support</p>
                        <p className="text-sm text-muted-foreground">
                          24/7 AI assistance
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <Button
                  onClick={handleCallClick}
                  className="w-full py-6"
                  size="lg"
                >
                  <Phone className="mr-2 h-5 w-5" /> Call Us Now: +359 898 445 579
                </Button>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="animate-fade-in delay-[100ms]">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What is this regarding?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto animate-fade-in delay-[150ms]">
            <h2 className="h3 text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">How does VentureWayfinder work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>VentureWayfinder uses AI to create a personalized business journey based on your specific ideas and goals. After an initial conversation to understand your business concept, we provide step-by-step guidance through each phase of building your business.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Do I need business experience?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Not at all! VentureWayfinder is designed for entrepreneurs at all levels, including complete beginners. Our platform breaks down complex business concepts into simple, actionable steps that anyone can follow.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What's included in the subscription?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Depending on your subscription level, you'll get access to personalized journey creation, AI-powered business guidance, educational resources, and our community of fellow entrepreneurs. Premium subscribers also receive additional features like custom video content.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Can I cancel my subscription?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Yes, you can cancel your subscription at any time. We offer a 7-day free trial for new users to experience our platform before committing to a subscription plan.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
