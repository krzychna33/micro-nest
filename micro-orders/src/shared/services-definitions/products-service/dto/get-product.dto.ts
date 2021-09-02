export class GetProductDtoResponse {
  _id: string;
  price: number;
  amountAvailable: number;
  name: string;
}

export class GetProductDtoRequest {
  id: string;
}
