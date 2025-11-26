import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { HumanizationHistory } from "@shared/schema";

interface HistorySidebarProps {
  onSelect: (item: HumanizationHistory) => void;
}

export function HistorySidebar({ onSelect }: HistorySidebarProps) {
  const { data: history, isLoading } = useQuery<HumanizationHistory[]>({
    queryKey: ["/api/history"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/history/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="p-6 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No history yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="group relative p-3 rounded-lg border bg-card hover-elevate cursor-pointer"
            onClick={() => onSelect(item)}
            data-testid={`history-item-${item.id}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {item.mode}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(item.id);
                }}
                data-testid={`button-delete-${item.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.originalText}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
