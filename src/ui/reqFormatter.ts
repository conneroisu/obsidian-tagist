import ObsidianTagist from '../main';

export default class ReqFormatter { 
	plugin: ObsidianTagist; 
	app: App;
	contextManager: ContextManager;
	constructor(app: App, plugin: ObsidianTagist) {
		this.plugin = plugin;
		this.app = app;
		this.contextManager = new ContextManager();
	}

	addContext(parameters: ObsidianTagist, context: Context) {
		const params={
			...parameters, 
			prompt
		}
		return params; 
	}


	prepareReqParams() {
		if(this.plugin.settings.debug == true){
			console.log('Preparing request parameters');
		}

		let bodyParams:any = { 
			"prompt": params.prompt,
			"max_tag_length": params.max_tag_length,
			"temperature": params.temperature,
		}; 

		let reqUrl = 'https://api.openai.com/v1/engines/${params.engine}/completions';
		let reqExtractResults = "requestResults?.choices[0].text";

		if (params.engine === "gpt-3.5-turbo" || params.engine==="gpt-3.5-turbo-0301"
		|| params.engine === "gpt-3.5-turbo-0301" || params.engine === "gpt-3.5-turbo-0302"){
			bodyParams = {
				"model": params.engine,
				messages: [{"role": "user", "text": params.prompt}],
				"max_tag_length": params.max_tag_length,
				"temperature": params.temperature,
			}
			reqUrl = "https://api.openai.com/v1/chat/completions";
			reqExtractResults = "requestResults?.choices[0].message.content";
		}


		let reqParams = {
			url: reqUrl,
			method: 'POST',
			body = '',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${params.api_key}`
			},
			extractResult: reqExtractResults
		}
		if(this.plugin.settings.debug == true){
			console.log('Request parameters: ', reqParams);
			console.log('Body parameters: ', bodyParams);
			console.log('Request URL: ', reqUrl);
		}
       return reqParams;
   }
