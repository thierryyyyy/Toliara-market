/**
 * Hook useToast pour les notifications
 * 
 * Usage:
 * ```tsx
 * import { useToast } from "@/hooks/use-toast";
 * 
 * function MyComponent() {
 *   const { addToast } = useToast();
 *   // ...
 * }
 * ```
 */
import { useToast as useActiveToast } from '@/components/ui/use-toast';;

export const useToast = () => useActiveToast();
