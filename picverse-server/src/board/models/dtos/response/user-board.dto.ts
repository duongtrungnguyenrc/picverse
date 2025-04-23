import { ApiResponseProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

class ResourceDto {
  @ApiResponseProperty()
  _id: Types.ObjectId;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  type: string;

  @ApiResponseProperty()
  storage: string;

  @ApiResponseProperty()
  size: number;

  @ApiResponseProperty()
  width?: number;

  @ApiResponseProperty()
  height?: number;

  @ApiResponseProperty()
  mimeType: string;
}

class PinDto {
  @ApiResponseProperty()
  _id: Types.ObjectId;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty({ type: () => ResourceDto })
  resource: ResourceDto;
}

export class UserBoardDto {
  @ApiResponseProperty()
  _id: Types.ObjectId;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  isPrivate: boolean;

  @ApiResponseProperty()
  totalPins: number;

  @ApiResponseProperty({ type: () => [PinDto] })
  latestPins: PinDto[];

  @ApiResponseProperty()
  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
