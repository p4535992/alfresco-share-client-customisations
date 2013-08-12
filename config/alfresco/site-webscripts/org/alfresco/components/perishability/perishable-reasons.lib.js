function getPerishableReasons()
{
   var result = eval('(' +remote.call("/sv-theme/delete/perishable-reasons?site=" +page.url.templateArgs.site) +')');

   return result.perishableReasons;
}

model.perishableReasons = getPerishableReasons();
