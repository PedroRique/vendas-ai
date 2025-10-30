# Sistema de Vendas AI - Frontend

Este é o frontend do sistema de vendas integrado com a API do sistema legado AngularJS.

## 🚀 Funcionalidades

- **Autenticação completa** integrada com os endpoints do sistema antigo
- **Primeiro acesso** com criação de senha
- **Gerenciamento de estado** reativo para autenticação
- **Interface moderna** com PrimeReact
- **Responsivo** e otimizado para mobile

## 🔧 Configuração

### Endpoints da API

O sistema está configurado para usar os mesmos endpoints do sistema AngularJS:

- **Desenvolvimento**: `//localhost:5000/api/`
- **Homologação**: `//apibookinghmg.zoss.com.br/api/`
- **Produção**: `https://apibooking.zoss.com.br/api/`

### Endpoints utilizados

- `POST /login/efetuar` - Login do usuário
- `GET /login/ehPrimeiroAcesso/{login}` - Verificar primeiro acesso
- `POST /usuarios/cadastrarPrimeiraSenha` - Criar senha no primeiro acesso

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── LoginForm.tsx      # Formulário de login
│   ├── LoginForm.scss     # Estilos do login
│   ├── Dashboard.tsx      # Dashboard após login
│   └── Dashboard.scss     # Estilos do dashboard
├── services/
│   ├── api.ts            # Serviço de API
│   └── auth.ts           # Serviço de autenticação
├── hooks/
│   └── useAuth.ts        # Hook personalizado para auth
├── config/
│   └── environment.ts    # Configurações de ambiente
└── App.tsx              # Componente principal
```

## 🔐 Autenticação

### Login Normal
1. Usuário digita login e senha
2. Sistema verifica credenciais na API
3. Se válido, usuário é redirecionado para o dashboard

### Primeiro Acesso
1. Usuário digita login
2. Sistema verifica se é primeiro acesso
3. Se sim, exibe formulário para criar senha
4. Após criar senha, faz login automaticamente

## 🎨 Componentes

### LoginForm
- Formulário de login com validação
- Suporte a primeiro acesso
- Estados de loading e erro
- Interface responsiva

### Dashboard
- Exibe informações do usuário logado
- Botão de logout
- Interface moderna e limpa

## 🔧 Serviços

### ApiService
- Cliente HTTP para comunicação com a API
- Headers de autenticação automáticos
- Tratamento de erros centralizado

### AuthService
- Gerenciamento de estado de autenticação
- Persistência no localStorage
- Sistema de notificações reativas

### useAuth Hook
- Hook personalizado para facilitar uso da autenticação
- Estado reativo
- Métodos de login/logout

## 🌐 Configuração de Ambiente

O sistema detecta automaticamente o ambiente baseado na URL:

- **localhost** → Desenvolvimento
- **hmg, 127, fera, crmhmg, carrentalzchat** → Homologação  
- **chat, local, zoss, crm, zoss-movida** → Produção

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Componentes adaptáveis

## 🚀 Deploy

O sistema está pronto para deploy em qualquer ambiente que suporte aplicações React/Vite.

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente, pois a configuração é automática baseada na URL.

## 🔒 Segurança

- Tokens de autenticação seguros
- Headers de origem e token configurados
- Validação de entrada
- Sanitização de dados

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do sistema legado ou entre em contato com a equipe de desenvolvimento.