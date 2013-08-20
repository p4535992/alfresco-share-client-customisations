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
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event,
       Element = YAHOO.util.Element;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
   * Topic constructor.
   * 
   * @param {String} htmlId The HTML id of the parent element
   * @return {Alfresco.TopicView} The new Topic instance
   * @constructor
   */
   Alfresco.DiscussionsTopic = function(htmlId)
   {
      /* Mandatory properties */
      this.name = "Alfresco.DiscussionsTopic";
      this.id = htmlId;
      
      /* Initialise prototype properties */
      this.widgets = {};
      this.modules = {};
      this.tagId =
      {
         id: 0,
         tags: {}
      };
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["datasource", "json", "connection", "event", "button", "menu", "editor"], this.onComponentsLoaded, this);
     
      /* Decoupled event listeners */
      YAHOO.Bubbling.on("tagSelected", this.onTagSelected, this);

      var me = this;
      Alfresco.util.Ajax.request({
    	  url : Alfresco.constants.PROXY_URI + "sv-theme/delete/perishable-reasons?site=" +Alfresco.constants.SITE,
    	  method: "GET",
    	  successCallback : {
	    	  fn: function(response, config) {
	    		  me.reasons = eval('(' +response.serverResponse.responseText +')').perishableReasons;
	    	  },
	    	  scope: this
    	  },
    	  failureCallback : {
    		  fn: function() {
    			  alert("Failure fetching ")
    		  },
    		  scope: this
    	  },
    	  scope: this
      });
           
      return this;
   };
   
   Alfresco.DiscussionsTopic.prototype =
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
          * Current siteId.
          * 
          * @property siteId
          * @type string
          */
         siteId: "",
       
         /**
          * Current containerId.
          * 
          * @property containerId
          * @type string
          */
         containerId: "discussions",

         /**
          * Id of the topic to display.
          * 
          * @property topicId
          * @type string
          */
         topicId: ""

      },
     
      /**
       * Holds the data displayed in this component.
       */
      topicData: null,
      
      /**
       * Object container for storing YUI widget instances.
       * 
       * @property widgets
       * @type object
       */
      widgets: null,
      
      /**
       * Object container for storing module instances.
       * 
       * @property modules
       * @type object
       */
      modules: null,
      
      /**
       * Object literal used to generate unique tag ids
       * 
       * @property tagId
       * @type object
       */
      tagId: null,
      
      /**
       * Tells whether an action is currently ongoing.
       * 
       * @property busy
       * @type boolean
       * @see _setBusy/_releaseBusy
       */
      busy: false,
      
      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       */
      setOptions: function DiscussionsTopic_setOptions(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);
         return this;
      },
     
      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       */
      setMessages: function DiscussionsTopic_setMessages(obj)
      {
         Alfresco.util.addMessages(obj, this.name);
         return this;
      },
     
      /**
       * Fired by YUILoaderHelper when required component script files have
       * been loaded into the browser.
       *
       * @method onComponentsLoaded
       */
      onComponentsLoaded: function DiscussionsTopic_onComponentsLoaded()
      {
         Event.onContentReady(this.id, this.onReady, this, true);
      },
   
  
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function DiscussionsTopic_onReady()
      {
         var me = this;
         
         // Hook action events.
         var fnActionHandlerDiv = function DiscussionsTopic_fnActionHandlerDiv(layer, args)
         {

            var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "div");
            if (owner !== null)
            {
               var action = "";
               action = owner.className;
               if (typeof me[action] == "function")
               {
                  me[action].call(me, me.topicData.name);
                  args[1].stop = true;
               }
            }
            return true;
         };
         YAHOO.Bubbling.addDefaultAction("topic-action-link-div", fnActionHandlerDiv);
         
         // register tag action handler, which will issue tagSelected bubble events.
         Alfresco.util.tags.registerTagActionHandler(this);
          
         // initialize the mouse over listener
         Alfresco.util.rollover.registerHandlerFunctions(this.id, this.onTopicElementMouseEntered, this.onTopicElementMouseExited, this);

         this.markPerishableDialog = new YAHOO.widget.Dialog('choosePerishableReasonDialog', {
        	 zIndex: 4,
        	 visible: false,
        	 modal: true,
        	 fixedCenter: true,
        	 width: "450px"
         });
	     this.markPerishableDialog.hide();
          
         // load the topic data
         this._loadTopicData();
    
      },
      
      
      /**
       * Loads the topic data and updates the ui.
       */
      _loadTopicData: function DiscussionsTopic__loadTopicData()
      {
         // ajax request success handler
         var loadTopicDataSuccess = function DiscussionsTopic__loadTopicData_loadTopicDataSuccess(response)
         {
            // set the loaded data
            var data = response.json.item;
            this.topicData = data;
            
            // render the ui
            this.renderUI();
            
            // inform the comment components about the loaded post
            this._fireTopicDataChangedEvent();
         };
         
         // construct url to call
         var url = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/forum/post/site/{site}/{container}/{topicId}",
         {
            site : this.options.siteId,
            container: this.options.containerId,
            topicId: this.options.topicId
         });
         
         // execute ajax request
         Alfresco.util.Ajax.request(
         {
            url: url,
            successCallback:
            {
               fn: loadTopicDataSuccess,
               scope: this
            },
            failureMessage: this._msg("message.loadtopicdata.failure")
         });
      },

      /**
       * Renders the UI with the data available in the component.
       */
      renderUI: function DiscussionsTopic_renderUI()
      {   
         // get the container div
         var viewDiv = Dom.get(this.id + '-topic-view-div');
         
         // render the topic and insert the resulting html
         var html = this.renderTopic(this.topicData);
         viewDiv.innerHTML = html;
         
         // attach the rollover listeners
         Alfresco.util.rollover.registerListenersByClassName(this.id, 'topic', 'div');
         
         var stickyScrollThreshold = 180;
         var labelWrapper = YAHOO.util.Selector.query(".deleteMarkWrapper")[0];

         // Setup scroll handler for to make marked for delete/perish labels sticky if required
         var recalculateStickyDeletionMarks = function() {
        	 var offset;
        	 if(window.pageYOffset != undefined) {
        		 offset = window.pageYOffset;
        	 }
        	 else {
        		 offset = document.documentElement.scrollTop;
        	 }       	 
        	 
        	 if(offset >= stickyScrollThreshold) {
        		 if(!YAHOO.util.Dom.hasClass(labelWrapper, "sticky")) {
        			 YAHOO.util.Dom.addClass(labelWrapper, "sticky");
        		 }
        	 }
        	 else if(offset < stickyScrollThreshold) {
        		 if(YAHOO.util.Dom.hasClass(labelWrapper, "sticky")) {
        			 YAHOO.util.Dom.removeClass(labelWrapper, "sticky");
        		 } 
        	 } 
         };
         
         if(!browserIsIE6) {
	         YAHOO.util.Event.addListener(window, "scroll", recalculateStickyDeletionMarks);
	         YAHOO.Bubbling.on("afterHideDiscussionReplyForm", recalculateStickyDeletionMarks);
         }
         
      },
      
      /**
       * Renders the topic.
       * 
       * @param data {object} the data object containing the topic data
       * @return {string} html representing the data
       */
      renderTopic: function DiscussionsTopic_renderTopic(data)
      {
    	 var me = this;

         var uid = data.nodeRef.replace("workspace://SpacesStore/", "");
    	  
         var html = '';
         
         html += '<div id="' + this.id + '-topicview" class="node topic topicview">'
         
         // actions
         html += '<div class="nodeEdit">';
         if (data.permissions.reply)
         {
            html += '<div class="onAddReply"><a href="#" class="topic-action-link-div">' + this._msg("action.reply") + '</a></div>';   
         }
         if (data.permissions.edit)
         {
            html += '<div class="onEditTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.edit") + '</a></div>';
         }
         if (data.permissions['delete'])
         {
            html += '<div class="onDeleteTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.delete") + '</a></div>';
         }
         if (data.deletionState=="deleted" && data.deletionAuthorisation=="deleter")
         {
            html += '<div class="onUndeleteTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.undelete") + '</a></div>';
         }
         else
         {
	         //If we're not in a deleted items site, show the mark for delete or remove delete mark buttons as appropriate
	         if (data.archiveDue) {
	             html += '<div class="onRemoveDeleteMarkTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.removeDeleteMark") + '</a></div>';
	         } else if (data.isDeletable == "yes") {
	        	 html += '<div class="onMarkForDeleteTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.markForDelete") + '</a></div>';
	         }

	         //If we're not in a deleted items site, but are in one configured with perishable reasons,
	         //show the mark as perishable or remove perishable mark buttons as appropriate
   	         if (me.reasons.length > 0) {
		         if (data.perishDue) {
		             html += '<div class="onRemovePerishableMarkTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.removePerishableMark") + '</a></div>';
		         } else {
		        	 html += '<div class="onMarkAsPerishableTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.markAsPerishable") + '</a></div>';
		         }
   	         }
	         
	         if ((data.archiveDue || data.perishDue) && data.deletionAuthorisation=="deleter") {
	        	 html += '<div class="onDeleteNowTopic"><a href="#" class="topic-action-link-div">' + this._msg("action.deleteNow") + '</a></div>';
	         }
         }
         html += '</div>';

         // avatar
         html += '<div class="authorPicture">' + Alfresco.util.people.generateUserAvatarImg(data.author) + '</div>';

         // content
         html += '<div class="nodeContent">';
         html +='<div class="eslPMDiscussion'+data.eslPM.replace(/ /g,'')+'"> <span class="eslRenderNod">'+data.eslNod+'</span> <span class="eslRenderPM">'+data.eslPM+'</span> <span class="eslRenderAtomal">'+data.eslAtomal+'</span> <span class="eslRenderFreeForm">'+data.eslFreeFormCaveats+'</span> <span class="eslRenderEyes">'+data.eslEyes+'</span><br/>';
         html +='<span class="eslRenderClosed">'+data.eslClosed+' </span> <span class="eslRenderOrganisations">'+data.eslOrganisations+'</span> <span class="eslRenderOpen">'+data.eslOpen+'</span> </div>';
         
         html +='<div class="deleteMarkWrapper topicListDeleteMarkWrapper">';
         
         if (data.archivalStatus && data.archivalStatus.archivalDue) {
      	   html+="<div id='deleteDateDiv' class='deleteDate'>Due for deletion on <span class='date'>"+data.archivalStatus.archivalDue+"</span></div>";
         }
         
         //If item is marked for deletion, render relevant data
         if (data.archiveDue)
         {
        	 html+="<div id='DeletionMark-"+uid+ "' class='markedForDeletion'>Marked for deletion <span class='markMeta'>by <a href='/share/page/user/"+data.deletedBy+"/profile'>"+data.deletedBy+"</a></span></div>";
         }

         //If item is marked as perishable, render relevant data
         if (data.perishDue) {
      	 var perishLabel = me._msg("label.markedAsPerishable", data.perishTitle, data.perishRequestedBy);
      	 html+="<div id='PerishableMark-"+uid+"' class='markedAsPerishable'>"+perishLabel+" <span class='markMeta'>by <a href='/share/page/user/"+data.perishRequestedBy+"/profile'>"+data.perishRequestedBy+"</a></span></div>";
         }
         
         // Closing delete mark wrapper
         html +='</div>';
         html +='<div class="clearLeft"></div>';
         
         html += '<div class="nodeTitle"><a href="' + Alfresco.util.discussions.getTopicViewPage(this.options.siteId, this.options.containerId, data.name) + '">' + $html(data.title) + '</a> ';
         if (data.isUpdated)
         {
            html += '<span class="theme-color-2 nodeStatus">(' + this._msg("post.updated") + ')</span>';
         }
         html += '</div>';
         
         html += '<div class="published">';
         html += '<span class="nodeAttrLabel">' + this._msg("post.createdOn") + ': </span>';
         html += '<span class="nodeAttrValue">' + Alfresco.util.formatDate(data.createdOn) + '</span>';
         html += '<span class="separator">&nbsp;</span>';
         html += '<span class="nodeAttrLabel">' + this._msg("post.author") + ': </span>';
         html += '<span class="nodeAttrValue">' + Alfresco.util.people.generateUserLinkWithPresence(data.author, data.authorPresence) + '</span>';
         html += '<br />';
         if (data.lastReplyBy)
         {
            html += '<span class="nodeAttrLabel">' + this._msg("post.lastReplyBy") + ': </span>';
            html += '<span class="nodeAttrValue">' + Alfresco.util.people.generateUserLinkWithPresence(data.lastReplyBy, data.lastReplyByPresence) + '</span>';                  
            html += '<span class="separator">&nbsp;</span>';
            html += '<span class="nodeAttrLabel">' + this._msg("post.lastReplyOn") + ': </span>';
            html += '<span class="nodeAttrValue">' + Alfresco.util.formatDate(data.lastReplyOn) + '</span>';
         }
         else
         {
            html += '<span class="nodeAttrLabel">' + this._msg("replies.label") + ': </span>';
            html += '<span class="nodeAttrValue">' + this._msg("replies.noReplies") + '</span>';                  
         }
         html += '</div>';
             
         html += '<div class="userLink">' + Alfresco.util.people.generateUserLinkWithPresence(data.author, data.authorPresence) + ' ' + this._msg("said") + ':</div>';
         html += '<div class="content yuieditor">' + data.content + '</div>';
         html += '</div>'
         // end view

         // begin footer
         html += '<div class="nodeFooter">';
         html += '<span class="nodeAttrLabel replyTo">' + this._msg("replies.label") + ': </span>';
         html += '<span class="nodeAttrValue">(' + data.totalReplyCount + ')</span>';
         html += '<span class="separator">&nbsp;</span>';
             
         html += '<span class="nodeAttrLabel tagLabel">' + this._msg("tags.label") +': </span>';
         if (data.tags.length > 0)
         {
            for (var x=0; x < data.tags.length; x++)
            {
               if (x > 0)
               {
                  html += ", ";
               }
               html += Alfresco.util.tags.generateTagLink(this, data.tags[x]);
            }
         }
         else
         {
            html += '<span class="nodeAttrValue">' + this._msg("tags.noTags") + '</span>';
         }
         html += '</div></div></div>';
          
         return html;
      },

      /**
       * Handler for add reply action link
       */
      onAddReply: function DiscussionsTopic_onAddReply(htmlId, ownerId, param)
      {
         YAHOO.Bubbling.fire('addReplyToPost',
         {
            postRef : this.topicData.nodeRef
         });
      },
     
      /**
       * Handler for edit topic action link
       */
      onEditTopic: function DiscussionsTopic_onEditTopic()
      {
         window.location.href = Alfresco.constants.URL_PAGECONTEXT + "site/" + this.options.siteId + "/discussions-createtopic?topicId=" + this.options.topicId;
      },
      
      /**
       * Mark the current topic for deletion
       */
      onMarkForDeleteTopic: function DiscussionsTopic_onMarkForDeleteTopic()
      {
    	  var markForDeleteOK = function()
          {
            self.location.href=self.location.href;
          };
            
          var markForDeleteFail = function()
          {
            alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
          };
        	
          Alfresco.util.Ajax.request(
          {
               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/markForDelete?nodeRef="+this.topicData.nodeRef,
               method: "POST",
               successCallback :
            {
               fn: markForDeleteOK,
               scope: this
            },
            failureCallback :
            {
               fn: markForDeleteFail,
               scope: this
            },
            scope: this
         });
      },
      
      /**
       * Undelete the current topic
       */
      onUndeleteTopic: function DiscussionsTopic_onUndeleteTopic()
      {
    	  var undeleteOK = function()
          {
    		alert("This discussion has been moved to it's original location");
            self.location.href=self.location.href.replace(/discussions-topicview.*/g, 'discussions-topiclist');
          };
            
          var undeleteFail = function()
          {
            alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
          };
        	
          Alfresco.util.Ajax.request(
          {
               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/undelete?nodeRef="+this.topicData.nodeRef,
               method: "PUT",
               successCallback :
            {
               fn: undeleteOK,
               scope: this
            },
            failureCallback :
            {
               fn: undeleteFail,
               scope: this
            },
            scope: this
         });
      },
      
      /**
       * Remove any deletion mark on the given topic
       */
      onRemoveDeleteMarkTopic: function DiscussionsTopic_onRemoveDeleteMarkTopic()
      {
    	  var removeDeleteMarkOK = function()
          {
            self.location.href=self.location.href;
          };
            
          var removeDeleteMarkFail = function()
          {
            alert('An error occured while attempting to remove the deletion mark from this discussion.  If the error persists, please contact support');
          };
        	
          Alfresco.util.Ajax.request(
          {
               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/removeDeletionMark?nodeRef="+this.topicData.nodeRef,
               method: "PUT",
               successCallback :
            {
               fn: removeDeleteMarkOK,
               scope: this
            },
            failureCallback :
            {
               fn: removeDeleteMarkFail,
               scope: this
            },
            scope: this
         });
      },
      
      /**
       * Mark the current topic as perishable
       */
      onMarkAsPerishableTopic: function DiscussionsTopic_onMarkAsPerishableTopic()
      {
    	  var me = this;
    	  
    	  var handleCancel = function() {
    		  this.cancel();
          };
          var handleSubmit = function() {
        	  if (me.markPerishableDialog.getData().perishable) {
        		  var reason = me.markPerishableDialog.getData().perishable;
		    	  var markAsPerishableOK = function()
		          {
		            self.location.href=self.location.href;
		          };
		            
		          var markAsPerishableFail = function()
		          {
		            alert('An error occurred while attempting to mark this item as perishable.  If the error persists, please contact support');
		          };
		        	
		          Alfresco.util.Ajax.request(
		          {
		               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/markPerishable?nodeRef="+me.topicData.nodeRef,
 					   requestContentType: Alfresco.util.Ajax.JSON,
					   method: Alfresco.util.Ajax.POST,
		               successCallback :
		            {
		               fn: markAsPerishableOK,
		               scope: this
		            },
		            failureCallback :
		            {
		               fn: markAsPerishableFail,
		               scope: this
		            },
                    dataObj:
                    {
                       reason: reason
                    },
		            scope: this
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
       * Remove any perishable mark on the given topic
       */
      onRemovePerishableMarkTopic: function DiscussionsTopic_onRemovePerishableMarkTopic()
      {
    	  var removePerishableMarkOK = function()
          {
            self.location.href=self.location.href;
          };
            
          var removePerishableMarkFail = function()
          {
            alert('An error occured while attempting to remove the perishable mark from this discussion.  If the error persists, please contact support');
          };
        	
          Alfresco.util.Ajax.request(
          {
               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/markPerishable?nodeRef="+this.topicData.nodeRef,
               method: Alfresco.util.Ajax.POST,
               requestContentType: Alfresco.util.Ajax.JSON,
               successCallback :
            {
               fn: removePerishableMarkOK,
               scope: this
            },
            failureCallback :
            {
               fn: removePerishableMarkFail,
               scope: this
            },
            scope: this,
            dataObj:
            {
               reason: ""
            }
         });
      },
      
      /**
       * Archives the topic now, regardless of it's specified archival date
       */
      onDeleteNowTopic: function DiscussionsTopic_onDeleteNowTopic()
      {
    	  var onDeleteNowTopicOK = function()
          {
    		  alert("This discussion has been archived to the deleted items site");
              self.location.href=self.location.href.replace(/discussions-topicview.*/g, 'discussions-topiclist');
          };
            
          var onDeleteNowTopicFail= function()
          {
            alert('An error occured while attempting to remove the deletion mark from this item.  If the error persists, please contact support');
          };
        	
          Alfresco.util.Ajax.request(
          {
               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/archive?nodeRef="+this.topicData.nodeRef,
               method: "POST",
               successCallback :
            {
               fn: onDeleteNowTopicOK,
               scope: this
            },
            failureCallback :
            {
               fn: onDeleteNowTopicFail,
               scope: this
            },
            scope: this
         });
      },
     
      /**
       * Handler for delete topic action link
       */
      onDeleteTopic: function DiscussionsTopic_onDeleteTopic()
      {
         var me = this;
         Alfresco.util.PopupManager.displayPrompt(
         {
            title: this._msg("message.confirm.delete.title"),
            text: this._msg("message.confirm.delete", $html(this.topicData.title)),
            buttons: [
            {
               text: this._msg("button.delete"),
               handler: function DiscussionsTopic_onDeleteTopic_delete()
               {
                  this.destroy();
                  me._deleteTopicConfirm.call(me);
               }
            },
            {
               text: this._msg("button.cancel"),
               handler: function DiscussionsTopic_onDeleteTopic_cancel()
               {
                  this.destroy();
               },
               isDefault: true
            }]
         });
      },
      
      /**
       * Delete topic implementation
       */
      _deleteTopicConfirm: function DiscussionsTopic__deleteTopicConfirm()
      {
         // show busy message
         if (! this._setBusy(this._msg('message.wait')))
         {
            return;
         }
          
         // ajax request success handler
         var onDeleted = function onDeleted(response)
         {
            var listUrl = YAHOO.lang.substitute(Alfresco.constants.URL_PAGECONTEXT + "site/{site}/discussions-topiclist",
            {
               site: this.options.siteId
            });
            window.location = listUrl;
         };
         
         // construct the url to call
         var url = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI + "api/forum/post/site/{site}/{container}/{topicId}?page=discussions-topicview",
         {
            site : this.options.siteId,
            container: this.options.containerId,
            topicId: encodeURIComponent(this.options.topicId)
         });
         
         // perform the ajax request to delete the topic
         Alfresco.util.Ajax.request(
         {
            url: url,
            method: "DELETE",
            responseContentType : "application/json",
            successMessage: this._msg("message.delete.success"),
            successCallback:
            {
               fn: onDeleted,
               scope: this
            },
            failureMessage: this._msg("message.delete.failure"),
            failureCallback:
            {
               fn: function(response)
               {
                  this._releaseBusy();
               },
               scope: this
            }
         });
      },
      
      /**
       * Tag selected handler
       *
       * @method onTagSelected
       * @param tagId {string} Tag name.
       * @param target {HTMLElement} Target element clicked.
       */
      onTagSelected: function DiscussionsTopic_onTagSelected(layer, args)
      {
         var obj = args[1];
         if (obj && (obj.tagName !== null))
         {
            // construct the topic list url with initial active tag filter
            var url = YAHOO.lang.substitute(Alfresco.constants.URL_PAGECONTEXT + "site/{site}/discussions-topiclist?filterId={filterId}&filterOwner={filterOwner}&filterData={filterData}",
            {
               site: this.options.siteId,
               filterId: "tag",
               filterOwner: "Alfresco.TagFilter",
               filterData: encodeURIComponent(obj.tagName)
            });

            window.location = url;
         }
      },

      /**
       * Loads the edit form.
       */
      _loadEditForm: function DiscussionsTopic__loadEditForm()
      {  
         // Load the UI template from the server
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.URL_SERVICECONTEXT + "modules/discussions/topic/edit-topic",
            dataObj:
            {
               htmlid: this.id + "-form"
            },
            successCallback:
            {
               fn: this.onEditFormLoaded,
               scope: this
            },
            failureMessage: this._msg("message.loadeditform.failure")
         });
      },

      /**
       * Event callback when dialog template has been loaded
       *
       * @method onFormLoaded
       * @param response {object} Server response from load template XHR request
       */
      onEditFormLoaded: function DiscussionsTopic_onEditFormLoaded(response)
      {
         // id to use for the form
         var formId = this.id + "-form";
          
         // use the already loaded data
         var data = this.topicData;
          
         // find the edit div to populate
         var editDiv = Dom.get(this.id + "-topic-edit-div");
         
         // insert the html
         editDiv.innerHTML = response.serverResponse.responseText;
         
         // insert current values into the form
         var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI + "api/forum/post/site/{site}/{container}/{topicId}",
         {
            site: this.options.siteId,
            container : this.options.containerId,
            topicId: this.options.topicId
         });
         Dom.get(formId + "-form").setAttribute("action", actionUrl);
         Dom.get(formId + "-site").setAttribute("value", this.options.siteId);
         Dom.get(formId + "-container").setAttribute("value", this.options.containerId);
         Dom.get(formId + "-title").setAttribute("value", data.title);
         Dom.get(formId + "-content").value = data.content;

         // and finally register the form handling
         this._registerEditTopicForm(data, formId);
      },

      /**
       * Registers the form logic
       */
      _registerEditTopicForm: function DiscussionsTopic__registerEditTopicForm(data, formId)
      {
         // add the tags that are already set on the post
         if (this.modules.tagLibrary == undefined)
         {
            this.modules.tagLibrary = new Alfresco.module.TagLibrary(formId);
            this.modules.tagLibrary.setOptions(
            {
               siteId: this.options.siteId
            });
         }
         this.modules.tagLibrary.setTags(this.topicData.tags);
         
         // register the okButton
         this.widgets.okButton = new YAHOO.widget.Button(formId + "-submit",
         {
            type: "submit"
         });
         
         // register the cancel button
         this.widgets.cancelButton = new YAHOO.widget.Button(formId + "-cancel",
         {
            type: "button"
         });
         this.widgets.cancelButton.subscribe("click", this.onEditFormCancelButtonClick, this, true);
         
         // instantiate the simple editor we use for the form
         this.widgets.editor = new YAHOO.widget.SimpleEditor(formId + '-content',
         {
             height: '180px',
             width: '700px',
             dompath: false, //Turns on the bar at the bottom
             animate: false, //Animates the opening, closing and moving of Editor windows
             toolbar:  Alfresco.util.editor.getTextOnlyToolbarConfig(this._msg)
         });
         this.widgets.editor.addPageUnloadBehaviour(this._msg("message.unsavedChanges.reply"));
         this.widgets.editor.render();
         
         // create the form that does the validation/submit
         var editForm = new Alfresco.forms.Form(formId + "-form");
         editForm.setShowSubmitStateDynamically(true, false);
         editForm.setSubmitElements(this.widgets.okButton);
         editForm.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT);
         editForm.setAJAXSubmit(true,
         {
            successMessage: this._msg("message.savetopic.success"),
            successCallback:
            {
               fn: this.onEditFormSubmitSuccess,
               scope: this
            },
            failureMessage: this._msg("message.savetopic.failure"),
            failureCallback:
            {
               fn: this.onEditFormSubmitFailure,
               scope: this
            }
         });
         editForm.setSubmitAsJSON(true);
         editForm.doBeforeFormSubmit =
         {
            fn: function(form, obj)
            {   
               // disable the buttons
               this.widgets.okButton.set("disabled", true);
               this.widgets.cancelButton.set("disabled", true);
               
               //Put the HTML back into the text area
               this.widgets.editor.saveHTML();
               
               // update the tags set in the form
               this.modules.tagLibrary.updateForm(formId + "-form", "tags");
               
               // show a wait message
               this.widgets.feedbackMessage = Alfresco.util.PopupManager.displayMessage(
               {
                  text: Alfresco.util.message(this._msg("message.submitting")),
                  spanClass: "wait",
                  displayTime: 0
               });
            },
            scope: this
         };
         
         this.modules.tagLibrary.initialize(editForm);
         editForm.init();
         
         // show the form and hide the view
         this._showEditView();
         
         // TODO: disabled as it does not work correctly on IE. The focus is set
         // but hitting tab moves the focus to the focus to the address bar instead
         // of the editor
         // focus the title text field
         //Dom.get(formId + "-title").focus();
      },
      
      /**
       * Edit form submit success handler
       */
      onEditFormSubmitSuccess: function DiscussionsTopic_onEditFormSubmitSuccess(response, object)
      {
         // remove busy message
         this._releaseBusy();
         
         // the response contains the new data for the comment. Render the comment html
         // and insert it into the view element
         this.topicData = response.json.item;
         this.renderUI();
            
         // hide the form and show the ui
         this._hideEditView();
            
         // inform the replies object about the update
         this._fireTopicDataChangedEvent();
      },
      
      /**
       * Edit form submit failure handler
       */
      onEditFormSubmitFailure: function DiscussionsTopic_onEditFormSubmitFailure(response, object)
      {
         // remove busy message
         this._releaseBusy();
          
         // enable the buttons
         this.widgets.okButton.set("disabled", false);
         this.widgets.cancelButton.set("disabled", false);
      },
      
      /**
       * Edit form cancel button click handler
       */
      onEditFormCancelButtonClick: function(type, args)
      {
          this._hideEditView();
      },
      
      /**
       * Hides the form and displays the view
       */
      _hideEditView: function()
      {
         var editDiv = Dom.get(this.id + "-topic-edit-div");
         var viewDiv = Dom.get(this.id + "-topic-view-div");
         Dom.addClass(editDiv, "hidden");
         Dom.removeClass(viewDiv, "hidden");
         editDiv.innerHTML = '';
      },
      
      /**
       * Hides the view and displays the form
       */
      _showEditView: function()
      {
         var editDiv = Dom.get(this.id + "-topic-edit-div");
         var viewDiv = Dom.get(this.id + "-topic-view-div");
         Dom.addClass(viewDiv, "hidden");
         Dom.removeClass(editDiv, "hidden");
      },

      /**
       * Called when the mouse enters into the topic div
       */
      onTopicElementMouseEntered: function DiscussionsTopicList_onTopicElementMouseEntered(layer, args)
      {
         // make sure the user sees at least one action, otherwise we won't highlight
         var permissions = this.topicData.permissions;
         if (!(permissions.edit || permissions["delete"]))
         {
            return;
         } 
         
         Dom.addClass(args[1].target, 'over');
      },
     
      /**
       * Called whenever the mouse exits the topic div
       */
      onTopicElementMouseExited: function DiscussionsTopicList_onTopicElementMouseExited(layer, args)
      {
         Dom.removeClass(args[1].target, 'over');
      },

      /**
       * Fires a topic data changed bubble event
       */
      _fireTopicDataChangedEvent: function DiscussionsTopicList__fireTopicDataChangedEvent()
      {
         var eventData =
         {
            topicRef: this.topicData.nodeRef,
            topicTitle: this.topicData.title,
            topicId: this.topicData.name
         };
         YAHOO.Bubbling.fire("topicDataChanged", eventData);
      },
      
      /**
       * Displays the provided busyMessage but only in case
       * the component isn't busy set.
       * 
       * @return true if the busy state was set, false if the component is already busy
       */
      _setBusy: function DiscussionsTopic__setBusy(busyMessage)
      {
         if (this.busy)
         {
            return false;
         }
         this.busy = true;
         this.widgets.busyMessage = Alfresco.util.PopupManager.displayMessage(
         {
            text: busyMessage,
            spanClass: "wait",
            displayTime: 0
         });
         return true;
      },
      
      /**
       * Removes the busy message and marks the component as non-busy
       */
      _releaseBusy: function DiscussionsTopic__releaseBusy()
      {
         if (this.busy)
         {
            this.widgets.busyMessage.destroy();
            this.busy = false;
            return true;
         }
         else
         {
            return false;
         }
      },

      /**
       * Gets a custom message
       *
       * @method _msg
       * @param messageId {string} The messageId to retrieve
       * @return {string} The custom message
       * @private
       */
      _msg: function DiscussionsTopic_msg(messageId)
      {
         return Alfresco.util.message.call(this, messageId, "Alfresco.DiscussionsTopic", Array.prototype.slice.call(arguments).slice(1));
      }
   };
})();
