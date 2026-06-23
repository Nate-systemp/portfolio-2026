const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function main() {
    const pdfPath = path.join(__dirname, '..', 'assets', 'USERMANUAL_GB.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);

    const parser = new pdf.PDFParse({ data: dataBuffer });
    await parser.load();
    const textObj = await parser.getText();
    fs.writeFileSync(path.join(__dirname, 'extracted_text.txt'), textObj.text);
    console.log("PDF parsed successfully. Total characters:", textObj.text.length);
    await parser.destroy();
}

main().catch(console.error);
