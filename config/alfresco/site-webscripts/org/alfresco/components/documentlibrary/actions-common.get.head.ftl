<#--
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
<#-- Document Library Actions: Supports concatenated JavaScript files via build scripts -->
<#if DEBUG>
   <script type="text/javascript" src="${page.url.context}/res/components/documentlibrary/actions.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/modules/simple-dialog.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/global-folder.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/copy-move-to.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/components/people-finder/people-finder.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/permissions.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/aspects.js"></script>
<#else>
   <script type="text/javascript" src="${page.url.context}/res/js/documentlibrary-actions-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/modules/com_surevine_alfresco_SvThemeModule/documentlibrary/basic-permissions-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/modules/com_surevine_alfresco_SvThemeModule/documentlibrary/safe-move-to-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/components/documentlibrary/svtheme-actions-min.js"></script>
</#if>
<#-- Global Folder Picker (req'd by Copy/Move To) -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/modules/documentlibrary/global-folder.css" />
<#-- People Finder Assets (req'd by Assign Workflow)  -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/people-finder/people-finder.css" />
<#-- Manage Permissions -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/modules/documentlibrary/permissions.css" />
<#-- Manage Aspects -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/modules/documentlibrary/aspects.css" />
