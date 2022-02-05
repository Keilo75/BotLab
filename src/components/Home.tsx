import React from "react";
import Button from "./ui/button/Button";
import Tab from "./ui/tabs/Tab";
import Tabs from "./ui/tabs/Tabs";

const Home: React.FC = () => {
  return (
    <>
      <Tabs name="Home" axis="horizontal">
        <Tab name="Projects"></Tab>
        <Tab name="Learn"></Tab>
        <Tab name="About"></Tab>
      </Tabs>
    </>
  );
};

export default Home;
