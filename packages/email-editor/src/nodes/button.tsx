import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoxSelectIcon,
  ScanIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@unsend/ui/src/popover";
import { cn } from "@unsend/ui/lib/utils";
import { Input } from "@unsend/ui/src/input";
import { Button } from "@unsend/ui/src/button";
import { AllowedAlignments, ButtonOptions } from "../types";
import { Separator } from "@unsend/ui/src/separator";
import { BorderWidth } from "../components/ui/icons/BorderWidth";
import { ColorPicker, ColorPickerPopup } from "../components/ui/ColorPicker";

const alignments: Array<AllowedAlignments> = ["left", "center", "right"];

export function ButtonComponent(props: NodeViewProps) {
  const {
    url,
    text,
    alignment,
    borderRadius: _radius,
    buttonColor,
    textColor,
    borderColor,
    borderWidth,
  } = props.node.attrs as ButtonOptions;
  const { getPos, editor } = props;

  console.log(props);

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && "ProseMirror-selectednode"
      }`}
      draggable="true"
      data-drag-handle=""
      style={{
        textAlign: alignment,
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div>
            <div
              className={cn(
                "cursor-pointer",
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50",
                "h-10 px-4 py-2",
                "px-[32px] py-[20px] font-semibold no-underline"
              )}
              tabIndex={-1}
              style={{
                backgroundColor: buttonColor,
                color: textColor,
                borderWidth: Number(borderWidth),
                borderStyle: "solid",
                borderColor: borderColor,
                borderRadius: Number(_radius),
              }}
              onClick={(e) => {
                e.preventDefault();
                const pos = getPos();
                editor.commands.setNodeSelection(pos);
              }}
            >
              <span>{text}</span>
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  props.updateAttributes({
                    text: e.target.value,
                  });
                }}
                onBlur={() => {
                  editor.commands.setNodeSelection(getPos());
                }}
                autoFocus
                className="w-full bg-transparent text-center outline-none"
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          className="space-y-2 w-[28rem] light border-gray-200 py-1 px-1"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* <div className="flex gap-2">
            <Input
              placeholder="Button text"
              value={text}
              onChange={(e) => {
                props.updateAttributes({
                  text: e.target.value,
                });
              }}
              className="light"
            />
            <Input
              placeholder="Add link here"
              value={url}
              onChange={(e) => {
                props.updateAttributes({
                  url: e.target.value,
                });
              }}
            />
          </div> */}

          <div className="flex gap-1 items-center">
            <div>
              <div className="flex">
                {alignments.map((alignment) => (
                  <Button
                    variant="ghost"
                    key={alignment}
                    className=""
                    size="sm"
                    type="button"
                    onClick={() => {
                      props.updateAttributes({
                        alignment,
                      });
                    }}
                  >
                    <AlignmentIcon alignment={alignment} />
                  </Button>
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className=" h-6 my-auto" />
            <div>
              <div className="flex">
                <ColorPickerPopup
                  trigger={
                    <div
                      className="h-4 w-4 rounded border"
                      style={{
                        backgroundColor: buttonColor,
                      }}
                    />
                  }
                  color={buttonColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      buttonColor: color,
                    });
                  }}
                />
                <ColorPickerPopup
                  trigger={
                    <div className="flex flex-col items-center justify-center gap-[1px]">
                      <span className="font-bolder font-mono text-xs text-slate-700">
                        A
                      </span>
                      <div
                        className="h-[2px] w-3"
                        style={{ backgroundColor: textColor }}
                      />
                    </div>
                  }
                  color={textColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      textColor: color,
                    });
                  }}
                />
              </div>
            </div>
            <Separator orientation="vertical" className=" h-6 my-auto" />
            <div>
              <div className="flex gap-1">
                <div className="flex items-center border border-transparent hover:border-border focus-within:border-border gap-1 px-1 py-0.5 rounded-md">
                  <ScanIcon className="text-slate-700 h-4 w-4" />
                  <Input
                    value={_radius}
                    onChange={(e) =>
                      props.updateAttributes({
                        borderRadius: e.target.value,
                      })
                    }
                    className="border-0 focus-visible:ring-0 h-6 p-0 w-5"
                  />
                </div>
                <div className="flex items-center border border-transparent hover:border-border focus-within:border-border gap-1 px-1 py-0.5 rounded-md">
                  <BorderWidth className="text-slate-700 h-4 w-4" />
                  <Input
                    value={borderWidth}
                    onChange={(e) =>
                      props.updateAttributes({
                        borderWidth: e.target.value,
                      })
                    }
                    className="border-0 focus-visible:ring-0 h-6 p-0 w-5"
                  />
                </div>
                <ColorPickerPopup
                  trigger={
                    <BoxSelectIcon
                      className="h-4 w-4"
                      style={{ color: borderColor }}
                    />
                  }
                  color={borderColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      borderColor: color,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}

const AlignmentIcon = ({ alignment }: { alignment: AllowedAlignments }) => {
  if (alignment === "left") {
    return <AlignLeftIcon className="h-4 w-4" />;
  } else if (alignment === "center") {
    return <AlignCenterIcon className="h-4 w-4" />;
  } else if (alignment === "right") {
    return <AlignRightIcon className="h-4 w-4" />;
  }
  return null;
};
