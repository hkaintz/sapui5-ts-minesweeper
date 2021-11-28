import UIComponent from "sap/ui/core/UIComponent";
import {
	support
} from "sap/ui/Device";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";


/**
 * @namespace concircle.demo.minesweeper
 */
export default class Component extends UIComponent {

	public static metadata = {
		manifest: "json"
	};

	private contentDensityClass: string;

	public init(): void {
		super.init();
		this.createLogEntry();
	}

	public createLogEntry(): void {
		const model = this.getModel() as ODataModel;
		model.callFunction("/CreateLogEntry", {
			method: "GET",
			urlParameters: {
				"Application": "TS-MINESWEEPER",
				"Username": "",
				"Comment": ""
			}
		});
	}

	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
				this.contentDensityClass = "";
			} else if (!support.touch) { // apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}

}