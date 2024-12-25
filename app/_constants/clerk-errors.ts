export const CLERK_ERRORS = {
  // Authentication
  not_allowed_access: "Acesso não permitido",
  authentication_invalid: "Autenticação inválida",
  token_expired: "Sessão expirada, faça login novamente",
  network_error: "Erro de conexão, verifique sua internet",

  // Sign-up
  form_identifier_exists: "Este e-mail já está cadastrado",
  form_password_length_too_short: "A senha deve conter no mínimo 8 caracteres",
  form_password_insufficient_complexity:
    "A senha deve conter letras, números e caracteres especiais",
  form_identifier_not_found: "E-mail não encontrado",

  // Sign-in
  form_code_incorrect: "Código incorreto",
  form_password_incorrect: "Senha incorreta",
  form_identifier_invalid: "E-mail inválido",
  rate_limit_exceeded: "Muitas tentativas, tente novamente mais tarde",

  // Social
  social_provider_error: "Erro ao conectar com provedor social",
  oauth_access_denied: "Acesso negado pelo provedor social",

  // General
  invalid_request: "Requisição inválida",
  internal_server_error: "Erro interno do servidor",
  session_exists: "Já existe uma sessão ativa",
  verification_expired: "Verificação expirada, tente novamente",
};
