"use client";

import AddSesConfiguration from "./add-ses-configuration";
import SesConfigurations from "./ses-configurations";

export default function ApiKeysPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Admin</h1>
        <AddSesConfiguration />
      </div>
      <div className="mt-10">
        <p className="font-semibold mb-4">SES Configurations</p>
        <SesConfigurations />
      </div>
    </div>
  );
}
