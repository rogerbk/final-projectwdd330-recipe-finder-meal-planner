import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        mealPlanner: path.resolve(__dirname, 'src/meal-planner.html'),
        recipeSearch: path.resolve(__dirname, 'src/recipe-search.html'),
        shoppingList: path.resolve(__dirname, 'src/shopping-list.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    historyApiFallback: true,
  },
});
