import React from 'react';

interface Props {
  folio: any;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhone?: string;
  hotelVat?: string;
}

export const ThermalReceipt: React.FC<Props> = ({
  folio,
  hotelName = "ITAHARI NAMUNA COLLEGE HOTEL",
  hotelAddress = "Itahari-6, Sunsari, Nepal",
  hotelPhone = "+977-25-585000",
  hotelVat = "600987654"
}) => {
  return (
    <div id="thermal-receipt" className="p-4 bg-white text-black font-mono text-[12px] leading-tight w-[80mm] mx-auto print:m-0 print:w-full">
      {/* Header */}
      <div className="text-center mb-4 border-b border-dashed border-black pb-4">
        <h1 className="text-sm font-bold uppercase mb-1">{hotelName}</h1>
        <p className="text-[10px] mb-0.5">{hotelAddress}</p>
        <p className="text-[10px] mb-0.5">Tel: {hotelPhone}</p>
        <p className="text-[10px]">PAN/VAT: {hotelVat}</p>
      </div>

      {/* Booking Info */}
      <div className="mb-4 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Booking #:</span>
          <span className="font-bold">{folio.bookingNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Guest:</span>
          <span className="uppercase">{folio.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span>Room:</span>
          <span>{folio.roomNumber} ({folio.roomType})</span>
        </div>
      </div>

      {/* Items Table */}
      <div className="border-t border-b border-dashed border-black py-2 mb-4">
        <div className="flex justify-between font-bold mb-2 text-[10px] uppercase">
          <span className="flex-1 text-left">Description</span>
          <span className="w-12 text-center">Qty</span>
          <span className="w-20 text-right">Amount</span>
        </div>
        
        {/* Room Charges */}
        <div className="flex justify-between mb-2">
          <span className="flex-1 text-left">Room Stay</span>
          <span className="w-12 text-center">1</span>
          <span className="w-20 text-right">{Number(folio.stayCharges).toFixed(2)}</span>
        </div>

        {/* Extra Services */}
        {folio.extraServices?.map((item: any) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span className="flex-1 text-left truncate pr-2">{item.extraService.name}</span>
            <span className="w-12 text-center">{item.quantity}</span>
            <span className="w-20 text-right">{Number(item.totalPrice).toFixed(2)}</span>
          </div>
        ))}

        {/* POS Orders */}
        {folio.posServiceOrders?.map((order: any) => (
          <div key={order.id} className="flex justify-between mb-1">
            <span className="flex-1 text-left">POS #{order.orderNumber}</span>
            <span className="w-12 text-center">1</span>
            <span className="w-20 text-right">{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Gross Total:</span>
          <span>Rs. {Number(folio.totalCharges).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-700">
          <span>Paid Amount:</span>
          <span>-Rs. {Number(folio.totalPayments).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-[14px] pt-1 border-t border-dashed border-black">
          <span>BALANCE DUE:</span>
          <span>Rs. {Number(folio.balance).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-dashed border-black">
        <p className="text-[11px] mb-2 font-bold italic">Thank you for your stay!</p>
        <p className="text-[9px] uppercase tracking-wider">Please visit again</p>
        <div className="mt-4 flex justify-center">
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="text-[8px] text-gray-400">QR CODE</span>
            </div>
        </div>
        <p className="text-[8px] mt-2 text-gray-400">Software by Antigravity PMS</p>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            margin: 0;
            padding: 0;
          }
          #thermal-receipt {
            width: 100%;
            padding: 10mm;
          }
        }
      `}</style>
    </div>
  );
};
