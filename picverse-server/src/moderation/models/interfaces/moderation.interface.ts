export interface IModerationService {
  moderateContent(contentOrUrl: string): Promise<string[] | null>;
}
