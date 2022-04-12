/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InteractionPermissionsModalComponent from "src/components/modals/interactions/InteractionPermissionsModal";
import { mockPermissions } from "../__mocks__/mockProject";

describe("interaction permissions modal", () => {
  it("renders", () => {
    render(
      <InteractionPermissionsModalComponent
        close={jest.fn()}
        handlePermissionsChange={jest.fn()}
        permissions={mockPermissions}
      />
    );
  });

  it("correctly shows no exceptions text", async () => {
    const user = userEvent.setup();

    render(
      <InteractionPermissionsModalComponent
        close={jest.fn()}
        handlePermissionsChange={jest.fn()}
        permissions={{ disabledByDefault: false, exceptions: [] }}
      />
    );

    expect(screen.getByText("No exceptions.")).toBeInTheDocument();

    await user.click(screen.getByText("Add Exception"));
    expect(screen.queryByText("No exceptions.")).toBeNull();
  });

  it("allows editing disabled by default value", async () => {
    const user = userEvent.setup();

    const mockHandleChange = jest.fn();
    render(
      <InteractionPermissionsModalComponent
        close={jest.fn}
        permissions={mockPermissions}
        handlePermissionsChange={mockHandleChange}
      />
    );

    expect(mockPermissions.disabledByDefault).toEqual(true);
    await user.click(screen.getByLabelText("Disabled by default"));
    await user.click(screen.getByText("Save"));
    expect(mockHandleChange.mock.calls[0][0].disabledByDefault).toEqual(false);
  });

  it("allows adding and removing exceptions", async () => {
    const user = userEvent.setup();

    const mockHandleChange = jest.fn();
    render(
      <InteractionPermissionsModalComponent
        close={jest.fn}
        permissions={{ disabledByDefault: false, exceptions: [] }}
        handlePermissionsChange={mockHandleChange}
      />
    );

    expect(mockPermissions.exceptions.length).toEqual(1);
    await user.click(screen.getByText("Add Exception"));
    await user.click(screen.getByText("Save"));
    expect(mockHandleChange.mock.calls[0][0].exceptions).toHaveLength(1);

    await user.click(screen.getByTitle("Remove Exception"));
    await user.click(screen.getByText("Save"));
    expect(mockHandleChange.mock.calls[1][0].exceptions).toHaveLength(0);
  });

  it("allows editing an exception ", async () => {
    const user = userEvent.setup();

    const mockHandleChange = jest.fn();
    render(
      <InteractionPermissionsModalComponent
        close={jest.fn}
        permissions={mockPermissions}
        handlePermissionsChange={mockHandleChange}
      />
    );

    await user.clear(screen.getByPlaceholderText("ID"));
    await user.type(screen.getByPlaceholderText("ID"), "test-id");
    await user.click(screen.getByText("Save"));
    expect(mockHandleChange.mock.calls[0][0].exceptions[0].identifier).toEqual("test-id");
  });
});
