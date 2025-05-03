
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


function isValidObjectId(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}


export async function PUT(request, { params }) {
  const { id } = params;
  
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid student ID' },
      { status: 400 }
    );
  }
  
  try {
    const studentData = await request.json();
    
    const client = await clientPromise;
    const db = client.db("studentManagement");
    
    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: studentData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Student updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  const { id } = params;
  
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid student ID' },
      { status: 400 }
    );
  }
  
  try {
    const client = await clientPromise;
    const db = client.db("studentManagement");
    
    const result = await db.collection("students").deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}