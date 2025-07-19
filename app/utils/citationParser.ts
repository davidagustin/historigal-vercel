interface Citation {
  type: string;
  url?: string;
  title?: string;
  publisher?: string;
  date?: string;
  accessdate?: string;
  author?: string;
  work?: string;
  year?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™');
}

export function parseCitations(text: string): { cleanText: string; citations: Citation[] } {
  const citations: Citation[] = [];
  let cleanText = text;

  // Remove HTML anchor tags and extract URLs
  cleanText = cleanText.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, (match, url, text) => {
    return text; // Keep the text, remove the HTML
  });

  // Parse Wikipedia-style citations (cite web, cite news, cite book, etc.)
  // Use a more robust approach to handle citations with nested braces
  const citationPatterns = [
    /\{\{cite (web|news|book|journal|magazine)\|([^}]*)\}\}/g,
    /\{\{cite book[^}]*\}\}/g,
    /\{\{cite news[^}]*\}\}/g,
    /\{\{cite web[^}]*\}\}/g,
    /\{\{cite journal[^}]*\}\}/g,
    /\{\{cite magazine[^}]*\}\}/g
  ];

  citationPatterns.forEach(pattern => {
    cleanText = cleanText.replace(pattern, (match) => {
      // Extract citation type and content from the match
      const typeMatch = match.match(/\{\{cite (web|news|book|journal|magazine)\|/);
      const citationType = typeMatch ? typeMatch[1] : 'web';
      
      // Extract content between | and }}
      const contentMatch = match.match(/\{\{cite [^|]*\|(.*)\}\}/);
      const citationContent = contentMatch ? contentMatch[1] : '';
      
      if (citationContent) {
        const citation = parseCitationContent(citationContent);
        citation.type = citationType;
        citations.push(citation);
      }
      
      return ''; // Remove the citation from the text
    });
  });

  // Clean up any remaining citation artifacts
  cleanText = cleanText
    .replace(/\{\{dead link\|[^}]+\}\}/g, '') // Remove dead link markers
    .replace(/\{\{ref name=[^}]+\}\}/g, '') // Remove ref name markers
    .replace(/ampamp/g, '') // Remove HTML entity artifacts
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Decode HTML entities
  cleanText = decodeHtmlEntities(cleanText);

  return { cleanText, citations };
}

function parseCitationContent(content: string): Citation {
  const citation: Citation = { type: 'web' };
  
  // Split by | and parse each parameter
  const params = content.split('|');
  
  for (const param of params) {
    const [key, value] = param.split('=');
    if (key && value) {
      const cleanKey = key.trim();
      const cleanValue = value.trim();
      
      switch (cleanKey) {
        case 'url':
          citation.url = cleanValue;
          break;
        case 'title':
          citation.title = cleanValue;
          break;
        case 'publisher':
          citation.publisher = cleanValue;
          break;
        case 'date':
          citation.date = cleanValue;
          break;
        case 'accessdate':
          citation.accessdate = cleanValue;
          break;
        case 'author':
          citation.author = cleanValue;
          break;
        case 'work':
          citation.work = cleanValue;
          break;
        case 'year':
          citation.year = cleanValue;
          break;
        case 'last':
          citation.author = cleanValue;
          break;
        case 'first':
          if (citation.author) {
            citation.author = `${cleanValue} ${citation.author}`;
          } else {
            citation.author = cleanValue;
          }
          break;
      }
    }
  }
  
  return citation;
}

export function formatCitation(citation: Citation): string {
  const parts: string[] = [];
  
  if (citation.author) {
    parts.push(citation.author);
  }
  
  if (citation.title) {
    parts.push(`"${citation.title}"`);
  }
  
  if (citation.work) {
    parts.push(citation.work);
  }
  
  if (citation.publisher) {
    parts.push(citation.publisher);
  }
  
  if (citation.date || citation.year) {
    parts.push(citation.date || citation.year || '');
  }
  
  if (citation.url) {
    parts.push(citation.url);
  }
  
  return parts.join(', ');
}

export function extractUrls(text: string): string[] {
  const urls: string[] = [];
  
  // Extract URLs from HTML anchor tags
  const anchorRegex = /<a href="([^"]+)">[^<]+<\/a>/g;
  let match;
  while ((match = anchorRegex.exec(text)) !== null) {
    const url = match[1];
    if (url && typeof url === 'string') {
      urls.push(url);
    }
  }
  
  // Extract URLs from citation content
  const citationRegex = /\{\{cite (web|news|book|journal|magazine)\|([^}]*)\}\}/g;
  while ((match = citationRegex.exec(text)) !== null) {
    const citationContent = match[2];
    if (citationContent && typeof citationContent === 'string' && citationContent.length > 0) {
      const urlMatch = citationContent.match(/url=([^|]+)/);
      if (urlMatch && urlMatch[1] && typeof urlMatch[1] === 'string') {
        const extractedUrl = urlMatch[1];
        urls.push(extractedUrl);
      }
    }
  }
  
  return urls;
} 