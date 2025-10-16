# Serviço de Autenticação

Este projeto agora inclui um serviço de autenticação integrado que se conecta com a API backend.

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### URL da API

O serviço está configurado para usar os seguintes endpoints:

- **Login**: `POST /api/token/`
- **Refresh Token**: `POST /api/token/refresh/`

## 🚀 Como Usar

### 1. Login

O componente `LoginPage` agora captura credenciais reais e faz login via API:

```tsx
// O usuário insere email e senha
// O sistema faz POST para /api/token/
// Os tokens são armazenados no localStorage
```

### 2. Estado de Autenticação

O `AuthContext` foi atualizado para:

- ✅ Verificar autenticação ao carregar a app
- ✅ Mostrar loading durante verificação
- ✅ Gerenciar tokens automaticamente
- ✅ Fazer logout quando tokens expiram

### 3. Requisições Autenticadas

Use o hook `useAuthService` para fazer requisições autenticadas:

```tsx
import { useAuthService } from '../hooks/useAuthService';

function MyComponent() {
    const { makeAuthenticatedRequest } = useAuthService();

    const fetchData = async () => {
        try {
            const response = await makeAuthenticatedRequest('/api/data/');
            const data = await response.json();
        } catch (error) {
            console.error('Erro:', error);
        }
    };
}
```

## 🔐 Funcionalidades

### ✅ Implementado

- [x] Login com credenciais reais
- [x] Armazenamento seguro de tokens
- [x] Refresh automático de tokens
- [x] Logout automático em caso de erro
- [x] Loading states
- [x] Tratamento de erros
- [x] Verificação de autenticação na inicialização

### 🔄 Mantido

- [x] Lógica de telas com necessidade de login
- [x] Navegação entre telas
- [x] Mock data para demonstração
- [x] Interface de usuário existente

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

- `services/authService.ts` - Serviço principal de autenticação
- `hooks/useAuthService.ts` - Hook para requisições autenticadas
- `config/api.ts` - Configuração de URLs da API

### Arquivos Modificados

- `contexts/AuthContext.tsx` - Integração com serviço real
- `components/auth/LoginPage.tsx` - Captura de credenciais
- `app/page.tsx` - Loading state e estrutura

## 🧪 Testando

1. **Inicie o backend** na porta 8000
2. **Configure as variáveis** de ambiente
3. **Teste o login** com credenciais válidas
4. **Verifique** se os tokens são armazenados
5. **Teste** a navegação entre telas protegidas

## 🔧 Personalização

Para adaptar a outros backends:

1. **Ajuste** as interfaces em `authService.ts`
2. **Modifique** os endpoints em `config/api.ts`
3. **Adapte** a lógica de tokens conforme sua API

## 📝 Notas

- Os tokens são armazenados no `localStorage`
- O refresh é automático quando necessário
- Erros de autenticação fazem logout automático
- A interface mantém a mesma experiência de usuário
