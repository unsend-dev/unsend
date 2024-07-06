import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AllowedAlignments } from "../types";

import { ButtonComponent } from "../nodes/button";
// import { AllowedLogoAlignment } from '../nodes/logo';

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    button: {
      setButton: () => ReturnType;
    };
  }
}

export const ButtonExtension = Node.create({
  name: "button",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      component: {
        default: "button",
      },
      text: {
        default: "Button",
      },
      url: {
        default: "",
      },
      alignment: {
        default: "left",
      },
      borderRadius: {
        default: "4",
      },
      borderWidth: {
        default: "1",
      },
      buttonColor: {
        default: "rgb(0, 0, 0)",
      },
      borderColor: {
        default: "rgb(0, 0, 0)",
      },
      textColor: {
        default: "rgb(255, 255, 255)",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `a[data-unsend-component="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(
        {
          "data-unsend-component": this.name,
        },
        HTMLAttributes
      ),
    ];
  },

  addCommands() {
    return {
      setButton:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              mailyComponent: this.name,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent);
  },
});
