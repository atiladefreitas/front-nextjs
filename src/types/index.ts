export interface Establishment {
	id: string;
	user_id: string;
	name: string;
	document: string;
	phone: string;
	email: string;
	postal_code: string;
	city: string;
	state: string;
	neighborhood: string;
	number: string;
	complement: string;
	street: string;
	created_at: string;
	updated_at: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	created_at: string;
	phone: string | number;
	document: string | number;
}

export interface FormData {
	name: string;
	document: string;
	phone: string;
	role: string;
	email: string;
	postal_code: string;
	city: string;
	state: string;
	neighborhood: string;
	street: string;
	number: string;
	complement: string;
}
