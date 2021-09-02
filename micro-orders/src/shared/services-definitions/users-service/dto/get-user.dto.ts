import { ObjectId } from 'mongoose';

export class GetUserDtoResponse {
  email: string;
  isActive: boolean;
  _id: string;
}

export class GetUserDtoRequest {
  id: string;
}
