import React, { useState } from "react";
import "./App.css";

const PRIVATE_RECEIVER_URL = "https://script.google.com/macros/s/AKfycbw_DMNa9nHm1_fP2vUjkKre7O24i8emH2y1jKTIUidIHFDUx9J9CqilAyZg7vE1l8STVA/exec";

const emptyForm = {
  funcao: "",
  nome: "",
  nascimento: "",
  endereco: "",
  cep: "",
  cpf: "",
  rg: "",
  pis: "",
  nomeMae: "",
  nomePai: "",
  telefone: "",
  banco: "",
  tipoConta: "Corrente",
  agencia: "",
  conta: "",
  pix: "",
};

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [record, setRecord] = useState(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const requiredFields = [
      "funcao",
      "nome",
      "nascimento",
      "cpf",
      "telefone",
      "banco",
      "tipoConta",
      "agencia",
      "conta",
      "pix",
    ];

    const missing = requiredFields.some((field) => !form[field]);

    if (missing) {
      alert("Preencha todos os campos obrigatórios marcados com *.");
      return;
    }

    const newRecord = {
      ...form,
      protocolo: String(Date.now()),
      dataCadastro: new Date().toLocaleString("pt-BR"),
      status: "Recebido",
    };

    setSending(true);
    setMessage("Enviando cadastro...");

    const result = await sendToPrivateBase(newRecord);

    setSending(false);
    setRecord(newRecord);
    setForm(emptyForm);
    setMessage(result.message);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function printReceipt() {
    window.print();
  }

  return (
    <div className="app">
      <div className="container">
        {!record && (
          <header className="hero no-print">
            <div className="eyebrow">🏢 Gi Group • Belém Filial 254 • HORECA</div>
            <h1>Cadastro de Diarista</h1>
            <p>
              Preencha seus dados com atenção. Você verá apenas o seu comprovante após o envio.
            </p>

            {message && <div className="notice">{message}</div>}
          </header>
        )}

        {record && (
          <section className="success no-print">
            <h2>✅ Cadastro recebido</h2>
            <p>
              Seu cadastro foi enviado. Baixe ou salve seu comprovante em PDF.
            </p>
            <div className="button-row">
              <button className="btn primary" onClick={printReceipt}>
                🖨️ Baixar comprovante em PDF
              </button>
              <button className="btn secondary" onClick={() => setRecord(null)}>
                Fazer novo cadastro
              </button>
            </div>
            {message && <div className="notice">{message}</div>}
          </section>
        )}

        {record ? (
          <Receipt record={record} />
        ) : (
          <main className="layout no-print">
            <section className="card">
              <h2>📝 Formulário de cadastro</h2>

              <form onSubmit={handleSubmit} className="form">
                <fieldset>
                  <legend>Dados profissionais</legend>
                  <Input required label="Função" name="funcao" value={form.funcao} onChange={handleChange} placeholder="Ex: Diarista, ASG, Auxiliar" />
                </fieldset>

                <fieldset>
                  <legend>Dados pessoais</legend>
                  <div className="grid two">
                    <Input required label="Nome completo" name="nome" value={form.nome} onChange={handleChange} />
                    <Input required type="date" label="Data de nascimento" name="nascimento" value={form.nascimento} onChange={handleChange} />
                    <Input required label="CPF" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                    <Input label="RG" name="rg" value={form.rg} onChange={handleChange} />
                    <Input label="PIS / NIS / NIT" name="pis" value={form.pis} onChange={handleChange} />
                    <Input required label="Contato / Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(91) 99999-9999" />
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Endereço</legend>
                  <div className="grid three">
                    <div className="span-two">
                      <Input label="Endereço completo" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, bairro e cidade" />
                    </div>
                    <Input label="CEP" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" />
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Filiação</legend>
                  <div className="grid two">
                    <Input label="Nome da mãe" name="nomeMae" value={form.nomeMae} onChange={handleChange} />
                    <Input label="Nome do pai" name="nomePai" value={form.nomePai} onChange={handleChange} />
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Dados bancários</legend>
                  <div className="grid two">
                    <Input required label="Banco" name="banco" value={form.banco} onChange={handleChange} placeholder="Ex: Nubank, Caixa, Bradesco" />
                    <Select required label="Tipo de conta" name="tipoConta" value={form.tipoConta} onChange={handleChange} options={["Corrente", "Poupança"]} />
                    <Input required label="Agência" name="agencia" value={form.agencia} onChange={handleChange} />
                    <Input required label="Número da conta" name="conta" value={form.conta} onChange={handleChange} />
                    <div className="span-two">
                      <Input required label="PIX" name="pix" value={form.pix} onChange={handleChange} placeholder="CPF, telefone, e-mail ou chave aleatória" />
                    </div>
                  </div>
                </fieldset>

                <div className="warning">
                  <strong>Importante:</strong> preencha corretamente seus dados. Qualquer número errado pode impedir o cadastro no sistema da Gi Group.
                </div>

                <button className="btn primary full" type="submit" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar cadastro"}
                </button>
              </form>
            </section>

            <aside className="card">
              <h2>🔒 Privacidade</h2>
              <ul>
                <li>Você não verá dados de outras pessoas.</li>
                <li>Após enviar, aparecerá apenas seu comprovante.</li>
                <li>Confira CPF, telefone, agência, conta e PIX.</li>
                <li>Guarde o PDF do comprovante.</li>
              </ul>
            </aside>
          </main>
        )}
      </div>
    </div>
  );
}

