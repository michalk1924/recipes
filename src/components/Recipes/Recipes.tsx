"use client"

import React, { useEffect, useState } from 'react';
import recipesService from '@/services/recipes';
import { Recipe } from "@/types";
import RecipeTag from "@/components/RecipeTag/RecipeTag";
import Categories from "@/components/Categories/Categories";
// import styles from '../home.module.css';
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

  const showRecipePopupF = (recipe: Recipe) => {
    setRecipePopupDetails(recipe);
    setShowRecipePopup(true);
  }

  return (
    <div>
      <Categories setCategory={setCategory} />
      <input
        type="text"
        placeholder="Search..."
        value={filterInput}
        onChange={e => setFilterInput(e.target.value)} />
      {!isLoading && <div >
        {filteredRecipes
          .map(recipe => (
            <RecipeTag key={recipe._id} showRecipePopup={showRecipePopupF} recipe={recipe} />
          ))}
      </div>}
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
