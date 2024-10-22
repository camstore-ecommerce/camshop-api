import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { ClientConfigService } from '../client-config/client-config.service';

@Injectable()
export class CdnService {
    constructor(private readonly clientConfigService: ClientConfigService) {
        cloudinary.config({
            cloud_name: clientConfigService.getCdnCloudName(),
            api_key: clientConfigService.getCdnApiKey(),
            api_secret: clientConfigService.getCdnApiSecret()
        })
    }

    async uploadImage(file: Express.Multer.File, public_id: string, folder:string, width?: number, height?: number): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
            { 
                folder: `camshop/${folder}`,
                overwrite: true,
                public_id,
                transformation: [{ width, height, crop: "limit" }]
            }, (error, result) => {
                if (error) {
                    return reject(error); // Rejects the promise if there's an error
                }
                if (result === undefined) {
                    return reject(new Error("Upload resulted in undefined")); // Rejects the promise if result is undefined
                }
                resolve(result); // Resolves the promise with the result if it's not undefined
            }).end(file.buffer);
        });
    }

    async deleteImage(public_id: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error)
                    return reject(error)
                resolve(result)
            })
        })
    }
}
