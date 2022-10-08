import { PDFExtract, PDFExtractOptions } from 'npm:pdf.js-extract';

const pdfExtract = new PDFExtract();
const options: PDFExtractOptions = {
  normalizeWhitespace: true, // default:`false` - replaces all occurrences of whitespace with standard spaces (0x20).
  disableCombineTextItems: true, // default:`false` - do not attempt to combine  same line {@link TextItem}'s.
};
const data = await pdfExtract.extract('guia_off_sp_310.pdf', options);

// console.log(data.filename);
// console.log(data.meta);
console.log(data.pages.length);
console.log(data.pages[6]);
