import { Types } from "mongoose";

export class CategoryDto {
	_id: Types.ObjectId;
	name: string;
	deleted_at: Date;
}
