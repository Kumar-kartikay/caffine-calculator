"use client";

import { useEffect, useState } from "react";
import { getCalculationHistory } from "@/lib/calculateCaffeine";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Define the interface for history entries
interface HistoryEntry {
  id: number;
  timestamp: string;
  inputs: {
    weight: number;
    weightUnit: "kg" | "lb";
    hoursAwake: number;
    hoursToSurvive: number;
    tolerance: "Low" | "Moderate" | "High";
  };
  result: {
    totalMg: number;
    breakdown?: string;
    safetyWarning?: string;
  };
}

export function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    setIsClient(true);
    setHistory(getCalculationHistory());
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          View History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Calculation History</SheetTitle>
          <SheetDescription>Your recent caffeine calculations</SheetDescription>
        </SheetHeader>

        {selectedEntry ? (
          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEntry(null)}
              className="mb-2"
            >
              ← Back to history
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Calculation Details</span>
                  <span className="text-xl font-bold">
                    {selectedEntry.result.totalMg} mg
                  </span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {new Date(selectedEntry.timestamp).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-medium">Weight</div>
                    <div>
                      {selectedEntry.inputs.weight}{" "}
                      {selectedEntry.inputs.weightUnit}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Hours Awake</div>
                    <div>{selectedEntry.inputs.hoursAwake}h</div>
                  </div>
                  <div>
                    <div className="font-medium">Hours to Survive</div>
                    <div>{selectedEntry.inputs.hoursToSurvive}h</div>
                  </div>
                  <div>
                    <div className="font-medium">Tolerance</div>
                    <div>{selectedEntry.inputs.tolerance}</div>
                  </div>
                </div>

                {selectedEntry.result.breakdown && (
                  <div>
                    <div className="font-medium">Breakdown</div>
                    <div className="text-sm">
                      {selectedEntry.result.breakdown}
                    </div>
                  </div>
                )}

                {selectedEntry.result.safetyWarning && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      {selectedEntry.result.safetyWarning}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {history.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-10rem)] mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Caffeine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => {
                      const date = new Date(entry.timestamp);
                      return (
                        <TableRow
                          key={entry.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <TableCell className="font-medium">
                            {date.toLocaleDateString()} <br />
                            <span className="text-xs text-muted-foreground">
                              {date.toLocaleTimeString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">
                                  Weight:
                                </span>
                                <span className="text-xs">
                                  {entry.inputs.weight}{" "}
                                  {entry.inputs.weightUnit}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">
                                  Awake:
                                </span>
                                <span className="text-xs">
                                  {entry.inputs.hoursAwake}h
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">
                                  Survive:
                                </span>
                                <span className="text-xs">
                                  {entry.inputs.hoursToSurvive}h
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">
                                  Tolerance:
                                </span>
                                <span className="text-xs">
                                  {entry.inputs.tolerance}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                entry.result.totalMg > 1000
                                  ? "destructive"
                                  : entry.result.totalMg > 400
                                  ? "outline"
                                  : "default"
                              }
                            >
                              {entry.result.totalMg} mg
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No calculation history yet
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
