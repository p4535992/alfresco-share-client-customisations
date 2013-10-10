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
<#macro perishableReasonsMacro showDefault>
	<div id="perishable-select">
		<p>${msg("label.perishableWarning")}</p>
		<#if showDefault>
          <input id="not_perishable" type="radio" name="perishable" value="" />
          <label for="not_perishable" title="${msg("label.notPerishable")}">${msg("label.notPerishable")}</label>
		</#if>
		
	    <#list perishableReasons as i>
	      	<input id="${i.code}" type="radio" name="perishable" value="${i.code}"/><label for="${i.code}" title="${i.description}">${i.title}</label>
	    </#list>
	</div>
</#macro>

<#macro perishableReasonsInlineMacro showDefault>
	<script type="text/javascript">
		Alfresco.thirdparty.perishability = {};
		Alfresco.thirdparty.perishability.validateDialog = function() {
			var valid = false,
				perishReasons = YAHOO.util.Selector.query("input[name='perishable']", "perishable-select-inline");
				perishErrorLabel = YAHOO.util.Dom.get("perishable-validation-inline");	
		    for (var i=0, len=perishReasons.length; i<len; ++i) {
		    	if ((perishReasons[i].getAttribute("type") == "hidden") || perishReasons[i].checked) {
		    		valid = true;
		    		break;
		    	}
		    }
			if(valid) {
				YAHOO.util.Dom.removeClass(perishErrorLabel, "invalid");
			}
		};
	</script>
	<div id="perishable-select-inline">
		<p>${msg("label.perishableWarning")}</p>
		<p class='perishable-validation' id="perishable-validation-inline">${msg("label.perishableValidation")}</p>
		<#if !showDefault && perishableReasons?size == 1>
			<input type="hidden" name="perishable" value="${perishableReasons?first.code}" />
		<#else>
			<#if showDefault>
	          <input id="not_perishable" type="radio" name="perishable" value="" onClick='Alfresco.thirdparty.perishability.validateDialog()'/>
	          <label for="not_perishable" title="${msg("label.notPerishable")}">${msg("label.notPerishable")}</label>
			</#if>
		    <#list perishableReasons as i>
		      	<input id="${i.code}" onClick='Alfresco.thirdparty.perishability.validateDialog()' type="radio" name="perishable" value="${i.code}"/><label for="${i.code}" title="${i.description}">${i.title}</label>
		    </#list>
	    </#if>
	</div>

</#macro>
