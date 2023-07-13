import axios from "axios";
import Bulk from "../domain/entity/Bulk";
import Environment from "../../../app/config/Environment";
import { MapBulk } from "../domain/mapper/bulk.mapper";

class BulkRepository {
  async bulk(): Promise<Bulk> {
    const result = await axios.get<{ data: any }>(
      `${Environment.apiUrl}/bulk-init`
    );
    if (!result?.data?.data) {
      throw new Error("DATA_NOT_FOUND");
    }
    return MapBulk(result?.data?.data);
  }
  async getBulkById(bulkId: string): Promise<Bulk> {
    const result = await axios.get<{ data: any }>(
      `${Environment.apiUrl}/bulk-state/${bulkId}`
    );
    if (!result?.data?.data) {
      throw new Error("DATA_NOT_FOUND");
    }
    return MapBulk(result?.data?.data);
  }
}

export default BulkRepository;
