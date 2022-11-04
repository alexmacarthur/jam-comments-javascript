import { getTimeInMilliseconds } from "./utils";

interface FocusTimerReturn {
    diff: () => null | number;
}

const FocusTimer = (inputs: NodeListOf<HTMLInputElement>): FocusTimerReturn => {
    let startTime: null | number = null;
    const focusInputs: HTMLInputElement[] = Array.from(inputs);

    const removeSetStartTime = (): void => {
        focusInputs.forEach((input) => {
            input.removeEventListener("focus", setStartTime);
        });
    };

    const setStartTime = (): void => {
        startTime = getTimeInMilliseconds();

        removeSetStartTime();
    };

    focusInputs.forEach((input) => {
        input.addEventListener("focus", setStartTime);
    });

    return {
        diff() {
            return !startTime ? null : getTimeInMilliseconds() - startTime;
        },
    };
};

export default FocusTimer;
