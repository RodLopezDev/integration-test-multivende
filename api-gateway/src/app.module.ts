import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          Logger.log(`PORT: ${process.env.PORT}`);
          Logger.log(`MONGO_URI: ${process.env.MONGO_URI}`);
          return {
            port: parseInt(process.env.PORT) || 4000,
            database: {
              uri: process.env.MONGO_URI,
            },
          };
        },
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
