"use client"

import React from 'react'
import { Recipe } from '@/types';
import useCategoryOptions from '@/categoriesZustand';
import { useRouter } from 'next/navigation';
import styles from './RecipePopup.module.css';
import { FaRegStar, FaStar } from "react-icons/fa";


interface RecipePopupProps {
  recipe: Recipe;
  updateFavorites: (recipe_id: string) => void;
}

const RecipePopup: React.FC<RecipePopupProps> = ({ recipe, updateFavorites }) => {

  const router = useRouter();
  const { categories } = useCategoryOptions();
  const categoryName = categories.find((category) => category.category_id === recipe.category)?.category_name || "Unknown Category";
  const shortInstructions = recipe.instructions.substring(0, 100) + '...';

  const readMore = () => {
    router.push(`/recipeDetails/${recipe._id}`);
  };

  return (
    <div className={styles.recipePopup}>
      <img src={recipe.image_url} alt={recipe.name} className={styles.recipeImage} />
      <div className={styles.recipeContent}>
        <h1 className={styles.recipeName}>{recipe.name}</h1>
        <h2 className={styles.recipeCategory}>{categoryName}</h2>
        <p className={styles.recipeDescription}>{shortInstructions}</p>
        <button onClick={readMore} className={styles.readMoreButton}>Read more</button>
        <button onClick={() => updateFavorites(recipe._id)}>
          {recipe.is_favorite && <span><FaStar className={styles.yellowIcon} /></span>}
          {!recipe.is_favorite && <span><FaRegStar className={styles.yellowIcon} /></span>}
        </button>
      </div>
    </div>
  )
}

export default RecipePopup