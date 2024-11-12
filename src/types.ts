export interface Recipe {
     _id: string;
    name: string;
    category: number;
    image_url: string;
    ingredients: string[];
    instructions: string;
    is_favorite: boolean;
    //add
}

export interface Category{
    category_id: number;
    category_name: string;
}
