# FinanceAI

Uma plataforma inovadora de gestão financeira que utiliza inteligência artificial para monitorar movimentações, fornecer insights personalizados e ajudar você a controlar seu orçamento de forma eficiente e intuitiva.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Clerk** - Autenticação e autorização
- **Zod** - Validação de schemas
- **ShadCN (Radix UI/Recharts)** - Componentes primitivos acessíveis/Biblioteca de gráficos

## 💻 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/financeai.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🗺️ Roadmap

### MVP 1.0 - Base (Concluído) ✅

- [x] **Autenticação e Autorização**
  - Integração com o Clerk
  - Verificação de autorização em ações sensíveis
- [x] **Gerenciamento de Transações**
  - Endpoint para criar/atualizar transações com validação Zod
  - Modelo de dados completo no Prisma
- [x] **Visualização Básica**
  - Gráfico de pizza para transações
  - Tooltips informativos

### MVP 1.1 - Aprimoramentos (Em Desenvolvimento) 🚧

- [ ] **Dashboard Essencial**
  - Resumo mensal de transações
  - Filtros básicos de busca
- [ ] **Exportação Básica**
  - Exportação para CSV
  - Relatórios simples por categoria

### MVP 1.2 - Melhorias (Planejado) 📋

- [ ] **UX e Performance**
  - Otimização de consultas ao banco
  - Design responsivo

### Versão 2.0 (Futuro) 🔮

- [ ] **Recursos Avançados**
  - Integração com APIs bancárias
  - Sistema de notificações
  - Verificação em duas etapas
  - Temas personalizados

## 📚 Features Atuais

1. **Autenticação e Autorização**

   - Sistema seguro via Clerk
   - Proteção de rotas e ações sensíveis

2. **Gerenciamento de Transações**

   - CRUD completo de transações
   - Categorização automática
   - Múltiplos métodos de pagamento
   - Validações robustas com Zod

3. **Visualização de Dados**

   - Gráficos interativos com Recharts
   - Dashboard intuitivo
   - Tooltips informativos

4. **Banco de Dados**

   - Modelagem eficiente com Prisma
   - PostgreSQL como banco principal

5. **Webhooks**
   - Integração com Stripe
   - Processamento de eventos em tempo real

## 📝 Licença

Este projeto está licenciado sob a **GNU Affero General Public License v3.0 (AGPLv3)**.  
Isso significa que qualquer pessoa pode usar, modificar e distribuir este código, desde que todas as versões derivadas também sejam disponibilizadas publicamente sob a mesma licença.  

Para mais detalhes, veja o arquivo [LICENSE](./LICENSE).


## 👨‍💻 Autor

- [Gabriel dos Prazeres](https://github.com/gabrieldosprazeres)

---

Feito com 💙 pela equipe FinanceAI
