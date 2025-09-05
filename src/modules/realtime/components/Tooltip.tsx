import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
  trigger?: 'hover' | 'click' | 'focus';
  isSettingsTooltip?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className,
  disabled = false,
  trigger = 'hover',
  isSettingsTooltip = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const [isLeftAligned, setIsLeftAligned] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let newPosition = position;
    const margin = isSettingsTooltip ? 20 : 8; // More margin for settings tooltips

    // For settings tooltips, prefer bottom positioning to avoid width constraints
    if (isSettingsTooltip && (position === 'top' || position === 'bottom')) {
      // Check if bottom position fits
      if (triggerRect.bottom + tooltipRect.height + margin <= scrollY + viewportHeight) {
        newPosition = 'bottom';
      } else if (triggerRect.top - tooltipRect.height - margin >= scrollY) {
        newPosition = 'top';
      } else {
        newPosition = 'bottom'; // Default to bottom even if it overflows slightly
      }
      
      // For settings tooltips, check positioning to avoid cutoff on both sides
      const triggerLeft = triggerRect.left;
      const triggerRight = triggerRect.right;
      const tooltipWidth = tooltipRect.width;
      
      // Find the modal container to check boundaries
      let modalContainer = triggerRef.current?.closest('[class*="max-w-4xl"]');
      if (!modalContainer) {
        modalContainer = triggerRef.current?.closest('[class*="rounded-2xl"]');
      }
      
      let shouldRightAlign = false;
      
      if (modalContainer) {
        const modalRect = modalContainer.getBoundingClientRect();
        
        // Check if left-aligned tooltip would extend beyond modal's right edge
        if (triggerLeft + tooltipWidth + margin > modalRect.right) {
          shouldRightAlign = true;
        }
        
        // Check if left-aligned tooltip would extend beyond modal's left edge
        if (triggerLeft < modalRect.left + margin) {
          shouldRightAlign = false; // Keep left-aligned if it would go beyond left edge
        }
        
        // If right-aligned, check if it would extend beyond modal's left edge
        if (shouldRightAlign && triggerRight - tooltipWidth < modalRect.left + margin) {
          shouldRightAlign = false; // Fall back to left-aligned
        }
      } else {
        // Fallback: check against viewport
        if (triggerLeft + tooltipWidth + margin > scrollX + viewportWidth) {
          shouldRightAlign = true;
        }
        if (triggerLeft < scrollX + margin) {
          shouldRightAlign = false;
        }
      }
      
      setIsLeftAligned(!shouldRightAlign);
    } else {
      // Standard position checking with margins
      switch (position) {
        case 'top':
          if (triggerRect.top - tooltipRect.height - margin < scrollY) {
            newPosition = 'bottom';
          }
          break;
        case 'bottom':
          if (triggerRect.bottom + tooltipRect.height + margin > scrollY + viewportHeight) {
            newPosition = 'top';
          }
          break;
        case 'left':
          if (triggerRect.left - tooltipRect.width - margin < scrollX) {
            newPosition = 'right';
          }
          break;
        case 'right':
          if (triggerRect.right + tooltipRect.width + margin > scrollX + viewportWidth) {
            newPosition = 'left';
          }
          break;
      }
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Initialize left alignment to true for settings tooltips
      if (isSettingsTooltip) {
        setIsLeftAligned(true);
      }
      // Use requestAnimationFrame for better positioning
      requestAnimationFrame(() => {
        checkPosition();
      });
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Add a small delay before hiding to prevent flickering
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  const getTooltipClasses = () => {
    const baseClasses = cn(
      "absolute z-[9999] text-white bg-gray-900 rounded-lg shadow-xl",
      "backdrop-blur-sm border border-gray-700/50",
      "transition-opacity duration-200 ease-out",
      "break-words whitespace-normal",
      "pointer-events-none", // Prevent tooltip from interfering with mouse events
      isVisible ? "opacity-100 visible" : "opacity-0 invisible",
      // Conditional sizing and styling for settings tooltips
      isSettingsTooltip 
        ? "max-w-2xl text-sm w-80 px-5 py-4 leading-relaxed" 
        : "max-w-sm text-sm px-3 py-2 leading-normal",
      className
    );

    const positionClasses = {
      top: isSettingsTooltip 
        ? (isLeftAligned ? "bottom-full left-0 -mb-3" : "bottom-full right-0 -mb-3")
        : "bottom-full left-1/2 transform -translate-x-1/2 -mb-3",
      bottom: isSettingsTooltip 
        ? (isLeftAligned ? "top-full left-0 -mt-3" : "top-full right-0 -mt-3")
        : "top-full left-1/2 transform -translate-x-1/2 -mt-3",
      left: `right-full top-1/2 transform -translate-y-1/2 ${isSettingsTooltip ? '-mr-4' : '-mr-3'}`,
      right: `left-full top-1/2 transform -translate-y-1/2 ${isSettingsTooltip ? '-ml-4' : '-ml-3'}`,
    };

    return cn(baseClasses, positionClasses[actualPosition]);
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-gray-900 border border-gray-700/50 transform rotate-45 pointer-events-none";
    
    const arrowPositions = {
      top: isSettingsTooltip 
        ? (isLeftAligned ? "top-full left-4 transform -translate-y-1/2 border-t-0 border-l-0" : "top-full right-4 transform -translate-y-1/2 border-t-0 border-l-0")
        : "top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0",
      bottom: isSettingsTooltip 
        ? (isLeftAligned ? "bottom-full left-4 transform translate-y-1/2 border-b-0 border-r-0" : "bottom-full right-4 transform translate-y-1/2 border-b-0 border-r-0")
        : "bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0",
      left: "left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 border-l-0 border-b-0",
      right: "right-full top-1/2 transform -translate-y-1/2 translate-x-1/2 border-r-0 border-t-0",
    };

    return cn(baseClasses, arrowPositions[actualPosition]);
  };

  return (
    <div 
      className="relative inline-block"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      {/* Tooltip Content */}
      <div
        ref={tooltipRef}
        className={getTooltipClasses()}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
        {/* Arrow */}
        <div className={getArrowClasses()} />
      </div>
    </div>
  );
};

