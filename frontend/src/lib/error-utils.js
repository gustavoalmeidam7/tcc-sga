import { toast } from "sonner";

export function extractErrorMessage(error, defaultMessage = "Ocorreu um erro") {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((err) => {
          const field = err.loc ? err.loc.slice(1).join(".") : "campo";
          let message = err.msg;

          if (message.includes("Input should be a valid UUID")) {
            message = "ID inválido. O formato do identificador está incorreto.";
          } else if (message.includes("value_error")) {
            message = message.replace(/value_error\.\w+\./, "");
            message = message.replace(
              /Input should be a valid /,
              "Valor inválido para "
            );
            message = message.replace(
              /invalid character: expected .* found `(\w+)` at \d+/,
              "caractere inválido: '$1'"
            );
          }

          return `${field}: ${message}`;
        })
        .join("; ");
    }

    if (typeof detail === "string") {
      if (detail.includes("Input should be a valid UUID")) {
        return "ID inválido. O formato do identificador está incorreto.";
      }
      return detail;
    }
  }

  if (error.response?.data?.Erros) {
    const erros = error.response.data.Erros;

    if (typeof erros === "object" && !Array.isArray(erros)) {
      return Object.entries(erros)
        .map(([campo, msg]) => `${campo}: ${msg}`)
        .join("; ");
    }

    if (Array.isArray(erros)) {
      return erros.join("; ");
    }

    if (typeof erros === "string") {
      return erros;
    }
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    if (error.message.includes("Network Error")) {
      return "Erro de conexão. Verifique sua internet.";
    }
    if (error.message.includes("timeout")) {
      return "Tempo limite excedido. Tente novamente.";
    }
    return error.message;
  }

  return defaultMessage;
}

export function showErrorToast(error, title = "Erro", options = {}) {
  const {
    defaultMessage,
    duration = 5000,
    action,
    dismissible = true,
    ...otherOptions
  } = options;

  const message = extractErrorMessage(error, defaultMessage);

  toast.error(title, {
    description: message,
    duration,
    action,
    dismissible,
    ...otherOptions,
  });
}

export function showSuccessToast(title, options = {}) {
  const { description, duration = 4000, action, ...otherOptions } = options;

  toast.success(title, {
    description,
    duration,
    action,
    ...otherOptions,
  });
}

export function showWarningToast(title, options = {}) {
  const { description, duration = 4000, action, ...otherOptions } = options;

  toast.warning(title, {
    description,
    duration,
    action,
    ...otherOptions,
  });
}

export function showInfoToast(title, options = {}) {
  const { description, duration = 4000, action, ...otherOptions } = options;

  toast.info(title, {
    description,
    duration,
    action,
    ...otherOptions,
  });
}
