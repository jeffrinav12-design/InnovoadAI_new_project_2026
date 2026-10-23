import { jsPDF } from 'jspdf';

export function downloadAsPdf(title: string, textContent: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('INNOVOAD AI — ACADEMIC INTELLIGENCE PLATFORM', 14, 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(title, 14, 25);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 29, 196, 29);

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);

  const lines = doc.splitTextToSize(textContent, 180);
  let y = 36;

  for (let i = 0; i < lines.length; i++) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines[i], 14, y);
    y += 5.5;
  }

  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_innovoad.pdf`);
}

export function downloadAsDocx(title: string, htmlOrText: string) {
  const isHtml = htmlOrText.includes('<') && htmlOrText.includes('>');
  const content = isHtml
    ? htmlOrText
    : `<pre style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; white-space: pre-wrap;">${htmlOrText}</pre>`;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #111; margin: 1in; }
          h1, h2, h3 { font-family: 'Arial', sans-serif; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 12px; }
          th, td { border: 1px solid #333; padding: 6px 8px; font-size: 10pt; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
          .header-box { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h2>${title}</h2>
          <p style="margin: 2px 0; font-size: 9pt; color: #555;">Generated via INNOVOAD AI Academic SaaS Platform</p>
        </div>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([wordHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_innovoad.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrintView(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }
  window.print();
}

