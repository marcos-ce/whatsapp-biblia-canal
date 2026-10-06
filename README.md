# 📖 WhatsApp Bíblia Canal

Bot 100% autônomo e independente para envio diário de versículos bíblicos formatados para **Canais do WhatsApp (Newsletters)** ou **Grupos Fechados de Avisos**.

---

### ✨ Características

* **2 Postagens Diárias Automáticas:**
  * ☀️ **06:00 da manhã (Bom Dia):** Versículos de ânimo, força, esperança e sabedoria para começar o dia.
  * 🌙 **18:00 da noite (Boa Noite):** Versículos de paz, descanso, proteção e gratidão pelo dia que passou.
* **Zero Inteligência Artificial:** Versículos 100% reais e autênticos da Bíblia Sagrada (NVI / Almeida), com livro, capítulo e referência exatos.
* **Isolamento Total:** Projeto e repositório completamente separados da operação de vendas. Não toca em pagamentos, pedidos ou clientes.
* **Multi-Dispositivos:** Conecta-se ao mesmo número de WhatsApp como um aparelho adicional (sem deslogar o bot de vendas).
* **Trava de Segurança:** Impossibilitado por código de enviar mensagens para contatos individuais ou ler conversas privadas.
* **Sem repetições:** Histórico inteligente em `data/history.json` para não repetir versículos recentes.
* **Disparo manual sob demanda:** Teste imediato a qualquer hora (`npm run post-now`).

---

### 🚀 Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   Edite com as informações do seu canal:
   ```env
   CHANNEL_JID=120363xxxxxxxxxxxx@newsletter
   CHANNEL_NAME="Palavra Diária"
   MORNING_HOUR=6
   MORNING_MINUTE=0
   EVENING_HOUR=18
   EVENING_MINUTE=0
   ```

3. **Iniciar o bot (para escanear o QR Code):**
   ```bash
   npm run dev
   ```
   * Abra o WhatsApp no celular: **Aparelhos Conectados > Conectar Aparelho** e escaneie.

4. **Testar envio imediato:**
   ```bash
   npm run post-now
   # ou especificando o período:
   npm run post-now manha
   npm run post-now noite
   ```

---

### 🛡️ Rodando em Produção na VPS com PM2 (Blindagem de Memória)

```bash
npm run build
pm2 start dist/index.js --name "whatsapp-biblia-canal" --max-memory-restart 100M --node-args="--max-old-space-size=96"
pm2 save
```
