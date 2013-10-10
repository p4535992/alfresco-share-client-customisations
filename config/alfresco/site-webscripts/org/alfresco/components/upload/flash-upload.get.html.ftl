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
<#include "../form/controls/common/picker.inc.ftl" />

<#assign el=args.htmlid?html>

<script type="text/javascript">//<![CDATA[
(function()
{
   var picker = new Alfresco.ObjectFinder("${el}-tag-picker", "${el}").setOptions(
   {
      field: "Tags",
      compactMode: true,
      currentValue: "",
      selectActionLabel: "Select",
      minSearchTermLength: 1,
      maxSearchResults: 100
   }).setMessages(
      ${messages}
   );
   picker.setOptions(
   {
      itemType: "cm:category",
      multipleSelectMode: true,
      parentNodeRef: "alfresco://category/root",
      itemFamily: "siteTags",
      maintainAddedRemovedItems: false,
      params: "aspect=cm:taggable",
      createNewItemUri: "/api/tag/workspace/SpacesStore",
      createNewItemIcon: "tag",
      displayMode: "items"
   });
})();
//]]></script>


<div id="${el}-dialog" class="flash-upload hidden">
   <div class="hd">
      <span id="${el}-title-span"></span>
   </div>
   <div class="bd">
      <div class="browse-wrapper">
         <div class="eslInline">
            <#import "/org/alfresco/components/enhanced-security/enhanced-security.lib.ftl" as esl/>
            <@esl.renderESL htmlid=el ogColumns=6 yuiGridType="g"/>
         </div>
         
		<#if perishableReasons?size != 0>
		<div id="${el}-perishability">
          <span id="perishability-label">Perishability</span>
         
          <#include "/org/alfresco/components/perishability/perishable-reasons.lib.ftl" />
          <@perishableReasonsMacro true />
        </div>
        </#if>
         
         <div class="yui-gd tag-selection">
            <div class="yui-u first">
               <label for="${el}-tags">Tags:</label>
            </div>
            <div class="yui-u">
               <input type="text" class="tag-text" id="${el}-tag-picker-currentValueField" name="tags"/> <div class="tags-complex" id="${el}-tag-picker-currentValueDisplay"></div>
               <div id="${el}-tag-picker" class="object-finder inlineable">
                    <div id="${el}-tag-picker-itemGroupActions"></div>
                   <@renderPickerHTML el+"-tag-picker" />
               </div>
            </div>
         </div>

         <div class="center">
            <div id="${el}-flashuploader-div" class="browse">${msg("label.noFlash")}</div>
            <div class="label">${msg("label.browse")}</div>
         </div>
      </div>
      <div class="tip-wrapper">
         <span id="${el}-multiUploadTip-span">${msg("label.multiUploadTip")}</span>
         <span id="${el}-singleUpdateTip-span">${msg("label.singleUpdateTip")}</span>
      </div>

      <div id="${el}-filelist-table" class="fileUpload-filelist-table"></div>

      <div class="status-wrapper">
         <span id="${el}-status-span" class="status"></span>
      </div>

      <div id="${el}-versionSection-div"> 
         <div class="yui-g">
            <h2>${msg("section.version")}</h2>
         </div>
         <div class="yui-gd">
            <div class="yui-u first">
               <span>${msg("label.version")}</span>
            </div>
            <div class="yui-u">
               <input id="${el}-minorVersion-radioButton" type="radio" name="majorVersion" checked="checked" tabindex="0"/>
               <label for="${el}-minorVersion-radioButton" id="${el}-minorVersion">${msg("label.minorVersion")}</label>
            </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first">&nbsp;
            </div>
            <div class="yui-u">
               <input id="${el}-majorVersion-radioButton" type="radio" name="majorVersion" tabindex="0"/>
               <label for="${el}-majorVersion-radioButton" id="${el}-majorVersion">${msg("label.majorVersion")}</label>
            </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first">
               <label for="${el}-description-textarea">${msg("label.comments")}</label>
            </div>
            <div class="yui-u">
               <textarea id="${el}-description-textarea" name="description" cols="80" rows="4" tabindex="0"></textarea>
            </div>
         </div>
      </div>

      <!-- Templates for a file row -->
      <div style="display:none">
         <div id="${el}-left-div" class="fileupload-left-div">
            <span class="fileupload-percentage-span hidden">&nbsp;</span>
            <#if (contentTypes?size == 1)>
            <input class="fileupload-contentType-input" type="hidden" value="${contentTypes[0].id}"/>
            <#elseif (contentTypes?size > 1)>
            <select class="fileupload-contentType-select" tabindex="0">
               <#if (contentTypes?size > 0)>
                  <#list contentTypes as contentType>
                     <option value="${contentType.id}">${msg(contentType.value)}</option>
                  </#list>
               </#if>
            </select>
            </#if>
         </div>
         <div id="${el}-center-div" class="fileupload-center-div">
            <span class="fileupload-progressSuccess-span">&nbsp;</span>
            <img src="${url.context}/res/components/images/generic-file-32.png" class="fileupload-docImage-img" alt="file" />
            <span class="fileupload-progressInfo-span"></span>
         </div>
         <div id="${el}-right-div" class="fileupload-right-div">
            <span class="fileupload-fileButton-span">
               <button class="fileupload-file-button" value="Remove" disabled="true" tabindex="0">${msg("button.remove")}</button>
            </span>
         </div>
      </div>
      
         <div class="bdft">
            <span class="eslSubmitContainer">
               <input id="${args.htmlid}-upload-button" type="button" value="${msg("button.upload")}" tabindex="0"/>
            </span>
            <span class="eslSubmitForbiddenContainer yui-button yui-submit-button yui-button-disabled yui-submit-button-disabled" style="display:none;">
               <button type="button" id="${args.htmlid}-esl-dummy-save-button" disabled="disabled">${msg("button.upload")}</button>
            </span>
            <input id="${args.htmlid}-cancelOk-button" type="button" value="${msg("button.cancel")}" tabindex="0"/>
         </div>
   </div>
</div>
<script type="text/javascript">//<![CDATA[
new Alfresco.FlashUpload("${el}").setMessages(
   ${messages}
);
//]]></script>
