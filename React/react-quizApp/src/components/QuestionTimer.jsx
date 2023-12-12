import { useEffect, useState } from "react";

export default function QuestionTimer({ setTimer, onTimeout, mode }) {
  const [remainingTime, setRemainingTime] = useState(setTimer);

  useEffect(() => {
    console.log("Setting Timeout");
    const quizTimer = setTimeout(onTimeout, setTimer);

    return () => {
      clearTimeout(quizTimer);
    };
  }, [setTimer, onTimeout]);

  useEffect(() => {
    console.log("Setting Interval");
    const intervalTimer = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <progress
      id="question-time"
      value={remainingTime}
      max={setTimer}
      className={mode}
    />
  );
}
