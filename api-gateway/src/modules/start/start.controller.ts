import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Get, Controller, Res } from '@nestjs/common';

@Controller('start')
export class StartController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  findAll(@Res() res: Response) {
    const value = this.configService.get<string>('multivende.url');

    const payload = {
      response_type: 'code',
      client_id: '896123781342',
      redirect_uri: `configuration`,
      scope: 'read:checkouts',
    };
    const route = `${value}/apps/authorize?${new URLSearchParams(
      payload,
    ).toString()}`;
    return res.redirect(route);
  }
}
