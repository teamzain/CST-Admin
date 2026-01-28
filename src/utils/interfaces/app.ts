export interface TAppConfig {
    NAME: string;
    PORT: number;
    DESC: string;
    VERSION: string;
    PREFIX: string;
    logger: boolean;
    swagger: boolean;
    CORS: string[];
}
