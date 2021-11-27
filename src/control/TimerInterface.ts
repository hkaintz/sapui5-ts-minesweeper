import {
	$TextSettings
} from "sap/m/Text";

declare module "./Timer" {

	interface $TimerSettings extends $TextSettings {
        secondsDuration?: number;
    }

	export default interface Timer {
		getSecondsDuration(): number;
		setSecondsDuration(value: number): boolean;
	}

}