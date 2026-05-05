import { Request, Response } from 'express';
export declare class StaffManagementController {
    /**
     * Create a new staff member with a random password
     */
    createStaff: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get all staff members
     */
    getAllStaff: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Toggle staff active status
     */
    toggleStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=staffManagementController.d.ts.map