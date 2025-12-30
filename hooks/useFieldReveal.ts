/**
 * useFieldReveal Hook - Progressive Field Reveal
 *
 * Hook customizado para gerenciar a revelação progressiva de campos.
 * Controla quais campos estão visíveis com base na interação do usuário.
 */

import { useState, useCallback } from 'react';
import { FieldName, StepNumber, getNextField, getFieldsForStep } from '@/lib/field-reveal';

interface UseFieldRevealReturn {
  visibleFields: FieldName[];
  revealNextField: (currentField: FieldName, step: StepNumber) => void;
  resetFieldsForStep: (step: StepNumber) => void;
  isFieldVisible: (field: FieldName) => boolean;
}

/**
 * Hook para gerenciar revelação progressiva de campos
 */
export function useFieldReveal(initialStep: StepNumber = 1): UseFieldRevealReturn {
  // Começa com apenas o primeiro campo da etapa inicial visível
  const [visibleFields, setVisibleFields] = useState<FieldName[]>(() => {
    const firstField = getFieldsForStep(initialStep)[0];
    return firstField ? [firstField] : [];
  });

  /**
   * Revela o próximo campo com base no campo atual
   */
  const revealNextField = useCallback((currentField: FieldName, step: StepNumber) => {
    const nextField = getNextField(currentField, step);

    if (nextField && !visibleFields.includes(nextField)) {
      setVisibleFields((prev) => [...prev, nextField]);
    }
  }, [visibleFields]);

  /**
   * Reseta os campos visíveis para mostrar apenas o primeiro campo da etapa
   */
  const resetFieldsForStep = useCallback((step: StepNumber) => {
    const fieldsForStep = getFieldsForStep(step);
    const firstField = fieldsForStep[0];
    setVisibleFields(firstField ? [firstField] : []);
  }, []);

  /**
   * Verifica se um campo específico está visível
   */
  const isFieldVisible = useCallback((field: FieldName) => {
    return visibleFields.includes(field);
  }, [visibleFields]);

  return {
    visibleFields,
    revealNextField,
    resetFieldsForStep,
    isFieldVisible,
  };
}
