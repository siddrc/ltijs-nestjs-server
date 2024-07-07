import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RevivePlatformDto {
  @IsString()
  platformURL: string;

  @IsString()
  name: string;

  @IsString()
  clientId: string;

  @IsString()
  authenticationEndpoint: string;

  @IsString()
  accesstokenEndpoint: string;

  @IsString()
  authConfigKeyEndpoint: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsNumber()
  numberOfLicensesPurchased: number;

  @IsBoolean()
  isLtiV3DeeplinkingEnabled: boolean;

  @IsBoolean()
  isLtiV3GradeServiceEnabled: boolean;
}
