"use client";

export default function TeamCreationDisabled() {

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-[300px] flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-center">Cannot sign up</h1>
        </div>
        <div>
          <p className="text-center">
            Team creation is disabled. Please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
