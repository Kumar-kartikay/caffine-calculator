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

export function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

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
        <Button variant="outline" className="w-full">View History</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Calculation History</SheetTitle>
          <SheetDescription>
            Your recent caffeine calculations
          </SheetDescription>
        </SheetHeader>

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
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {date.toLocaleDateString()} <br />
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">Weight:</span>
                            <span className="text-xs">
                              {entry.inputs.weight} {entry.inputs.weightUnit}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">Awake:</span>
                            <span className="text-xs">
                              {entry.inputs.hoursAwake}h
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">Survive:</span>
                            <span className="text-xs">
                              {entry.inputs.hoursToSurvive}h
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">Tolerance:</span>
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
      </SheetContent>
    </Sheet>
  );
}
