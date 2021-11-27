import Text from "sap/m/Text";

const INITIAL_TEXT = "00:00";

/**
 * @namespace concircle.demo.minesweeper.control
 */
class Timer extends Text {
	
	public static renderer = "sap.m.TextRenderer";
	
	private _counterInterval: number;
	private _seconds: number;

	static readonly metadata = {
		properties: {
			secondsDuration: {
				type: "int",
				defaultValue: 1000
			}
		}
	}

	/* =========================================================== */
	/* lifecycle methods                                           */
	/* =========================================================== */

	public init(): void {
		super.init();
		this.addStyleClass("c09TimerText");
		this.setText(INITIAL_TEXT);
	}

	/* =========================================================== */
	/* public methods                                              */
	/* =========================================================== */

	public start(): void {
		this.reset();
		this._counterInterval = setInterval(this._count.bind(this), this.getSecondsDuration() || 1000);
	}

	public reset(): void {
		this.stop();
		this._seconds = 0;
		this.setText(INITIAL_TEXT);
	}

	public stop(): void {
		if (this._counterInterval) {
			clearInterval(this._counterInterval);
			this._counterInterval = undefined;
		}
	}

	public getSeconds(): number {
		return this._seconds;
	}

	/* =========================================================== */
	/* internal methods                                            */
	/* =========================================================== */

	private _count(): void {
		this._seconds++;
		this._setCountText();
	}

	private _setCountText(): void {
		const text: string = this._formatTimer();
		this.setText(text);
	}

	private _formatTimer(): string {
		if (this._seconds < 60) {
			return "00:" + this._formatTimeValue(this._seconds);
		}
		const minutes: number = parseInt((this._seconds / 60).toString(), 10);
		const seconds: number = parseInt((this._seconds % 60).toString(), 10);
		return this._formatTimeValue(minutes) + ":" + this._formatTimeValue(seconds);
	}

	private _formatTimeValue(timerValue: number): string {
		return timerValue < 10 ? "0" + timerValue.toString() : timerValue.toString();
	}
}

export {
	Timer
};
export default Timer;