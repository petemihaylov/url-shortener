export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  createdAt: Date;
  clicks: number;
}

export interface CreateUrlDto {
  originalUrl: string;
  customAlias?: string;
}