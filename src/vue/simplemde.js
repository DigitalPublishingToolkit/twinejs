// A lightweight Vue component that wraps a StackEdit instance.

const Vue = require('vue');
const SimpleMDE = require('simplemde');
const locale = require('../locale');

require('./codemirror-theme.less');
require('./simplemde-theme.less');

module.exports = Vue.extend({
	template: '<textarea></textarea>',
	props: ['text'],

	watch: {
		text() {
			// Only change SimpleMDE if it's actually a meaningful change,
			// e.g. not the result of SimpleMDE itself changing.

			if (this.text !== this.$simplemde.value()) {
				this.$simplemde.value(this.text);
			}
		}
	},

	ready() {
		var footnoteButton = {
			name: "Footnote",
			action: function(editor) {
		    var cm = editor.codemirror;
		    var output = '';
		    var selectedText = cm.getSelection();
		    var text = selectedText || 'placeholder';

		    output = '^[' + text + ']';
		    cm.replaceSelection(output);
			},
			className: "fa fa-sticky-note",
			title: "Footnote",
		};

		this.$simplemde = new SimpleMDE({
			element: this.$el,
			toolbar: ["bold", "italic", "heading", "|", "quote", footnoteButton, "|", "unordered-list","ordered-list", "|", "link", "image", "|", "preview", "guide"],
			forceSync: true,
			placeholder: locale.say(
				'Enter the body text of your passage here. To link to another ' +
				'passage, put two square brackets around its name, [[like ' +
				'this]].'
			)
		});

		this.$simplemde.codemirror.focus();

		this.$simplemde.value((this.text || '') + '');

		var self = this;

		this.$simplemde.codemirror.on("change", function() {
			self.$dispatch('cm-change', self.$simplemde.value());
		});
	},

	unbind() {
		this.$simplemde.toTextArea();
		this.$simplemde = null;
	},
});

// Vue.directive('simplemde', {
// 	twoWay: true,
// 	priority: 1000,
// 	bind: function() {
// 		simplemde = new SimpleMDE({
// 			element: this.el,
// 			toolbar: ["bold", "italic", "heading", "|", "quote", "|", "unordered-list","ordered-list", "|", "link", "image", "|", "preview", "guide"],
// 			placeholder: locale.say(
// 				'Enter the body text of your passage here. To link to another ' +
// 				'passage, put two square brackets around its name, [[like ' +
// 				'this]].'
// 			)
// 		});
//
// 		simplemde.codemirror.on("change", function(){
// 			this.$dispatch('cm-change', simplemde.value());
// 			// vnode.componentInstance.$dispatch('cm-change', simplemde.value());
// 		});
// 	},
// 	update: function(text) {
// 		simplemde.value(text);
// 	},
// 	unbind: function() {
// 		simplemde.toTextArea();
// 		simplemde = null;
// 	}
// });
