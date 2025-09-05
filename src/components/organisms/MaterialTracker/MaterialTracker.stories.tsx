import type { Meta, StoryObj } from '@storybook/react'
import { MaterialTracker } from './MaterialTracker'
import type { Material, MaterialInventory, PurchaseOrder, MaterialDistribution } from './MaterialTracker'

const meta = {
  title: 'Components/Organisms/MaterialTracker',
  component: MaterialTracker,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive material inventory tracking and workflow management system with warehouse operations, purchase orders, distribution management, barcode/QR scanning, and real-time analytics for construction project material control.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full', 'mobile'],
      description: 'Visual variant of the material tracker interface',
    },
    layout: {
      control: { type: 'select' },
      options: ['dashboard', 'list', 'warehouse', 'workflow'],
      description: 'Layout configuration for different views',
    },
    mode: {
      control: { type: 'select' },
      options: ['view', 'receive', 'distribute', 'track', 'audit'],
      description: 'Current operation mode',
    },
    enableBarcodeScan: {
      control: { type: 'boolean' },
      description: 'Enable barcode scanning functionality',
    },
    enableQRScan: {
      control: { type: 'boolean' },
      description: 'Enable QR code scanning functionality',
    },
    enableReceiving: {
      control: { type: 'boolean' },
      description: 'Enable material receiving operations',
    },
    enableDistribution: {
      control: { type: 'boolean' },
      description: 'Enable material distribution operations',
    },
    showScannerInterface: {
      control: { type: 'boolean' },
      description: 'Show scanner interface when active',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MaterialTracker>

export default meta
type Story = StoryObj<typeof meta>

// Sample materials data
const sampleMaterials: Material[] = [
  {
    id: 'mat-001',
    name: 'Cemento Portland Tipo I',
    category: 'CEMENTO',
    subcategory: 'Portland',
    description: 'Cemento portland tipo I para uso general en construcción',
    specifications: {
      brand: 'Polpaico',
      grade: 'Tipo I',
      composition: '95% Clinker + 5% Yeso',
      standard: 'NCH 148',
      strength: '42.5 MPa'
    },
    unit: {
      base: 'KG',
      conversion: [
        { unit: 'MT', factor: 1000, description: 'Toneladas métricas' },
        { unit: 'SACO', factor: 25, description: 'Sacos de 25kg' }
      ]
    },
    cost: {
      basePrice: 185,
      currency: 'CLP',
      priceUnit: 'KG',
      lastUpdate: new Date('2024-03-15'),
      supplier: 'Cemento Polpaico'
    },
    storage: {
      type: 'CUBIERTO',
      conditions: ['Lugar seco', 'Temperatura estable', 'Sin humedad'],
      maxStackHeight: 10,
      separationRequired: false,
      hazardous: false
    },
    quality: {
      requiresInspection: true,
      testRequired: true,
      certificationNeeded: true,
      shelfLife: 90,
      qualityCriteria: [
        { parameter: 'Resistencia 28 días', minValue: 42.5, unit: 'MPa', tolerance: 2 },
        { parameter: 'Finura Blaine', minValue: 280, maxValue: 350, unit: 'm²/kg', tolerance: 10 }
      ]
    },
    lifecycle: {
      leadTime: 7,
      minOrderQuantity: 1000,
      maxOrderQuantity: 50000,
      reorderPoint: 5000,
      safetyStock: 2000,
      economicOrderQuantity: 10000
    },
    environmental: {
      recyclable: false,
      hazardous: false,
      msdsRequired: true,
      specialDisposal: false,
      environmentalImpact: 'MEDIUM'
    },
    metadata: {
      createdDate: new Date('2024-01-15'),
      lastModified: new Date('2024-03-10'),
      createdBy: 'admin-001',
      isActive: true,
      tags: ['estructural', 'basico', 'polpaico'],
      notes: 'Material básico para obras de hormigón'
    }
  },
  {
    id: 'mat-002',
    name: 'Fierro Corrugado A63-42H',
    category: 'FIERRO',
    subcategory: 'Corrugado',
    description: 'Barras de acero corrugado para hormigón armado',
    specifications: {
      brand: 'CAP Acero',
      grade: 'A63-42H',
      size: '12mm',
      strength: '420 MPa',
      standard: 'NCH 204'
    },
    unit: {
      base: 'KG',
      conversion: [
        { unit: 'MT', factor: 1000, description: 'Toneladas métricas' },
        { unit: 'BARRA', factor: 8.88, description: 'Barras de 12mm x 12m' }
      ]
    },
    cost: {
      basePrice: 720,
      currency: 'CLP',
      priceUnit: 'KG',
      lastUpdate: new Date('2024-03-12'),
      supplier: 'CAP Acero'
    },
    storage: {
      type: 'EXTERIOR',
      conditions: ['Lugar seco', 'Separado del suelo', 'Clasificado por diámetro'],
      maxStackHeight: 2,
      separationRequired: true,
      hazardous: false
    },
    quality: {
      requiresInspection: true,
      testRequired: true,
      certificationNeeded: true,
      qualityCriteria: [
        { parameter: 'Límite elástico', minValue: 420, unit: 'MPa', tolerance: 5 },
        { parameter: 'Elongación', minValue: 14, unit: '%', tolerance: 1 }
      ]
    },
    lifecycle: {
      leadTime: 14,
      minOrderQuantity: 500,
      reorderPoint: 2000,
      safetyStock: 1000,
      economicOrderQuantity: 5000
    },
    environmental: {
      recyclable: true,
      hazardous: false,
      environmentalImpact: 'LOW'
    },
    metadata: {
      createdDate: new Date('2024-01-15'),
      lastModified: new Date('2024-03-08'),
      createdBy: 'admin-001',
      isActive: true,
      tags: ['estructural', 'acero', 'corrugado'],
      notes: 'Para elementos estructurales de hormigón armado'
    }
  },
  {
    id: 'mat-003',
    name: 'Hormigón H25 Bombeado',
    category: 'HORMIGON',
    subcategory: 'Premezclado',
    description: 'Hormigón premezclado H25 para bombeo',
    specifications: {
      brand: 'Melón',
      grade: 'H25',
      composition: 'Cemento + Áridos + Aditivos',
      strength: '25 MPa',
      standard: 'NCH 170'
    },
    unit: {
      base: 'M3',
      conversion: [
        { unit: 'M3', factor: 1, description: 'Metros cúbicos' }
      ]
    },
    cost: {
      basePrice: 72000,
      currency: 'CLP',
      priceUnit: 'M3',
      lastUpdate: new Date('2024-03-14'),
      supplier: 'Hormigones Melón'
    },
    storage: {
      type: 'ESPECIAL',
      conditions: ['Uso inmediato', 'No almacenable'],
      specialHandling: ['Bombeo', 'Vibrado', 'Curado']
    },
    quality: {
      requiresInspection: true,
      testRequired: true,
      certificationNeeded: true,
      shelfLife: 0, // uso inmediato
      qualityCriteria: [
        { parameter: 'Resistencia 28 días', minValue: 25, unit: 'MPa', tolerance: 2 },
        { parameter: 'Docilidad', minValue: 6, maxValue: 10, unit: 'cm', tolerance: 1 }
      ]
    },
    lifecycle: {
      leadTime: 1,
      minOrderQuantity: 3,
      reorderPoint: 0, // no se almacena
      safetyStock: 0
    },
    environmental: {
      recyclable: false,
      hazardous: false,
      environmentalImpact: 'MEDIUM'
    },
    metadata: {
      createdDate: new Date('2024-01-20'),
      lastModified: new Date('2024-03-05'),
      createdBy: 'admin-001',
      isActive: true,
      tags: ['hormigon', 'bombeado', 'estructural']
    }
  },
  {
    id: 'mat-004',
    name: 'Ladrillo Cerámico Princesa',
    category: 'LADRILLO',
    subcategory: 'Cerámico',
    description: 'Ladrillo cerámico para muros de albañilería',
    specifications: {
      brand: 'Princesa',
      size: '29x14x7.1 cm',
      weight: 2.8
    },
    unit: {
      base: 'UN',
      conversion: [
        { unit: 'PALLET', factor: 192, description: 'Pallet de 192 unidades' },
        { unit: 'M2', factor: 12.5, description: 'Unidades por m²' }
      ]
    },
    cost: {
      basePrice: 350,
      currency: 'CLP',
      priceUnit: 'UN',
      lastUpdate: new Date('2024-03-10'),
      supplier: 'Cerámica Princesa'
    },
    storage: {
      type: 'EXTERIOR',
      conditions: ['Lugar seco', 'Apilado en pallets', 'Protegido de lluvia'],
      maxStackHeight: 3,
      separationRequired: false
    },
    quality: {
      requiresInspection: true,
      testRequired: false,
      certificationNeeded: false,
      qualityCriteria: [
        { parameter: 'Resistencia compresión', minValue: 8, unit: 'MPa', tolerance: 1 }
      ]
    },
    lifecycle: {
      leadTime: 10,
      minOrderQuantity: 192,
      reorderPoint: 1000,
      safetyStock: 500,
      economicOrderQuantity: 1920
    },
    environmental: {
      recyclable: true,
      hazardous: false,
      environmentalImpact: 'LOW'
    },
    metadata: {
      createdDate: new Date('2024-02-01'),
      lastModified: new Date('2024-03-01'),
      createdBy: 'admin-001',
      isActive: true,
      tags: ['albañileria', 'ceramico', 'muro']
    }
  },
  {
    id: 'mat-005',
    name: 'Pintura Látex Interior Blanco',
    category: 'PINTURA',
    subcategory: 'Látex',
    description: 'Pintura látex lavable para interiores',
    specifications: {
      brand: 'Sherwin Williams',
      color: 'Blanco',
      finish: 'Semi mate',
      coverage: '12-14 m²/L'
    },
    unit: {
      base: 'LT',
      conversion: [
        { unit: 'GALON', factor: 3.78, description: 'Galones' },
        { unit: 'M2', factor: 13, description: 'Metros cuadrados de cobertura' }
      ]
    },
    cost: {
      basePrice: 8500,
      currency: 'CLP',
      priceUnit: 'LT',
      lastUpdate: new Date('2024-03-08'),
      supplier: 'Sherwin Williams'
    },
    storage: {
      type: 'INTERIOR',
      conditions: ['Temperatura 5-35°C', 'Sin congelamiento', 'Lugar ventilado'],
      hazardous: false,
      specialHandling: ['Evitar derrame', 'Mantener cerrado']
    },
    quality: {
      requiresInspection: false,
      testRequired: false,
      certificationNeeded: false,
      shelfLife: 730, // 2 years
      qualityCriteria: [
        { parameter: 'Viscosidad', minValue: 90, maxValue: 110, unit: 'KU', tolerance: 5 }
      ]
    },
    lifecycle: {
      leadTime: 5,
      minOrderQuantity: 20,
      reorderPoint: 50,
      safetyStock: 20,
      economicOrderQuantity: 100
    },
    environmental: {
      recyclable: false,
      hazardous: false,
      msdsRequired: true,
      environmentalImpact: 'LOW'
    },
    metadata: {
      createdDate: new Date('2024-02-15'),
      lastModified: new Date('2024-02-28'),
      createdBy: 'admin-001',
      isActive: true,
      tags: ['pintura', 'interior', 'latex', 'terminaciones']
    }
  }
]

// Sample inventory data
const sampleInventory: MaterialInventory[] = [
  {
    id: 'inv-001',
    materialId: 'mat-001',
    material: sampleMaterials[0],
    location: {
      warehouse: 'Bodega Central',
      zone: 'A1',
      aisle: '01',
      shelf: '01-03',
      coordinates: { x: 10, y: 15 }
    },
    quantity: {
      physical: 8500,
      available: 7200,
      reserved: 1300,
      damaged: 0,
      inTransit: 0,
      onOrder: 5000
    },
    batches: [
      {
        id: 'batch-001',
        batchNumber: 'POL-2024-0308',
        manufactureDate: new Date('2024-03-08'),
        expiryDate: new Date('2024-06-08'),
        supplier: 'Cemento Polpaico',
        quantity: 5000,
        qualityStatus: 'APPROVED',
        certificates: ['Cert-Calidad-2024-0308.pdf'],
        testResults: [
          { parameter: 'Resistencia 28 días', value: 43.2, unit: 'MPa', passed: true, testDate: new Date('2024-03-10') },
          { parameter: 'Finura Blaine', value: 295, unit: 'm²/kg', passed: true, testDate: new Date('2024-03-09') }
        ]
      },
      {
        id: 'batch-002',
        batchNumber: 'POL-2024-0301',
        manufactureDate: new Date('2024-03-01'),
        expiryDate: new Date('2024-06-01'),
        supplier: 'Cemento Polpaico',
        quantity: 3500,
        qualityStatus: 'APPROVED',
        certificates: ['Cert-Calidad-2024-0301.pdf']
      }
    ],
    movements: [
      {
        id: 'mov-001',
        type: 'RECEIVED',
        quantity: 5000,
        toLocation: 'Bodega Central - A1',
        reason: 'Recepción OC-2024-0045',
        user: 'bodeguero-001',
        timestamp: new Date('2024-03-08T10:30:00'),
        relatedDocument: 'OC-2024-0045',
        cost: 925000
      },
      {
        id: 'mov-002',
        type: 'DISTRIBUTED',
        quantity: 1500,
        fromLocation: 'Bodega Central - A1',
        toLocation: 'Proyecto Torre Las Condes',
        reason: 'Distribución para vaciado losa piso 5',
        user: 'distribuidor-001',
        timestamp: new Date('2024-03-12T14:15:00'),
        relatedDocument: 'DIST-2024-0028'
      }
    ],
    status: 'IN_STOCK',
    alerts: [
      {
        id: 'alert-001',
        type: 'LOW_STOCK',
        severity: 'MEDIUM',
        message: 'Lote POL-2024-0301 expira en 30 días',
        createdDate: new Date('2024-03-15'),
        actions: ['Usar primero en próximas distribuciones', 'Considerar descuento para rotación']
      }
    ],
    costTracking: {
      averageCost: 185,
      totalValue: 1572000,
      lastReceiptCost: 185,
      costMethod: 'FIFO'
    },
    lastUpdate: new Date('2024-03-15T16:30:00'),
    lastCount: {
      date: new Date('2024-03-01'),
      countedBy: 'contador-001',
      physicalCount: 8500,
      systemCount: 8500,
      variance: 0
    }
  },
  {
    id: 'inv-002',
    materialId: 'mat-002',
    material: sampleMaterials[1],
    location: {
      warehouse: 'Patio Fierros',
      zone: 'B2',
      aisle: '12mm',
      coordinates: { x: 25, y: 8 }
    },
    quantity: {
      physical: 1800,
      available: 1200,
      reserved: 600,
      damaged: 0,
      inTransit: 0,
      onOrder: 2000
    },
    batches: [
      {
        id: 'batch-003',
        batchNumber: 'CAP-2024-W12',
        manufactureDate: new Date('2024-02-20'),
        supplier: 'CAP Acero',
        quantity: 1800,
        qualityStatus: 'APPROVED',
        certificates: ['Cert-CAP-2024-W12.pdf'],
        testResults: [
          { parameter: 'Límite elástico', value: 425, unit: 'MPa', passed: true, testDate: new Date('2024-02-22') },
          { parameter: 'Elongación', value: 15.2, unit: '%', passed: true, testDate: new Date('2024-02-22') }
        ]
      }
    ],
    movements: [
      {
        id: 'mov-003',
        type: 'RECEIVED',
        quantity: 2000,
        toLocation: 'Patio Fierros - B2',
        reason: 'Recepción OC-2024-0038',
        user: 'bodeguero-002',
        timestamp: new Date('2024-02-25T09:15:00'),
        relatedDocument: 'OC-2024-0038',
        cost: 1440000
      },
      {
        id: 'mov-004',
        type: 'DISTRIBUTED',
        quantity: 200,
        fromLocation: 'Patio Fierros - B2',
        toLocation: 'Proyecto Torre Las Condes',
        reason: 'Fierro para zapatas',
        user: 'distribuidor-001',
        timestamp: new Date('2024-03-05T11:00:00'),
        relatedDocument: 'DIST-2024-0018'
      }
    ],
    status: 'LOW_STOCK',
    alerts: [
      {
        id: 'alert-002',
        type: 'LOW_STOCK',
        severity: 'HIGH',
        message: 'Stock bajo - Por debajo del punto de reorden (2000 kg)',
        createdDate: new Date('2024-03-14'),
        actions: ['Generar orden de compra urgente', 'Verificar próximas necesidades']
      }
    ],
    costTracking: {
      averageCost: 720,
      totalValue: 1296000,
      lastReceiptCost: 720,
      costMethod: 'AVERAGE'
    },
    lastUpdate: new Date('2024-03-15T15:20:00')
  },
  {
    id: 'inv-003',
    materialId: 'mat-004',
    material: sampleMaterials[3],
    location: {
      warehouse: 'Patio Materiales',
      zone: 'C1',
      aisle: 'Ladrillos',
      coordinates: { x: 5, y: 20 }
    },
    quantity: {
      physical: 2880,
      available: 2880,
      reserved: 0,
      damaged: 0,
      inTransit: 0,
      onOrder: 0
    },
    batches: [
      {
        id: 'batch-004',
        batchNumber: 'PRIN-2024-0305',
        manufactureDate: new Date('2024-03-01'),
        supplier: 'Cerámica Princesa',
        quantity: 1920,
        qualityStatus: 'APPROVED'
      },
      {
        id: 'batch-005',
        batchNumber: 'PRIN-2024-0225',
        manufactureDate: new Date('2024-02-20'),
        supplier: 'Cerámica Princesa',
        quantity: 960,
        qualityStatus: 'APPROVED'
      }
    ],
    movements: [
      {
        id: 'mov-005',
        type: 'RECEIVED',
        quantity: 1920,
        toLocation: 'Patio Materiales - C1',
        reason: 'Recepción OC-2024-0052',
        user: 'bodeguero-001',
        timestamp: new Date('2024-03-05T13:45:00'),
        relatedDocument: 'OC-2024-0052',
        cost: 672000
      }
    ],
    status: 'IN_STOCK',
    alerts: [],
    costTracking: {
      averageCost: 350,
      totalValue: 1008000,
      lastReceiptCost: 350,
      costMethod: 'FIFO'
    },
    lastUpdate: new Date('2024-03-15T12:00:00')
  },
  {
    id: 'inv-004',
    materialId: 'mat-005',
    material: sampleMaterials[4],
    location: {
      warehouse: 'Bodega Química',
      zone: 'D1',
      shelf: 'P01-05',
      coordinates: { x: 3, y: 12 }
    },
    quantity: {
      physical: 0,
      available: 0,
      reserved: 0,
      damaged: 0,
      inTransit: 0,
      onOrder: 80
    },
    batches: [],
    movements: [
      {
        id: 'mov-006',
        type: 'DISTRIBUTED',
        quantity: 45,
        fromLocation: 'Bodega Química - D1',
        toLocation: 'Proyecto Centro Comercial',
        reason: 'Pintura para terminaciones locales',
        user: 'distribuidor-002',
        timestamp: new Date('2024-03-10T16:30:00'),
        relatedDocument: 'DIST-2024-0035'
      }
    ],
    status: 'OUT_OF_STOCK',
    alerts: [
      {
        id: 'alert-003',
        type: 'LOW_STOCK',
        severity: 'CRITICAL',
        message: 'Material agotado - Stock en cero',
        createdDate: new Date('2024-03-10'),
        actions: ['Verificar orden pendiente', 'Contactar proveedor para acelerar entrega']
      }
    ],
    costTracking: {
      averageCost: 8500,
      totalValue: 0,
      lastReceiptCost: 8500,
      costMethod: 'AVERAGE'
    },
    lastUpdate: new Date('2024-03-15T09:30:00')
  }
]

// Sample purchase orders
const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    orderNumber: 'OC-2024-0058',
    supplier: {
      id: 'sup-001',
      name: 'Cemento Polpaico',
      contact: 'Juan Morales',
      email: 'ventas@polpaico.cl',
      phone: '+56 2 2555 1000',
      rating: 4.5
    },
    orderDate: new Date('2024-03-12'),
    expectedDeliveryDate: new Date('2024-03-20'),
    priority: 'HIGH',
    items: [
      {
        id: 'poi-001',
        materialId: 'mat-001',
        material: sampleMaterials[0],
        quantityOrdered: 10000,
        quantityReceived: 0,
        unitPrice: 185,
        totalPrice: 1850000,
        status: 'PENDING',
        expectedDate: new Date('2024-03-20')
      }
    ],
    pricing: {
      subtotal: 1850000,
      tax: 351500,
      shipping: 50000,
      discount: 0,
      total: 2251500,
      currency: 'CLP'
    },
    status: 'CONFIRMED',
    workflow: {
      createdBy: 'comprador-001',
      approvedBy: 'jefe-compras',
      approvalDate: new Date('2024-03-13'),
      stages: [
        { stage: 'Creación', status: 'COMPLETED', date: new Date('2024-03-12'), user: 'comprador-001' },
        { stage: 'Aprobación', status: 'COMPLETED', date: new Date('2024-03-13'), user: 'jefe-compras' },
        { stage: 'Envío a Proveedor', status: 'COMPLETED', date: new Date('2024-03-13'), user: 'comprador-001' },
        { stage: 'Confirmación', status: 'COMPLETED', date: new Date('2024-03-14', user: 'sup-001' },
        { stage: 'En Tránsito', status: 'PENDING' },
        { stage: 'Entrega', status: 'PENDING' }
      ]
    },
    delivery: {
      address: 'Av. Las Condes 12345, Las Condes, Santiago',
      instructions: 'Descargar en bodega central, zona A',
      contactPerson: 'Pedro González',
      phone: '+56 9 8765 4321',
      preferredTime: '08:00 - 16:00',
      accessRequirements: ['Camión hasta 12 toneladas', 'Acceso por portón principal']
    },
    qualityRequirements: {
      inspectionRequired: true,
      testingRequired: true,
      certificates: ['Certificado de Calidad', 'Ensayos de Resistencia'],
      acceptanceCriteria: ['Resistencia min 42.5 MPa', 'Finura Blaine 280-350 m²/kg']
    },
    documents: [
      {
        id: 'doc-001',
        type: 'PURCHASE_ORDER',
        name: 'OC-2024-0058.pdf',
        url: '/documents/po/OC-2024-0058.pdf',
        uploadDate: new Date('2024-03-12'),
        uploadedBy: 'comprador-001'
      }
    ]
  },
  {
    id: 'po-002',
    orderNumber: 'OC-2024-0059',
    supplier: {
      id: 'sup-002',
      name: 'CAP Acero',
      contact: 'María Silva',
      email: 'ventas@cap.cl',
      phone: '+56 2 2555 2000',
      rating: 4.2
    },
    orderDate: new Date('2024-03-14'),
    expectedDeliveryDate: new Date('2024-03-28'),
    priority: 'MEDIUM',
    items: [
      {
        id: 'poi-002',
        materialId: 'mat-002',
        material: sampleMaterials[1],
        quantityOrdered: 5000,
        quantityReceived: 0,
        unitPrice: 720,
        totalPrice: 3600000,
        status: 'PENDING',
        expectedDate: new Date('2024-03-28')
      }
    ],
    pricing: {
      subtotal: 3600000,
      tax: 684000,
      shipping: 120000,
      discount: 72000,
      total: 4332000,
      currency: 'CLP'
    },
    status: 'IN_TRANSIT',
    workflow: {
      createdBy: 'comprador-002',
      approvedBy: 'jefe-compras',
      approvalDate: new Date('2024-03-15'),
      stages: [
        { stage: 'Creación', status: 'COMPLETED', date: new Date('2024-03-14'), user: 'comprador-002' },
        { stage: 'Aprobación', status: 'COMPLETED', date: new Date('2024-03-15'), user: 'jefe-compras' },
        { stage: 'Envío a Proveedor', status: 'COMPLETED', date: new Date('2024-03-15'), user: 'comprador-002' },
        { stage: 'Confirmación', status: 'COMPLETED', date: new Date('2024-03-16'), user: 'sup-002' },
        { stage: 'En Tránsito', status: 'COMPLETED', date: new Date('2024-03-18'), user: 'sup-002' },
        { stage: 'Entrega', status: 'PENDING' }
      ]
    },
    delivery: {
      address: 'Av. Las Condes 12345, Las Condes, Santiago',
      instructions: 'Descargar en patio de fierros, zona B',
      contactPerson: 'Roberto Martinez',
      phone: '+56 9 8765 4322',
      preferredTime: '07:00 - 15:00',
      accessRequirements: ['Camión grúa', 'Acceso por portón lateral']
    },
    documents: []
  }
]

