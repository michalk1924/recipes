import { NextResponse } from "next/server";
import { getAllDocuments, insertDocument, deleteDocument, getDatabaseClient } from "@/services/mongo";
import { Recipe } from "@/types";
import {PAGESIZE} from "@/app/lib/consts"


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryParam = url.searchParams.get('category');
    const category = categoryParam ? parseInt(categoryParam) : null;
    const pagingParam = url.searchParams.get('page');
    const client = await getDatabaseClient();
    let recipes: Recipe[] = await getAllDocuments(client, 'recipes');
    if (category) {
      recipes = recipes.filter(recipe => recipe.category === category);
    }
    if(pagingParam){
      
      const pageNumber = parseInt(pagingParam);
      const startIndex = (pageNumber - 1) * PAGESIZE;
      recipes = recipes.slice(startIndex, startIndex + PAGESIZE);      
    }
    return NextResponse.json(recipes);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await getDatabaseClient();
  try {
    const newRecipe = await request.json();
    const insertedRecipeId = await insertDocument(client, 'recipes', newRecipe);
    return NextResponse.json({ data: { ...newRecipe, _id: insertedRecipeId } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('id');
  if (!idParam) return NextResponse.json({ message: 'Recipe ID not provided' }, { status: 400 });

  // const id = parseInt(idParam, 10);
  // if (isNaN(id)) {
  //   return NextResponse.json({ message: 'Recipe ID must be a valid number' }, { status: 400 });
  // }
  const client = await getDatabaseClient();
  const result = await deleteDocument(client, 'recipes', idParam);

  return NextResponse.json({ message: 'Recipe deleted successfully', result });
}