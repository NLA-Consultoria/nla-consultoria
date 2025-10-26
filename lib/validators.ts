import { z } from "zod";

export const PHONE_MASK = /^(\(\d{2}\) \d{5}-\d{4})$/;

export const leadSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  phone: z
    .string()
    .regex(PHONE_MASK, "Formato: (00) 00000-0000"),
  email: z.string().email("E-mail inválido"),
  company: z.string().min(1, "Informe sua empresa"),
  uf: z
    .string()
    .length(2, "Selecione o UF")
    .toUpperCase(),
  city: z.string().min(2, "Selecione sua cidade"),
  billing: z.string().min(1, "Selecione uma faixa"),
  soldToGov: z.enum(["sim", "nao"], {
    required_error: "Informe se já vendeu para governo",
  }),
  pain: z.string().min(2, "Descreva sua principal dor"),
});

export type LeadData = z.infer<typeof leadSchema>;
