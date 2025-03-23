
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateBusinessIdeas, IdeaInputs } from '@/utils/ideaGenerator';
import { CategorySelector } from './CategorySelector';
import { BusinessIdeaCard } from './BusinessIdeaCard';

// Define form schema with Zod
const formSchema = z.object({
  passions: z.array(z.string()).min(1, { message: "Select at least one passion" }),
  timePerWeek: z.number().min(1).max(40),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill" }),
});

type FormValues = z.infer<typeof formSchema>;

const BusinessIdeaGenerator = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passions: [],
      timePerWeek: 10,
      budget: "",
      skills: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsGenerating(true);
    setIsResultVisible(false);
    
    // Simulate API call delay
    setTimeout(() => {
      // Ensure all required fields are present before calling generateBusinessIdeas
      const inputValues: IdeaInputs = {
        passions: values.passions,
        timePerWeek: values.timePerWeek,
        budget: values.budget,
        skills: values.skills,
      };
      
      const generatedIdeas = generateBusinessIdeas(inputValues);
      setIdeas(generatedIdeas);
      setIsGenerating(false);
      setIsResultVisible(true);
    }, 1500);
  };

  const passionOptions = [
    { value: "tech", label: "Tech" },
    { value: "design", label: "Design" },
    { value: "fitness", label: "Fitness" },
    { value: "writing", label: "Writing" },
    { value: "education", label: "Education" },
    { value: "gaming", label: "Gaming" },
  ];

  const skillOptions = [
    { id: "creative", label: "Creative" },
    { id: "analytical", label: "Analytical" },
    { id: "people", label: "People" },
    { id: "technical", label: "Technical" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-primary mb-2">Business Idea Generator</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Answer a few simple questions about your interests and resources, and we'll generate
          custom business ideas tailored just for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>
                We'll use this information to suggest business ideas that match your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="passions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are you passionate about?</FormLabel>
                        <FormControl>
                          <CategorySelector
                            options={passionOptions}
                            selectedValues={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select as many as you'd like.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timePerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How much time can you dedicate per week?</FormLabel>
                        <div className="space-y-4">
                          <Slider 
                            min={0} 
                            max={40} 
                            step={1} 
                            value={[field.value]} 
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">0 hours</span>
                            <span className="text-sm font-medium">{field.value} hours</span>
                            <span className="text-sm text-muted-foreground">40 hours</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your startup budget?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">$0–$100</SelectItem>
                            <SelectItem value="medium">$100–$1000</SelectItem>
                            <SelectItem value="high">$1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What kind of skills do you want to use?</FormLabel>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {skillOptions.map((skill) => (
                            <FormItem 
                              key={skill.id} 
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(skill.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, skill.id]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== skill.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {skill.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating ideas...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Generate Business Ideas
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              isResultVisible ? "opacity-100" : "opacity-0",
              !isResultVisible && !isGenerating && "hidden lg:block"
            )}
          >
            {ideas.length === 0 && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Your ideas will appear here</h3>
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate Business Ideas" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4 h-full">
                <h3 className="text-xl font-semibold">Your Custom Business Ideas</h3>
                <div className="space-y-4">
                  {ideas.map((idea, index) => (
                    <BusinessIdeaCard 
                      key={index} 
                      idea={idea} 
                      className={cn(
                        "animate-fade-in",
                        index === 0 ? "animation-delay-0" : 
                        index === 1 ? "animation-delay-100" : 
                        "animation-delay-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIdeaGenerator;
