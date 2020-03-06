// A lightweight Vue component that wraps a StackEdit instance.

const Vue = require('vue');
const HyperMD = require('hypermd');
// const locale = require('../locale');

require('./codemirror-theme.less');
require('./hypermd.less');

module.exports = Vue.extend({
	template: '<div class="hypermd-wrap"><textarea></textarea></div>',
	props: ['options', 'text'],

	watch: {
		text() {
			// Only change SimpleMDE if it's actually a meaningful change,
			// e.g. not the result of SimpleMDE itself changing.

			if (this.text !== this.$hyperMD.getValue()) {
				this.$hyperMD.setValue(this.text);
			}
		}
	},

	ready() {
		this.buttons = [
			{
				label: 'Bold',
				icon: 'fa-bold',
				action: '**placeholder**',
			},
			{ label: 'Italic',
				icon: 'fa-italic',
				action: '*placeholder*',
			},
			{
				label: 'Hyperlink',
				icon: 'fa-link',
				action: '[placeholder](https://)',
			},
			{
				label: 'Image',
				icon: 'fa-image',
				action: '![placeholder](https://)',
			},
			{ label: 'Footnote',
				icon: 'fa-sticky-note',
				action: '[^placeholder]',
			},
		];
		this.toolbar = document.createElement("div");
		this.toolbar.classList.add('hypermd-toolbar');
		this.textArea = this.$el.querySelector('textarea');

		var self = this;

		this.buttons.forEach((button) => {
			buttonElement = document.createElement("button");
			buttonElement.title = button.label
			buttonElement.innerHTML = '<i class="fa '+button.icon+'"></i>';
			buttonElement.onclick = () => {
				var selection = self.$hyperMD.getSelection();
				self.$hyperMD.replaceSelection(button.action.replace(/placeholder/gi, selection));
			};
			buttonElement.classList.add('hypermd-btn');
			this.toolbar.append(buttonElement);
		});

		this.$el.insertBefore(this.toolbar, this.textArea);

		this.$hyperMD = HyperMD.fromTextArea(this.textArea, this.options);

		this.$hyperMD.setValue((this.text || '') + '');
		this.$hyperMD.focus();

		this.$hyperMD.on("change", function() {
		 	self.$dispatch('cm-change', self.$hyperMD.getValue());
		});

		this.$hyperMD.eachLine((line) => {
			console.log(this.$hyperMD.getLineTokens(line.lineNo()));
		});
	},

	unbind() {
		this.$HyperMD.toTextArea();
		this.$hyperMD = null;
	},

	events: {
		// Since CodeMirror initialises incorrectly when special CSS such as
		// scaleY is present on its containing element, it should be
		// refreshed once transition is finished - hence, this event.
		'transition-entered'() {
			this.$hyperMD.refresh();
		}
	}
});
