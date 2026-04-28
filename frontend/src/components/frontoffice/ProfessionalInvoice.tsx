import React from 'react';

interface Props {
  folio: any;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhone?: string;
  hotelEmail?: string;
  hotelWebsite?: string;
  hotelVat?: string;
}

const COLORS = {
  BLACK: '#000000',
  DARK_GRAY: '#333333',
  LIGHT_GRAY: '#F3F4F6',
  BORDER: '#000000',
  WHITE: '#FFFFFF'
};

export const ProfessionalInvoice: React.FC<Props> = ({
  folio,
  hotelName = "ANTIGRAVITY LUXE HOTEL & RESORTS",
  hotelAddress = "Elite Plaza, Ward No. 3, Kathmandu, Nepal",
  hotelPhone = "+977-1-4400000, 4400001",
  hotelEmail = "billing@antigravityluxe.com",
  hotelWebsite = "www.antigravityluxe.com",
  hotelVat = "PAN/VAT No: 600123456"
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
    <div id="professional-invoice" style={{ 
      backgroundColor: COLORS.WHITE, 
      color: COLORS.BLACK, 
      padding: '40px 60px', 
      width: '210mm', 
      minHeight: '297mm', 
      margin: '0 auto',
      fontFamily: '"Times New Roman", Times, serif',
      boxSizing: 'border-box'
    }}>
      {/* Letterhead */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0', letterSpacing: '1px' }}>{hotelName}</h1>
        <p style={{ fontSize: '12px', margin: '5px 0' }}>{hotelAddress}</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>Tel: {hotelPhone} | {hotelWebsite}</p>
        <p style={{ fontSize: '12px', margin: '2px 0', fontWeight: 'bold' }}>{hotelVat}</p>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px', borderBottom: '1px solid #000', display: 'inline-block', paddingBottom: '2px' }}>Guest Invoice</h2>
      </div>

      {/* Guest & Invoice Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '13px' }}>
        <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>To:</strong></p>
            <p style={{ margin: '0 0 3px 0', fontSize: '15px', fontWeight: 'bold' }}>{folio.guestName}</p>
            <p style={{ margin: '0 0 3px 0' }}>{folio.guestAddress || 'Registered Guest'}</p>
            <p style={{ margin: '0' }}>{folio.guestPhone || ''}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>Invoice #:</strong> {folio.bookingNumber || folio.id?.toString().toUpperCase()}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Date:</strong> {formatDate(new Date().toISOString())}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Room:</strong> {folio.roomNumber} ({folio.roomType})</p>
            <p style={{ margin: '0' }}><strong>Period:</strong> {formatDate(folio.checkInDate)} - {formatDate(folio.checkOutDate || new Date().toISOString())}</p>
        </div>
      </div>

      {/* Item Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #000', borderTop: '2px solid #000' }}>
            <th style={{ padding: '12px 5px', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '12px 5px', textAlign: 'center' }}>Quantity</th>
            <th style={{ padding: '12px 5px', textAlign: 'right' }}>Rate</th>
            <th style={{ padding: '12px 5px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Accommodation */}
          <tr style={{ borderBottom: '1px solid #EEE' }}>
            <td style={{ padding: '12px 5px' }}>
                <strong>Accommodation</strong>
                <div style={{ fontSize: '11px', color: '#555' }}>Room {folio.roomNumber} Stay Charges</div>
            </td>
            <td style={{ padding: '12px 5px', textAlign: 'center' }}>1</td>
            <td style={{ padding: '12px 5px', textAlign: 'right' }}>{stayCharges.toLocaleString()}</td>
            <td style={{ padding: '12px 5px', textAlign: 'right' }}>{stayCharges.toLocaleString()}</td>
          </tr>

          {/* Extra Services */}
          {extraServices.map((item: any) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #EEE' }}>
              <td style={{ padding: '12px 5px' }}>
                  <strong>{item.extraService.name}</strong>
                  <div style={{ fontSize: '11px', color: '#555' }}>Additional Service</div>
              </td>
              <td style={{ padding: '12px 5px', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '12px 5px', textAlign: 'right' }}>{(Number(item.totalPrice) / item.quantity).toLocaleString()}</td>
              <td style={{ padding: '12px 5px', textAlign: 'right' }}>{Number(item.totalPrice).toLocaleString()}</td>
            </tr>
          ))}

          {/* POS Orders */}
          {posOrders.map((order: any) => (
            <tr key={order.id} style={{ borderBottom: '1px solid #EEE' }}>
              <td style={{ padding: '12px 5px' }}>
                  <strong>Food & Beverage / POS</strong>
                  <div style={{ fontSize: '11px', color: '#555' }}>Order #{order.orderNumber}</div>
              </td>
              <td style={{ padding: '12px 5px', textAlign: 'center' }}>1</td>
              <td style={{ padding: '12px 5px', textAlign: 'right' }}>{Number(order.totalAmount).toLocaleString()}</td>
              <td style={{ padding: '12px 5px', textAlign: 'right' }}>{Number(order.totalAmount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>Sub-Total</span>
            <span>{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>Service Charge (10%)</span>
            <span>{serviceCharge.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>VAT (13%)</span>
            <span>{vat.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #000', fontWeight: 'bold', fontSize: '15px' }}>
            <span>Grand Total</span>
            <span>Rs. {grandTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#14532D' }}>
            <span>Less: Advance Paid</span>
            <span>({totalPaid.toLocaleString()})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '16px' }}>
            <span>Balance Due</span>
            <span>Rs. {balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notes & Words */}
      <div style={{ marginTop: '40px', fontSize: '12px' }}>
          <p><strong>Amount in words:</strong> Rupees {Number(grandTotal.toFixed(0)).toLocaleString()} Only</p>
      </div>

      {/* Signatures Footer */}
      <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>
                <strong>Guest Signature</strong>
            </div>
        </div>
        <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>
                <strong>Authorized Signatory</strong>
            </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div style={{ position: 'absolute', bottom: '40px', left: '60px', right: '60px', textAlign: 'center', fontSize: '10px', color: '#888' }}>
          <p>This is a computer generated invoice and does not require a physical stamp unless requested.</p>
          <p>Thank you for staying with {hotelName}.</p>
      </div>
    </div>
  );
};
