"use client";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md"
);

const Dock = React.forwardRef(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const [mouseX, setMouseX] = useState(null);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  isActive = false,
  ...props
}) => {
  const ref = useRef(null);
  const padding = Math.max(6, size * 0.2);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!ref.current || mouseX === null) {
      setScale(1);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distanceFromMouse = Math.abs(mouseX - centerX);

    if (distanceFromMouse > distance) {
      setScale(1);
      return;
    }

    // Calculate scale based on distance from mouse
    const scaleRange = magnification / size - 1;
    const newScale = 1 + scaleRange * (1 - distanceFromMouse / distance);
    setScale(newScale);
  }, [mouseX, distance, magnification, size]);

  return (
    <motion.div
      ref={ref}
      animate={{ scale }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      style={{
        width: size,
        height: size,
        padding,
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-full relative",
        className
      )}
      {...props}
    >
      <div className="flex aspect-square cursor-pointer items-center justify-center">
        {children}
      </div>
      {isActive && (
        <div className="absolute -bottom-1 w-1.5 h-1.5 bg-black rounded-full" />
      )}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
