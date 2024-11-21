import { Types } from "mongoose";

export interface Category {
	_id: Types.ObjectId;
	name: string;
}