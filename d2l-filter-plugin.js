import './d2l-html-editor-plugin.js';
/*global tinymce:true */
/** @polymerBehavior */
var FilterBehavior = {
	plugin: {
		addPlugin: function(client) {
			tinymce.PluginManager.add('d2l_filter', function(editor) {
				editor.on('init', function() {

					if (!editor.getParam('d2l_html_editor').content) {
						return;
					}
					var unfilteredContent = decodeURIComponent(editor.getParam('d2l_html_editor').content);

					if (unfilteredContent) {
						client.getService('convert-to-viewable-html', '0.1').then(function(service) {
							if (editor.getParam('d2l_html_editor').allowUnsafe) {
								return unfilteredContent;
							}
							return service.filterHtml(unfilteredContent);
						}).then(function(filteredContent) {
							editor.setContent(filteredContent);
							// This call is necessary for the undo button to work properly, otherwise the undo button
							// can undo the saved content as well.
							editor.undoManager.clear();
							// This call is necessary for the custom JS functons we created for tinyMCE tables to get called
							//When you first enter an editor, and change the table properties (it won't create a change event
							//until there is already an undo action in the undomanager)
							editor.undoManager.add();
						}).catch(function() {
							console.warn('d2l_filter_plugin not enabled'); // eslint-disable-line
						});
					}
				});
			});
		}
	}
};
window.D2LHtmlEditor = window.D2LHtmlEditor || {};
window.D2LHtmlEditor.PolymerBehaviors = window.D2LHtmlEditor.PolymerBehaviors || {};
/** @polymerBehavior */
window.D2LHtmlEditor.PolymerBehaviors.Filter = FilterBehavior;
