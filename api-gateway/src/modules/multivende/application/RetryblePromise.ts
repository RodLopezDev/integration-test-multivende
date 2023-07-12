import { AxiosError } from 'axios';
import { MultivendeController } from '../multivende.controller';
import { InternalServerErrorException } from '@nestjs/common';

export class RetryablePromiseEvent {
  constructor(private readonly controller: MultivendeController) {}

  async run<T>(promise: (token: string) => Promise<T>) {
    const promiseRefresh = this.controller.refresh;

    const token = await this.controller.getToken();

    async function concurrencyFunction<T>(
      _token: string,
      promise: (token: string) => Promise<T>,
      isRetry = false,
    ) {
      if (isRetry) {
        console.log('RUNNING 2 TIME');
        const newToken = await promiseRefresh();
        _token = newToken.clientToken;
      } else {
        console.log('RUNNING 1 TIME');
      }

      try {
        return await promise(_token);
      } catch (e) {
        if (isRetry) {
          throw new InternalServerErrorException(
            'ERROR_RUNNING_AUTH_SERVICE_AFTER_REFRESH',
          );
        }
        if (e instanceof AxiosError) {
          if (e.response.status === 403) {
            concurrencyFunction(_token, promise, true);
          }
        }
        throw new InternalServerErrorException('ERROR_RUNNING_AUTH_SERVICE');
      }
    }

    return concurrencyFunction(token.clientToken, promise);
  }
}
