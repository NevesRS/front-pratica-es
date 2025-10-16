# Sistema de Logout - Documentação

## Funcionalidade Implementada

O sistema de logout foi melhorado para garantir que quando o usuário clica em "SAIR", ele seja automaticamente redirecionado para a tela inicial (PESQUISAR PETS) e o menu seja atualizado corretamente.

## Fluxo do Logout

### 1. **Botão SAIR no Navbar**
- Localização: Aparece apenas quando o usuário está logado
- Ação: Chama a função `handleLogout()` no componente Navbar

### 2. **Função handleLogout() no Navbar**
```typescript
const handleLogout = () => {
    console.log('Navbar: Executando logout');
    logout(() => {
        console.log('Navbar: Callback de logout executado, redirecionando para home');
        if (onLogoutCallback) {
            onLogoutCallback();
        } else {
            onHomeClick(); // Fallback para voltar ao home
        }
    });
};
```

### 3. **Função logout() no AuthContext**
```typescript
const logout = (onLogoutCallback?: () => void) => {
    console.log('AuthContext: Fazendo logout');
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);

    // Executa o callback de logout se fornecido
    if (onLogoutCallback) {
        console.log('AuthContext: Executando callback de logout');
        onLogoutCallback();
    }
};
```

### 4. **Função logout() no AuthService**
```typescript
logout(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}
```

### 5. **Callback de Redirecionamento**
- O callback `onLogoutCallback` passado do page.tsx é a função `handleHomeClick()`
- Esta função reseta todos os estados de visualização para mostrar a tela inicial

## O que Acontece ao Fazer Logout

### ✅ **Estados Limpos:**
1. **Tokens de autenticação** removidos do localStorage
2. **Estado de login** (`isLoggedIn`) definido como `false`
3. **Dados do usuário** (`user`) definidos como `null`
4. **Estados de navegação** resetados para mostrar tela inicial

### ✅ **Interface Atualizada:**
1. **Navbar** atualiza automaticamente:
   - Remove o botão "SAIR"
   - Remove o link "MEUS PETS"
   - Mostra botões "LOGIN" e "CADASTRAR-SE"
2. **Tela atual** muda para "PESQUISAR PETS"
3. **Menu ativo** volta para "PESQUISAR"

## Componentes Modificados

### 1. **AuthContext.tsx**
- ✅ Adicionado parâmetro opcional `onLogoutCallback` na função logout
- ✅ Callback executado após limpeza dos dados de autenticação

### 2. **Navbar.tsx**
- ✅ Adicionado prop `onLogoutCallback` ao tipo NavbarProps
- ✅ Criada função `handleLogout()` que chama logout com callback
- ✅ Botão SAIR agora usa `handleLogout()` em vez de `logout()` diretamente

### 3. **app/page.tsx**
- ✅ Adicionado `onLogoutCallback={handleHomeClick}` nos componentes Navbar
- ✅ Garante redirecionamento automático para tela inicial

## Como Testar

### **Cenário 1: Logout da Tela de Pesquisa**
1. Fazer login na aplicação
2. Verificar que está na tela "PESQUISAR PETS"
3. Clicar no botão "SAIR"
4. **Resultado esperado**: Continua na tela "PESQUISAR PETS" mas agora deslogado

### **Cenário 2: Logout da Tela "MEUS PETS"**
1. Fazer login na aplicação
2. Navegar para "MEUS PETS"
3. Clicar no botão "SAIR"
4. **Resultado esperado**: Redirecionado para "PESQUISAR PETS" e deslogado

### **Logs Esperados:**
```
Navbar: Executando logout
AuthContext: Fazendo logout
AuthContext: Executando callback de logout
Navbar: Callback de logout executado, redirecionando para home
```

## Estados da Interface

### **Antes do Logout (Usuário Logado):**
- Navbar mostra: Logo | MEUS PETS | PESQUISAR | [SAIR]
- Acesso a todas as funcionalidades

### **Após o Logout (Usuário Deslogado):**
- Navbar mostra: Logo | PESQUISAR | [LOGIN] [CADASTRAR-SE]
- Tela atual: PESQUISAR PETS
- Sem acesso a "MEUS PETS"

## Melhorias Futuras

1. **Confirmação de logout**: Modal perguntando se realmente quer sair
2. **Mensagem de sucesso**: Toast/popup confirmando logout realizado
3. **Redirecionamento inteligente**: Lembrar última página visitada válida
4. **Logout automático**: Por inatividade ou expiração de token
5. **Limpeza de dados**: Cache de dados do usuário e formulários
