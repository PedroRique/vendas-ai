import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { toastService } from '../services/toastService';

const GlobalToast: React.FC = () => {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const unsubscribe = toastService.subscribe((message) => {
      toast.current?.show({
        severity: message.severity,
        summary: message.summary,
        detail: message.detail,
        life: message.life ?? 5000,
      });
    });

    return unsubscribe;
  }, []);

  return <Toast ref={toast} position="top-right" />;
};

export default GlobalToast;
