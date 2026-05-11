import React from 'react';

interface Props {
  folio: any;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhone?: string;
  hotelWebsite?: string;
  hotelVat?: string;
}

export const ProfessionalInvoice: React.FC<Props> = ({
  folio,
  hotelName = "ITAHARI NAMUNA COLLEGE HOTEL",
  hotelAddress = "Itahari-6, Sunsari, Nepal",
  hotelPhone = "+977-25-585000, 585001",
  hotelWebsite = "www.itaharipms.com",
  hotelVat = "PAN/VAT No: 600987654"
}) => {
  const stayCharges = Number(folio.stayCharges || 0);
  const extraServices = folio.extraServices || [];
  const posOrders = folio.posServiceOrders || [];

  const subtotal = stayCharges + 
    extraServices.reduce((acc: number, curr: any) => acc + Number(curr.totalPrice), 0) + 
    posOrders.reduce((acc: number, curr: any) => acc + Number(curr.totalAmount), 0);
  
  // Tax Math
  const serviceCharge = subtotal * 0.10;
  const taxableAmount = subtotal + serviceCharge;
  const vat = taxableAmount * 0.13;
  const grandTotal = taxableAmount + vat;
  
  const totalPaid = Number(folio.totalPayments || 0);
  const balance = grandTotal - totalPaid;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div id="professional-invoice" className="invoice-container">
      {/* Letterhead */}
      <div className="invoice-header">
        <h1 className="hotel-name">{hotelName}</h1>
        <p className="hotel-info">{hotelAddress}</p>
        <p className="hotel-contact">Tel: {hotelPhone} | {hotelWebsite}</p>
        <p className="hotel-vat">{hotelVat}</p>
        <h2 className="invoice-title">Guest Invoice</h2>
      </div>

      {/* Guest & Invoice Meta */}
      <div className="invoice-meta">
        <div className="guest-info">
            <p className="guest-label"><strong>To:</strong></p>
            <p className="guest-name">{folio.guestName}</p>
            <p>{folio.guestAddress || 'Registered Guest'}</p>
            <p>{folio.guestPhone || ''}</p>
        </div>
        <div className="meta-info">
            <p><strong>Invoice #:</strong> {folio.bookingNumber || folio.id?.toString().toUpperCase()}</p>
            <p><strong>Date:</strong> {formatDate(new Date().toISOString())}</p>
            <p><strong>Room:</strong> {folio.roomNumber} ({folio.roomType})</p>
            <p><strong>Period:</strong> {formatDate(folio.checkInDate)} - {formatDate(folio.checkOutDate || new Date().toISOString())}</p>
        </div>
      </div>

      {/* Item Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="text-left">Description</th>
            <th className="text-center">Quantity</th>
            <th className="text-right">Rate</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Accommodation */}
          <tr className="table-row">
            <td>
                <strong>Accommodation</strong>
                <div className="item-subtext">Room {folio.roomNumber} Stay Charges</div>
            </td>
            <td className="text-center">1</td>
            <td className="text-right">{stayCharges.toLocaleString()}</td>
            <td className="text-right">{stayCharges.toLocaleString()}</td>
          </tr>

          {/* Extra Services */}
          {extraServices.map((item: any) => (
            <tr key={item.id} className="table-row">
              <td>
                  <strong>{item.extraService.name}</strong>
                  <div className="item-subtext">Additional Service</div>
              </td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{(Number(item.totalPrice) / item.quantity).toLocaleString()}</td>
              <td className="text-right">{Number(item.totalPrice).toLocaleString()}</td>
            </tr>
          ))}

          {/* POS Orders */}
          {posOrders.map((order: any) => (
            <tr key={order.id} className="table-row">
              <td>
                  <strong>Food & Beverage / POS</strong>
                  <div className="item-subtext">Order #{order.orderNumber}</div>
              </td>
              <td className="text-center">1</td>
              <td className="text-right">{Number(order.totalAmount).toLocaleString()}</td>
              <td className="text-right">{Number(order.totalAmount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-box">
          <div className="summary-row">
            <span>Sub-Total</span>
            <span>{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Service Charge (10%)</span>
            <span>{serviceCharge.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>VAT (13%)</span>
            <span>{vat.toLocaleString()}</span>
          </div>
          <div className="summary-row grand-total">
            <span>Grand Total</span>
            <span>Rs. {grandTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row advance-paid">
            <span>Less: Advance Paid</span>
            <span>({totalPaid.toLocaleString()})</span>
          </div>
          <div className="summary-row balance-due">
            <span>Balance Due</span>
            <span>Rs. {balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notes & Words */}
      <div className="invoice-notes">
          <p><strong>Amount in words:</strong> Rupees {Number(grandTotal.toFixed(0)).toLocaleString()} Only</p>
      </div>

      {/* Signatures Footer */}
      <div className="signatures-section">
        <div className="signature-box">
            <div className="signature-line">
                <strong>Guest Signature</strong>
            </div>
        </div>
        <div className="signature-box">
            <div className="signature-line">
                <strong>Authorized Signatory</strong>
            </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="legal-footer">
          <p>This is a computer generated invoice and does not require a physical stamp unless requested.</p>
          <p>Thank you for staying with {hotelName}.</p>
      </div>
    </div>
  );
};
