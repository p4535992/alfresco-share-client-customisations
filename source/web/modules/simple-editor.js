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
Alfresco.util = Alfresco.util || {};

Alfresco.util.createImageEditor = function(id, options)
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;   
   
   YAHOO.Bubbling.on('editorInitialized', function(e)
   {
      // Create the gutter control
      gutter.createGutter();
   });

   options.setup = function(ed) 
   {
      ed.addButton('alfresco-imagelibrary',
      {
         title: Alfresco.util.message("imagelib.tooltip"),
         onclick: function(ev)
         {
            gutter.toggle.call(gutter);
         }
      });
      YAHOO.Bubbling.on('alfresco-imagelibClick', function(ev, args)
      {
         if (args && args[1].img)
         {
            var html = '<img src="' + args[1].img + '" title="' + ev.title + '"/>';
            ed.execCommand('mceInsertContent', false, html);
         }
         gutter.toggle();
      });
   };
   var editor = new Alfresco.util.RichEditor(Alfresco.constants.HTML_EDITOR, id, options);
   var gutter = new Alfresco.gutter(editor);

   Event.onAvailable('image_results', function()
   {
      Event.on('image_results', 'mousedown', function(ev)
      {
         Event.stopEvent(ev);
         var target = Event.getTarget(ev);
         if (target.tagName.toLowerCase() == 'img')
         {
            var longdesc = target.getAttribute("longdesc");
            if (YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 8)
            {
               longdesc = target.longdesc;
            }
            if (longdesc)
            {
               title = target.getAttribute('title');
               YAHOO.Bubbling.fire('alfresco-imagelibClick',
               {
                  type: 'alfresco-imagelibClick',
                  img: longdesc,
                  title: title
               });
            }
         }
      }, editor, true);

       // Load the "images"
      Alfresco.util.Ajax.request(
      {
         method: Alfresco.util.Ajax.GET,
         url: Alfresco.constants.PROXY_URI + "slingshot/doclib/images/site/" + options.siteId + "/documentLibrary?filterData=@@IMAGE_LIBRARY_TAG@@",
         successCallback:
         {
            fn: function(e)
            {
               var result = YAHOO.lang.JSON.parse(e.serverResponse.responseText);
               if (result)
               {
                  var div = Dom.get('image_results'), items = result.items, item, nodeRef, img;
                  for (var i = 0, j = items.length; i < j; i++)
                  {
                     item = items[i];
                     nodeRef = item.nodeRef.replace(":/", "");
                     img = document.createElement("img");
                     img.setAttribute("src", Alfresco.constants.PROXY_URI + "api/node/" + nodeRef + "/content/thumbnails/doclib?c=queue&ph=true");
                     img.setAttribute("longdesc", Alfresco.constants.PROXY_URI_RELATIVE + "api/node/content/" + nodeRef + "/" + $html(item.title));
                     img.setAttribute("title", $html(item.title));
                     div.appendChild(img);
                  }
               } 
            },
            scope: this
         },
         failureCallback:
         {
            fn: function(e)
            {
               return;
            }
         }
      });
   });

   return editor;
};
