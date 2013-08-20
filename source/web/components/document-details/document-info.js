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
 * Document info component.
 * 
 * @namespace Alfresco
 * @class Alfresco.DocumentInfo
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom;
   
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;
   
   /**
    * DocumentInfo constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.DocumentInfo} The new DocumentInfo instance
    * @constructor
    */
   Alfresco.DocumentInfo = function(htmlId)
   {
      Alfresco.DocumentInfo.superclass.constructor.call(this, "Alfresco.DocumentInfo", htmlId);
      
      /* Decoupled event listeners */
      YAHOO.Bubbling.on("documentDetailsAvailable", this.onDocumentDetailsAvailable, this);
      
      return this;
   };
   
   YAHOO.extend(Alfresco.DocumentInfo, Alfresco.component.Base,
   {
      /**
       * Event handler called when the "documentDetailsAvailable" event is received
       *
       * @method: onDocumentDetailsAvailable
       */
      onDocumentDetailsAvailable: function DocumentInfo_onDocumentDetailsAvailable(layer, args)
      {
         var docData = args[1].documentDetails,
            workingCopyMode = args[1].workingCopyMode || false;
         
         // render tags values
         var tags = docData.tags,
            tagsHtml = "",
            i, ii;
         
         if (tags.length === 0)
         {
            tagsHtml = Alfresco.util.message("label.none", this.name);
         }
         else
         {
            for (i = 0, ii = tags.length; i < ii; i++)
            {
               tagsHtml += '<div class="tag"><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/tag-16.png" />';
               tagsHtml += $html(tags[i]) + '</div>';
            }
         }
         
         Dom.get(this.id + "-tags").innerHTML = tagsHtml;
      }
   });
})();
