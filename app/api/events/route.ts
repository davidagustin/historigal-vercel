import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Read the database file
const dbPath = path.join(process.cwd(), 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const description_like = searchParams.get('description_like');
  const _page = searchParams.get('_page');
  const _limit = searchParams.get('_limit');
  
  let events = dbData.events || [];
  
  // Filter by description if provided
  if (description_like) {
    events = events.filter((event: any) => 
      event.description.toLowerCase().includes(description_like.toLowerCase())
    );
  }
  
  // Handle pagination
  if (_page && _limit) {
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedEvents = events.slice(startIndex, endIndex);
    return NextResponse.json(paginatedEvents);
  }
  
  // Return all filtered results if no pagination
  return NextResponse.json(events);
} 