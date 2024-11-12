"use client"

import React from 'react';
import styles from './RecipeTag.module.css';
import { Recipe } from "@/types";

interface RecipeTagProps {
    recipe: Recipe;
    showRecipePopup: (recipe: Recipe) => void;
}

const RecipeTag: React.FC<RecipeTagProps> = ({ recipe, showRecipePopup }) => {
    return (
        <div className={styles.recipeTag}>

            <img src={recipe.image_url} alt={recipe.name} className={styles.recipeImage} />
            <p onClick={() => showRecipePopup(recipe)} className={styles.recipeTitle}>{recipe.name}</p>


           {/*  <div className={styles.recipeDetails}>
                <h2 className={styles.recipeTitle}>{recipe.name}</h2>
                <p className={styles.ingredients}><strong>Ingredients:</strong> {recipe.ingredients}</p>
            </div> */}
{/*             <button onClick={() => showRecipePopup(recipe)}>View Recipe</button>
 */}   
      </div>
    );
};

export default RecipeTag;
