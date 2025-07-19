# Historigal - Historical Events Search

A modern, responsive web application for searching through historical events with a Google-like interface. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🔍 **Advanced Search**
- **Google-like Autocomplete**: Real-time search suggestions as you type
- **Debounced Search**: Optimized API calls with 300ms debouncing
- **Smart Filtering**: Search through event descriptions, dates, and categories
- **Instant Results**: Fast, responsive search experience

### 📱 **Mobile-First Design**
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly**: Proper button sizes and spacing for mobile devices
- **Responsive Typography**: Text scales appropriately across all screen sizes
- **Mobile Pagination**: Optimized pagination controls for small screens

### 📚 **Citation Management**
- **Multi-Format Support**: Handles `cite web`, `cite news`, `cite book`, `cite journal`, `cite magazine`
- **Clean Text Display**: Removes raw citation syntax from descriptions
- **Formatted Sources**: Professional citation display with clickable links
- **HTML Entity Decoding**: Properly renders special characters and symbols

### 🎨 **Modern UI/UX**
- **Card-Based Layout**: Clean, modern event cards with hover effects
- **Date Badges**: Prominent date display with calendar icons
- **Category Tags**: Organized event categorization
- **Smooth Animations**: Subtle transitions and hover effects
- **Professional Styling**: Consistent design language throughout

### 📄 **Smart Pagination**
- **Client-Side Pagination**: 20 items per page for optimal performance
- **Responsive Controls**: Adapts pagination to screen size
- **Results Summary**: Shows current page and total results
- **Smooth Navigation**: Quick page transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/davidagustin/historigal-vercel.git
   cd historigal-vercel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **JSON Database**: Local `db.json` file for data storage
- **TypeScript**: Full-stack type safety

### **Development Tools**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📖 Usage

### **Searching Events**
1. Enter keywords in the search bar (e.g., "World War II", "Ancient Rome")
2. Use autocomplete suggestions for quick selection
3. View results with pagination controls
4. Click on source links to verify information

### **Understanding Results**
- **Date Badge**: When the event occurred
- **Event Description**: Clean, readable event summary
- **Category Tags**: Event classification and time period
- **Sources**: Clickable links to original references

### **Mobile Experience**
- Swipe-friendly interface
- Touch-optimized buttons
- Responsive text sizing
- Mobile-optimized pagination

## 🔧 API Endpoints

### **Search Events**
```
GET /api/events?description_like={query}&_page={page}&_limit={limit}
```

**Parameters:**
- `description_like`: Search query (required)
- `_page`: Page number (optional, default: 1)
- `_limit`: Items per page (optional, default: 10)

**Response:**
```json
[
  {
    "description": "Event description with citations",
    "date": "YYYY-MM-DD",
    "category1": "Time period",
    "category2": "Event category"
  }
]
```

## 🎯 Key Features Explained

### **Citation Parsing**
The application intelligently parses Wikipedia-style citations:
- Extracts source information (title, author, publisher, URL)
- Removes raw citation syntax from descriptions
- Formats citations for professional display
- Provides clickable source links

### **HTML Entity Handling**
Automatically decodes common HTML entities:
- `&amp;` → `&`
- `&ndash;` → `–`
- `&mdash;` → `—`
- `&hellip;` → `…`
- And many more...

### **Responsive Design**
Built with mobile-first approach:
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Flexible layouts with CSS Grid and Flexbox
- Optimized typography scaling
- Touch-friendly interface elements

## 📁 Project Structure

```
historigal-vercel/
├── app/
│   ├── components/
│   │   ├── HomeView.tsx          # Home page with search
│   │   ├── SearchView.tsx        # Search results page
│   │   └── SearchInput.tsx       # Reusable search input
│   ├── utils/
│   │   └── citationParser.ts     # Citation parsing utilities
│   ├── api/
│   │   └── events/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── public/
│   └── historigal.png           # Logo
├── db.json                      # Historical events database
└── package.json
```

## 🎨 Customization

### **Styling**
- Modify `app/globals.css` for global styles
- Use Tailwind classes for component styling
- Custom utilities available in CSS layers

### **Data**
- Update `db.json` to add/modify historical events
- Ensure proper citation formatting for parsing
- Maintain consistent data structure

### **Features**
- Extend citation parser in `app/utils/citationParser.ts`
- Add new API endpoints in `app/api/`
- Enhance components in `app/components/`

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Enjoy serverless hosting with edge functions

### **Other Platforms**
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment support
- **AWS**: Use with Next.js serverless functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Historical data sources and contributors
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- The open-source community for inspiration

---

**Built with ❤️ for history enthusiasts everywhere**
