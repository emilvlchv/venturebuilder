
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
import { Loader2, Lightbulb } from 'lucide-react';
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
    <div className="h-full flex flex-col">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
        <Lightbulb size={16} className="mr-2" />
        Find Your Perfect Business Idea
      </div>
      <h2 className="h3 mb-4">Business Idea Generator</h2>
      <p className="text-muted-foreground mb-6">
        Tell us about your interests, skills, and resources to get
        personalized business ideas that match your profile.
      </p>

      <Card className="flex-grow">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="timePerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time per week</FormLabel>
                      <div className="space-y-2">
                        <Slider 
                          min={0} 
                          max={40} 
                          step={1} 
                          value={[field.value]} 
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">0h</span>
                          <span className="font-medium">{field.value}h</span>
                          <span className="text-muted-foreground">40h</span>
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
                      <FormLabel>Startup budget</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a budget" />
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
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills you want to use</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
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
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Business Ideas
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {isResultVisible && ideas.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Your Ideas</h3>
              <div className="space-y-3">
                {ideas.map((idea, index) => (
                  <BusinessIdeaCard 
                    key={index} 
                    idea={idea} 
                    className="animate-fade-in"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessIdeaGenerator;
