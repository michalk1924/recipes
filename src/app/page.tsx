"use client"

import React, { useEffect, useState } from 'react';
import recipesService from '@/services/recipes';
import { Recipe } from "@/types";
import RecipeTag from "@/components/RecipeTag/RecipeTag";
import Categories from "@/components/Categories/Categories";
import styles from './home.module.css';
import RecipePopup from '@/components/RecipePopup/RecipePopup';

export default function Home() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filterInput, setFilterInput] = useState<string>('');
  const [category, setCategory] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRecipePopup, setShowRecipePopup] = useState<boolean>(false);
  const [recipePopupDetails, setRecipePopupDetails] = useState<Recipe>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category) {
          const data = await recipesService.getRecipeByCategory(category);
          setRecipes(data);
        }
        else {
          const data = await recipesService.getAllRecipes();
          setRecipes(data);
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
    fetchData();
  }, [category]);

  useEffect(() => {
    const filterData = async () => {
      if (filterInput) {
        setFilteredRecipes(recipes.filter(r => r.name.toLocaleLowerCase()
        .includes(filterInput.toLocaleLowerCase())));
      }
      else {
        setFilteredRecipes(recipes);
      }
    }
    filterData();
  }, [recipes, filterInput]);

  const showRecipePopupF = (recipe : Recipe) =>{
    setRecipePopupDetails(recipe);
    setShowRecipePopup(true);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipe Book</h1>
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
      {isLoading && <div>Loading...</div>}
      {showRecipePopup && recipePopupDetails && <RecipePopup recipe={recipePopupDetails} />}
    </div>
  );
  

}


//filter
//paging
//pop
//favories
//gitgnore

//r-add
//y-byid
