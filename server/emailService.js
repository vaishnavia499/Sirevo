import nodemailer from 'nodemailer';

// Create low-overhead Nodemailer transporter
// Uses jsonTransport for instant reliable local dispatches with full message envelopes
const transporter = nodemailer.createTransport({
  jsonTransport: true
});

/**
 * Dispatches an in-stock notification email via Nodemailer
 */
export async function sendStockAlertEmail({ to, productName, productId, price, image, externalLink }) {
  const subject = `⚡ In-Stock Alert: ${productName} is back in stock at Sirevo!`;
  const checkoutUrl = externalLink || `http://localhost:3000/search?q=${encodeURIComponent(productName)}`;

  const formattedPrice = price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Check Offer';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070b14; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0d1322; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #111a2e 0%, #0d1322 100%);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Sirevo <span style="color: #c084fc;">AI</span></span>
                  </td>
                  <td align="right">
                    <span style="background-color: #1e1b4b; color: #c084fc; border: 1px solid #6b21a8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700;">IN-STOCK ALERT</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px 0; color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.3;">
                Good news! Your item is back in stock 🎉
              </h1>
              <p style="margin: 0 0 24px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                You requested an in-stock alert for <strong style="color: #f1f5f9;">${productName}</strong>. Our automated stock monitor just verified that fresh inventory is now live and ready for checkout.
              </p>

              <!-- Product Card Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111a2f; border: 1px solid #243049; border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    ${image ? `<img src="${image}" alt="${productName}" width="160" height="160" style="object-fit: contain; border-radius: 8px; margin-bottom: 16px; display: block;" />` : ''}
                    <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 16px; font-weight: 700;">
                      ${productName}
                    </h3>
                    <div style="font-size: 24px; font-weight: 900; color: #4ade80; margin: 8px 0 16px 0; font-family: monospace;">
                      ${formattedPrice}
                    </div>
                    <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                      Buy Now with Sirevo Escrow →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Guarantee Footer within email -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #1e293b; padding-top: 20px;">
                <tr>
                  <td style="color: #64748b; font-size: 12px; line-height: 1.5;">
                    🛡️ <strong>Sirevo Buyer Protection:</strong> Autonomous escrow fulfillment and 7-day hassle-free return policy apply to all purchases.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #070b14; padding: 20px 32px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0; color: #475569; font-size: 11px;">
                You received this email because you subscribed to stock notifications on Sirevo AI for product #${productId}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const mailOptions = {
    from: '"Sirevo In-Stock Alerts" <alerts@sirevo.ai>',
    to,
    subject,
    text: `⚡ In-Stock Alert: ${productName} is back in stock at Sirevo! View and buy now: ${checkoutUrl}`,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [NODEMAILER STOCK DISPATCH] Sent alert to: ${to} | Product: "${productName}" (${productId}) | MsgID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      to,
      subject,
      productName,
      productId,
      sentAt: new Date().toISOString()
    };
  } catch (err) {
    console.error(`⚠️ [NODEMAILER DISPATCH ERROR] Failed sending to ${to}:`, err.message);
    throw err;
  }
}

export default { sendStockAlertEmail };
