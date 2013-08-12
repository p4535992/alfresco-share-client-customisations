<#assign el=args.htmlid>
<div id="${el}-profile-body-container">
    <h3>Loading profile data...</h3>
</div>

<script type="text/javascript">//<![CDATA[
  <#if mode=="mine">
    requestMyProfile();
  <#else>
    requestUserProfile('${who}');
  </#if>
//]]></script>