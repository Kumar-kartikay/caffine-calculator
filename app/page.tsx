"use client";

import { useState } from "react";
import {
  CaffeineInputs,
  CaffeineResult,
  calculateCaffeine,
  saveCalculationToHistory,
} from "@/lib/calculateCaffeine";
import { CalculatorForm } from "@/components/CalculatorForm";
import { Results } from "@/components/Results";
import { History } from "@/components/History";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, CupSoda, Coffee, BatteryFull } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const [results, setResults] = useState<CaffeineResult | null>(null);
  const { theme, setTheme } = useTheme();

  const handleCalculate = (inputs: CaffeineInputs) => {
    const result = calculateCaffeine(inputs);
    setResults(result);
    saveCalculationToHistory(inputs, result);
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CupSoda className="h-6 w-6" />
            <span className="font-bold">Caffeine Survival Calculator</span>
          </div>
          <div className="flex items-center gap-4">
            <History />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-muted/40 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Stay awake, stay alert
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  How much caffeine do you need?
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Calculate your ideal caffeine intake based on body weight,
                  sleep deprivation, and tolerance to stay alert when you need
                  it most.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="gap-1.5">
                  <Coffee className="h-5 w-5" />
                  Learn More
                </Button>
                <Button variant="outline">Safety Guidelines</Button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BatteryFull className="h-4 w-4" />
                  <span>Based on scientific research</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>FDA recommendations</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <CalculatorForm onSubmit={handleCalculate} />
            </div>
          </div>
        </div>
      </section>

      {/* Results section (conditionally rendered) */}
      {results && (
        <section className="container py-12 px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter mb-6">
            Your Results
          </h2>
          <Results result={results} />
        </section>
      )}

      {/* Features section */}
      <section className="container py-12 px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Coffee className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Various Sources</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Choose from coffee, energy drinks, tea, and more to get your ideal
              caffeine intake.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <BatteryFull className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Personalized</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Calculations based on your weight, tolerance, and sleep status for
              a customized recommendation.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CupSoda className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Safety Warnings</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Get alerts when your caffeine intake exceeds FDA recommended
              limits.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js 15 and Shadcn UI. For educational purposes only.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm">
              Terms of Service
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
