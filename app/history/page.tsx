"use client";

import { useEffect, useState } from "react";
import { getCalculationHistory } from "@/lib/calculateCaffeine";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart4, PieChart, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HistoryVisualization } from "@/components/HistoryVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  // Function to delete an entry from history
  const deleteHistoryEntry = (id: number) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    localStorage.setItem(
      "caffeineCalculationHistory",
      JSON.stringify(updatedHistory)
    );
    setHistory(updatedHistory);
  };

  // Function to clear all history
  const clearAllHistory = () => {
    localStorage.removeItem("caffeineCalculationHistory");
    setHistory([]);
  };

  useEffect(() => {
    setIsClient(true);
    setHistory(getCalculationHistory());
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">
                Calculation History
              </h1>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={history.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your calculation history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllHistory}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Tabs for different views */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* List View */}
            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>History Entries</CardTitle>
                  <CardDescription>
                    Your recent caffeine calculations and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">
                              Caffeine
                            </TableHead>
                            <TableHead className="w-[80px]"></TableHead>
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
                                  {entry.result.safetyWarning && (
                                    <div className="text-xs text-destructive mt-1">
                                      Warning
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Entry
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this
                                          history entry? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            deleteHistoryEntry(entry.id)
                                          }
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <p className="mb-4">No calculation history yet</p>
                      <Link href="/">
                        <Button>Make Your First Calculation</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charts View */}
            <TabsContent value="charts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Caffeine Intake Visualizations</CardTitle>
                  <CardDescription>
                    Visual representation of your caffeine intake history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <div className="space-y-8">
                      <HistoryVisualization history={history} type="pie" />
                      <HistoryVisualization history={history} type="bar" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <p className="mb-4">
                        No data available for visualization
                      </p>
                      <Link href="/">
                        <Button>Make Your First Calculation</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends View */}
            <TabsContent value="trends" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Caffeine Intake Trends</CardTitle>
                  <CardDescription>
                    Track changes in your caffeine consumption over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length > 1 ? (
                    <HistoryVisualization history={history} type="line" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <p className="mb-4">
                        Need at least 2 calculations to show trends
                      </p>
                      <Link href="/">
                        <Button>Make More Calculations</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
