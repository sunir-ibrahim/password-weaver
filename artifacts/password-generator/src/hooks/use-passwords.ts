import { useGeneratePasswords as useApiGeneratePasswords } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useGeneratePasswords() {
  const { toast } = useToast();
  
  return useApiGeneratePasswords({
    mutation: {
      onError: (error) => {
        toast({
          title: "Analysis Failed",
          description: error.error || "An unexpected error occurred while analyzing passwords.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Analysis Complete",
          description: "We've generated strong, memorable alternatives based on your patterns.",
        });
      }
    }
  });
}
