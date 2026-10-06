# 📖 WhatsApp Bíblia Canal

Bot 100% autônomo e independente para envio diário de versículos bíblicos formatados para **Canais do WhatsApp (Newsletters)** ou **Grupos Fechados de Avisos**.

---

### ✨ Características

* **2 Postagens Diárias Automáticas com Foto HD:**
  * ☀️ **06:00 da manhã (Bom Dia):** Foto HD do amanhecer + mensagem acolhedora de fé e ânimo para o dia.
  * 🌙 **18:00 da noite (Boa Noite):** Foto HD do entardecer + mensagem acolhedora de paz, alívio e descanso.
* **100% Humano e Sem Robôs:** Sem linhas mecânicas (`━━━━━━`), sem etiquetas de banco (`Tema:`), com tom pastoral e acolhedor.
* **Zero Inteligência Artificial:** Versículos 100% reais e autênticos da Bíblia Sagrada (NVI / Almeida).
* **Isolamento Total:** Projeto e repositório completamente separados da operação de vendas.
* **Multi-Dispositivos:** Conecta-se ao mesmo número de WhatsApp como um aparelho adicional sem deslogar o bot de vendas.
* **Trava de Segurança:** Impossibilitado por código de enviar mensagens para contatos individuais ou ler conversas de clientes.
* **Comandos Privados para Testar a Qualquer Hora:** Envie `/postar`, `/bomdia` ou `/boanoite` direto no WhatsApp para disparar na hora sem esperar o relógio!

---

### 🎮 Comandos Secretos pelo WhatsApp (Para Testar Imediatamente)

Basta abrir o WhatsApp e mandar uma mensagem para **você mesmo** (ou do seu celular pessoal para o número do bot):

* **/postar** — Posta imediatamente o devocional de acordo com a hora atual (com a Foto HD).
* **/bomdia** — Força o envio imediato da postagem matinal de Bom Dia.
* **/boanoite** — Força o envio imediato da postagem noturna de Boa Noite.
* **/status** — Mostra o canal conectado e os próximos horários agendados.

*(Clientes e pessoas desconhecidas são 100% ignoradas e não têm acesso a esses comandos).*

---

### 🚀 Instalação e Execução na VPS

1. **Instalar dependências e compilar:**
   ```bash
   cd whatsapp-biblia-canal
   git pull
   npm install
   npm run build
   ```

2. **Iniciar no PM2 (com proteção de memória):**
   ```bash
   pm2 start dist/index.js --name "whatsapp-biblia-canal" --max-memory-restart 100M --node-args="--max-old-space-size=96"
   pm2 save
   ```

3. **Disparo manual via terminal (opcional):**
   ```bash
   npm run post-now manha
   npm run post-now noite
   ```
