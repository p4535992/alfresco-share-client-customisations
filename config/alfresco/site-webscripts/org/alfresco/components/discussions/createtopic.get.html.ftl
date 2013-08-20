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
<#assign editMode = ((page.url.args.topicId!"") != "") />
<script type="text/javascript">//<![CDATA[
   new Alfresco.CreateTopic("${args.htmlid}").setOptions(
   {
      topicId: "${(page.url.args.topicId!'')?js_string}",
      siteId: "${page.url.templateArgs.site!''}",
      containerId: "${(page.url.args.containerId!'discussions')?js_string}",
      editorConfig:
      {
         width: "700",
         height: "180",
         inline_styles: false,
         convert_fonts_to_spans: false,
         theme: "advanced",
         theme_advanced_blockformats: "p,pre,h1,h2,h3,h4,h5,h6",
         theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,forecolor",
         theme_advanced_buttons2 :"bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,removeformat",
         theme_advanced_toolbar_location : "top",
         theme_advanced_toolbar_align : "left",
         theme_advanced_statusbar_location : "bottom",
         theme_advanced_path : false,
         theme_advanced_resizing : true,
         theme_advanced_buttons3 : null,
         language: "${locale?substring(0, 2)?js_string}"
      },
      editMode: ${editMode?string}
   }).setMessages(
      ${messages}
   );
//]]></script>


         <#if editMode>  
            <div id="securityMarking">
                <span class='eslRenderNod'></span> <span class='eslRenderPM'></span> <span class='eslRenderAtomal'></span> <span class='eslRenderFreeForm'></span> <span class='eslRenderEyes'> </span>
                <br/>
                <span class='eslRenderClosed'> </span> <span class='eslRenderOrganisations'> </span> <span class='eslRenderOpen'> </span>
            </div> 
            <div id="markedForDeleteContainer"> </div>
          </#if>
          
<div class="page-form-header">
   <h1><#if editMode>${msg("header.edit")}<#else>${msg("header.create")}</#if></h1>
   <hr/>
</div>
<div class="page-form-body hidden" id ="${args.htmlid}-topic-create-div">
   <form id="${args.htmlid}-form" method="post" action="">

      <div class='eslInline'>
        <#import "/org/alfresco/components/enhanced-security/enhanced-security.lib.ftl" as esl/>
        <@esl.renderESL htmlid=args.htmlid ogColumns=10 yuiGridType="gf"/>
      </div>

      <fieldset>
         <input type="hidden" id="${args.htmlid}-topicId" name="topic" value="" />
         <input type="hidden" id="${args.htmlid}-site" name="site" value="" />
         <input type="hidden" id="${args.htmlid}-container" name="container" value="" />
         <input type="hidden" id="${args.htmlid}-page" name="page" value="discussions-topicview" />

         <div class="yui-gd">
            <div class="yui-u first">
               <label for="${args.htmlid}-title">${msg("label.title")}:</label>
            </div>
            <div class="yui-u">
               <input class="wide" type="text" id="${args.htmlid}-title" name="title" size="80" value=""/>
            </div>
         </div>
         
         <#-- Only allow setting perishability if we are creating a new discussion
              and there are some perishable reasons -->
         <#if !editMode && (perishableReasons?size > 0)> 
         <div class="yui-gd">
         	<div class="yui-u first">
         		<label for="${args.htmlid}-perishability">${msg("perishabilityText")}:</label>
         	</div>
         	<div class="yui-u">
         		<div id="${args.htmlid}-perishability">
         			<#include "/org/alfresco/components/perishability/perishable-reasons.lib.ftl" />
          			<@perishableReasonsMacro true />
         		</div>
         	</div>
         </div>
         </#if>

         <div class="yui-gd">
            <div class="yui-u first">
               <label for="${args.htmlid}-content">${msg("topicText")}:</label>
            </div>
            <div class="yui-u">
               <textarea rows="8" cols="80" id="${args.htmlid}-content" name="content" class="yuieditor"></textarea>
            </div>
         </div>

         <div class="yui-gd">
            <div class="yui-u first">
               <label for="${htmlid}-tag-input-field">${msg("label.tags")}:</label>
            </div>
            <div class="yui-u">
               <#import "/org/alfresco/modules/taglibrary/taglibrary.lib.ftl" as taglibraryLib/>
               <@taglibraryLib.renderTagLibraryHTML htmlid=args.htmlid />
            </div>
         </div>

         <div class="yui-gd">
            <div class="yui-u first">&nbsp;</div>
            <div class="yui-u">
               <span class="eslSubmitContainer">
               <input type="submit" id="${args.htmlid}-submit" value="${msg('action.save')}" />
               </span>
               <span class="eslSubmitForbiddenContainer yui-button yui-submit-button yui-button-disabled yui-submit-button-disabled" style="display:none;">
                 <button type="button" id="${args.htmlid}-esl-dummy-save-button" disabled="disabled">${msg("action.save")}</button>
               </span>
               <input type="reset" id="${args.htmlid}-cancel" value="${msg('action.cancel')}" />
            </div>
         </div>
      </fieldset>
   </form>
</div>
