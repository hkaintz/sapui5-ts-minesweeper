import Table from "sap/m/Table";
import MineButton from "concircle/demo/minesweeper/control/MineButton";
import Event from "sap/ui/base/Event";
import Row from "sap/ui/table/Row";
import ColumnListItem from "sap/m/ColumnListItem";
import Column from "sap/m/Column";
import GridRow from "./GridRow";
import Coordinates from "../class/Coordinates";

/**
 * @namespace concircle.demo.minesweeper.control
 */
class MinesweeperGrid extends Table {

	constructor(idOrSettings ? : string | $GridSettings);
	constructor(id ? : string, settings ? : $GridSettings);
	constructor(id ? : string, settings ? : $GridSettings) {
		super(id, settings);
	}

	public static renderer = "sap.m.TableRenderer";

	private _mineCoordinates: Array < Coordinates > ;

	static readonly metadata = {
		properties: {
			fieldCount: {
				type: "int"
			},
			mineCount: {
				type: "int"
			},
			enabled: {
				type: "boolean",
				defaultValue: true
			}
		},
		aggregations: {},
		events: {
			won: {},
			lost: {}
		}
	}

	/* =========================================================== */
	/* lifecycle methods                                           */
	/* =========================================================== */

	public init(): void {
		super.init();
		this.setFixedLayout("Strict");
		this.setBackgroundDesign("Transparent");
		this.setShowSeparators("None");
	}

	public onBeforeRendering(event: JQuery.Event): void {
		super.onBeforeRendering(event);
		this._setWidth();
		this._createColumns();
		this._createItems();
		this._setMines();
		this._calculateMineCounts();
	}

	/* =========================================================== */
	/* public methods                                              */
	/* =========================================================== */

	public getMineButton(x: number, y: number): MineButton {
		const row: Row = this._getRow(x);
		if (row) {
			return row.getCells()[y] as MineButton;
		}
		return undefined;
	}

	public checkGameStatus(): void {
		if (this._isGameCorrect()) {
			this.fireEvent("won");
		}
	}

	public setEnabled(bValue: boolean): boolean {
		this._getRows().forEach((row: GridRow) => {
			row.getCells().forEach((mineButton: MineButton) => {
				mineButton.setEnabled(bValue);
			});
		});
		const success = this.setProperty("enabled", bValue, true) as unknown;
		return success as boolean;
	}

	public revealGame(): void {
		this._getRows().forEach((row: GridRow) => {
			row.getCells().forEach((mineButton: MineButton) => {
				mineButton.setEnabled(false);
				if (mineButton.getMine()) {
					mineButton.explode();
				}
				if (mineButton.getCount() > 0) {
					mineButton.revealText();
				}
			});
		});
	}

	/* =========================================================== */
	/* event handlers                                              */
	/* =========================================================== */

	public onMineButtonReveal(event: Event): void {
		const x: number = event.getParameter("x") as number;
		const y: number = event.getParameter("y") as number;
		this._revealNeighbours(x, y);
	}

	public onMineButtonFlag(): void {
		this.checkGameStatus();
	}

	public onMineButtonUnflag(): void {
		this.checkGameStatus();
	}

	public onMineButtonExploded(): void {
		this.fireEvent("lost");
	}

	/* =========================================================== */
	/* internal methods                                            */
	/* =========================================================== */

	private _getRow(index: number): Row {
		const row = this.getItems()[index] as unknown;
		return row as Row;
	}

	private _getRows(): GridRow[] {
		const rows = this.getItems() as unknown;
		return rows as GridRow[];
	}

	private _setWidth(): void {
		const fieldCount: number = this.getFieldCount();
		const width: number = (fieldCount * 2);
		this.setWidth(width.toString() + "rem");
	}

	private _createColumns(): void {
		const fieldCount: number = this.getFieldCount();
		for (let i = 0; i < fieldCount; i++) {
			this.addColumn(new Column({
				width: "2rem",
				styleClass: "c09MinesweeperGridColumn"
			}));
		}
	}

	private _createItems(): void {
		const fieldCount: number = this.getFieldCount();
		for (let x = 0; x < fieldCount; x++) {
			const cells = [];
			for (let y = 0; y < fieldCount; y++) {
				cells.push(this._createMineButton(x, y));
			}
			this.addItem(new ColumnListItem({
				vAlign: "Middle",
				cells: cells
			}));
		}
	}

