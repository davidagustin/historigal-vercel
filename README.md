<div align="center">

# 🏛️ Historigal

**A modern, responsive web application for searching through historical events with a Google-like interface**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/davidagustin/historigal-vercel)
[![GitHub Stars](https://img.shields.io/github/stars/davidagustin/historigal-vercel?style=for-the-badge&logo=github)](https://github.com/davidagustin/historigal-vercel/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/davidagustin/historigal-vercel?style=for-the-badge&logo=github)](https://github.com/davidagustin/historigal-vercel/network)

*Search through 37,860+ historical events from 300 B.C. to 2012 with a beautiful, responsive interface*

</div>

---

## ✨ Features

### 🔍 **Advanced Search Experience**
- **Google-like Autocomplete** - Real-time search suggestions as you type
- **Debounced Search** - Optimized API calls with 300ms debouncing
- **Smart Filtering** - Search through event descriptions, dates, and categories
- **Instant Results** - Fast, responsive search experience

### 📱 **Mobile-First Design**
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Touch-Friendly** - Proper button sizes and spacing for mobile devices
- **Responsive Typography** - Text scales appropriately across all screen sizes
- **Mobile Pagination** - Optimized pagination controls for small screens

### 📚 **Intelligent Citation Management**
- **Multi-Format Support** - Handles `cite web`, `cite news`, `cite book`, `cite journal`, `cite magazine`
- **Clean Text Display** - Removes raw citation syntax from descriptions
- **Formatted Sources** - Professional citation display with clickable links
- **HTML Entity Decoding** - Properly renders special characters and symbols

### 🎨 **Modern UI/UX**
- **Card-Based Layout** - Clean, modern event cards with hover effects
- **Date Badges** - Prominent date display with calendar icons
- **Category Tags** - Organized event categorization
- **Smooth Animations** - Subtle transitions and hover effects
- **Professional Styling** - Consistent design language throughout

### 📄 **Smart Pagination**
- **Client-Side Pagination** - 20 items per page for optimal performance
- **Responsive Controls** - Adapts pagination to screen size
- **Results Summary** - Shows current page and total results
- **Smooth Navigation** - Quick page transitions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

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

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 15 | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | 5.0 | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3 | Utility-first CSS framework |
| [React Hooks](https://react.dev/reference/react) | 18+ | Modern state management |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) | 15 | Serverless API endpoints |
| [JSON Database](https://www.json.org/) | - | Local `db.json` file for data storage |
| [TypeScript](https://www.typescriptlang.org/) | 5.0 | Full-stack type safety |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| [ESLint](https://eslint.org/) | Code linting and formatting |
| [PostCSS](https://postcss.org/) | CSS processing |
| [Autoprefixer](https://autoprefixer.github.io/) | CSS vendor prefixing |

---

## 📖 Usage Guide

### **Searching Events**
1. **Enter keywords** in the search bar (e.g., "World War II", "Ancient Rome")
2. **Use autocomplete** suggestions for quick selection
3. **View results** with pagination controls
4. **Click on source links** to verify information

### **Understanding Results**
- **📅 Date Badge** - When the event occurred
- **📝 Event Description** - Clean, readable event summary
- **🏷️ Category Tags** - Event classification and time period
- **🔗 Sources** - Clickable links to original references

### **Mobile Experience**
- **👆 Swipe-friendly** interface
- **📱 Touch-optimized** buttons
- **📏 Responsive text** sizing
- **📄 Mobile-optimized** pagination

---

## 🔧 API Documentation

### **Search Events**
```http
GET /api/events?description_like={query}&_page={page}&_limit={limit}
```

#### **Parameters**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `description_like` | string | ✅ | - | Search query |
| `_page` | number | ❌ | 1 | Page number |
| `_limit` | number | ❌ | 10 | Items per page |

#### **Response Example**
```json
[
  {
    "description": "Event description with citations",
    "date": "YYYY-MM-DD",
    "category1": "Time period",
    "category2": "Event category",
    "lang": "en",
    "granularity": "year"
  }
]
```

---

## 🎯 Key Features Explained

### **Citation Parsing**
The application intelligently parses Wikipedia-style citations:
- ✅ Extracts source information (title, author, publisher, URL)
- ✅ Removes raw citation syntax from descriptions
- ✅ Formats citations for professional display
- ✅ Provides clickable source links

### **HTML Entity Handling**
Automatically decodes common HTML entities:
| Entity | Character | Description |
|--------|-----------|-------------|
| `&amp;` | `&` | Ampersand |
| `&ndash;` | `–` | En dash |
| `&mdash;` | `—` | Em dash |
| `&hellip;` | `…` | Horizontal ellipsis |
| `&copy;` | `©` | Copyright symbol |
| `&reg;` | `®` | Registered trademark |
| `&trade;` | `™` | Trademark symbol |

### **Responsive Design**
Built with mobile-first approach:
- **📱 Mobile**: `sm:` breakpoint (640px+)
- **📱 Tablet**: `md:` breakpoint (768px+)
- **💻 Desktop**: `lg:` breakpoint (1024px+)
- **🖥️ Large**: `xl:` breakpoint (1280px+)

---

## 📁 Project Structure

```
historigal-vercel/
├── 📁 app/
│   ├── 📁 components/
│   │   ├── 🏠 HomeView.tsx          # Home page with search
│   │   ├── 🔍 SearchView.tsx        # Search results page
│   │   └── 🔎 SearchInput.tsx       # Reusable search input
│   ├── 📁 utils/
│   │   └── 📚 citationParser.ts     # Citation parsing utilities
│   ├── 📁 api/
│   │   └── 📁 events/
│   │       └── 🔌 route.ts          # API endpoint
│   ├── 🎨 globals.css               # Global styles
│   ├── 🏗️ layout.tsx                # Root layout
│   └── 📄 page.tsx                  # Main page
├── 📁 public/
│   └── 🖼️ historigal.png           # Logo
├── 📊 db.json                      # Historical events database
└── 📦 package.json
```

---

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

---

## 🚀 Deployment

### **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/davidagustin/historigal-vercel)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Enjoy serverless hosting with edge functions

### **Other Platforms**
| Platform | Description | Link |
|----------|-------------|------|
| **Netlify** | Compatible with Next.js static export | [Deploy to Netlify](https://www.netlify.com/) |
| **Railway** | Full-stack deployment support | [Deploy to Railway](https://railway.app/) |
| **AWS** | Use with Next.js serverless functions | [Deploy to AWS](https://aws.amazon.com/) |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure mobile responsiveness
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Historical data sources** and contributors
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **The open-source community** for inspiration

---

<div align="center">

**Built with ❤️ for history enthusiasts everywhere**

[![GitHub](https://img.shields.io/badge/GitHub-View%20on%20GitHub-black?style=for-the-badge&logo=github)](https://github.com/davidagustin/historigal-vercel)
[![Issues](https://img.shields.io/github/issues/davidagustin/historigal-vercel?style=for-the-badge&logo=github)](https://github.com/davidagustin/historigal-vercel/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/davidagustin/historigal-vercel?style=for-the-badge&logo=github)](https://github.com/davidagustin/historigal-vercel/pulls)

</div>
