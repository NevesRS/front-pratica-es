# Componentes de Popup - Documentação

## Visão Geral

Os componentes `ErrorPopup` e `SuccessPopup` foram criados para fornecer feedback visual atrativo e consistente para o usuário em situações de erro e sucesso, respectivamente.

## Componentes Criados

### 1. ErrorPopup
- **Localização**: `components/ui/ErrorPopup.tsx`
- **Propósito**: Exibir mensagens de erro de forma elegante
- **Uso**: Principalmente para erros de autenticação, validação de formulários e falhas de API

### 2. SuccessPopup
- **Localização**: `components/ui/SuccessPopup.tsx`
- **Propósito**: Exibir mensagens de sucesso
- **Uso**: Para confirmações de operações bem-sucedidas

## Funcionalidades dos Popups

### Características Visuais
- **Design moderno**: Interface limpa com sombras e bordas arredondadas
- **Ícones**: Ícones SVG indicativos (aviso para erro, check para sucesso)
- **Cores temáticas**: Vermelho para erros, verde para sucessos
- **Backdrop**: Fundo escuro semi-transparente

### Funcionalidades Interativas
- **Auto-close**: Fecha automaticamente após um tempo configurável
- **Barra de progresso**: Mostra visualmente o tempo restante para fechamento automático
- **Botão de fechar**: Ícone X no canto superior direito
- **Fechar por clique**: Clique no backdrop fecha o popup
- **Botão de ação**: Botão principal para interação do usuário

## Como Usar

### Exemplo com ErrorPopup

```tsx
import React, { useState } from 'react';
import ErrorPopup from '../ui/ErrorPopup';

function MinhaComponent() {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleError = (message: string) => {
        setErrorMessage(message);
        setShowError(true);
    };

    return (
        <div>
            {/* Seu conteúdo aqui */}

            <ErrorPopup
                isVisible={showError}
                message={errorMessage}
                onClose={() => {
                    setShowError(false);
                    setErrorMessage('');
                }}
                autoClose={true}
                autoCloseDelay={5000}
            />
        </div>
    );
}
```

### Exemplo com SuccessPopup

```tsx
import React, { useState } from 'react';
import SuccessPopup from '../ui/SuccessPopup';

function MinhaComponent() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccess(true);
    };

    return (
        <div>
            {/* Seu conteúdo aqui */}

            <SuccessPopup
                isVisible={showSuccess}
                message={successMessage}
                onClose={() => {
                    setShowSuccess(false);
                    setSuccessMessage('');
                }}
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    );
}
```

## Propriedades (Props)

### ErrorPopup & SuccessPopup

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|-------------|------|-------------|---------|-----------|
| `isVisible` | boolean | ✅ | - | Controla se o popup está visível |
| `message` | string | ✅ | - | Mensagem a ser exibida no popup |
| `onClose` | () => void | ✅ | - | Função chamada quando o popup é fechado |
| `autoClose` | boolean | ❌ | true | Se o popup deve fechar automaticamente |
| `autoCloseDelay` | number | ❌ | 4000 (erro) / 3000 (sucesso) | Tempo em ms para fechamento automático |

## Implementações Atuais

### LoginPage
- **Arquivo**: `components/auth/LoginPage.tsx`
- **Uso**: Exibe erro quando credenciais estão incorretas ou campos obrigatórios não preenchidos
- **Mensagens**:
  - "Por favor, preencha todos os campos"
  - "Credenciais incorretas. Verifique seu e-mail e senha."

### RegisterForm
- **Arquivo**: `components/auth/RegisterForm.tsx`
- **Uso**: Exibe erro em validações de formulário
- **Mensagens**:
  - "Por favor, preencha todos os campos obrigatórios."
  - "Por favor, insira um e-mail válido."
  - "A senha deve ter pelo menos 6 caracteres."

## Melhorias Futuras

1. **Posicionamento**: Adicionar opções de posicionamento (top, bottom, center)
2. **Tipos de erro**: Diferentes estilos para warning, info, error
3. **Som**: Adicionar feedback sonoro opcional
4. **Animações**: Melhorar animações de entrada e saída
5. **Acessibilidade**: Adicionar suporte para screen readers

## Considerações Técnicas

- **Z-index**: Os popups usam `z-50` para garantir que apareçam sobre outros elementos
- **Responsive**: Totalmente responsivos com max-width e margens adaptáveis
- **Performance**: Usando `useEffect` para gerenciar timers de forma eficiente
- **TypeScript**: Totalmente tipado para melhor experiência de desenvolvimento
