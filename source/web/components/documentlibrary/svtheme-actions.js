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
/**
 * Extra SV theme actions
 * 
 * @namespace Alfresco.doclib
 * @class Alfresco.doclib.Actions
 */
(function()
{
   /**
    * Alfresco Slingshot aliases
    */
   var $combine = Alfresco.util.combinePaths;
   
   var actionFunction = function dlA_onActionManagePermissionsBasic(assets)
   {
	   if (!this.modules.permissionsBasic)
	   {
	     this.modules.permissionsBasic = new Alfresco.module.DoclibPermissionsBasic(this.id + "-permissions");
	   }

	   this.modules.permissionsBasic.setOptions(
	   {
	     siteId: this.options.siteId,
	     containerId: this.options.containerId,
	     path: this.currentPath,
	     files: assets
	   }).showDialog();
   };
   
   Alfresco.doclib.Actions.prototype.onActionManagePermissionsBasic = actionFunction;
   
   /**
    * Safe Move single document or folder.
    *
    * @method onActionSafeMoveTo
    * @param asset {object} Object literal representing the file or folder to be actioned
    */
   Alfresco.doclib.Actions.prototype.onActionSafeMoveTo = function dlA_onActionSafeMoveTo(asset)
   {
       if(!this.modules.safeMoveTo)
       {
          this.modules.safeMoveTo = new Alfresco.module.DoclibSafeMoveTo(this.id + "-safeMoveTo");
       }

       this.modules.safeMoveTo.setOptions(
       {
    	  mode: "move",
          siteId: this.options.siteId,
          containerId: this.options.containerId,
          path: this.currentPath,
          files: asset,
          workingMode: this.options.workingMode,
          rootNode: this.options.rootNode,
          parentId: this.doclistMetadata.parent.nodeRef
       }).showDialog();
   };
   
})();
