
export type Context = { 
	indludeTitle: boolean;
	includeMentions: boolean;
}


export enum SupportedModels { 
	CHATGPT2 = 'chatgpt2',
	GPT3 = 'gpt3',
}



type TagistSettings = {
	api_key: string, 
	engine: string,
	max_tokens: number,
	temperature: number,
	frequency_penalty: number,
	prompt: string
	models: any;
	context: Context; 
}




