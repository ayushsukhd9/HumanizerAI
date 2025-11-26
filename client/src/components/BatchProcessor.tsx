import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Copy, Check, X } from "lucide-react";
import type { BatchHumanizeRequest } from "@shared/schema";

interface BatchProcessorProps {
  mode: "casual" | "professional" | "creative";
  tone?: number;
}

export function BatchProcessor({ mode, tone }: BatchProcessorProps) {
  const [inputs, setInputs] = useState<string[]>(["", "", ""]);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const batchMutation = useMutation({
    mutationFn: async (data: BatchHumanizeRequest) => {
      const response = await apiRequest<{ humanizedTexts: string[] }>(
        "POST",
        "/api/humanize/batch",
        data
      );
      return response;
    },
    onSuccess: (data) => {
      setOutputs(data.humanizedTexts);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Success!",
        description: `${data.humanizedTexts.length} texts humanized.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to humanize texts.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    if (inputs.length < 10) {
      setInputs([...inputs, ""]);
    }
  };

  const handleRemoveInput = (index: number) => {
    if (inputs.length > 1) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    }
  };

  const handleBatchHumanize = () => {
    const validTexts = inputs.filter((text) => text.trim());
    
    if (validTexts.length === 0) {
      toast({
        title: "No text to humanize",
        description: "Please enter at least one text block.",
        variant: "destructive",
      });
      return;
    }

    batchMutation.mutate({ texts: validTexts, mode, tone });
  };

  const handleCopy = async (index: number) => {
    try {
      await navigator.clipboard.writeText(outputs[index]);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Input Texts</h3>
          <Badge variant="secondary">{inputs.length} / 10 blocks</Badge>
        </div>

        {inputs.map((input, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Text block ${index + 1}...`}
                    className="min-h-[100px] resize-none"
                    data-testid={`textarea-batch-${index}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveInput(index)}
                  disabled={inputs.length === 1}
                  data-testid={`button-remove-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddInput}
            disabled={inputs.length >= 10}
            data-testid="button-add-block"
          >
            Add Text Block
          </Button>
          <Button
            onClick={handleBatchHumanize}
            disabled={batchMutation.isPending}
            data-testid="button-batch-humanize"
          >
            {batchMutation.isPending ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Humanize All
              </>
            )}
          </Button>
        </div>
      </div>

      {batchMutation.isPending && (
        <div className="space-y-4">
          <Progress value={50} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Processing {inputs.filter((t) => t.trim()).length} text blocks...
          </p>
        </div>
      )}

      {outputs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Humanized Results</h3>
          {outputs.map((output, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      Result {index + 1}
                    </Badge>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {output}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(index)}
                    data-testid={`button-copy-batch-${index}`}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
