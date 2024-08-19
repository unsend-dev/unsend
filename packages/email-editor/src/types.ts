import { Editor } from "@tiptap/react";

export interface MenuProps {
  editor: Editor;
  appendTo?: React.RefObject<any>;
  shouldHide?: boolean;
}

export type AllowedAlignments = "left" | "center" | "right";

export interface ButtonOptions {
  text: string;
  url: string;
  alignment: AllowedAlignments;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
  buttonColor: string;
  textColor: string;
  HTMLAttributes: Record<string, any>;
}

export interface ImageOptions {
  altText: string;
  url: string;
  alignment: AllowedAlignments;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
  HTMLAttributes: Record<string, any>;
}

export type SVGProps = React.SVGProps<SVGSVGElement>;
