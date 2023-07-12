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
  async save(
    name: string,
    clientId: string,
    clientSecret: string
  ): Promise<Integration> {
    const result = await axios.post<any>(`${Environment.apiUrl}/integration`, {
      name,
      clientId,
      clientSecret,
    });
    if (!result?.data) {
      throw new Error("DATA_NOT_FOUND");
    }
    return MapIntegration(result.data);
  }
  async remove(): Promise<boolean> {
    const result = await axios.delete<any>(`${Environment.apiUrl}/integration`);
    if (!result?.data) {
      throw new Error("DATA_NOT_FOUND");
    }
    return Boolean(result.data);
  }
  async auth(): Promise<boolean> {
    const result = await axios.post<any>(`${Environment.apiUrl}/multivende`);
    if (!result?.data) {
      throw new Error("DATA_NOT_FOUND");
    }
    return Boolean(result.data);
  }
}

export default IntegrationRepository;
