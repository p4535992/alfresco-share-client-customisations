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
 * CreateTopic component.
 * Logic for a topic creation form.
 * 
 * @namespace Alfresco
 * @class Alfresco.CreateTopic
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
   * CreateTopic constructor.
   * 
   * @param {String} htmlId The HTML id of the parent element
   * @return {Alfresco.CreateTopic} The new Topic instance
   * @constructor
   */
   Alfresco.CreateTopic = function(htmlId)
   {
      /* Mandatory properties */
      this.name = "Alfresco.CreateTopic";
      this.id = htmlId;
      
      /* Initialise prototype properties */
      this.widgets = {};
      this.modules = {};
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["datasource", "json", "connection", "event", "button", "menu", "editor"], this.onComponentsLoaded, this);
           
      return this;
   };
   
   Alfresco.CreateTopic.prototype =
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
          * True if the component should be in edit mode.
          *
          * @property editMode
          * @type boolean
          */
         editMode: false,

         /**
          * Id of the topic to edit. Only relevant if editMode is true
          *
          * @property topicId
          * @type string
          */
         topicId: ""

      },
      
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
       * Stores the data of the currently edited blog post
       *
       * @property discussionsTopicData
       * @type object
       */
      discussionsTopicData: null,

      
      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       */
      setOptions: function CreateTopic_setOptions(obj)
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
      setMessages: function CreateTopic_setMessages(obj)
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
      onComponentsLoaded: function CreateTopic_onComponentsLoaded()
      {
         YAHOO.util.Event.onContentReady(this.id, this.onReady, this, true);
      },
  
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function CreateTopic_onReady()
      {
         if (this.options.editMode)
         {
            // load the topic data prior to initializing the form
            this._loadDiscussionsTopicData();
         }
         else
         {
            // directly initialize the form
            this._initializeDiscussionsTopicForm();
         }
      },

      /**
       * Loads the topic and refreshes the ui
       */
      _loadDiscussionsTopicData: function CreateTopic__loadDiscussionsTopicData()
      {
         // ajax request success handler
         var me = this;
         var loadTopicPostDataSuccess = function CreateTopic_loadTopicDataSuccess(response)
         {
            // set the topic data
            var data = response.json.item;
            me.discussionsTopicData = data;

            // now initialize the form, which will use the data we just loaded
            me._initializeDiscussionsTopicForm();
         };

         // construct the request url
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
            method: "GET",
            responseContentType : "application/json",
            successCallback:
            {
               fn: loadTopicPostDataSuccess,
               scope: this
            },
            failureMessage: this._msg("message.loadpostdata.failure")
         });
      },

      /**
       * Initializes the create topic form dom.
       * The html is already in the dom when the component gets loaded
       */
      _initializeDiscussionsTopicForm: function CreateTopic_initializeDiscussionsTopicForm()
      {          

         var actionUrl, draft = true, title = "", content = "";
         if (this.options.editMode)
         {
            actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI + "api/forum/post/site/{site}/{container}/{topicId}",
            {
               site: this.options.siteId,
               container: this.options.containerId,
               topicId: this.options.topicId
            });
         }
         else
         {
            actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI + "api/forum/site/{site}/{container}/posts",
            {
               site: this.options.siteId,
               container: this.options.containerId
            });
         }

         // insert current values into the form
         Dom.get(this.id + '-form').setAttribute("action", actionUrl);
         Dom.get(this.id + "-site").setAttribute("value", this.options.siteId);
         Dom.get(this.id + "-container").setAttribute("value", this.options.containerId);

         // title
         if (this.options.editMode)
         {
            title = this.discussionsTopicData.title;
            this.renderMarking();
            
            if (this.discussionsTopicData.archiveDue != undefined || this.discussionsTopicData.perishDue != undefined)
            {
            	this.renderMarkedForDeleteBanner();
            }
         }
         Dom.get(this.id + '-title').setAttribute("value", title);

         // content
         if (this.options.editMode)
         {
            content = this.discussionsTopicData.content;
         }
         Dom.get(this.id + '-content').value = content;

          // and finally register the form handling
         this._registerCreateTopicForm();
      },
      
      renderMarkedForDeleteBanner: function()
      {
    	  
    	  var container = YAHOO.util.Selector.query('div[id=markedForDeleteContainer]')[0];
    	  var uid = this.discussionsTopicData.nodeRef.replace("workspace://SpacesStore/","");
    	  
    	  var html='<div class="deleteMarkWrapper topicListDeleteMarkWrapper">';
    	  
    	  if(this.discussionsTopicData.archivalStatus && this.discussionsTopicData.archivalStatus.archivalDue) {
    		  html+='<div class="deleteDate">Due for deletion on <span class="date">'+this.discussionsTopicData.archivalStatus.archivalDue+'</span></div>';
    	  }
    	  
    	  if(this.discussionsTopicData.archiveDue != undefined) {
        	  html+='<div class="markedForDeletion" id="DeletionMark-'+uid+'">Marked for deletion <span class="markMeta">by <a href="/share/page/user/'+this.discussionsTopicData.deletedBy+'/profile">'+this.discussionsTopicData.deletedBy+'</a></span></div>';
    	  }

    	  if(this.discussionsTopicData.perishDue != undefined) {
    		  var perishLabel = this._msg("label.markedAsPerishable", this.discussionsTopicData.perishTitle, this.discussionsTopicData.perishRequestedBy);
        	  html+='<div id="PerishableMark-'+uid+'" class="markedAsPerishable">'+perishLabel+' <span class="markMeta">by <a href="/share/page/user/'+this.discussionsTopicData.perishRequestedBy+'/profile">'+this.discussionsTopicData.perishRequestedBy+'</a></span></div>';
    	  }
    	  
    	  html+='</div><div class="clearLeft"></div>';
    	  
    	  container.innerHTML=html;
     	  
      },

      /**
       * After we've loaded in a topic to be edited using AJAX, render the security marking of the item
       * we are editing, and redraw the enhanced security ribbon to take the newly defined parent marking into account
       * @method renderMarking
       */
      renderMarking: function()
      {
          var nodBox = YAHOO.util.Selector.query('div span.eslRenderNod')[0];
          var pmBox = YAHOO.util.Selector.query('div span.eslRenderPM')[0];
          var atomalBox = YAHOO.util.Selector.query('div span.eslRenderAtomal')[0];
          var freeformBox = YAHOO.util.Selector.query('div span.eslRenderFreeForm')[0];
          var eyesBox = YAHOO.util.Selector.query('div span.eslRenderEyes')[0];
          var openBox = YAHOO.util.Selector.query('div span.eslRenderOpen')[0];
          var orgBox = YAHOO.util.Selector.query('div span.eslRenderOrganisations')[0];
          var closedBox = YAHOO.util.Selector.query('div span.eslRenderClosed')[0];
          var parentDiv = YAHOO.util.Selector.query('div[id=securityMarking]')[0];
          
          nodBox.innerHTML=this.discussionsTopicData.eslNod;
          pmBox.innerHTML=this.discussionsTopicData.eslPM;
          atomalBox.innerHTML=this.discussionsTopicData.eslAtomal;
          freeformBox.innerHTML=this.discussionsTopicData.eslFreeFormCaveats;
          eyesBox.innerHTML=this.discussionsTopicData.eslEyes;
          openBox.innerHTML=this.discussionsTopicData.eslOpen;
          closedBox.innerHTML=this.discussionsTopicData.eslClosed;
          orgBox.innerHTML=this.discussionsTopicData.eslOrganisations;

          Dom.addClass(parentDiv, "ESLInvisible"); //Hide the existing marking
          
          //We can't always guarantee the order that client-side javascript is run - if the ribbon has already been
          //rendered, we'll need to refresh it
          var ribbon = Alfresco.util.ComponentManager.findFirst('Alfresco.EnhancedSecuritySelector');
          if (ribbon!=null)
          {
              ribbon.refreshAndRedraw(parentDiv.parentElement);
          }
      },

      /**
       * Registers the form logic.
       */
      _registerCreateTopicForm: function CreateTopic__registerCreateTopicForm()
      {
         // initialize the tag library
         this.modules.tagLibrary = new Alfresco.module.TagLibrary(this.id);
         this.modules.tagLibrary.setOptions(
         {
            siteId: this.options.siteId
         });

         // add the tags that are already set on the post
         if (this.options.editMode && this.discussionsTopicData.tags.length > 0)
         {
            this.modules.tagLibrary.setTags(this.discussionsTopicData.tags);
         }

         // register the okButton
         this.widgets.okButton = new YAHOO.widget.Button(this.id + "-submit",
         {
            type: "submit"
         });
         
         // register the cancel button
         this.widgets.cancelButton = new YAHOO.widget.Button(this.id + "-cancel");
         this.widgets.cancelButton.subscribe("click", this.onFormCancelButtonClick, this, true);
         
         // instantiate the simple editor we use for the form
         this.widgets.editor = new Alfresco.util.RichEditor(Alfresco.constants.HTML_EDITOR,this.id + '-content', this.options.editorConfig);         
         this.widgets.editor.addPageUnloadBehaviour(this._msg("message.unsavedChanges.discussion"));
         this.widgets.editor.render();
         
         // Add validation to the editor
         var keyUpIdentifier = (Alfresco.constants.HTML_EDITOR === 'YAHOO.widget.SimpleEditor') ? 'editorKeyUp' : 'onKeyUp';
         this.widgets.editor.subscribe(keyUpIdentifier, function (e)
         {
            /**
             * Doing a form validation on every key stroke is process consuming, below we try to make sure we only do
             * a form validation if it's necessarry.
             * NOTE: Don't check for zero-length in commentsLength, due to HTML <br>, <span> tags, etc. possibly
             * being present. Only a "Select all" followed by delete will clean all tags, otherwise leftovers will
             * be there even if the form looks empty.
             */                       
            if (this.widgets.editor.getContent().length < 20 || this.widgets.okButton.get("disabled"))
            {
               // Submit was disabled and something has been typed, validate and submit will be enabled
               this.widgets.editor.save();
               this.widgets.topicForm.updateSubmitElements();
            }
         }, this, true);

         // create the form that does the validation/submit
         this.widgets.topicForm = new Alfresco.forms.Form(this.id + "-form");
         this.widgets.topicForm.setShowSubmitStateDynamically(true, false);
         // Title
         this.widgets.topicForm.addValidation(this.id + "-title", Alfresco.forms.validation.mandatory, null, "keyup");
         this.widgets.topicForm.addValidation(this.id + "-title", Alfresco.forms.validation.length,
         {
            max: 256,
            crop: true
         }, "keyup");
         // Content
         this.widgets.topicForm.addValidation(this.id + "-content", Alfresco.forms.validation.mandatory, null);

         this.widgets.perishableRadioButtons = YAHOO.util.Selector.query("input[name='perishable']", this.id + "-form");
         
         for(var i = 0; i < this.widgets.perishableRadioButtons.length; ++i) {
        	 this.widgets.topicForm.addValidation(this.widgets.perishableRadioButtons[i], SurevineValidators.mandatory, null, "click");
         }
         
         this.widgets.topicForm.setSubmitElements(this.widgets.okButton);
         this.widgets.topicForm.setAJAXSubmit(true,
         {
            successMessage: this._msg("message.savetopic.success"),
            successCallback:
            {
               fn: this.onFormSubmitSuccess,
               scope: this
            },
            failureMessage: this._msg("message.savetopic.failure"),
            failureCallback:
            {
               fn: this.onFormSubmitFailure,
               scope: this
            }
         });
         if (this.options.editMode)
         {
             this.widgets.topicForm.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT);
         }
         this.widgets.topicForm.setSubmitAsJSON(true);
         this.widgets.topicForm.doBeforeFormSubmit =
         {
            fn: function(form, obj)
            {
               // disable buttons
               this.widgets.okButton.set("disabled", false);
               this.widgets.cancelButton.set("disabled", false);
                
               //Put the HTML back into the text area
               this.widgets.editor.save();
               
               // update the tags set in the form
               this.modules.tagLibrary.updateForm(this.id + '-form', 'tags');
               
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
         
         this.modules.tagLibrary.initialize(this.widgets.topicForm);
         this.widgets.topicForm.init();
         
         // show the form
         Dom.removeClass(this.id + "-topic-create-div", "hidden");
         Dom.get(this.id + '-title').focus();
      },
      
      /**
       * Form submit success handler
       */
      onFormSubmitSuccess: function CreateTopic_onFormSubmitSuccess(response, object)
      {
         // the response contains the data of the created topic. redirect to the topic view page
         var url = Alfresco.util.discussions.getTopicViewPage(this.options.siteId, this.options.containerId, response.json.item.name);
         window.location = url;
      },
      
      /**
       * Reenables the inputs which got disabled as part of a comment submit
       */
      onFormSubmitFailure: function CreateComment_onFormSubmitFailure()
      {
         // enable buttons
         this.widgets.okButton.set("disabled", false);
         this.widgets.cancelButton.set("disabled", false);
         
         // hide message
         this.widgets.feedbackMessage.destroy();
      },
      
      /**
       * Form cancel button click handler
       */
      onFormCancelButtonClick: function CreateTopic_onFormCancelButtonClick(type, args)
      {
         // return to the page we came from
         history.go(-1);
      },

      /**
       * Gets a custom message
       *
       * @method _msg
       * @param messageId {string} The messageId to retrieve
       * @return {string} The custom message
       * @private
       */
      _msg: function CreateTopic_msg(messageId)
      {
         return Alfresco.util.message.call(this, messageId, "Alfresco.CreateTopic", Array.prototype.slice.call(arguments).slice(1));
      }
   };
})();
