import {http} from './http';
import { Category } from '@/types';

const categoriesService = {
    async getAllCategories(){
        try {
            const response = await http.get('/categories');
            return response.data;
        } catch (error : any) {
            console.error(error);
        }
    },
}

export default categoriesService;