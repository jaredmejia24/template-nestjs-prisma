import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UserParamsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id: number;
}

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  lastName: string;
}
