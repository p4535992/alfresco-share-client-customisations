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
const PREF_COLLAPSED_TWISTERS = "org.alfresco.share.twisters.collapsed";

/**
 * Twister Preferences
 */
function getTwisterPrefs()
{
   var collapsedTwisters = "",
      result,
      response;

   result = remote.call("/api/people/" + encodeURIComponent(user.name) + "/preferences?pf=" + PREF_COLLAPSED_TWISTERS);
   if (result.status == 200 && result != "{}")
   {
      response = eval('(' + result + ')');
      collapsedTwisters = eval('try{(response.' + PREF_COLLAPSED_TWISTERS + ')}catch(e){}');
      if (typeof collapsedTwisters != "string")
      {
         collapsedTwisters = "";
      }
   }
   model.collapsedTwisters = collapsedTwisters;
}

/**
 * Site Title
 */
function getSiteTitle()
{
   var siteTitle = "",
      result,
      response;

   var siteId = page.url.templateArgs.site || "";
   if (siteId !== "")
   {
      result = remote.call("/api/sites/" + encodeURIComponent(siteId));
      if (result.status == 200 && result != "{}")
      {
         response = eval('(' + result + ')');
         siteTitle = response.title;
         if (typeof siteTitle != "string")
         {
            siteTitle = "";
         }
      }
   }
   model.siteTitle = siteTitle;
   // Save the site title for downstream components - saves remote calls for Site Profile
   context.setValue("site-title", siteTitle);
}

/**
 * Theme Override
 */
function getThemeOverride()
{
   if (page.url.args["theme"] != null)
   {
      model.theme = page.url.args["theme"];
   }
}

/**
 * Customizable Header
 */
function getHeader()
{
   // Array of tokenised values for use in i18n messages
   model.labelTokens = [ user.name || "", user.firstName || "", user.lastName || "", user.fullName || ""];
   model.permissions =
   {
      guest: user.isGuest,
      admin: user.isAdmin
   };
}

/**
 * User Status
 */
function getUserStatus()
{
   var userStatus = msg.get("status.default"),
      userStatusTime = "";
   
   if (user.properties["userStatus"] != null)
   {
      userStatus = user.properties["userStatus"];
   }
   if (user.properties["userStatusTime"] != null)
   {
      userStatusTime = user.properties["userStatusTime"];
   }
   
   model.userStatus = userStatus;
   model.userStatusTime = userStatusTime;
}

/**
 * Sites
 */
function getSites()
{
	var sites = [], result;
	
    // Call the repo for sites the user is a member of
    result = remote.call("/api/people/" + stringUtils.urlEncode(user.name) + "/sites");
    if (result.status == 200)
    {
       // Create javascript objects from the server response
       sites = eval('(' + result + ')');
    }
	
    model.sites = sites;
}

/**
 * Theme Config
 */
function getThemeConfig()
{
	var themeConfig = {}, result;
	
	// Get the configuration
	result = remote.call("/sv-theme/config/general");
   
	if(result.status == 200){
		themeConfig = eval('(' + result + ')');
	}
	
	model.themeConfig = themeConfig;
}

function sortByTitle(site1, site2)
{
   return (site1.title > site2.title) ? 1 : (site1.title < site2.title) ? -1 : 0;
}

function main()
{
   getTwisterPrefs();
   getSiteTitle();
   getThemeOverride();
   getHeader();
   getUserStatus();
   getSites();
   getThemeConfig();
}

if (!user.isGuest)
{
   main();
}
