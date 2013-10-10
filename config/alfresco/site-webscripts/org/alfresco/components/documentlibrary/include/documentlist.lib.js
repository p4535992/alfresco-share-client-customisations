<import resource="classpath:alfresco/site-webscripts/org/alfresco/components/perishability/perishable-reasons.lib.js">

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

const PREFERENCES_ROOT = "org.alfresco.share.documentList";

/* Sort the actions by preference order */
function sortByOrder(a, b)
{
   return (a.order - b.order);
}

/* Get user preferences */
function getPreferences()
{
   var preferences = {};

   try
   {
      // Request the current user's preferences
      var result = remote.call("/api/people/" + encodeURIComponent(user.name) + "/preferences?pf=" + PREFERENCES_ROOT);
      if (result.status == 200 && result != "{}")
      {
         var prefs = eval('(' + result + ')');
         // Populate the preferences object literal for easy look-up later
         preferences = eval('(prefs.' + PREFERENCES_ROOT + ')');
         if (typeof preferences != "object")
         {
            preferences = {};
         }
      }
   }
   catch (e)
   {
   }

   return preferences;
}

/* Get actions */
function getActionSets(preferences)
{
   var actionSets = {};
   
   if (typeof preferences == "undefined")
   {
      preferences = getPreferences();
   }
   
   try
   {
      // Actions
      var prefActionSet, order, actionSet, actionSetId, actionId, defaultOrder,
         myConfig = new XML(config.script),
         prefActions = preferences.actions || {};

      for each (var xmlActionSet in myConfig..actionSet)
      {
         actionSet = [];
         actionSetId = xmlActionSet.@id.toString();
         prefActionSet = prefActions[actionSetId] || {};
         defaultOrder = 100;

         for each (var xmlAction in xmlActionSet..action)
         {
            defaultOrder++;
            actionId = xmlAction.@id.toString();

            if (actionId.indexOf('Perishable') === -1 || model.perishableReasons.length > 0) {
                actionSet.push(
                {
                   order: prefActionSet[actionId] || defaultOrder,
                   id: actionId,
                   type: xmlAction.@type.toString(),
                   permission: xmlAction.@permission.toString(),
                   href: xmlAction.@href.toString(),
                   label: xmlAction.@label.toString()
                });
            }
         }
         actionSets[actionSetId] = actionSet.sort(sortByOrder);
      }
   }
   catch (e)
   {
   }
   
   return actionSets;
}

/* Repository URL */
function getRepositoryUrl()
{
   // Repository Url
   var repositoryUrl = null,
      repositoryConfig = config.scoped["DocumentLibrary"]["repository-url"];

   if (repositoryConfig !== null)
   {
      repositoryUrl = repositoryConfig.value;
   }

   return repositoryUrl;
}

/* Replication URL Mapping */
function getReplicationUrlMappingJSON()
{
   var mapping = {};

   try
   {
      var urlConfig, repositoryId,
         configs = config.scoped["Replication"]["share-urls"].getChildren("share-url");

      if (configs)
      {
         for (var i = 0; i < configs.size(); i++)
         {
            // Get repositoryId and Share URL from each config entry
            urlConfig = configs.get(i);
            repositoryId = urlConfig.attributes["repositoryId"];
            if (repositoryId)
            {
               mapping[repositoryId] = urlConfig.value.toString();
            }
         }
      }
   }
   catch (e)
   {
   }

   return jsonUtils.toJSONString(mapping);
}

/* Vti (SharePoint Protocol) server */
function getVtiServerJSON()
{
   var vtiServerJSON = "{}";

   result = remote.call("/api/vti/serverDetails");
   if (result.status == 200 && result != "")
   {
      vtiServerJSON = result;
   }

   return vtiServerJSON;
}

/* Repository Browser root */
function getRepositoryBrowserRoot()
{
   // Repository Library root node
   var rootNode = "alfresco://company/home",
      repoConfig = config.scoped["RepositoryLibrary"]["root-node"];

   if (repoConfig !== null)
   {
      rootNode = repoConfig.value;
   }

   return rootNode;
}

/* Sort Options */
function getSortOptions()
{
   // New Content
   var sortOptions = [],
      sortingConfig = config.scoped["DocumentLibrary"]["sorting"];

   sortOptions.push({
	   value: "@cm:name",
	   label: "Name"
   });

   sortOptions.push({
	   value: "@cm:created",
	   label: "Created"
   });

   sortOptions.push({
	   value: "@cm:creator",
	   label: "Creator"
   });

   sortOptions.push({
	   value: "@cm:modified",
	   label: "Modified"
   });

   sortOptions.push({
	   value: "@cm:modifier",
	   label: "Modifier"
   });

   return sortOptions;
}

/**
 * Main entrypoint for common doclib functionality
 *
 * @method doclibCommon
 */
function doclibCommon()
{
   var preferences = getPreferences();
   model.preferences = preferences;
   model.actionSets = getActionSets(preferences);
   model.repositoryUrl = getRepositoryUrl();
   model.replicationUrlMappingJSON = getReplicationUrlMappingJSON();
   model.vtiServer = getVtiServerJSON();
   model.rootNode = getRepositoryBrowserRoot();
   model.sortOptions = getSortOptions();
}
