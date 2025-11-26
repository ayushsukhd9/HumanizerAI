import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  MessageSquare,
  Briefcase,
  Wand2,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  History,
  Upload,
  Settings,
} from "lucide-react";
import type { HumanizeRequest, HumanizationHistory } from "@shared/schema";
import { HistorySidebar } from "@/components/HistorySidebar";
import { BatchProcessor } from "@/components/BatchProcessor";
import { ReadabilityScore } from "@/components/ReadabilityScore";
import { ThemeToggle } from "@/components/ThemeToggle";

type Mode = "casual" | "professional" | "creative";

export default function Tool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<Mode>("casual");
  const [tone, setTone] = useState(50);
  const [copied, setCopied] = useState(false);
  const [showReadability, setShowReadability] = useState(false);
  const { toast } = useToast();

  const humanizeMutation = useMutation({
    mutationFn: async (data: HumanizeRequest) => {
      const response = await apiRequest(
        "POST",
        "/api/humanize",
        data
      );
      const json = await response.json();
      console.log("Humanize API response:", json);
      return json;
    },
    onSuccess: (data) => {
      console.log("onSuccess data:", data);
      console.log("humanizedText from response:", data.humanizedText);
      setOutputText(data.humanizedText);
      setShowReadability(true);
      toast({
        title: "Success!",
        description: "Your text has been humanized.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to humanize text. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleHistorySelect = (item: HumanizationHistory) => {
    setInputText(item.originalText);
    setOutputText(item.humanizedText);
    setMode(item.mode as Mode);
    if (item.tone !== null && item.tone !== undefined) {
      setTone(item.tone);
    }
    setShowReadability(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      setInputText(text);
      toast({
        title: "File uploaded",
        description: "Your text has been loaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not read the file.",
        variant: "destructive",
      });
    }
  };

  const handleHumanize = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to humanize",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 5000) {
      toast({
        title: "Text too long",
        description: "Please keep your text under 5000 characters.",
        variant: "destructive",
      });
      return;
    }

    humanizeMutation.mutate({ text: inputText, mode, tone });
  };

  const handleCopy = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setShowReadability(false);
  };

  const charCount = inputText.length;
  const charLimit = 5000;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" data-testid="link-home">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Humanizer AI</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-history">
                  <History className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>History</SheetTitle>
                </SheetHeader>
                <HistorySidebar onSelect={handleHistorySelect} />
              </SheetContent>
            </Sheet>
            <span className="text-sm text-muted-foreground font-mono" data-testid="text-char-count">
              {charCount} / {charLimit}
            </span>
          </div>
        </div>
      </header>

      {/* Mode Selector & Controls */}
      <div className="border-b bg-card/30 px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Select writing style:</p>
            <div className="flex gap-2">
              <Button
                variant={mode === "casual" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("casual")}
                data-testid="button-mode-casual"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Casual
              </Button>
              <Button
                variant={mode === "professional" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("professional")}
                data-testid="button-mode-professional"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Professional
              </Button>
              <Button
                variant={mode === "creative" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("creative")}
                data-testid="button-mode-creative"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Creative
              </Button>
            </div>
          </div>

          {/* Tone Adjustment Slider */}
          <div className="flex items-center gap-4">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Casual Tone</span>
                <span>{tone}%</span>
                <span>Formal Tone</span>
              </div>
              <Slider
                value={[tone]}
                onValueChange={(value) => setTone(value[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
                data-testid="slider-tone"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6">
          <Tabs defaultValue="single" className="h-full flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="single" data-testid="tab-single">Single Text</TabsTrigger>
              <TabsTrigger value="batch" data-testid="tab-batch">Batch Processing</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Input Panel */}
                <Card className="flex flex-col h-[calc(100vh-20rem)] lg:h-auto">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-card-foreground">Original Text</h2>
                      <div className="flex gap-2">
                        <label htmlFor="file-upload">
                          <Button variant="ghost" size="icon" asChild data-testid="button-upload">
                            <span>
                              <Upload className="h-4 w-4" />
                            </span>
                          </Button>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".txt"
                          className="hidden"
                          onChange={handleFileUpload}
                          data-testid="input-file"
                        />
                        {inputText && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClear}
                            data-testid="button-clear"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your AI-generated text here or upload a .txt file..."
                      className="flex-1 resize-none text-base"
                      data-testid="textarea-input"
                    />
                    <div className="mt-4">
                      <Button
                        onClick={handleHumanize}
                        disabled={!inputText.trim() || humanizeMutation.isPending}
                        className="w-full"
                        data-testid="button-humanize"
                      >
                        {humanizeMutation.isPending ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                            Humanizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Humanize Text
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Output Panel */}
                <Card className="flex flex-col h-[calc(100vh-20rem)] lg:h-auto">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-card-foreground">Humanized Text</h2>
                      {outputText && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopy}
                          data-testid="button-copy"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {humanizeMutation.isPending && (
                      <div className="space-y-4">
                        <Progress value={66} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                          Humanizing your text...
                        </p>
                      </div>
                    )}

                    {!humanizeMutation.isPending && !outputText && (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground text-center">
                          Your humanized text will appear here
                        </p>
                      </div>
                    )}

                    {!humanizeMutation.isPending && outputText && (
                      <div className="flex-1 overflow-auto">
                        <p
                          className="text-base text-foreground leading-relaxed whitespace-pre-wrap"
                          data-testid="text-output"
                        >
                          {outputText}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Readability Score */}
              {showReadability && inputText && outputText && (
                <div className="mt-6">
                  <ReadabilityScore originalText={inputText} humanizedText={outputText} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="batch" className="flex-1 overflow-auto">
              <BatchProcessor mode={mode} tone={tone} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
