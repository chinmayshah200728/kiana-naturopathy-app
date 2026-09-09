export type SheetOrderRecord = {
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  email?: string;
  items: string;
  total: number;
  paymentMethod: string;
  status: string;
  address: string;
};

const GSHEET_WEBHOOK_KEY = "kiana-gsheet-webhook-url";

export function getGoogleSheetsWebhookUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(GSHEET_WEBHOOK_KEY) || "";
  } catch {
    return "";
  }
}

export function setGoogleSheetsWebhookUrl(url: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GSHEET_WEBHOOK_KEY, url.trim());
  } catch {
    /* ignore */
  }
}

export async function sendOrderToGoogleSheets(record: SheetOrderRecord): Promise<{ success: boolean; message: string }> {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: "No Google Sheets Webhook URL configured." };
  }

  try {
    // Send via POST to Google Apps Script Webhook
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors", // Google Apps Script web app redirect requires no-cors mode
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    return { success: true, message: "Order data synced to Google Sheets!" };
  } catch (err) {
    console.error("Google Sheets sync error:", err);
    return { success: false, message: err instanceof Error ? err.message : "Failed to sync to Google Sheets." };
  }
}

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// -------------------------------------------------------------
// KIANA NATUROPATHY - GOOGLE APPS SCRIPT FOR ORDER SYNC & EMAILS
// -------------------------------------------------------------
// IMPORTANT: You MUST create this script from INSIDE your Google Sheet
// (Open Google Sheet -> Extensions -> Apps Script)

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Kiana Naturopathy Order Webhook Active!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ result: "error", error: "No active spreadsheet bound." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = ss.getSheets()[0];
    
    // Auto-create header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Order Number", 
        "Date", 
        "Customer Name", 
        "Phone", 
        "Email", 
        "Purchased Items", 
        "Total (INR)", 
        "Payment Method", 
        "Status", 
        "Address"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#0F3822").setFontColor("#FFFFFF");
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    // 1. Log order to Google Sheet
    sheet.appendRow([
      data.orderNumber || "",
      data.date || new Date().toLocaleDateString(),
      data.customerName || "",
      data.phone || "",
      data.email || "",
      data.items || "",
      data.total || 0,
      data.paymentMethod || "",
      data.status || "Order Placed",
      data.address || ""
    ]);

    // Force Google Sheet to save rows immediately
    SpreadsheetApp.flush();

    // 2. Send Automated Order Confirmation Email to Customer
    if (data.email && data.email.indexOf("@") !== -1) {
      try {
        var subject = "Order Confirmation #" + (data.orderNumber || "") + " - Kiana Naturopathy";
        var body = "Dear " + (data.customerName || "Valued Client") + ",\n\n"
          + "Thank you for shopping with Kiana Naturopathy!\n\n"
          + "ORDER SUMMARY:\n"
          + "--------------------------------------------------\n"
          + "Order Number: #" + (data.orderNumber || "") + "\n"
          + "Date: " + (data.date || "") + "\n"
          + "Items Purchased: " + (data.items || "") + "\n"
          + "Total Amount: Rs. " + (data.total || 0) + " (" + (data.paymentMethod || "").toUpperCase() + ")\n"
          + "Delivery Address: " + (data.address || "") + "\n\n"
          + "Our naturopathy practitioner team is preparing your package.\n\n"
          + "Warm Regards,\n"
          + "Kiana Naturopathy Team\n"
          + "Email: kianaturopathy@gmail.com | Phone: +91 98765 43210";

        MailApp.sendEmail(data.email, subject, body);
      } catch (emailErr) {
        Logger.log("Customer email error: " + emailErr.toString());
      }
    }

    // 3. Send New Order Alert Email to Clinic Admin
    try {
      var adminSubject = "NEW STORE ORDER #" + (data.orderNumber || "") + " (" + (data.paymentMethod || "").toUpperCase() + ")";
      var adminBody = "New order received on website!\n\n"
        + "Customer Name: " + (data.customerName || "") + "\n"
        + "Phone: " + (data.phone || "") + "\n"
        + "Email: " + (data.email || "N/A") + "\n"
        + "Order Number: #" + (data.orderNumber || "") + "\n"
        + "Items: " + (data.items || "") + "\n"
        + "Total Amount: Rs. " + (data.total || 0) + "\n"
        + "Address: " + (data.address || "") + "\n\n"
        + "Manage order status at: https://kiananaturopathy.in/admin";

      MailApp.sendEmail("kianaturopathy@gmail.com", adminSubject, adminBody);
    } catch (adminEmailErr) {
      Logger.log("Admin email error: " + adminEmailErr.toString());
    }
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
