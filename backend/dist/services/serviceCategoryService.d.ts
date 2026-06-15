import { Prisma, ServiceStatus } from '@prisma/client';
export declare class ServiceCategoryService {
    getAllCategories(filters: {
        search?: string;
        status?: ServiceStatus;
    }): Promise<({
        _count: {
            services: number;
        };
    } & {
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        icon: string | null;
    })[]>;
    createCategory(data: Prisma.ServiceCategoryCreateInput): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        icon: string | null;
    }>;
    updateCategory(id: number, data: Prisma.ServiceCategoryUpdateInput): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        icon: string | null;
    }>;
    deleteCategory(id: number): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        icon: string | null;
    }>;
    getAllServices(filters: {
        categoryId?: number;
        search?: string;
        status?: ServiceStatus;
    }): Promise<({
        category: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.ServiceStatus;
            slug: string;
            icon: string | null;
        };
    } & {
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        price: Prisma.Decimal;
        categoryId: number;
    })[]>;
    getServiceById(id: number): Promise<{
        category: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.ServiceStatus;
            slug: string;
            icon: string | null;
        };
    } & {
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        price: Prisma.Decimal;
        categoryId: number;
    }>;
    createService(data: Prisma.ServiceUncheckedCreateInput): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        price: Prisma.Decimal;
        categoryId: number;
    }>;
    updateService(id: number, data: Prisma.ServiceUncheckedUpdateInput): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        price: Prisma.Decimal;
        categoryId: number;
    }>;
    deleteService(id: number): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ServiceStatus;
        slug: string;
        price: Prisma.Decimal;
        categoryId: number;
    }>;
}
//# sourceMappingURL=serviceCategoryService.d.ts.map