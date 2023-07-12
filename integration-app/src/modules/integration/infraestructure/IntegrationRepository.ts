import axios from "axios";
import Environment from "../../../app/config/Environment";

import Integration from "../domain/entity/Integration";
import { MapIntegration } from "../domain/mapper/Integration.mapper";

class IntegrationRepository {
  async getIntegration(): Promise<Integration> {
    const result = await axios.get<any[]>(`${Environment.apiUrl}/integration`);
    if (!result?.data?.length) {
      throw new Error("DATA_NOT_FOUND");
    }
    const integrations = result.data?.map(MapIntegration);
    return integrations?.[0];
  }
}

export default IntegrationRepository;
