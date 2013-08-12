<script type="text/javascript">//<![CDATA[
   new Alfresco.CreateComment("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      containerId: "${template.properties.container!"blog"}",
      height: ${args.editorHeight!250},
      width: ${args.editorWidth!538},
      editorConfig:
      {
         height: ${args.editorHeight!250},
         width: ${args.editorWidth!538},
         inline_styles: false,
         convert_fonts_to_spans: false,
         theme: "advanced",
         theme_advanced_buttons1: "bold,italic,underline,|,bullist,numlist,|,forecolor,|,undo,redo,removeformat",
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
<div id="${args.htmlid}-form-container" class="addCommentForm hidden">
   <div class="commentFormTitle">
      <label for="${htmlid}-content">${msg("addComment")}:</label>
   </div>
   <div class="editComment">
      <form id="${htmlid}-form" method="post" action="">
          <div>
            <input type="hidden" id="${args.htmlid}-nodeRef" name="nodeRef" value="" />
            <input type="hidden" id="${args.htmlid}-site" name="site" value="" />
            <input type="hidden" id="${args.htmlid}-container" name="container" value="" />
            <input type="hidden" id="${args.htmlid}-itemTitle" name="itemTitle" value="" />
            <input type="hidden" id="${args.htmlid}-page" name="page" value="" />
            <input type="hidden" id="${args.htmlid}-pageParams" name="pageParams" value="" />
            
            <!-- Stub values to test the webscripts awaiting the UI -->
            <div>
                   <input type="hidden" id="${args.htmlid}-eslNod" name="eslNod" value=""/>
                   <input type="hidden" id="${args.htmlid}-eslPM" name="eslPM" value=""/>
                   <input type="hidden" id="${args.htmlid}-eslFreeFormCaveats" name="eslFreeFormCaveats" value=""/>
                   <input type="hidden" id="${args.htmlid}-eslClosedMarkings" name="eslClosedMarkings" value=""/>
                   <input type="hidden" id="${args.htmlid}-eslOpenMarkings" name="eslOpenMarkings" value=""/>
                   <input type="hidden" id="${args.htmlid}-eslOrganisations" name="eslOrganisations" value=""/>
            </div>
            <script type="text/javascript">//<![CDATA[
                YAHOO.util.Selector.query("input[id$=eslNod]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderNod")[0].innerHTML);
                YAHOO.util.Selector.query("input[id$=eslPM]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderPM")[0].innerHTML);
                YAHOO.util.Selector.query("input[id$=eslFreeFormCaveats]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderFreeForm")[0].innerHTML);
                YAHOO.util.Selector.query("input[id$=eslClosedMarkings]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderClosed")[0].innerHTML).replace(/ /g,',');
                YAHOO.util.Selector.query("input[id$=eslOpenMarkings]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderOpen")[0].innerHTML).replace(/ /g,',');
                YAHOO.util.Selector.query("input[id$=eslOrganisations]")[0].value = YAHOO.lang.trim(YAHOO.util.Selector.query("span.eslRenderOrganisations")[0].innerHTML).replace(/ /g,',');
                
            //]]></script>

            <textarea id="${htmlid}-content" rows="8" cols="80" name="content"></textarea>
         </div>
         <div class="commentFormAction">
            <input type="submit" id="${htmlid}-submit" value="${msg('postComment')}" />
         </div>
      </form>
   </div>
</div>