import { CodegenConfig } from "@graphql-codegen/cli";

import fs from "fs";
import path from "path";

function cleanGenerated(f: string) {
  const dir = path.resolve(f, "../");
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
  }
}

function schemaGraphql(targetFile: string, schemas: string[]) {
  cleanGenerated(targetFile);
  const ret = {};
  ret[targetFile] = {
    schema: schemas,
    config: {
      enumsAsTypes: true,
      scalars: {
        DateTime: "Date",
      },
    },
    plugins: ["typescript", "typescript-operations"],
  };
  return ret;
}

function codegenConfig(): CodegenConfig {
  return {
    generates: {
      ...schemaGraphql("src/types/generated/gripper.schema.ts", [
        "graphql/*.graphql",
      ]),
    },
  };
}

export default codegenConfig();
