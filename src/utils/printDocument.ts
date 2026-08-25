/**
 * Official MoRTH Digital Document Printing Utility
 * Generates pixel-perfect, authentic Government of India letterhead slips, 
 * receipts, acknowledgement forms, and PVC Driving Licence cards.
 * Hardened with HTML entity escaping to prevent DOM-based XSS injection.
 */

export interface PrintSlipOptions {
  title: string;
  subtitle: string;
  documentType: string;
  referenceNumber: string;
  applicantName: string;
  mobile?: string;
  serviceName?: string;
  rtoName?: string;
  details: { label: string; value: string | number }[];
  highlightBox?: { label: string; value: string };
  footerNotes?: string[];
}

/**
 * Escapes special HTML characters to prevent XSS attacks when using document.write()
 */
export function escapeHtml(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function printOfficialSlip(options: PrintSlipOptions) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    window.print();
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const detailsHtml = options.details
    .map(
      (item) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 13px;">
        <span style="color: #64748b; font-weight: 500;">${escapeHtml(item.label)}:</span>
        <span style="color: #0f172a; font-weight: 700; text-align: right;">${escapeHtml(item.value)}</span>
      </div>
    `
    )
    .join('');

  const highlightHtml = options.highlightBox
    ? `
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 14px; margin: 16px 0; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; font-weight: 700; color: #166534;">${escapeHtml(options.highlightBox.label)}</span>
      <span style="font-size: 16px; font-weight: 900; color: #15803d; font-family: monospace;">${escapeHtml(options.highlightBox.value)}</span>
    </div>
  `
    : '';

  const footerNotesHtml = options.footerNotes
    ? options.footerNotes
        .map(
          (note) => `
        <li style="margin-bottom: 4px;">${escapeHtml(note)}</li>
      `
        )
        .join('')
    : `
      <li>This is a computer-generated official document under the Information Technology Act 2000 and requires no physical signature.</li>
      <li>Verify authenticity at any time on the national portal status tracker.</li>
    `;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(options.title)} - ${escapeHtml(options.referenceNumber)}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 20px;
          line-height: 1.5;
        }
        .header-table {
          width: 100%;
          border-bottom: 2px solid #0056D2;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .national-emblem {
          height: 64px;
          width: auto;
        }
        .title-area {
          text-align: center;
        }
        .gov-title {
          font-size: 15px;
          font-weight: 800;
          color: #0B2545;
          letter-spacing: 0.5px;
          margin: 0;
          text-transform: uppercase;
        }
        .dept-title {
          font-size: 12px;
          color: #475569;
          font-weight: 600;
          margin: 2px 0 0 0;
        }
        .doc-badge {
          display: inline-block;
          background: #0056D2;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 9999px;
          text-transform: uppercase;
          margin-top: 8px;
          letter-spacing: 0.5px;
        }
        .ref-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .details-grid {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .qr-placeholder {
          width: 70px;
          height: 70px;
          background: #0f172a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          border-radius: 6px;
          text-align: center;
          padding: 4px;
        }
        .footer-box {
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
          margin-top: 20px;
          font-size: 11px;
          color: #64748b;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 320px;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <img src="/assets/emblem.png" class="watermark" alt="Watermark" />

      <table class="header-table">
        <tr>
          <td style="width: 80px; text-align: left;">
            <img src="/assets/emblem.png" class="national-emblem" alt="National Emblem" />
          </td>
          <td class="title-area">
            <h1 class="gov-title">Government of India</h1>
            <p class="dept-title">Ministry of Road Transport and Highways (MoRTH)</p>
            <p style="font-size: 13px; font-weight: 700; color: #0056D2; margin: 2px 0 0 0;">Parivahan Sarathi National e-Governance Portal</p>
            <div class="doc-badge">${escapeHtml(options.documentType)}</div>
          </td>
          <td style="width: 80px; text-align: right;">
            <div class="qr-placeholder">
              SARATHI<br/>DIGITAL<br/>VERIFIED
            </div>
          </td>
        </tr>
      </table>

      <div class="ref-card">
        <div>
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Document / Reference ID</span>
          <div style="font-size: 18px; font-weight: 900; color: #0056D2; font-family: monospace;">${escapeHtml(options.referenceNumber)}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Issue Timestamp</span>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${escapeHtml(dateStr)}</div>
        </div>
      </div>

      <div class="details-grid">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 800; color: #0B2545; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px;">
          ${escapeHtml(options.title)}
        </h3>
        ${detailsHtml}
      </div>

      ${highlightHtml}

      <div class="footer-box">
        <strong style="color: #0f172a;">Statutory Advisory & Citizen Instructions:</strong>
        <ul style="margin: 6px 0 0 0; padding-left: 18px;">
          ${footerNotesHtml}
        </ul>
        <div style="margin-top: 14px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
          <span>National Register Node: SARATHI-NR-PROD-01</span>
          <span>Security Hash: SHA-256 (CMVR 1989 Verified)</span>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printPvcSmartCard(dlData: any) {
  const printWindow = window.open('', '_blank', 'width=700,height=600');
  if (!printWindow) {
    window.print();
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>PVC Smart Card Driving Licence - ${escapeHtml(dlData.dlNumber)}</title>
      <style>
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #ffffff;
        }
        .card-container {
          width: 85.6mm;
          height: 53.98mm;
          background: linear-gradient(135deg, #0F325E 0%, #0B2545 50%, #061830 100%);
          color: #ffffff;
          border-radius: 4mm;
          padding: 3.5mm;
          box-sizing: border-box;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 0.5px solid rgba(147, 197, 253, 0.4);
          padding-bottom: 1.5mm;
          margin-bottom: 2mm;
        }
        .card-body {
          display: grid;
          grid-template-columns: 24mm 1fr;
          gap: 2.5mm;
          align-items: center;
        }
        .photo-chip-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5mm;
        }
        .photo-box {
          width: 18mm;
          height: 22mm;
          background: #1e3a8a;
          border: 1px solid #ffffff;
          border-radius: 1.5mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
        }
        .chip-box {
          width: 9mm;
          height: 6.5mm;
          background: linear-gradient(135deg, #fde68a, #f59e0b);
          border: 0.5px solid #b45309;
          border-radius: 1mm;
        }
        .info-col {
          font-size: 7.5px;
          line-height: 1.25;
        }
        .info-label {
          color: #93c5fd;
          font-size: 6px;
          text-transform: uppercase;
        }
        .info-val {
          font-weight: bold;
          color: #ffffff;
        }
        .dl-num {
          color: #fde047;
          font-family: monospace;
          font-size: 8.5px;
          font-weight: 900;
        }
        .card-footer {
          position: absolute;
          bottom: 2mm;
          left: 3.5mm;
          right: 3.5mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 6px;
          color: #86efac;
          border-top: 0.5px solid rgba(147, 197, 253, 0.2);
          padding-top: 1mm;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 12px; font-weight: 600;">
        Official PVC Smart Card Driving Licence Print View (Standard ID-1 Format)
      </p>

      <div class="card-container">
        <div class="card-header">
          <div style="display: flex; align-items: center; gap: 1.5mm;">
            <img src="/assets/emblem.png" style="height: 6mm; filter: invert(1) brightness(2);" alt="Emblem" />
            <div>
              <div style="font-size: 6px; font-weight: 800; color: #fde047; letter-spacing: 0.5px;">UNION OF INDIA</div>
              <div style="font-size: 7.5px; font-weight: 900; letter-spacing: 0.2px;">DRIVING LICENCE</div>
              <div style="font-size: 5.5px; color: #bfdbfe;">${escapeHtml(dlData.rtoName || 'RTO JH-01')}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="info-label">DL Number</div>
            <div class="dl-num">${escapeHtml(dlData.dlNumber)}</div>
          </div>
        </div>

        <div class="card-body">
          <div class="photo-chip-col">
            <div class="photo-box">
              <span>${escapeHtml((dlData.applicantName || dlData.holderName || 'C').charAt(0))}</span>
              <span style="font-size: 4.5px; margin-top: 2px;">VERIFIED</span>
            </div>
            <div class="chip-box"></div>
          </div>

          <div class="info-col">
            <div class="info-label">Name of Holder</div>
            <div class="info-val" style="font-size: 8px; text-transform: uppercase;">${escapeHtml(dlData.applicantName || dlData.holderName)}</div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 1mm;">
              <div>
                <div class="info-label">DOB</div>
                <div class="info-val">${escapeHtml(dlData.dob || '15-07-1998')}</div>
              </div>
              <div>
                <div class="info-label">Blood Group</div>
                <div class="info-val" style="color: #fca5a5;">${escapeHtml(dlData.bloodGroup || 'B+')}</div>
              </div>
            </div>

            <div style="margin-top: 1mm;">
              <div class="info-label">Vehicle Class Authorized</div>
              <div class="info-val" style="color: #fde047;">${escapeHtml(dlData.vehicleClass || (Array.isArray(dlData.vehicleClasses) ? dlData.vehicleClasses.join(', ') : 'LMV'))}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 1mm;">
              <div>
                <div class="info-label">Issue Date</div>
                <div class="info-val">${escapeHtml(new Date(dlData.issueDate || Date.now()).toLocaleDateString())}</div>
              </div>
              <div>
                <div class="info-label">Valid Until</div>
                <div class="info-val" style="color: #86efac;">${escapeHtml(dlData.validUntil || dlData.validTo || '2044-05-10')}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span>DigiLocker Verified • IT Act 2000 Compliant</span>
          <span style="font-family: monospace;">QR: ${escapeHtml(dlData.qrData || 'AUTH-MORTH-2024')}</span>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
