"use client";

export function FeatureCardPlain({
  title,
  content,
}: {
  title?: string;
  content?: string;
}) {
  return (
    <div className="h-full rounded-2xl bg-primary/30 p-1 sm:p-1 border-2 border-primary/30 shadow-sm">
      <div className="bg-background rounded-xl h-full flex flex-col">
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-base sm:text-lg text-primary font-sans">{title || ""}</h3>
          {content ? (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{content}</p>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground min-h-[1.5rem]"></div>
          )}
        </div>
      </div>
    </div>
  );
}

