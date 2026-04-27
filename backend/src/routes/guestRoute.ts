import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { decryptFile } from '../utils/security';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../config/database';
import { GuestController } from '../controllers/guestController';

const router = Router();
const controller = new GuestController();

/**
 * Standard Guest CRUD Operations
 */
router.get('/', controller.getAllGuests);
router.get('/statistics', controller.getGuestStats);
router.get('/:id', controller.getGuestById);
router.get('/:id/bookings', controller.getGuestBookings);
router.post('/', controller.createGuest);
router.put('/:id', controller.updateGuest);
router.delete('/:id', controller.deleteGuest);

/**
 * SECURE ENDPOINT: Get decrypted guest document
 * This ensures that sensitive ID proofs are only accessible via authenticated API calls
 * and are decrypted on-the-fly.
 */
router.get('/:id/document', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const guest = await prisma.guest.findUnique({
    where: { id: parseInt(id) }
  });

  if (!guest || !guest.idProofImage) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Document not found for this guest.');
  }

  const filePath = path.join(process.cwd(), guest.idProofImage);
  
  if (!fs.existsSync(filePath)) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Physical document file missing on server.');
  }

  try {
    const encryptedBuffer = fs.readFileSync(filePath);
    const decryptedBuffer = decryptFile(encryptedBuffer);
    
    // Determine mime types
    let contentType = 'image/jpeg';
    if (guest.idProofImage.endsWith('.png.enc')) contentType = 'image/png';
    if (guest.idProofImage.endsWith('.webp.enc')) contentType = 'image/webp';
    if (guest.idProofImage.endsWith('.pdf.enc')) contentType = 'application/pdf';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed for document:', err);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Security breach or decryption failure.');
  }
}));

export default router;