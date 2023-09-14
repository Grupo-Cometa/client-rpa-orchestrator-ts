# Client RPA Orchestrator TS

`grupo-cometa-client-rpa-orchestrator-ts` é uma biblioteca para gerenciamento de RPAs typescript com o orquestrador.

## 📦 Instalação

```bash

npm install grupo-cometa-client-rpa-orchestrator-ts

```
## 🔨 How to Usage

- Crie um arquivo .env com as seguintes variáveis de ambente

#### Environment Variables

```
DEBUG=
PUBLIC_ID=
AMQP_URL=
WS_URL=
```

#### Para usar a biblioteca siga o exemplo:

```javascript

const { Log } = require("grupo-cometa-orchestrator-logs");

const message = 'Log message';

Log.send(message, 'INFO');

//Logs types includes INFO, WARNING, ERROR, CRITICAL

```