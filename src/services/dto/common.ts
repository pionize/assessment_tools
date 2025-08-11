// Common, reusable DTO types for API responses

export interface ResponseSchemaDTO {
	response_code: string;
	response_message: string;
}

export interface ApiResponseEnvelope<TDetail> {
	response_schema: ResponseSchemaDTO;
	response_detail: TDetail;
}

