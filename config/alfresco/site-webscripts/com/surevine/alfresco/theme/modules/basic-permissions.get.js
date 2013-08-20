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
var json = remote.call("/api/sites/" + args.site + "/roles");
var roles = eval('(' + json + ')');

var groupNames = [];
var permGroups = [];
var permissionGroups = roles.permissionGroups;
for (group in permissionGroups)
{
   // strip group name down to group identifier
   var permissionGroup = permissionGroups[group];
   var groupName = permissionGroup.substring(permissionGroup.lastIndexOf("_") + 1);
   
   // ignore the SiteManager group as we do not allow it to be modified
   if (groupName != "SiteManager")
   {
      groupNames.push(groupName);
      permGroups.push(permissionGroup);
   }
}

var roleNames = [];
var siteRoles = roles.siteRoles;
for (role in siteRoles)
{
   var roleName = siteRoles[role];
   
   // ignore the SiteManager role as we do not allow it to be applied
   if (roleName != "SiteManager")
   {
      roleNames.push(roleName);
   }
}

model.siteRoles = roleNames;
model.permissionGroups = permGroups;
model.groupNames = groupNames;

cache.neverCache=false;
cache.isPublic=false;
cache.maxAge=36000; //10 hours
cache.mustRevalidate=false;
cache.ETag = 100;