<import resource="classpath:alfresco/site-webscripts/org/alfresco/callutils.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/components/enhanced-security/enhanced-security.get.js">
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

function sortByLabel(version1, version2)
{
   var major1 = new Number(version1.version.substring(0, version1.version.indexOf(".")));
   var major2 = new Number(version2.version.substring(0, version2.version.indexOf(".")));
   if(major1 - 0 == major2 - 0)
   {
        var minor1 = new Number(version1.version.substring(version1.version.indexOf(".")+1));
        var minor2 = new Number(version2.version.substring(version2.version.indexOf(".")+1));
        return (minor1 < minor2) ? 1 : (minor1 > minor2) ? -1 : 0;
   }
   else
   {
       return (major1 < major2) ? 1 : -1;
   }
}

function main()
{
   var title = page.url.args.title;
   if (title)
   {
      var context = page.url.context + "/page/site/" + page.url.templateArgs.site + "/wiki-page?title=" + page.url.args.title,
         uri = "/slingshot/wiki/page/" + encodeURIComponent(page.url.templateArgs.site) + "/" + encodeURIComponent(page.url.args.title) + "?context=" + escape(context),
         connector = remote.connect("alfresco"),
         result = connector.get(uri);

      // we allow 200 and 404 as valid responses - any other error then cannot show page
      // the 404 response means we can create a new page for the title
      if (result.status.code == status.STATUS_OK || result.status.code == status.STATUS_NOT_FOUND)
      {
         var response = eval('(' + result.response + ')'),
            myConfig = new XML(config.script);

         if (response.pagetext)
         {
            response.pagetext = myConfig.allowUnfilteredHTML == true ? response.pagetext : stringUtils.stripUnsafeHTML(response.pagetext);
         }

         if (response.versionhistory != undefined)
         {
            response.versionhistory.sort(sortByLabel);
         }

         model.result = response;

         var deletionState="unknown";
         if (response.deletionState)
         {
        	 deletionState=response.deletionState;
         }
         model.deletionState = deletionState;

         var deletionAuthorisation="normal";
         if (response.deletionAuthorisation)
         {
            deletionAuthorisation=response.deletionAuthorisation;
         }
         model.deletionAuthorisation=deletionAuthorisation;
         
         var eslNod=response.eslNod;
	     var eslPM=response.eslPM;
	     var eslFreeFormCaveats=response.eslFreeFormCaveats;
	     var eslClosed = response.eslClosed;
	     var eslOpen = response.eslOpen;
	     var eslEyes=response.eslEyes;
         var eslAtomal=response.eslAtomal;
         var eslOrganisation=response.eslOrganisations;

         if (eslNod!=null) {
           model.eslNod=eslNod;
         }
         else {
           model.eslNod="";
         }
         if (eslPM!=null) {
           model.eslPM=eslPM;
         }
         else {
           model.eslPM="";
         }
         if (eslFreeFormCaveats!=null) {
           model.eslFreeFormCaveats=eslFreeFormCaveats;
         }
         else {
           model.eslFreeFormCaveats="";
         }
         if (eslClosed!=null) {
           model.eslClosed=eslClosed;         
         }
         else {
           model.eslClosed="";
         }
         if (eslOpen!=null) {
           model.eslOpen=eslOpen;
         }
         else {
           model.eslOpen="";
         }
         if (eslOrganisation!=null) {
             model.eslOrganisation=eslOrganisation;
           }
           else {
             model.eslOrganisation="";
           }
         if (eslEyes!=null) {
           model.eslEyes=eslEyes;
         }
         else {
           model.eslEyes="";
         }
         if (eslAtomal!=null)
         {
           model.eslAtomal=eslAtomal;
         }
         
         model.isDeletable = "" + response.isDeletable;	//force to string.
      }
      else
      {
         model.result = {"pagetext" : null};
         model.result.eslNod="";
         model.result.eslPM="";
         model.result.eslFreeFormCaveats="";
         model.result.eslClosed="";
         model.result.eslOpen="";
         model.result.eslEyes="";
         model.result.eslAtomal="";
         model.result.eslOrganisation="";
         
         logger.log("Could not find wiki page with title: \"" +title +"\"");
         status.redirect = true;
      }
   }
   else
   {
      status.redirect = true;
      status.code = 301;
      status.location = page.url.service + "?title=Main_Page";
   }
}
 
main();
