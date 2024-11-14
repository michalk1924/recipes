"use client"

import React, { useEffect, useState, useCallback } from 'react';
import recipesService from '@/services/recipes';
import { Recipe } from "@/types";
import RecipeTag from "@/components/RecipeTag/RecipeTag";
import Categories from "@/components/Categories/Categories";
import styles from './Recipes.module.css';
import RecipePopup from '@/components/RecipePopup/RecipePopup';
import { ONEMINUTE, PAGESIZE } from '@/app/lib/consts';
import { getFromStorage, saveToStorage } from '@/app/lib/storage';
import { useRouter } from 'next/navigation';

export default function Recipes() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filterInput, setFilterInput] = useState<string>('');
  const [category, setCategory] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRecipePopup, setShowRecipePopup] = useState<boolean>(false);
  const [recipePopupDetails, setRecipePopupDetails] = useState<Recipe>();
  const [showFavoritesRecipes, setShowFavoritesRecipes] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const savedTimefromStorage = getFromStorage(`savedTime`);
        const favoriteRecipeIds = getFromStorage(`favoriteRecipes`);

        if (savedTimefromStorage) {
          const storedTime = parseInt(savedTimefromStorage, 10);
          const currentTime = Date.now();
          if (currentTime - storedTime > ONEMINUTE) {
            await getRecipesFromServer();
          }
          else {
            const data = getFromStorage(`recipes`);
            const dataWithFavorites = data.map((recipe:Recipe) => ({
              ...recipe,
              is_favorite: favoriteRecipeIds.includes(recipe._id), 
            }));
            setRecipes(dataWithFavorites);
          }
        } else {
          await getRecipesFromServer();
        }
      } catch (err) {
        console.error(err);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRecipesFromServer = async () => {
    if (!hasMore) return;
    const newRecipes = await recipesService.getAllRecipes(page);
    let favoriteRecipeIds = getFromStorage(`favoriteRecipes`);

    if(!favoriteRecipeIds) favoriteRecipeIds = [];

    saveToStorage(`favoriteRecipes`, favoriteRecipeIds);

    if (newRecipes.length === 0) {
      setHasMore(false);
      return;
    }

    let data = [...recipes, ...newRecipes];

    const dataWithFavorites = data.map((recipe:Recipe) => ({
      ...recipe,
      is_favorite: favoriteRecipeIds.includes(recipe._id), 
    }));

    setRecipes(dataWithFavorites);

    const isHasMore = newRecipes.length === PAGESIZE;

    setHasMore(isHasMore);
    saveToStorage(`recipes`, data);
    saveToStorage(`savedTime`, Date.now().toString());
  };

  useEffect(() => {
    if (page > 1) {
      try {
        getRecipesFromServer();
      }
      catch (err) {
        console.error(err);
      }
    }
  }, [page]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 && hasMore && !isLoading) {
      if (recipes.length % PAGESIZE === 0) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [isLoading, hasMore, recipes]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const favoriteRecipeIds = getFromStorage(`favoriteRecipes`);

    let data: Recipe[] = recipes;
  
    if (showFavoritesRecipes) {
      data = data.filter((r: Recipe) => favoriteRecipeIds.includes(r._id));
    }
  
    if (category) {
      data = data.filter((r: Recipe) => r.category === category);
    }
  
    data = data.filter(r => r.name.toLowerCase().includes(filterInput.toLowerCase()));
  
    setFilteredRecipes(data);
  }, [recipes, showFavoritesRecipes, filterInput, category]);
  
  const showRecipePopupF = (recipe: Recipe) => {
    setRecipePopupDetails(recipe);
    setShowRecipePopup(true);
  };

  const updateFavorites = async (recipe_id:string) => {
    
    try {

      let favoriteRecipes = getFromStorage('favoriteRecipes') || '[]';
      
      if (favoriteRecipes.includes(recipe_id)) {
        favoriteRecipes = favoriteRecipes.filter((id: string) => id !== recipe_id);
      } else {
        favoriteRecipes.push(recipe_id);
      }

      saveToStorage('favoriteRecipes', favoriteRecipes);

      setRecipes(recipes => recipes.map(r =>
        r._id === recipe_id ? { ...r, is_favorite: !r.is_favorite } : r
      ));

      if(recipePopupDetails?._id == recipe_id){
        const updatedRecipe = {...recipePopupDetails , is_favorite : !recipePopupDetails.is_favorite};
        setRecipePopupDetails(updatedRecipe)
      }

    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  const addRecipe = () => {
    router.push(`/add_recipe/`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <Categories setCategory={setCategory} />
        <input
          type="text"
          placeholder="Search..."
          value={filterInput}
          onChange={e => setFilterInput(e.target.value)}
          className={styles.searchInput}
        />
      <div>
        <button className={styles.addRecipeButton} onClick={addRecipe} >Add Recipe</button>
      </div>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => setShowFavoritesRecipes(!showFavoritesRecipes)}
          className={`${styles.filterButton} ${!showFavoritesRecipes ? styles.active : ''}`}
        >
          All Recipes
        </button>
        <button
          onClick={() => setShowFavoritesRecipes(!showFavoritesRecipes)}
          className={`${styles.filterButton} ${showFavoritesRecipes ? styles.active : ''}`}
        >
          Favorites
        </button>
      </div>

      {!isLoading && (
        <div className={styles.recipesGrid}>
          {filteredRecipes.map(recipe => (
            <RecipeTag
              key={recipe._id}
              showRecipePopup={showRecipePopupF}
              recipe={recipe}
              updateFavorites={updateFavorites}
            />
          ))}
        </div>
      )}

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {showRecipePopup && recipePopupDetails && (
        <RecipePopup recipe={recipePopupDetails} updateFavorites={updateFavorites} />
      )}
    </div>
  );
}
