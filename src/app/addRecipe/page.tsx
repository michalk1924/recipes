"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Categories from "@/components/Categories/Categories";
import React, { useState } from 'react';
import styles from './addRecipe.module.css'

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    image_url: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
    instructions: z.string().min(1, "Instructions are required"),
});
type FormFields = z.infer<typeof schema>;

export default function AddRecipe() {
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
        try {
    
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    category: category,
                    ingredients: ingredients.filter(ingredient => ingredient.trim() !== ""), // מסנן מצרכים ריקים
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit the recipe');
            }
    
            const result = await response.json();
            console.log('Recipe added:', result);
    
            reset();
            setIngredients([""]);
            setCategory(0);
        } catch (error) {
            console.error('Error:', error);
        } finally {
        }
    };


    // const onSubmit: SubmitHandler<FormFields> = async (data) => {
    //     const formData = {
    //         ...data,
    //         category,
    //         ingredients,
    //     };
    //     //To Do: A call to a function that will add the created object into the database
        
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     console.log(formData); 
    //     reset();
    //     setIngredients([""]);
    // };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div>
                    <input {...register("name")} type="text" placeholder="Name" className={styles.input} />
                    {errors.name && (
                        <div className={styles.error}>{errors.name.message}</div>
                    )}
                </div>
                <div>
                    <input {...register("image_url")} type="text" placeholder="Image URL" className={styles.input}  />
                    {errors.image_url && (
                        <div className={styles.error}>{errors.image_url.message}</div>
                    )}
                </div>
                <div>
                    <input {...register("instructions")} type="text" placeholder="Instructions" className={styles.input}/>
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
    );
}
