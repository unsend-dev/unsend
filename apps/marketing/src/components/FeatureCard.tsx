"use client";

import Image from "next/image";

export function FeatureCard({
  title,
  content,
  imageSrc,
}: {
  title?: string;
  content?: string;
  imageSrc?: string;
}) {
  return (
    <div className="rounded-[18px] bg-primary/20 p-1 ">
      <div className="h-full rounded-[14px] bg-primary/20 p-0.5   shadow-sm">
        <div className="bg-background rounded-xl h-full flex flex-col">
          <div className="relative w-full aspect-[16/9] rounded-t-xl">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title || "Feature image"}
                fill
                className="object-cover rounded-t-xl"
                priority={false}
              />
            ) : (
              <>
                <Image
                  src="/hero-light.png"
                  alt="Feature image"
                  fill
                  className="object-cover dark:hidden rounded-t-xl"
                  priority={false}
                />
                <Image
                  src="/hero-dark.png"
                  alt="Feature image"
                  fill
                  className="object-cover hidden dark:block rounded-t-xl"
                  priority={false}
                />
              </>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-base sm:text-lg text-primary font-sans">
              {title || ""}
            </h3>
            {content ? (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {content}
              </p>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground min-h-[1.5rem]"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
