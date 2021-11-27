import {
	$TableSettings
} from "sap/m/Table";


declare module "./MinesweeperGrid" {

	interface $GridSettings extends $TableSettings {
		fieldCount?: string;
		mineCount?: string;
		enabled?: boolean;
		won?: (event: Event) => void;
		lost?: () => void;
	}
	
	export default interface MinesweeperGrid {
		getFieldCount(): number;
		setFieldCount(value: number): boolean;
		getMineCount(): number;
		setMineCount(value: number): boolean;
		getEnabled(): boolean;
		setEnabled(value: boolean): boolean;
	}

}