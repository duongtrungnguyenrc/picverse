"use client";

import { FC, ReactElement, useEffect, useState } from "react";

type CountDownProps = {
  milisecconds: number;
  children: (timeDifference: number | string) => ReactElement;
  timeFormat?: (timeDifference: number) => string | number;
};

const CountDown: FC<CountDownProps> = ({ milisecconds, children, timeFormat }) => {
  const [timeLeft, setTimeLeft] = useState(milisecconds);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1000;
        return newTimeLeft > 0 ? newTimeLeft : 0;
      });
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = timeFormat ? timeFormat(timeLeft) : timeLeft;

  return <>{children(formattedTime)}</>;
};

export default CountDown;
