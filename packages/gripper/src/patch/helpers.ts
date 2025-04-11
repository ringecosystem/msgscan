export enum RuntimeProfile {
  Development = "development",
  Production = "production",
}

export class GripperHelpers {
  static ensureEnv(name: string): string {
    const v = process.env[name];
    if (!v) {
      throw new Error(`missing env.${name}`);
    }
    return v;
  }

  static runtimeProfile(): RuntimeProfile {
    const env =
      process.env.MSGSCAN_PROFILE || process.env.NODE_ENV || "development";
    switch (env.toLowerCase()) {
      case "production":
        return RuntimeProfile.Production;
      default:
        return RuntimeProfile.Development;
    }
  }
}