	private _createMineButton(x: number, y: number): MineButton {
		return new MineButton({
			x: x,
			y: y,
			reveal: this.onMineButtonReveal.bind(this),
			flag: this.onMineButtonFlag.bind(this),
			unflag: this.onMineButtonUnflag.bind(this),
			exploded: this.onMineButtonExploded.bind(this)
		});
	}

	private _getCorrectFieldCount(): number {
		let correctFields = 0;
		this._getRows().forEach((row: GridRow) => {
			row.getCells().forEach((mineButton: MineButton) => {
				if (this._isMineButtonCorrect(mineButton)) {
					correctFields++;
				}
			});
		});
		return correctFields;
	}

	private _getWrongFieldCount(): number {
		let wrongFields = 0;
		this._getRows().forEach((row: GridRow) => {
			row.getCells().forEach((mineButton: MineButton) => {
				if (this._isMineButtonWrong(mineButton)) {
					wrongFields++;
				}
			});
		});
		return wrongFields;
	}

	private _isMineButtonCorrect(mineButton: MineButton): boolean {
		return mineButton.getMine() && mineButton.getFlagged();
	}

	private _isMineButtonWrong(mineButton: MineButton): boolean {
		return !mineButton.getMine() && mineButton.getFlagged() && !mineButton.getRevealed();
	}

	private _isGameCorrect(): boolean {
		return this._getWrongFieldCount() === 0 && this._getCorrectFieldCount() === this.getMineCount();
	}

	private _calculateMineCounts(): void {
		this._getRows().forEach((oRow) => {
			oRow.getCells().forEach((mineButton: MineButton) => this._countSourroundingMinesForButton(mineButton));
		});
	}

	private _countSourroundingMinesForButton(mineButton: MineButton): void {
		const x: number = mineButton.getX();
		const y: number = mineButton.getY();
		this._countMine(x, y, mineButton);
		this._countMine(x + 1, y, mineButton);
		this._countMine(x, y + 1, mineButton);
		this._countMine(x + 1, y + 1, mineButton);
		this._countMine(x - 1, y + 1, mineButton);
		this._countMine(x + 1, y - 1, mineButton);
		this._countMine(x, y - 1, mineButton);
		this._countMine(x - 1, y, mineButton);
		this._countMine(x - 1, y - 1, mineButton);
	}

	private _countMine(x: int, y: int, originalMineButton: MineButton): void {
		const mineButton: MineButton = this.getMineButton(x, y);
		if (mineButton && mineButton.getMine() && !originalMineButton.getMine()) {
			originalMineButton.addCount();
		}
	}

	private _setMines(): void {
		const mineCount: number = this.getMineCount();
		let minesPlaced = 0;
		this._mineCoordinates = [];
		while (minesPlaced < mineCount) {
			const x: number = this._generateRandomInteger(mineCount);
			const y: number = this._generateRandomInteger(mineCount);
			if (!this._isMinePlaced(x, y)) {
				if (this._placeMine(x, y)) {
					minesPlaced++;
				}
			}
		}
	}

	private _isMinePlaced(x: number, y: number): boolean {
		const coordinate: Coordinates = this._mineCoordinates.find((oCoordinate) => {
			return oCoordinate.x === x && oCoordinate.y === y
		});
		return !!coordinate;
	}

	private _placeMine(x: number, y: number): boolean {
		const mineButton: MineButton = this.getMineButton(x, y);
		if (mineButton) {
			mineButton.setMine(true);
			this._mineCoordinates.push({
				x: x,
				y: y
			});
			return true;
		}
		return false;
	}

	private _revealNeighbours(x: number, y: number): void {
		this._revealCoordinate(x + 1, y);
		this._revealCoordinate(x, y + 1);
		this._revealCoordinate(x + 1, y + 1);
		this._revealCoordinate(x - 1, y + 1);
		this._revealCoordinate(x + 1, y - 1);
		this._revealCoordinate(x, y - 1);
		this._revealCoordinate(x - 1, y);
		this._revealCoordinate(x - 1, y - 1);
	}

	private _revealCoordinate(x: number, y: number): void {
		const mineButton: MineButton = this.getMineButton(x, y);
		if (mineButton && mineButton.isRevealable()) {
			mineButton.check();
		}
	}

	private _generateRandomInteger(max: number): number {
		return Math.floor(Math.random() * max) + 1;
	}
}

export {
	MinesweeperGrid
};
export default MinesweeperGrid;