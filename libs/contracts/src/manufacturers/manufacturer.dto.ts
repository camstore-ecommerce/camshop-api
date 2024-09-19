import { Types } from "mongoose";

export class ManufacturerDto {
	_id: Types.ObjectId;
	name: string;
	deleted_at: Date;
}
