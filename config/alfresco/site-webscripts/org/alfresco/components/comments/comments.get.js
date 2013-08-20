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
function main()
{
   // retrieve comments
   var params = [];
   for (var name in args)
   {
      params.push(name + "=" + args[name]);
   }
   var uri = "/api/node/" + url.templateArgs.store_type + "/" + url.templateArgs.store_id +"/" + url.templateArgs.id + "/comments?" + params.join("&");
   var connector = remote.connect("alfresco");
   var result = connector.get(uri);
   if (result.status.code == status.STATUS_OK)
   {
      // Strip out possible malicious code
      var comments = eval("(" + result.response + ")");
      if (comments && comments.items) {
         for (var i = 0, il = comments.items.length; i < il; i++)
         {
            comments.items[i].content = stringUtils.stripUnsafeHTML(comments.items[i].content).replaceAll("<p>&amp;nbsp;</p>", "<p> </p>");
         }
      }
      return jsonUtils.toJSONString(comments);
   }
   else
   {
      status.code = result.status.code;
      status.message = msg.get("message.failure");
      status.redirect = true;
   }
}

model.comments = main();
