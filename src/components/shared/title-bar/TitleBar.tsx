import React, { useMemo, useState } from "react";
import AppLogo from "assets/icon/icon.svg";
import Minimize from "assets/images/minimize.svg";
import Maximize from "assets/images/maximize.svg";
import Close from "assets/images/close.svg";
import MenuPane, { MenuPaneProps } from "./MenuPane";
import { MenuAction } from "src/models/menu-action";
import { GlobalHotKeys, KeyMap } from "react-hotkeys";
import { MenuItemProps } from "./MenuItem";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { Group, Header, Image, Text } from "@mantine/core";

const Title = (state: IInfoStore) => state.title;
const Dirty = (state: IInfoStore) => state.dirty;

interface Props {
  handleMenuItemClick(action: MenuAction): void;
}

interface KeyboardShortcuts {
  keyMap: KeyMap;
  handlers: {
    [key: string]: (keyEvent?: KeyboardEvent | undefined) => void;
  };
}

const TitleBar: React.FC<Props> = ({ handleMenuItemClick }) => {
  const [selectedPane, setSelectedPane] = useState<string>();
  const title = InfoStore(Title);
  const dirty = InfoStore(Dirty);

  const menu: MenuPaneProps[] = useMemo(
    () => [
      {
        name: "File",
        children: [
          {
            name: "Save",
            action: MenuAction.SAVE,
            accelerator: "Ctrl+S",
            editorOnly: true,
            divider: true,
          },
          { name: "Options", action: MenuAction.OPTIONS, accelerator: "Ctrl+,", divider: true },
          {
            name: "Close Editor",
            action: MenuAction.CLOSE_EDITOR,
            editorOnly: true,
            accelerator: "Ctrl+F4",
          },
          { name: "Exit", action: MenuAction.EXIT, accelerator: "Alt+F4" },
        ],
      },
      {
        name: "Project",
        children: [
          { name: "Run Bot", action: MenuAction.RUN, editorOnly: true },
          { name: "Open in explorer", action: MenuAction.OPEN_IN_EXPLORER, editorOnly: true },
        ],
      },
      {
        name: "View",
        children: [
          { name: "Reload", action: MenuAction.RELOAD, accelerator: "Ctrl+R" },
          {
            name: "Toggle Dev Tools",
            action: MenuAction.TOGGLE_DEV_TOOLS,
            accelerator: "Ctrl+Shift+I",
          },
        ],
      },
    ],
    []
  );

  interface MenuItemPropsWithCategory extends MenuItemProps {
    category: string;
    index: number;
  }
  const shortcuts = useMemo(() => {
    return menu
      .reduce<MenuItemPropsWithCategory[]>((acc, cur) => {
        const children = cur.children.map((child, index) => ({
          ...child,
          category: cur.name,
          index,
        }));
        return [...acc, ...children];
      }, [])
      .reduce<KeyboardShortcuts>(
        (acc, cur) => {
          if (cur.accelerator) {
            const name = cur.name.toUpperCase().replace(/\s+/g, "_");

            return {
              keyMap: {
                ...acc.keyMap,
                [name]: cur.accelerator.toLowerCase(),
              },
              handlers: {
                ...acc.handlers,
                [name]: () => {
                  // Modal is open
                  const modal = document.querySelector("#modal");
                  if (modal && modal.children.length > 1) return;

                  setSelectedPane(cur.category);
                  const menuPane = document.querySelector(
                    `[data-menu-pane=${cur.category}]`
                  ) as HTMLButtonElement;

                  const items = menuPane.parentElement?.children[1].querySelectorAll(
                    "li"
                  ) as NodeListOf<HTMLLIElement>;
                  const item = items[cur.index];

                  if (!item.classList.contains("menu-item-disabled")) {
                    item.click();
                  }

                  setSelectedPane(undefined);
                },
              },
            };
          }
          return acc;
        },
        { keyMap: {}, handlers: {} }
      );
  }, [menu]);

  const handleWindowControlClick = (e: React.MouseEvent) => {
    const actions = {
      minimize: MenuAction.MINIMIZE,
      maximize: MenuAction.MAXIMIZE,
      close: MenuAction.EXIT,
    };

    const actionType = e.currentTarget.getAttribute("data-btn-action") as keyof typeof actions;
    if (actionType) window.ipc.handleTitleBarAction(actions[actionType]);
  };

  const handleOverlayClick = () => {
    setSelectedPane(undefined);
  };

  return (
    <>
      <Header height={30} className="title-bar">
        <Group sx={{ height: "100%" }} position="apart">
          <Group sx={{ height: "100%" }} className="title-bar-left" align="center" spacing={0}>
            <Image src={AppLogo} height={20} fit="contain" mx="xs" />
            <Group className="menus" spacing={0}>
              {menu.map((pane) => (
                <MenuPane
                  key={pane.name}
                  pane={pane}
                  selectedPane={selectedPane}
                  setSelectedPane={setSelectedPane}
                  handleItemClick={handleMenuItemClick}
                />
              ))}
            </Group>
          </Group>
          <Text>
            {dirty && "???"}
            {title}
          </Text>
          <Group className="window-control-btns" spacing={0}>
            <button
              className="window-control-btn"
              tabIndex={-1}
              onClick={handleWindowControlClick}
              data-btn-action="minimize"
            >
              <img src={Minimize} />
            </button>
            <button
              className="window-control-btn"
              tabIndex={-1}
              onClick={handleWindowControlClick}
              data-btn-action="maximize"
            >
              <img src={Maximize} />
            </button>
            <button
              className="window-control-btn"
              tabIndex={-1}
              onClick={handleWindowControlClick}
              data-btn-action="close"
            >
              <img src={Close} />
            </button>
          </Group>
        </Group>
      </Header>
      {selectedPane && <div className="overlay" onClick={handleOverlayClick} />}
      <GlobalHotKeys {...shortcuts} />
    </>
  );
};

export default TitleBar;
