
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("studentManagement");
    const students = await db.collection("students").find({}).toArray();
    
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const studentData = await request.json();
    
    const client = await clientPromise;
    const db = client.db("studentManagement");
    const result = await db.collection("students").insertOne(studentData);
    
    return NextResponse.json(
      { message: 'Student created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}