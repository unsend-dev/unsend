import { SesSettingsService } from "~/server/service/ses-settings-service";

export async function getConfigurationSetName(
  clickTracking: boolean,
  openTracking: boolean,
  region: string
) {
  const setting = await SesSettingsService.getSetting(region);

  if (!setting) {
    throw new Error(`No SES setting found for region: ${region}`);
  }

  if (clickTracking && openTracking) {
    return setting.configFull;
  }
  if (clickTracking) {
    return setting.configClick;
  }
  if (openTracking) {
    return setting.configOpen;
  }

  return setting.configGeneral;
}
