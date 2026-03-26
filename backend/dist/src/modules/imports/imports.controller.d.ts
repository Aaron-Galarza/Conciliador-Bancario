import { ImportsService } from './imports.service';
export declare class ImportsController {
    private readonly importsService;
    constructor(importsService: ImportsService);
    importJson(data: any): Promise<{
        sales: {
            imported: number;
            skipped: number;
            errors: string[];
        };
        settlements: {
            imported: number;
            skipped: number;
            errors: string[];
        };
        bankMovements: {
            imported: number;
            skipped: number;
            errors: string[];
        };
    }>;
}
