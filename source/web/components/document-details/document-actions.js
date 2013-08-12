/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
 
/**
 * Document actions component.
 * 
 * @namespace Alfresco
 * @class Alfresco.DocumentActions
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
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths,
      $siteURL = Alfresco.util.siteURL;
   
   /**
    * DocumentActions constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.DocumentActions} The new DocumentActions instance
    * @constructor
    */
   Alfresco.DocumentActions = function(htmlId)
   {
      Alfresco.DocumentActions.superclass.constructor.call(this, "Alfresco.DocumentActions", htmlId, ["button"]);
      
      /* Decoupled event listeners */
      YAHOO.Bubbling.on("documentDetailsAvailable", this.onDocumentDetailsAvailable, this);
      YAHOO.Bubbling.on("reloadDetails", this.onReloadDetails, this);
      YAHOO.Bubbling.on("documentInvalidated", this.gotoParentFolder, this);
      
      return this;
   };

   /**
    * Extend Alfresco.component.Base
    */
   YAHOO.extend(Alfresco.DocumentActions, Alfresco.component.Base);
   
   /**
    * Augment prototype with Actions module
    */
   YAHOO.lang.augmentProto(Alfresco.DocumentActions, Alfresco.doclib.Actions);

   /**
    * Augment prototype with main class implementation, ensuring overwrite is enabled
    */
   YAHOO.lang.augmentObject(Alfresco.DocumentActions.prototype,
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
          * Working mode: Site or Repository.
          * Affects how actions operate, e.g. actvities are not posted in Repository mode.
          * 
          * @property workingMode
          * @type number
          * @default Alfresco.doclib.MODE_SITE
          */
         workingMode: Alfresco.doclib.MODE_SITE,

         /**
          * Current siteId.
          * 
          * @property siteId
          * @type string
          */
         siteId: "",
         
         /**
          * ContainerId representing root container
          *
          * @property containerId
          * @type string
          * @default "documentLibrary"
          */
         containerId: "documentLibrary",

         /**
          * Valid inline edit mimetypes
          * Currently allowed are plain text, HTML and XML only
          *
          * @property inlineEditMimetypes
          * @type object
          */
         inlineEditMimetypes:
         {
            "text/plain": true,
            "text/html": true,
            "text/xml": true
         },

         /**
          * Root node
          *
          * @property rootNode
          * @type string
          */
         rootNode: "alfresco://company/home",

         /**
          * SharePoint (Vti) Server Details
          *
          * @property vtiServer
          * @type object
          */
         vtiServer: {},

         /**
          * Replication URL Mapping details
          *
          * @property replicationUrlMapping
          * @type object
          */
         replicationUrlMapping: {}
      },
      
      /**
       * The data for the document
       * 
       * @property assetData
       * @type object
       */
      assetData: null,
      
      /**
       * Metadata returned by doclist data webscript
       *
       * @property doclistMetadata
       * @type object
       * @default null
       */
      doclistMetadata: null,
      
      /**
       * Path of asset being viewed - used to scope some actions (e.g. copy to, move to)
       * 
       * @property currentPath
       * @type string
       */
      currentPath: null,

      /**
       * The urls to be used when creating links in the action cell
       *
       * @method getActionUrls
       * @param recordData {object} Object literal representing the node
       * @param siteId {string} Optional siteId override for site-based locations
       * @return {object} Object literal containing URLs to be substituted in action placeholders
       */
      getActionUrls: function DocumentActions_getActionUrls(recordData, siteId)
      {
         var nodeRef = recordData.nodeRef,
            custom = recordData.custom || {},
            siteObj = YAHOO.lang.isString(siteId) ? { site: siteId } : null,
            fnPageURL = Alfresco.util.bind(function(page)
            {
               return Alfresco.util.siteURL(page, siteObj);
            }, this);

         return (
         {
        	downloadUrl: fnPageURL("document-details?nodeRef=" + nodeRef+"&d"), // We swap this over to the real download link on-click
            viewUrl:  Alfresco.constants.PROXY_URI + recordData.contentUrl + "\" target=\"_blank",
            viewGoogleDocUrl: custom.googleDocUrl + "\" target=\"_blank",
            documentDetailsUrl: fnPageURL("document-details?nodeRef=" + nodeRef),
            editMetadataUrl: fnPageURL("edit-metadata?nodeRef=" + nodeRef),
            inlineEditUrl: fnPageURL("inline-edit?nodeRef=" + nodeRef),
            managePermissionsUrl: fnPageURL("manage-permissions?nodeRef=" + nodeRef),
            workingCopyUrl: fnPageURL("document-details?nodeRef=" + (custom.workingCopyNode || nodeRef)),
            originalUrl: fnPageURL("document-details?nodeRef=" + (custom.workingCopyOriginal || nodeRef)),
            sourceRepositoryUrl: this.viewInSourceRepositoryURL(recordData) + "\" target=\"_blank"
         });
      },
      
      //Just refresh the page when the document deleted state is updated
      onReloadDetails: function DocumentActions_onReloadDetails(layer, args)
      {
    	  window.location.href=window.location.href;
      },
      
      //Look inside the breadcrumb trail to find a link to the parent folder, and go there
      gotoParentFolder: function DocumentActions_gotoParentFolder(layer, args)
      {
    	  var pathElements = YAHOO.util.Selector.query('span.path-link');
    	  var target = pathElements[pathElements.length-1].children[0].href;
    	  self.location.href=target;
      },
       
      /**
       * Event handler called when the "documentDetailsAvailable" event is received
       *
       * @method: onDocumentDetailsAvailable
       */
      onDocumentDetailsAvailable: function DocumentActions_onDocumentDetailsAvailable(layer, args)
      {
         var me = this;
         
         // Asset data passed-in through event arguments
         this.assetData = args[1].documentDetails;
         this.doclistMetadata = args[1].metadata;
         this.currentPath = this.assetData.location.path;
         
         // Copy template into active area
         var assetData = this.assetData,
            actionsContainer = Dom.get(this.id + "-actionSet"),
            actionSet = assetData.actionSet,
            clone = Dom.get(this.id + "-actionSet-" + actionSet).cloneNode(true),
            downloadUrl = Alfresco.constants.PROXY_URI + assetData.contentUrl + "?a=true",
            displayName = assetData.displayName;

         // Token replacement
         clone.innerHTML = YAHOO.lang.substitute(window.unescape(clone.innerHTML), this.getActionUrls(this.assetData));

         // Replace existing actions and assign correct class for icon rendering
         actionsContainer.innerHTML = clone.innerHTML;
         Dom.addClass(actionsContainer, assetData.type);

         // Hide actions which have been disallowed through permissions
         if (assetData.permissions && assetData.permissions.userAccess)
         {
            var userAccess = assetData.permissions.userAccess,
               actionLabels = assetData.actionLabels || {},
               actions = YAHOO.util.Selector.query("div", actionsContainer),
               action, actionPermissions, aP, i, ii, j, jj, actionAllowed, aTag, spanTag;

            // Inject special-case permissions
            if (assetData.mimetype in this.options.inlineEditMimetypes)
            {
               userAccess["inline-edit"] = true;
            }
            userAccess.portlet = Alfresco.constants.PORTLET;

            /*
             * Configure the Online Edit URL and permission if correct conditions are met
             * Browser == MSIE; vtiServer details retrieved; vti module installed; mimetype matches whitelist
             */
            if (YAHOO.env.ua.ie > 0 &&
               this.options.vtiServer && typeof this.options.vtiServer.port == "number" &&
               this.doclistMetadata.onlineEditing &&
               assetData.mimetype in this.onlineEditMimetypes)
            {
               var loc = assetData.location,
                  uri = this.options.vtiServer.host + ":" + this.options.vtiServer.port + "/" + $combine("alfresco", loc.site, loc.container, loc.path, loc.file);
               
               if (!(/^(http|https):\/\//).test(uri))
               {
                  // VTI server now supports HTTPS directly http://issues.alfresco.com/jira/browse/DOC-227
                  uri = window.location.protocol + "//" + uri;
               }
               assetData.onlineEditUrl = uri;
               userAccess["online-edit"] = true;
            }
            
            for (i = 0, ii = actions.length; i < ii; i++)
            {
               action = actions[i];
               actionAllowed = true;
               aTag = action.firstChild;
               spanTag = aTag.firstChild;

               if (spanTag && actionLabels[action.className])
               {
                  spanTag.innerHTML = $html(actionLabels[action.className]);
               }

               if (aTag.rel !== "")
               {
                  actionPermissions = aTag.rel.split(",");
                  for (j = 0, jj = actionPermissions.length; j < jj; j++)
                  {
                     aP = actionPermissions[j];
                     // Support "negative" permissions
                     if ((aP.charAt(0) == "~") ? !!userAccess[aP.substring(1)] : !userAccess[aP])
                     {
                        actionAllowed = false;
                        break;
                     }
                  }
               }
               Dom.setStyle(action, "display", actionAllowed ? "block" : "none");
            }
         }
         Dom.setStyle(actionsContainer, "visibility", "visible");
         
         // Hook action events
         var fnActionHandler = function DocumentActions_fnActionHandler(layer, args)
         {
            var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "div");
            if (owner !== null)
            {
               var action = owner.className;
               if (typeof me[action] == "function")
               {
                  args[1].stop = true;
                  me[action].call(me, me.assetData, owner);
               }
            }
            return true;
         };
         
         YAHOO.Bubbling.addDefaultAction("action-link", fnActionHandler);
         
         var documentDetailsUrl=this.getActionUrls(this.assetData).documentDetailsUrl;
         YAHOO.util.Selector.query('div.onActionDownload a')[0].onclick=function() {
        	 this.href=downloadUrl;
        	 YAHOO.lang.later(250,this, function(){this.href=documentDetailsUrl+'&d';}, false);
        	 return true;
         }
         
         // DocLib Actions module
         this.modules.actions = new Alfresco.module.DoclibActions(this.options.workingMode);
         
         if (window.location.search.match(/&d$/)) {
        	 window.location = downloadUrl;
         }
         
         // Prompt auto-download (after Edit Offline action)?
         if (window.location.hash == "#editOffline")
         {
            window.location.hash = "#Share";

            if (YAHOO.env.ua.ie > 6)
            {
               // MSIE7 blocks the download and gets the wrong URL in the "manual download bar"
               Alfresco.util.PopupManager.displayPrompt(
               {
                  title: this.msg("message.edit-offline.success", displayName),
                  text: this.msg("message.edit-offline.success.ie7"),
                  buttons: [
                  {
                     text: this.msg("button.download"),
                     handler: function DocumentActions_oAEO_success_download()
                     {
                        window.location = downloadUrl;
                        this.destroy();
                     },
                     isDefault: true
                  },
                  {
                     text: this.msg("button.close"),
                     handler: function DocumentActions_oAEO_success_close()
                     {
                        this.destroy();
                     }
                  }]
               });
            }
            else
            {
               Alfresco.util.PopupManager.displayMessage(
               {
                  text: this.msg("message.edit-offline.success", displayName)
               });
               // Kick off the download 3 seconds after the confirmation message
               YAHOO.lang.later(3000, this, function()
               {
                  window.location = downloadUrl;
               });
            }
         }
         
         if (window.location.hash == "#editCancelled")
         {
            window.location.hash = "#Share";
            Alfresco.util.PopupManager.displayMessage(
            {
               text: this.msg("message.edit-cancel.success", displayName)
            });
         }

         if (window.location.hash == "#checkoutToGoogleDocs")
         {
            window.location.hash = "#Share";
            Alfresco.util.PopupManager.displayMessage(
            {
               text: this.msg("message.checkout-google.success", displayName)
            });
         }
         
         if (window.location.hash == "#checkinFromGoogleDocs")
         {
            window.location.hash = "#Share";
            Alfresco.util.PopupManager.displayMessage(
            {
               text: this.msg("message.checkin-google.success", displayName)
            });
         }
         
         this.markPerishableDialog = new YAHOO.widget.Dialog('choosePerishableReasonDialog', {
        	 zIndex: 4,
        	 visible: false,
        	 modal: true,
        	 fixedCenter: true,
        	 width: "450px"
         });
         this.markPerishableDialog.hide();
      },

      /**
       * Edit Offline.
       *
       * @override
       * @method onActionEditOffline
       * @param asset {object} Object literal representing file or folder to be actioned
       */
      onActionEditOffline: function DocumentActions_onActionEditOffline(asset)
      {
         var displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef);

         this.modules.actions.genericAction(
         {
            success:
            {
               callback:
               {
                  fn: function DocumentActions_oAEO_success(data)
                  {
                     this.assetData.nodeRef = data.json.results[0].nodeRef;
                     window.location = this.getActionUrls(this.assetData).documentDetailsUrl + "#editOffline";
                  },
                  scope: this
               }
            },
            failure:
            {
               message: this.msg("message.edit-offline.failure", displayName)
            },
            webscript:
            {
               method: Alfresco.util.Ajax.POST,
               name: "checkout/node/{nodeRef}",
               params:
               {
                  nodeRef: nodeRef.uri
               }
            }
         });
      },
      
      /**
       * Mark document for deletion
       */
      onActionMarkForDelete: function DL_onActionMarkForDelete(file)
      {

         this.modules.actions.genericAction(
         {
            success:
            {
               message: this.msg("message.mark-for-delete.success", file.displayName),
               event: { name: "reloadDetails" } //Event caught by this class and handled by onReloadDetails method
            },
            failure:
            {
               message: this.msg("message.mark-for-delete.failure", file.displayName)
            },
            webscript:
            {
               name: "sv-theme/delete/markForDelete?nodeRef={nodeRef}",
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
      },
      
      /**
       * Mark document for deletion
       */
      onActionRemoveDeleteMark: function DL_onActionRemoveDeleteMark(file)
      {

         this.modules.actions.genericAction(
         {
            success:
            {
               message: this.msg("message.remove-delete-mark.success", file.displayName),
               event: { name: "reloadDetails" }
            },
            failure:
            {
               message: this.msg("message.remove-delete-mark.failure", file.displayName)
            },
            webscript:
            {
               name: "sv-theme/delete/removeDeletionMark?nodeRef={nodeRef}",
               method: Alfresco.util.Ajax.PUT
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
      },
      
      /**
       * Mark document for deletion
       */
      onActionMarkAsPerishable: function DL_onActionMarkAsPerishable(file)
      {
    	 var me = this;

         var handleCancel = function() {
        	 this.cancel();
         };
         var handleSubmit = function() {
        	 if (me.markPerishableDialog.getData().perishable) {
        		 var reason = me.markPerishableDialog.getData().perishable;
        		 
                 me.modules.actions.genericAction(
                 {
                    success:
                    {
                       message: me.msg("message.mark-as-perishable.success"),
                       event: { name: "reloadDetails" } //Event caught by this class and handled by onReloadDetails method
                    },
                    failure:
                    {
                       message: me.msg("message.mark-as-perishable.failure")
                    },
                    webscript:
                    {
                       name: "sv-theme/delete/markPerishable?nodeRef=" +file.nodeRef,
                       method: Alfresco.util.Ajax.POST
                    },
                    config:
                    {
                       requestContentType: Alfresco.util.Ajax.JSON,
                       dataObj:
                       {
                          reason: reason
                       }
                    }
                 });

            	 me.markPerishableDialog.hide();
        	 } else {
        		// Display validation error
        		var perishErrorLabel = YAHOO.util.Dom.get("perishable-validation-inline");
        		YAHOO.util.Dom.addClass(perishErrorLabel, "invalid");
        	 }
         };
         
         this.markPerishableDialog.cfg.queueProperty("buttons",
        		 [
        		  { text: "Submit", handler: handleSubmit, isDefault: true },
                  { text: "Cancel", handler: handleCancel }
                 ]);
    	  
    	 this.markPerishableDialog.render();
    	 this.markPerishableDialog.show();
      },
      
      /**
       * Mark document for deletion
       */
      onActionRemovePerishableMark: function DL_onActionRemovePerishableMark(file)
      {

         this.modules.actions.genericAction(
         {
            success:
            {
               message: this.msg("message.remove-perishable-mark.success", file.displayName),
               event: { name: "reloadDetails" }
            },
            failure:
            {
               message: this.msg("message.remove-perishable-mark.failure", file.displayName)
            },
            webscript:
            {
               name: "sv-theme/delete/markPerishable?nodeRef={nodeRef}",
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
                  reason: ""
               }
            }
         });
      },
      
      /**
       * Undelete item
       */
      onActionUndoDelete: function DL_onActionUndoDelete(file)
      {

         this.modules.actions.genericAction(
         {
            success:
            {
               message: this.msg("message.undelete.success", file.displayName),
               event: { name: "reloadDetails" } //Event caught by this class and handled by onReloadDetails method
            },
            failure:
            {
               message: this.msg("message.undelete.failure", file.displayName)
            },
            webscript:
            {
               name: "sv-theme/delete/undelete?nodeRef={nodeRef}",
               method: Alfresco.util.Ajax.PUT
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
      },
      
      /**
       * Archive the item right now, regardless of it's scheduled archive date
       */
      onActionDeleteNow: function DL_onActionUndoDelete(file)
      {

    	 var path = file.location.path;
         var callbackUrl = this.options.workingMode == Alfresco.doclib.MODE_SITE ? "documentlibrary" : "repository";
         var encodedPath = path.length > 1 ? "?path=" + encodeURIComponent(path) : "";
        		 
         this.modules.actions.genericAction(
         {
            success:
            {
               message: this.msg("message.delete-now.success", file.displayName),
               callback:
               {
                  fn: function DocumentActions_oADC_success(data)
                  {
                     window.location = $siteURL(callbackUrl + encodedPath);
                  }
               }
            },
            failure:
            {
               message: this.msg("message.delete-now.failure", file.displayName)
            },
            webscript:
            {
               name: "sv-theme/delete/archive?nodeRef={nodeRef}",
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
      },

      /**
       * Cancel editing.
       *
       * @override
       * @method onActionCancelEditing
       * @param asset {object} Object literal representing file or folder to be actioned
       */
      onActionCancelEditing: function DocumentActions_onActionCancelEditing(asset)
      {
         var displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef);

         this.modules.actions.genericAction(
         {
            success:
            {
               callback:
               {
                  fn: function DocumentActions_oACE_success(data)
                  {
                     this.assetData.nodeRef = data.json.results[0].nodeRef;
                     window.location = this.getActionUrls(this.assetData).documentDetailsUrl + "#editCancelled";
                  },
                  scope: this
               }
            },
            failure:
            {
               message: this.msg("message.edit-cancel.failure", displayName)
            },
            webscript:
            {
               method: Alfresco.util.Ajax.POST,
               name: "cancel-checkout/node/{nodeRef}",
               params:
               {
                  nodeRef: nodeRef.uri
               }
            }
         });
      },

      /**
       * Upload new version.
       *
       * @override
       * @method onActionUploadNewVersion
       * @param asset {object} Object literal representing the file to be actioned upon
       */
      onActionUploadNewVersion: function DocumentActions_onActionUploadNewVersion(asset)
      {
         var displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef),
            version = asset.version;

         if (!this.fileUpload)
         {
            this.fileUpload = Alfresco.getFileUploadInstance();
         }

         // Show uploader for multiple files
         var description = this.msg("label.filter-description", displayName),
            extensions = "*";

         if (displayName && new RegExp(/[^\.]+\.[^\.]+/).exec(displayName))
         {
            // Only add a filtering extension if filename contains a name and a suffix
            extensions = "*" + displayName.substring(displayName.lastIndexOf("."));
         }
         
         if (asset.custom && asset.custom.workingCopyVersion)
         {
            version = asset.custom.workingCopyVersion;
         }
         
         var singleUpdateConfig =
         {
            updateNodeRef: nodeRef.toString(),
            updateFilename: displayName,
            updateVersion: version,
            suppressRefreshEvent: true,
            overwrite: true,
            filter: [
            {
               description: description,
               extensions: extensions
            }],
            mode: this.fileUpload.MODE_SINGLE_UPDATE,
            onFileUploadComplete:
            {
               fn: this.onNewVersionUploadCompleteCustom,
               scope: this
            }
         };
         if (this.options.workingMode == Alfresco.doclib.MODE_SITE)
         {
            singleUpdateConfig.siteId = this.options.siteId;
            singleUpdateConfig.containerId = this.options.containerId;
         }
         this.fileUpload.show(singleUpdateConfig);
      },

      /**
       * Called from the uploader component after a the new version has been uploaded.
       *
       * @method onNewVersionUploadCompleteCustom
       * @param complete {object} Object literal containing details of successful and failed uploads
       */
      onNewVersionUploadCompleteCustom: function DocumentActions_onNewVersionUploadCompleteCustom(complete)
      {
         // Call the normal callback to post the activity data
         this.onNewVersionUploadComplete.call(this, complete);
         this.assetData.nodeRef = complete.successful[0].nodeRef;
         // Delay page reloading to allow time for async requests to be transmitted
         YAHOO.lang.later(0, this, function()
         {
            window.location = this.getActionUrls(this.assetData).documentDetailsUrl;
         });
      },

      /**
       * Checkout to Google Docs.
       *
       * @override
       * @method onActionCheckoutToGoogleDocs
       * @param asset {object} Object literal representing file or folder to be actioned
       */
      onActionCheckoutToGoogleDocs: function DocumentActions_onActionCheckoutToGoogleDocs(asset)
      {
         var displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef),
            path = asset.location.path,
            fileName = asset.fileName;

         var progressPopup = Alfresco.util.PopupManager.displayMessage(
         {
            displayTime: 0,
            effect: null,
            text: this.msg("message.checkout-google.inprogress", displayName)
         });

         this.modules.actions.genericAction(
         {
            success:
            {
               callback:
               {
                  fn: function DocumentActions_oAEO_success(data)
                  {
                     this.assetData.nodeRef = data.json.results[0].nodeRef;
                     window.location = this.getActionUrls(this.assetData).documentDetailsUrl + "#checkoutToGoogleDocs";
                  },
                  scope: this
               },
               activity:
               {
                  siteId: this.options.siteId,
                  activityType: "google-docs-checkout",
                  page: "document-details",
                  activityData:
                  {
                     fileName: fileName,
                     path: path,
                     nodeRef: nodeRef.toString()
                  }
               }
            },
            failure:
            {
               callback:
               {
                  fn: function DocumentActions_oAEO_failure(data)
                  {
                     progressPopup.destroy();
                     Alfresco.util.PopupManager.displayMessage(
                     {
                        text: this.msg("message.checkout-google.failure", displayName)
                     });
                  },
                  scope: this
               }
            },
            webscript:
            {
               method: Alfresco.util.Ajax.POST,
               name: "checkout/node/{nodeRef}",
               params:
               {
                  nodeRef: nodeRef.uri
               }
            }
         });
      },
      
      /**
       * Check in a new version from Google Docs.
       *
       * @override
       * @method onActionCheckinFromGoogleDocs
       * @param asset {object} Object literal representing the file to be actioned upon
       */
      onActionCheckinFromGoogleDocs: function DocumentActions_onActionCheckinFromGoogleDocs(asset)
      {
         var displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef),
            originalNodeRef = new Alfresco.util.NodeRef(asset.custom.workingCopyOriginal),
            path = asset.location.path,
            fileName = asset.fileName;

          var progressPopup = Alfresco.util.PopupManager.displayMessage(
          {
             displayTime: 0,
             effect: null,
             text: this.msg("message.checkin-google.inprogress", displayName)
          });

         this.modules.actions.genericAction(
         {
            success:
            {
               callback:
               {
                  fn: function DocumentActions_oACE_success(data)
                  {
                     this.assetData.nodeRef = data.json.results[0].nodeRef;
                     window.location = this.getActionUrls(this.assetData).documentDetailsUrl + "#checkinFromGoogleDocs";
                  },
                  scope: this
               },
               activity:
               {
                  siteId: this.options.siteId,
                  activityType: "google-docs-checkin",
                  page: "document-details",
                  activityData:
                  {
                     fileName: displayName,
                     path: path,
                     nodeRef: originalNodeRef.toString()
                  }
               }
            },
            failure:
            {
               fn: function DocumentActions_oAEO_failure(data)
               {
                  progressPopup.destroy();
                  Alfresco.util.PopupManager.displayMessage(
                  {
                     text: this.msg("message.checkin-google.failure", displayName)
                  });
               },
               scope: this
            },
            webscript:
            {
               method: Alfresco.util.Ajax.POST,
               name: "checkin/node/{nodeRef}",
               params:
               {
                  nodeRef: nodeRef.uri
               }
            }
         });
      },

      /**
       * Delete Asset confirmed.
       *
       * @override
       * @method _onActionDeleteConfirm
       * @param asset {object} Object literal representing file or folder to be actioned
       * @private
       */
      _onActionDeleteConfirm: function DocumentActions__onActionDeleteConfirm(asset)
      {
         var path = asset.location.path,
            fileName = asset.fileName,
            displayName = asset.displayName,
            nodeRef = new Alfresco.util.NodeRef(asset.nodeRef),
            callbackUrl = this.options.workingMode == Alfresco.doclib.MODE_SITE ? "documentlibrary" : "repository",
            encodedPath = path.length > 1 ? "?path=" + encodeURIComponent(path) : "";
         
         this.modules.actions.genericAction(
         {
            success:
            {
               activity:
               {
                  siteId: this.options.siteId,
                  activityType: "file-deleted",
                  page: "documentlibrary",
                  activityData:
                  {
                     fileName: fileName,
                     path: path,
                     nodeRef: nodeRef.toString()
                  }
               },
               callback:
               {
                  fn: function DocumentActions_oADC_success(data)
                  {
                     window.location = $siteURL(callbackUrl + encodedPath);
                  }
               }
            },
            failure:
            {
               message: this.msg("message.delete.failure", displayName)
            },
            webscript:
            {
               method: Alfresco.util.Ajax.DELETE,
               name: "file/node/{nodeRef}",
               params:
               {
                  nodeRef: nodeRef.uri
               }
            }
         });
      }      
   }, true);
})();