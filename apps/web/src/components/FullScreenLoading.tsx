import { useTheme } from "@unsend/ui";
import Image from "next/image";

export const FullScreenLoading = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Image
        src={"/logo-light.png"}
        alt="Unsend"
        width={45}
        height={45}
        className="mx-auto"
      />
    </div>
  );
};
