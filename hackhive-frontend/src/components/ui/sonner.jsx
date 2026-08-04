import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = (props) => {
  return (
    <Sonner
      theme="system"
      position="top-right"
      richColors={false}
      closeButton
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />,
        info: <InfoIcon className="size-4 text-indigo-600 dark:text-indigo-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-indigo-600 dark:text-indigo-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
           "rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 p-4 font-sans",
          title: "text-xs sm:text-sm font-bold tracking-tight",
          description: "text-xs text-slate-500 dark:text-slate-400 leading-snug",
          closeButton: "bg-transparent border-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
        },
      }}
      {...props} />
  );
};

export { Toaster };

