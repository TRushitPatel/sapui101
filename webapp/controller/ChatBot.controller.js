sap.ui.define(
	[
		"./BaseController",
		"sap/m/CustomListItem",
		"sap/ui/core/routing/History"
	],
	function(BaseController, CustomListItem,History) {
		var that;
		return BaseController.extend("sapui101sapui101.controller.ChatBot", {
			onInit: function() {
				that = this;
				that.jsonModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(that.jsonModel);

				this.getView().byId("id_List").attachUpdateFinished(function(oEvent) {
					// debugger;
					var oScrollContainer = that.getView().byId("id_ScrollContainer");
					var aElementsInList = that.getView().byId("id_List").getItems();
					oScrollContainer.scrollToElement(aElementsInList[aElementsInList.length - 1], 500);
				});
			},
			// getConversationHeader: function(oChatContext) {
			// 	// debugger;
			// 	var oGroupHeaderItem = new sap.m.GroupHeaderListItem({
			// 		title: oChatContext.key,
			// 		upperCase:false
			// 	});
			// 	return oGroupHeaderItem;
			// },
			onNavButtonPress:function(oEvent){
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				
				if(sPreviousHash !== undefined){
					window.history.go(-1);
				}
				else{
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("",{},true);
				}
			},
			queryOrResponse: function(sId, oContext) {
				var oListItem;

				var sType = oContext.getProperty("type");
				// determine query or response(with input types) ------------------------------------------------------------------------------------
				if (sType === "query") { //-------------------------------------------------------------------------------User Query
					oListItem = this.byId("id_query_item").clone();
					//User query Generator-------------------------------------------------------------------------------------------------------------[pending]
					//                                                                           _________________________________________________
					//                                                                          |  											      |
					//                                                                          |  icon  | response text						  |
					//                                                                          |        | Input : Button List Date File		  |
					//	                                                                        |_________________________________________________|
				} else if (sType === "response") { //----------------------------------------------------------------------ChatBot Response
					oListItem = this.byId("id_response_item").clone();
					var oContent = oContext.getObject("content");
					// debugger;
					var sViewType = oContext.getProperty("view");
					var formatType = oContent.type;
					var oHBox = new sap.m.HBox();
					var oSubContent;
					// content Genererator-------------------------------------------------------------------------------------------------------
					// 1. content : Basic
					//	____________________________________________________
					// |           Input : Button List Date File	        |
					// |____________________________________________________|
					if (sViewType === "Basic") {
						if (formatType === "Button") { //----------------------------------------------------------input : Button
							for (var i = 0; i < oContent.value.length; i++) {
								oSubContent = new sap.m.Button({
									text: oContent.value[i].text
								});
								if (i != 0) {
									oSubContent.addStyleClass("sapUiTinyMarginBegin");
								}
								oHBox.addItem(oSubContent);
							}
						} else if (formatType === "List") { //-----------------------------------------------------input : List (ComboBox)
							var oComboBox = new sap.m.ComboBox();
							for (var i = 0; i < oContent.value.length; i++) {
								oSubContent = new sap.ui.core.Item({
									text: oContent.value[i].text,
									key: oContent.value[i].text
								});
								// debugger;/
								oComboBox.addItem(oSubContent);
							}
							oHBox.addItem(oComboBox);
						} else if (formatType === "CheckBox") {
							for (var i = 0; i < oContent.value.length; i++) {
								oSubContent = new sap.m.CheckBox({
									text: oContent.value[i].text,
									name: oContent.value[i].text
								});
								oHBox.addItem(oSubContent);
							}

						} else if (formatType === "Date") { //------------------------------------------------------input : Date Picker
							oSubContent = new sap.m.DatePicker({
								maxDate: new Date(oContent.value.start),
								minDate: new Date(oContent.value.end),
								displayFormatType: sap.ui.core.CalendarType.Gregorian
							});
							oHBox.addItem(oSubContent);
						} else if (formatType === "File") { //------------------------------------------------------input : File upload
							oSubContent = new sap.ui.unified.FileUploader({
								fileType: oContent.value.type
							});
							var oButton = new sap.m.Button({
								text: "Upload File",
								press: "onFileUpload"
							});
							oButton.addStyleClass("sapUiTinyMarginBegin");
							oHBox.addItem(oSubContent);
							oHBox.addItem(oButton);
						}
					}
					// 2. content : Adaptive Card
					//	____________________________________________________
					// |  Body-text											|
					// |       Label - Input : Button   			        |
					// |       Label - Input : List							|
					// |       Label - Input : Date							|
					// |       Label - Input : File							|
					// |----------------------------------------------------|
					// |               Submit the Card						|
					// |____________________________________________________|
					else if (sViewType === "AdaptiveCard") {
						// debugger;
						var oVBoxContent = new sap.m.VBox();
						var oHBoxBelow;
						// var oVBoxBelow = new sap.m.VBox();
						var oArrayBelow = oContent.value;
						var oBodyContent = new sap.m.FormattedText({
							htmlText: oContent.bodyText,
							convertLinksToAnchorTags: sap.m.LinkConversion.All,
						});
						oBodyContent.addStyleClass("sapUiTinyMargin");
						oVBoxContent.addItem(oBodyContent);
						var oSimpleForm = new sap.ui.layout.form.SimpleForm({
							layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout
						});
						var oText;
						for (i = 0; i < oArrayBelow.length; i++) {
							if (oArrayBelow[i].type === "Date") {
								oText = new sap.m.Text({
									text: oArrayBelow[i].text
								});
								oHBoxBelow = new sap.m.HBox();
								oSubContent = new sap.m.DatePicker({
									maxDate: new Date(oArrayBelow[i].value[0].start),
									minDate: new Date(oArrayBelow[i].value[0].end),
									displayFormatType: sap.ui.core.CalendarType.Gregorian
								});
								oHBoxBelow.addItem(oSubContent);
								oSimpleForm.addContent(oText);
								oSimpleForm.addContent(oHBoxBelow);
							} else if (oArrayBelow[i].type === "File") {
								oText = new sap.m.Text({
									text: oArrayBelow[i].text
								});
								oHBoxBelow = new sap.m.HBox();
								oSubContent = new sap.ui.unified.FileUploader({
									fileType: oArrayBelow[i].value[0].type
								});
								oHBoxBelow.addItem(oSubContent);
								oButton = new sap.m.Button({
									text: "Upload File",
									press: "onFileUpload"
								});
								oButton.addStyleClass("sapUiTinyMarginBegin");
								oHBoxBelow.addItem(oButton);

								oSimpleForm.addContent(oText);
								oSimpleForm.addContent(oHBoxBelow);
							} else if (oArrayBelow[i].type === "CheckBox") {
								oText = new sap.m.Text({
									text: oArrayBelow[i].text
								});
								oHBoxBelow = new sap.m.HBox();
								for (var j = 0; j < oArrayBelow[i].value.length; j++) {
									oSubContent = new sap.m.CheckBox({
										text: oArrayBelow[i].value[j].text,
										name: oArrayBelow[i].value[j].text
									});
									oSubContent.addStyleClass("sapUiTinyMargin");
									oHBoxBelow.addItem(oSubContent);
								}
								oSimpleForm.addContent(oText);
								oSimpleForm.addContent(oHBoxBelow);
							} else if (oArrayBelow[i].type === "Button") {
								oText = new sap.m.Text({
									text: oArrayBelow[i].text
								});
								oHBoxBelow = new sap.m.HBox();
								for (var j = 0; j < oArrayBelow[i].value.length; j++) {
									oSubContent = new sap.m.Button({
										text: oArrayBelow[i].value[j].text

									});
									oSubContent.addStyleClass("sapUiTinyMargin");
									oHBoxBelow.addItem(oSubContent);
								}
								oSimpleForm.addContent(oText);
								oSimpleForm.addContent(oHBoxBelow);
							} else if (oArrayBelow[i].type === "List") {
								oText = new sap.m.Text({
									text: oArrayBelow[i].text
								});
								oHBoxBelow = new sap.m.HBox();
								var oComboBoxBelow = new sap.m.ComboBox();
								// debugger;
								for (var j = 0; j < oArrayBelow[i].value.length; j++) {
									oSubContent = new sap.ui.core.Item({
										text: oArrayBelow[i].value[j].text,
										key: oArrayBelow[i].value[j].text
									});
									oComboBoxBelow.addItem(oSubContent);
								}
								oHBoxBelow.addItem(oComboBoxBelow);
								oSimpleForm.addContent(oText);
								oSimpleForm.addContent(oHBoxBelow);
							} //end-if-else-ladder
						} //end-for
						var oSubmitButton = new sap.m.Button({
							text: "Submit the Form"
						});
						oSimpleForm.addContent(oSubmitButton);
						oSimpleForm.addStyleClass("adaptive-card");
						
						oVBoxContent.addItem(oSimpleForm);
						oHBox.addItem(oVBoxContent);

					}

					//Response Generator-------------------------------------------------------------------------------------------------------------
					//	____________________________________________________
					// |  											        |
					// |  icon  | response text						        |
					// |        | content-contorl					        |
					// |____________________________________________________|
					var oHBoxStatic = new sap.m.HBox();
					var oVBoxStatic = new sap.m.VBox();
					var oIcon = new sap.ui.core.Icon({
						src: "sap-icon://customer",
						size: "3rem"
					});
					oIcon.addStyleClass("sapUiTinyMargin");

					var oFormattedText = new sap.m.FormattedText({
						convertLinksToAnchorTags: sap.m.LinkConversion.All,
						htmlText: "{text}"
					});
					oFormattedText.addStyleClass("sapUiTinyMarginTop");
					// oFormattedText.

					// var oTextForTimeStamp = new sap.m.Label({
					// 	text:	Date.now()
					// });
					// var oHBoxHeader = new sap.m.HBox();

					// oHBoxHeader.addItem(oFormattedText);
					// // oHBoxHeader.addItem(new sap.m.ToolbarSpacer());
					// oHBoxHeader.addItem(oTextForTimeStamp);

					// oVBoxStatic.addItem(oHBoxHeader);
					oVBoxStatic.addItem(oFormattedText); //header 
					oVBoxStatic.addItem(oHBox); //content-control
					oVBoxStatic.addStyleClass("sapUiTinyMargin");

					oHBoxStatic.addItem(oIcon);
					oHBoxStatic.addItem(oVBoxStatic);

					oListItem.addContent(oHBoxStatic);
					// debugger;
				}
				return oListItem;
			},
			onSubmitQuery: function(oEvent) {
				var oInput = oEvent.getSource();
				var sQuery = oInput.getValue();
				oInput.setValue("");

				// Add User query to the model
				var arr = that.jsonModel.getProperty("/listModel");
				if (!arr) {
					arr = [];
				}

				var jsonObj = {
					text: sQuery,
					type: "query"
				};
				arr.push(jsonObj);
				//  ______________________________________________
				// |----------------------arr.push----------------|
				// | -------that.arr-------|	|-----jsonObj-----|
				// | Res-1 | Res-2 | Res-3 | 	|      1 req      |										
				// | _____________________________________________|

				that.jsonModel.setProperty("/listModel", arr);

				// Add Bot Response to the model
				// fetch existing model
				arr = that.jsonModel.getProperty("/listModel");
				that.arr = arr;
				// var aData = jQuery.ajax({
				// 	type: "GET",
				// 	contentType: "application/json",
				// 	url: "http://127.0.0.1:5000/returnjson",
				// 	dataType: "json",
				// 	async: false,
				// 	success: function(data, textStatus, jqXHR) {
				// 		that.jsonModel.setProperty("/listModel", arr.push(data));
				// 	}
				// });
				var url;
				//Demand Specific input-control from flask API------------------------------------------------verified : working
				// if (sQuery.includes("form")) {
				// 	url = "http://127.0.0.1:5000/returnjson/AdaptiveCard";
				// } 
				// else if (sQuery.includes("choice")) {
				// 	url = "http://127.0.0.1:5000/returnjson/CheckBox";
				// }
				// else if (sQuery.includes("relocate")) {
				// 	url = "http://127.0.0.1:5000/returnjson/Button";
				// }
				// else if (sQuery.includes("skill")) {
				// 	url = "http://127.0.0.1:5000/returnjson/List";
				// }
				// else if (sQuery.includes(" date")) {
				// 	url = "http://127.0.0.1:5000/returnjson/Date";
				// }
				// else if (sQuery.includes("resume")) {
				// 	url = "http://127.0.0.1:5000/returnjson/File";
				// }
				// else{
				// 	url = "http://127.0.0.1:5000/returnjson/";
				// }
				// Demand Response for user query : Apply NLP/ML---------------------------------------------------Status : in-progress
				// url = "http://127.0.0.1:5000/identifyIntent/"+sQuery;
				url = "http://127.0.0.1:8000/processInput/"+sQuery;
				
				

				this.getData(url).done(function(result) {
					var oData = result.d;
					console.log("result",result);
					var arr = oData.results;
					// debugger;
					// console.log(result);
					//  ______________________________________________
					// |--------------------jQuery.merge--------------|
					// | -------that.arr-------|	|----------arr----|
					// | Res-1 | Res-2 | Res-3 | 	| res-01 | res-02 |										
					// | _____________________________________________|
					that.jsonModel.setProperty('/listModel', jQuery.merge(that.arr, arr));
				}).fail(function(result) {
					var arr = [];
					var jsonObj = {
						text: "Failed to connect to backend!",
						type: "response"
					};
					that.jsonModel.setProperty('/listModel', jQuery.merge(that.arr, arr));
				});
				// update the model

			},
			getData: function(url) {
				return jQuery.ajax({
					url: url,
					type: "GET"
				});
			}
		});
	});