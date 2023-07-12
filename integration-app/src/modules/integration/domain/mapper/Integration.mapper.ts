/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Integration from "../entity/Integration";

export function MapIntegration(data: any): Integration {
  return {
    id: String(data?._id),
    name: String(data?.name),
    clientId: String(data?.clientId),
    clientSecret: String(data?.clientSecret),
    clientCode: String(data?.clientCode),
    clientToken: String(data?.clientToken),
    clientRefreshToken: String(data?.clientRefreshToken),
  };
}
