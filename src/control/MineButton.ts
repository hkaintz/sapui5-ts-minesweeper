import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";

/**
 * @namespace concircle.demo.minesweeper.control
 */
class MineButton extends Button {

	constructor(idOrSettings ? : string | $MineSettings);
	constructor(id ? : string, settings ? : $MineSettings);
	constructor(id ? : string, settings ? : $MineSettings) {
		super(id, settings);
	}

	public static renderer = "sap.m.ButtonRenderer";
	public oncontextmenu: (event: Event) => void;

	private _rightClicked: boolean;

	static readonly metadata = {
		properties: {
			x: {
				type: "int"
			},
			y: {
				type: "int"
			},
			flagged: {
				type: "boolean"
			},
			unsure: {
				type: "boolean"
			},
			mine: {
				type: "boolean"
			},
			count: {
				type: "int",
				defaultValue: 0
			},
			revealed: {
				type: "boolean"
			}
		},
		aggregations: {},
		events: {
			reveal: {
				parameters: {
					x: {
						type: "int"
					},
					y: {
						type: "int"
					}
				}
			},
			exploded: {
				parameters: {
					x: {
						type: "int"
					},
					y: {
						type: "int"
					}
				}
			},
			flag: {
				parameters: {
					x: {
						type: "int"
					},
					y: {
						type: "int"
					}
				}
			},
			unflag: {
				parameters: {
					x: {
						type: "int"
					},
					y: {
						type: "int"
					}
				}
			}
		}
	}

	/* =========================================================== */
	/* lifecycle methods                                           */
	/* =========================================================== */

	public init(): void {
		super.init();
		this.addStyleClass("c09MineButton");
		this.attachPress(this.onPress.bind(this), this);
		this.oncontextmenu = this.onContextMenu.bind(this);
	}

	/* =========================================================== */
	/* public methods                                              */
	/* =========================================================== */

	public setFlagged(value: boolean): boolean {
		const iconUrl: string = value ? "sap-icon://flag" : undefined;
		this.setIcon(iconUrl);
		const success: unknown = this.setProperty("flagged", value);
		return success as boolean;
	}

	public setUnsure(value: boolean): boolean {
		const iconUrl: string = value ? "sap-icon://question-mark" : undefined;
		this.setIcon(iconUrl);
		const success: unknown = this.setProperty("unsure", value);
		return success as boolean;
	}

	public addCount(): void {
		let count = this.getProperty("count") as number;
		count++;
		this.setProperty("count", count);
	}

	public reveal(): void {
		this.setEnabled(false);
		this.setType("Transparent");
		this.setProperty("revealed", true);
	}

	public explode(): void {
		this.setEnabled(false);
		this.setType("Reject");
		this.setIcon("sap-icon://error");
	}

	public check(): void {
		if (this.getProperty("count") > 0) {
			this.revealText();
			return;
		}
		if (!this.getProperty("mine")) {
			this._handleReveal();
		} else {
			this._handleExplode();
		}
	}

	public revealText(): void {
		this.setText(this.getProperty("count"));
		this.reveal();
	}

	public isRevealable(): boolean {
		return !this.getMine() && this.getCount() === 0 && !this.getRevealed() && !this.getUnsure();
	}

	/* =========================================================== */
	/* event handlers                                              */
	/* =========================================================== */

	public onPress(): void {
		if (!this._rightClicked) {
			this.check();
		}
		this._rightClicked = undefined;
	}

	public onContextMenu(event: Event): void {
		this._rightClicked = true;
		event.preventDefault();
		this._handleRightClick();
	}

	/* =========================================================== */
	/* internal methods                                            */
	/* =========================================================== */

	private _handleReveal(): void {
		this.reveal();
		this.fireEvent("reveal", {
			x: this.getProperty("x") as number,
			y: this.getProperty("y") as number
		});
	}

	private _handleExplode(): void {
		this.explode();
		this.fireEvent("exploded", {
			x: this.getProperty("x") as number,
			y: this.getProperty("y") as number
		});
	}

	private _handleRightClick(): void {
		// process: empty -> flagged -> unsure
		if (this.getProperty("flagged")) {
			// button is flagged, so I must set it to unsure next
			this._handleSetUnsure();
		} else {
			if (this.getProperty("unsure")) {
				// button is unsure, so I must set it empty next
				this._handleResetButton();
			} else {
				// button is empty, so I must set it to flagged next
				this._handleSetFlagged();
			}
		}
	}

	private _handleSetUnsure(): void {
		this.setFlagged(false);
		this.setUnsure(true);
	}

	private _handleResetButton(): void {
		this.setFlagged(false);
		this.setUnsure(false);
		this.fireEvent("unflag", {
			x: this.getProperty("x") as number,
			y: this.getProperty("y") as number
		});
	}

	private _handleSetFlagged(): void {
		this.setUnsure(false);
		this.setFlagged(true);
		this.fireEvent("flag", {
			x: this.getProperty("x") as number,
			y: this.getProperty("y") as number
		});
	}

}
export {
	MineButton
};
export default MineButton;