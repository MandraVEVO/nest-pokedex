import { IsNumber, IsOptional, IsPositive, Min, MIN } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Min(1)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    offset?: number;
}