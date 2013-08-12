<#macro displayDeleteMark deletedBy uid>
	<div id="DeletionMark-${uid}" class="markedForDeletion">
		Marked for deletion
		<span class="markMeta">by <a href="/share/page/user/${deletedBy}/profile">${deletedBy}</a></span>
	</div>
</#macro>

<#macro displayFolderDeleteMark deletedBy uid>
	<div id="DeletionMark-${uid}" class="markedForDeletion">
  		Marked for deletion
  		<span class="markMeta">by <a href="/share/page/user/${deletedBy}/profile">${deletedBy}</a></span>
	</div>
</#macro>

<#macro displayPerishMark perishRequestedBy perishTitle uid>
	<div id="PerishableMark-${uid}" class="markedAsPerishable">
		${msg("label.markedAsPerishable", perishTitle, perishRequestedBy)}
		<span class="markMeta">by <a href="/share/page/user/${perishRequestedBy}/profile">${perishRequestedBy}</a></span>
	</div>
</#macro>

<#macro displayDeleteDate deleteDate>
	<div id="deleteDateDiv" class="deleteDate">Due for deletion on <span class="date">${deleteDate}</span></div>
</#macro>