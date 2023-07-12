import { BulkRunningDto } from 'src/dto/BulkRunningDto';

export class MessageResult {
  constructor(private readonly dto: BulkRunningDto) {}
  SuccessMessage() {
    return {};
  }
  ErrorMessage() {
    return {};
  }
}
