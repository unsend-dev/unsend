import { NodeViewProps } from "@tiptap/core";
import { CSSProperties, useRef, useState } from "react";
import { useEvent } from "../hooks/useEvent";
import { NodeViewWrapper } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@unsend/ui/src/popover";
import { ExpandIcon, ScanIcon } from "lucide-react";
import { Input } from "@unsend/ui/src/input";

const MIN_WIDTH = 60;

export function ResizableImageTemplate(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;

  const imgRef = useRef<HTMLImageElement>(null);

  const [resizingStyle, setResizingStyle] = useState<
    Pick<CSSProperties, "width" | "height"> | undefined
  >();

  let { alignment = "center", width, height } = node.attrs || {};

  const [widthState, setWidthState] = useState<string>(width.toString());

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const imageParent = document.querySelector(
        ".ProseMirror-selectednode"
      ) as HTMLDivElement;

      if (!imgRef.current || !imageParent || !selected) {
        return;
      }

      const imageParentWidth = imageParent.offsetWidth;

      event.preventDefault();
      const direction = event.currentTarget.dataset.direction || "--";
      const initialXPosition = event.clientX;
      const currentWidth = imgRef.current.width;
      const currentHeight = imgRef.current.height;
      let newWidth = currentWidth;
      let newHeight = currentHeight;
      const transform = direction === "left" ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", removeListeners);
        updateAttributes({ width: newWidth, height: newHeight });
        setResizingStyle(undefined);
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        newWidth = Math.max(
          currentWidth + transform * (event.clientX - initialXPosition),
          MIN_WIDTH
        );

        if (newWidth > imageParentWidth) {
          newWidth = imageParentWidth;
        }

        newHeight = (newWidth / currentWidth) * currentHeight;

        setResizingStyle({ width: newWidth, height: newHeight });
        setWidthState(newWidth.toString());
        // If mouse is up, remove event listeners
        if (!event.buttons) {
          return removeListeners();
        }
      };

      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", removeListeners);
    }
  );

  const updateWidth = (_newWidth: string) => {
    setWidthState(_newWidth.toString());
    if (!imgRef.current) {
      return;
    }

    const imageParent = document.querySelector(
      ".ProseMirror-selectednode"
    ) as HTMLDivElement;

    const imageParentWidth = imageParent.offsetWidth;

    const currentWidth = imgRef.current.width;
    const currentHeight = imgRef.current.height;

    let newWidth = Number(_newWidth);

    newWidth = newWidth > 59 ? newWidth : 60;

    if (newWidth > imageParentWidth) {
      newWidth = imageParentWidth;
    }

    const newHeight = (newWidth / currentWidth) * currentHeight;

    setResizingStyle({
      width: newWidth > 59 ? newWidth : 60,
      height: newHeight,
    });
  };

  function dragButton(direction: "left" | "right") {
    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        data-direction={direction}
        className=" bg-white bg-opacity-40 border rounded-3xl"
        style={{
          position: "absolute",
          height: "60px",
          width: "7px",
          [direction]: 5,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: `${direction === "left" ? "w" : "e"}-resize`,
        }}
      />
    );
  }

  const { externalLink, ...attrs } = node.attrs || {};

  return (
    <NodeViewWrapper
      as="div"
      draggable
      data-drag-handle
      style={{
        width,
        height,
        ...resizingStyle,
        overflow: "hidden",
        position: "relative",
        // Weird! Basically tiptap/prose wraps this in a span and the line height causes an annoying buffer.
        lineHeight: "0px",
        display: "block",
        ...({
          center: { marginLeft: "auto", marginRight: "auto" },
          left: { marginRight: "auto" },
          right: { marginLeft: "auto" },
        }[alignment as string] || {}),
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger>
          <img
            {...attrs}
            ref={imgRef}
            style={{
              ...resizingStyle,
              cursor: "default",
              marginBottom: 0,
            }}
          />
          {selected && (
            <>
              {dragButton("left")}
              {dragButton("right")}
            </>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          className="space-y-2 light border-gray-200"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-transparent focus-within:border-border gap-2 px-1 py-0.5 rounded-md">
              <ExpandIcon className="text-slate-700 h-4 w-4" />
              <Input
                value={widthState}
                onChange={(e) => updateWidth(e.target.value)}
                className="border-0 focus-visible:ring-0 h-6 p-0"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
