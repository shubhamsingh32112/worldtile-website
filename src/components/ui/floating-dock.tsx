/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href?: string; onClick?: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href?: string; onClick?: () => void }[];
  className?: string;
}) => {
  return (
    <div className={cn("mx-auto flex md:hidden h-20 items-end gap-2 rounded-2xl bg-transparent px-2 pb-3 overflow-x-auto", className)}>
      {items.map((item) => (
        <MobileIconContainer key={item.title} {...item} />
      ))}
    </div>
  );
};

function MobileIconContainer({
  title,
  icon,
  href,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex flex-col items-center gap-1 min-w-[50px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 cursor-pointer">
        <div className="h-5 w-5">{icon}</div>
      </div>
      <span className="text-[10px] text-neutral-300 whitespace-nowrap">
        {title}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="flex flex-col items-center"
      >
        {content}
      </button>
    );
  }

  return (
    <a href={href || '#'} className="flex flex-col items-center">
      {content}
    </a>
  );
}

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href?: string; onClick?: () => void }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto h-20 items-end gap-4 rounded-2xl bg-transparent px-4 pb-3 hidden md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const content = (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        ref={ref}
        style={{ width, height }}
        className="relative flex aspect-square items-center justify-center rounded-full bg-neutral-800 cursor-pointer"
        onClick={onClick ? () => onClick() : undefined}
      >
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] text-neutral-300 whitespace-nowrap"
      >
        {title}
      </motion.span>
    </div>
  );

  if (onClick) {
    return content;
  }

  return (
    <a href={href || '#'}>
      {content}
    </a>
  );
}
