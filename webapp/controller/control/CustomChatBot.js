sap.ui.define(
	["sap/ui/core/Control"],
	function(Control) {
		return Control.extend("sapui101sapui101.Controller.control.CustomChatBot", {
				metadata: {
					properties: {
						// title: {
						// 	type: "string"
						// }
					},
					events: {},
					aggregations: {}
				},
				init: function() {},
				renderer: function(oRm, oControl) {
					// oRm.openStart("div");
					// oRm.openEnd();
					// oRm.text(oControl.getTitle());
					// oRm.close("div");
					oRm.write("<h1>header</h1>");
				},
				onAfterRendering: function(oEvent) {}
					// setTitle: function(value) {
					// 		this.setProperty("title", value, true);
					// 	} //end of setTitle
			} //end of jsonObject containing settings of the extending control
		); //end of return 
	} //end of function(Control)
); //end of sap.ui.define