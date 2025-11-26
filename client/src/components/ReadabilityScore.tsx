import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ReadabilityScoreProps {
  originalText: string;
  humanizedText: string;
}

function calculateReadabilityMetrics(text: string) {
  if (!text.trim()) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      avgWordLength: 0,
      avgSentenceLength: 0,
      readabilityScore: 0,
    };
  }

  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  const avgSentenceLength = wordCount / sentenceCount;

  // Simple readability score (lower is better for readability)
  // Based on average word and sentence length
  const readabilityScore = Math.max(0, Math.min(100, 
    100 - (avgWordLength * 5 + avgSentenceLength * 2)
  ));

  return {
    wordCount,
    sentenceCount,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    readabilityScore: Math.round(readabilityScore),
  };
}

export function ReadabilityScore({ originalText, humanizedText }: ReadabilityScoreProps) {
  const original = calculateReadabilityMetrics(originalText);
  const humanized = calculateReadabilityMetrics(humanizedText);

  const scoreDiff = humanized.readabilityScore - original.readabilityScore;
  const getTrendIcon = () => {
    if (scoreDiff > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (scoreDiff < -5) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (!originalText || !humanizedText) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Readability Comparison</h3>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <Badge variant={scoreDiff > 0 ? "default" : "secondary"}>
                {scoreDiff > 0 ? "+" : ""}{scoreDiff} points
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Original</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Readability Score</span>
                    <span className="font-mono">{original.readabilityScore}</span>
                  </div>
                  <Progress value={original.readabilityScore} className="h-2" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words:</span>
                    <span className="font-mono">{original.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sentences:</span>
                    <span className="font-mono">{original.sentenceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg word length:</span>
                    <span className="font-mono">{original.avgWordLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words/sentence:</span>
                    <span className="font-mono">{original.avgSentenceLength}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Humanized</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Readability Score</span>
                    <span className="font-mono">{humanized.readabilityScore}</span>
                  </div>
                  <Progress value={humanized.readabilityScore} className="h-2" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words:</span>
                    <span className="font-mono">{humanized.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sentences:</span>
                    <span className="font-mono">{humanized.sentenceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg word length:</span>
                    <span className="font-mono">{humanized.avgWordLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words/sentence:</span>
                    <span className="font-mono">{humanized.avgSentenceLength}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
