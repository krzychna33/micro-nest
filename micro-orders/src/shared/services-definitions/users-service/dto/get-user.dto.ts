import { ObjectId } from 'mongoose';

export class GetUserDtoResponse {
  email: string;
  isActive: boolean;
}

export class GetUserDtoRequest {
  id: string;
}