// Sample distributions
const sampleDistributions: MaterialDistribution[] = [
  {
    id: 'dist-001',
    distributionNumber: 'DIST-2024-0042',
    projectId: 'proj-001',
    projectName: 'Torre Residencial Las Condes',
    workOrderId: 'wo-001',
    workOrderTitle: 'Vaciado Losa Piso 6',
    activityId: 'act-001',
    activityName: 'Estructura de Hormigón',
    requestedBy: {
      id: 'user-001',
      name: 'Carlos Rodriguez',
      role: 'Jefe de Terreno'
    },
    requestDate: new Date('2024-03-14'),
    requiredDate: new Date('2024-03-18'),
    items: [
      {
        id: 'disti-001',
        materialId: 'mat-001',
        material: sampleMaterials[0],
        quantityRequested: 2000,
        quantityApproved: 2000,
        quantityDistributed: 2000,
        unitCost: 185,
        totalCost: 370000,
        fromLocation: 'Bodega Central - A1',
        batchId: 'batch-001',
        notes: 'Para vaciado sector norte'
      }
    ],
    status: 'COMPLETED',
    distributedBy: {
      id: 'dist-001',
      name: 'Pedro González',
      timestamp: new Date('2024-03-18T07:30:00')
    },
    receivedBy: {
      id: 'user-001',
      name: 'Carlos Rodriguez',
      timestamp: new Date('2024-03-18T08:15:00'),
      signature: 'signed'
    },
    fromWarehouse: 'Bodega Central',
    toLocation: {
      zone: 'Torre A',
      level: 'Piso 6',
      area: 'Sector Norte',
      coordinates: { lat: -33.4372, lng: -70.6506 }
    },
    transport: {
      method: 'CART',
      operator: 'auxiliar-001',
      estimatedTime: 30,
      actualTime: 25,
      route: 'Bodega → Ascensor → Piso 6'
    },
    costCenter: 'ESTRUCTURA',
    budgetCode: 'E.01.05',
    totalCost: 370000
  },
  {
    id: 'dist-002',
    distributionNumber: 'DIST-2024-0043',
    projectId: 'proj-002',
    projectName: 'Centro Comercial Plaza Norte',
    requestedBy: {
      id: 'user-002',
      name: 'Miguel Torres',
      role: 'Capataz'
    },
    requestDate: new Date('2024-03-15'),
    requiredDate: new Date('2024-03-20'),
    items: [
      {
        id: 'disti-002',
        materialId: 'mat-004',
        material: sampleMaterials[3],
        quantityRequested: 500,
        quantityApproved: 480,
        quantityDistributed: 0,
        unitCost: 350,
        totalCost: 168000,
        fromLocation: 'Patio Materiales - C1',
        notes: 'Para muros locales comerciales'
      }
    ],
    status: 'APPROVED',
    fromWarehouse: 'Patio Materiales',
    toLocation: {
      zone: 'Ala Norte',
      level: 'Primer Piso',
      area: 'Locales 10-15'
    },
    transport: {
      method: 'FORKLIFT',
      estimatedTime: 45,
      route: 'Patio → Entrada Norte → Locales',
      specialInstructions: ['Usar montacargas pequeño', 'Cuidado con altura puertas']
    },
    costCenter: 'ALBAÑILERIA',
    totalCost: 168000
  }
]

