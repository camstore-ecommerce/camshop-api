// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/common.proto

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/* eslint-disable */

export const protobufPackage = 'common';

export interface Empty {}

export class Pagination {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    limit: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sort: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    order: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    page: number;
}

export class PaginationResponse {
    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    sort: string;

    @ApiProperty()
    order: string;
}

export const COMMON_PACKAGE_NAME = 'common';
