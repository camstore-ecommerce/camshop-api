import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";
import { ReferenceObject, SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function ApiBodyWithSingleFile(
	name = 'file',
	body_properties?: object,
	required_properties?: string[],
	local_options?: MulterOptions,
) {
	let properties: Record<string, SchemaObject | ReferenceObject>;
	const api_body = {
		schema: {
			type: 'object',
			properties,
			required: required_properties,
		},
	};
	if (!body_properties) {
		api_body.schema = {
			...api_body.schema,
			properties: {
				[name]: {
					type: 'string',
					format: 'binary',
				},
			},
		};
	} else {
		api_body.schema = {
			...api_body.schema,
			properties: {
				...body_properties,
				[name]: {
					type: 'string',
					format: 'binary',
				},
			},
		};
	}
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiBody(api_body),
		UseInterceptors(FileInterceptor(name, local_options)),
	);
}

export function ApiDocsPagination(entity: string) {
	return applyDecorators(
		ApiQuery({
			name: 'limit',
			type: Number,
			examples: {
				'10': {
					value: 10,
					description: `Get 10 ${entity}s`,
				},
				'50': {
					value: 50,
					description: `Get 50 ${entity}s`,
				},
			},
			required: false,
		}),
		ApiQuery({
			name: 'sort',
			type:  String,
			examples: {
				'id': {
					value: 'id',
					description: 'Sort by id',
				},
				'_id': {
					value: '_id',
					description: 'Sort by _id',
				}
			},
			required: false,
		}),
		ApiQuery({
			name: 'order',
			type: String,
			examples: {
				'asc': {
					value: 'asc',
					description: 'Ascending order',
				},
				'desc': {
					value: 'desc',
					description: 'Descending order',
				},
			},
			required: false,
		}),
		ApiQuery({
			name: 'page',
			type: Number,
			examples: {
				'1': {
					value: 1,
					description: 'Page 1',
				},
				'2': {
					value: 2,
					description: 'Page 2',
				},
			},
			required: false,
		})

	);
}