// Default story
export const Default: Story = {
  args: {
    variant: 'default',
    layout: 'dashboard',
    mode: 'view',
    materials: sampleMaterials,
    inventory: sampleInventory,
    purchaseOrders: samplePurchaseOrders,
    distributions: sampleDistributions,
    showMaterials: true,
    showInventory: true,
    showPurchaseOrders: true,
    showDistributions: true,
    showAnalytics: false,
    showAlerts: true,
    enableReceiving: true,
    enableDistribution: true,
    enableTransfers: true,
    enableAdjustments: true,
    enableBarcodeScan: false,
    enableQRScan: false,
    currentUser: {
      id: 'user-001',
      name: 'Pedro González',
      role: 'Bodeguero Principal',
      warehouse: 'Bodega Central',
      permissions: ['view', 'receive', 'distribute', 'adjust', 'transfer']
    },
    currentWarehouse: {
      id: 'wh-001',
      name: 'Bodega Central',
      zones: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    criticalAlerts: [],
    enableRealTimeSync: true,
    lastSyncTime: new Date(),
    offlineMode: false,
    pendingOperations: 0,
  },
}

// Warehouse receiving mode
export const WarehouseReceiving: Story = {
  args: {
    ...Default.args,
    mode: 'receive',
    layout: 'warehouse',
    variant: 'full',
    enableReceiving: true,
    isReceiving: false,
    purchaseOrders: samplePurchaseOrders.map(po => ({
      ...po,
      status: po.status === 'CONFIRMED' ? 'IN_TRANSIT' : po.status
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Warehouse receiving mode focused on incoming materials, purchase order processing, quality inspection, and batch tracking.',
      },
    },
  },
}

// Distribution management
export const DistributionManagement: Story = {
  args: {
    ...Default.args,
    mode: 'distribute',
    layout: 'workflow',
    enableDistribution: true,
    isDistributing: false,
    inventory: sampleInventory.filter(item => item.quantity.available > 0),
    distributions: sampleDistributions,
    currentUser: {
      id: 'user-002',
      name: 'María González',
      role: 'Coordinadora Distribución',
      warehouse: 'Bodega Central',
      permissions: ['view', 'distribute', 'approve', 'track']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution management workflow with material requests, approval processes, and delivery coordination to construction sites.',
      },
    },
  },
}

// Scanner-enabled mobile interface
export const MobileScannerInterface: Story = {
  args: {
    ...Default.args,
    variant: 'mobile',
    layout: 'list',
    enableBarcodeScan: true,
    enableQRScan: true,
    showScannerInterface: true,
    enableMobileScanning: true,
    inventory: sampleInventory.slice(0, 3),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized interface with barcode and QR code scanning capabilities for field material tracking and quick operations.',
      },
    },
  },
}

