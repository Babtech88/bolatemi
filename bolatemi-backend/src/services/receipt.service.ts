import PDFDocument from "pdfkit";

interface ReceiptItem {
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface ReceiptData {
  orderNumber: string;
  paidAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  items: ReceiptItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentReference: string;
}

// Whole-naira amounts only (no kobo) — keeps the string short enough to fit
// the table's price/total columns on one line at this font size, which
// matters because pdfkit silently wraps text that overflows its declared
// width rather than erroring, and a wrapped row collides with the row below.
const naira = (n: number) => `NGN ${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const steelBlue = "#0F1922";
    const gold = "#C99000";
    const gray = "#4B4B48";
    const pageLeft = 50;
    const pageRight = 545;
    const pageWidth = pageRight - pageLeft;

    // Header — stacked vertically (not side-by-side with the RECEIPT
    // label) specifically so the long company name can never collide with
    // anything next to it, regardless of how wide it renders.
    doc.fillColor(steelBlue).fontSize(16).font("Helvetica-Bold")
      .text("BOLATEMI GLOBAL AND SONS ENTERPRISES", pageLeft, 50, { width: pageWidth });
    doc.fillColor(gray).fontSize(9).font("Helvetica")
      .text("Plumbing, Welding & Industrial Supplies", pageLeft, 72);
    doc.text("KM 15/16, Lusada-Atan Expressway, Agbara, Ogun State, Nigeria", pageLeft, 86);

    doc.moveTo(pageLeft, 108).lineTo(pageRight, 108).strokeColor("#D7D1C2").stroke();

    doc.fillColor(gold).fontSize(13).font("Helvetica-Bold").text("RECEIPT", pageLeft, 120);
    doc.fillColor(gray).fontSize(9).font("Helvetica")
      .text(`Order: ${data.orderNumber}    Date: ${data.paidAt.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}    Ref: ${data.paymentReference}`, pageLeft, 140, { width: pageWidth });

    // Bill to / Deliver to
    let y = 172;
    doc.fillColor(steelBlue).fontSize(10).font("Helvetica-Bold").text("BILL TO", pageLeft, y);
    doc.fillColor(steelBlue).text("DELIVER TO", 300, y);
    y += 16;
    doc.fillColor(gray).fontSize(10).font("Helvetica");
    doc.text(data.customerName, pageLeft, y);
    doc.text(data.deliveryAddress, 300, y, { width: 245 });
    y += 14;
    doc.text(data.customerPhone, pageLeft, y);
    y += 14;
    if (data.customerEmail) doc.text(data.customerEmail, pageLeft, y);
    doc.text(`${data.deliveryCity}, ${data.deliveryState}`, 300, y - 14);

    // Line item table — column widths sized generously for "NGN 999,999"
    // style values so nothing wraps to a second line and collides with the
    // row beneath it.
    const col = { item: pageLeft, sku: 260, qty: 335, price: 375, total: 465 };
    const colWidth = { item: 200, sku: 70, qty: 35, price: 85, total: 80 };

    y = 250;
    doc.rect(pageLeft, y, pageWidth, 22).fill(steelBlue);
    doc.fillColor("#fff").fontSize(9).font("Helvetica-Bold");
    doc.text("ITEM", col.item + 8, y + 7);
    doc.text("SKU", col.sku, y + 7);
    doc.text("QTY", col.qty, y + 7, { width: colWidth.qty, align: "right" });
    doc.text("UNIT PRICE", col.price, y + 7, { width: colWidth.price, align: "right" });
    doc.text("TOTAL", col.total, y + 7, { width: colWidth.total, align: "right" });
    y += 22;

    doc.font("Helvetica").fontSize(9);
    data.items.forEach((item, i) => {
      const rowHeight = 26;
      if (i % 2 === 1) {
        doc.fillColor("#F5F3EE").rect(pageLeft, y, pageWidth, rowHeight).fill();
      }
      doc.fillColor("#1a1a1a").text(item.name, col.item + 8, y + 6, { width: colWidth.item - 8 });
      doc.fillColor(gray).fontSize(8).text(item.sku, col.sku, y + 6, { width: colWidth.sku });
      doc.fontSize(9).text(String(item.quantity), col.qty, y + 6, { width: colWidth.qty, align: "right" });
      doc.text(naira(item.unitPrice), col.price, y + 6, { width: colWidth.price, align: "right" });
      doc.fillColor("#1a1a1a").text(naira(item.lineTotal), col.total, y + 6, { width: colWidth.total, align: "right" });
      y += rowHeight;
    });

    doc.moveTo(pageLeft, y).lineTo(pageRight, y).strokeColor("#D7D1C2").stroke();
    y += 12;

    // Totals — same right-hand columns as the table so figures line up,
    // with enough vertical gap per row that a wrapped value (if it ever
    // happened) still wouldn't reach the next line.
    doc.fontSize(10).fillColor(gray).font("Helvetica");
    doc.text("Subtotal", col.price - 40, y, { width: colWidth.price + 40 - 10, align: "right" });
    doc.fillColor("#1a1a1a").text(naira(data.subtotal), col.total, y, { width: colWidth.total, align: "right" });
    y += 20;

    doc.fillColor(gray).text("Delivery Fee", col.price - 40, y, { width: colWidth.price + 40 - 10, align: "right" });
    doc.fillColor("#1a1a1a").text(naira(data.deliveryFee), col.total, y, { width: colWidth.total, align: "right" });
    y += 24;

    doc.moveTo(col.price - 40, y).lineTo(pageRight, y).strokeColor(steelBlue).stroke();
    y += 10;

    doc.fontSize(12).font("Helvetica-Bold").fillColor(steelBlue);
    doc.text("TOTAL PAID", col.price - 40, y, { width: colWidth.price + 40 - 10, align: "right" });
    doc.text(naira(data.total), col.total, y, { width: colWidth.total, align: "right" });

    // Footer
    doc.fontSize(8.5).font("Helvetica").fillColor(gray);
    doc.text(
      "Thank you for your business. This receipt confirms payment has been received in full. For questions about this order, contact us via WhatsApp or email.",
      pageLeft,
      720,
      { width: pageWidth, align: "center" }
    );

    doc.end();
  });
}
