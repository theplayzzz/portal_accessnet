export type OpaEnvelope<T> = {
  status: "success" | "error";
  code: number;
  data: T;
  description?: string;
};

export type OpaFone = {
  _id?: string;
  numero: string;
  tipo: string;
  whatsapp?: boolean;
  celular?: boolean;
};

export type OpaContato = {
  _id: string;
  nome: string;
  email_principal?: string;
  username?: string;
  fones?: OpaFone[];
  lead?: boolean | string;
};

export type OpaCreateContatoInput = {
  nome: string;
  email_principal: string;
  username: string;
  celularCompleto: string;
  WhatsappCompleto: string;
  requerAutenticacaoSempre: boolean;
  habilitarAlerta: boolean;
  lead: "true" | "false";
  historico_email: boolean;
  senha: string;
  repetirSenha: string;
};

export type OpaTemplateSendInput = {
  contato: { canalCliente: string };
  template: { _id: string; variaveis?: string[] };
  canal: string;
  metadata?: Record<string, unknown>;
  allowSendingToStartedCustomerService?: boolean;
};

export type OpaTemplateSendResponse = {
  message: string;
  messageSentId: string;
};
