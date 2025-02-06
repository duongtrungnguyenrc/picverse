import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  receiverId: DocumentId;

  @IsString()
  @IsNotEmpty()
  content: string;
}
