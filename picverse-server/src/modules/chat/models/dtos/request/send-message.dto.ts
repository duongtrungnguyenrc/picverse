import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  receiverId?: DocumentId;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  conversationId?: DocumentId;

  @IsString()
  @IsNotEmpty()
  content: string;
}
