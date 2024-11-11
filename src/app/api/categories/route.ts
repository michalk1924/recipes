import { NextResponse } from "next/server";
import { getAllDocuments, getDatabaseClient } from "@/services/mongo";

export async function GET(request: Request) {
  const client = await getDatabaseClient();
  const categories = await getAllDocuments(client, 'categories')
  return NextResponse.json(categories);
}
