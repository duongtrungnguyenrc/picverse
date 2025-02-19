export class CreateNotificationDto {
  to: DocumentId;
  from?: DocumentId;
  type: string;
  message: string;
}
