import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`KAFKA_PORT: ${process.env.KAFKA_PORT}`);
  Logger.log(`KAFKA_HOST: ${process.env.KAFKA_HOST}`);
  return {
    kafka: {
      port: parseInt(process.env.KAFKA_HOST) || 4000,
      host: parseInt(process.env.KAFKA_HOST) || 4000,
    },
  };
};
