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
<#include "common/picker.inc.ftl" />

<#assign controlId = fieldHtmlId + "-cntrl">

<script type="text/javascript">//<![CDATA[
(function()
{
   <@renderPickerJS field "picker" />
   picker.setOptions(
   {
      itemType: "cm:category",
      multipleSelectMode: true,
      parentNodeRef: "alfresco://category/root",
      itemFamily: "siteTags",
      maintainAddedRemovedItems: false,
      params: "${field.control.params.params!""}",
      createNewItemUri: "${field.control.params.createNewItemUri!}",
      createNewItemIcon: "${field.control.params.createNewItemIcon!}"
   });
})();
//]]></script>

<div class="form-field inlineable">
   <#if form.mode == "view">
      <div id="${controlId}" class="viewmode-field inlineable">
         <#if (field.mandatory!false) && (field.value == "")>
            <span class="incomplete-warning"><img src="${url.context}/res/components/form/images/warning-16.png" title="${msg("form.field.incomplete")}" /><span>
         </#if>
         <#if field.label != ""><span class="viewmode-label">${field.label?html}:</span></#if>
         <span id="${controlId}-currentValueDisplay" class="viewmode-value current-values"></span>
      </div>
   <#else>
      <#if field.label != "">
      <label for="${controlId}">${field.label?html}:<#if field.mandatory!false><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
      </#if>

      <div id="${controlId}" class="object-finder inlineable">

         <div id="${controlId}-currentValueDisplay" class="current-values inlineable"></div>

         <#if field.disabled == false>
            <input type="hidden" id="${fieldHtmlId}" name="${field.name}" value="${field.value?html}" />
            <div id="${controlId}-itemGroupActions" class="show-picker inlineable"></div>

            <@renderPickerHTML controlId />
         </#if>
      </div>
   </#if>
</div>
