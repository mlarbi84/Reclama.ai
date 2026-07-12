const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 52;
const TOP_Y = 785;
const BOTTOM_Y = 58;
const FONT_SIZE = 10.5;
const LINE_HEIGHT = 15;
const MAX_CHARS = 92;

const CP1252 = new Map([
  ['€', 0x80], ['‚', 0x82], ['ƒ', 0x83], ['„', 0x84], ['…', 0x85], ['†', 0x86], ['‡', 0x87],
  ['ˆ', 0x88], ['‰', 0x89], ['Š', 0x8a], ['‹', 0x8b], ['Œ', 0x8c], ['Ž', 0x8e],
  ['‘', 0x91], ['’', 0x92], ['“', 0x93], ['”', 0x94], ['•', 0x95], ['–', 0x96], ['—', 0x97],
  ['˜', 0x98], ['™', 0x99], ['š', 0x9a], ['›', 0x9b], ['œ', 0x9c], ['ž', 0x9e], ['Ÿ', 0x9f]
]);

function toWinAnsiBytes(value) {
  const bytes = [];
  for (const char of String(value)) {
    if (CP1252.has(char)) {
      bytes.push(CP1252.get(char));
      continue;
    }
    const code = char.charCodeAt(0);
    bytes.push(code <= 255 ? code : 0x3f);
  }
  return bytes;
}

function pdfLiteral(value) {
  return toWinAnsiBytes(value).map((byte) => {
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) return `\\${String.fromCharCode(byte)}`;
    if (byte < 0x20 || byte > 0x7e) return `\\${byte.toString(8).padStart(3, '0')}`;
    return String.fromCharCode(byte);
  }).join('');
}

export function wrapText(text, maxChars = MAX_CHARS) {
  const output = [];
  const paragraphs = String(text).replace(/\r\n?/g, '\n').split('\n');

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      output.push('');
      continue;
    }

    const words = paragraph.trim().split(/\s+/);
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= maxChars) {
        line = candidate;
      } else if (!line) {
        output.push(word.slice(0, maxChars));
        line = word.slice(maxChars);
      } else {
        output.push(line);
        line = word;
      }
    }
    if (line) output.push(line);
  }
  return output;
}

function createPdfString(objects) {
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function binaryStringToUint8Array(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index) & 0xff;
  }
  return bytes;
}

export function createClaimPdf(text) {
  const lines = wrapText(text);
  const linesPerPage = Math.floor((TOP_Y - BOTTOM_Y) / LINE_HEIGHT);
  const pages = [];
  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }
  if (!pages.length) pages.push(['']);

  const fontObjectNumber = 3 + pages.length * 2;
  const pageObjectNumbers = pages.map((_, index) => 3 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageObjectNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pages.length} >>`
  ];

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectNumber = 3 + pageIndex * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    const commands = [
      'BT',
      `/F1 ${FONT_SIZE} Tf`,
      `${LINE_HEIGHT} TL`,
      `1 0 0 1 ${MARGIN_X} ${TOP_Y} Tm`
    ];

    pageLines.forEach((line, lineIndex) => {
      if (lineIndex > 0) commands.push('T*');
      commands.push(`(${pdfLiteral(line)}) Tj`);
    });
    commands.push('ET');
    const content = commands.join('\n');

    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const binary = createPdfString(objects);
  return new Blob([binaryStringToUint8Array(binary)], { type: 'application/pdf' });
}
