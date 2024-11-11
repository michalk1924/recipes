import { NextResponse, NextRequest } from 'next/server';
import { getDocumentById, getDatabaseClient }  from "@/services/mongo"


export async function GET(request: NextRequest, { params }: { params: any }) {
    const client = await getDatabaseClient();
    const { id } = await params;

    if (!id) return NextResponse.json({ message: 'Recipe ID not provided' }, { status: 400 });


    const document = await getDocumentById(client, 'recipes', id);

    if (!document) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ data: document });
}
