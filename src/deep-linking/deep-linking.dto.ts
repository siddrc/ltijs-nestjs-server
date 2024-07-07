import { IsArray } from 'class-validator';
export class DeepLinkingDto {
  @IsArray()
  courses: CoursesDto[];
}
export class CoursesDto {
  courseId: number;
  courseName: string;
}
