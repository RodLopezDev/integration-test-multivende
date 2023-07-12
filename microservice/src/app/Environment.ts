import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`KAFKA_PORT: ${process.env.KAFKA_PORT}`);
  Logger.log(`KAFKA_HOST: ${process.env.KAFKA_HOST}`);
  Logger.log(`MONGO_URI: ${process.env.MONGO_URI}`);
  Logger.log(`MULTIVENDE_URL: ${process.env.MULTIVENDE_URL}`);
  return {
    database: {
      uri: process.env.MONGO_URI,
    },
    kafka: {
      host: String(process.env.KAFKA_HOST) || '',
      port: parseInt(process.env.KAFKA_PORT) || 4000,
    },
    multivende: {
      url: String(process.env.MULTIVENDE_URL) || '',
    },
  };
};
