import { ReactNodeViewRenderer } from "@tiptap/react";
import TipTapImage from "@tiptap/extension-image";
import { ResizableImageTemplate } from "../nodes/image-resize";

const BORDER_COLOR = "#0096fd";

export const ResizableImageExtension = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { renderHTML: ({ width }) => ({ width }) },
      height: { renderHTML: ({ height }) => ({ height }) },
      alignment: {
        default: "center",
        renderHTML: ({ alignment }) => ({ "data-alignment": alignment }),
        parseHTML: (element) =>
          element.getAttribute("data-alignment") || "center",
      },
      externalLink: {
        default: null,
        renderHTML: ({ externalLink }) => {
          if (!externalLink) {
            return {};
          }
          return {
            "data-external-link": externalLink,
          };
        },
        parseHTML: (element) => {
          const externalLink = element.getAttribute("data-external-link");
          return externalLink ? { externalLink } : null;
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
});
