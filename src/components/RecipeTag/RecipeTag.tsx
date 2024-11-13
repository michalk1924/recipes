"use client"

import React from 'react';
import styles from './RecipeTag.module.css';
import { Recipe } from "@/types";
import { FaRegStar, FaStar  } from "react-icons/fa";


interface RecipeTagProps {
    recipe: Recipe;
    showRecipePopup: (recipe: Recipe) => void;
    updateFavorites: (recipe_id: string) => void;
}

const RecipeTag: React.FC<RecipeTagProps> = ({ recipe, showRecipePopup, updateFavorites }) => {
    return (
        <div className={styles.recipeTag}>

            <img src={recipe.image_url} alt={recipe.name} className={styles.recipeImage} />
            <p onClick={() => showRecipePopup(recipe)} className={styles.recipeTitle}>{recipe.name}</p>


            <div className={styles.recipeDetails}>
                <h2 className={styles.recipeTitle}>{recipe.name}</h2>
                <p className={styles.ingredients}><strong>Ingredients:</strong> {recipe.ingredients}</p>
            </div>
            <button className={styles.readMoreButton} onClick={() => showRecipePopup(recipe)}>Read more</button>
            
            <button onClick={() => updateFavorites(recipe._id)}>
                {recipe.is_favorite && <span><FaStar className={styles.yellowIcon}/></span>}
                {!recipe.is_favorite && <span><FaRegStar className={styles.yellowIcon}/></span>}
            </button>
        </div>
    );
};

export default RecipeTag;
