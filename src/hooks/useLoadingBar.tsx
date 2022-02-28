import React, { useState } from "react";
import { motion } from "framer-motion";

export interface useLoadingBarReturnValue {
  Component: React.FC;
  setPercentage: React.Dispatch<React.SetStateAction<number>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const useLoadingBar = (): useLoadingBarReturnValue => {
  const [percentage, setPercentage] = useState(0);
  const [text, setText] = useState("");

  const component: React.FC = () => {
    return (
      <div className="loading-bar-container">
        <div className="loading-text">
          <span>{text}</span>
          <span>{percentage}%</span>
        </div>
        <div className="loading-bar">
          <motion.div
            className="indicator"
            initial={{ width: 0 }}
            animate={{ width: Math.min(percentage, 100) + "%" }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };

  return { Component: component, setPercentage, setText };
};

export default useLoadingBar;
