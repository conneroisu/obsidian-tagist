import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface ObsidianTagistSettings {
	isTags: boolean;
	apiKey: string;
}

const DEFAULT_SETTINGS: ObsidianTagistSettings = {
	isTags: true,
	apiKey: 'default api key'
}

export default class ObsidianTagist extends Plugin {
	settings: ObsidianTagistSettings;
async callOpenAIAPI(text: string, prompt: string) {
import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, request, MetadataCache } from 'obsidian';


// Remember to rename these classes and interfaces!

interface GPT3SummarizerSettings {
	apiKey: string;
}

const DEFAULT_SETTINGS: GPT3SummarizerSettings = {
	apiKey: 'default'
}

export default class GPT3Summarizer extends Plugin {
	settings: GPT3SummarizerSettings;

	async callOpenAIAPI(text: string, prompt: string) {
		const response = await request({
			url: 'https://api.openai.com/v1/engines/text-davinci-002/completions',
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.settings.apiKey}`,
				'Content-Type': 'application/json'
			},
			contentType: 'application/json',
			body: JSON.stringify({
				"prompt": prompt,
				"max_tokens": 250,
				"temperature": 0.3,
				"best_of": 3
			})
		});

		const responseJSON = JSON.parse(response);
		return responseJSON.choices[0].text;
	}

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'ObsidianTagist Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');
// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'summarize',
			name: 'Summarize',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const text = editor.getSelection();
				const summaryPrompt = `Summarize this text into one tweet.\n\nText:\n${text}\n\nSummary:\n`
				const summary = await this.callOpenAIAPI(editor.getSelection(), summaryPrompt);
				editor.replaceSelection(`#### Summary:${summary}\n\n#### Full answer:\n${editor.getSelection()}`);
			}
		});
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new ObsidianTagistModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'ObsidianTagist editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('ObsidianTagist Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new ObsidianTagistModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianTagistSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ObsidianTagistModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class ObsidianTagistSettingTab extends PluginSettingTab {
	plugin: ObsidianTagist;

	constructor(app: App, plugin: ObsidianTagist) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for the ObsidianTagist plugin.'});

		new Setting(containerEl)
			.setName('Tags or tag in metadata')
			.setDesc('If true, the plugin will look for tags in the metadata. If false, it will look for tags in the body of the note.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.isTags)
				.onChange(async (value) => {
					console.log('Toggle: ' + value);
					this.plugin.settings.isTags = value;
					await this.plugin.saveSettings();
				}));

		

				new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc('API Key for OpenAI')
			.addText(text => text
				.setPlaceholder('some-api-key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));
	}
	}
}
