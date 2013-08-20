/*
 * Copyright (C) 2008-2010 Surevine Limited.
 *   
 * Although intended for deployment and use alongside Alfresco this module should
 * be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
 * http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
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
