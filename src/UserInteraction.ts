import * as vscode from "vscode";
import Current from "./Current";

enum FormatErrorInteraction {
  configure = "Configure",
  reset = "Reset"
}

enum UnknwonErrorInteraction {
  reportIssue = "Report issue"
}

export async function handleFormatError(error) {
  switch (error.code) {
    case "ENOENT":
      const selection = await Current.editor.showErrorMessage(
        `Could not find SwiftFormat: ${Current.config.swiftFormatPath()}`,
        FormatErrorInteraction.reset,
        FormatErrorInteraction.configure
      );
      switch (selection) {
        case FormatErrorInteraction.reset:
          await Current.config.resetSwiftFormatPath();
          break;
        case FormatErrorInteraction.configure:
          await Current.config.configureSwiftFormatPath();
          break;
      }
    default:
      const unknownErrorSelection = await Current.editor.showErrorMessage(
        `An unknown error occured. ${error.message || ""}`,
        UnknwonErrorInteraction.reportIssue
      );
      if (unknownErrorSelection === UnknwonErrorInteraction.reportIssue) {
        await Current.editor.reportIssueForError(error);
      }
  }
}

enum LinuxWarningInteraction {
  learnWhy = "Learn Why"
}

export async function showMissingLinuxSupportWarning() {
  const selection = await Current.editor.showWarningMessage(
    "Formatting will be disabled as SwiftFormat is not available on Linux.",
    LinuxWarningInteraction.learnWhy
  );
  if (selection === LinuxWarningInteraction.learnWhy) {
    Current.editor.openURL(
      "https://github.com/nicklockwood/SwiftFormat/issues/240"
    );
  }
}
