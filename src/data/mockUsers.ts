export interface Review {
  id: string
  clientName: string
  clientAvatar?: string
  clientRole: string
  contractId: string
  contractTitle: string
  rating: number
  date: string
  comment: string
  providerReply?: string
}

export interface ContractItem {
  id: string
  title: string
  counterparty: string
  role: 'Cliente' | 'Proveedor'
  amount: string
  date: string
  status: 'Completado' | 'En Custodia' | 'En Disputa' | 'Cancelado'
  statusClass: string
  rating?: number
}

export interface UserItem {
  id: string
  name: string
  firstName: string
  lastNamePaternal: string
  lastNameMaternal: string
  email: string
  phone: string
  ci: string
  ciExpedition: string
  avatarUrl?: string
  role: 'Proveedor' | 'Cliente' | 'Administrador'
  profession?: string
  tradeCategory?: string
  department: string
  coverageZones: string[]
  kycStatus: 'Verificado' | 'Pendiente' | 'No Verificado' | 'Rechazado'
  accountStatus: 'Activo' | 'Suspendido' | 'En Revisión'
  rating: number
  reviewsCount: number
  completedContracts: number
  escrowTotalAmount: string
  onTimeRate: number
  joinedDate: string
  lastActive: string
  bio?: string
  documents: {
    name: string
    type: string
    status: 'Aprobado' | 'Pendiente' | 'Rechazado'
    date: string
  }[]
  reviews: Review[]
  contracts: ContractItem[]
}

