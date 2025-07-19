import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface EventItem {
  description: string;
  date: string;
  category1?: string;
  category2: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const descriptionLike = searchParams.get('description_like');
    const page = parseInt(searchParams.get('_page') || '1');
    const limit = searchParams.get('_limit');

    // Read the database file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);
    const events: EventItem[] = db.events || [];

    let filteredEvents = events;

    // Filter by description if provided
    if (descriptionLike) {
      const searchTerm = descriptionLike.toLowerCase();
      filteredEvents = events.filter(event => 
        event.description.toLowerCase().includes(searchTerm)
      );
    }

    // If no limit is specified, return all results
    if (!limit) {
      return NextResponse.json(filteredEvents);
    }

    // Apply pagination only if limit is specified
    const limitNum = parseInt(limit);
    const startIndex = (page - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    // Return the paginated results
    return NextResponse.json(paginatedEvents);
  } catch (error) {
    console.error('Error reading database:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 