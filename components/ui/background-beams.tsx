"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: "50%", y: "50%" });
  const beamsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!beamsRef.current) return;

    const beams = beamsRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const rect = beams.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setMousePosition({ x: `${mouseX}px`, y: `${mouseY}px` });
      }, 16);
    };

    beams.addEventListener("mousemove", handleMouseMove);

    return () => {
      beams.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-30",
        className
      )}
    >
      <div className="absolute inset-0 bg-background/80" />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `
            radial-gradient(
              600px circle at ${mousePosition.x} ${mousePosition.y},
              rgba(255,255,255,0.4),
              transparent 40%
            )
          `,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(
              800px circle at ${mousePosition.x} ${mousePosition.y},
              rgba(255,255,255,0.15),
              transparent 40%
            )
          `,
        }}
      />
    </div>
  );
};

BackgroundBeams.displayName = "BackgroundBeams";
