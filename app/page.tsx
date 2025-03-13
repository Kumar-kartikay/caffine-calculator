"use client";

import { useState, useRef, useEffect } from "react";
import {
  CaffeineInputs,
  CaffeineResult,
  calculateCaffeine,
  saveCalculationToHistory,
} from "@/lib/calculateCaffeine";
import { CalculatorForm } from "@/components/CalculatorForm";
import { Results } from "@/components/Results";
import { Button } from "@/components/ui/button";
import {
  MoonIcon,
  SunIcon,
  CupSoda,
  Coffee,
  BatteryFull,
  ArrowDown,
  History,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Home() {
  const [results, setResults] = useState<CaffeineResult | null>(null);
  const { theme, setTheme } = useTheme();
  const calculatorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Handle window resize to determine mobile vs desktop
  useEffect(() => {
    // Initialize window width on client side
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCalculate = (inputs: CaffeineInputs) => {
    const result = calculateCaffeine(inputs);
    setResults(result);
    saveCalculationToHistory(inputs, result);

    // Only scroll on mobile devices (when width is less than 1024px - lg breakpoint)
    if (windowWidth < 1024) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-screen-xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CupSoda className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-sm sm:text-base">
              Caffeine Survival Calculator
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* <Link href="/history"> */}
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              aria-label="View calculation history"
              onClick={() => router.push("/history")}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            {/* </Link> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-muted/40 py-14 md:py-20 lg:py-24 flex items-center justify-center">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Stay awake, stay alert
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              How much caffeine do you need?
            </h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              Calculate your ideal caffeine intake based on body weight, sleep
              deprivation, and tolerance to stay alert when you need it most.
            </p>

            <Button
              size="lg"
              className="mt-6 md:mt-8 gap-2 text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto mx-auto"
              onClick={scrollToCalculator}
            >
              <Coffee className="h-5 w-5" />
              Calculate Now
              <ArrowDown className="h-4 w-4 ml-1" />
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm mt-6 md:mt-8">
              <div className="flex items-center gap-1">
                <BatteryFull className="h-4 w-4" />
                <span>Based on scientific research</span>
              </div>
              <div className="flex items-center gap-1">
                <span>FDA recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator and Results combined section */}
      <section ref={calculatorRef} className="py-10 md:py-16 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Calculator Side */}
              <div className="bg-card rounded-xl p-5 md:p-6 border shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tighter mb-5 sm:mb-6 text-center lg:text-left">
                  Calculate Your Caffeine Needs
                </h2>
                <CalculatorForm onSubmit={handleCalculate} />
              </div>

              {/* Results Side (Conditionally Rendered) */}
              <div
                ref={resultsRef}
                className="bg-card rounded-xl p-5 md:p-6 border shadow-sm h-full"
              >
                {results ? (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tighter mb-5 sm:mb-6 text-center lg:text-left">
                      Your Results
                    </h2>
                    <div className="animate-in fade-in-50 duration-500">
                      <Results result={results} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-10 md:py-14 px-4 md:px-6 rounded-lg bg-muted/20 w-full">
                      <Coffee className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg md:text-xl font-medium mb-3">
                        Fill out the form
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground max-w-xs mx-auto">
                        Enter your details to calculate your ideal caffeine
                        intake
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">
            Scientifically Backed Features
          </h2>
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm h-full">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="rounded-full bg-primary/10 p-2.5 md:p-3">
                  <Coffee className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold">
                  Various Sources
                </h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Choose from coffee, energy drinks, tea, and more to get your
                ideal caffeine intake.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm h-full">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="rounded-full bg-primary/10 p-2.5 md:p-3">
                  <BatteryFull className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold">
                  Personalized
                </h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Calculations based on your weight, tolerance, and sleep status
                for a customized recommendation.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm h-full sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="rounded-full bg-primary/10 p-2.5 md:p-3">
                  <CupSoda className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold">
                  Safety Warnings
                </h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Get alerts when your caffeine intake exceeds FDA recommended
                limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 mt-auto">
        <div className="container max-w-screen-xl mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-xs sm:text-sm text-muted-foreground md:text-left">
            Built with Next.js 15 and Shadcn UI. For vibes only.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Terms of Service
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
