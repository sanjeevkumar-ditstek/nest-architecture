// common/dto/response.dto.ts

export class ResponseDto<T> {
  data: T | null;
  message: string;
  statusCode: number;

  constructor(data: T | null, message: string, statusCode: number) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
