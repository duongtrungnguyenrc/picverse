import { ApiResponseProperty } from "@nestjs/swagger";

export class ProfileDetailDto {
  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  birth: Date;

  @ApiResponseProperty()
  gender: string;

  @ApiResponseProperty()
  phone: string;

  @ApiResponseProperty()
  avatar: string;

  @ApiResponseProperty()
  bio: string;

  @ApiResponseProperty()
  isPublic: boolean;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
