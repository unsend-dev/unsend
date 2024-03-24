import { db } from "../db";
import { JsonValue } from "@prisma/client/runtime/library";

export class AppSettingsService {
  private static cache: Record<string, JsonValue> = {};

  public static async getSetting(key: string) {
    if (!this.cache[key]) {
      const setting = await db.appSetting.findUnique({
        where: { key },
      });
      if (setting) {
        this.cache[key] = setting.value;
      } else {
        return null;
      }
    }
    return this.cache[key];
  }

  public static async setSetting(key: string, value: string) {
    await db.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    this.cache[key] = value;

    return value;
  }

  public static async initializeCache(): Promise<void> {
    const settings = await db.appSetting.findMany();
    settings.forEach((setting) => {
      this.cache[setting.key] = setting.value;
    });
  }
}
