import { useRef, useEffect } from 'react';
import { getTimeInMilliseconds } from "@jam-comments/utilities/shared";

const useFocusTimer = (formRef) => {
    const timerRef = useRef(null);
    const focusTargets = useRef(null);

    const removeSetStartTime = (): void => {
        focusTargets.current.forEach((input) => {
            input.removeEventListener("focus", setStartTime);
        });
    };

    const setStartTime = (): void => {
        if (timerRef.current) return;

        timerRef.current = getTimeInMilliseconds();
        removeSetStartTime();
    };

    useEffect(() => {
        focusTargets.current = formRef.current?.querySelectorAll("input, textarea") || [];

        focusTargets.current.forEach((input) => {
            input.addEventListener("focus", setStartTime);
        });

        return removeSetStartTime;
    }, []);

    return () => (getTimeInMilliseconds() - timerRef.current);
};

export default useFocusTimer;
