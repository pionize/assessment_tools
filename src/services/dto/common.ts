// Common, reusable DTO types for API responses

export interface ResponseSchemaDTO {
	response_code: string;
	response_message: string;
}

// Historic envelope used by authenticate
export interface ApiResponseEnvelope<TDetail> {
	response_schema: ResponseSchemaDTO;
	response_detail: TDetail;
}

// New generic envelopes
export interface ApiResponseOutputDetail<TDetail> {
	response_schema: ResponseSchemaDTO;
	response_output: { detail: TDetail };
}

export interface ApiResponseOutputList<TItem> {
	response_schema: ResponseSchemaDTO;
	response_output: { content: TItem[] };
}

