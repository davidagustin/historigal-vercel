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
    const limit = parseInt(searchParams.get('_limit') || '10');

    // Read the database file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);
    const events: EventItem[] = db.events || [];

    let filteredEvents = events;

    // Filter by description if search parameter is provided
    if (descriptionLike) {
      const searchTerm = descriptionLike.toLowerCase();
      filteredEvents = events.filter(event =>
        event.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    // Return the results
    return NextResponse.json(paginatedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 