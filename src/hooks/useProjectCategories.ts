import { useState, useEffect, useCallback } from "react";
import { 
  getProjectCategories, 
  getProjectSubcategories,
  transformProjectCategoriesToOptions,
  transformProjectSubcategoriesToOptions
} from "@/services/api/projectCategories";
import { 
  ProjectCategoryOption, 
  ProjectSubcategoryOption,
  ProjectCategoriesResponse 
} from "@/dtos/projectCategories.dto";

interface UseProjectCategoriesReturn {
  categories: ProjectCategoryOption[];
  subcategories: ProjectSubcategoryOption[];
  loading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  refetchCategories: () => Promise<void>;
  refetchSubcategories: (categoryId: string) => Promise<void>;
}

export const useProjectCategories = (): UseProjectCategoriesReturn => {
  const [categories, setCategories] = useState<ProjectCategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<ProjectSubcategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // دریافت دسته‌بندی‌های اصلی
  const refetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 دریافت دسته‌بندی‌های پروژه...");
      const response: ProjectCategoriesResponse = await getProjectCategories();
      
      const transformedCategories = transformProjectCategoriesToOptions(response);
      setCategories(transformedCategories);
      
      console.log("✅ دسته‌بندی‌های پروژه با موفقیت دریافت شد:", transformedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در دریافت دسته‌بندی‌ها";
      setError(errorMessage);
      console.error("❌ خطا در دریافت دسته‌بندی‌های پروژه:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // دریافت زیردسته‌بندی‌ها
  const refetchSubcategories = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 دریافت زیردسته‌بندی‌های دسته ${categoryId}...`);
      const response = await getProjectSubcategories(parseInt(categoryId));
      
      const transformedSubcategories = transformProjectSubcategoriesToOptions(response);
      setSubcategories(transformedSubcategories);
      
      console.log(`✅ زیردسته‌بندی‌های دسته ${categoryId} با موفقیت دریافت شد:`, transformedSubcategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در دریافت زیردسته‌بندی‌ها";
      setError(errorMessage);
      console.error(`❌ خطا در دریافت زیردسته‌بندی‌های دسته ${categoryId}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // تغییر دسته‌بندی انتخاب شده
  const handleSetSelectedCategoryId = useCallback((id: string | null) => {
    setSelectedCategoryId(id);
    setSubcategories([]); // پاک کردن زیردسته‌بندی‌های قبلی
    
    if (id) {
      refetchSubcategories(id);
    }
  }, [refetchSubcategories]);

  // بارگذاری اولیه دسته‌بندی‌ها
  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  return {
    categories,
    subcategories,
    loading,
    error,
    selectedCategoryId,
    setSelectedCategoryId: handleSetSelectedCategoryId,
    refetchCategories,
    refetchSubcategories,
  };
};
