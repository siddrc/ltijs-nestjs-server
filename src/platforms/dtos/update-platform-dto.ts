import { IsBoolean, IsNumber } from 'class-validator';

export class UpdatePlatformDto {
  @IsBoolean()
  isEnabled: boolean;

  @IsBoolean()
  isLtiV3DeeplinkingEnabled: boolean;

  @IsBoolean()
  isLtiV3GradeServiceEnabled: boolean;

  @IsNumber()
  numberOfLicensesPurchased: number;
}
