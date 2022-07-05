sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/ui/core/Fragment"
	],
	function(Controller, UIComponent, Fragment) {
		return Controller.extend("sapui101sapui101.controller.BaseController", {
			getRouter: function() {
				return UIComponent.getRouterFor(this);
			},
			getResourceBundle: function() {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
		});
	}
);