// // spoonacular.js
// const axios = require('axios');
// // const { Recipe } = require("../types");
// const recipesService = require("./recipes");

// interface Recipe {
//     _id: string;
//    name: string;
//    category: number;
//    image_url: string;
//    ingredients: string[];
//    instructions: string;
//    is_favorite: boolean;
// }

// const API_KEY = '1b514f2b82454f67adcd23328cfd3b5e';

// const BASE_URL = 'https://api.spoonacular.com/recipes';

// const loadData = async () => {
//     try {
//       // שליחת בקשה ל-API
//       const response = await axios.get(`${BASE_URL}/random`, {
//         params: {
//           apiKey: API_KEY,
//           number: 5, // מספר המתכונים שאתה רוצה למשוך
//         },
//       });
  
//       // שמירה בנתונים
//       const data = await response.data;
  
//       const recipes: Recipe[] = data.recipes.map((recipe: any) => ({
//         _id: recipe.id.toString(),
//         name: recipe.title,
//         category: 1,
//         image_url: recipe.image,
//         ingredients: recipe.extendedIngredients.map((ingredient: any) => ingredient.name),
//         instructions: recipe.instructions || 'No instructions available',
//         is_favorite: false,
//       }));
      
  
//       // שליחת המתכונים לשרת
//       for (const recipe of recipes) {
//         await recipesService.addRecipe(recipe);
//       }
  
//       console.log('Recipes fetched and sent to server:', recipes);
//     } catch (err: any) {
//       console.error('Error fetching recipes:', err.message);
//     }
//   };
  

// loadData();