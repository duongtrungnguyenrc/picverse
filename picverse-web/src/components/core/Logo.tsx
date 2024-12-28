import Image from "next/image";
import { FC } from "react";

type LogoProps = { size?: number };

const Logo: FC<LogoProps> = ({ size = 10 }) => {
  return (
    <div className={`w-${size} h-${size} rounded-full relative`}>
      <Image src="/images/logo.png" alt="logo" layout="fill" />
    </div>
  );
};

export default Logo;
