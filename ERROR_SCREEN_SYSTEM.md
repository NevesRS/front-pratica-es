# Sistema de Tela de Erro para Login - Documentação

## Nova Abordagem Implementada

Substituímos o sistema de popup de erro por uma **tela de erro dedicada** que segue o fluxo:

```
Tela de Login → Loading → Tela de Erro → Volta para Login
```

## Fluxo Completo

### 1. **Tela de Login**
- Usuário preenche credenciais e clica "ENTRAR"
- Mostra loading enquanto processa
- Se houver erro, chama `onError(errorMessage)`

### 2. **Tela de Loading**
- Aparece automaticamente via `isLoading` do AuthContext
- Mostra spinner de carregamento
- Permanece até a resposta da API

### 3. **Tela de Erro**
- Aparece quando há erro de login
- Mostra ícone de erro, título e mensagem específica
- Contador regressivo de 4 segundos
- Botão "Tentar Novamente" para retorno manual

### 4. **Retorno ao Login**
- Automático após 4 segundos
- Manual via botão "Tentar Novamente"
- Limpa estados de erro

## Componentes Criados/Modificados

### 1. **ErrorScreen.tsx** (NOVO)
```typescript
interface ErrorScreenProps {
    errorMessage: string;      // Mensagem de erro específica
    onRetry: () => void;       // Callback para voltar ao login
    autoReturnDelay?: number;  // Tempo até retorno automático (padrão: 3s)
}
```

**Funcionalidades:**
- ✅ Ícone de erro visual
- ✅ Título e mensagem personalizáveis
- ✅ Contador regressivo em tempo real
- ✅ Botão para retorno manual
- ✅ Auto-retorno configurável

### 2. **LoginPage.tsx** (MODIFICADO)
```typescript
interface LoginPageProps {
    onBackClick?: () => void;
    onRegisterClick?: () => void;
    onError?: (errorMessage: string) => void;  // NOVO: Callback de erro
}
```

**Mudanças:**
- ❌ Removido estado `error` e `showErrorPopup`
- ❌ Removido componente `ErrorPopup`
- ✅ Adicionado callback `onError`
- ✅ Chamada do callback em caso de erro

### 3. **app/page.tsx** (MODIFICADO)
```typescript
// Novos estados
const [isErrorView, setIsErrorView] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

// Novas funções
const handleLoginError = (error: string) => void;
const handleRetryLogin = () => void;
```

**Lógica de Renderização:**
```typescript
{isErrorView ? (
    <ErrorScreen
        errorMessage={errorMessage}
        onRetry={handleRetryLogin}
        autoReturnDelay={4000}
    />
) : isLoginView ? (
    <LoginPage
        onError={handleLoginError}
        // ... outras props
    />
) : (
    // ... outras telas
)}
```

## Tipos de Erro Tratados

### **Erros de Validação**
```
"Por favor, preencha todos os campos"
```

### **Erros de Autenticação**
```
"Credenciais incorretas. Verifique seu e-mail e senha."
"Usuário não encontrado."
```

### **Erros de Rede**
```
"Erro de conexão. Verifique sua internet e tente novamente."
"Timeout: A conexão demorou muito para responder. Tente novamente."
```

### **Erros de Servidor**
```
"Erro interno do servidor. Tente novamente mais tarde."
```

## Estados da Interface

### **Estado Normal (Login)**
```
[Formulário de Login]
[Botão: ENTRAR]
```

### **Estado Loading**
```
[Spinner animado]
"Carregando..."
```

### **Estado de Erro**
```
[Ícone de erro]
"Erro ao fazer login"
[Mensagem específica do erro]
[Botão: Tentar Novamente]
[Contador: "Retornando para o login em: 3 segundos"]
```

## Logs de Debug

### **Fluxo Normal:**
```
LoginPage: Iniciando handleLogin
LoginPage: Chamando login com: {email: "user@test.com", password: "***"}
AuthService: Resposta recebida, status: 401
LoginPage: Erro capturado no handleLogin: Error: Credenciais incorretas...
LoginPage: Chamando callback de erro com: Credenciais incorretas...
HomeContent: Erro de login recebido: Credenciais incorretas...
ErrorScreen: Auto-retorno após 4000 ms
HomeContent: Voltando do erro para login
```

## Configurações

### **Tempo de Auto-retorno**
```typescript
// No app/page.tsx
<ErrorScreen
    autoReturnDelay={4000}  // 4 segundos (padrão: 3000)
/>
```

### **Mensagens Personalizadas**
```typescript
// Definidas no AuthService baseadas no status HTTP
401 → "Credenciais incorretas. Verifique seu e-mail e senha."
404 → "Usuário não encontrado."
500+ → "Erro interno do servidor. Tente novamente mais tarde."
```

## Vantagens da Nova Abordagem

✅ **Experiência mais fluida**: Sem popups intrusivos
✅ **Feedback claro**: Tela dedicada para erros
✅ **Auto-recuperação**: Retorno automático ao login
✅ **Flexibilidade**: Fácil personalização de mensagens
✅ **Consistência**: Mesmo padrão visual da tela de loading
✅ **Acessibilidade**: Melhor para leitores de tela
✅ **Mobile-friendly**: Funciona bem em dispositivos móveis

## Como Testar

1. **Erro de campos vazios**: Deixar campos em branco e clicar "ENTRAR"
2. **Erro de credenciais**: Inserir email/senha incorretos
3. **Erro de rede**: Desconectar internet e tentar login
4. **Retorno manual**: Clicar "Tentar Novamente" antes do tempo esgotar
5. **Retorno automático**: Aguardar 4 segundos sem interação
