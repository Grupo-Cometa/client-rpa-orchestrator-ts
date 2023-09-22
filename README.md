# Client RPA Orchestrator TS

`grupo-cometa-client-rpa-orchestrator-ts` é uma biblioteca para gerenciamento de RPAs typescript com o orquestrador.

## 📦 Instalação

```bash

npm install grupo-cometa-client-rpa-orchestrator-ts

```
## 🔨 Como usar

- Crie um arquivo .env com as seguintes variáveis de ambente

#### Environment Variables

```
DEBUG=
PUBLIC_ID=
AMQP_URL=
WS_URL=
```

#### Funções de Interação com o Orquestrador Disponíveis:

### Log

```javascript

import { Log } from "client-rpa-orchestrator-ts";

const message = 'Mensagem do Log';

await Log.write('success', message);

//Tipos de log disponíveis: success, warning, error, info

```