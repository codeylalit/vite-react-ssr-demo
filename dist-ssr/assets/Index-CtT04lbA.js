import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Globe, CheckCircle, Users, BarChart3, Clock, Map, Compass, Building, Sparkles, Heart, Crown, Medal, Trophy, Target, Zap, Brain, ExternalLink, Award, Github, MessageSquare, Twitter, Mic, Volume2, Infinity, ArrowRight, Cpu, Shield, Calculator, Code, ChevronRight, Check, Circle, ChevronDown, Menu } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "h3",
    {
      ref,
      className: cn("text-2xl font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const DialogContentWithoutClose = React__default.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsx(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children
    }
  )
] }));
DialogContentWithoutClose.displayName = "DialogContentWithoutClose";
const parseSpeakers = (val) => {
  var _a;
  const m = val.match(/([\d.]+)\s*([MBK]?)/i);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const suffix = (_a = m[2]) == null ? void 0 : _a.toUpperCase();
  switch (suffix) {
    case "B":
      return num * 1e9;
    case "M":
      return num * 1e6;
    case "K":
      return num * 1e3;
    default:
      return num;
  }
};
const formatSpeakers = (count) => {
  if (count >= 1e9) {
    return `${(count / 1e9).toFixed(1)}B`;
  } else if (count >= 1e6) {
    return `${(count / 1e6).toFixed(1)}M`;
  } else if (count >= 1e3) {
    return `${(count / 1e3).toFixed(1)}K`;
  }
  return count.toString();
};
const calculateCoveragePercentage = (speakers) => {
  const percentage = speakers / 8e9 * 100;
  return `${percentage.toFixed(1)}%`;
};
const convertToLanguage = (lang) => {
  const flagMap = {
    en: "🇺🇸",
    "en-GB": "🇬🇧",
    hi: "🇮🇳",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    zh: "🇨🇳",
    ja: "🇯🇵",
    ko: "🇰🇷",
    ar: "🇸🇦",
    pt: "🇵🇹",
    ru: "🇷🇺",
    it: "🇮🇹",
    nl: "🇳🇱",
    sv: "🇸🇪",
    no: "🇳🇴",
    da: "🇩🇰",
    fi: "🇫🇮",
    pl: "🇵🇱",
    tr: "🇹🇷",
    he: "🇮🇱",
    th: "🇹🇭",
    vi: "🇻🇳",
    id: "🇮🇩",
    ms: "🇲🇾",
    tl: "🇵🇭",
    ur: "🇵🇰",
    bn: "🇧🇩",
    ta: "🇮🇳",
    te: "🇮🇳",
    ml: "🇮🇳",
    kn: "🇮🇳",
    gu: "🇮🇳",
    or: "🇮🇳",
    pa: "🇮🇳",
    as: "🇮🇳",
    mr: "🇮🇳",
    ne: "🇳🇵",
    si: "🇱🇰",
    my: "🇲🇲",
    km: "🇰🇭",
    lo: "🇱🇦",
    ka: "🇬🇪",
    am: "🇪🇹",
    sw: "🇰🇪",
    ha: "🇳🇬",
    yo: "🇳🇬",
    ig: "🇳🇬",
    zu: "🇿🇦",
    xh: "🇿🇦",
    af: "🇿🇦",
    default: "🌍"
  };
  return {
    code: lang.code,
    name: lang.name,
    native: lang.native,
    region: lang.region,
    flag: flagMap[lang.code] || flagMap["default"],
    speakers: lang.speakers,
    isAvailable: lang.status === "available"
  };
};
const useFormattedCounterAnimation = (targetValue, duration = 1e3) => {
  const [currentValue, setCurrentValue] = React__default.useState("0");
  React__default.useEffect(() => {
    const extractNumber = (str) => {
      const match = str.match(/^([\d.]+)([KMBT]?)$/);
      if (match) {
        return { number: parseFloat(match[1]), suffix: match[2] };
      }
      const percentMatch = str.match(/^([\d.]+)%$/);
      if (percentMatch) {
        return { number: parseFloat(percentMatch[1]), suffix: "%" };
      }
      const numericValue = parseFloat(str);
      if (!isNaN(numericValue)) {
        return { number: numericValue, suffix: "" };
      }
      return { number: 0, suffix: "" };
    };
    const target = extractNumber(targetValue);
    if (target.number === 0 && targetValue !== "0" && !targetValue.includes("0")) {
      setCurrentValue(targetValue);
      return;
    }
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(target.number * easeOut);
      let formattedValue;
      if (target.suffix === "%") {
        formattedValue = `${currentNumber.toFixed(1)}%`;
      } else if (target.suffix) {
        formattedValue = `${currentNumber}${target.suffix}`;
      } else {
        formattedValue = currentNumber.toString();
      }
      setCurrentValue(formattedValue);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);
  return currentValue;
};
const AnimatedLanguagePill = React__default.memo(({ lang, delay, isAvailable, onLanguageSelect, onClose }) => {
  const [isClicked, setIsClicked] = React__default.useState(false);
  const handleClick = useCallback(() => {
    if (onLanguageSelect && isAvailable) {
      setIsClicked(true);
      onLanguageSelect(convertToLanguage(lang));
      setTimeout(() => {
        setIsClicked(false);
        if (onClose) {
          onClose();
        }
      }, 600);
    }
  }, [lang, isAvailable, onLanguageSelect, onClose]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `group inline-flex items-center space-x-2 sm:space-x-3 px-3 py-3 sm:px-4 sm:py-3 rounded-lg border transition-all duration-300 ease-out min-h-[48px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${isAvailable ? `border-purple-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${isClicked ? "success-selected" : ""}` : "border-gray-200/50 bg-white/60 backdrop-blur-sm shadow-sm opacity-75 hover:opacity-90 active:opacity-80"}`,
      style: {
        animationDelay: `${delay}ms`,
        transform: "translateY(20px) scale(0.9)",
        opacity: 0,
        animation: "fadeInUp 400ms ease-out forwards"
      },
      tabIndex: 0,
      role: "button",
      "aria-label": `${lang.native} (${lang.name}) - ${lang.speakers} speakers, ${lang.script} script${isAvailable ? ", click to select" : ", coming soon"}`,
      onKeyDown: handleKeyDown,
      onClick: handleClick,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm sm:text-base text-gray-900 truncate", children: lang.native }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 truncate", children: lang.name })
        ] }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shrink-0 transition-all duration-200",
            children: lang.script
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-gray-600 whitespace-nowrap shrink-0", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 mr-1" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatSpeakers(parseSpeakers(lang.speakers)) })
        ] })
      ]
    }
  );
});
const StatisticsCard = ({ title, value, subtitle, icon, gradient = false, colorTheme = "purple" }) => {
  const animatedValue = useFormattedCounterAnimation(value, 1200);
  const displayValue = animatedValue;
  const colorClasses = {
    green: {
      gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200/50"
    },
    blue: {
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200/50"
    },
    purple: {
      gradient: "bg-gradient-to-r from-purple-500 to-blue-600",
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200/50"
    },
    orange: {
      gradient: "bg-gradient-to-r from-orange-500 to-red-600",
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200/50"
    }
  };
  const colors = colorClasses[colorTheme];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `group bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `p-3 rounded-xl shadow-sm ${gradient ? colors.gradient : colors.bg} transition-transform duration-300 group-hover:scale-110`,
              children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 sm:w-6 sm:h-6 ${gradient ? "text-white" : colors.text}`, children: icon })
            }
          ),
          gradient && /* @__PURE__ */ jsx("div", { className: "w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-60" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `text-2xl sm:text-3xl font-bold mb-3 leading-tight transition-all duration-300 ${gradient ? "bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent" : "text-gray-900"}`,
            children: displayValue
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm sm:text-base font-semibold text-gray-700", children: title }),
          /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-500 leading-relaxed", children: subtitle })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `mt-4 h-1 rounded-full bg-gradient-to-r ${gradient ? colors.gradient : `${colors.bg} opacity-30`} transition-all duration-300 group-hover:h-1.5`
          }
        )
      ]
    }
  );
};
const SectionHeader = ({ title, icon, count, isAvailable }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b-2 border-gradient-to-r from-purple-100 to-blue-100", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 sm:space-x-5", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `p-3 sm:p-4 rounded-xl shadow-lg ${isAvailable ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-orange-500 to-red-500"}`,
        children: /* @__PURE__ */ jsx("div", { className: "text-white w-6 h-6 sm:w-7 sm:h-7", children: icon })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl sm:text-2xl font-bold text-gray-900", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm sm:text-base text-gray-600 font-medium", children: [
        count,
        " languages available"
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx(
    Badge,
    {
      variant: isAvailable ? "default" : "secondary",
      className: `px-4 py-2 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-md ${isAvailable ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800" : "bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800"} text-white border-0 transition-all duration-200 hover:scale-105`,
      children: count
    }
  ) })
] });
const LanguageRegionModal = ({
  isOpen,
  onClose,
  region,
  onLanguageSelect
}) => {
  const processedData = useMemo(() => {
    if (!region) return null;
    const sorted = [...region.languages].sort(
      (a, b) => parseSpeakers(b.speakers) - parseSpeakers(a.speakers)
    );
    const available2 = sorted.filter((l) => l.status === "available");
    const comingSoon2 = sorted.filter((l) => l.status !== "available");
    const availableSpeakers2 = available2.reduce(
      (sum, lang) => sum + parseSpeakers(lang.speakers),
      0
    );
    const comingSoonSpeakers2 = comingSoon2.reduce(
      (sum, lang) => sum + parseSpeakers(lang.speakers),
      0
    );
    const totalSpeakers2 = availableSpeakers2 + comingSoonSpeakers2;
    const topAvailable2 = available2[0];
    const topComingSoon2 = comingSoon2[0];
    return {
      available: available2,
      comingSoon: comingSoon2,
      availableSpeakers: availableSpeakers2,
      comingSoonSpeakers: comingSoonSpeakers2,
      totalSpeakers: totalSpeakers2,
      topAvailable: topAvailable2,
      topComingSoon: topComingSoon2
    };
  }, [region]);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleClose]);
  if (!region || !processedData) return null;
  const {
    available,
    comingSoon,
    availableSpeakers,
    comingSoonSpeakers,
    totalSpeakers,
    topAvailable,
    topComingSoon
  } = processedData;
  const regionColorMap = {
    "Indic": "bg-gradient-to-r from-orange-100 to-red-100 border-orange-200/50",
    "Asian": "bg-gradient-to-r from-green-100 to-blue-100 border-green-200/50",
    "European": "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200/50",
    "African": "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200/50",
    "Middle Eastern": "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50",
    "North American": "bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-200/50",
    "South American": "bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200/50",
    default: "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200/50"
  };
  const headerColorClass = regionColorMap[region.name] || regionColorMap["default"];
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(
    DialogContentWithoutClose,
    {
      className: "max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-lg border border-purple-200/50 shadow-2xl mx-4 my-4 sm:mx-auto sm:my-8",
      role: "dialog",
      "aria-labelledby": "region-modal-title",
      "aria-describedby": "region-modal-description",
      children: [
        /* @__PURE__ */ jsxs(
          DialogHeader,
          {
            className: `rounded-t-2xl sm:rounded-t-3xl ${headerColorClass} p-4 sm:p-6 text-gray-800 relative overflow-hidden`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/30" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx(
                      DialogTitle,
                      {
                        id: "region-modal-title",
                        className: "text-2xl sm:text-3xl font-bold mb-2 text-gray-900",
                        children: region.name
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        id: "region-modal-description",
                        className: "text-base sm:text-lg max-w-2xl leading-relaxed text-gray-700",
                        children: region.description
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3 sm:ml-4", children: /* @__PURE__ */ jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/60 text-gray-700 backdrop-blur-sm border border-white/50 text-sm",
                      children: [
                        /* @__PURE__ */ jsx(Globe, { className: "w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" }),
                        region.count,
                        " Languages"
                      ]
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xl sm:text-2xl font-bold text-gray-900", children: formatSpeakers(totalSpeakers) }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-700", children: "Total Native Speakers" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xl sm:text-2xl font-bold text-gray-900", children: calculateCoveragePercentage(totalSpeakers) }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-700", children: "Global Population" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50 sm:col-span-2 md:col-span-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xl sm:text-2xl font-bold text-gray-900", children: available.length + comingSoon.length }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-700", children: "Languages Total" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-8 space-y-8 sm:space-y-12", children: [
          available.length > 0 && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "space-y-6 sm:space-y-8",
              style: {
                opacity: 0,
                transform: "translateY(20px)",
                animation: "fadeInUp 600ms ease-out forwards"
              },
              children: [
                /* @__PURE__ */ jsx(
                  SectionHeader,
                  {
                    title: "Available Languages",
                    icon: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }),
                    count: available.length,
                    isAvailable: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: [
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Available Languages",
                      value: available.length.toString(),
                      subtitle: "Ready to use",
                      icon: /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      gradient: true,
                      colorTheme: "green"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Native Speakers",
                      value: formatSpeakers(availableSpeakers),
                      subtitle: `${calculateCoveragePercentage(availableSpeakers)} of global population`,
                      icon: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      colorTheme: "blue"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Most Spoken",
                      value: (topAvailable == null ? void 0 : topAvailable.native) || "N/A",
                      subtitle: `${topAvailable ? formatSpeakers(parseSpeakers(topAvailable.speakers)) : "0"} speakers`,
                      icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      colorTheme: "purple"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: available.map((lang, index) => /* @__PURE__ */ jsx(
                  AnimatedLanguagePill,
                  {
                    lang,
                    delay: index * 50,
                    isAvailable: true,
                    onLanguageSelect,
                    onClose: handleClose
                  },
                  lang.code
                )) })
              ]
            }
          ),
          available.length > 0 && comingSoon.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 my-8" }),
          comingSoon.length > 0 && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "space-y-6 sm:space-y-8",
              style: {
                opacity: 0,
                transform: "translateY(20px)",
                animation: "fadeInUp 600ms ease-out forwards",
                animationDelay: "300ms"
              },
              children: [
                /* @__PURE__ */ jsx(
                  SectionHeader,
                  {
                    title: "Coming Soon",
                    icon: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }),
                    count: comingSoon.length,
                    isAvailable: false
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: [
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Coming Soon",
                      value: comingSoon.length.toString(),
                      subtitle: "In development",
                      icon: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      colorTheme: "orange"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Native Speakers",
                      value: formatSpeakers(comingSoonSpeakers),
                      subtitle: `${calculateCoveragePercentage(comingSoonSpeakers)} of global population`,
                      icon: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      colorTheme: "blue"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    StatisticsCard,
                    {
                      title: "Most Spoken",
                      value: (topComingSoon == null ? void 0 : topComingSoon.native) || "N/A",
                      subtitle: `${topComingSoon ? formatSpeakers(parseSpeakers(topComingSoon.speakers)) : "0"} speakers`,
                      icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
                      colorTheme: "purple"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: comingSoon.map((lang, index) => /* @__PURE__ */ jsx(
                  AnimatedLanguagePill,
                  {
                    lang,
                    delay: (available.length + index) * 50,
                    isAvailable: false,
                    onLanguageSelect,
                    onClose: handleClose
                  },
                  lang.code
                )) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes modalEntrance {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(-50%) scale(1);
            }
          }



          /* Apply modal entrance animation */
          [data-state="open"] {
            animation: modalEntrance 300ms ease-out;
          }



          /* Success selection animation */
          @keyframes successPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }

          .success-selected {
            animation: successPulse 600ms ease-out;
            border-color: rgba(34, 197, 94, 0.5) !important;
            background-color: rgba(34, 197, 94, 0.05) !important;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.1ms !important;
              animation-delay: 0ms !important;
              transition-duration: 0.1ms !important;
            }
          }
        ` })
      ]
    }
  ) });
};
const csvData = `Region,Language Name (Native),[EN] Name,Code,Native Speakers (M),Status,Sample Text,Script\r
Indic,असमীয়া,Assamese,as,15,Coming Soon,সকলো শূন্যৰ পৰা আৰম্ভ হয়,Bengali\r
Indic,अवधी,Awadhi,awa,38,Available,सब कुछ शून्य से शुरू होता है,Devanagari\r
Indic,বাংলা (India),Bengali (India),bn-IN,98,Available,সবকিছু শূন্য থেকে শুরু হয়,Bengali\r
Indic,বাংলা (Bangladesh),Bengali (Bangladesh),bn-BD,165,Available,সবকিছু শূন্য থেকে শুরু হয়,Bengali\r
Indic,भोजपुरी,Bhojpuri,bho,52,Available,सब कुछ शून्य से शुरू होला,Devanagari\r
Indic,बोडो,Bodo,brx,1.4,Available,गाब सोमोन्दों गाहाय गोनांथाय,Devanagari\r
Indic,छत्तीसगढ़ी,Chhattisgarhi,hne,18,Available,जम्मो चीज हा सुन्ना ले सुरु होथे,Devanagari\r
Indic,डोगरी,Dogri,doi,2.3,Available,सब कुछ शून्य थमां शुरू होंदा,Devanagari\r
Indic,गारो,Garo,grt,1.2,Available,Sobokchi shunya ni shuru hoba,Latin\r
Indic,गोंडी,Gondi,gon,3,Available,लगा वस्तु शून्य ले शुरू होता,Devanagari\r
Indic,ગુજરાતી,Gujarati,gu,56,Coming Soon,બધું શૂન્યથી શરૂ થાય છે,Gujarati\r
Indic,हरियाणवी,Haryanvi,bgc,10,Available,सब कुछ जिओ तै शुरू हो सै,Devanagari\r
Indic,हिन्दी,Hindi,hi,600,Available,सब कुछ शून्य से शुरू होता है,Devanagari\r
Indic,हो,Ho,hoc,1.1,Available,Sabkuch shunya te shuru hovea,Latin\r
Indic,ಕನ್ನಡ,Kannada,kn,44,Available,ಎಲ್ಲವೂ ಶೂನ್ಯದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ,Kannada\r
Indic,कश्मीरी,Kashmiri,ks,7,Available,सब कुछ शून्य पेठ शुरू गछि,Devanagari\r
Indic,খাসি,Khasi,kha,1.4,Available,Bari lajong shunya jinge shuru nanga,Latin\r
Indic,खोंड,Khond,kxv,1.8,Available,सबकुछ शून्य ले शुरू होता,Devanagari\r
Indic,कोंकणी,Konkani,kok,2.3,Available,सगळें शून्यांतल्यान सुरू जाता,Devanagari\r
Indic,मगही,Magahi,mag,21,Available,सब कुछ शून्य से शुरू होवे,Devanagari\r
Indic,मैथिली,Maithili,mai,34,Available,सब किछु शून्य सं शुरू होइत अछि,Devanagari\r
Indic,മലയാളം,Malayalam,ml,35,Coming Soon,എല്ലാം പൂജ്യത്തിൽ നിന്നും ആരംഭിക്കുന്നു,Malayalam\r
Indic,মণিপুরী,Manipuri,mni,1.8,Coming Soon,পুম্নমক শূন্য দগী হৌরকই,Bengali\r
Indic,मराठी,Marathi,mr,83,Available,सर्वकाही शून्यापासून सुरू होते,Devanagari\r
Indic,मारवाड़ी,Marwari,mwr,22,Available,सगळी बातां सुन्न सूं सरू व्है,Devanagari\r
Indic,मिजो,Mizo,lus,1.1,Available,engkim chu zero atanga tan a ni,Latin\r
Indic,मुंडारी,Mundari,unr,1.2,Available,सबकुछ शून्य ले शुरू होता,Devanagari\r
Indic,नेपाली (Nepal),Nepali,ne,16,Available,सबै कुरा शून्यबाट सुरु हुन्छ,Devanagari\r
Indic,ଓଡ଼ିଆ,Odia,or,38,Coming Soon,ସବୁକିଛି ଶୂନ୍ୟରୁ ଆରମ୍ଭ ହୁଏ,Odia\r
Indic,ਪੰਜਾਬੀ,Punjabi,pa,113,Coming Soon,ਸਭ ਕੁਝ ਜ਼ੀਰੋ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ,Gurmukhi\r
Indic,राजस्थानी,Rajasthani,raj,26,Available,सब कुछ शून्य सूं शुरू होवे,Devanagari\r
Indic,संताली,Santali,sat,7.6,Available,सबकुछ शून्य ले शुरू होता,Devanagari\r
Indic,सिन्धी,Sindhi,sd,25,Available,سڀ ڪجهه صفر کان شروع ٿئي ٿو,Arabic\r
Indic,தமிழ்,Tamil,ta,75,Available,அனைத்தும் பூஜ்ஜியத்திலிருந்து தொடங்குகிறது,Tamil\r
Indic,తెలుగు,Telugu,te,82,Coming Soon,అన్నీ సున్నా నుండి మొదలవుతాయి,Telugu\r
Indic,ತुळು,Tulu,tcy,2,Available,ಎಲ್ಲಾವೂ ಸೊನ್ನೆದ್ದ್ ಶುರುವಾವುಂಡು,Kannada\r
Indic,اردو,Urdu,ur,70,Available,سب کچھ صفر سے شروع ہوتا ہے,Arabic\r
Indic,बघेली,Bagheli,bfy,8,Available,सब कुछ शून्य से शुरू होत है,Devanagari\r
Indic,ਭਾਸ਼ਾ (Malvi),Malvi,mup,5.2,Available,सब कुछ सिफर से शुरू होवे है,Gurmukhi\r
European,English (Global),English,en,1530,Available,Everything starts from Zero,Latin\r
European,English UK,English UK,en-GB,60,Available,Everything starts from Zero,Latin\r
European,English US,English US,en-US,230,Available,Everything starts from Zero,Latin\r
European,English India,English India,en-IN,125,Available,Everything starts from Zero,Latin\r
European,English Australia,English Australia,en-AU,17,Available,Everything starts from Zero,Latin\r
European,English Canada,English Canada,en-CA,20,Available,Everything starts from Zero,Latin\r
European,English South Africa,English South Africa,en-ZA,4.9,Available,Everything starts from Zero,Latin\r
European,English New Zealand,English New Zealand,en-NZ,3.8,Available,Everything starts from Zero,Latin\r
European,English Ireland,English Ireland,en-IE,4.2,Available,Everything starts from Zero,Latin\r
European,Français (Global),French,fr,312,Available,Tout commence à partir de zéro,Latin\r
European,Français (France),French (France),fr-FR,67,Available,Tout commence à partir de zéro,Latin\r
European,Français (Canada),French (Canada),fr-CA,7.2,Available,Tout commence à partir de zéro,Latin\r
European,Français (Belgium),French (Belgium),fr-BE,4.2,Available,Tout commence à partir de zéro,Latin\r
European,Français (Switzerland),French (Switzerland),fr-CH,2,Available,Tout commence à partir de zéro,Latin\r
European,Français (Africa),French (Africa),fr-AF,120,Available,Tout commence à partir de zéro,Latin\r
European,Deutsch,German,de,95,Available,Alles beginnt bei Null,Latin\r
European,Italiano,Italian,it,65,Available,Tutto inizia da zero,Latin\r
European,Español (Global),Spanish,es,558,Available,Todo comienza desde cero,Latin\r
European,Español (Spain),Spanish (Spain),es-ES,47,Available,Todo comienza desde cero,Latin\r
European,Português (Global),Portuguese,pt,267,Available,Tudo começa do zero,Latin\r
European,Português (Brazilian),Portuguese (Brazil),pt-BR,215,Available,Tudo começa do zero,Latin\r
European,Português (European),Portuguese (Europe),pt-PT,10,Available,Tudo começa do zero,Latin\r
European,Português (African),Portuguese (Africa),pt-AF,35,Available,Tudo começa do zero,Latin\r
European,Русский,Russian,ru,150,Available,Всё начинается с нуля,Cyrillic\r
European,Polski,Polish,pl,40,Available,Wszystko zaczyna się od zera,Latin\r
European,Nederlands,Dutch,nl,24,Available,Alles begint bij nul,Latin\r
European,Svenska,Swedish,sv,10,Available,Allt börjar från noll,Latin\r
European,Norsk (Bokmål),Norwegian (Bokmål),no,4.5,Available,Alt starter fra null,Latin\r
European,Dansk,Danish,da,6,Available,Alt starter fra nul,Latin\r
European,Suomi,Finnish,fi,5.4,Available,Kaikki alkaa nollasta,Latin\r
European,Magyar,Hungarian,hu,13,Available,Minden nulláról kezdődik,Latin\r
European,Čeština,Czech,cs,10.7,Available,Vše začína od nuly,Latin\r
European,Slovenčina,Slovak,sk,5.2,Available,Všetko sa začína od nuly,Latin\r
European,Slovenščina,Slovenian,sl,2.5,Available,Vse se začne z nič,Latin\r
European,Hrvatski,Croatian,hr,5,Available,Sve počinje od nule,Latin\r
European,Srpski,Serbian,sr,9,Available,Све почиње од нуле,Cyrillic\r
European,Български,Bulgarian,bg,8,Available,Всичко започва от нула,Cyrillic\r
European,Română,Romanian,ro,24,Available,Totul începe de la zero,Latin\r
European,Ελληνικά,Greek,el,13.5,Available,Όλα ξεκινούν από το μηδέν,Greek\r
European,Lietuvių,Lithuanian,lt,3,Available,Viskas prasideda nuo nulio,Latin\r
European,Latviešu,Latvian,lv,1.9,Available,Viss sākas no nulles,Latin\r
European,Eesti,Estonian,et,1.1,Available,Kõik algab nullist,Latin\r
European,Albanian,Albanian,sq,7.6,Available,Gjithçka fillon nga zero,Latin\r
European,Македонски,Macedonian,mk,2.1,Available,Сè почнува од нула,Cyrillic\r
European,Беларуская,Belarusian,be,5.1,Available,Усё пачынаецца з нуля,Cyrillic\r
European,Українська,Ukrainian,uk,40,Available,Все начинається з нуля,Cyrillic\r
European,Moldovenească,Moldovan,mo,2.6,Available,Totul începe de la zero,Latin\r
European,Català,Catalan,ca,10,Available,Tot comença des de zero,Latin\r
European,Euskera,Basque,eu,1.2,Available,Dena zerotik hasten da,Latin\r
European,Galego,Galician,gl,2.4,Available,Todo comeza desde cero,Latin\r
European,Cymraeg,Welsh,cy,0.9,Available,Mae popeth yn dechrau o sero,Latin\r
European,Gaeilge,Irish,ga,1.7,Available,Tosaíonn gach rud ó náid,Latin\r
European,Occitan,Occitan,oc,0.8,Available,Tot comença de zèro,Latin\r
European,Sardinian,Sardinian,sc,1.35,Available,Totu cumintzat dae tzeru,Latin\r
European,Plattdüütsch (Low German),Low German,nds,5,Available,Allens fangt bi Null an,Latin\r
European,Boarisch (Bavarian),Bavarian,bar,14,Available,Ois fongt bei Nui o,Latin\r
European,Siçilianu (Sicilian),Sicilian,scn,5,Available,Tuttu accuminza di zeru,Latin\r
European,Napulitano (Neapolitan),Neapolitan,nap,5.7,Available,Tutte cose accummincia a zzero,Latin\r
Asian,中文 (Global),Chinese (Global),zh,1184,Available,一切从零开始,Chinese\r
Asian,中文 (Mandarin),Chinese (Mandarin),zh-CN,918,Available,一切从零开始,Chinese\r
Asian,中文 (Cantonese),Chinese (Cantonese),zh-HK,84,Available,一切從零開始,Chinese\r
Asian,中文 (Wu),Chinese (Wu),wuu,81,Available,一切从零开始,Chinese\r
Asian,中文 (Min),Chinese (Min),nan,70,Available,一切從零開始,Chinese\r
Asian,中文 (Hakka),Chinese (Hakka),hak,48,Available,一切從零開始,Chinese\r
Asian,日本語,Japanese,ja,125,Available,すべてはゼロから始まる,Japanese\r
Asian,한국어,Korean,ko,82,Available,모든 것은 제로부터 시작한다,Korean\r
Asian,Tiếng Việt,Vietnamese,vi,85,Available,Mọi thứ đều bắt đầu từ số không,Latin\r
Asian,ไทย,Thai,th,71,Available,ทุกอย่างเริ่มต้นจากศูนย์,Thai\r
Asian,Bahasa Indonesia,Indonesian,id,199,Available,Semua dimulai dari nol,Latin\r
Asian,Bahasa Melayu,Malay,ms,19,Available,Segala-galanya bermula dari sifar,Latin\r
Asian,Tagalog,Tagalog,tl,28,Available,Lahat ay nagsisimula sa zero,Latin\r
Asian,Cebuano,Cebuano,ceb,22,Available,Ang tanan nagsugod sa zero,Latin\r
Asian,Hiligaynon,Hiligaynon,hil,9,Available,Ang tanan nagasugod sa zero,Latin\r
Asian,Waray,Waray,war,3.1,Available,An ngatanan nagsusugod ha zero,Latin\r
Asian,Bikol,Bikol,bcl,2.5,Available,Gabos nagsisimula sa zero,Latin\r
Asian,Pangasinan,Pangasinan,pag,1.2,Available,Amin agumpisa ed zero,Latin\r
Asian,Kapampangan,Kapampangan,pam,2.9,Available,Ngan umpisa king zero,Latin\r
Asian,Ilocano,Ilocano,ilo,9.1,Available,Amin mangrugi iti zero,Latin\r
Asian,Javanese,Javanese,jv,69,Available,Kabeh wiwit saka nol,Latin\r
Asian,ລາວ,Lao,lo,7,Coming Soon,ທຸກຢ່າງເລີ່ມຕົ້ນຈາກສູນ,Lao\r
Asian,ខ្មែរ,Khmer,km,16,Coming Soon,អ្វីៗទាំងអស់ចាប់ផ្តើមពីសូន្យ,Khmer\r
Asian,မြန်မာ,Burmese,my,37,Coming Soon,အားလုံးသည် သုညမှ စတင်သည်,Myanmar\r
Asian,မန်,Mon,mnw,1.1,Coming Soon,အားလုံးသည် သုညမှ စတင်သည်,Mon\r
Asian,ရှမ်း,Shan,shn,5.2,Coming Soon,တူမွေးလူး သုညမွေ တွင်ယူ,Myanmar\r
Asian,བོད་སྐད,Tibetan,bo,1.2,Coming Soon,ཐམས་ཅད་ཀླད་ཀོར་ནས་འགོ་བཙུགས་པ་རེད།,Tibetan\r
Asian,Монгол,Mongolian,mn,5.7,Available,Бүх зүйл тэгээс эхэлдэг,Cyrillic\r
Asian,Hmong,Hmong,hmn,4.2,Available,Txhua yam pib los ntawm xoom,Latin\r
Asian,Mien,Mien,ium,2.7,Available,Buangh nyei biauv ndorm nyungc,Latin\r
Asian,Tok Pisin,Tok Pisin,tpi,5.4,Available,Olgeta samting i stat long sero,Latin\r
Asian,සිංහල,Sinhala,si,17,Coming Soon,සියල්ල ශුන්‍යයෙන් ආරම්භ වේ,Sinhala\r
Asian,Nepali (Nepal),Nepali,ne,16,Available,सबै कुरा शून्यबाट सुरु हुन्छ,Devanagari\r
Asian,Dzongkha,Dzongkha,dz,1.7,Coming Soon,ཐམས་ཅད་ཀླད་ཀོར་ནས་འགོ་བཙུགས།,Tibetan\r
Asian,Fijian,Fijian,fj,1.4,Available,Na kece kila mai na saiva,Latin\r
Asian,Tetum,Tetum,tet,1.2,Available,Buat hotu hahuu husi zero,Latin\r
Asian,Basa Sunda (Sundanese),Sundanese,su,42,Available,Sagalana dimimitian ti enol,Latin\r
Asian,Madurese,Madurese,mad,13,Available,Sadajana emmolai dhari nòl,Latin\r
Asian,贛語,Gan Chinese,gan,22,Available,一切从零开始,Chinese\r
Asian,湘语,Xiang Chinese,hsn,38,Available,一切从零开始,Chinese\r
Asian,Buginese,Buginese,bug,5,Available,Sininna na pu'adai ri olo,Lontara\r
Asian,Acehnese,Acehnese,ace,3.5,Available,Bandum geutanyoe meuphom dari nol,Latin\r
African,Kiswahili,Swahili,sw,16,Available,Kila kitu huanza kutoka sifuri,Latin\r
African,Amharic,Amharic,am,57,Coming Soon,ሁሉም ነገር ከዜሮ ይጀምራል,Ethiopic\r
African,Oromo,Oromo,om,37,Available,Wanti hundi zeeroo irraa eegala,Latin\r
African,Tigrinya,Tigrinya,ti,7,Coming Soon,ኩሉ ነገር ካብ ዜሮ ይጅምር,Ethiopic\r
African,Somali,Somali,so,21.8,Available,Wax waliba waxay ka bilaabmaan eber,Latin\r
African,Hausa,Hausa,ha,70,Available,Komai yana farawa daga sifili,Latin\r
African,Yoruba,Yoruba,yo,45,Available,Ohun gbogbo bẹrẹ lati odo,Latin\r
African,Igbo,Igbo,ig,27,Available,Ihe niile na-amalite site na efu,Latin\r
African,Fulani,Fulani,ff,40,Available,Fof kala fuɗɗii e nder kala,Latin\r
African,Akan,Akan,ak,11,Available,Biribiara fi nkwa mu fi ase,Latin\r
African,Twi,Twi,tw,17,Available,Biribiara fi nkwa mu fi ase,Latin\r
African,Ewe,Ewe,ee,6.8,Available,Nu sia nu katã dzea egome tso ɖiɖi me,Latin\r
African,Ga,Ga,gaa,3.2,Available,Nuu kpakpa kɛ ni otu lɛ kɛkɛ,Latin\r
African,Wolof,Wolof,wo,12,Available,Lép nekk dafay jëkk ci tundu,Latin\r
African,Mandinka,Mandinka,mnk,2.4,Available,Feŋo bee ka daminandi ka bo konkoo la,Latin\r
African,Bambara,Bambara,bm,14,Available,Fɛn bɛɛ bɛ daminɛ ka bɔ foyi la,Latin\r
African,Lingala,Lingala,ln,15,Available,Biloko nyonso ebandaka na zéro,Latin\r
African,Kikongo,Kikongo,kg,10,Available,Mambu monso mabandaka na zéro,Latin\r
African,Kinyarwanda,Kinyarwanda,rw,12,Available,Ibintu byose bitangira kuri zeru,Latin\r
African,Kirundi,Kirundi,rn,13,Available,Ibintu vyose vitangura kuri zeru,Latin\r
African,Luganda,Luganda,lg,5.6,Available,Buli kintu kitandikira ku zeru,Latin\r
African,Luo,Luo,luo,5.3,Available,Gik moko duto chakore gi onge,Latin\r
African,Kikuyu,Kikuyu,ki,8.1,Available,Maũndũ mothe maambĩrĩria na kĩhũũ,Latin\r
African,Shona,Shona,sn,14.2,Available,Chinhu chose chinotanga pazero,Latin\r
African,Ndebele,Ndebele,nd,2.1,Available,Konke kuqala ngezero,Latin\r
African,Zulu,Zulu,zu,12,Available,Konke kuqala nge-zero,Latin\r
African,Xhosa,Xhosa,xh,8.2,Available,Yonke into iqala nge-zero,Latin\r
African,Afrikaans,Afrikaans,af,7,Available,Alles begin by nul,Latin\r
African,Sesotho,Sesotho,st,5.6,Available,Tsohle di qala ho tloha lefelleng,Latin\r
African,Setswana,Tswana,tn,4.1,Available,Tsotlhe di simolola ka lefela,Latin\r
African,isiSwati,Swati,ss,2.3,Available,Konkhe kucala nge-zero,Latin\r
African,Venda,Venda,ve,1.2,Available,Zwothe zwi thoma nga zero,Latin\r
African,Tsonga,Tsonga,ts,4.4,Available,Hinkwaswo swi sungula eka zero,Latin\r
African,Arabic (Maghrebi),Arabic (Maghrebi),ar-MA,75,Available,كل شيء يبدأ من الصفر,Arabic\r
African,Arabic (Chadian),Arabic (Chadian),ar-TD,1.8,Available,كل شيء يبدأ من الصفر,Arabic\r
African,Berber (Tamazight),Berber (Tamazight),ber,30,Available,Kullu shi ibda min sifr,Latin\r
African,Malagasy,Malagasy,mg,18,Available,Ny zavatra rehetra dia manomboka amin'ny aotra,Latin\r
African,Chichewa (Nyanja),Chichewa,ny,12,Available,Chilichonse chimayambira pa ziro,Latin\r
African,Mossi,Mossi,mos,7.6,Available,Fãa fãa sɩngr ne a zeero,Latin\r
African,Bemba,Bemba,bem,4.1,Available,Fyonse fitendekela kuli zero,Latin\r
African,Kamba,Kamba,kam,4.3,Available,Syonthe syambiiia na nthini,Latin\r
African,Kongo,Kongo,kon,5.6,Available,Bima bionsono biatandila ku zero,Latin\r
African,Sango,Sango,sg,2,Available,Aye kue akomanse na zero,Latin\r
African,Wolaytta,Wolaytta,wal,2,Available,Ubbabaykka hinttappe doommees,Ethiopic\r
African,Sidamo,Sidamo,sid,3,Available,Mittu mittu qaaleho higga shollaa,Ethiopic\r
Middle Eastern,العربية (Global),Arabic (Global),ar,422,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Egyptian),Arabic (Egyptian),ar-EG,102,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Gulf),Arabic (Gulf),ar-AE,36,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Levantine),Arabic (Levantine),ar-LB,38,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Moroccan),Arabic (Moroccan),ar-MA,33,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Sudanese),Arabic (Sudanese),ar-SD,28,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,العربية (Iraqi),Arabic (Iraqi),ar-IQ,16,Available,كل شيء يبدأ من الصفر,Arabic\r
Middle Eastern,עברית,Hebrew,he,9,Available,הכל מתחיל מאפס,Hebrew\r
Middle Eastern,فارسی,Persian,fa,62,Available,همه چیز از صفر شروع می‌شود,Arabic\r
Middle Eastern,کوردی (Sorani),Kurdish (Sorani),ckb,8,Available,هەموو شت لە سفرەوە دەست پێدەکات,Arabic\r
Middle Eastern,کوردی (Kurmanji),Kurdish (Kurmanji),kmr,15,Available,Her tişt ji sifirê dest pê dike,Latin\r
Middle Eastern,پښتو,Pashto,ps,60,Available,ټول شیان له صفر څخه پیل کیږي,Arabic\r
Middle Eastern,بلوچی,Balochi,bal,8.8,Available,ہر چیز صفر کنوں شروع بیت,Arabic\r
Middle Eastern,دری,Dari,prs,25,Available,همه چیز از صفر آغاز می‌شود,Arabic\r
Middle Eastern,تاجیک,Tajik,tg,8.4,Available,Ҳама чиз аз сифр оғоз мешавад,Cyrillic\r
Middle Eastern,ئۇيغۇرچە,Uyghur,ug,12,Available,ھەممە ئىش نۆلدىن باشلىنىدۇ,Arabic\r
Middle Eastern,Қазақша,Kazakh,kk,13,Available,Барлығы нөлден басталады,Cyrillic\r
Middle Eastern,Кыргызча,Kyrgyz,ky,4.4,Available,Баары нөлдөн башталат,Cyrillic\r
Middle Eastern,O'zbek,Uzbek,uz,34,Available,Hamma narsa noldan boshlanadi,Latin\r
Middle Eastern,Türkçe,Turkish,tr,88,Available,Her şey sıfırdan başlar,Latin\r
Middle Eastern,Türkmençe,Turkmen,tk,3.4,Available,Hemme zat noldan başlaýar,Latin\r
Middle Eastern,Azərbaycan,Azerbaijani,az,23,Available,Hər şey sıfırdan başlayır,Latin\r
Middle Eastern,Հայերեն,Armenian,hy,6.7,Available,Ամեն ինչ զրոյից է սկսվում,Armenian\r
Middle Eastern,ქართული,Georgian,ka,3.7,Coming Soon,ყველაფერი ნულიდან იწყება,Georgian\r
Middle Eastern,Čečenski,Chechen,ce,1.8,Available,Массо а нулера дуьйцу,Cyrillic\r
South American,Español (Colombian),Spanish (Colombia),es-CO,51,Available,Todo comienza desde cero,Latin\r
South American,Español (Argentinian),Spanish (Argentina),es-AR,45,Available,Todo comienza desde cero,Latin\r
South American,Español (Chilean),Spanish (Chile),es-CL,18,Available,Todo comienza desde cero,Latin\r
South American,"Español (Global, Spain, etc.)",Spanish,es,558,Available,Todo comienza desde cero,Latin\r
South American,Português (Brazilian),Portuguese (Brazil),pt-BR,215,Available,Tudo começa do zero,Latin\r
South American,"Português (Global, African)",Portuguese,pt,267,Available,Tudo começa do zero,Latin\r
South American,Quechua (Runasimi),Quechua,qu,8.9,Available,Tukuy imapas ch'usaqmanta qallarikun,Latin\r
South American,Aymara,Aymara,ay,2.8,Available,Taqi kuna ch'usapatwa qalltarakiwa,Latin\r
South American,Guaraní,Guarani,gn,6.5,Available,Opavavéva oñepyrũ pytũguipa,Latin\r
South American,Haitian Creole,Haitian Creole,ht,12,Available,Tout bagay kòmanse nan zewo,Latin\r
South American,Jamaican Patois,Jamaican Patois,jam,3.2,Available,Evryting staat fram zero,Latin\r
South American,Nahuatl,Nahuatl,nah,1.7,Available,Mochi pehua ipan ahtle,Latin\r
South American,Maya (K'iche'),Maya (K'iche'),quc,2.3,Available,Ronojel ri ri jeqel pa maj,Latin\r
South American,Maya (Q'eqchi'),Maya (Q'eqchi'),kek,1.3,Available,Chixjunil naqataak sa ma'ej,Latin\r
North American,English US,English US,en-US,230,Available,Everything starts from Zero,Latin\r
North American,English Canada,English Canada,en-CA,20,Available,Everything starts from Zero,Latin\r
North American,"English (Global, UK, etc.)",English,en,1530,Available,Everything starts from Zero,Latin\r
North American,Español (Mexican),Spanish (Mexico),es-MX,132,Available,Todo comienza desde cero,Latin\r
North American,Französisch (Canada),French (Canada),fr-CA,7.2,Available,Tout commence à partir de zéro,Latin\r
North American,Haitian Creole,Haitian Creole,ht,12,Available,Tout bagay kòmanse nan zewo,Latin\r
North American,Jamaican Patois,Jamaican Patois,jam,3.2,Available,Evryting staat fram zero,Latin\r
North American,Nahuatl,Nahuatl,nah,1.7,Available,Mochi pehua ipan ahtle,Latin\r
North American,Maya (K'iche'),Maya (K'iche'),quc,2.3,Available,Ronojel ri ri jeqel pa maj,Latin\r
North American,Maya (Q'eqchi'),Maya (Q'eqchi'),kek,1.3,Available,Chixjunil naqataak sa ma'ej,Latin\r
North American,Guaraní,Guarani,gn,6.5,Available,Opavavéva oñepyrũ pytũguipa,Latin`;
function parseLanguageCSV(csvContent) {
  const lines = csvContent == null ? void 0 : csvContent.split(/\r?\n/);
  const regions2 = [];
  const regionMap = {};
  const regionDescriptions = {
    "Indic": "Complete coverage of the Indian subcontinent",
    "Asian": "Comprehensive East & Southeast Asian coverage",
    "European": "From major languages to regional dialects",
    "African": "Celebrating the continent's rich linguistic heritage",
    "Middle Eastern": "Bridge between continents and cultures",
    "North American": "Languages of North America including indigenous varieties",
    "South American": "Languages of South America including indigenous varieties"
  };
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    if (trimmedLine.startsWith("Region,Language Name")) {
      continue;
    }
    const parts = trimmedLine.split(",");
    if (parts.length >= 8) {
      const [region, nativeName, englishName, code, speakers, status, sampleText, script] = parts.map((p) => p.trim());
      if (!code || !englishName || englishName === region) continue;
      const languageStatus = status.toLowerCase().includes("available") ? "available" : "coming-soon";
      if (!regionMap[region]) {
        regionMap[region] = {
          name: region,
          description: regionDescriptions[region] || "Diverse linguistic coverage",
          languages: [],
          count: 0
        };
        regions2.push(regionMap[region]);
      }
      regionMap[region].languages.push({
        code: code.trim(),
        name: englishName.trim(),
        native: nativeName.trim(),
        speakers: speakers.trim() + "M",
        script: script.trim(),
        status: languageStatus,
        sampleText: sampleText.trim() || "Everything starts from zero",
        region
      });
    }
  }
  regions2.forEach((region) => {
    region.count = region.languages.length;
  });
  return regions2;
}
const regions = parseLanguageCSV(csvData);
const languages = (() => {
  const seenLanguageCodes = /* @__PURE__ */ new Set();
  const deduplicatedLanguages = [];
  regions.forEach((region) => {
    region.languages.forEach((language) => {
      if (!seenLanguageCodes.has(language.code)) {
        seenLanguageCodes.add(language.code);
        deduplicatedLanguages.push(language);
      }
    });
  });
  return deduplicatedLanguages;
})();
Array.from(new Set(languages.map((l) => l.script))).sort();
const regionStyles = {
  "Indic": {
    gradient: "from-orange-400 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    icon: Heart
  },
  "Asian": {
    gradient: "from-green-400 to-blue-500",
    bgGradient: "from-green-50 to-blue-50",
    icon: Sparkles
  },
  "European": {
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    icon: Globe
  },
  "African": {
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    icon: Users
  },
  "Middle Eastern": {
    gradient: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    icon: Building
  },
  "North American": {
    gradient: "from-teal-400 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50",
    icon: Compass
  },
  "South American": {
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    icon: Map
  },
  // Default fallback style
  default: {
    gradient: "from-gray-400 to-gray-600",
    bgGradient: "from-gray-50 to-gray-100",
    icon: Globe
  }
};
const LanguageCoverage = ({ onLanguageSelect }) => {
  const [visibleRegions, setVisibleRegions] = useState(
    () => new Array(regions.length).fill(false)
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionsRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from({ length: regions.length }, (_, index) => index).forEach((index) => {
              setTimeout(
                () => {
                  setVisibleRegions((prev) => {
                    const newVisible = [...prev];
                    newVisible[index] = true;
                    return newVisible;
                  });
                },
                reducedMotion ? 0 : index * 20
              );
            });
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px" }
    );
    if (sectionsRef.current) observer.observe(sectionsRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);
  const languageRegions = regions.sort((a, b) => b.languages.length - a.languages.length);
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "languages",
      className: "py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white via-purple-50 to-orange-50",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12 px-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: "Understand Everyone. " }),
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent", children: "Speak to Anyone." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12", children: "Comprehensive speech recognition across 216 languages and dialects." }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200/50 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1", children: "216" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Languages Supported" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1", children: "96.8%" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Global Population Coverage" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1", children: "1M+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Minimum Native Speakers" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { ref: sectionsRef, className: "relative mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Language Regions" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Explore our comprehensive language coverage across the globe" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center", children: languageRegions.map((region, index) => {
            const style = regionStyles[region.name] || regionStyles.default;
            const Icon = style.icon || Globe;
            return /* @__PURE__ */ jsxs(
              Card,
              {
                onClick: () => {
                  setSelectedRegion(region);
                  setIsModalOpen(true);
                },
                className: `cursor-pointer group hover:scale-105 transition-all duration-700 transform w-full max-w-sm ${visibleRegions[index] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
                style: { transitionDelay: `${reducedMotion ? 0 : index * 50}ms` },
                children: [
                  /* @__PURE__ */ jsxs(CardHeader, { className: `relative bg-gradient-to-br ${style.bgGradient} p-4`, children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                      /* @__PURE__ */ jsx(
                        Icon,
                        {
                          className: `w-6 h-6 mb-2 bg-gradient-to-br ${style.gradient} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`
                        }
                      ),
                      /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-gray-900 mb-2", children: region.name }),
                      /* @__PURE__ */ jsxs(
                        Badge,
                        {
                          className: `bg-gradient-to-r ${style.gradient} text-white border-0 mb-2`,
                          children: [
                            region.count,
                            " Languages"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: region.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                    region.languages.slice(0, 12).map((lang, langIndex) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors",
                        children: lang.name
                      },
                      langIndex
                    )),
                    region.languages.length > 12 && /* @__PURE__ */ jsxs("span", { className: "inline-block text-xs text-gray-500 px-2 py-1", children: [
                      "+",
                      region.languages.length - 12,
                      " more..."
                    ] })
                  ] }) })
                ]
              },
              region.name
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx(
          LanguageRegionModal,
          {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            region: selectedRegion,
            onLanguageSelect
          }
        )
      ] })
    }
  );
};
const benchmarkData = [
  {
    dataset: "SPGISpeech",
    pingala: 1.13,
    previousBest: 1.81,
    improvement: 38,
    description: "Spoken Wikipedia transcription benchmark",
    rank: 1,
    icon: Crown,
    verified: true,
    best_name: "assemblyai/assembly_best"
  },
  {
    dataset: "VoxPopuli",
    pingala: 3.47,
    previousBest: 5.44,
    improvement: 35,
    description: "European Parliament speeches",
    rank: 1,
    icon: Crown,
    best_name: "nvidia/parakeet-rnnt-1.1b"
  },
  {
    dataset: "AMI",
    pingala: 3.52,
    previousBest: 8.71,
    improvement: 45,
    description: "Meeting transcriptions",
    rank: 1,
    icon: Crown,
    best_name: "nyrahealth/CrisperWhisper"
  },
  {
    dataset: "Gigaspeech",
    pingala: 4.26,
    previousBest: 9.41,
    improvement: 54,
    description: "Diverse audio content",
    rank: 1,
    icon: Crown,
    best_name: "revai/fusion"
  },
  {
    dataset: "Earnings22",
    pingala: 4.36,
    previousBest: 9.53,
    improvement: 33,
    description: "Corporate earnings calls",
    rank: 1,
    icon: Crown,
    best_name: "ibm-granite/granite-speech-3.3-8b"
  },
  {
    dataset: "TEDLIUM",
    pingala: 2.14,
    previousBest: 2.54,
    improvement: 18,
    description: "TED talk presentations",
    rank: 1,
    icon: Crown,
    best_name: "speechmatics/enhanced"
  },
  {
    dataset: "LibriSpeech Clean",
    pingala: 1.87,
    previousBest: 1.4,
    improvement: -26,
    description: "Clean audiobook readings",
    rank: 2,
    icon: Medal,
    verified: true,
    best_name: "nvidia/parakeet-tdt-1.1b"
  },
  {
    dataset: "LibriSpeech Other",
    pingala: 2.81,
    previousBest: 2.5,
    improvement: -14,
    description: "Noisy audiobook readings",
    rank: 2,
    icon: Medal,
    verified: true,
    best_name: "nvidia/parakeet-rnnt-1.1b"
  }
];
const achievementStats = [
  {
    label: "Championships",
    value: "6/8",
    icon: Trophy,
    color: "from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]",
    description: "Datasets dominated"
  },
  {
    label: "Average WER",
    value: "2.94%",
    icon: Target,
    color: "from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]",
    description: "Industry leading accuracy"
  },
  {
    label: "CPU RTFx",
    value: "157.93x",
    icon: Zap,
    color: "from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]",
    description: "Real-time performance"
  },
  {
    label: "Global Rank",
    value: "#1",
    icon: Crown,
    color: "from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]",
    description: "HuggingFace Leaderboard"
  }
];
const Benchmarks = () => {
  const [visibleRows, setVisibleRows] = useState(
    new Array(benchmarkData.length).fill(false)
  );
  const [animatedStats, setAnimatedStats] = useState(
    new Array(achievementStats.length).fill(false)
  );
  const [storyPhase, setStoryPhase] = useState(0);
  const tableRef = useRef(null);
  const statsRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === tableRef.current) {
              setStoryPhase(1);
              setTimeout(() => setStoryPhase(2), 300);
              benchmarkData.forEach((_, index) => {
                setTimeout(() => {
                  setVisibleRows((prev) => {
                    const newVisible = [...prev];
                    newVisible[index] = true;
                    return newVisible;
                  });
                }, index * 30);
              });
            }
            if (entry.target === statsRef.current) {
              achievementStats.forEach((_, index) => {
                setTimeout(() => {
                  setAnimatedStats((prev) => {
                    const newAnimated = [...prev];
                    newAnimated[index] = true;
                    return newAnimated;
                  });
                }, index * 100);
              });
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px" }
    );
    if (tableRef.current) observer.observe(tableRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "benchmarks",
      className: "py-8 md:py-12 lg:py-16 relative bg-gradient-to-b from-orange-50 via-yellow-50 to-pink-50",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-6", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: "Zero" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "to" }),
              " ",
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent transition-all duration-1000 ${storyPhase >= 1 ? "opacity-100 scale-100" : "opacity-70 scale-95"}`,
                  children: "#1"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl lg:text-3xl font-semibold mb-8 text-gray-700", children: "Introducing Pingala V1" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 max-w-3xl mx-auto", children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-xl text-gray-700 transition-all duration-1000 ${storyPhase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`,
                  children: "In the beginning, there was only the void of imperfect speech recognition..."
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-xl text-gray-800 transition-all duration-1000 ${storyPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`,
                  children: "Then Pingala V1 emerged, carrying the wisdom of ancient mathematics..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { ref: statsRef, className: "mb-16", children: /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: achievementStats.map((stat, index) => /* @__PURE__ */ jsx(
            Card,
            {
              className: `group border border-gray-200 bg-white/80 backdrop-blur-xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:bg-white/90 shadow-lg ${animatedStats[index] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
              style: { transitionDelay: `${index * 300}ms` },
              children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 text-center relative", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`
                  }
                ),
                /* @__PURE__ */ jsx(
                  stat.icon,
                  {
                    className: `w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300", children: stat.value }),
                /* @__PURE__ */ jsx("div", { className: "text-gray-700 font-medium text-sm mb-1", children: stat.label }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 italic", children: stat.description })
              ] })
            },
            stat.label
          )) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { ref: tableRef, children: /* @__PURE__ */ jsxs(Card, { className: "border border-gray-300 bg-white/90 backdrop-blur-xl overflow-hidden shadow-2xl", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white p-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl font-bold mb-2", children: "The Leaderboard Dominance" }),
            /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-lg", children: "HuggingFace Open ASR Leaderboard • Real-world Performance" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-center space-x-8 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(Crown, { className: "w-4 h-4 text-yellow-400" }),
                /* @__PURE__ */ jsx("span", { children: "6 Championships" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(Target, { className: "w-4 h-4 text-green-400" }),
                /* @__PURE__ */ jsx("span", { children: "2.94% Average WER" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider", children: "Dataset & Context" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider", children: "Pingala V1" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider", children: "Comparison" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider", children: "Performance" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 bg-white", children: benchmarkData.map((row, index) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: `group transform transition-all duration-500 hover:bg-gray-50 ${visibleRows[index] ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`,
                  style: { transitionDelay: `${index * 200}ms` },
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                      /* @__PURE__ */ jsx(
                        row.icon,
                        {
                          className: `w-7 h-7 ${row.rank === 1 ? "text-yellow-400" : "text-gray-400"}`
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300", children: row.dataset }),
                        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 mt-1", children: row.description })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-6 py-8", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-green-600", children: [
                        row.pingala.toFixed(2),
                        "% WER"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-green-700 font-medium mt-1", children: row.rank === 1 ? "🏆 Champion" : "🥈 Runner-up" })
                    ] }),
                    /* @__PURE__ */ jsxs("td", { className: "px-6 py-8", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-base font-medium text-gray-700", children: [
                        row.previousBest.toFixed(2),
                        "% WER"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [
                        row.improvement > 0 ? "Previous best" : "Current leader",
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [
                          "- ",
                          row.best_name || ""
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-3 overflow-hidden", children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `h-3 rounded-full transition-all duration-1000 ease-out ${row.improvement > 0 ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-yellow-500 to-orange-500"}`,
                            style: {
                              width: visibleRows[index] ? `${Math.min(Math.abs(row.improvement), 100)}%` : "0%",
                              transitionDelay: `${index * 200 + 500}ms`
                            }
                          }
                        ) }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-sm font-bold min-w-max ${row.improvement > 0 ? "text-green-600" : "text-orange-600"}`,
                            children: row.improvement > 0 ? `${row.improvement}% better` : `${Math.abs(row.improvement)}% gap`
                          }
                        )
                      ] }),
                      row.improvement > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-green-600 italic", children: "Breakthrough achieved" })
                    ] }) })
                  ]
                },
                row.dataset
              )) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "md:hidden bg-white", children: /* @__PURE__ */ jsx("div", { className: "space-y-4 p-4", children: benchmarkData.map((row, index) => /* @__PURE__ */ jsx(
              Card,
              {
                className: `border border-gray-200 bg-white shadow-md transform transition-all duration-500 ${visibleRows[index] ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`,
                style: { transitionDelay: `${index * 150}ms` },
                children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx(
                        row.icon,
                        {
                          className: `w-6 h-6 ${row.rank === 1 ? "text-yellow-400" : "text-gray-400"}`
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: row.rank === 1 ? "🏆 Champion" : "🥈 Runner-up" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `px-2 py-1 rounded-full text-xs font-bold ${row.improvement > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`,
                        children: row.improvement > 0 ? `${row.improvement}% better` : `${Math.abs(row.improvement)}% gap`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: row.dataset }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: row.description })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-green-600", children: [
                        row.pingala.toFixed(2),
                        "%"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 uppercase tracking-wide", children: "Pingala V1 WER" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-lg font-medium text-gray-700", children: [
                        row.previousBest.toFixed(2),
                        "%"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 uppercase tracking-wide", children: row.improvement > 0 ? "Previous Best" : "Current Leader" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600", children: [
                      /* @__PURE__ */ jsx("span", { children: "Performance Improvement" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: row.improvement > 0 ? "Better" : "Competitive" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `h-2 rounded-full transition-all duration-1000 ease-out ${row.improvement > 0 ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-yellow-500 to-orange-500"}`,
                        style: {
                          width: visibleRows[index] ? `${Math.min(Math.abs(row.improvement), 100)}%` : "0%",
                          transitionDelay: `${index * 150 + 300}ms`
                        }
                      }
                    ) }),
                    row.improvement > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-green-600 italic font-medium", children: "✨ Breakthrough achieved" })
                  ] })
                ] })
              },
              row.dataset
            )) }) })
          ] })
        ] }) })
      ] })
    }
  );
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function parseSpeakerCount(speakerStr) {
  var _a;
  if (!speakerStr || speakerStr === "-") return 0;
  const cleanStr = speakerStr.replace(/[,+]/g, "").trim();
  const match = cleanStr.match(/([\d.]+)\s*([MBK]?)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const suffix = (_a = match[2]) == null ? void 0 : _a.toUpperCase();
  switch (suffix) {
    case "B":
      return num * 1e9;
    case "M":
      return num * 1e6;
    case "K":
      return num * 1e3;
    default:
      return num * 1e6;
  }
}
function getTotalAvailableSpeakers() {
  return languages.filter((lang) => lang.status === "available").reduce((total, lang) => total + parseSpeakerCount(lang.speakers), 0);
}
function getTotalAllSpeakers() {
  return languages.reduce((total, lang) => total + parseSpeakerCount(lang.speakers), 0);
}
function getGlobalCoveragePercentage() {
  const GLOBAL_POPULATION = 8e9;
  const availableSpeakers = getTotalAvailableSpeakers();
  return Math.min(availableSpeakers / GLOBAL_POPULATION * 100, 100);
}
function getLanguageCounts() {
  const availableLanguages = languages.filter((lang) => lang.status === "available");
  const comingSoonLanguages = languages.filter((lang) => lang.status === "coming-soon");
  return {
    total: languages.length,
    available: availableLanguages.length,
    comingSoon: comingSoonLanguages.length,
    regions: regions.length
  };
}
function getFormattedCoveragePercentage() {
  return `${getGlobalCoveragePercentage().toFixed(1)}%`;
}
function formatSpeakerCount(count) {
  if (count >= 1e9) {
    return `${(count / 1e9).toFixed(1)}B`;
  } else if (count >= 1e6) {
    return `${Math.round(count / 1e6)}M`;
  } else if (count >= 1e3) {
    return `${Math.round(count / 1e3)}K`;
  }
  return count.toString();
}
function getLanguageStatistics() {
  const counts = getLanguageCounts();
  const availableSpeakers = getTotalAvailableSpeakers();
  const totalSpeakers = getTotalAllSpeakers();
  const coveragePercentage = getGlobalCoveragePercentage();
  return {
    totalLanguages: counts.total,
    availableLanguages: counts.available,
    comingSoonLanguages: counts.comingSoon,
    totalRegions: counts.regions,
    availableSpeakers,
    totalSpeakers,
    coveragePercentage,
    formattedCoverage: getFormattedCoveragePercentage(),
    formattedAvailableSpeakers: formatSpeakerCount(availableSpeakers),
    formattedTotalSpeakers: formatSpeakerCount(totalSpeakers)
  };
}
const OrganizationInfo = () => {
  getLanguageStatistics();
  return /* @__PURE__ */ jsx("section", { className: "py-8 md:py-12 lg:py-16 bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Born from Innovation" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-gray-700 mb-4", children: "Shunya Labs: A Deeptech Venture by United We Care" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Card, { className: "relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-blue-200/50", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/logo uwc.png",
              alt: "United We Care",
              className: "h-16 w-auto hover:opacity-80 transition-opacity duration-200"
            }
          ) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-gray-900", children: "United We Care" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "AI Mental Health. Zero Wait." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 p-8 pt-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("strong", { children: "We imagined a world where mental health is always within reach — so we built it." }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed mb-6", children: "Stella, our AI-powered wellness engine, redefined what support can feel like: intelligent, empathetic, always on. United We Care isn't just advancing technology — we're shaping the future of human connection." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-gray-900 flex items-center", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 mr-2 text-blue-600" }),
              "Core Focus Areas"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-gray-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "AI-driven mental health assessments" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "Accessible digital therapeutics" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "Organizational wellness programs" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "Ethical AI in healthcare" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [
              /* @__PURE__ */ jsx(Heart, { className: "w-3 h-3 mr-1" }),
              "Mental Health"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800", children: [
              /* @__PURE__ */ jsx(Brain, { className: "w-3 h-3 mr-1" }),
              "AI Healthcare"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 mr-1" }),
              "Wellness Platform"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              className: "w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90",
              children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://www.unitedwecare.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center justify-center",
                  children: [
                    "Visit United We Care",
                    /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 ml-2" })
                  ]
                }
              )
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-purple-200/50", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/shortlogo.png",
              alt: "Shunya Labs",
              className: "h-16 w-auto hover:opacity-80 transition-opacity duration-200"
            }
          ) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-gray-900", children: "Shunya Labs" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "First-Principles AI Labs" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 p-8 pt-0", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-gray-700 leading-relaxed", children: [
            /* @__PURE__ */ jsx("strong", { children: "ShunyaLabs is engineering the next layer of Voice intelligence." }),
            " We build real-time, on-premise AI for voice, language, and reasoning — fast, private, and human-aware. No bloat. No black boxes. Just pure, first-principles tech built for trust, not trends."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-gray-900 flex items-center", children: [
              /* @__PURE__ */ jsx(Award, { className: "w-5 h-5 mr-2 text-purple-600" }),
              "Key Achievements"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-gray-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "Pingala V1 #1 ranking on Open ASR Leaderboard" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "216 languages supported with 2.94% WER" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "Mathematical foundations in speech AI" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { children: "CPU-first architecture for cost efficiency" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800", children: [
              /* @__PURE__ */ jsx(Zap, { className: "w-3 h-3 mr-1" }),
              "AI Research"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-3 h-3 mr-1" }),
              "Speech Recognition"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800", children: [
              /* @__PURE__ */ jsx(Brain, { className: "w-3 h-3 mr-1" }),
              "Machine Learning"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
};
const Footer = () => {
  getLanguageStatistics();
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-50 border-t border-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-light.png",
            alt: "Shunya Labs",
            className: "h-12 w-auto hover:opacity-80 transition-opacity duration-200"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: "A Deeptech Venture by United We Care." }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 hidden", children: [
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-400 hover:text-blue-400 transition-colors", children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-400 hover:text-blue-400 transition-colors", children: /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-400 hover:text-blue-400 transition-colors", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Products" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/product/verbatim",
              className: "text-gray-600 hover:text-black transition-colors",
              children: [
                "Pingala V1",
                /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Automatic Speech Recognition" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/product/reason",
              className: "text-gray-600 hover:text-black transition-colors",
              children: [
                "B1",
                /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Text to Speech" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/product/echo",
              className: "text-gray-600 hover:text-black transition-colors",
              children: [
                "A1",
                /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Voice to Voice" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/product/stream",
              className: "text-gray-600 hover:text-black transition-colors",
              children: [
                "M1",
                /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Native Reasoning Engine" })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Technology" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "/pingala", className: "text-gray-600 hover:text-black transition-colors", children: [
          "Pingala V1",
          /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Advanced Speech Technology" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Pricing" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/pricing", className: "text-gray-600 hover:text-black transition-colors", children: "View Pricing" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "About Us" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-gray-600 hover:text-black transition-colors", children: "Our Story" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-gray-600 text-sm", children: "© 2025 Shunya Labs. All rights reserved." }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0", children: [
        /* @__PURE__ */ jsx(Link, { to: "/legal/privacy", className: "hover:text-gray-900 transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsx(Link, { to: "/legal/terms", className: "hover:text-gray-900 transition-colors", children: "Terms" }),
        /* @__PURE__ */ jsx(Link, { to: "/legal/security", className: "hover:text-gray-900 transition-colors", children: "Security" })
      ] })
    ] })
  ] }) });
};
const DEFAULT_SEO = {
  title: "Shunya Labs - Advanced ASR & Voice AI Technology Platform",
  description: "Meet the world's most advanced Automatic Speech Recognition (ASR) engine by Shunya Labs. Support for 100+ languages, real-time transcription, and enterprise-grade voice AI solutions.",
  keywords: [
    "ASR",
    "speech recognition",
    "voice AI",
    "automatic speech recognition",
    "voice technology",
    "transcription",
    "multilingual ASR",
    "real-time speech",
    "voice analytics",
    "AI transcription",
    "speech to text",
    "voice processing",
    "language models",
    "voice synthesis",
    "audio processing",
    "Shunya Labs"
  ],
  image: "/logo.png",
  url: "https://shunyalabs.ai",
  type: "website",
  siteName: "Shunya Labs",
  locale: "en_US",
  twitterHandle: "@shunya_labs",
  canonicalUrl: "https://shunyalabs.ai",
  noIndex: false,
  noFollow: false
};
const useSEO = (seoData = {}) => {
  const mergedSEO = { ...DEFAULT_SEO, ...seoData };
  useEffect(() => {
    if (mergedSEO.title) {
      document.title = mergedSEO.title;
    }
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    updateMetaTag("description", mergedSEO.description);
    updateMetaTag("keywords", mergedSEO.keywords.join(", "));
    updateMetaTag("author", "Shunya Labs");
    updateMetaTag(
      "robots",
      `${mergedSEO.noIndex ? "noindex" : "index"},${mergedSEO.noFollow ? "nofollow" : "follow"}`
    );
    updateMetaTag("og:title", mergedSEO.title, true);
    updateMetaTag("og:description", mergedSEO.description, true);
    updateMetaTag("og:image", `${mergedSEO.url}${mergedSEO.image}`, true);
    updateMetaTag("og:url", mergedSEO.canonicalUrl, true);
    updateMetaTag("og:type", mergedSEO.type, true);
    updateMetaTag("og:site_name", mergedSEO.siteName, true);
    updateMetaTag("og:locale", mergedSEO.locale, true);
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:site", mergedSEO.twitterHandle);
    updateMetaTag("twitter:creator", mergedSEO.twitterHandle);
    updateMetaTag("twitter:title", mergedSEO.title);
    updateMetaTag("twitter:description", mergedSEO.description);
    updateMetaTag("twitter:image", `${mergedSEO.url}${mergedSEO.image}`);
    updateMetaTag("theme-color", "#2d4cc8");
    updateMetaTag("msapplication-TileColor", "#2d4cc8");
    updateMetaTag("apple-mobile-web-app-title", "ZeroVoice");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = mergedSEO.canonicalUrl;
    if (mergedSEO.structuredData) {
      let structuredDataScript = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.type = "application/ld+json";
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(mergedSEO.structuredData);
    }
    document.documentElement.lang = mergedSEO.locale.split("_")[0];
    document.documentElement.dir = "ltr";
  }, [mergedSEO]);
  return mergedSEO;
};
const SEO_CONFIGS = {
  landing: {
    title: "Advanced ASR & Voice AI Technology Platform | Shunya Labs",
    description: "Meet the world's most advanced Automatic Speech Recognition (ASR) engine by Shunya Labs. Support for 100+ languages, real-time transcription, and enterprise-grade voice AI solutions.",
    keywords: [
      "ASR",
      "speech recognition",
      "voice AI",
      "automatic speech recognition",
      "voice technology",
      "transcription",
      "multilingual ASR",
      "real-time speech",
      "voice analytics",
      "AI transcription",
      "Shunya Labs"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Shunya Labs ASR Engine",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Advanced Automatic Speech Recognition (ASR) engine by Shunya Labs supporting 100+ languages with real-time transcription capabilities.",
      url: "https://shunyalabs.ai",
      publisher: {
        "@type": "Organization",
        name: "Shunya Labs",
        url: "https://shunyalabs.ai",
        logo: {
          "@type": "ImageObject",
          url: "https://www.shunyalabs.ai/logo.png"
        }
      },
      offers: {
        "@type": "Offer",
        category: "SaaS",
        availability: "https://schema.org/InStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1000"
      },
      features: [
        "Real-time Speech Recognition",
        "100+ Language Support",
        "Enterprise API Integration",
        "Voice Analytics",
        "Custom Model Training",
        "High Accuracy Transcription"
      ]
    }
  }
};
const StructuredData = ({ data }) => {
  return /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(data) } });
};
const STRUCTURED_DATA_SCHEMAS = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shunya Labs",
    url: "https://shunyalabs.ai",
    logo: "https://www.shunyalabs.ai/logo.png",
    description: "Shunya Labs is an advanced voice AI technology company specializing in automatic speech recognition and voice processing solutions.",
    foundingDate: "2023",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2810 N Church Street",
      addressLocality: "Wilmington",
      addressRegion: "Delaware",
      postalCode: "19802",
      addressCountry: "US"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-000-000-0000",
      contactType: "customer service",
      availableLanguage: "English"
    },
    sameAs: [
      "https://twitter.com/shunya_labs",
      "https://linkedin.com/company/shunya-labs",
      "https://github.com/shunya-labs"
    ],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "SoftwareApplication",
        name: "Advanced ASR Engine",
        description: "Advanced ASR engine with 100+ language support"
      }
    }
  },
  product: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shunya Labs ASR Engine",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, API",
    description: "Advanced Automatic Speech Recognition (ASR) engine by Shunya Labs supporting 100+ languages with real-time transcription capabilities.",
    url: "https://shunyalabs.ai",
    softwareVersion: "2.0",
    releaseNotes: "Enhanced accuracy and expanded language support",
    downloadUrl: "https://shunyalabs.ai/dashboard",
    screenshot: "https://www.shunyalabs.ai/logo.png",
    applicationSubCategory: "Voice Recognition Software",
    publisher: {
      "@type": "Organization",
      name: "Shunya Labs",
      url: "https://shunyalabs.ai"
    },
    creator: {
      "@type": "Organization",
      name: "Shunya Labs"
    },
    offers: {
      "@type": "Offer",
      category: "SaaS",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        price: "0.01",
        unitText: "per minute"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1000",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Enterprise Customer"
        },
        datePublished: "2024-12-01",
        reviewBody: "Exceptional accuracy and fast processing by Shunya Labs. Perfect for our multilingual customer support.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        }
      }
    ]
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Shunya Labs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shunya Labs is an advanced voice AI technology company specializing in automatic speech recognition and voice processing solutions, offering the world's most advanced ASR engine with 100+ language support."
        }
      },
      {
        "@type": "Question",
        name: "What does Shunya Labs offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shunya Labs offers advanced Automatic Speech Recognition (ASR) technology, supporting 100+ languages with real-time transcription capabilities and enterprise-grade accuracy."
        }
      },
      {
        "@type": "Question",
        name: "How many languages does Shunya Labs support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shunya Labs supports over 100 languages including major languages like English, Spanish, French, German, Chinese, Hindi, Arabic, and many more regional languages."
        }
      },
      {
        "@type": "Question",
        name: "What is the accuracy rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shunya Labs' ASR engine achieves industry-leading accuracy rates of 95%+ for major languages and 90%+ for most supported languages, depending on audio quality and language complexity."
        }
      },
      {
        "@type": "Question",
        name: "Is Shunya Labs suitable for enterprise use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Shunya Labs is designed for enterprise applications with features like API integration, custom model training, real-time processing, and enterprise-grade security."
        }
      }
    ]
  }
};
const products = [
  {
    name: "Pingala V1",
    pronunciation: "",
    tagline: "Pingala V1 — English precision or Multilingual mastery (216 languages)",
    description: "Pingala V1 English comes in two modes — Verbatim for word-perfect transcripts, Enhanced for context-rich clarity.",
    icon: Mic,
    href: "/product/verbatim",
    badge: "Automatic Speech Recognition",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    name: "B1",
    pronunciation: "",
    tagline: "Text-to-Speech Engine (Named after Bharata)",
    description: "Ultra-naturalistic speech synthesis engine that converts text into expressive, emotionally rich speech.",
    icon: Brain,
    href: "/product/reason",
    badge: "Text to Speech",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    name: "A1",
    pronunciation: "",
    tagline: "Voice-to-Voice Conversational AI (Named after Aryabhatta)",
    description: "Full-duplex voice interface powered by AI — enables spoken input, AI understanding, and spoken output.",
    icon: Volume2,
    href: "/product/echo",
    badge: "Voice to Voice",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200"
  },
  {
    name: "M1",
    pronunciation: "",
    tagline: "Native Graph Reasoning Engine (Named after Madhava)",
    description: "Native reasoning engine built on knowledge graphs for interpretable, symbolic + neural decision-making.",
    icon: Infinity,
    href: "/product/stream",
    badge: "Native Reasoning Engine",
    gradient: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-50 to-yellow-50",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200"
  }
];
const ProductShowcase = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-24 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-midnight mb-4", children: "Four Models. One Mission." }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Each model draws from ancient mathematical wisdom, engineered for modern CPU-first performance." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8", children: products.map((product, index) => {
      const Icon = product.icon;
      const isAvailable = index === 0;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          "data-featured": isAvailable ? "true" : void 0,
          className: "group/product rounded-3xl p-8 ring-1 ring-gray-200 data-featured:ring-2 data-featured:ring-indigo-600 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `rounded-full px-3 py-1.5 mb-4 w-max text-sm font-semibold ${isAvailable ? "bg-green-600/10 text-green-600" : "bg-orange-600/10 text-orange-600"}`,
                children: isAvailable ? "Available now" : "Coming soon"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-x-4", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-12 h-12 bg-gradient-to-br ${product.gradient} rounded-xl flex items-center justify-center shadow-lg`,
                children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-white" })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-x-4 mb-3", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-gray-200 ring-inset w-max", children: product.badge }),
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-lg font-semibold ${isAvailable ? "text-indigo-600" : "text-gray-900"}`,
                    children: product.name
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-3", children: product.pronunciation }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 mb-4", children: product.tagline })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 leading-relaxed mb-6", children: product.description }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: product.href,
                  className: `flex items-center justify-center w-full rounded-md px-3 py-2 text-center text-sm font-semibold ring-1 ring-inset transition-all duration-200 ${isAvailable ? "bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl " : "text-indigo-600 ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}`,
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                    "Learn More",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                  ] })
                }
              )
            ] })
          ]
        },
        product.name
      );
    }) })
  ] }) });
};
const features = [
  {
    icon: Cpu,
    title: "CPU-first Architecture",
    description: "Engineered from the ground up for commodity processors. No GPU dependency, no vendor lock-in.",
    benefit: "Deploy anywhere, anytime",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description: "Zero bytes leave your premises. Air-gap friendly with HIPAA, and SOC 2 compliance.",
    benefit: "Your data stays yours",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    icon: Calculator,
    title: "Built for Real-World Accuracy",
    description: "High accuracy: <3% WER, noise-resilient. (e.g. call center, street audio)",
    benefit: "Under‑3% WER",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    icon: Code,
    title: "Open & Portable",
    description: "Standard APIs, multiple SDKs, container-ready. Integrate with your existing stack in minutes.",
    benefit: "No platform prison",
    gradient: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-50 to-yellow-50"
  }
];
const WhyShunyaLabs = () => {
  getLanguageStatistics();
  return /* @__PURE__ */ jsx("section", { className: "py-24 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-midnight mb-4", children: "Why Shunya Labs?" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "We solve the fundamental problems that make voice AI expensive, slow, and insecure." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8", children: features.map((feature) => {
      const Icon = feature.icon;
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: `border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${feature.bgGradient} hover:scale-105`,
          children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`,
                  children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7 text-white" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl mb-2", children: feature.title }),
                /* @__PURE__ */ jsx("div", { className: "inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-electric-blue text-sm font-medium border border-blue-200", children: feature.benefit })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { className: "text-base leading-relaxed text-gray-600", children: feature.description }) })
          ]
        },
        feature.title
      );
    }) })
  ] }) });
};
const PreFooter = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-24 bg-gradient-to-r from-blue-800 to-blue-600 text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-6", children: "Ready to hear the difference?" }),
    /* @__PURE__ */ jsx("p", { className: "text-xl mb-8 text-blue-100", children: "Join the early access program and experience CPU-first voice AI" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", className: "px-8 py-4 text-lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/early-access", children: [
        "Get Early Access",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
      ] }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "lg",
          variant: "outline",
          className: "px-8 py-4 text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-400",
          asChild: true,
          children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Book Demo" })
        }
      )
    ] })
  ] }) });
};
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, showDefaultClose = true, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(DialogPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    children,
    showDefaultClose && /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
    ] })
  ] })
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isProductActive = () => {
    const productRoutes = [
      "/product/verbatim",
      "/product/echo",
      "/product/reason",
      "/product/stream"
    ];
    return productRoutes.some((route) => location.pathname === route);
  };
  const isTechnologyActive = () => {
    const technologyRoutes = ["/pingala"];
    return technologyRoutes.some((route) => location.pathname === route);
  };
  const closeSheet = () => setIsOpen(false);
  return /* @__PURE__ */ jsx("nav", { className: "border-b bg-card/80 backdrop-blur-md sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("img", { src: "/logo-light.png", alt: "Shunya Labs", className: "w-auto h-10" }) }),
    /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center space-x-8", children: [
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxs(
          DropdownMenuTrigger,
          {
            className: `flex items-center space-x-1 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isProductActive() ? "text-primary" : "text-foreground"} focus-visible:outline-none focus-visible:ring-0`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "Product" }),
              /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          DropdownMenuContent,
          {
            align: "start",
            className: "w-48 focus-visible:outline-none focus-visible:ring-0",
            children: [
              /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  asChild: true,
                  className: "group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0",
                  children: /* @__PURE__ */ jsx(Link, { to: "/product/verbatim", className: "w-full", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium group-hover:text-white", children: "Pingala V1" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground group-hover:text-slate-100", children: "Automatic Speech Recognition" })
                  ] }) })
                }
              ),
              /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  asChild: true,
                  className: "group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0",
                  children: /* @__PURE__ */ jsx(Link, { to: "/product/reason", className: "w-full", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium group-hover:text-white", children: "B1" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground group-hover:text-slate-100", children: "Text to Speech" })
                  ] }) })
                }
              ),
              /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  asChild: true,
                  className: "group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0",
                  children: /* @__PURE__ */ jsx(Link, { to: "/product/echo", className: "w-full", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium group-hover:text-white", children: "A1" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground group-hover:text-slate-100", children: "Voice to Voice" })
                  ] }) })
                }
              ),
              /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  asChild: true,
                  className: "group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0",
                  children: /* @__PURE__ */ jsx(Link, { to: "/product/stream", className: "w-full", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium group-hover:text-white", children: "M1" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground group-hover:text-slate-100", children: "Native Reasoning Engine" })
                  ] }) })
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxs(
          DropdownMenuTrigger,
          {
            className: `flex items-center space-x-1 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isTechnologyActive() ? "text-primary" : "text-foreground"} focus-visible:outline-none focus-visible:ring-0`,
            children: [
              /* @__PURE__ */ jsx("span", { children: "Technology" }),
              /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          DropdownMenuContent,
          {
            align: "start",
            className: "w-48 focus-visible:outline-none focus-visible:ring-0",
            children: /* @__PURE__ */ jsx(
              DropdownMenuItem,
              {
                asChild: true,
                className: "group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0",
                children: /* @__PURE__ */ jsx(Link, { to: "/pingala", className: "w-full", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium group-hover:text-white", children: "Pingala V1" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground group-hover:text-slate-100", children: "Advanced Speech Technology" })
                ] }) })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/pricing",
          className: `hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isActive("/pricing") ? "text-primary" : "text-foreground"} pt-2`,
          children: "Pricing"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/about",
          className: `hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isActive("/about") ? "text-primary" : "text-foreground"} pt-2`,
          children: "About Us"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxs(Sheet, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-foreground hover:bg-accent/50", children: /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" }) }) }),
      /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-full sm:w-80 p-0", showDefaultClose: false, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsx(SheetHeader, { className: "px-6 py-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("img", { src: "/logo-light.png", alt: "Shunya Labs", className: "w-auto h-10" }) }),
          /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "ml-auto", children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 space-y-4", children: [
          /* @__PURE__ */ jsxs(Accordion, { type: "multiple", className: "w-full", children: [
            /* @__PURE__ */ jsxs(AccordionItem, { value: "product", className: "border-none", children: [
              /* @__PURE__ */ jsx(
                AccordionTrigger,
                {
                  className: `hover:no-underline py-3 px-0 ${isProductActive() ? "text-primary" : "text-foreground"}`,
                  children: "Product"
                }
              ),
              /* @__PURE__ */ jsx(AccordionContent, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 pl-4", children: [
                /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/product/verbatim",
                    className: `block py-2 px-3 rounded-md transition-colors ${isActive("/product/verbatim") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                    onClick: closeSheet,
                    children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Pingala V1" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Automatic Speech Recognition" })
                    ] })
                  }
                ) }),
                /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/product/reason",
                    className: `block py-2 px-3 rounded-md transition-colors ${isActive("/product/reason") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                    onClick: closeSheet,
                    children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "B1" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Text to Speech" })
                    ] })
                  }
                ) }),
                /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/product/echo",
                    className: `block py-2 px-3 rounded-md transition-colors ${isActive("/product/echo") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                    onClick: closeSheet,
                    children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "A1" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Voice to Voice" })
                    ] })
                  }
                ) }),
                /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/product/stream",
                    className: `block py-2 px-3 rounded-md transition-colors ${isActive("/product/stream") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                    onClick: closeSheet,
                    children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "M1" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Native Reasoning Engine" })
                    ] })
                  }
                ) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(AccordionItem, { value: "technology", className: "border-none", children: [
              /* @__PURE__ */ jsx(
                AccordionTrigger,
                {
                  className: `hover:no-underline py-3 px-0 ${isTechnologyActive() ? "text-primary" : "text-foreground"}`,
                  children: "Technology"
                }
              ),
              /* @__PURE__ */ jsx(AccordionContent, { className: "pb-3", children: /* @__PURE__ */ jsx("div", { className: "space-y-3 pl-4", children: /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/pingala",
                  className: `block py-2 px-3 rounded-md transition-colors ${isActive("/pingala") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                  onClick: closeSheet,
                  children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Pingala V1" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Advanced Speech Technology" })
                  ] })
                }
              ) }) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t", children: [
            /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/pricing",
                className: `block py-3 px-0 rounded-md transition-colors ${isActive("/pricing") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                onClick: closeSheet,
                children: "Pricing"
              }
            ) }),
            /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/about",
                className: `block py-3 px-0 rounded-md transition-colors ${isActive("/about") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/50"}`,
                onClick: closeSheet,
                children: "About Us"
              }
            ) })
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] }) }) });
};
const DocsSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/docs");
  };
  return (
    // Start Building Banner Section
    /* @__PURE__ */ jsxs("section", { className: "py-12 bg-gradient-to-br from-primary/10 via-electric-blue/10 to-purple-500/10 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-electric-blue/5" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset mb-6", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 mr-2" }),
          "Pingala V1: Available Now"
        ] }),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-electric-blue to-purple-500 bg-clip-text text-transparent mb-6",
            style: { lineHeight: "2" },
            children: "Start Building"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12", children: "Get started building with our State-of-the-Art Open Models" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleGetStarted,
            size: "lg",
            className: "bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#0f0d1f] hover:via-[#1e1b3e] hover:to-[#2d4cc8] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
            children: [
              "Get Started",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
            ]
          }
        )
      ] }) })
    ] })
  );
};
const Index = () => {
  useSEO(SEO_CONFIGS.landing);
  const [sharedLanguage, setSharedLanguage] = useState(null);
  const handleLanguageSelect = useCallback((language) => {
    console.log("🌍 [DEBUG] Language selected from modal:", language);
    setSharedLanguage(language);
    const heroSection = document.querySelector('section[id="hero"]') || document.querySelector('[data-section="hero"]');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  useCallback((language) => {
    setSharedLanguage(language);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen transition-colors bg-white", children: [
    /* @__PURE__ */ jsx(StructuredData, { data: STRUCTURED_DATA_SCHEMAS.organization }),
    /* @__PURE__ */ jsx(StructuredData, { data: STRUCTURED_DATA_SCHEMAS.product }),
    /* @__PURE__ */ jsx(StructuredData, { data: STRUCTURED_DATA_SCHEMAS.faq }),
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsx(ProductShowcase, {}),
    /* @__PURE__ */ jsx(DocsSection, {}),
    /* @__PURE__ */ jsx(WhyShunyaLabs, {}),
    /* @__PURE__ */ jsx(LanguageCoverage, { onLanguageSelect: handleLanguageSelect }),
    /* @__PURE__ */ jsx(Benchmarks, {}),
    /* @__PURE__ */ jsx(OrganizationInfo, {}),
    /* @__PURE__ */ jsx(PreFooter, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Index as default
};
