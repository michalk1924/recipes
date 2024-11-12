import { create } from 'zustand';
import { Category } from '@/types';
import categoriesService from '@/services/categories';

interface CategoryOptions {
  categories: Category[];
  initializeCategories: () => Promise<void>;
}

const useCategoryOptions = create<CategoryOptions>((set) => {
  const store = {
    categories: [],

    // Initialize categories by fetching data from the service
    initializeCategories: async () => {
      try {
        const data = await categoriesService.getAllCategories();
        set({ categories: data });
      } catch (error) {
        console.error(error);
        set({ categories: [] });
      }
    }
  };

  // Run `initializeCategories` immediately after store creation
  store.initializeCategories();

  return store;
});

export default useCategoryOptions;
