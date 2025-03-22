import { env } from "~/env";

export function isCloud() {
  return env.NEXT_PUBLIC_IS_CLOUD;
}

export function isSelfHosted() {
  return !isCloud();
}
