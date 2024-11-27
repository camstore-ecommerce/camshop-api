import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

const api_documentation_credentials = {
	name: process.env.DOCUMENTS_NAME,
	pass: process.env.DOCUMENTS_PASS,
};

export function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Camshop API')
		.setDescription('The Camshop API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);

	const http_adapter = app.getHttpAdapter();

	function parseAuthHeader(input: string): { name: string; pass: string } {
		const [, encodedPart] = input.split(' ');
		const text = Buffer.from(encodedPart, 'base64').toString('ascii');
		const [name, pass] = text.split(':');
		return { name, pass };
	}

	function unauthorizedResponse(res: Response, next: NextFunction): void {
		res.status(401).set('WWW-Authenticate', 'Basic');
		next();
	}

	function authMiddleware(req: Request, res: Response, next: NextFunction): void {
		if (!req.headers.authorization) {
			return unauthorizedResponse(res, next);
		}
	
		const credentials = parseAuthHeader(req.headers.authorization);
	
		if (
			credentials?.name !== api_documentation_credentials.name ||
			credentials?.pass !== api_documentation_credentials.pass
		) {
			return unauthorizedResponse(res, next);
		}
	
		next();
	}

	http_adapter.use('/api', authMiddleware);

	SwaggerModule.setup('api', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});
}