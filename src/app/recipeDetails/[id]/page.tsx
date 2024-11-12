"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "../recipeDetails.module.css";
import recipesService from "@/services/recipes";
import { Recipe } from "@/types";
import useCategoryOptions from '@/categoriesZustand'

const RecipeDetails: React.FC = () => {
    const pathname = usePathname();
    const id = pathname?.split("/").pop();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { categories } = useCategoryOptions();


    useEffect(() => {
        if (!id) return;

        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const recipeData = await recipesService.getRecipeById(id);
                setRecipe(recipeData.data);
                setLoading(false);
            } catch (err: any) {
                setError("Failed to fetch recipe.");
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    console.log(categories)
    const categoryName = categories.find((category) => category.category_id === recipe?.category)?.category_name || "Unknown Category";

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!recipe) return <p>No recipe found.</p>;

    

    return (
        <div className="centerContainer">
            <div className={styles.recipeDetails}>
                <div className={styles.recipeProfile}>
                    <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className={styles.recipeImage}
                    />
                    <div className={styles.recipeTitle}>
                        <h1 className={styles.recipeName}>{recipe.name}</h1>
                        <h2 className={styles.recipeCategory}>{categoryName}</h2>
                        <p className={styles.ingredients}>
                            <strong>Ingredients:</strong>
                            {recipe.ingredients.map((ingredient, index) => (
                                <span key={index}>
                                    <br />
                                    {ingredient}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
                <p className={styles.instructions}>
                    <strong>Instructions:</strong>
                    <br /> {recipe.instructions}{" "}
                </p>
            </div>
        </div>
    );
    
    
};

export default RecipeDetails;
