import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { UnsubscribeFooterComponent } from "../nodes/unsubscribe-footer";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    unsubscribeFooter: {
      setUnsubscribeFooter: () => ReturnType;
    };
  }
}

export const UnsubscribeFooterExtension = Node.create({
  name: "unsubscribeFooter",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      component: {
        default: "unsubscribeFooter",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `unsub`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "unsub",
      mergeAttributes(
        {
          "data-unsend-component": this.name,
          class: "footer",
          contenteditable: "true",
        },
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(UnsubscribeFooterComponent);
  },
});
