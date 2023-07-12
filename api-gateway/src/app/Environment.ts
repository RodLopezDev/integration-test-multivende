import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`PORT: ${process.env.PORT}`);
  Logger.log(`MONGO_URI: ${process.env.MONGO_URI}`);
  Logger.log(`MULTIVENDE_URL: ${process.env.MULTIVENDE_URL}`);
  return {
    port: parseInt(process.env.PORT) || 4000,
    callbackUrl: String(process.env.CALLBACK_URL) || '/',
    database: {
      uri: process.env.MONGO_URI,
    },
    multivende: {
      url: process.env.MULTIVENDE_URL,
    },
  };
};
