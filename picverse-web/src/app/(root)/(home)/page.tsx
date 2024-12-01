import { Hero, Showcase } from "@app/components";
import { FC } from "react";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = ({}: HomePageProps) => {
  return (
    <>
      <Hero />
      <Showcase />
    </>
  );
};

export default HomePage;
