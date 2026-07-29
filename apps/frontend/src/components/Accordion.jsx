import { useCallback, useId, useState } from "react";

function ChevronIcon() {
  return (
    <svg className="accordion-chevron-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {Array<{ id: string, title: string, badge?: string, content: import('react').ReactNode }>} props.items
 * @param {string} [props.className]
 * @param {boolean} [props.allowMultiple=true]
 * @param {boolean} [props.defaultOpenFirst=false]
 */
export function Accordion({
  items,
  className = "",
  allowMultiple = true,
  defaultOpenFirst = false
}) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => {
    if (defaultOpenFirst && items[0]?.id) {
      return new Set([items[0].id]);
    }
    return new Set();
  });

  const toggle = useCallback(
    (id) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else if (allowMultiple) {
          next.add(id);
        } else {
          return new Set([id]);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className={`accordion-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              id={triggerId}
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span className="accordion-trigger-text">
                {item.badge ? <span className="accordion-badge">{item.badge}</span> : null}
                <span className="accordion-title">{item.title}</span>
              </span>
              <span className="accordion-icon" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="accordion-panel"
            >
              <div className="accordion-panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
