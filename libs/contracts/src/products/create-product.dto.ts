import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
	name: string;

    @ApiPropertyOptional()
    @IsOptional()
	description: string;

    @ApiProperty()
    @IsString()
	category_id: string;

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
	tags: string[];

    @ApiProperty()
    @IsString()
	manufacturer_id: string;

    @ApiPropertyOptional()
    @IsOptional()
    attributes: any;

    @IsString()
    @IsOptional()
	image_url: string;

}