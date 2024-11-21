import { Types } from "mongoose";

export interface Manufacturer {
	_id: Types.ObjectId;
	name: string;
}