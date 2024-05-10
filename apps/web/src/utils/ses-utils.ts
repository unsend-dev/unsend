import { APP_SETTINGS } from "./constants";

export function getConfigurationSetName(
  clickTracking: boolean,
  openTracking: boolean
) {
  if (clickTracking && openTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_FULL;
  }
  if (clickTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_CLICK_TRACKING;
  }
  if (openTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_OPEN_TRACKING;
  }

  return APP_SETTINGS.SES_CONFIGURATION_GENERAL;
}
