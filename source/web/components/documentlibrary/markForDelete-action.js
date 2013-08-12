/**
 * DocumentList "Mark for Delete" action
 * 
 * @namespace Alfresco
 * @class Alfresco.DocumentList
 */
(function()
{
	var confirmMarkFolderForDelete = function(folder) {
		var that = this;
		
		Alfresco.util.PopupManager.displayPrompt({
			title: this.msg("message.mark-for-delete.folder.confirm-dialog.title", folder.displayName),
			text: this.msg("message.mark-for-delete.folder.confirm-dialog.text", folder.displayName),
			noEscape: true,
			buttons: [{
				text: this.msg("button.cancel"),
				hander: function() {
					this.destroy();
				},
				isDefault: true
			},{
				text: this.msg("button.ok"),
				hander: function() {
					that.markForDelete(folder);
				},
				isDefault: true
			}]
		});
	};
	
	var markForDelete = function(file) {
	     this.modules.actions.genericAction(
	    	      {
	    	         success:
	    	         {
	    	            message: this.msg("message.mark-for-delete.success", file.displayName)
	    	         },
	    	         failure:
	    	         {
	    	            message: this.msg("message.mark-for-delete.failure", file.displayName)
	    	         },
	    	         webscript:
	    	         {
	    	            name: "/sv-theme/delete/markForDelete?nodeRef={nodeRef}",
	    	            method: Alfresco.util.Ajax.POST
	    	         },
	    	         params:
	    	         {
	    	            nodeRef: file.nodeRef
	    	         },
	    	         config:
	    	         {
	    	            requestContentType: Alfresco.util.Ajax.JSON,
	    	            dataObj:
	    	            {
	    	               nodeRefs: [file.nodeRef]
	    	            }
	    	         }
	    	       });
		
	};
	
   /**
	 * Backup single document.
	 * 
	 * @method onActionBackup
	 * @param row
	 *            {object} DataTable row representing file to be actioned
	 */
   Alfresco.doclib.Actions.prototype.onActionMarkForDelete = function DL_onActionMarkForDelete(file)
   {
	   if(file.isFolder) {
		   confirmMarkFolderForDelete(file);
	   } else {
		   markForDelete(file);
	   }
   };
})();