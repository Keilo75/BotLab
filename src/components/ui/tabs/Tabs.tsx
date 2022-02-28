import clsx from "clsx";
import React, { useState } from "react";
import KeyboardList from "../keyboard-list/KeyboardList";
import Label from "../Label";

interface Props {
  children: React.ReactElement[];
  name: string;
  defaultTab: number;
  axis?: "vertical" | "horizontal";
}

const Tabs: React.FC<Props> = ({ children, name, defaultTab, axis = "vertical" }) => {
  const [selected, setSelected] = useState(defaultTab);

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
          <KeyboardList selectedIndex={selected} length={children.length} axis={axis}>
            {(refs) =>
              children.map((tab, index) => {
                const Icon = tab.props.icon;
                return (
                  <button
                    key={tab.props.name}
                    data-button-index={index}
                    className={clsx(
                      "button button-transparent",
                      selected === index && "button-selected",
                      axis === "vertical" && "button-text-left"
                    )}
                    ref={(ref) => (refs[index].current = ref)}
                    onClick={selectTab}
                  >
                    {Icon && <Icon />}
                    {tab.props.name}
                  </button>
                );
              })
            }
          </KeyboardList>
        </div>
      </div>
      <div
        className={clsx(
          !children[selected].props.fullscreen && "tab-content main-content",
          children[selected].props.className
        )}
      >
        {children[selected]}
      </div>
    </div>
  );
};

export default Tabs;
