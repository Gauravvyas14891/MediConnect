import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border border-black/15 bg-[#0A0A0A] text-[#FFFFFF] shadow-xl transition-all duration-500 ease-editorial"
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-[#FFFFFF] shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-[#FFFFFF] shrink-0" />}
            <span className="text-[13px] font-medium text-[#FFFFFF]">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
