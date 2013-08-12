/**
 * A modified version of customise-dashboard which just sets
 * a dashboard to a known state (without requiring the originalRegionId
 * field for each dashlet).
 * 
 * NOTE: There is a known problem if the existing dashboard has the same
 * dashlet multiple times. Only the setting from the first dashlet found
 * will be copied to the new dashlet(s).
 */

// Get clients json request as a "normal" js object literal
var clientRequest = json.toString();
var clientJSON = eval('(' + clientRequest + ')');

// The dashboard we are modifiying
var dashboardPage = clientJSON.dashboardPage;
var newDashlets = clientJSON.dashlets;

// Change the dashbpards template
var templateId = clientJSON.templateId;
sitedata.associateTemplate(templateId, dashboardPage);

// Get existing dashlets/component bindings for the page
var oldComponents = sitedata.findComponents("page", null, dashboardPage, null);
if (oldComponents === undefined || oldComponents.length === 0) {
	oldComponents = [];
}

// Unbind all components, old properties will be stored in the oldComponents
// list.
for ( var oi = 0; oi < oldComponents.length; oi++) {
	var oldComponent = oldComponents[oi];
	var regionId = oldComponent.properties["region-id"];
	if (regionId.match("^component-\\d+-\\d+$")) {
		// Unbind all the existing components
		sitedata.unbindComponent("page", regionId, dashboardPage);
	}
}

// Create bindings for new and moved dashlets.
var newDashlets = clientJSON.dashlets;
for ( var ni = 0; ni < newDashlets.length; ni++) {
	var newDashlet = newDashlets[ni];

	var existingDashlet = null;

	// Find if the dashlet has an original region
	for ( var oi = 0; oi < oldComponents.length; oi++) {
		var oldDashlet = oldComponents[oi];

		if (oldDashlet.properties.url == newDashlet.url) {
			newDashlet.originalRegionId = oldDashlet.properties["region-id"];
			existingDashlet = oldDashlet;
			break;
		}
	}

	if (newDashlet.originalRegionId && existingDashlet != null) {
		// Its an old component that has been moved, use object from the list so
		// we don't lose the properties
		var comp = sitedata.newComponent("page", newDashlet.regionId,
				dashboardPage);
		for ( var propertyKey in existingDashlet.properties) {
			comp.properties[propertyKey] = existingDashlet.properties[propertyKey];
		}
		comp.properties["region-id"] = newDashlet.regionId;
		comp.properties.url = newDashlet.url;
		comp.save();
	} else {
		// An new/added dashlet
		var comp = sitedata.newComponent("page", newDashlet.regionId,
				dashboardPage);
		comp.properties.url = newDashlet.url;
		comp.save();
	}
}
