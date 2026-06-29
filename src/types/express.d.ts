declare namespace Express {
  interface Request {
    tenant?: {
      companyId: string;
      domainId: string;
      type: string;
      targetOrigin: string | null;
    };
  }
}
