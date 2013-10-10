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

<div id="${el}-dialog" class="html-upload hidden">
   <div class="hd">
      <span id="${el}-title-span"></span>
   </div>
   <div class="bd">
      <form id="${el}-htmlupload-form"
            method="post" enctype="multipart/form-data" accept-charset="utf-8"
            action="${url.context}/proxy/alfresco/api/upload.html">
         <fieldset>
         <input type="hidden" id="${el}-siteId-hidden" name="siteId" value=""/>
         <input type="hidden" id="${el}-containerId-hidden" name="containerId" value=""/>
         <input type="hidden" id="${el}-destination-hidden" name="destination" value=""/>
         <input type="hidden" id="${el}-username-hidden" name="username" value=""/>
         <input type="hidden" id="${el}-updateNodeRef-hidden" name="updateNodeRef" value=""/>
         <input type="hidden" id="${el}-uploadDirectory-hidden" name="uploadDirectory" value=""/>
         <input type="hidden" id="${el}-overwrite-hidden" name="overwrite" value=""/>
         <input type="hidden" id="${el}-thumbnails-hidden" name="thumbnails" value=""/>
         <input type="hidden" id="${el}-successCallback-hidden" name="successCallback" value=""/>
         <input type="hidden" id="${el}-successScope-hidden" name="successScope" value=""/>
         <input type="hidden" id="${el}-failureCallback-hidden" name="failureCallback" value=""/>
         <input type="hidden" id="${el}-failureScope-hidden" name="failureScope" value=""/>

         <p id="${el}-singleUploadTip-span">${msg("label.singleUploadTip")}</p>
         <p id="${el}-singleUpdateTip-span">${msg("label.singleUpdateTip")}</p>
<div class="eslInline">
           <#import "/org/alfresco/components/enhanced-security/enhanced-security.lib.ftl" as esl/>
           <@esl.renderESL htmlid=args.htmlid ogColumns=6 yuiGridType="g"/>
         </div>
         
		<#if perishableReasons?size != 0>
		<div id="${el}-perishability">
          <p id="perishability-label">Perishability</p>
         
          <#include "/org/alfresco/components/perishability/perishable-reasons.lib.ftl" />
          <@perishableReasonsMacro true />
       	</div>
        </#if>
         
         <div>
            <div class="yui-g">
               <h2>${msg("section.file")}</h2>
            </div>
            <div class="yui-gd <#if (contentTypes?size == 1)>hidden</#if>">
               <div class="yui-u first">
                  <label for="${el}-contentType-select">${msg("label.contentType")}</label>
               </div>
               <div class="yui-u">
                  <select id="${el}-contentType-select" name="contentType" tabindex="0">
                     <#if (contentTypes?size > 0)>
                        <#list contentTypes as contentType>
                           <option value="${contentType.id}">${msg(contentType.value)}</option>
                        </#list>
                     </#if>
                  </select>
               </div>
            </div>
            <div class="yui-gd">
               <div class="yui-u first">
                  <label for="${el}-filedata-file">${msg("label.file")}</label>
               </div>
               <div class="yui-u">
                  <input type="file" id="${el}-filedata-file" name="filedata" tabindex="0" />
               </div>
            </div>
            <div class="yui-gd">
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
                  <input id="${el}-minorVersion-radioButton" type="radio" name="majorVersion" checked="checked" value="false" tabindex="0" />
                  <label for="${el}-minorVersion-radioButton" id="${el}-minorVersion">${msg("label.minorVersion")}</label>
               </div>
            </div>
            <div class="yui-gd">
               <div class="yui-u first">&nbsp;
               </div>
               <div class="yui-u">
                  <input id="${el}-majorVersion-radioButton" type="radio" name="majorVersion" value="true" tabindex="0" />
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

         <div class="bdft">
            <span class="eslSubmitContainer">
              <input id="${el}-upload-button" type="button" value="${msg("button.upload")}" tabindex="0" />
            </span>
            <span class="eslSubmitForbiddenContainer yui-button yui-submit-button yui-button-disabled yui-submit-button-disabled" style="display:none;">
              <button type="button" id="${args.htmlid}-esl-dummy-save-button" disabled="disabled">${msg("button.upload")}</button>
            </span>
            <input id="${el}-cancel-button" type="button" value="${msg("button.cancel")}" tabindex="0" />
         </div>

         </fieldset>
      </form>

   </div>
</div>
<script type="text/javascript">//<![CDATA[
new Alfresco.HtmlUpload("${el}").setMessages(
   ${messages}
);
Alfresco.util.relToTarget("${el}-singleUploadTip-span");
//]]></script>
