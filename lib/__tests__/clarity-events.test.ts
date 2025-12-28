/**
 * Testes para módulo de eventos do Microsoft Clarity
 *
 * Valida que todos eventos são disparados corretamente
 * e que tags são aplicadas conforme esperado.
 */

import {
  trackCtaClick,
  trackFormOpen,
  trackFormStepComplete,
  trackFormStepBack,
  trackFormAbandonment,
  trackFormSubmitSuccess,
  trackFormSubmitError,
  trackLeadQualification,
  identifyUser,
} from '../clarity-events';

describe('Clarity Events', () => {
  let mockClarity: jest.Mock;

  beforeEach(() => {
    // Mock window.clarity
    mockClarity = jest.fn();
    (global as any).window = {
      clarity: mockClarity,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackCtaClick', () => {
    it('deve disparar evento com localização correta', () => {
      trackCtaClick('hero');

      expect(mockClarity).toHaveBeenCalledWith('event', 'cta_click_hero');
    });

    it('deve aplicar tags de interesse', () => {
      trackCtaClick('header');

      expect(mockClarity).toHaveBeenCalledWith('set', 'has_cta_click', 'true');
      expect(mockClarity).toHaveBeenCalledWith('set', 'cta_location', 'header');
    });

    it('deve funcionar para todas localizações de CTA', () => {
      const locations = ['hero', 'header', 'why_section', 'how_section', 'final_cta'];

      locations.forEach(location => {
        mockClarity.mockClear();
        trackCtaClick(location);
        expect(mockClarity).toHaveBeenCalledWith('event', `cta_click_${location}`);
      });
    });
  });

  describe('trackFormOpen', () => {
    it('deve disparar evento form_opened', () => {
      trackFormOpen();

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_opened');
    });

    it('deve aplicar tag form_opened', () => {
      trackFormOpen();

      expect(mockClarity).toHaveBeenCalledWith('set', 'form_opened', 'true');
    });
  });

  describe('trackFormStepComplete', () => {
    it('deve disparar evento com step correto', () => {
      trackFormStepComplete(1);

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_step_1_completed');
    });

    it('deve atualizar tag de highest step', () => {
      trackFormStepComplete(2);

      expect(mockClarity).toHaveBeenCalledWith('set', 'form_highest_step', '2');
    });

    it('deve funcionar para todos os steps (1, 2, 3)', () => {
      [1, 2, 3].forEach(step => {
        mockClarity.mockClear();
        trackFormStepComplete(step);
        expect(mockClarity).toHaveBeenCalledWith('event', `form_step_${step}_completed`);
        expect(mockClarity).toHaveBeenCalledWith('set', 'form_highest_step', String(step));
      });
    });
  });

  describe('trackFormStepBack', () => {
    it('deve disparar evento de volta', () => {
      trackFormStepBack(2);

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_step_back_from_2');
    });
  });

  describe('trackFormAbandonment', () => {
    it('deve disparar evento de abandono', () => {
      trackFormAbandonment(1);

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_abandoned_step_1');
    });

    it('deve aplicar tags de abandono', () => {
      trackFormAbandonment(2);

      expect(mockClarity).toHaveBeenCalledWith('set', 'form_abandoned', 'true');
      expect(mockClarity).toHaveBeenCalledWith('set', 'abandoned_at_step', '2');
    });
  });

  describe('trackFormSubmitSuccess', () => {
    it('deve disparar evento de sucesso', () => {
      trackFormSubmitSuccess();

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_submit_success');
    });

    it('deve aplicar tag de conversão', () => {
      trackFormSubmitSuccess();

      expect(mockClarity).toHaveBeenCalledWith('set', 'converted', 'true');
    });
  });

  describe('trackFormSubmitError', () => {
    it('deve disparar evento de erro', () => {
      trackFormSubmitError('Network error');

      expect(mockClarity).toHaveBeenCalledWith('event', 'form_submit_error');
    });

    it('deve aplicar tag com mensagem de erro', () => {
      trackFormSubmitError('Validation failed');

      expect(mockClarity).toHaveBeenCalledWith('set', 'form_error', 'Validation failed');
    });
  });

  describe('trackLeadQualification', () => {
    it('deve aplicar tag de billing quando fornecido', () => {
      trackLeadQualification({ billing: 'R$ 50–200 mil' });

      expect(mockClarity).toHaveBeenCalledWith('set', 'lead_billing_range', 'R$ 50–200 mil');
    });

    it('deve aplicar tag de sold_to_gov quando fornecido', () => {
      trackLeadQualification({ soldToGov: 'sim' });

      expect(mockClarity).toHaveBeenCalledWith('set', 'sold_to_gov_before', 'sim');
    });

    it('deve aplicar tag de estado quando fornecido', () => {
      trackLeadQualification({ uf: 'SP' });

      expect(mockClarity).toHaveBeenCalledWith('set', 'lead_state', 'SP');
    });

    it('deve aplicar todas tags quando todos dados fornecidos', () => {
      trackLeadQualification({
        billing: 'Acima de R$ 1 mi',
        soldToGov: 'nao',
        uf: 'GO',
      });

      expect(mockClarity).toHaveBeenCalledWith('set', 'lead_billing_range', 'Acima de R$ 1 mi');
      expect(mockClarity).toHaveBeenCalledWith('set', 'sold_to_gov_before', 'nao');
      expect(mockClarity).toHaveBeenCalledWith('set', 'lead_state', 'GO');
    });

    it('não deve disparar chamadas para dados não fornecidos', () => {
      trackLeadQualification({ billing: 'Até R$ 50 mil' });

      expect(mockClarity).not.toHaveBeenCalledWith('set', 'sold_to_gov_before', expect.anything());
      expect(mockClarity).not.toHaveBeenCalledWith('set', 'lead_state', expect.anything());
    });
  });

  describe('identifyUser', () => {
    it('deve identificar usuário com email', () => {
      identifyUser('teste@empresa.com');

      expect(mockClarity).toHaveBeenCalledWith('identify', 'teste@empresa.com');
    });

    it('deve aplicar tag de nome quando fornecido', () => {
      identifyUser('teste@empresa.com', { name: 'João Silva' });

      expect(mockClarity).toHaveBeenCalledWith('set', 'user_name', 'João Silva');
    });

    it('deve aplicar tag de empresa quando fornecida', () => {
      identifyUser('teste@empresa.com', { company: 'Empresa XYZ' });

      expect(mockClarity).toHaveBeenCalledWith('set', 'user_company', 'Empresa XYZ');
    });

    it('deve aplicar todas tags quando todos dados fornecidos', () => {
      identifyUser('teste@empresa.com', {
        name: 'Maria Santos',
        company: 'Tech Corp',
      });

      expect(mockClarity).toHaveBeenCalledWith('identify', 'teste@empresa.com');
      expect(mockClarity).toHaveBeenCalledWith('set', 'user_name', 'Maria Santos');
      expect(mockClarity).toHaveBeenCalledWith('set', 'user_company', 'Tech Corp');
    });
  });

  describe('Proteção quando Clarity não disponível', () => {
    beforeEach(() => {
      // Remove window.clarity
      delete (global as any).window.clarity;
    });

    it('não deve lançar erro quando clarity não está disponível', () => {
      expect(() => {
        trackCtaClick('hero');
        trackFormOpen();
        trackFormSubmitSuccess();
        identifyUser('test@test.com');
      }).not.toThrow();
    });

    it('não deve disparar eventos quando clarity não está disponível', () => {
      trackCtaClick('hero');
      trackFormOpen();

      // mockClarity não deve ter sido chamado pois clarity não existe
      expect(mockClarity).not.toHaveBeenCalled();
    });
  });

  describe('Proteção SSR (servidor)', () => {
    beforeEach(() => {
      // Simula ambiente de servidor (sem window)
      delete (global as any).window;
    });

    it('não deve lançar erro quando executado no servidor', () => {
      expect(() => {
        trackCtaClick('hero');
        trackFormOpen();
        trackFormSubmitSuccess();
      }).not.toThrow();
    });
  });
});
