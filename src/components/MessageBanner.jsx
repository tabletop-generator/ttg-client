// components/MessageBanner.js
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export default function MessageBanner({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
  sticky = false, // If true, banner won't auto-dismiss
}) {
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[type] || Info;
  const bgColor = COLORS[type] || COLORS.info;

  useEffect(() => {
    if (!sticky && visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss, sticky, visible]);

  if (!visible) return null;

  return (
    <div
      className={`${bgColor} text-white p-3 rounded-lg flex items-center justify-between shadow-lg mb-4`}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <p>{message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        className="text-white hover:text-gray-200"
      >
        <XCircle size={20} />
      </button>
    </div>
  );
}
