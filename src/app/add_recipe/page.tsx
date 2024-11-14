"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Categories from "@/components/Categories/Categories";
import React, { useState } from 'react';
import styles from './addRecipe.module.css';
import { useRouter } from 'next/navigation';
import { TiHomeOutline } from "react-icons/ti";
import reccipeService from "@/services/recipes";
import { saveToStorage, getFromStorage } from "../lib/storage";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    image_url: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
    instructions: z.string().min(1, "Instructions are required"),
});
type FormFields = z.infer<typeof schema>;

export default function AddRecipe() {

    const router = useRouter();

    const [category, setCategory] = useState<number>(0);
    const [ingredients, setIngredients] = useState<string[]>([""]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const handleIngredientChange = (index: number, value: string) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // try {

        //     const response = await fetch('/api/recipes', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             ...data,
        //             category: category,
        //             ingredients: ingredients.filter(ingredient => ingredient.trim() !== ""),
        //         }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to submit the recipe');
        //     }

        //     const result = await response.json();
        //     console.log('Recipe added:', result);

        //     reset();
        //     setIngredients([""]);
        //     setCategory(0);

        // } catch (error) {
        //     console.error('Error:', error);
        // } finally {
        // }
        try {
            // יצירת האובייקט לפי מבנה הממשק Recipe
            const newRecipe = {
                name: data.name,
                category: category,
                image_url: data.image_url || "", // נניח שיש שדה `image_url` ב-FormFields, אחרת ערך ריק
                ingredients: ingredients.filter(ingredient => ingredient.trim() !== ""),
                instructions: data.instructions,
                is_favorite: false, // לדוגמה, מתחילים ב-false
            };

            console.log(newRecipe);

            const result = await reccipeService.addRecipe(newRecipe);

            console.log('Recipe added:', result);

            const recipes = getFromStorage("recipes");
            recipes.push(newRecipe);
            saveToStorage("recipes", recipes);

            reset();
            setIngredients([""]);
            setCategory(0);

            router.push(`../`);


        } catch (error) {
            console.error('Error:', error);
        }
    };

    const goHome = () => {
        router.push(`../`);
    };

    return (
        <div>

            <button onClick={goHome} ><TiHomeOutline className={styles.goHomeButton} /></button>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <input {...register("name")} type="text" placeholder="Name" className={styles.input} />
                        {errors.name && (
                            <div className={styles.error}>{errors.name.message}</div>
                        )}
                    </div>
                    <div>
                        <input {...register("image_url")} type="text" placeholder="Image URL" className={styles.input} />
                        {errors.image_url && (
                            <div className={styles.error}>{errors.image_url.message}</div>
                        )}
                    </div>
                    <div>
                        <input {...register("instructions")} type="text" placeholder="Instructions" className={styles.input} />
                        {errors.instructions && (
                            <div className={styles.error}>{errors.instructions.message}</div>
                        )}
                    </div>
                    <div>
                        <Categories setCategory={setCategory} />
                    </div>
                    <div>
                        <label className={styles.label}>Ingredients:</label>
                        {ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    placeholder={`Ingredient ${index + 1}`}
                                    className={styles.input}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddIngredient} className={styles.addButton}>+</button>
                    </div>
                </div>
                <button disabled={isSubmitting} type="submit" className={styles.submitButton}>
                    {isSubmitting ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

