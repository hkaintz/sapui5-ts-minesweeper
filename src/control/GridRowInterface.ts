import MineButton from "concircle/demo/minesweeper/control/MineButton";

declare module "./GridRow" {

	export default interface GridRow {
		getCells(): MineButton[];
	}
	
}