"use client"

import React, { useEffect, useState } from 'react';
import recipesService from '@/services/recipes';
import { Recipe } from "@/types";
import RecipeTag from "@/components/RecipeTag/RecipeTag";
import Categories from "@/components/Categories/Categories";
import styles from './Recipes.module.css';
import RecipePopup from '@/components/RecipePopup/RecipePopup';
import { ONEMINUTE } from '@/app/lib/consts';
import { getFromStorage, saveToStorage } from '@/app/lib/storage';

export default function Recipes() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filterInput, setFilterInput] = useState<string>('');
  const [category, setCategory] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRecipePopup, setShowRecipePopup] = useState<boolean>(false);
  const [recipePopupDetails, setRecipePopupDetails] = useState<Recipe>();
  const [showFavoritesRecipes, setShowFavoritesRecipes] = useState<boolean>(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const savedTimefromStorage = getFromStorage(`savedTime`);
        if (savedTimefromStorage) {
          const storedTime = parseInt(savedTimefromStorage, 10);
          const currentTime = Date.now();
          if (currentTime - storedTime > ONEMINUTE) {
            getRecipesFromServer();
          }
          else {
            let data;
            data = getFromStorage(`recipes`);
            if (category) {
              data = data.filter((r: Recipe) => r.category === category);
            }
            setRecipes(data);
          }
        }
        else {
          getRecipesFromServer();
        }
      }
      catch (err) {
        console.error(err);
        setRecipes([]);
      }
      finally {
        setIsLoading(false);
      }
    }

    const getRecipesFromServer = async () => {
      let data;
      data = await recipesService.getAllRecipes();
      if (category) {
        data = data.filter(data.filter((r: Recipe) => r.category === category));
      }
      saveToStorage(`recipes`, data);
      saveToStorage(`savedTime`, Date.now().toString());
      setRecipes(data);
    }

    fetchData();

  }, []);


  useEffect(() => {
    let data: Recipe[];
    data = showFavoritesRecipes ? recipes.filter((r: Recipe) => r?.is_favorite) : recipes;
    if (category) {
      data = data.filter((r: Recipe) => r.category === category);
    }
    data = data.filter(r => r.name.toLocaleLowerCase()
      .includes(filterInput.toLocaleLowerCase()));
    setFilteredRecipes(data);
  }, [recipes, showFavoritesRecipes, filterInput, category]);

  const showRecipePopupF = (recipe: Recipe) => {
    setRecipePopupDetails(recipe);
    setShowRecipePopup(true);
  }

  const updateFavorites = (recipe_id: string) => {
    try {
      const recipe = recipes.find(r => r._id === recipe_id);
      if (recipe) {
        recipe.is_favorite = !recipe.is_favorite;
        setRecipes(recipes => recipes.map(r => r._id !== recipe_id ? r : recipe));
        saveToStorage(`recipes`, recipes);
        recipesService.updateRecipe(recipe_id, recipe);
      }
      else {
        console.error("Recipe not found in the list.");
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  return (

    <div className={styles.container}>
      <h1 className={styles.title}>Recipes</h1>
      <div className={styles.topSection}>
        <Categories  setCategory={setCategory} />
        <input
          type="text"
          placeholder="Search..."
          value={filterInput}
          onChange={e => setFilterInput(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {!isLoading && (
        <div className={styles.recipesGrid}>
          {filteredRecipes.map(recipe => (
            <RecipeTag key={recipe._id} showRecipePopup={showRecipePopupF} recipe={recipe} />
          ))}
        </div>
      )}
      
      <button onClick={() => { showFavoritesRecipes ? setShowFavoritesRecipes(false) : {} }}>
        all
      </button>

      <button onClick={() => { !showFavoritesRecipes ? setShowFavoritesRecipes(true) : {} }}>
        favorites
      </button>
      
      {isLoading && <div>Loading...</div>}
      {showRecipePopup && recipePopupDetails && <RecipePopup recipe={recipePopupDetails} />}
      
    </div>
  );

}


//paging
//favories
//gitgnore

//r-add
