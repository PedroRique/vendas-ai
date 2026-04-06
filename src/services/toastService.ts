type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

interface ToastMessage {
  severity: ToastSeverity;
  summary: string;
  detail: string;
  life?: number;
}

type ToastListener = (message: ToastMessage) => void;

class ToastService {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(message: ToastMessage): void {
    this.listeners.forEach((listener) => listener(message));
  }

  success(summary: string, detail: string, life?: number): void {
    this.emit({ severity: 'success', summary, detail, life });
  }

  info(summary: string, detail: string, life?: number): void {
    this.emit({ severity: 'info', summary, detail, life });
  }

  warn(summary: string, detail: string, life?: number): void {
    this.emit({ severity: 'warn', summary, detail, life });
  }

  error(summary: string, detail: string, life?: number): void {
    this.emit({ severity: 'error', summary, detail, life: life ?? 8000 });
  }

  apiError(errorMessage: string, errorCode?: string): void {
    const summary = 'Erro na API';
    const detail = errorCode ? `[${errorCode}] ${errorMessage}` : errorMessage;
    this.error(summary, detail);
  }
}

export const toastService = new ToastService();
