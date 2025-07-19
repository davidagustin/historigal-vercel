# Historigal

Learn about history with a Google themed interface.

## Key Features

- **Google Themed Interface** - A similar feel to the popular website (https://www.google.com)
  - Search functionality is virtually the same
- **37,860 Historical Entries** in Database
  - Events covered from 300 B.C. to the year 2012
- **Next.js 15** with TypeScript
- **Responsive Design** with custom CSS styling

## How To Use

To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/davidagustin/historigal-vercel.git

# Go into the repository
cd historigal-vercel

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for API calls
- **React Paginate** - Pagination component
- **Custom CSS** - Google-themed styling

## API Endpoints

- `GET /api/events` - Get all historical events
- `GET /api/events?description_like=<search_term>` - Search events by description
- `GET /api/events?description_like=<search_term>&_page=<page>&_limit=<limit>` - Paginated search results

## License

MIT

## About

This is a Next.js adaptation of the original Historigal project, featuring a Google-themed interface for searching through historical events.
