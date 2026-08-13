import React, { useLayoutEffect, useRef, useState } from "react";
import "./ExpandableText.scss";

type Props = {
  text?: string;
  /** Lines to show while collapsed. */
  lines?: number;
  className?: string;
};

// Long gig descriptions used to dump in full, pushing the buy box far down the
// page. Clamps to `lines` and only offers the toggle when text is actually cut.
const ExpandableText: React.FC<Props> = ({ text, lines = 6, className }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    // Re-measure on resize: what fits on desktop may clamp on a phone.
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, lines]);

  if (!text) return null;

  return (
    <div className={className ? `expandable ${className}` : "expandable"}>
      <p
        ref={ref}
        className={expanded ? "body" : "body clamped"}
        style={
          expanded
            ? undefined
            : ({ "--lines": lines } as React.CSSProperties)
        }>
        {text}
      </p>
      {(clamped || expanded) && (
        <button type="button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
