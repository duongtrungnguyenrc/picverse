export class CreateNotificationDto {
  account: DocumentId;
  from?: DocumentId;
  type: string;
  message: string;
}
