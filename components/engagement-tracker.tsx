'use client';

import { useEffect, useRef } from 'react';
import { trackMetaEvent, splitFullName } from '@/lib/meta-tracking';

/**
 * Engagement Tracker - Dispara ViewContent após 30s de engajamento
 *
 * Estratégia:
 * - PageView (automático) → tracking básico de tráfego
 * - ViewContent (após 30s) → usuário engajado, com Advanced Matching se disponível
 *
 * Isso ensina o Meta a otimizar para visitantes de qualidade, não apenas bounces.
 */
export function EngagementTracker() {
  const viewContentFired = useRef(false);

  useEffect(() => {
    // Aguarda 30 segundos de permanência na página
    const timeoutId = setTimeout(() => {
      if (viewContentFired.current) return;
      viewContentFired.current = true;

      // Tenta enriquecer com dados de localStorage (usuário recorrente)
      let userData = {};
      try {
        const draft = localStorage.getItem('lead_draft_v2');
        if (draft) {
          const data = JSON.parse(draft);
          if (data.email || data.phone || data.name) {
            const { firstName, lastName } = splitFullName(data.name || '');
            userData = {
              email: data.email,
              phone: data.phone,
              firstName,
              lastName,
              city: data.city,
              state: data.uf,
            };
          }
        }
      } catch (e) {
        // Ignora erro, dispara ViewContent sem Advanced Matching
      }

      // Dispara ViewContent enriquecido
      trackMetaEvent(
        'ViewContent',
        {
          content_name: 'lp-2_landing_page',
          content_category: 'b2g_consulting',
          content_type: 'landing_page',
          source: 'lp-2',
        },
        userData,
        true // standard event
      );
    }, 30000); // 30s

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
