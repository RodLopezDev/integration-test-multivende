import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`PORT: ${process.env.PORT}`);
  Logger.log(`MONGO_URI: ${process.env.MONGO_URI}`);
  return {
    port: parseInt(process.env.PORT) || 4000,
    database: {
      uri: process.env.MONGO_URI,
    },
  };
};
