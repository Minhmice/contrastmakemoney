"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  CommandIcon,
  InboxIcon,
  Menu01Icon,
  PencilEdit01Icon,
  Share08Icon,
  ToggleOnIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface ToolbarDockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string[];
  badge?: boolean;
  toggle?: boolean;
  onClick?: () => void;
}

interface ToolbarDockProps {
  items?: ToolbarDockItem[];
  className?: string;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SPRING_X = { type: "spring" as const, stiffness: 650, damping: 44, mass: 0.7 };
const SPRING_CLIP = { type: "spring" as const, stiffness: 720, damping: 52, mass: 0.7 };
const COLLAPSE_SPRING = { type: "spring" as const, stiffness: 460, damping: 42, mass: 0.9 };
const ICON_PROPS = { className: "h-full w-full", strokeWidth: 2 } as const;
const HIDDEN_CLIP = "inset(0px 100% 0px 0px round 10px)";
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export const DEFAULT_TOOLBAR_ITEMS: ToolbarDockItem[] = [
  { id: "comment", label: "Bình luận", icon: <HugeiconsIcon icon={BubbleChatIcon} {...ICON_PROPS} />, shortcut: ["C"] },
  { id: "inbox", label: "Hộp thư", icon: <HugeiconsIcon icon={InboxIcon} {...ICON_PROPS} />, badge: true },
  { id: "flags", label: "Feature Flags", icon: <HugeiconsIcon icon={ToggleOnIcon} {...ICON_PROPS} /> },
  { id: "draft", label: "Chế độ nháp", icon: <HugeiconsIcon icon={PencilEdit01Icon} {...ICON_PROPS} /> },
  { id: "share", label: "Chia sẻ", icon: <HugeiconsIcon icon={Share08Icon} {...ICON_PROPS} /> },
  { id: "menu", label: "Công cụ", icon: <HugeiconsIcon icon={Menu01Icon} {...ICON_PROPS} />, toggle: true },
];

function offsetLeftWithin(el: HTMLElement | null, ancestor: HTMLElement | null) {
  let x = 0;
  let node = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return x;
}

export function ToolbarDock({ items = DEFAULT_TOOLBAR_ITEMS, className, defaultCollapsed = false, onCollapsedChange }: ToolbarDockProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const segRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const visibleRef = React.useRef(false);
  const appearingRef = React.useRef(true);
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, clip: HIDDEN_CLIP });
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [metrics, setMetrics] = React.useState<{ strip: number; footprint: number } | null>(null);
  const reduceMotion = useReducedMotion();


  useIsoLayoutEffect(() => {
    const measure = () => setMetrics({ strip: stripRef.current?.offsetWidth ?? 0, footprint: wrapperRef.current?.offsetWidth ?? 0 });
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (observer && wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer?.disconnect();
  }, [items]);

  const reveal = React.useCallback((index: number) => {
    const rail = railRef.current;
    const seg = segRefs.current[index];
    const btn = btnRefs.current[index];
    const wrapper = wrapperRef.current;
    if (!rail || !seg || !btn || !wrapper) return;
    const railWidth = rail.offsetWidth || 1;
    const left = seg.offsetLeft;
    const right = railWidth - seg.offsetLeft - seg.offsetWidth;
    const segCenter = offsetLeftWithin(seg, wrapper) + seg.offsetWidth / 2;
    const btnCenter = offsetLeftWithin(btn, wrapper) + btn.offsetWidth / 2;
    appearingRef.current = !visibleRef.current;
    visibleRef.current = true;
    setVisible(true);
    setPos({ x: btnCenter - segCenter, clip: "inset(0px " + (right / railWidth) * 100 + "% 0px " + (left / railWidth) * 100 + "% round 10px)" });
  }, []);

  const hideTooltip = React.useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
  }, []);
  const handleItem = React.useCallback((item: ToolbarDockItem) => {
    if (item.toggle) {
      hideTooltip();
      setCollapsed((current) => {
        const next = !current;
        onCollapsedChange?.(next);
        return next;
      });
      return;
    }
    item.onClick?.();
  }, [hideTooltip, onCollapsedChange]);
  const renderButton = (item: ToolbarDockItem, index: number) => {
    const isToggle = Boolean(item.toggle);
    return <button key={item.id} ref={(element) => { btnRefs.current[index] = element; }} type="button" data-toolbar-dock-toggle={isToggle ? "" : undefined} aria-expanded={isToggle ? !collapsed : undefined} aria-label={isToggle ? (collapsed ? "Mở Công cụ" : "Đóng Công cụ") : item.label} tabIndex={!isToggle && collapsed ? -1 : undefined} onClick={() => handleItem(item)} onMouseEnter={() => reveal(index)} onFocus={() => reveal(index)} className="toolbar-dock__button"><span className="toolbar-dock__icon" aria-hidden="true">{item.icon}</span>{item.badge ? <span className="toolbar-dock__badge" aria-hidden="true" /> : null}<span className="sr-only">{item.label}</span></button>;
  };

  const indexed = items.map((item, index) => ({ item, index }));
  const iconEntries = indexed.filter(({ item }) => !item.toggle);
  const toggleEntries = indexed.filter(({ item }) => item.toggle);
  const appearing = appearingRef.current;
  const motionTransition = reduceMotion ? { opacity: { duration: 0.12 } } : { opacity: { duration: 0.18 }, transform: appearing ? { duration: 0 } : SPRING_X, clipPath: appearing ? { duration: 0 } : SPRING_CLIP };

  return <div ref={wrapperRef} style={metrics ? { width: metrics.footprint } : undefined} className={cn("toolbar-dock", className)}>
    <div className="toolbar-dock__tooltip-wrap" aria-hidden="true"><motion.div ref={railRef} initial={false} animate={{ transform: "translateX(" + pos.x + "px)", clipPath: reduceMotion ? "inset(0px 0px 0px 0px round 10px)" : pos.clip, opacity: visible ? 1 : 0 }} transition={motionTransition} style={{ willChange: "transform, clip-path, opacity" }} className="toolbar-dock__tooltip">{items.map((item, index) => <div key={item.id} ref={(element) => { segRefs.current[index] = element; }} className="toolbar-dock__tooltip-segment"><div className="toolbar-dock__tooltip-label">{item.label}{item.shortcut ? <span className="toolbar-dock__shortcut">{item.shortcut.map((key, shortcutIndex) => <kbd key={shortcutIndex}>{key === "⌘" ? <HugeiconsIcon icon={CommandIcon} size={12} strokeWidth={2} /> : key}</kbd>)}</span> : null}</div></div>)}</motion.div></div>
    <div className="toolbar-dock__pill" onMouseLeave={hideTooltip} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) hideTooltip(); }}>
      <motion.div className="toolbar-dock__strip" initial={false} animate={metrics ? { width: collapsed ? 0 : metrics.strip, opacity: collapsed ? 0 : 1 } : undefined} style={metrics ? undefined : { width: "auto" }} transition={reduceMotion ? { width: { duration: 0 }, opacity: { duration: 0 } } : { width: COLLAPSE_SPRING, opacity: { duration: 0.18 } }}><div ref={stripRef} className="toolbar-dock__strip-content">{iconEntries.map(({ item, index }) => renderButton(item, index))}</div></motion.div>
      {toggleEntries.map(({ item, index }) => <div key={item.id} className="toolbar-dock__toggle">{renderButton(item, index)}</div>)}
    </div>
  </div>;
}

export default ToolbarDock;
