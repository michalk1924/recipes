"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Categories from "@/components/Categories/Categories";
import React, { useState } from 'react';

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
        const formData = {
            ...data,
            category,
            ingredients,
        };
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(formData); 
        reset();
        setIngredients([""]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div>
                    <input {...register("name")} type="text" placeholder="Name" />
                    {errors.name && (
                        <div className='error'>{errors.name.message}</div>
                    )}
                </div>
                <div>
                    <input {...register("image_url")} type="text" placeholder="Image URL" />
                    {errors.image_url && (
                        <div className='error'>{errors.image_url.message}</div>
                    )}
                </div>
                <div>
                    <input {...register("instructions")} type="text" placeholder="Instructions" />
                    {errors.instructions && (
                        <div className='error'>{errors.instructions.message}</div>
                    )}
                </div>
                <div>
                    <Categories setCategory={setCategory} />
                </div>
                <div>
                    <label>Ingredients:</label>
                    {ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                placeholder={`Ingredient ${index + 1}`}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddIngredient}>+</button>
                </div>
            </div>
            <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Submit"}
            </button>
        </form>
    );
}

