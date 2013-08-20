/*
 * Copyright (C) 2008-2010 Surevine Limited.
 *   
 * Although intended for deployment and use alongside Alfresco this module should
 * be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
 * http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
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
