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
 * Document links component.
 * 
 * @namespace Alfresco
 * @class Alfresco.DocumentLinks
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $combine = Alfresco.util.combinePaths;
   
   /**
    * DocumentLinks constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.DocumentLinks} The new DocumentLinks instance
    * @constructor
    */
   Alfresco.DocumentLinks = function(htmlId)
   {
      Alfresco.DocumentLinks.superclass.constructor.call(this, "Alfresco.DocumentLinks", htmlId, ["button"]);
      
      /* Decoupled event listeners */
      YAHOO.Bubbling.on("documentDetailsAvailable", this.onDocumentDetailsAvailable, this);
      
      // Initialise prototype properties
      this.hasClipboard = window.clipboardData && window.clipboardData.setData;
      
      return this;
   };
   
   YAHOO.extend(Alfresco.DocumentLinks, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Repository Url if configured
          * 
          * @property repositoryUrl
          * @type string
          */
         repositoryUrl: null
      },

      /**
       * Does the browser natively support clipboard data?
       * 
       * @property hasClipboard
       * @type boolean
       */
      hasClipboard: null,

      /**
       * Event handler called when the "documentDetailsAvailable" event is received
       *
       * @method: onDocumentDetailsAvailable
       */
      onDocumentDetailsAvailable: function DocumentLinks_onDocumentDetailsAvailable(layer, args)
      {
         var docData = args[1].documentDetails,
            workingCopyMode = args[1].workingCopyMode || false;

         if (workingCopyMode)
         {
            // No UI for Working Copy documents
            return;
         }

         Dom.removeClass(this.id + "-body", "hidden");
         
         // Construct the content-based URLs if the document actually has content (size > 0)
         if (parseInt(docData.size, 10) > 0)
         {
            // Download and View links
            this.populateLinkUI(
            {
               name: "view",
               url: window.location.protocol+'//'+window.location.hostname+Alfresco.util.siteURL("document-details?nodeRef=" + docData.nodeRef+'&d')
            });
         }

         if (this.options.repositoryUrl)
         {
            // WebDAV URL
            this.populateLinkUI(
            {
               name: "webdav",
               url: $combine(this.options.repositoryUrl, docData.webdavUrl)
            });
         }

         // This page
         this.populateLinkUI(
         {
            name: "page",
            url: window.location.href
         });
      },
      
      /**
       * Populate a link UI element
       *
       * @method _populateLinkUI
       * @param link {object} Object literal containing link details
       */
      populateLinkUI: function DocumentLinks_populateLinkUI(link)
      {
         var nameId = this.id + "-" + link.name,
            urlId = nameId + "-url",
            copyButtonName = link.name + "-button";
         
         if (Dom.get(nameId))
         {
            Dom.removeClass(nameId, "hidden");
            Dom.get(urlId).value = link.url;
            if (this.hasClipboard)
            {
               Alfresco.util.createYUIButton(this, copyButtonName, null,
               {
                  onclick:
                  {
                     fn: this._handleCopyClick,
                     obj: urlId,
                     scope: this
                  }
               });
            }

            // Add focus event handler
            Event.addListener(urlId, "focus", this._handleFocus, urlId, this);
         }
      },
      
      /**
       * Event handler to copy URLs to the system clipboard
       * 
       * @method _handleCopyClick
       * @param event {object} The event
       * @param urlId {string} The Dom Id of the element holding the URL to copy
       */
      _handleCopyClick: function DocumentLinks__handleCopyClick(event, urlId)
      {
         clipboardData.setData("Text", Dom.get(urlId).value);
      },
      
      /**
       * Event handler used to select text in the field when focus is received
       *
       * @method _handleFocus
       * @param event The event
       * @field The Dom Id of the field to select
       */
      _handleFocus: function DocumentLinks__handleFocus(e, fieldId)
      {
         YAHOO.util.Event.stopEvent(e);
         
         var fieldObj = Dom.get(fieldId);
         if (fieldObj && typeof fieldObj.select == "function")
         {
            fieldObj.select();
         }
      }
   });
})();
