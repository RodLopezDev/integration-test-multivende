import { TokenResponse } from '../entities/token.entity';

export function MapToken(data: any): TokenResponse {
  return {
    token: data?.token,
    refreshToken: data?.refreshToken,
  };
}
