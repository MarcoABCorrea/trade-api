import QueryParameters from "./QueryParameters";

export default class ClientQueryParameters extends QueryParameters{

	embed?: string;
	active?: boolean;

	constructor() {
		super();
		this.embed = '';
		this.active = true;
	}
}
