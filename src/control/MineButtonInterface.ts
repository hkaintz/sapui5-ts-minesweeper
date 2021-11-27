import Event from "sap/ui/base/Event";
import {
	$ButtonSettings
} from "sap/ui/commons/Button";


declare module "./MineButton" {

	interface $MineSettings extends $ButtonSettings {
		x: number;
		y: number;
		reveal?: (event: Event) => void;
		flag?: (event: Event) => void;
		unflag?: (event: Event) => void;
		exploded?: (event: Event) => void;
	}

	export default interface MineButton {
		getMine(): boolean;
		setMine(value: boolean): boolean;
		getFlagged(): boolean;
		setFlagged(value: boolean): boolean;
		getRevealed(): boolean;
		setRevealed(value: boolean): boolean;
		getMineCount(): number;
		setMineCount(value: number): boolean;
		getY(): number;
		setY(value: number): boolean;
		getX(): number;
		setX(value: number): boolean;
		getCount(): number;
		setCount(value: number): boolean;
		getUnsure(): boolean;
		setUnsure(value: boolean): boolean;
	}
}