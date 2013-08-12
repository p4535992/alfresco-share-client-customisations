/**
 * A little hack here designed to replicate the usual # href functionality but force a page refresh.  Just doing a regular location.href={mypage}#mylink won't refresh
 * the page in all browsers
 * 
 */

function getQuerystring(key)
{
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return null;
  else
    return qs[1];
}

/**
 * Simple implementation of getElementsByClassName that works in IE as well.  Not
 * this is _very_ simple, and won't work in every case, but will work in the cases it is intended.
 * In particular note that it only gets DIRECT children, not grandchildren etc
 * to
 */
function com_surevine_getChildOfClass (el, className) {
	  var potentialTargets=el.children;
		  var target=null;
		  for (var i=0; i<potentialTargets.length; i++) {
			  if (YAHOO.util.Dom.hasClass(potentialTargets[i], className) || (potentialTargets[i].getAttribute("class")!=null && potentialTargets[i].getAttribute("class").indexOf(className)!=-1)) {
				  target=potentialTargets[i];
				  break;
			  }
		  }
		  return target;
}

/*
 *** Alfresco.WikiList
*/
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   Alfresco.WikiList = function(containerId)
   {
      this.name = "Alfresco.WikiList";
      this.id = containerId;
      this.options = {};

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["button", "container", "connection", "editor", "tabview", "datasource"], this.onComponentsLoaded, this);
      return this;
   };
   
   Alfresco.WikiList.prototype = 
   {
      _selectedTag: "",

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
          * The pages on this sites wiki.
          *
          * @property pages
          * @type Array
          */
         pages: [],
         
         /**
          * Error state.
          *
          * @property error
          * @type boolean
          */
         error: false,
         
         /**
          * Widget permissions.
          *
          * @property permissions
          * @type object
          */
         permissions: {}
      },

      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       * @return {Alfresco.DocListToolbar} returns 'this' for method chaining
       */
      setOptions: function WikiList_setOptions(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);

         // Make sure the parser is using the current site
         this.$parser = new Alfresco.WikiParser();
         this.$parser.URL = Alfresco.constants.URL_PAGECONTEXT + "site/" + this.options.siteId + "/wiki-page?title=";

         return this;
      },
       
       /**
       * Fired by YUILoaderHelper when required component script files have
       * been loaded into the browser.
       *
       * @method onComponentsLoaded
       */
       onComponentsLoaded: function WikiList_onComponentsLoaded()
       {
          Event.onContentReady(this.id, this.onReady, this, true);
       },
       
       /**
        * Fired by YUI when parent element is available for scripting.
        * Initialises components, including YUI widgets.
        *
        * @method onReady
        */
       onReady: function WikiList_onReady()
       {
          if (this.options.error)
          {
             // Site or container not found - deactivate controls
             YAHOO.Bubbling.fire("deactivateAllControls");
             return;
          }
          
          this._initMouseOverListeners();

          // Render any mediawiki markup
          // TODO: look at doing this on the server
          var divs = Dom.getElementsByClassName('pageCopy', 'div');
          var div;
          for (var i=0; i < divs.length; i++)
          {
             div = divs[i];
             div.innerHTML = this.$parser.parse(div.innerHTML, this.options.pages);
          }
          
          YAHOO.Bubbling.addDefaultAction('delete-link', function(layer, args)
          {
             var link = args[1].target;
             if (link)
             {
                var title, node;
                // Search for the "title" attribute as that has the page title
                for (var i = 0, ii = link.attributes.length; i < ii; i++)
                {
                   node = link.attributes[i];
                   if (node.nodeName.toLowerCase() === 'title')
                   {
                      title = node.nodeValue;
                      break; 
                   }
                }
                
                if (title)
                {
                   // Trigger the delete dialog in the toolbar
                   YAHOO.Bubbling.fire('deletePage',
                   {
                      title: title
                   });
                }
             }
             
             return true;
          });          
          
          // Add mark-for-delete behaviour to the link in the page list
          YAHOO.Bubbling.addDefaultAction('mark-for-delete-link', function(layer, args)
          {
        	  
        	  var link = args[1].target;
              if (link)
              {
            	  
                 var title, node;
                 // Search for the "title" attribute as that has the page title
                 for (var i = 0, ii = link.attributes.length; i < ii; i++)
                 {
                    node = link.attributes[i];
                    
                    if (node.nodeName.toLowerCase() === 'title')
                    {
                       title = node.nodeValue;
                       break; 
                    }
                 }
                 
                 if (title)
                 {
                	
               	  var markForDeleteOK = function()
                  {
               		  var pageTitle=this.el.parentNode.parentNode.parentNode.id.substring(10);
               		  
               		  //Find relevant elements
               		  var insertBefore = YAHOO.util.Selector.query('div[id=wiki-page-'+pageTitle+'] > div:nth-child(2)')[0];
               		  
               		  //If we've pulsed the element, then a script tag will be inserted, meaning that we actually want the third child
               		  if (!insertBefore) {
                   		  insertBefore = YAHOO.util.Selector.query('div[id=wiki-page-'+pageTitle+'] > div:nth-child(3)')[0];

               		  }
               		  var parent = YAHOO.util.Selector.query('div[id=wiki-page-'+pageTitle+']')[0];
               		  
               		  //Add the marked for delete message
               		  var containerRaw = document.createElement('div')
               		  var container = new YAHOO.util.Element(containerRaw);
               		  container.appendTo(parent, insertBefore);

               		  containerRaw.setAttribute("id", parent.id+"-markedForDeletionDiv");

               		  var profileLink=YAHOO.util.Selector.query('span.my-profile > a')[0].href;
               		  var userName=profileLink.substring(profileLink.indexOf('/user')+6, profileLink.indexOf('/profile'));
               		  var expirationDate = new Date(new Date().getTime()+(1000*60*60*24*7)); //1 week, this will need manually changing if that is adjusted on the server  

               		  document.getElementById(parent.id+"-markedForDeletionDiv").className = "deleteMarkWrapper wikiDeleteMarkWrapper";
               		  
               		  containerRaw.innerHTML+='<div class="deleteDate" id="deleteDateDiv">Due for deletion on <span class="date">'+YAHOO.util.Date.format(expirationDate, {format:'%a %b %d %G'})+'</span></div>';
               		  containerRaw.innerHTML+='<div class="markedForDeletion" id="DeletionMark-'+title+'">Marked for deletion <span class="markMeta">by <a href="/share/page/user/'+userName+'/profile">'+userName+'</a></span></div>';             		  
               		  
               		  //Remove the old command button  		  
               		  var actionPanel = com_surevine_getChildOfClass(parent, 'actionPanel');
               		  var markForDeleteButton = com_surevine_getChildOfClass(actionPanel, 'markPageForDelete');
               		  actionPanel.removeChild(markForDeleteButton);
               		  
               		  //Add new command buttons
               		  var removeDeletionMarkRaw = document.createElement('div');
               		  var removeDeletionMark = new YAHOO.util.Element(removeDeletionMarkRaw);
               		  removeDeletionMarkRaw.setAttribute("id", parent.id+"-removeDeletionMarkLink");
               		  removeDeletionMark.appendTo(actionPanel);
               		  Dom.addClass(parent.id+"-removeDeletionMarkLink", "removeDeleteMark");
               		  removeDeletionMarkRaw.innerHTML="<a href='#' class='remove-deletion-mark-link' title='"+unescape(pageTitle)+"'>Remove Deletion Mark</a>";
               		  
               		  
               		  if (document.com_surevine_md_auth && document.com_surevine_md_auth=='deleter') {
               			  var deleteNowRaw = document.createElement('div');
               			  var deleteNow = new YAHOO.util.Element(deleteNowRaw);
               			  deleteNow.appendTo(actionPanel);
               			  deleteNowRaw.setAttribute("id", parent.id+"-deleteNowLink");
                   		  Dom.addClass(parent.id+"-deleteNowLink", "deleteNow");
               			  deleteNowRaw.innerHTML="<a href='#' class='delete-now-link' title='"+unescape(pageTitle)+"'>Delete Now</a>";
               		  }
               		  
                  };
                    
                  var markForDeleteFail = function()
                  {
                    alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
                  };
                	 
                   var siteName = Alfresco.constants.SITE;
                   var path = '/app:company_home/st:sites/cm:'+encodeURIComponent(siteName)+'/cm:wiki/cm:'+encodeURIComponent(title);
                 	
                   Alfresco.util.Ajax.request(
                             {
                               url : Alfresco.constants.PROXY_URI + "sv-theme/delete/markForDelete?path="+path,
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
                 return true;
               }   
             }
          });
          
          // Add logic to add the 'remove delete mark' button to the link in the page list
          YAHOO.Bubbling.addDefaultAction('remove-deletion-mark-link', function(layer, args)
          {
        	  
        	  var link = args[1].target;
              if (link)
              {
                 var title, node;
                 // Search for the "title" attribute as that has the page title
                 for (var i = 0, ii = link.attributes.length; i < ii; i++)
                 {
                    node = link.attributes[i];
                    if (node.nodeName.toLowerCase() === 'title')
                    {
                       title = node.nodeValue;
                       break; 
                    }
                 }
                 
                 if (title)
                 {
                	
               	  var removeDeleteMarkOK = function()
                  {

               		  var pageTitle=this.el.parentNode.parentNode.parentNode.id.substring(10);
               		  
               		  //Find relevant elements
               		  var parent = YAHOO.util.Selector.query('div[id=wiki-page-'+pageTitle+']')[0]

               		  var targetDiv = com_surevine_getChildOfClass(parent, 'deleteMarkWrapper');               		  

               		  //Remove the marked for delete message
               		  parent.removeChild(targetDiv);

               		  var actionPanel = com_surevine_getChildOfClass(parent, 'actionPanel');
               		  
               		  //Remove the old command button (Delete Now button may not be present)
               		  var markForDeleteButton = com_surevine_getChildOfClass(actionPanel, 'removeDeleteMark');
               		  actionPanel.removeChild(markForDeleteButton);
               		  var deleteNowButton = com_surevine_getChildOfClass(actionPanel, 'deleteNow');
               		  if (deleteNowButton) {
               			  actionPanel.removeChild(deleteNowButton);
               		  }
               		  
               		  //Add new command buttons
               		  var removeDeletionMarkRaw = document.createElement('div');
               		  var removeDeletionMark = new YAHOO.util.Element(removeDeletionMarkRaw);
               		  removeDeletionMark.appendTo(actionPanel);
               		  removeDeletionMarkRaw.setAttribute("id", parent.id+"-markPageForDeleteLink");
               		  Dom.addClass(parent.id+"-markPageForDeleteLink", "markPageForDelete");

               		  removeDeletionMarkRaw.innerHTML="<a href='#' class='mark-for-delete-link' title='"+unescape(pageTitle)+"'>Mark for Delete</a>";
                  };
                    
                  var removeDeleteMarkFail = function()
                  {
                    alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
                  };
                	 
                   var siteName = Alfresco.constants.SITE;
                   var path = '/app:company_home/st:sites/cm:'+siteName+'/cm:wiki/cm:'+encodeURIComponent(title);
                 	
                   Alfresco.util.Ajax.request(
                   {
                     url : Alfresco.constants.PROXY_URI + "sv-theme/delete/removeDeletionMark?path="+path,
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
                 return true;
               }   
             }
          });
          
          // Add logic to add the 'undelete item' button to the link in the page list
          YAHOO.Bubbling.addDefaultAction('undelete-link', function(layer, args)
          {
        	  
        	  var link = args[1].target;
              if (link)
              {
                 var title, node;
                 // Search for the "title" attribute as that has the page title
                 for (var i = 0, ii = link.attributes.length; i < ii; i++)
                 {
                    node = link.attributes[i];
                    if (node.nodeName.toLowerCase() === 'title')
                    {
                       title = node.nodeValue;
                       break; 
                    }
                 }
                 
                 if (title)
                 {
                	
               	  var undeleteOK = function()
                  {
               		alert("The wiki page has been moved back to its original location");
               		window.location.href=window.location.href.replace(/#.*/g, '').replace(/\?.*/g, '');
                  };
                    
                  var undeleteFail = function()
                  {
                    alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
                  };
                	 
                   var siteName = Alfresco.constants.SITE;
                   var path = '/app:company_home/st:sites/cm:'+siteName+'/cm:wiki/cm:'+title;
                 	
                   Alfresco.util.Ajax.request(
                   {
                     url : Alfresco.constants.PROXY_URI + "sv-theme/delete/undelete?path="+path,
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
                 return true;
               }   
             }
          });
          
          // Add logic to add the 'delete now' button to the link in the page list
          YAHOO.Bubbling.addDefaultAction('delete-now-link', function(layer, args)
          {
        	  
        	  var link = args[1].target;
              if (link)
              {
                 var title, node;
                 // Search for the "title" attribute as that has the page title
                 for (var i = 0, ii = link.attributes.length; i < ii; i++)
                 {
                    node = link.attributes[i];
                    if (node.nodeName.toLowerCase() === 'title')
                    {
                       title = node.nodeValue;
                       break; 
                    }
                 }
                 
                 if (title)
                 {
                	
               	  var deleteNowOK = function()
                  {
               		alert("The wiki page has been archived to the deleted items site");
               		window.location.href=window.location.href.replace(/#.*/g, '').replace(/\?.*/g, '');
                  };
                    
                  var deleteNowFail = function()
                  {
                    alert('An error occurred while attempting to mark this item for delete.  If the error persists, please contact support');
                  };
                	 
                   var siteName = Alfresco.constants.SITE;
                   var path = '/app:company_home/st:sites/cm:'+siteName+'/cm:wiki/cm:'+encodeURIComponent(title);
                 	
                   Alfresco.util.Ajax.request(
                   {
                     url : Alfresco.constants.PROXY_URI + "sv-theme/delete/archive?path="+path,
                     method: "POST",
                     successCallback :
                     {
                       fn: deleteNowOK,
                       scope: this
                     },
                     failureCallback :
                     {
                       fn: deleteNowFail,
                       scope: this
                     },
                       scope: this
                   });
                 return true;
               }     
             }
          });

          YAHOO.Bubbling.addDefaultAction('wiki-tag-link', function(layer, args)
          {
             var link = args[1].target;
             if (link)
             {
                var tagName = link.firstChild.nodeValue;
                YAHOO.Bubbling.fire("tagSelected",
                {
                   "tagname": tagName
                });
             }
             return true;
          });

          YAHOO.Bubbling.on("tagSelected", this.onTagSelected, this);
          
          // Fire permissions event to allow other components to update their UI accordingly
          YAHOO.Bubbling.fire("userAccess",
          {
            userAccess: this.options.permissions
          });
          
          YAHOO.Bubbling.fire("filterChanged",
          {
             filterId: this.options.filterId,
             filterOwner: "Alfresco.WikiFilter",
             filterdata: ""
          });
       },
       
       onTagSelected: function WikiList_onTagSelected(e, args)
       {
          var tagname = args[1].tagname;
          
          if (tagname === Alfresco.util.message('label.all-tags', 'Alfresco.TagComponent'))
          {
             var divs = Dom.getElementsByClassName('wikiPageDeselect', 'div');
             for (var i=0; i < divs.length; i++)
             {
                Dom.removeClass(divs[i], 'wikiPageDeselect');
             }
             
             this._tagSelected = "";
          }
          else if (this._tagSelected !== tagname) 
          {
             var divs = Dom.getElementsByClassName('wikipage', 'div');
             var div, i, j;
             
             for (i = 0, j = divs.length; i < j; i++)
             {
                div = divs[i];
             
                if (Dom.hasClass(div, 'wikiPageDeselect'))
                {
                   Dom.removeClass(div, 'wikiPageDeselect');
                }
             
                if (!Dom.hasClass(div, 'wp-' + tagname)) 
                {
                   Dom.addClass(divs[i], 'wikiPageDeselect');
                }
             }
          
             this._tagSelected = tagname;
          }
       },       
       
       _initMouseOverListeners: function WikiList__initMouseOverListeners()
       {
          var divs = Dom.getElementsByClassName('wikipage', 'div');
          for (var x=0; x < divs.length; x++)
          {
             Event.addListener(divs[x], 'mouseover', this.mouseOverHandler);
             Event.addListener(divs[x], 'mouseout', this.mouseOutHandler);
          }
       },
       
       mouseOverHandler: function WikiList_mouseOverHandler(e)
       {
          var currentTarget = e.currentTarget;
          Dom.addClass(currentTarget, 'over');
       },
       
       mouseOutHandler: function WikiList_mouseOutHandler(e)
       {
          var currentTarget = e.currentTarget;
          Dom.removeClass(currentTarget, 'over');
       }      
   };
   
})();