export const mockUsers: UserItem[] = [
  {
    id: 'USR-101',
    name: 'Carlos Mamani Choque',
    firstName: 'Carlos',
    lastNamePaternal: 'Mamani',
    lastNameMaternal: 'Choque',
    email: 'carlos.electricista@gmail.com',
    phone: '+591 76294012',
    ci: '6849201',
    ciExpedition: 'LP',
    role: 'Proveedor',
    profession: 'Técnico Electricista Industrial',
    tradeCategory: 'Instalaciones Eléctricas',
    department: 'La Paz',
    coverageZones: ['Zona Sur', 'Sopocachi', 'Miraflores', 'Achumani', 'Calacoto'],
    kycStatus: 'Verificado',
    accountStatus: 'Activo',
    rating: 4.9,
    reviewsCount: 38,
    completedContracts: 45,
    escrowTotalAmount: 'BOB 58,400.00',
    onTimeRate: 98,
    joinedDate: '12 Ene 2025',
    lastActive: 'Hace 15 min',
    bio: 'Especialista certificado en cableado trifásico, tableros de control y automatización domiciliaria con más de 10 años de experiencia.',
    documents: [
      { name: 'Cédula de Identidad (Anverso y Reverso)', type: 'Documento Nacional', status: 'Aprobado', date: '12 Ene 2025' },
      { name: 'Certificado de Antecedentes FELCC', type: 'Seguridad Legal', status: 'Aprobado', date: '15 Ene 2025' },
      { name: 'Título Técnico Medio en Electricidad', type: 'Certificación Profesional', status: 'Aprobado', date: '15 Ene 2025' },
      { name: 'Factura de Luz (Domicilio La Paz)', type: 'Comprobante Domiciliario', status: 'Aprobado', date: '12 Ene 2025' }
    ],
    reviews: [
      {
        id: 'REV-1',
        clientName: 'Constructora del Sur SRL',
        clientRole: 'Cliente Corporativo',
        contractId: '#CTR-9021',
        contractTitle: 'Instalación Eléctrica Trifásica en Edificio Roma',
        rating: 5,
        date: '02 Oct 2026',
        comment: 'Puntualidad intachable y trabajo prolijo en todos los ductos. Liberamos los fondos Escrow de inmediato sin ninguna observación.',
        providerReply: 'Muchas gracias por la confianza, quedamos a disposición para la segunda fase.'
      },
      {
        id: 'REV-2',
        clientName: 'Fernando Murillo',
        clientRole: 'Cliente Domiciliario',
        contractId: '#CTR-8812',
        contractTitle: 'Reemplazo de Disyuntores y Tablero General',
        rating: 5,
        date: '18 Sep 2026',
        comment: 'Solucionó una fuga de corriente que otros electricistas no encontraban. 100% recomendado en Calacoto.'
      },
      {
        id: 'REV-3',
        clientName: 'Mariana Alarcón',
        clientRole: 'Cliente Domiciliario',
        contractId: '#CTR-8540',
        contractTitle: 'Iluminación LED Inteligente para Dpto',
        rating: 4.8,
        date: '04 Ago 2026',
        comment: 'Muy buen asesoramiento en marcas de luminarias. El presupuesto pactado se cumplió exactamente.'
      }
    ],
    contracts: [
      { id: '#CTR-9021', title: 'Instalación Eléctrica Trifásica en Edificio Roma', counterparty: 'Constructora del Sur SRL', role: 'Proveedor', amount: 'BOB 12,500.00', date: '02 Oct 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 5 },
      { id: '#CTR-8812', title: 'Reemplazo de Disyuntores y Tablero General', counterparty: 'Fernando Murillo', role: 'Proveedor', amount: 'BOB 1,800.00', date: '18 Sep 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 5 },
      { id: '#CTR-8540', title: 'Iluminación LED Inteligente para Dpto', counterparty: 'Mariana Alarcón', role: 'Proveedor', amount: 'BOB 2,400.00', date: '04 Ago 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 5 },
      { id: '#CTR-9140', title: 'Mantenimiento de Grupo Electrógeno', counterparty: 'Hospital Los Pinos', role: 'Proveedor', amount: 'BOB 4,200.00', date: '06 Oct 2026', status: 'En Custodia', statusClass: 'bg-blue-100 text-blue-800' }
    ]
  },
  {
    id: 'USR-102',
    name: 'Lucía Rojas Guzmán',
    firstName: 'Lucía',
    lastNamePaternal: 'Rojas',
    lastNameMaternal: 'Guzmán',
    email: 'lucia.rojas.arquitectura@gmail.com',
    phone: '+591 75019283',
    ci: '5938102',
    ciExpedition: 'SC',
    role: 'Proveedor',
    profession: 'Arquitecta & Diseñadora de Interiores',
    tradeCategory: 'Construcción & Albañilería',
    department: 'Santa Cruz',
    coverageZones: ['Equipetrol', 'Urubó', 'Las Palmas', 'Villa 1ro de Mayo', 'Centro'],
    kycStatus: 'Verificado',
    accountStatus: 'Activo',
    rating: 4.8,
    reviewsCount: 24,
    completedContracts: 28,
    escrowTotalAmount: 'BOB 142,000.00',
    onTimeRate: 95,
    joinedDate: '03 Feb 2025',
    lastActive: 'Hace 1 hora',
    bio: 'Remodelaciones de alto estándar, renders 3D arquitectónicos y dirección de obras residenciales en Santa Cruz.',
    documents: [
      { name: 'Cédula de Identidad', type: 'Documento Nacional', status: 'Aprobado', date: '03 Feb 2025' },
      { name: 'Título en Provisión Nacional (Colegio de Arquitectos)', type: 'Certificación Profesional', status: 'Aprobado', date: '05 Feb 2025' }
    ],
    reviews: [
      {
        id: 'REV-4',
        clientName: 'Grupo Inmobiliario Oriente',
        clientRole: 'Cliente Corporativo',
        contractId: '#CTR-8902',
        contractTitle: 'Remodelación de Lobby Edificio Sky',
        rating: 5,
        date: '25 Sep 2026',
        comment: 'Excelente gestión de materiales y terminaciones de primera. Se ajustó al cronograma estipulado.'
      }
    ],
    contracts: [
      { id: '#CTR-8902', title: 'Remodelación de Lobby Edificio Sky', counterparty: 'Grupo Inmobiliario Oriente', role: 'Proveedor', amount: 'BOB 35,000.00', date: '25 Sep 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 5 }
    ]
  },
  {
    id: 'USR-103',
    name: 'Juan Manuel Torrico',
    firstName: 'Juan Manuel',
    lastNamePaternal: 'Torrico',
    lastNameMaternal: 'Salinas',
    email: 'jmtorrico.plomero@hotmail.com',
    phone: '+591 71492019',
    ci: '7492019',
    ciExpedition: 'CB',
    role: 'Proveedor',
    profession: 'Maestro Plomero e Hidráulico',
    tradeCategory: 'Plomería & Sanitarios',
    department: 'Cochabamba',
    coverageZones: ['Cala Cala', 'Recoleta', 'Quillacollo', 'Sarco', 'América Este'],
    kycStatus: 'Pendiente',
    accountStatus: 'En Revisión',
    rating: 4.6,
    reviewsCount: 16,
    completedContracts: 19,
    escrowTotalAmount: 'BOB 14,800.00',
    onTimeRate: 91,
    joinedDate: '20 Jul 2025',
    lastActive: 'Hace 3 horas',
    bio: 'Detección de fugas no visibles con ultrasonido, instalación de termotanques y bombas de agua automáticas.',
    documents: [
      { name: 'Cédula de Identidad', type: 'Documento Nacional', status: 'Pendiente', date: '20 Jul 2025' }
    ],
    reviews: [
      {
        id: 'REV-5',
        clientName: 'Claudia Zeballos',
        clientRole: 'Cliente Domiciliario',
        contractId: '#CTR-7719',
        contractTitle: 'Instalación de Bomba Presurizadora',
        rating: 4.5,
        date: '12 Ago 2026',
        comment: 'Buen trabajo técnico, resolvió la presión del agua en el segundo piso.'
      }
    ],
    contracts: [
      { id: '#CTR-7719', title: 'Instalación de Bomba Presurizadora', counterparty: 'Claudia Zeballos', role: 'Proveedor', amount: 'BOB 1,200.00', date: '12 Ago 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 4.5 }
    ]
  },
  {
    id: 'USR-104',
    name: 'Constructora del Sur SRL',
    firstName: 'Constructora',
    lastNamePaternal: 'del Sur',
    lastNameMaternal: 'SRL',
    email: 'contacto@constructoradelsur.bo',
    phone: '+591 2 2789012',
    ci: 'NIT: 1029482019',
    ciExpedition: 'LP',
    role: 'Cliente',
    department: 'La Paz',
    coverageZones: ['Zona Sur', 'Achumani', 'San Miguel'],
    kycStatus: 'Verificado',
    accountStatus: 'Activo',
    rating: 5.0,
    reviewsCount: 12,
    completedContracts: 18,
    escrowTotalAmount: 'BOB 280,000.00',
    onTimeRate: 100,
    joinedDate: '10 Nov 2024',
    lastActive: 'Ayer',
    bio: 'Empresa desarrolladora de proyectos habitacionales en La Paz. Contratación frecuente de subcontratistas especializados.',
    documents: [
      { name: 'NIT Impuestos Nacionales', type: 'Registro Fiscal', status: 'Aprobado', date: '10 Nov 2024' },
      { name: 'Poder de Representación Legal', type: 'Legal', status: 'Aprobado', date: '10 Nov 2024' }
    ],
    reviews: [],
    contracts: [
      { id: '#CTR-9021', title: 'Instalación Eléctrica Trifásica en Edificio Roma', counterparty: 'Carlos Mamani Choque', role: 'Cliente', amount: 'BOB 12,500.00', date: '02 Oct 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800' }
    ]
  },
  {
    id: 'USR-105',
    name: 'Esteban Quispe Ramos',
    firstName: 'Esteban',
    lastNamePaternal: 'Quispe',
    lastNameMaternal: 'Ramos',
    email: 'esteban.cerrajeria@gmail.com',
    phone: '+591 78912345',
    ci: '8192048',
    ciExpedition: 'LP',
    role: 'Proveedor',
    profession: 'Técnico Cerrajero y Carpintería Metálica',
    tradeCategory: 'Cerrajería de Alta Seguridad',
    department: 'El Alto',
    coverageZones: ['Ciudad Satélite', 'Villa Adela', 'Ceja', 'Río Seco', 'Zona Sur La Paz'],
    kycStatus: 'Verificado',
    accountStatus: 'Activo',
    rating: 4.7,
    reviewsCount: 31,
    completedContracts: 34,
    escrowTotalAmount: 'BOB 22,600.00',
    onTimeRate: 94,
    joinedDate: '14 Abr 2025',
    lastActive: 'Hace 40 min',
    bio: 'Aperturas de emergencia, cerraduras biométricas, portones eléctricos y soldadura reforzada.',
    documents: [
      { name: 'Cédula de Identidad', type: 'Documento Nacional', status: 'Aprobado', date: '14 Abr 2025' }
    ],
    reviews: [
      {
        id: 'REV-6',
        clientName: 'Javier Morales',
        clientRole: 'Cliente Domiciliario',
        contractId: '#CTR-6721',
        contractTitle: 'Instalación de Cerradura Digital Yale',
        rating: 5,
        date: '20 Sep 2026',
        comment: 'Llegó en 25 minutos y dejó la cerradura digital configurada en mi celular.'
      }
    ],
    contracts: [
      { id: '#CTR-6721', title: 'Instalación de Cerradura Digital Yale', counterparty: 'Javier Morales', role: 'Proveedor', amount: 'BOB 450.00', date: '20 Sep 2026', status: 'Completado', statusClass: 'bg-emerald-100 text-emerald-800', rating: 5 }
    ]
  },
  {
    id: 'USR-106',
    name: 'Silvia Morales Tapia',
    firstName: 'Silvia',
    lastNamePaternal: 'Morales',
    lastNameMaternal: 'Tapia',
    email: 'silvia.clean@gmail.com',
    phone: '+591 79401928',
    ci: '3910294',
    ciExpedition: 'OR',
    role: 'Proveedor',
    profession: 'Supervisora de Limpieza Institucional',
    tradeCategory: 'Limpieza & Desinfección',
    department: 'Oruro',
    coverageZones: ['Zona Central', 'Socavón', 'Sur Oruro'],
    kycStatus: 'No Verificado',
    accountStatus: 'Suspendido',
    rating: 3.8,
    reviewsCount: 5,
    completedContracts: 6,
    escrowTotalAmount: 'BOB 4,100.00',
    onTimeRate: 75,
    joinedDate: '18 May 2025',
    lastActive: 'Hace 5 días',
    bio: 'Limpieza profunda de alfombras, vidrios de altura y desinfección de almacenes.',
    documents: [],
    reviews: [
      {
        id: 'REV-7',
        clientName: 'Almacenes Sajama',
        clientRole: 'Cliente Comercial',
        contractId: '#CTR-5012',
        contractTitle: 'Limpieza post-obra en depósito',
        rating: 3,
        date: '10 Jul 2026',
        comment: 'Demoraron 2 días más de lo pactado en entregar el espacio limpio.'
      }
    ],
    contracts: [
      { id: '#CTR-5012', title: 'Limpieza post-obra en depósito', counterparty: 'Almacenes Sajama', role: 'Proveedor', amount: 'BOB 1,500.00', date: '10 Jul 2026', status: 'En Disputa', statusClass: 'bg-rose-100 text-rose-800', rating: 3 }
    ]
  }
]

