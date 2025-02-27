import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

class ResourceDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  storage: string;

  @ApiProperty()
  size: number;

  @ApiProperty({ required: false })
  width?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty()
  mimeType: string;
}

class PinDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: () => ResourceDto })
  resource: ResourceDto;
}

export class UserBoardDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  totalPins: number;

  @ApiProperty({ type: () => [PinDto] })
  latestPins: PinDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
