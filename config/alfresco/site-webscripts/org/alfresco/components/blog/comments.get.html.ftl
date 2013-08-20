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
<script type="text/javascript">//<![CDATA[
   new Alfresco.CommentList("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      containerId: "${template.properties.container!"blog"}",
      height: ${args.editorHeight!180},
      width: ${args.editorWidth!700},
      editorConfig:
      {
         height: ${args.editorHeight!180},
         width: ${args.editorWidth!700},
         inline_styles: false,
         convert_fonts_to_spans: false,
         theme: "advanced",
         theme_advanced_buttons1: "bold,italic,underline,|,bullist,numlist,|,forecolor,backcolor,|,undo,redo,removeformat",
         theme_advanced_toolbar_location: "top",
         theme_advanced_toolbar_align: "left",
         theme_advanced_statusbar_location: "bottom",
         theme_advanced_resizing: true,
         theme_advanced_buttons2: null,
         theme_advanced_buttons3: null,
         theme_advanced_path: false,
         language: "${locale?substring(0, 2)?js_string}"
      }
   }).setMessages(
      ${messages}
   );
//]]></script>
<div id="${args.htmlid}-body" class="comment-list" style="display:none;">
   <div class="postlist-infobar">
      <div id="${args.htmlid}-title" class="commentsListTitle"></div>
      <div id="${args.htmlid}-paginator" class="paginator"></div>
   </div>
   <div class="clear"></div>
   <div id="${args.htmlid}-comments"></div>
</div>
