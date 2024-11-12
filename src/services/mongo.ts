"use service"

import { Recipe } from "@/types";
import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

let cachedClient: MongoClient;

export async function getDatabaseClient() {
    if (!cachedClient) {
        cachedClient = await connectDatabase();
    }
    return cachedClient;
}

export async function connectDatabase() {
    const dbConnection: any = process.env.PUBLIC_DB_CONNECTION;
    return await MongoClient.connect(dbConnection);
}


export async function insertDocument(client: any, collection: string, document: object) {
    const db = await client.db('Racheli');
    const result = await db.collection(collection).insertOne(document);
    return result;
}

export async function getAllDocuments(client: any, collection: string) {
    const db = await client.db('Racheli');
    const documents = await db.collection(collection).find().toArray();
    return documents;
}

export async function getDocumentById(client: any, collection: string, id: string) {
    const db = await client.db('Racheli');
    const document = await db.collection(collection).findOne({ _id: new ObjectId(id) });
    return document;
}

export async function deleteDocument(client: any, collection: string, id: string) {
    const db = await client.db('Racheli');
    const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
    return result;
}

export async function updateDocument(client: any, collection: string, id: string, updatedDocument: Recipe) {
    const db = await client.db('Racheli');
    try {
        const { _id, ...updateFields } = updatedDocument;
        const result = await db.collection(collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );
        console.log('Document updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}