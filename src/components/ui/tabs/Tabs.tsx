import React, { useState } from "react";
import Button from "../button/Button";
import KeyboardList from "../keyboard-list/KeyboardList";
import Label from "../Label";

interface Props {
  children: React.ReactElement[];
  name: string;
}

const Tabs: React.FC<Props> = ({ children, name }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="tabs">
      <div className="tab-list-container">
        <div className="tab-list">
          <Label text={name} />
          <KeyboardList
            selected={selected}
            length={children.length}
            render={(refs) =>
              children.map((tab, index) => (
                <button
                  key={tab.props.name}
                  className="button button-transparent button-text-left"
                  ref={(ref) => (refs[index].current = ref)}
                >
                  {tab.props.name}
                </button>
              ))
            }
          ></KeyboardList>
        </div>
      </div>
      <div className="tab-content"></div>
    </div>
  );
};

export default Tabs;
