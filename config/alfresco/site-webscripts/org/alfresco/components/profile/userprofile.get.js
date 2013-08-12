
var profileId = page.url.templateArgs["userid"];

if (profileId==user.name)
{
	
	model.mode="mine";
}
else
{
	model.mode="yours";
	model.who=profileId;
}

model.profile = user.getUser(profileId);