/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Bulk from "../entity/Bulk";

export function MapBulk(data: any): Bulk {
  return {
    id: String(data?._id),
    state: String(data?.state),
    warehouseId: String(data?.warehouseId),
    current: Number(data?.current),
    total: Number(data?.total),
    hasError: Boolean(data?.hasError),
    errorType: String(data?.errorType),
    retries: Number(data?.retries),
    updatedAt: String(data?.updatedAt),
  };
}
