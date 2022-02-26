# Validation

Validation is a big part of BotLab due to the many possibilities within the software.
Every input needs to be validated and there are multiple ways to do that:

## In the editor

This validates input directly in the editor and disallows moving forward if the input is erroneous. Best used in modals.

**Example**: Renaming an interaction and making sure that all naming rules are met

## On Save

This validates input on save and prevents saving if it is erroneous. Use this extremley sparingly, as preventing the user from saving is not good.

**Example**: Renaming the project, as an invalid name would break things

## On Compile
