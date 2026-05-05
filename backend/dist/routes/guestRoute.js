"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const security_1 = require("../utils/security");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const asyncHandler_1 = require("../utils/asyncHandler");
const database_1 = require("../config/database");
const guestController_1 = require("../controllers/guestController");
const router = (0, express_1.Router)();
const controller = new guestController_1.GuestController();
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
router.get('/:id/document', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const guest = await database_1.prisma.guest.findUnique({
        where: { id: parseInt(id) }
    });
    if (!guest || !guest.idProofImage) {
        throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Document not found for this guest.');
    }
    const filePath = path_1.default.join(process.cwd(), guest.idProofImage);
    if (!fs_1.default.existsSync(filePath)) {
        throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Physical document file missing on server.');
    }
    try {
        const encryptedBuffer = fs_1.default.readFileSync(filePath);
        const decryptedBuffer = (0, security_1.decryptFile)(encryptedBuffer);
        // Determine mime types
        let contentType = 'image/jpeg';
        if (guest.idProofImage.endsWith('.png.enc'))
            contentType = 'image/png';
        if (guest.idProofImage.endsWith('.webp.enc'))
            contentType = 'image/webp';
        if (guest.idProofImage.endsWith('.pdf.enc'))
            contentType = 'application/pdf';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.send(decryptedBuffer);
    }
    catch (err) {
        console.error('Decryption failed for document:', err);
        throw new ApiError_1.ApiError(constants_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Security breach or decryption failure.');
    }
}));
exports.default = router;
//# sourceMappingURL=guestRoute.js.map