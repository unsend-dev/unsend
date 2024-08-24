import { ReactNodeViewRenderer } from "@tiptap/react";
import TipTapImage from "@tiptap/extension-image";
import { ResizableImageTemplate } from "../nodes/image-resize";

export const ResizableImageExtension = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { renderHTML: ({ width }) => ({ width }), default: "600" },
      height: { renderHTML: ({ height }) => ({ height }) },
      borderRadius: {
        default: "0",
      },
      borderWidth: {
        default: "0",
      },
      borderColor: {
        default: "rgb(0, 0, 0)",
      },
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
      alt: {
        default: "image",
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
});
