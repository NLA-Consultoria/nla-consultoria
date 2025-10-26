"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { leadSchema, PHONE_MASK, type LeadData } from "../lib/validators";
import { env } from "../lib/env";

type LeadModalContextType = { open: () => void };
const LeadModalContext = createContext<LeadModalContextType | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal deve ser usado dentro de LeadModalProvider");
  return ctx;
}

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uf, setUf] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [phone, setPhone] = useState("");

  const open = useCallback(() => {
    setError(null);
    setSuccess(false);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    async function fetchCities(state: string) {
      if (!state) { setCities([]); return; }
      try {
        // IBGE API para municípios por UF
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        if (!res.ok) throw new Error("Falha ao carregar cidades");
        const data = await res.json();
        const list = (data || []).map((c: any) => c.nome).sort();
        setCities(list);
      } catch {
        setCities([]);
      }
    }
    fetchCities(uf);
  }, [uf]);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const d = digits;
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data: LeadData = {
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        company: String(formData.get("company") || ""),
        uf: String(formData.get("uf") || "").toUpperCase(),
        city: String(formData.get("city") || ""),
        billing: String(formData.get("billing") || ""),
        soldToGov: (String(formData.get("soldToGov") || "nao") === "sim" ? "sim" : "nao"),
        pain: String(formData.get("pain") || ""),
      };
      const parsed = leadSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Verifique os campos");
      }

      // Envia para o webhook especificado
      await fetch("https://n8n.nlaconsultoria.com.br/webhook/3761388d-abd3-489c-9800-eb843058f504", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "nla-site" }),
      });

      setSuccess(true);
      // Fecha o formulário e abre popup de sucesso
      setIsOpen(false);
      setShowSuccessPopup(true);
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-describedby="lead-desc">
          <DialogHeader>
            <DialogTitle>Agendar minha reunião</DialogTitle>
            <DialogDescription id="lead-desc">
              Preencha os dados para entrarmos em contato e agendar. Seus dados serão usados apenas para contato e agendamento.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              onSubmit(fd);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required placeholder="Seu nome" aria-required="true" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone (WhatsApp)</Label>
              <Input
                id="phone"
                name="phone"
                required
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                pattern={PHONE_MASK.source}
                title="Formato: (00) 00000-0000"
                aria-describedby="phone-help"
              />
              <span id="phone-help" className="sr-only">Formato obrigatório: (00) 00000-0000</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" required type="email" placeholder="voce@empresa.com" aria-required="true" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" required placeholder="Nome da empresa" aria-required="true" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uf">UF</Label>
                <select
                  id="uf"
                  name="uf"
                  required
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>Selecione o UF</option>
                  {[
                    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
                  ].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <select
                id="city"
                name="city"
                required
                disabled={!uf || cities.length === 0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>Selecione a cidade</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {!uf && (
                <p className="text-xs text-muted-foreground">Selecione primeiro o UF para carregar as cidades.</p>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="billing">Fatura mensal (faixa)</Label>
                <select
                  id="billing"
                  name="billing"
                  required
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Até R$ 50 mil</option>
                  <option>R$ 50–200 mil</option>
                  <option>R$ 200–500 mil</option>
                  <option>R$ 500 mil – 1 mi</option>
                  <option>Acima de R$ 1 mi</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Já vendeu para governo?</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="soldToGov" value="sim" className="h-4 w-4" required />
                    Sim
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="soldToGov" value="nao" className="h-4 w-4" />
                    Não
                  </label>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pain">Maior dor hoje (texto curto)</Label>
              <Textarea id="pain" name="pain" required placeholder="Conte rapidamente o principal desafio" aria-required="true" />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Seus dados serão usados apenas para contato e agendamento.</p>
              <Button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? "Enviando…" : "Enviar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Popup de sucesso */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Tudo certo!</DialogTitle>
            <DialogDescription>
              Obrigado pelas informações! Em breve nossa equipe entrará em contato via whatsapp para começarmos nossa parceria. Até logo!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessPopup(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </LeadModalContext.Provider>
  );
}
