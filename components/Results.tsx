"use client";

import { useState } from "react";
import { CaffeineResult } from "@/lib/calculateCaffeine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ResultsProps = {
  result: CaffeineResult;
};

export function Results({ result }: ResultsProps) {
  const [selectedSource, setSelectedSource] = useState(result.sources[0]);
  const [showMetric, setShowMetric] = useState(true); // Default to metric (Indian standard)

  // Calculate safety level for progress bar
  const safetyPercentage = Math.min(100, (result.totalMg / 400) * 100);

  // Format serving size to prevent overflow
  const formatServingSize = (size: string) => {
    return size.replace('brewed', '').replace('(Monster)', '');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Your Caffeine Recommendation</span>
            <span className="text-3xl font-bold">{result.totalMg} mg</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {result.breakdown}
          </div>

          {result.safetyWarning && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{result.safetyWarning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Safety Level</span>
              <span
                className={
                  safetyPercentage > 75
                    ? "text-destructive"
                    : safetyPercentage > 50
                    ? "text-amber-500"
                    : "text-emerald-500"
                }
              >
                {safetyPercentage > 100
                  ? "Excessive"
                  : safetyPercentage > 75
                  ? "High"
                  : safetyPercentage > 50
                  ? "Moderate"
                  : "Safe"}
              </span>
            </div>
            <Progress
              value={safetyPercentage}
              className={
                safetyPercentage > 75
                  ? "bg-destructive/20"
                  : safetyPercentage > 50
                  ? "bg-amber-500/20"
                  : "bg-emerald-500/20"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Caffeine Sources</span>
            <div className="flex items-center space-x-2">
              <Switch 
                id="metric-switch" 
                checked={showMetric} 
                onCheckedChange={setShowMetric}
              />
              <Label htmlFor="metric-switch" className="text-sm font-normal">
                {showMetric ? "Metric (ml)" : "Imperial (oz)"}
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="selected">Your Selection</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((source) => (
                  <Button
                    key={source.name}
                    variant={
                      selectedSource.name === source.name
                        ? "default"
                        : "outline"
                    }
                    className="h-auto py-3 justify-start w-full"
                    onClick={() => setSelectedSource(source)}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium">{source.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {formatServingSize(
                          showMetric && source.servingSizeMetric 
                            ? source.servingSizeMetric 
                            : source.servingSize
                        )} - {source.caffeinePerServing} mg
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="selected">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-xl font-bold">
                      {selectedSource.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {showMetric && selectedSource.servingSizeMetric 
                        ? selectedSource.servingSizeMetric 
                        : selectedSource.servingSize} - {" "}
                      {selectedSource.caffeinePerServing} mg per serving
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Servings needed:</span>
                      <span className="text-2xl font-bold">
                        {selectedSource.servingsNeeded}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground mt-2">
                      Total caffeine:{" "}
                      {selectedSource.servingsNeeded *
                        selectedSource.caffeinePerServing}{" "}
                      mg
                      {selectedSource.servingsNeeded *
                        selectedSource.caffeinePerServing >
                        result.totalMg && (
                        <span className="text-amber-500 ml-2">
                          (Exceeds recommendation by{" "}
                          {selectedSource.servingsNeeded *
                            selectedSource.caffeinePerServing -
                            result.totalMg}{" "}
                          mg)
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          const servingSize = showMetric && selectedSource.servingSizeMetric 
            ? selectedSource.servingSizeMetric 
            : selectedSource.servingSize;
            
          const dataStr = `
Caffeine Survival Calculation
===========================
Total Required: ${result.totalMg} mg
${result.breakdown}

Recommended Source:
${selectedSource.servingsNeeded} servings of ${selectedSource.name} (${servingSize})
Total: ${selectedSource.servingsNeeded * selectedSource.caffeinePerServing} mg

${result.safetyWarning ? `WARNING: ${result.safetyWarning}` : ""}
          `.trim();

          // Create downloadable text file
          const element = document.createElement("a");
          const file = new Blob([dataStr], { type: "text/plain" });
          element.href = URL.createObjectURL(file);
          element.download = "caffeine-calculation.txt";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
      >
        Export Results
      </Button>
    </div>
  );
}
