// Test the citation parser with the sample data
const { parseCitations, formatCitation } = require('./utils/citationParser');

const sampleText = `{{cite web|url=<a href="http://www.abc.net.au/news/items/200603/1600810.htm?queensland|title=Scramjet">http://www.abc.net.au/news/items/200603/1600810.htm?queensland|title=Scramjet</a> team 'happy' after Woomera flight|publisher=Australian Broadcasting Corporation|date=2006-03-25|accessdate=2009-07-07}} {{dead link|date=July 2011}}{{cite web|url=<a href="http://www.nasa.gov/home/hqnews/2005/jun/HQ_05_156_X43A_Guinness.html|title=Faster">http://www.nasa.gov/home/hqnews/2005/jun/HQ_05_156_X43A_Guinness.html|title=Faster</a> Than a Speeding Bullet: Guinness Recognizes NASA Scramjet|date=2006-06-20|accessdate=2009-07-07|publisher=NASA}}`;

console.log('Original text:', sampleText);
console.log('\n--- Parsed Results ---');

const { cleanText, citations } = parseCitations(sampleText);

console.log('Clean text:', cleanText);
console.log('\nCitations:');
citations.forEach((citation, index) => {
  console.log(`${index + 1}. ${formatCitation(citation)}`);
}); 