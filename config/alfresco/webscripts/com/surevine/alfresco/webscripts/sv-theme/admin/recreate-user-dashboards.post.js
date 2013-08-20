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
function getNewDashlets() {
	var newDashlets = [ {
		url : "/components/dashlets/sv-theme/activities",
		regionId : "component-1-1"
	}, {
		url : "/components/dashlets/my-documents",
		regionId : "component-2-1"
	}, {
		url : "/components/dashlets/sv-theme/chat",
		regionId : "component-3-1"
	}, {
		url : "/components/dashlets/sv-theme/motd",
		regionId : "component-3-2"
	} ];

	return newDashlets;
}

model.successful = [];

var templateId = "dashboard-3-columns";
var user, dashboardPage, oldComponents, newDashlets, i, j;

// +++ Get the list of people
var usersResult, users;

var result = remote.call("/api/people");

if (result.status == 200) {
	usersResult = eval('(' + result + ')');
	users = usersResult.people;
} else {
	users = [];
}

for ( var idx in users) {
	user = users[idx];

	dashboardPage = "user/" + user.userName + "/dashboard";

	/**
	 * The existing dashboard components. We need these to copy any properties
	 * across
	 */
	oldComponents = sitedata.findComponents("page", null, dashboardPage, null);
	if (oldComponents === undefined || oldComponents.length === 0) {
		oldComponents = [];
	}

	/** Gets the new set of dashlets */
	newDashlets = getNewDashlets();

	for (i = 0; i < newDashlets.length; ++i) {
		for (j = 0; j < oldComponents.length; ++j) {
			if (newDashlets[i].url == oldComponents[j].properties.url) {
				newDashlets[i].originalRegionId = oldComponents[j].properties["region-id"];
				break;
			}
		}
	}

	/** Construct the json to post to the webscript */
	// +++ Was going to do this and call the customise-dashboard.post webscript
	// with
	// the data, but can't work out how!
	//
	// var postData = {
	// "dashboardPage" : dashboardPage,
	// "templateId" : "dashboard-3-columns",
	// "dashlets" : newDashlets
	// };
	//
	// encodeJSONString(postData);
	//
	// ---
	// +++ The next section is mostly copied from
	// customise-dashboard.post.json.js
	// Change the dashbpards template
	sitedata.associateTemplate(templateId, dashboardPage);

	// Unbind all components, old properties will be stored in the oldComponents
	// list.
	for ( var oi = 0; oi < oldComponents.length; oi++) {
		var oldComponent = oldComponents[oi];
		var regionId = oldComponent.properties["region-id"];
		if (regionId.match("^component-\\d+-\\d+$")) {
			// Unbind the component if it has been delete or moved
			var existingDashlet = null;
			for ( var ni = 0; ni < newDashlets.length; ni++) {
				var newDashlet = newDashlets[ni];
				if (newDashlet.originalRegionId == regionId) {
					existingDashlet = newDashlet;
					break;
				}
			}
			if (existingDashlet == null
					|| existingDashlet.regionId != existingDashlet.originalRegionId) {
				// Delete dashlet if it has been removed or moved
				sitedata.unbindComponent("page", regionId, dashboardPage);
			}
		}
	}

	// Create bindings for new and moved dashlets.
	for ( var ni = 0; ni < newDashlets.length; ni++) {
		var newDashlet = newDashlets[ni];
		if (newDashlet.originalRegionId) {
			if (newDashlet.originalRegionId != newDashlet.regionId) {
				// An existing/moved dashlet
				var existingDashlet = null;
				for ( var oi = 0; oi < oldComponents.length; oi++) {
					var oldDashlet = oldComponents[oi];
					if (oldDashlet.properties["region-id"] == newDashlet.originalRegionId) {
						existingDashlet = oldDashlet;
						break;
					}
				}
				if (existingDashlet != null) {
					// Its an old component that has been moved, use object from
					// the
					// list so we don't loose the properties
					var comp = sitedata.newComponent("page",
							newDashlet.regionId, dashboardPage);
					for ( var propertyKey in existingDashlet.properties) {
						comp.properties[propertyKey] = existingDashlet.properties[propertyKey];
					}
					comp.properties["region-id"] = newDashlet.regionId;
					comp.properties.url = newDashlet.url;
					comp.save();
				}
			}
		} else {
			// An new/added dashlet
			var comp = sitedata.newComponent("page", newDashlet.regionId,
					dashboardPage);
			comp.properties.url = newDashlet.url;
			comp.save();
		}
	}
	// --- END: Copy/paste

	model.successful[model.successful.length] = user.userName;
}