// Stock alerts and critical status
export const StockAlertsMode: Story = {
  args: {
    ...Default.args,
    inventory: sampleInventory.map(item => ({
      ...item,
      status: Math.random() > 0.5 ? 'LOW_STOCK' : item.status,
      alerts: [
        ...item.alerts,
        ...(Math.random() > 0.7 ? [{
          id: `alert-${Math.random()}`,
          type: 'EXPIRED' as const,
          severity: 'CRITICAL' as const,
          message: 'Lote próximo a vencer en 5 días',
          createdDate: new Date(),
          actions: ['Usar con prioridad', 'Contactar proyectos']
        }] : [])
      ]
    })),
    criticalAlerts: [
      {
        id: 'crit-001',
        type: 'STOCK_OUT',
        message: 'Pintura látex agotada - 3 solicitudes pendientes',
        severity: 'CRITICAL',
        timestamp: new Date()
      },
      {
        id: 'crit-002',
        type: 'EXPIRED',
        message: '2 lotes de cemento próximos a vencer',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    showAlerts: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Material tracker with active stock alerts, expiry warnings, and critical inventory status requiring immediate attention.',
      },
    },
  },
}

// Purchase order tracking
export const PurchaseOrderTracking: Story = {
  args: {
    ...Default.args,
    layout: 'workflow',
    showInventory: false,
    showMaterials: false,
    showPurchaseOrders: true,
    showDistributions: false,
    purchaseOrders: [
      ...samplePurchaseOrders,
      {
        ...samplePurchaseOrders[0],
        id: 'po-003',
        orderNumber: 'OC-2024-0060',
        status: 'DELIVERED',
        actualDeliveryDate: new Date('2024-03-16'),
        items: samplePurchaseOrders[0].items.map(item => ({
          ...item,
          quantityReceived: item.quantityOrdered,
          status: 'RECEIVED' as const,
          actualDate: new Date('2024-03-16')
        }))
      }
    ],
    currentUser: {
      id: 'user-003',
      name: 'Ana Silva',
      role: 'Coordinadora Compras',
      permissions: ['view', 'create_po', 'approve', 'track']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Purchase order tracking system with order lifecycle management, supplier communication, and delivery coordination.',
      },
    },
  },
}

