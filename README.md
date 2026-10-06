# 📖 WhatsApp Bíblia Canal

Bot 100% autônomo e independente para envio diário de versículos bíblicos formatados para **Canais do WhatsApp (Newsletters)** ou **Grupos Fechados de Avisos**.

---

### ✨ Características

* **Zero Inteligência Artificial:** Versículos 100% reais e autênticos da Bíblia Sagrada (NVI / Almeida), com livro, capítulo e referência exatos.
* **Isolamento Total:** Projeto e repositório completamente separados da operação de vendas. Não toca em pagamentos, pedidos ou mensagens de clientes.
* **Multi-Dispositivos:** O WhatsApp permite até 4 aparelhos conectados simultaneamente. Este bot se conecta ao mesmo número de telefone como um dispositivo adicional sem deslogar o bot de vendas.
* **Agendamento Diário:** Disparo automático todo dia de manhã no horário configurado (ex: 06h30).
* **Sem repetições:** Histórico inteligente para rotacionar temas e versículos sem repetir passagens recentes.
* **Disparo manual sob demanda:** Script CLI para testar postagens imediatamente (`npm run post-now`).

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
   SCHEDULE_HOUR=6
   SCHEDULE_MINUTE=30
   ```

3. **Iniciar o bot:**
   ```bash
   npm run dev
   ```
   * Na primeira execução, um **QR Code** será exibido no terminal.
   * Abra o WhatsApp no celular: **Aparelhos Conectados > Conectar Aparelho** e escaneie.

4. **Testar envio imediato:**
   ```bash
   npm run post-now
   ```

---

### 🛡️ Rodando em Produção na VPS com PM2

```bash
npm run build
pm2 start dist/index.js --name "whatsapp-biblia-canal"
pm2 save
```
