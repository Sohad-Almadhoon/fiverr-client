import React from "react";
import { Link } from "react-router-dom";
import "./State.scss";

// Replaces the bare "loading" / "error" strings that were scattered through
// every page, and gives lists a real empty state instead of a blank table.

export const Loader: React.FC<{ label?: string; inline?: boolean }> = ({
  label = "Loading...",
  inline = false,
}) => (
  <div className={inline ? "loader inline" : "loader"} role="status" aria-live="polite">
    <div className="spinner" />
    <span className="label">{label}</span>
  </div>
);

type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  variant?: "empty" | "error";
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
  variant = "empty",
}) => (
  <div className={variant === "error" ? "emptyState error" : "emptyState"}>
    <div className="icon" aria-hidden="true">
      {variant === "error" ? "⚠️" : icon}
    </div>
    <h3>{title}</h3>
    {message && <p>{message}</p>}
    {actionLabel && (actionTo || onAction) && (
      <div className="action">
        {actionTo ? (
          <Link to={actionTo}>
            <button type="button">{actionLabel}</button>
          </Link>
        ) : (
          <button type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    )}
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <EmptyState
    variant="error"
    title="Something went wrong"
    message={message}
    actionLabel={onRetry ? "Try again" : undefined}
    onAction={onRetry}
  />
);
