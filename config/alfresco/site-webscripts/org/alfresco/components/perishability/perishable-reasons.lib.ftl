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