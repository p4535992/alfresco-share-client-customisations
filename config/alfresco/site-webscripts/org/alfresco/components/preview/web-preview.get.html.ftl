<#include "../delete/markedForDelete.ftl"/>

<#assign el=args.htmlid?html>
<#if (node?exists)>
<script type="text/javascript">//<![CDATA[
new Alfresco.WebPreview("${el}").setOptions(
{
   nodeRef: "${node.nodeRef}",
   name: "${node.name?js_string}",
   icon: "${node.icon}",
   mimeType: "${node.mimeType}",
   previews: [<#list node.previews as p>"${p}"<#if (p_has_next)>, </#if></#list>],
   size: "${node.size}",
   disableI18nInputFix: ${(args.disableI18nInputFix!config.scoped['DocumentDetails']['document-details'].getChildValue('disable-i18n-input-fix')!"false")?js_string},
   displayImageInWebPreview: ${(args.displayImageInWebPreview!config.scoped['DocumentDetails']['document-details'].getChildValue('display-image-in-web-preview')!"false")?js_string},
   maxImageSizeToDisplay: ${(args.maxImageSizeToDisplay!config.scoped['DocumentDetails']['document-details'].getChildValue('max-image-size-to-display')!500000)?number?c}
}).setMessages(${messages});
//]]></script>
</#if>
<div class='eslPMDocLib${eslPM?replace(" ","")}'>
   <span class='eslRenderNod'><#if eslNod?exists>${eslNod}</#if></span> <span class='eslRenderPM'><#if eslPM?exists>${eslPM}</#if></span> <span class='eslRenderAtomal'> <#if eslAtomal?exists>${eslAtomal}</#if></span> <span class='eslRenderFreeForm'><#if eslFreeFormCaveats?exists>${eslFreeFormCaveats}</#if></span> <span class='eslRenderEyes'><#if eslEyes?exists>${eslEyes}</#if></span>
   <br/>
   <span class='eslRenderClosed'><#if eslClosed?exists>${eslClosed}</#if></span> <span class='eslRenderOrganisations'><#if eslOrganisation?exists>${eslOrganisation}</#if></span> <span class='eslRenderOpen'><#if eslOpen?exists>${eslOpen}</#if></span>
</div>

<div id="docDetailsStickyBar" class="share-toolbar"></div>

<div class="deleteMarkWrapper docDetailsDeleteMarkWrapper">

<#if archiveDetails??>
	<@displayDeleteDate archiveDetails.archivalDue/>
</#if>

<#if archiveDue??>
 <@displayDeleteMark deletedBy node.nodeRef?replace("workspace://SpacesStore/","") />
</#if>

<#if perishDue??>
 <@displayPerishMark perishRequestedBy perishTitle node.nodeRef?replace("workspace://SpacesStore/","") />
</#if>

</div>

<div class="web-preview shadow">
   <div class="hd">
      <div class="title">
         <h4>
            <img id="${el}-title-img" src="${url.context}/res/components/images/generic-file-32.png" alt="File" />
            <span id="${el}-title-span"></span>
         </h4>
      </div>
   </div>
   <div class="bd">
      <div id="${el}-shadow-swf-div" class="preview-swf">
         <div id="${el}-swfPlayerMessage-div"><#if (node?exists)>${msg("label.preparingPreviewer")}</#if></div>
      </div>
   </div>
</div>