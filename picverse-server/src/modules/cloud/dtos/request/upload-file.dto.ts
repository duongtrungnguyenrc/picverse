import {IsEnum, IsMongoId, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

import {ECloudStorage} from "@modules/cloud";

export class UploadFileDto {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsMongoId()
  parentId?: DocumentId;

  @ApiProperty({enum: ECloudStorage, required: false})
  @IsOptional()
  @IsEnum(ECloudStorage)
  storage?: ECloudStorage;
}
