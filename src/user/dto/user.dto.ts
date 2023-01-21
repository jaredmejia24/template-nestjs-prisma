import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UserParamsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id: number;
}