async function sendToPrivateBase(record) {
  if (!PRIVATE_RECEIVER_URL) {
    return {
      ok: true,
      message: "Cadastro gerado. Falta conectar o link da sua base privada no código.",
    };
  }

  try {
    await fetch(PRIVATE_RECEIVER_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    return {
      ok: true,
      message: "Cadastro enviado com sucesso para a base privada.",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Não foi possível enviar para a base privada. Salve o comprovante e avise o responsável.",
    };
  }
}

function Receipt({ record }) {
  return (
    <section className="receipt">
      <div className="receipt-header">
        <div className="eyebrow">🏢 Gi Group • Belém Filial 254 • HORECA</div>
        <h1>Comprovante de Cadastro de Diarista</h1>
        <p>Protocolo: {record.protocolo}</p>
        <p>Data do cadastro: {record.dataCadastro}</p>
      </div>

      <ReceiptGroup title="Dados profissionais">
        <ReceiptItem label="Função" value={record.funcao} />
        <ReceiptItem label="Status" value={record.status} />
      </ReceiptGroup>

      <ReceiptGroup title="Dados pessoais">
        <ReceiptItem label="Nome completo" value={record.nome} />
        <ReceiptItem label="Data de nascimento" value={record.nascimento} />
        <ReceiptItem label="CPF" value={record.cpf} />
        <ReceiptItem label="RG" value={record.rg} />
        <ReceiptItem label="PIS / NIS / NIT" value={record.pis} />
        <ReceiptItem label="Telefone" value={record.telefone} />
      </ReceiptGroup>

      <ReceiptGroup title="Endereço e filiação">
        <ReceiptItem label="Endereço" value={record.endereco} />
        <ReceiptItem label="CEP" value={record.cep} />
        <ReceiptItem label="Nome da mãe" value={record.nomeMae} />
        <ReceiptItem label="Nome do pai" value={record.nomePai} />
      </ReceiptGroup>

      <ReceiptGroup title="Dados bancários">
        <ReceiptItem label="Banco" value={record.banco} />
        <ReceiptItem label="Tipo de conta" value={record.tipoConta} />
        <ReceiptItem label="Agência" value={record.agencia} />
        <ReceiptItem label="Número da conta" value={record.conta} />
        <ReceiptItem label="PIX" value={record.pix} />
      </ReceiptGroup>

      <div className="receipt-note">
        Este comprovante confirma o envio das informações preenchidas pelo candidato. A conferência e validação dos dados será realizada posteriormente.
      </div>
    </section>
  );
}

function ReceiptGroup({ title, children }) {
  return (
    <div className="receipt-group">
      <h2>{title}</h2>
      <div className="receipt-grid">{children}</div>
    </div>
  );
}

function ReceiptItem({ label, value }) {
  return (
    <div className="receipt-item">
      <span>{label}</span>
      <strong>{value || "Não informado"}</strong>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      <input required={required} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      <select required={required} name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