// Quick tooltip component with predefined styling
interface QuickTooltipProps {
  message: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  isSettingsTooltip?: boolean;
}

export const QuickTooltip: React.FC<QuickTooltipProps> = ({
  message,
  children,
  position = 'top',
  delay = 500,
  disabled = false,
  isSettingsTooltip = false
}) => {
  return (
    <Tooltip
      content={message}
      position={position}
      delay={delay}
      disabled={disabled}
      isSettingsTooltip={isSettingsTooltip}
      className={cn(
        "bg-[#1a1947] border-[#2d4cc8]/30 text-white",
        isSettingsTooltip ? "max-w-2xl text-sm w-96" : "max-w-md text-sm"
      )}
    >
      {children}
    </Tooltip>
  );
};

// Pre-built tooltip messages for common use cases - moved to end to fix Fast Refresh
const TOOLTIP_MESSAGES = {
  micButton: {
    start: "Click to start recording. Ensure your microphone is connected and permissions are granted.",
    stop: "Click to stop recording. Your transcription will be processed immediately.",
    disabled: "Microphone access is required for recording. Please enable microphone permissions."
  },
  language: {
    select: "Choose your preferred language for transcription. This affects accuracy and available features.",
    autodetect: "Auto-detection analyzes your speech to determine the language automatically."
  },
  script: {
    select: "Select the writing system for your chosen language. This ensures proper text formatting.",
    unavailable: "No script options available for this language. Text will use default formatting."
  },
  transcript: {
    copy: "Copy the entire transcript to your clipboard for use in other applications.",
    download: "Download the transcript as a text file to save locally on your device.",
    clear: "Clear the current transcript. This action cannot be undone.",
    confidence: "Confidence score indicates how certain the AI is about each word. Higher scores mean more accurate transcription."
  },
  audio: {
    level: "Audio level indicator shows the volume of your voice. Speak clearly for best results.",
    quality: "Good audio quality improves transcription accuracy. Reduce background noise if possible."
  }
} as const;

export const TooltipMessages = TOOLTIP_MESSAGES;

export default Tooltip; 