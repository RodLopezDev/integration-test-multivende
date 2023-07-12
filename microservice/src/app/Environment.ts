import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`KAFKA_PORT: ${process.env.KAFKA_PORT}`);
  Logger.log(`KAFKA_HOST: ${process.env.KAFKA_HOST}`);
  return {
    kafka: {
      host: String(process.env.KAFKA_HOST) || '',
      port: parseInt(process.env.KAFKA_PORT) || 4000,
    },
  };
};
