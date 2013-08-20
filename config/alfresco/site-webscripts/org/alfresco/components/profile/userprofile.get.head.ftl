<!--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
<#include "../component.head.inc">
<!-- User Profile -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/profile/profile.css" />
<@script type="text/javascript" src="${page.url.context}/res/components/profile/profile.js"></@script>
<!-- Simple Dialog -->
<@script type="text/javascript" src="${page.url.context}/res/modules/simple-dialog.js"></@script>

<script type="text/javascript">//<![CDATA[


/**
 * Try and get the given user's profile form as HTML.  This will return a read-only or read/write form
 * as appropriate.  Calls onProfileLoadSuccess to handle the succesful retrieval of the data, and 
 * onProfileLoadFailure for the opposite
 */                                          
function requestUserProfile(userName)
{
	 var stylesheet=Alfresco.constants.URL_CONTEXT+"css/profile/default.css";
    Alfresco.util.Ajax.request(
            {
              url: Alfresco.constants.PROXY_URI + "sv-theme/user-profile/profile?userName="+userName+"&style="+stylesheet,
              method: "GET",
              responseContentType : "text/html",
              successCallback:
            {
              fn: onProfileLoadSuccess,
              scope: this
            },
            failureCallback:
            {
              fn: onProfileLoadFailure,
              scope: this
            }
          });
}

/**
 * Similar to requestUserProfile, except returns the current user's profile.  Uses the same 
 */
function requestMyProfile()
{
	var stylesheet=Alfresco.constants.URL_CONTEXT+"css/profile/default.css";
    Alfresco.util.Ajax.request(
            {
              url: Alfresco.constants.PROXY_URI + "sv-theme/user-profile/profile?mode=edit&style="+stylesheet,
              method: "GET",
              responseContentType : "text/html",
              successCallback:
            {
              fn: onProfileLoadSuccess,
              scope: this
            },
            failureCallback:
            {
              fn: onProfileLoadFailure,
              scope: this
            }
          });
}

/**
 * Simply fill the body of the screen with the returned HTML
 */
function onProfileLoadSuccess(response)
{
    var content = response.serverResponse.responseText;
    var element = YAHOO.util.Selector.query('div[id$=-profile-body-container]')[0];
    setHtml(element.id, content);
}

/**
 * In the event of a failure, provide some (intentionally very) basic information to the user where we would usually
 * render the profile form.
 */
function onProfileLoadFailure(response)
{
    var content = '<h3>Could not load profile data:</h3><p>'+response.serverResponse.statusText+'</p>';
    var element = YAHOO.util.Selector.query('div[id$=-profile-body-container]')[0];
    element.innerHTML=content; //As this is an error case, skip the complex and dangerous script evaluation in setHtml
}

/**
 * Activate embedded javascript by moving it into the HEAD, and copy the rest of the HTML into a given element,
 * which we assume to be a &lt;div&gt;  We don't do any sanitisation of the javascript we're importing, so we
 * need to trust the content of 'content'.  We use regex matching, so if 'content' has malformed script tags
 * or really unusual content this script could break
 * target javascript
 */
function setHtml(div,content) 
{ 
    var search = content; 
    var script; 
          
    while( script = search.match(/(<script[^>]+javascript[^>]+>\s*(<!--)?)/i)) 
    { 
      search = search.substr(search.indexOf(RegExp.$1) + RegExp.$1.length); 
       
      if (!(endscript = search.match(/((-->)?\s*<\/script>)/))) break; 
       
      block = search.substr(0, search.indexOf(RegExp.$1)); 
      search = search.substring(block.length + RegExp.$1.length); 
       
      var oScript = document.createElement('script'); 
      oScript.text = block; 
      document.getElementsByTagName("head").item(0).appendChild(oScript); 
    } 
    
    document.getElementById(div).innerHTML=content; 
}

/**
 * Set a given user's profile.  Essentially, despite it's name, this method allows for the AJAX posting
 * of a JSON string, in 'payload', to a url located in the share proxy as specified by 'serviceLocation'.
 */
function setUserProfile(payload, serviceLocation)
{
	var payloadObj = YAHOO.lang.JSON.parse(payload);
    Alfresco.util.Ajax.request(
            {
              url: Alfresco.constants.PROXY_URI + serviceLocation,
              method: "POST",
              responseContentType: "application/json",
              requestContentType: "application/json",
              dataObj: payloadObj,
              successCallback:
              {
                fn: onProfileSetSuccess,
                scope: this
              },
              failureCallback:
              {
                fn: onProfileSetFailure,
                scope: this
              }
            });
}

function onProfileSetSuccess()
{
	com_surevine_indicateProfileSaveSuccess();
}

function onProfileSetFailure(error)
{
	com_surevine_indicateProfileSaveFailure(error);
}

/**
 * This function is required by the profile form to allow the profile form to delegate
 * the handling of new profile data to us.  We just immediatley bridge into our own method
 */
function com_surevine_sendProfilePostRequest(json, serviceURL)
{
    setUserProfile(json, serviceURL);
}

//]]></script>
