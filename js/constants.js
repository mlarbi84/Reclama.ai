export const DISCLAIMER = 'Este documento es una ayuda orientativa para preparar una reclamación. Revisa los datos, adjunta las pruebas y consulta con un profesional o entidad competente si tu caso tiene impacto económico, legal o personal relevante.';

export const CATEGORIES = {
  telecom: {
    label: 'Telefonía e internet',
    description: 'Facturas, bajas, permanencias o servicio deficiente.',
    symbol: '⌁',
    context: 'servicio de telecomunicaciones'
  },
  shopping: {
    label: 'Compras y servicios',
    description: 'Devoluciones, garantías, cobros o producto defectuoso.',
    symbol: '◇',
    context: 'compra o servicio contratado'
  },
  travel: {
    label: 'Viajes y transporte',
    description: 'Retrasos, cancelaciones, equipaje o reservas.',
    symbol: '→',
    context: 'servicio de viaje o transporte'
  },
  finance: {
    label: 'Banca y seguros',
    description: 'Comisiones, cargos, pólizas o incidencias contractuales.',
    symbol: '€',
    context: 'servicio financiero o asegurador'
  },
  utilities: {
    label: 'Suministros',
    description: 'Luz, gas, agua, facturación o cambio de contrato.',
    symbol: '⚡',
    context: 'servicio de suministro'
  },
  other: {
    label: 'Otro caso',
    description: 'Cualquier incidencia de consumo que no encaje arriba.',
    symbol: '+',
    context: 'servicio recibido'
  }
};

export const FIELD_LIMITS = {
  company: 120,
  subject: 160,
  reference: 100,
  facts: 3000,
  previousActions: 1500,
  evidence: 1200,
  request: 1500,
  fullName: 120,
  email: 160,
  location: 100,
  responseDays: 3
};

export function createInitialClaim(today = new Date()) {
  const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return {
    category: '',
    company: '',
    subject: '',
    incidentDate: '',
    reference: '',
    amount: '',
    facts: '',
    previousActions: '',
    evidence: '',
    request: '',
    responseDays: '',
    fullName: '',
    email: '',
    location: '',
    documentDate: isoToday
  };
}