// Bulk operations mode
export const BulkOperations: Story = {
  args: {
    ...Default.args,
    selectedInventory: ['inv-001', 'inv-002', 'inv-003'],
    selectedMaterials: ['mat-001', 'mat-002'],
    selectedOrders: ['po-001'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk operations interface for managing multiple materials, inventory adjustments, and batch processing operations.',
      },
    },
  },
}

// Offline synchronization mode
export const OfflineSync: Story = {
  args: {
    ...Default.args,
    offlineMode: true,
    enableRealTimeSync: false,
    pendingOperations: 7,
    isSyncing: false,
    inventory: sampleInventory.map(item => ({
      ...item,
      movements: [
        ...item.movements,
        {
          id: `mov-offline-${Math.random()}`,
          type: 'ADJUSTED' as const,
          quantity: Math.floor(Math.random() * 100),
          reason: 'Ajuste offline pendiente sync',
          user: 'bodeguero-offline',
          timestamp: new Date(),
        }
      ]
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Offline mode with pending operations queue, local data storage, and synchronization indicators for field operations without connectivity.',
      },
    },
  },
}

// Analytics dashboard view
export const AnalyticsDashboard: Story = {
  args: {
    ...Default.args,
    layout: 'dashboard',
    variant: 'full',
    showAnalytics: true,
    currentUser: {
      id: 'user-004',
      name: 'Roberto Díaz',
      role: 'Gerente Logística',
      permissions: ['view', 'analytics', 'reports', 'optimize']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Analytics dashboard with consumption patterns, cost analysis, inventory turnover, and optimization recommendations.',
      },
    },
  },
}

