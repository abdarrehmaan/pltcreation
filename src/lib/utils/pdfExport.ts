import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures the Tax Invoice HTML element and exports it as a high-resolution paper-white A4 PDF.
 */
export async function exportInvoiceToPdf(
  elementId: string = 'plt-tax-invoice-bill',
  filename: string = 'PLT_Creation_Tax_Invoice.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id '${elementId}' not found.`);
    window.print();
    return false;
  }

  try {
    // Capture canvas with 2.5x resolution for ultra-sharp typography
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      onclone: (clonedDoc) => {
        const target = clonedDoc.getElementById(elementId);
        if (target) {
          // Force pure paper white background and black text on cloned DOM for canvas capture
          target.style.backgroundColor = '#ffffff';
          target.style.color = '#000000';
          target.style.boxShadow = 'none';
          target.style.borderRadius = '0';
          target.style.margin = '0';

          // Force all child elements to remain white background & crisp black borders/text
          const allNodes = target.querySelectorAll('*');
          allNodes.forEach((node: any) => {
            const isBlackBg = node.classList.contains('bg-black');
            const isInsideBlackBg = Boolean(node.closest('.bg-black'));

            if (isBlackBg || isInsideBlackBg) {
              node.style.backgroundColor = '#000000';
              node.style.color = '#ffffff';
            } else if (node.tagName !== 'IMG') {
              node.style.backgroundColor = '#ffffff';
              node.style.color = '#000000';
              if (
                node.tagName !== 'SVG' &&
                node.tagName !== 'PATH' &&
                node.tagName !== 'LINE' &&
                node.tagName !== 'CIRCLE' &&
                node.tagName !== 'TEXT'
              ) {
                node.style.borderColor = '#000000';
              }
            }
          });
        }
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Create A4 PDF in portrait mode (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const marginX = 8;
    const marginY = 8;
    const printWidth = pdfWidth - marginX * 2;
    const printHeight = (canvas.height * printWidth) / canvas.width;

    if (printHeight > pdfHeight - marginY * 2) {
      const scaledHeight = pdfHeight - marginY * 2;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      const scaledMarginX = (pdfWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', scaledMarginX, marginY, scaledWidth, scaledHeight, undefined, 'FAST');
    } else {
      pdf.addImage(imgData, 'PNG', marginX, marginY, printWidth, printHeight, undefined, 'FAST');
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to export PDF using canvas, falling back to window.print():', err);
    window.print();
    return false;
  }
}
