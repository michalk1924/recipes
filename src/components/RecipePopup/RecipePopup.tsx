"use client"

import React from 'react'
import { Recipe } from '@/types';
import useCategoryOptions from '@/categoriesZustand';
import { useRouter } from 'next/navigation';
import styles from './RecipePopup.module.css'

interface RecipePopupProps {
    recipe: Recipe;
  }
  
  const RecipePopup: React.FC<RecipePopupProps> = ({ recipe }) => {

    const router = useRouter();
    const { categories } = useCategoryOptions();
    const categoryName = categories.find((category) => category.category_id === recipe.category)?.category_name || "Unknown Category";
    const shortInstructions = recipe.instructions.substring(0, 100) + '...';

    const readMore = () => {
        router.push(`/recipeDetails/${recipe._id}`);
    };

    return (
        <div className={styles.recipePopup}>
        <img src={recipe.image_url} alt={recipe.name} />
        <h1>{recipe.name}</h1>
        <h2>{categoryName}</h2>
        <p>{shortInstructions}</p>
        <button onClick={readMore}>Read More</button>
      </div>
    )
}

export default RecipePopup