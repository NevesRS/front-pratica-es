# Serviço de Registro de Adotantes

## Implementação Completa

Foi criado um serviço completo para registro de novos adotantes na aplicação, seguindo o padrão da API fornecida.

## Endpoint da API

```bash
POST http://127.0.0.1:8000/api/adotante/
Content-Type: application/json

{
  "nome": "",
  "email": "",
  "telefone": ""
}
```

## Arquivos Modificados/Criados

### 1. **config/api.ts**
Adicionado endpoint de registro:
```typescript
ENDPOINTS: {
    TOKEN: '/api/token/',
    TOKEN_REFRESH: '/api/token/refresh/',
    REGISTER: '/api/adotante/',  // NOVO
}
```

### 2. **services/authService.ts**

#### Interfaces Criadas:
```typescript
interface RegisterData {
    nome: string;
    email: string;
    telefone: string;
}

interface RegisterResponse {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    message?: string;
}
```

#### Método register():
```typescript
async register(data: RegisterData): Promise<RegisterResponse>
```

**Funcionalidades:**
- ✅ Timeout de 10 segundos para evitar loading infinito
- ✅ Tratamento específico de erros HTTP (400, 409, 500+)
- ✅ Validação de campos (email, telefone, nome)
- ✅ Mensagens de erro amigáveis e específicas
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros de rede e timeout

### 3. **components/auth/RegisterForm.tsx**

**Mudanças:**
- ✅ Importado `authService`
- ✅ Adicionado prop `onSuccess` opcional
- ✅ Adicionado estado `isLoading`
- ✅ Função `handleSubmit` agora é assíncrona
- ✅ Integração com serviço de registro
- ✅ Botão mostra estado de loading
- ✅ Limpa formulário após sucesso

**Validações:**
- Campos obrigatórios (nome, email, telefone, senha)
- Email válido (contém @)
- Senha com mínimo 6 caracteres

### 4. **components/auth/SuccessScreen.tsx** (NOVO)

Tela de sucesso para após cadastro:
```typescript
interface SuccessScreenProps {
    successMessage: string;
    onContinue: () => void;
    autoReturnDelay?: number;
}
```

**Funcionalidades:**
- ✅ Ícone de sucesso verde
- ✅ Mensagem personalizável
- ✅ Contador regressivo para redirecionamento
- ✅ Botão "Fazer Login"
- ✅ Auto-retorno configurável (padrão: 3s)

## Tratamento de Erros

### Erros de Validação (400)
```
"E-mail já cadastrado ou inválido."
"Telefone inválido."
"Nome inválido."
"Dados inválidos. Verifique as informações fornecidas."
```

### Conflito (409)
```
"Usuário já existe com esse e-mail."
```

### Erros de Servidor (500+)
```
"Erro interno do servidor. Tente novamente mais tarde."
```

### Erros de Rede
```
"Erro de conexão. Verifique sua internet e tente novamente."
"Timeout: A conexão demorou muito para responder. Tente novamente."
```

## Fluxo de Cadastro

### 1. **Preenchimento do Formulário**
```
[Nome Completo]
[Telefone]
[E-mail]
[Senha]
[Botão: CADASTRAR]
```

### 2. **Durante o Cadastro**
```
[Botão: CADASTRANDO...]  (disabled)
```

### 3. **Sucesso**
Opção 1: Chama `onSuccess()` se fornecido
Opção 2: Chama `onBackClick()` para voltar

### 4. **Erro**
```
[Popup de Erro]
- Ícone de alerta
- Mensagem específica do erro
- Auto-fecha em 5 segundos
```

## Como Usar

### Uso Básico no RegisterForm
```typescript
// Já está integrado!
// O formulário já chama o serviço automaticamente
```

### Uso Direto do Serviço
```typescript
import { authService } from '../services/authService';

try {
    const response = await authService.register({
        nome: "João Silva",
        email: "joao@example.com",
        telefone: "11999999999"
    });

    console.log('Usuário cadastrado:', response);
} catch (error) {
    console.error('Erro no cadastro:', error.message);
}
```

### Exemplo com SuccessScreen
```typescript
import SuccessScreen from '../components/auth/SuccessScreen';

// Em um componente
{isSuccessView && (
    <SuccessScreen
        successMessage="Sua conta foi criada com sucesso! Agora você pode fazer login."
        onContinue={handleGoToLogin}
        autoReturnDelay={4000}
    />
)}
```

## Logs de Debug

### Cadastro Bem-sucedido:
```
RegisterForm: Cadastro realizado com sucesso: {id: 1, nome: "João Silva", email: "joao@example.com", ...}
AuthService: Cadastro realizado com sucesso: {...}
```

### Cadastro com Erro:
```
AuthService: Resposta de registro recebida, status: 400
AuthService: Dados de erro da API: {email: ["Este campo deve ser único."]}
AuthService: Lançando erro com mensagem: E-mail já cadastrado ou inválido.
RegisterForm: Erro ao cadastrar: Error: E-mail já cadastrado ou inválido.
```

## Integração com a Aplicação

Para integrar completamente na aplicação principal (`app/page.tsx`), você pode:

1. **Adicionar estado de sucesso:**
```typescript
const [isSuccessView, setIsSuccessView] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
```

2. **Adicionar handler de sucesso:**
```typescript
const handleRegisterSuccess = () => {
    setSuccessMessage('Sua conta foi criada! Você pode fazer login agora.');
    setIsSuccessView(true);
    setIsRegisterView(false);
};
```

3. **Passar para RegisterForm:**
```typescript
<RegisterForm
    onBackClick={handleBackFromRegister}
    onSuccess={handleRegisterSuccess}
/>
```

4. **Adicionar na renderização:**
```typescript
{isSuccessView ? (
    <SuccessScreen
        successMessage={successMessage}
        onContinue={handleLoginClick}
        autoReturnDelay={4000}
    />
) : isRegisterView ? (
    <RegisterForm
        onBackClick={handleBackFromRegister}
        onSuccess={handleRegisterSuccess}
    />
) : ...
```

## Próximos Passos Sugeridos

1. ✅ Adicionar validação de formato de telefone
2. ✅ Adicionar máscara no campo de telefone
3. ✅ Implementar verificação de força de senha
4. ✅ Adicionar confirmação de senha
5. ✅ Enviar email de confirmação (se a API suportar)
6. ✅ Fazer login automático após cadastro
