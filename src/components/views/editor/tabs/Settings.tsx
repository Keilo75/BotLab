import clsx from "clsx";
import React, { useCallback, useEffect, useMemo } from "react";
import Container from "src/components/ui/Container";
import Button from "src/components/ui/inputs/Button";
import InputGroup from "src/components/ui/inputs/InputGroup";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import Link from "src/components/ui/Link";
import ComponentGroup from "src/components/ui/utils/ComponentGroup";
import useToggle from "src/hooks/useToggle";
import { getProjectNameError } from "src/lib/getProjectNameError";
import { ProjectSettings } from "src/models/project";
import { SettingsStore } from "src/stores/project-stores/SettingsStore";
import shallow from "zustand/shallow";

const Settings: React.FC = () => {
  const [settings, setSettings] = SettingsStore(
    useCallback((state) => [state.settings, state.setSettings], []),
    shallow
  );
  if (!settings) return null;

  const [tokenVisible, toggleTokenVisible] = useToggle(false);

  const handleSettingsChange = (state: ProjectSettings) => {
    setSettings(state);
  };

  const projectNameError = useMemo(() => getProjectNameError(settings.name), [settings.name]);

  return (
    <>
      <p className="mb text">
        Use this page to register your bots settings. If you have not done so yet, create a new Bot
        Account in the{" "}
        <Link href="https://discord.com/developers/applications" text="Discord Developer Portal" />.
      </p>
      <ComponentGroup axis="vertical" className="settings">
        <InputGroup state={settings} onChange={handleSettingsChange}>
          {(state, setState) => (
            <>
              <div>
                <Label text="Project Name" error={projectNameError} />
                <TextInput
                  name="name"
                  value={state.name}
                  onChange={setState}
                  error={projectNameError !== undefined}
                />
              </div>
              <div>
                <Label text="Bot Token" />
                <ComponentGroup axis="horizontal">
                  <TextInput
                    name="token"
                    value={state.token}
                    onChange={setState}
                    type={tokenVisible ? "text" : "password"}
                  />
                  <Button
                    text={tokenVisible ? "Hide" : "Show"}
                    type="primary"
                    onClick={toggleTokenVisible}
                    className="toggle-token-btn"
                  />
                </ComponentGroup>
                <Container type="warning" className="mt">
                  Never share your bots token with anybody! If you leak it, hackers can abuse your
                  bot and perform malicious acts with it.
                </Container>
              </div>
            </>
          )}
        </InputGroup>
        <div>
          <Label text="Imported Actions" />
          <p className="text">This is a list of all actions you can use in this project.</p>
        </div>
      </ComponentGroup>
    </>
  );
};

export default Settings;
