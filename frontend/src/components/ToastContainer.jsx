import { memo } from 'react';
import Toast from './Toast.jsx';

const ToastContainer = memo(function ToastContainer({ toasts, onRemoveToast }) {
  if (!toasts?.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
});

export default ToastContainer;
