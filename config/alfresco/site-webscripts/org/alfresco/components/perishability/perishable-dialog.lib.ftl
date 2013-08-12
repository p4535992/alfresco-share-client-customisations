<div id="choosePerishableReasonDialog" style="visibility: hidden">
    <div class="hd">${msg("perish.markdialog.title")}</div>
    <div class="bd">
        <form name="dlgForm">
            <p>${msg("perish.markdialog.select")}</p>
         	<#include "/org/alfresco/components/perishability/perishable-reasons.lib.ftl" />
            <@perishableReasonsInlineMacro false />
        </form>
    </div>
</div>