// Quality control and inspection
export const QualityControl: Story = {
  args: {
    ...Default.args,
    mode: 'audit',
    inventory: sampleInventory.map(item => ({
      ...item,
      batches: item.batches.map(batch => ({
        ...batch,
        qualityStatus: Math.random() > 0.8 ? 'PENDING' : 
                      Math.random() > 0.9 ? 'REJECTED' : 'APPROVED',
        testResults: [
          ...batch.testResults || [],
          {
            parameter: 'Inspección Visual',
            value: Math.random() > 0.1 ? 1 : 0,
            unit: 'Pass/Fail',
            passed: Math.random() > 0.1,
            testDate: new Date()
          }
        ]
      }))
    })),
    currentUser: {
      id: 'user-005',
      name: 'Laura Mendez',
      role: 'Inspector de Calidad',
      permissions: ['view', 'inspect', 'approve', 'reject', 'test']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Quality control mode with batch inspection, test result tracking, certification management, and approval workflows.',
      },
    },
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    materials: [],
    inventory: [],
    purchaseOrders: [],
    distributions: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders while material data is being fetched.',
      },
    },
  },
}

// Empty inventory state
export const EmptyState: Story = {
  args: {
    ...Default.args,
    materials: [],
    inventory: [],
    purchaseOrders: [],
    distributions: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no materials are in inventory, guiding users to set up their first material catalog and receive stock.',
      },
    },
  },
}