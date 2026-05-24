import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/categories/category.service";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
