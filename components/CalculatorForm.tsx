"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CaffeineInputs } from "@/lib/calculateCaffeine";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  weight: z.coerce
    .number()
    .positive()
    .min(10, "Weight must be at least 10")
    .max(500, "Weight must be at most 500"),
  weightUnit: z.enum(["kg", "lb"]).default("kg"),
  hoursAwake: z.coerce
    .number()
    .nonnegative()
    .max(72, "Hours awake must be at most 72"),
  hoursToSurvive: z.coerce
    .number()
    .positive()
    .max(72, "Hours to survive must be at most 72"),
  tolerance: z.enum(["Low", "Moderate", "High"]),
});

type CalculatorFormProps = {
  onSubmit: (data: CaffeineInputs) => void;
};

export function CalculatorForm({ onSubmit }: CalculatorFormProps) {
  const [isKg, setIsKg] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 70,
      weightUnit: "kg",
      hoursAwake: 16,
      hoursToSurvive: 8,
      tolerance: "Moderate",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as CaffeineInputs);
  }

  function handleUnitToggle(checked: boolean) {
    const currentWeight = form.getValues("weight");
    const newUnit = checked ? "kg" : "lb";
    
    // Convert weight value when unit changes
    let newWeight = currentWeight;
    if (newUnit !== form.getValues("weightUnit")) {
      newWeight = newUnit === "kg" 
        ? Math.round(currentWeight * 0.453592) 
        : Math.round(currentWeight * 2.20462);
    }
    
    form.setValue("weightUnit", newUnit);
    form.setValue("weight", newWeight);
    setIsKg(checked);
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Calculate Your Caffeine Needs</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Weight</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">lb</span>
                    <Switch 
                      checked={isKg} 
                      onCheckedChange={handleUnitToggle} 
                      id="unit-toggle" 
                    />
                    <span className="text-sm">kg</span>
                  </div>
                </div>
                <FormDescription>
                  Your body weight affects how much caffeine you need.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hoursAwake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours Awake</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  How long you've been awake already (in hours).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hoursToSurvive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours to Survive</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  How long you need to stay awake (in hours).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caffeine Tolerance</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your caffeine tolerance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low (rarely consume caffeine)</SelectItem>
                    <SelectItem value="Moderate">Moderate (regular consumer)</SelectItem>
                    <SelectItem value="High">High (heavy consumer)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your regular caffeine consumption affects how much you need.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Calculate</Button>
        </form>
      </Form>
    </div>
  );
}
