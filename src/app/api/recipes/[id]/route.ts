import { NextResponse, NextRequest } from 'next/server';
import { getDocumentById, getDatabaseClient, updateDocument, deleteDocument } from "@/services/mongo";

export async function GET(request: NextRequest, { params }: { params: any }) {
    try {
        const client = await getDatabaseClient();
        const { id } = await params;
        if (!id) return NextResponse.json({ message: 'Recipe ID not provided' }, { status: 400 });
        const document = await getDocumentById(client, 'recipes', id);
        if (!document) {
            return NextResponse.json({ message: 'Document not found' }, { status: 404 });
        }
        return NextResponse.json({ data: document });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error retrieving recipe', error }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
    try {
        const client = await getDatabaseClient();
        const { id } = await params;
        if (!id) return NextResponse.json({ message: 'Recipe ID not provided' }, { status: 400 });
        const updatedRecipe = await request.json();
        const result = await updateDocument(client, 'recipes', id, updatedRecipe);
        return NextResponse.json({ message: 'Recipe updated successfully', result });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error updating recipe', error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: any }) {
try{
    const client = await getDatabaseClient();
    const { id } = await params;
    const result = await deleteDocument(client, 'recipes', id);
    return NextResponse.json({ message: 'Recipe deleted successfully', result });
}
    catch (error) {
        return NextResponse.json({ message: 'Error deleting recipe', error }, { status: 500 });
    }
}

