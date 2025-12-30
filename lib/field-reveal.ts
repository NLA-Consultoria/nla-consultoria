/**
 * Field Reveal Logic - Progressive Form UX
 *
 * Gerencia a lógica de revelação progressiva de campos no formulário.
 * Campos aparecem um por vez conforme o usuário interage com o campo atual.
 */

export type StepNumber = 1 | 2 | 3;

export type FieldName =
  // Etapa 1: Contato Inicial
  | 'name'
  | 'phone'
  | 'email'
  // Etapa 2: Empresa & Localização
  | 'company'
  | 'uf'
  | 'city'
  // Etapa 3: Qualificação & Objetivo
  | 'billing'
  | 'soldToGov'
  | 'pain';

/**
 * Define a ordem dos campos em cada etapa
 */
export const fieldOrder: Record<StepNumber, FieldName[]> = {
  1: ['name', 'phone', 'email'],
  2: ['company', 'uf', 'city'],
  3: ['billing', 'soldToGov', 'pain'],
};

/**
 * Campos críticos que disparam webhooks parciais
 */
export const criticalFields: FieldName[] = [
  'phone',
  'email',
  'city',
  'billing',
  'soldToGov',
];

/**
 * Retorna o próximo campo a ser revelado com base no campo atual
 */
export function getNextField(
  currentField: FieldName,
  step: StepNumber
): FieldName | null {
  const fields = fieldOrder[step];
  const currentIndex = fields.indexOf(currentField);
  const nextField = fields[currentIndex + 1];
  return nextField || null;
}

/**
 * Verifica se é o último campo da etapa
 */
export function isLastFieldInStep(
  field: FieldName,
  step: StepNumber
): boolean {
  const fields = fieldOrder[step];
  return fields[fields.length - 1] === field;
}

/**
 * Verifica se o campo é crítico (dispara webhook parcial)
 */
export function isCriticalField(field: FieldName): boolean {
  return criticalFields.includes(field);
}

/**
 * Retorna todos os campos de uma etapa
 */
export function getFieldsForStep(step: StepNumber): FieldName[] {
  return fieldOrder[step];
}

/**
 * Retorna o nome da etapa para tracking
 */
export function getStepName(step: StepNumber): string {
  const stepNames: Record<StepNumber, string> = {
    1: 'contact',
    2: 'company',
    3: 'qualification',
  };
  return stepNames[step];
}

/**
 * Retorna o label traduzido do campo
 */
export function getFieldLabel(field: FieldName): string {
  const labels: Record<FieldName, string> = {
    name: 'Como podemos te chamar?',
    phone: 'Qual seu WhatsApp?',
    email: 'E seu melhor e-mail?',
    company: 'Qual o nome da empresa?',
    uf: 'Em qual estado você atua?',
    city: 'E a cidade?',
    billing: 'Qual a faixa de faturamento mensal da empresa?',
    soldToGov: 'Sua empresa já vendeu para órgãos públicos?',
    pain: 'Conte um pouco sobre o que sua empresa faz',
  };
  return labels[field];
}
