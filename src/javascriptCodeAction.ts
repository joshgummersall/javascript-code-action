import assert from "assert";
import { Converter, ConverterFactory } from "botbuilder-dialogs";
import { NodeVM } from "vm2";

import {
  CodeAction,
  CodeActionConfiguration,
} from "botbuilder-dialogs-adaptive";

import {
  StringExpression,
  StringExpressionConverter,
} from "adaptive-expressions";

export interface JavaScriptCodeActionConfiguration
  extends CodeActionConfiguration {
  resultProperty: string | StringExpression;
  script: string | StringExpression;
}

export class JavaScriptCodeAction extends CodeAction {
  public static $kind = "JavaScriptCodeAction";

  public script?: StringExpression;
  public resultProperty?: StringExpression;

  public getConverter(
    property: keyof JavaScriptCodeActionConfiguration
  ): Converter | ConverterFactory {
    switch (property) {
      case "resultProperty":
      case "script":
        return new StringExpressionConverter();

      default:
        return super.getConverter(property);
    }
  }

  constructor() {
    super(async (dc) => {
      const script = this.script?.getValue(dc.state);
      assert(script, "`script` must be defined");

      const vm = new NodeVM({
        sandbox: { state: dc.state },
        wrapper: 'none',
      });

      const result = vm.run(script);

      const resultProperty = this.resultProperty?.getValue(dc.state);
      if (resultProperty) {
        dc.state.setValue(resultProperty, result);
      }

      return dc.endDialog(result);
    });
  }
}
