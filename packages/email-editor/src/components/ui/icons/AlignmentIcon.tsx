import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { AllowedAlignments } from "../../../types";

export const AlignmentIcon = ({
  alignment,
}: {
  alignment: AllowedAlignments;
}) => {
  if (alignment === "left") {
    return <AlignLeftIcon className="h-4 w-4" />;
  } else if (alignment === "center") {
    return <AlignCenterIcon className="h-4 w-4" />;
  } else if (alignment === "right") {
    return <AlignRightIcon className="h-4 w-4" />;
  }
  return null;
};
