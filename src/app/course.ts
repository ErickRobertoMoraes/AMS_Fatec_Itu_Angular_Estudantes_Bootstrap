export interface Course {
    id: number;
    name: string;
    vagas: 'Abertas' | 'Fechadas';
    periodo: 'Manhã' | 'Tarde' | 'Noite';
    modalidade: 'EAD' | 'Presencial';
    disciplinasComplementares: boolean;
  }
  