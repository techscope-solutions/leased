import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendInquiryNotification({
  sellerEmail,
  sellerName,
  buyerEmail,
  dealTitle,
  dealId,
  preferredTerm,
  preferredDown,
  estimatedIncome,
  estimatedCredit,
  message,
}: {
  sellerEmail: string;
  sellerName: string;
  buyerEmail: string;
  dealTitle: string;
  dealId: string;
  preferredTerm: number;
  preferredDown: number;
  estimatedIncome: number;
  estimatedCredit: string;
  message: string;
}) {
  if (!resend) return; // silently skip if not configured

  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.leased.today'}/seller/dashboard`;

  await resend.emails.send({
    from: 'Leased <notifications@notification.leased.today>',
    to: sellerEmail,
    subject: `New inquiry on your ${dealTitle} listing`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#0a0a0a;">
  <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid rgba(10,10,10,0.08);">

    <!-- Header -->
    <div style="background:#0a0a0a;padding:24px 28px;">
      <div style="font-family:'Georgia',serif;font-style:italic;font-size:22px;color:white;letter-spacing:-0.02em;">Leased</div>
    </div>

    <!-- Body -->
    <div style="padding:28px;">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(10,10,10,0.4);margin-bottom:6px;">New inquiry</div>
      <h1 style="font-family:'Georgia',serif;font-size:26px;font-weight:400;letter-spacing:-0.02em;margin:0 0 6px;">${dealTitle}</h1>
      <p style="font-size:13px;color:rgba(10,10,10,0.5);margin:0 0 24px;">From ${buyerEmail}</p>

      <!-- Details -->
      <div style="background:#f7f5f2;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['Preferred term', `${preferredTerm} months`],
            ['Preferred down', `$${preferredDown.toLocaleString()}`],
            ['Annual income', `$${estimatedIncome.toLocaleString()}`],
            ['Credit score', estimatedCredit],
          ].map(([label, value]) => `
          <tr>
            <td style="padding:7px 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(10,10,10,0.4);font-family:monospace;">${label}</td>
            <td style="padding:7px 0;font-size:13px;text-align:right;color:#0a0a0a;">${value}</td>
          </tr>`).join('')}
        </table>
      </div>

      ${message ? `
      <div style="border-left:3px solid oklch(0.55 0.22 18);padding:12px 16px;margin-bottom:20px;background:rgba(10,10,10,0.02);border-radius:0 8px 8px 0;">
        <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(10,10,10,0.35);margin-bottom:6px;">Message</div>
        <p style="font-size:14px;color:#0a0a0a;margin:0;line-height:1.6;">${message}</p>
      </div>` : ''}

      <!-- CTA -->
      <a href="${dashboardUrl}" style="display:block;text-align:center;padding:14px;background:#0a0a0a;color:white;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;">
        View inquiry in dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid rgba(10,10,10,0.06);font-size:11px;color:rgba(10,10,10,0.35);">
      You received this because you're a seller on Leased.
      <a href="https://www.leased.today" style="color:rgba(10,10,10,0.4);">leased.today</a>
    </div>
  </div>
</body>
</html>`,
  });
}
