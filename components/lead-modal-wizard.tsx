"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { leadSchema, PHONE_MASK, type LeadData } from "../lib/validators";
import { trackMetaEvent } from "../lib/trackMetaEvent";

type LeadModalContextType = { open: () => void };
const LeadModalContext = createContext<LeadModalContextType | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal deve ser usado dentro de LeadModalProvider");
  return ctx;
}

type Draft = {
  name: string;
  phone: string;
  email: string;
  company: string;
  uf: string;
  city: string;
  billing: string;
  soldToGov: "sim" | "nao";
  pain: string;
};

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const [data, setData] = useState<Draft>({
    name: "",
    phone: "",
    email: "",
    company: "",
    uf: "",
    city: "",
    billing: "",
    soldToGov: "nao",
    pain: "",
  });

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
    setStep(1);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    async function fetchCities(state: string) {
      if (!state) { setCities([]); return; }
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        if (!res.ok) throw new Error("Falha ao carregar cidades");
        const d = await res.json();
        const list = (d || []).map((c: any) => c.nome).sort();
        setCities(list);
      } catch {
        setCities([]);
      }
    }
    fetchCities(data.uf);
  }, [data.uf]);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  const step1 = leadSchema.pick({ name: true, phone: true, email: true });
  const step2 = leadSchema.pick({ company: true, uf: true, city: true });

  function nextStep() {
    const partial =
      step === 1
        ? { name: data.name, phone: data.phone, email: data.email }
        : { company: data.company, uf: (data.uf || "").toUpperCase(), city: data.city };
    const schema = step === 1 ? step1 : step2;
    const parsed = schema.safeParse(partial as any);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Verifique os campos");
      return;
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  }

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const payload: LeadData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        uf: (data.uf || "").toUpperCase(),
        city: data.city,
        billing: data.billing,
        soldToGov: data.soldToGov,
        pain: data.pain,
      };
      const parsed = leadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Verifique os campos");
      }

      await fetch("https://n8n.nlaconsultoria.com.br/webhook/3761388d-abd3-489c-9800-eb843058f504", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "nla-site", step: "final", stepCount: 3 }),
      });

      // Dispara o evento "Lead" apenas quando o formulário é concluído com sucesso
      trackMetaEvent({
        eventName: "Lead",
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      });

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
              Preencha os dados em 3 passos rápidos. Seus dados serão usados apenas para contato e agendamento.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {step === 1 && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" required placeholder="Seu nome" value={data.name} onChange={(e)=>setData({...data, name: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                  <Input id="phone" name="phone" required inputMode="numeric" placeholder="(00) 00000-0000" value={data.phone} onChange={(e)=>setData({...data, phone: formatPhone(e.target.value)})} pattern={PHONE_MASK.source} title="Formato: (00) 00000-0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" required type="email" placeholder="voce@empresa.com" value={data.email} onChange={(e)=>setData({...data, email: e.target.value})} />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" name="company" required placeholder="Nome da empresa" value={data.company} onChange={(e)=>setData({...data, company: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="uf">UF</Label>
                    <select id="uf" name="uf" required value={data.uf} onChange={(e)=>setData({...data, uf: e.target.value, city: ''})} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="" disabled>Selecione o UF</option>
                      {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((u)=>(<option key={u} value={u}>{u}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <select id="city" name="city" required disabled={!data.uf || cities.length===0} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.city} onChange={(e)=>setData({...data, city: e.target.value})}>
                    <option value="" disabled>Selecione a cidade</option>
                    {cities.map((c)=>(<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="billing">Fatura mensal (faixa)</Label>
                    <select id="billing" name="billing" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.billing} onChange={(e)=>setData({...data, billing: e.target.value})}>
                      <option value="" disabled>Selecione</option>
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
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="soldToGov" value="sim" className="h-4 w-4" required checked={data.soldToGov==='sim'} onChange={()=>setData({...data, soldToGov:'sim'})} />Sim</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="soldToGov" value="nao" className="h-4 w-4" checked={data.soldToGov==='nao'} onChange={()=>setData({...data, soldToGov:'nao'})} />Não</label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pain">Qual é o seu negócio?</Label>
                  <Textarea id="pain" name="pain" required placeholder="Conte-nos um pouco sobre o seu negócio" value={data.pain} onChange={(e)=>setData({...data, pain: e.target.value})} />
                </div>
              </>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Seus dados serão usados apenas para contato e agendamento.</p>
              <div className="flex gap-2">
                {step > 1 && (<Button type="button" variant="outline" onClick={()=>setStep((s)=>Math.max(1,s-1))}>Voltar</Button>)}
                {step < 3 && (<Button type="button" onClick={nextStep}>Próximo</Button>)}
                {step === 3 && (<Button type="submit" disabled={loading} aria-busy={loading}>{loading?"Enviando…":"Enviar"}</Button>)}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
