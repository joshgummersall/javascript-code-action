import { BotComponent } from "botbuilder-core";
import { ComponentDeclarativeTypes } from "botbuilder-dialogs-declarative";
import { JavaScriptCodeAction } from "./javascriptCodeAction";

import {
  ServiceCollection,
  Configuration,
} from "botbuilder-dialogs-adaptive-runtime-core";

export default class JavaScriptCodeActionBotComponent extends BotComponent {
  configureServices(
    services: ServiceCollection,
    configuration: Configuration
  ): void {
    services.composeFactory<ComponentDeclarativeTypes[]>(
      "declarativeTypes",
      (declarativeTypes = []) =>
        declarativeTypes.concat({
          getDeclarativeTypes: () => [
            {
              kind: JavaScriptCodeAction.$kind,
              type: JavaScriptCodeAction,
            },
          ],
        })
    );
  }
}
