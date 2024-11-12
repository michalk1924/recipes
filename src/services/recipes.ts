import {http} from './http';
import { Recipe } from '@/types';

const recipesService = {
    async getAllRecipes(){
        try {
            const response = await http.get('/recipes');
            return response.data;
        } catch (error : any) {
            console.error(error);
        }
    },

    async getRecipeByCategory(categoryId : number){
        try {
            const response = await http.get(`/recipes?category=${categoryId}`);
            return response.data;
        } catch (error : any) {
            console.error(error);
        }
    },

    async getRecipeById(id: string){
        try {
            const response = await http.get(`/recipes/${id}`);
            return response.data;
        } catch (error : any) {
            console.error(error);
        }
    },

    async addRecipe(recipe: Recipe){
        try {
            const response = await http.post('/recipes', recipe);
            return response.data;
        } catch (error : any) {
            console.error(error);
        }
    },

    async updateRecipe(recipe_id: string, recipe: Recipe): Promise<any> {
        try {
            const response = await http.put(`/recipes/${recipe_id}`, recipe);
            return response.data;
        } catch (error: any) {
            console.error("Error updating recipe:", error);
            throw error;
        }
    }
    
}

export default recipesService;