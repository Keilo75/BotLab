import clsx from "clsx";
import React, { useState } from "react";
import Button from "../button/Button";
import KeyboardList from "../keyboard-list/KeyboardList";
import Label from "../Label";

interface Props {
  children: React.ReactElement[];
  name: string;
  axis?: "vertical" | "horizontal";
}

const Tabs: React.FC<Props> = ({ children, name, axis = "vertical" }) => {
  const [selected, setSelected] = useState(0);

  const selectTab = (e: React.MouseEvent<HTMLElement>) => {
    const index = e.currentTarget.getAttribute("data-button-index");

    if (index) {
      setSelected(parseInt(index));
    }
  };

  return (
    <div className={clsx("tabs", axis === "horizontal" && "tabs-horizontal")}>
      <div className="tab-list-container">
        <div className="tab-list">
          {axis === "vertical" && <Label text={name} />}
          <KeyboardList selectedIndex={selected} length={children.length}>
            {(refs) =>
              children.map((tab, index) => (
                <button
                  key={tab.props.name}
                  data-button-index={index}
                  className={clsx(
                    "button button-transparent button-text-left",
                    selected == index && "button-selected"
                  )}
                  ref={(ref) => (refs[index].current = ref)}
                  onClick={selectTab}
                >
                  {tab.props.name}
                </button>
              ))
            }
          </KeyboardList>
        </div>
      </div>
      <div className="tab-content">{children[selected]}</div>
    </div>
  );
};

export default Tabs;
