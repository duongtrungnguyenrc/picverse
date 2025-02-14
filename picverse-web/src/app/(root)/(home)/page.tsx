import { Hero, Showcase } from "@app/components";
import { FC } from "react";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = ({}: HomePageProps) => {
  return (
    <>
      <Showcase />
    </>
  );
};

export default HomePage;
