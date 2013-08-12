<#if args.full??>
<html>
<head>
<title>ESL Help</title>
</head>
<body>
	<div class="esl-help-container">
		${content}
	</div>
</body>
</html>
<#else>
<div class="esl-help-container">
	${content}
</div>
</#if>