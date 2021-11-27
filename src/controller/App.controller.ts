import AppComponent from "../Component";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import GameSettings from "../class/GameSettings"
import BaseController from "./BaseController"
import Panel from "sap/m/Panel";
import MinesweeperGrid from "../control/MinesweeperGrid"
import Timer from "../control/Timer";
import FlexBox from "sap/m/FlexBox";
import Image from "sap/m/Image";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace concircle.demo.minesweeper.controller
 */
export default class AppController extends BaseController {

	/* =========================================================== */
	/* lifecycle methods                                           */
	/* =========================================================== */

	public onInit(): void {
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
	}

	public onBeforeRendering(): void {
		this._applyInitialSettings();
	}

	/* =========================================================== */
	/* event handlers                                              */
	/* =========================================================== */

	public onStartPress(): void {
		this._enableGrid();
		this._startGame();
	}

	public onStopPress(): void {
		this._stopGame();
	}

	public onGameWon(): void {
		this._stopTimer();
		this._disableGrid();
		this._showWinDialog();
	}

	public onGameLost(): void {
		this._stopTimer();
		this._revealGame();
	}

	public onDifficultySelect(event: Event): void {
		const index: number = event.getParameter("selectedIndex") as number;
		this._setDifficulty(index);
	}

	public onTogglePanelPress(): void {
		const panel: Panel = this._getSettingsPanel();
		panel.setExpanded(!panel.getExpanded());
	}

	private _getSettingsPanel(): Panel {
		return this.getView().byId("Panel") as Panel;
	}

	/* =========================================================== */
	/* private methods                                             */
	/* =========================================================== */

	private _applyInitialSettings(): void {
		this._setDifficulty(1);
	}

	private _setInitialSettings(): void {
		this._setDifficulty(1);
	}

	private _setDifficulty(difficulty: number): void {
		const settings: GameSettings = this._mapDifficultyToSettings(difficulty);
		this._applySettings(settings);
	}

	private _mapDifficultyToSettings(difficulty: number): GameSettings {
		switch (difficulty) {
			case 0:
				return this._getEasyDifficulty();
			case 1:
				return this._getMediumDifficulty();
			case 2:
				return this._getHardDifficulty();
			case 3:
				return this._getExtremeDifficulty();
			default:
				return this._getEasyDifficulty();
		}
	}

	private _applySettings(settings: GameSettings): void {
		const oModel: JSONModel = this.getSettingsModel();
		oModel.setProperty("/FieldCount", settings.fieldCount);
		oModel.setProperty("/MineCount", settings.mineCount);
	}

	private _getEasyDifficulty(): GameSettings {
		return {
			fieldCount: 5,
			mineCount: 5
		};
	}

	private _getMediumDifficulty(): GameSettings {
		return {
			fieldCount: 10,
			mineCount: 10
		};
	}

	private _getHardDifficulty(): GameSettings {
		return {
			fieldCount: 20,
			mineCount: 20
		};
	}

	private _getExtremeDifficulty(): GameSettings {
		return {
			fieldCount: 35,
			mineCount: 500
		};
	}

	private _startGame(): void {
		this._handleGridCreation();
		this._setGameStarted(true);
		this._startTimer();
	}

	private _handleGridCreation(): void {
		this._destroyGrid();
		const grid: MinesweeperGrid = this._createGrid();
		this._setGrid(grid);
	}

	private _startTimer(): void {
		this._getTimer().start();
	}

	private _stopTimer(): void {
		this._getTimer().stop();
	}

	private _getTimer(): Timer {
		return this.getView().byId("Timer") as Timer;
	}

	private _stopGame(): void {
		this._destroyGrid();
		this._setGameStarted(false);
		this._stopTimer();
	}

	private _setGameStarted(started: boolean): void {
		this.getSettingsModel().setProperty("/GameStarted", started);
	}

	private _getGameStarted(): void {
		this.getSettingsModel().getProperty("/GameStarted");
	}

	private _destroyGrid(): void {
		const container: FlexBox = this._getGridContainer();
		container.destroyItems();
		container.removeAllItems();
	}

	private _setGrid(oGrid: MinesweeperGrid) {
		const container: FlexBox = this._getGridContainer();
		container.addItem(oGrid);
	}

	private _getGridContainer(): FlexBox {
		return this.getView().byId("gridContainer") as FlexBox;
	}

	private _getGrid(): MinesweeperGrid {
		return this._getGridContainer().getItems()[0] as MinesweeperGrid;
	}

	private _enableGrid(): void {
		const grid: MinesweeperGrid = this._getGrid();
		if (grid) {
			grid.setEnabled(true);
		}
	}

	private _disableGrid(): void {
		const grid: MinesweeperGrid = this._getGrid();
		if (grid) {
			grid.setEnabled(false);
		}
	}

	private _revealGame(): void {
		const grid: MinesweeperGrid = this._getGrid();
		if (grid) {
			grid.revealGame();
		}
	}

	private _createGrid(): MinesweeperGrid {
		return new MinesweeperGrid({
			fieldCount: "{Settings>/FieldCount}",
			mineCount: "{Settings>/MineCount}",
			won: this.onGameWon.bind(this),
			lost: this.onGameLost.bind(this)
		});
	}

	public getSettingsModel(): JSONModel {
		const model: JSONModel = this.getView().getModel("Settings") as JSONModel;
		return model;
	}

	private _showWinDialog(): void {
		const imagePath: string = sap.ui.require.toUrl("concircle/demo/minesweeper/img/win.jpeg");
		new Dialog({
			draggable: true,
			showHeader: false,
			endButton: new Button({
				text: "{i18n>close}",
				press: (oEvent: Event) => {
					const button = oEvent.getSource() as Button;
					const dialog = button.getParent() as Dialog;
					dialog.close();
				}
			}),
			afterClose: (oEvent: Event) => {
				const dialog = oEvent.getSource() as Dialog;
				dialog.destroy();
			},
			beforeOpen: (oEvent: Event) => {
				const dialog = oEvent.getSource() as Dialog;
				this.getView().addDependent(dialog);
			},
			content: new Image({
				src: imagePath
			})
		}).open();
	}
}