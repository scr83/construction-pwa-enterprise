'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { StatusCard } from '@/components/molecules/StatusCard'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { FormField } from '@/components/molecules/FormField'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Loading } from '@/components/atoms/Loading'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { Checkbox } from '@/components/atoms/Checkbox'

const materialTrackerVariants = cva(
  'bg-white rounded-lg border border-secondary-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        full: 'p-8',
        mobile: 'p-3',
      },
      layout: {
        dashboard: 'grid gap-6',
        list: 'flex flex-col space-y-4',
        warehouse: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
        workflow: 'flex flex-col space-y-6',
      },
      mode: {
        view: '',
        receive: 'border-success-200',
        distribute: 'border-primary-200',
        track: 'border-warning-200',
        audit: 'border-purple-200',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'dashboard',
      mode: 'view',
    },
  }
)

// Material definition interfaces
export interface Material {
  id: string
  name: string
  category: 'HORMIGON' | 'FIERRO' | 'CEMENTO' | 'ARENA' | 'GRAVA' | 'LADRILLO' | 'CERAMICA' | 'PINTURA' | 'MADERA' | 'ACERO' | 'TUBERIA' | 'CABLES' | 'OTROS'
  subcategory?: string
  description?: string
  
  // Specifications
  specifications: {
    brand?: string
    model?: string
    grade?: string // H20, H25, H30 para hormigón
    size?: string // dimensiones, diámetro, etc.
    color?: string
    finish?: string
    weight?: number
    volume?: number
    strength?: string // resistencia
    composition?: string
    standard?: string // NCH, ASTM, etc.
  }
  
  // Units and measurements
  unit: {
    base: 'MT' | 'M3' | 'M2' | 'ML' | 'KG' | 'LT' | 'UN' | 'M' // Toneladas, metros cúbicos, etc.
    conversion?: Array<{
      unit: string
      factor: number
      description: string
    }>
  }
  
  // Cost information
  cost: {
    basePrice: number
    currency: 'CLP' | 'USD'
    priceUnit: string
    lastUpdate: Date
    supplier?: string
    priceHistory?: Array<{
      date: Date
      price: number
      supplier: string
    }>
  }
  
  // Storage requirements
  storage: {
    type: 'INTERIOR' | 'EXTERIOR' | 'CUBIERTO' | 'REFRIGERADO' | 'ESPECIAL'
    conditions?: string[]
    maxStackHeight?: number
    separationRequired?: boolean
    hazardous?: boolean
    specialHandling?: string[]
  }
  
  // Quality control
  quality: {
    requiresInspection: boolean
    testRequired?: boolean
    certificationNeeded?: boolean
    shelfLife?: number // days
    qualityCriteria?: Array<{
      parameter: string
      minValue?: number
      maxValue?: number
      unit: string
      tolerance: number
    }>
  }
  
  // Material lifecycle
  lifecycle: {
    leadTime: number // days
    minOrderQuantity?: number
    maxOrderQuantity?: number
    reorderPoint: number
    safetyStock: number
    economicOrderQuantity?: number
  }
  
  // Environmental and safety
  environmental: {
    recyclable?: boolean
    hazardous?: boolean
    msdsRequired?: boolean
    specialDisposal?: boolean
    environmentalImpact?: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  
  // Additional metadata
  metadata: {
    createdDate: Date
    lastModified: Date
    createdBy: string
    isActive: boolean
    tags?: string[]
    notes?: string
  }
}

// Inventory tracking interfaces
export interface MaterialInventory {
  id: string
  materialId: string
  material: Material
  
  // Location tracking
  location: {
    warehouse: string
    zone: string
    aisle?: string
    shelf?: string
    bin?: string
    coordinates?: { x: number; y: number; z?: number }
  }
  
  // Quantity tracking
  quantity: {
    physical: number // cantidad física real
    available: number // disponible para uso
    reserved: number // reservado para proyectos
    damaged: number // dañado
    inTransit: number // en tránsito
    onOrder: number // en pedido
  }
  
  // Batch/lot tracking
  batches: Array<{
    id: string
    batchNumber: string
    lotNumber?: string
    manufactureDate?: Date
    expiryDate?: Date
    supplier: string
    quantity: number
    qualityStatus: 'APPROVED' | 'REJECTED' | 'PENDING' | 'CONDITIONAL'
    certificates?: string[]
    testResults?: Array<{
      parameter: string
      value: number
      unit: string
      passed: boolean
      testDate: Date
    }>
  }>
  
  // Movement history
  movements: Array<{
    id: string
    type: 'RECEIVED' | 'DISTRIBUTED' | 'RETURNED' | 'ADJUSTED' | 'DAMAGED' | 'TRANSFERRED'
    quantity: number
    fromLocation?: string
    toLocation?: string
    reason?: string
    user: string
    timestamp: Date
    relatedDocument?: string
    cost?: number
  }>
  
  // Status and alerts
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'DAMAGED' | 'QUARANTINE'
  alerts: Array<{
    id: string
    type: 'LOW_STOCK' | 'EXPIRED' | 'DAMAGED' | 'QUALITY_ISSUE' | 'OVERDUE'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    message: string
    createdDate: Date
    resolvedDate?: Date
    resolvedBy?: string
    actions?: string[]
  }>
  
  // Cost tracking
  costTracking: {
    averageCost: number
    totalValue: number
    lastReceiptCost?: number
    costMethod: 'FIFO' | 'LIFO' | 'AVERAGE' | 'SPECIFIC'
  }
  
  // Last updated
  lastUpdate: Date
  lastCount?: {
    date: Date
    countedBy: string
    physicalCount: number
    systemCount: number
    variance: number
    notes?: string
  }
}

// Purchase order and procurement
export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: {
    id: string
    name: string
    contact: string
    email: string
    phone: string
    rating: number
  }
  
  // Order details
  orderDate: Date
  expectedDeliveryDate: Date
  actualDeliveryDate?: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  
  // Items
  items: Array<{
    id: string
    materialId: string
    material: Material
    quantityOrdered: number
    quantityReceived: number
    unitPrice: number
    totalPrice: number
    status: 'PENDING' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED'
    expectedDate?: Date
    actualDate?: Date
  }>
  
  // Pricing
  pricing: {
    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number
    currency: 'CLP' | 'USD'
  }
  
  // Status and workflow
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'
  workflow: {
    createdBy: string
    approvedBy?: string
    receivedBy?: string
    approvalDate?: Date
    stages: Array<{
      stage: string
      status: 'PENDING' | 'COMPLETED' | 'SKIPPED'
      date?: Date
      user?: string
      notes?: string
    }>
  }
  
  // Delivery and logistics
  delivery: {
    address: string
    instructions?: string
    contactPerson: string
    phone: string
    preferredTime?: string
    accessRequirements?: string[]
  }
  
  // Quality requirements
  qualityRequirements?: {
    inspectionRequired: boolean
    testingRequired: boolean
    certificates: string[]
    acceptanceCriteria: string[]
  }
  
  // Documentation
  documents: Array<{
    id: string
    type: 'PURCHASE_ORDER' | 'INVOICE' | 'RECEIPT' | 'CERTIFICATE' | 'TEST_REPORT'
    name: string
    url?: string
    uploadDate: Date
    uploadedBy: string
  }>
}

// Distribution and consumption
export interface MaterialDistribution {
  id: string
  distributionNumber: string
  
  // Project and work order
  projectId: string
  projectName: string
  workOrderId?: string
  workOrderTitle?: string
  activityId?: string
  activityName?: string
  
  // Request details
  requestedBy: {
    id: string
    name: string
    role: string
  }
  requestDate: Date
  requiredDate: Date
  
  // Items distributed
  items: Array<{
    id: string
    materialId: string
    material: Material
    quantityRequested: number
    quantityApproved: number
    quantityDistributed: number
    unitCost: number
    totalCost: number
    fromLocation: string
    batchId?: string
    notes?: string
  }>
  
  // Status and tracking
  status: 'REQUESTED' | 'APPROVED' | 'PREPARED' | 'DISTRIBUTED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'
  distributedBy?: {
    id: string
    name: string
    timestamp: Date
  }
  receivedBy?: {
    id: string
    name: string
    timestamp: Date
    signature?: string
  }
  
  // Location tracking
  fromWarehouse: string
  toLocation: {
    zone: string
    level?: string
    area?: string
    coordinates?: { lat: number; lng: number }
  }
  
  // Transportation
  transport?: {
    method: 'MANUAL' | 'CART' | 'FORKLIFT' | 'CRANE' | 'TRUCK'
    operator?: string
    estimatedTime: number
    actualTime?: number
    route?: string
    specialInstructions?: string[]
  }
  
  // Cost and budget tracking
  costCenter?: string
  budgetCode?: string
  totalCost: number
  
  // Return tracking
  returns?: Array<{
    id: string
    returnDate: Date
    returnedBy: string
    items: Array<{
      materialId: string
      quantity: number
      condition: 'GOOD' | 'DAMAGED' | 'EXPIRED'
      reason: string
    }>
  }>
}

// Analytics and reporting
export interface MaterialAnalytics {
  materialId: string
  material: Material
  period: {
    startDate: Date
    endDate: Date
  }
  
  // Consumption analytics
  consumption: {
    totalConsumed: number
    averageDailyConsumption: number
    peakConsumption: number
    peakDate: Date
    trend: 'INCREASING' | 'DECREASING' | 'STABLE'
    forecast: Array<{
      date: Date
      forecastQuantity: number
      confidence: number
    }>
  }
  
  // Cost analytics
  cost: {
    totalCost: number
    averageCost: number
    costVariance: number
    costPerProject: Array<{
      projectId: string
      projectName: string
      totalCost: number
      quantity: number
    }>
  }
  
  // Performance metrics
  performance: {
    stockTurnover: number
    daysOnHand: number
    fillRate: number // % de pedidos completos
    accuracyRate: number // precisión inventario
    wastageRate: number // % de desperdicio
  }
  
  // Quality metrics
  quality: {
    defectRate: number
    rejectionRate: number
    reworkRate: number
    supplierRating: number
    qualityScore: number
  }
  
  // Efficiency metrics
  efficiency: {
    orderFrequency: number
    leadTimeVariance: number
    stockoutEvents: number
    overstockEvents: number
    handlingCost: number
  }
}

export interface MaterialTrackerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof materialTrackerVariants> {
  // Data
  materials?: Material[]
  inventory?: MaterialInventory[]
  purchaseOrders?: PurchaseOrder[]
  distributions?: MaterialDistribution[]
  analytics?: MaterialAnalytics[]
  
  // Display configuration
  showMaterials?: boolean
  showInventory?: boolean
  showPurchaseOrders?: boolean
  showDistributions?: boolean
  showAnalytics?: boolean
  showAlerts?: boolean
  
  // Workflow modes
  enableReceiving?: boolean
  enableDistribution?: boolean
  enableTransfers?: boolean
  enableAdjustments?: boolean
  enableBarcodeScan?: boolean
  enableQRScan?: boolean
  
  // Filtering and search
  materialFilters?: {
    categories?: string[]
    status?: string[]
    location?: string[]
    supplier?: string[]
    lowStock?: boolean
    expired?: boolean
  }
  
  purchaseFilters?: {
    status?: string[]
    supplier?: string[]
    priority?: string[]
    dateRange?: { start: Date; end: Date }
  }
  
  distributionFilters?: {
    status?: string[]
    projects?: string[]
    requestedBy?: string[]
    dateRange?: { start: Date; end: Date }
  }
  
  // Actions and callbacks
  onMaterialCreate?: (material: Partial<Material>) => void
  onMaterialUpdate?: (materialId: string, updates: Partial<Material>) => void
  onMaterialDelete?: (materialId: string) => void
  
  onInventoryAdjust?: (inventoryId: string, adjustment: number, reason: string) => void
  onInventoryTransfer?: (from: string, to: string, materialId: string, quantity: number) => void
  onInventoryCount?: (inventoryId: string, physicalCount: number) => void
  
  onPurchaseOrderCreate?: (order: Partial<PurchaseOrder>) => void
  onPurchaseOrderUpdate?: (orderId: string, updates: Partial<PurchaseOrder>) => void
  onMaterialReceive?: (orderId: string, items: any[]) => void
  
  onDistributionRequest?: (request: Partial<MaterialDistribution>) => void
  onDistributionApprove?: (distributionId: string) => void
  onDistributionComplete?: (distributionId: string, receivedBy: string) => void
  
  onAlertResolve?: (alertId: string, action: string) => void
  onBarcodeScanned?: (barcode: string) => void
  onQRCodeScanned?: (qrcode: string) => void
  
  onReportGenerate?: (type: string, parameters: any) => void
  onAnalyticsView?: (materialId: string, period: any) => void
  
  // Bulk operations
  onBulkReceive?: (items: any[]) => void
  onBulkDistribute?: (items: any[]) => void
  onBulkAdjust?: (adjustments: any[]) => void
  onBulkTransfer?: (transfers: any[]) => void
  
  // UI state
  selectedMaterials?: string[]
  selectedInventory?: string[]
  selectedOrders?: string[]
  
  onSelectionChange?: (type: 'materials' | 'inventory' | 'orders', selection: string[]) => void
  
  // Loading and sync
  isLoading?: boolean
  isReceiving?: boolean
  isDistributing?: boolean
  isSyncing?: boolean
  
  // User context
  currentUser?: {
    id: string
    name: string
    role: string
    warehouse?: string
    permissions: string[]
  }
  
  currentWarehouse?: {
    id: string
    name: string
    zones: string[]
  }
  
  // Mobile and scanner
  enableMobileScanning?: boolean
  showScannerInterface?: boolean
  
  // Alerts and notifications
  criticalAlerts?: Array<{
    id: string
    type: string
    message: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    timestamp: Date
  }>
  
  // Real-time features
  enableRealTimeSync?: boolean
  lastSyncTime?: Date
  
  // Offline capabilities
  offlineMode?: boolean
  pendingOperations?: number
}

const MaterialTracker = React.forwardRef<HTMLDivElement, MaterialTrackerProps>(
  (
    {
      className,
      variant,
      layout,
      mode,
      materials = [],
      inventory = [],
      purchaseOrders = [],
      distributions = [],
      analytics = [],
      showMaterials = true,
      showInventory = true,
      showPurchaseOrders = true,
      showDistributions = true,
      showAnalytics = false,
      showAlerts = true,
      enableReceiving = true,
      enableDistribution = true,
      enableTransfers = true,
      enableAdjustments = true,
      enableBarcodeScan = false,
      enableQRScan = false,
      materialFilters = {},
      purchaseFilters = {},
      distributionFilters = {},
      onMaterialCreate,
      onMaterialUpdate,
      onMaterialDelete,
      onInventoryAdjust,
      onInventoryTransfer,
      onInventoryCount,
      onPurchaseOrderCreate,
      onPurchaseOrderUpdate,
      onMaterialReceive,
      onDistributionRequest,
      onDistributionApprove,
      onDistributionComplete,
      onAlertResolve,
      onBarcodeScanned,
      onQRCodeScanned,
      onReportGenerate,
      onAnalyticsView,
      onBulkReceive,
      onBulkDistribute,
      onBulkAdjust,
      onBulkTransfer,
      selectedMaterials = [],
      selectedInventory = [],
      selectedOrders = [],
      onSelectionChange,
      isLoading = false,
      isReceiving = false,
      isDistributing = false,
      isSyncing = false,
      currentUser,
      currentWarehouse,
      enableMobileScanning = false,
      showScannerInterface = false,
      criticalAlerts = [],
      enableRealTimeSync = true,
      lastSyncTime,
      offlineMode = false,
      pendingOperations = 0,
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = React.useState<'inventory' | 'materials' | 'orders' | 'distributions' | 'analytics'>('inventory')
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
    const [scannerActive, setScannerActive] = React.useState(false)
    const [bulkOperationMode, setBulkOperationMode] = React.useState(false)
    const [quickReceiveMode, setQuickReceiveMode] = React.useState(false)
    const [distributionDialogOpen, setDistributionDialogOpen] = React.useState(false)
    const [adjustmentDialogOpen, setAdjustmentDialogOpen] = React.useState(false)

    // Filter inventory based on current filters
    const filteredInventory = React.useMemo(() => {
      return inventory.filter(item => {
        if (materialFilters.categories?.length && !materialFilters.categories.includes(item.material.category)) return false
        if (materialFilters.status?.length && !materialFilters.status.includes(item.status)) return false
        if (materialFilters.location?.length && !materialFilters.location.includes(item.location.warehouse)) return false
        if (materialFilters.lowStock && item.status !== 'LOW_STOCK') return false
        if (materialFilters.expired && !item.batches.some(b => b.expiryDate && b.expiryDate < new Date())) return false
        return true
      })
    }, [inventory, materialFilters])

    // Calculate key metrics
    const metrics = React.useMemo(() => {
      const totalValue = filteredInventory.reduce((sum, item) => sum + item.costTracking.totalValue, 0)
      const lowStockItems = filteredInventory.filter(item => item.status === 'LOW_STOCK').length
      const outOfStockItems = filteredInventory.filter(item => item.status === 'OUT_OF_STOCK').length
      const pendingReceiving = purchaseOrders.filter(po => po.status === 'IN_TRANSIT').length
      const pendingDistributions = distributions.filter(d => d.status === 'REQUESTED').length
      
      return {
        totalValue,
        lowStockItems,
        outOfStockItems,
        pendingReceiving,
        pendingDistributions,
        totalItems: filteredInventory.length,
        averageStockDays: 45 // placeholder
      }
    }, [filteredInventory, purchaseOrders, distributions])

    // Handle item selection
    const handleItemSelection = (itemId: string, selected: boolean) => {
      const newSelection = new Set(selectedItems)
      if (selected) {
        newSelection.add(itemId)
      } else {
        newSelection.delete(itemId)
      }
      setSelectedItems(newSelection)
    }

    // Handle scanner input
    const handleScannerInput = (data: string, type: 'barcode' | 'qr') => {
      if (type === 'barcode') {
        onBarcodeScanned?.(data)
      } else {
        onQRCodeScanned?.(data)
      }
      setScannerActive(false)
    }

    // Get material category color
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'HORMIGON': return 'blue'
        case 'FIERRO': return 'gray'
        case 'CEMENTO': return 'orange'
        case 'ARENA': return 'yellow'
        case 'GRAVA': return 'slate'
        case 'LADRILLO': return 'red'
        case 'CERAMICA': return 'cyan'
        case 'PINTURA': return 'purple'
        case 'MADERA': return 'amber'
        case 'ACERO': return 'zinc'
        default: return 'secondary'
      }
    }

    // Get status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'IN_STOCK': return 'success'
        case 'LOW_STOCK': return 'warning'
        case 'OUT_OF_STOCK': return 'danger'
        case 'OVERSTOCK': return 'info'
        case 'DAMAGED': return 'danger'
        case 'QUARANTINE': return 'warning'
        default: return 'secondary'
      }
    }

    if (isLoading) {
      return (
        <div
          className={cn(
            materialTrackerVariants({ variant, layout, mode }),
            'animate-pulse',
            className
          )}
        >
          <div className="space-y-6">
            <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(materialTrackerVariants({ variant, layout, mode }), className)}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Typography variant="h4" className="font-bold">
                Control de Materiales
              </Typography>
              {currentWarehouse && (
                <Badge variant="primary" icon="warehouse">
                  {currentWarehouse.name}
                </Badge>
              )}
              
              {/* Sync status */}
              {enableRealTimeSync && (
                <div className="flex items-center gap-2">
                  {isSyncing ? (
                    <Badge variant="primary" size="xs">
                      <Icon name="refresh-cw" size="xs" className="animate-spin mr-1" />
                      Sincronizando
                    </Badge>
                  ) : (
                    <Badge variant="success" size="xs" title={`Última sync: ${lastSyncTime?.toLocaleTimeString()}`}>
                      <Icon name="check-circle" size="xs" className="mr-1" />
                      Actualizado
                    </Badge>
                  )}
                  
                  {offlineMode && (
                    <Badge variant="warning" size="xs">
                      <Icon name="wifi-off" size="xs" className="mr-1" />
                      Sin conexión
                    </Badge>
                  )}
                  
                  {pendingOperations > 0 && (
                    <Badge variant="warning" size="xs" count={pendingOperations}>
                      Pendientes
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Critical alerts */}
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Icon name="alert-triangle" size="xs" className="text-red-500" />
                <span className="text-red-600">
                  {criticalAlerts.length} alerta{criticalAlerts.length !== 1 ? 's' : ''} crítica{criticalAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Scanner toggle */}
            {(enableBarcodeScan || enableQRScan) && (
              <Button
                variant={scannerActive ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setScannerActive(!scannerActive)}
                leftIcon={<Icon name="scan" size="xs" />}
              >
                {!variant?.includes('mobile') && 'Escanear'}
              </Button>
            )}
            
            {/* Quick receive */}
            {enableReceiving && (
              <Button
                variant={quickReceiveMode ? 'success' : 'ghost'}
                size="sm"
                onClick={() => setQuickReceiveMode(!quickReceiveMode)}
                leftIcon={<Icon name="package" size="xs" />}
                disabled={isReceiving}
              >
                {isReceiving ? <Loading size="xs" /> : (!variant?.includes('mobile') && 'Recibir')}
              </Button>
            )}
            
            {/* Quick distribute */}
            {enableDistribution && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDistributionDialogOpen(true)}
                leftIcon={<Icon name="send" size="xs" />}
                disabled={isDistributing}
              >
                {isDistributing ? <Loading size="xs" /> : (!variant?.includes('mobile') && 'Distribuir')}
              </Button>
            )}
            
            {/* Bulk operations */}
            {selectedItems.size > 0 && (
              <Button
                variant={bulkOperationMode ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setBulkOperationMode(!bulkOperationMode)}
                leftIcon={<Icon name="layers" size="xs" />}
              >
                {!variant?.includes('mobile') && 'Bulk'}
              </Button>
            )}
            
            {/* Reports */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReportGenerate?.('inventory', {})}
              leftIcon={<Icon name="file-text" size="xs" />}
            >
              {!variant?.includes('mobile') && 'Reportes'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <MetricDisplay
            title="Valor Total"
            value={metrics.totalValue / 1000000}
            format="currency"
            unit="M"
            size="sm"
            color="primary"
          />
          
          <MetricDisplay
            title="Items"
            value={metrics.totalItems}
            format="count"
            size="sm"
            color="info"
          />
          
          <MetricDisplay
            title="Stock Bajo"
            value={metrics.lowStockItems}
            format="count"
            size="sm"
            color={metrics.lowStockItems > 0 ? 'warning' : 'success'}
          />
          
          <MetricDisplay
            title="Sin Stock"
            value={metrics.outOfStockItems}
            format="count"
            size="sm"
            color={metrics.outOfStockItems > 0 ? 'danger' : 'success'}
          />
          
          <MetricDisplay
            title="Por Recibir"
            value={metrics.pendingReceiving}
            format="count"
            size="sm"
            color="warning"
          />
          
          <MetricDisplay
            title="Solicitudes"
            value={metrics.pendingDistributions}
            format="count"
            size="sm"
            color="info"
          />
          
          <MetricDisplay
            title="Días Stock"
            value={metrics.averageStockDays}
            format="count"
            unit="días"
            size="sm"
            color="primary"
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-secondary-200">
          <nav className="flex space-x-8">
            {[
              { id: 'inventory', label: 'Inventario', icon: 'package', count: filteredInventory.length },
              { id: 'materials', label: 'Materiales', icon: 'layers', count: materials.length },
              { id: 'orders', label: 'Órdenes', icon: 'shopping-cart', count: purchaseOrders.length },
              { id: 'distributions', label: 'Distribuciones', icon: 'truck', count: distributions.length },
              { id: 'analytics', label: 'Análisis', icon: 'bar-chart', count: analytics.length }
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  )}
                >
                  <Icon name={tab.icon as any} size="xs" />
                  {tab.label}
                  <Badge size="xs" variant={isActive ? 'primary' : 'secondary'} count={tab.count} />
                </button>
              )
            })}
          </nav>
        </div>

        {/* Scanner Interface */}
        {scannerActive && showScannerInterface && (
          <div className="mb-6 p-4 bg-primary-25 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="body-default" className="font-semibold">
                Modo Escaneo Activo
              </Typography>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setScannerActive(false)}
                leftIcon={<Icon name="x" size="xs" />}
              >
                Cerrar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-secondary-200 rounded-lg text-center">
                <Icon name="maximize" size="lg" className="mx-auto mb-2 text-secondary-400" />
                <Typography variant="body-small" color="muted">
                  Escanea código de barras
                </Typography>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    // Mock barcode scan
                    handleScannerInput('1234567890123', 'barcode')
                  }}
                >
                  Simular Escaneo
                </Button>
              </div>
              
              <div className="p-4 bg-white border border-secondary-200 rounded-lg text-center">
                <Icon name="square" size="lg" className="mx-auto mb-2 text-secondary-400" />
                <Typography variant="body-small" color="muted">
                  Escanea código QR
                </Typography>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    // Mock QR scan
                    handleScannerInput('QR-MAT-001-LOT-ABC123', 'qr')
                  }}
                >
                  Simular QR
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="package" size="lg" className="text-secondary-400" />
                  </div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    No hay items en inventario
                  </Typography>
                  <Typography variant="body-default" color="muted" className="mb-4">
                    Comienza recibiendo materiales para crear tu inventario
                  </Typography>
                  <Button
                    variant="primary"
                    onClick={() => setQuickReceiveMode(true)}
                    leftIcon={<Icon name="plus" size="xs" />}
                  >
                    Recibir Materiales
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInventory.map((item) => {
                    const isSelected = selectedItems.has(item.id)
                    const lowStock = item.quantity.available <= item.material.lifecycle.reorderPoint
                    const hasAlerts = item.alerts.filter(a => !a.resolvedDate).length > 0
                    
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-all',
                          isSelected && 'border-primary-500 bg-primary-25',
                          lowStock && 'border-l-4 border-l-warning-500',
                          item.status === 'OUT_OF_STOCK' && 'border-l-4 border-l-danger-500'
                        )}
                      >
                        {/* Item header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            {bulkOperationMode && (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleItemSelection(item.id, checked)}
                                className="mt-1"
                              />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Typography variant="body-default" className="font-semibold truncate">
                                  {item.material.name}
                                </Typography>
                                <Badge
                                  variant={getCategoryColor(item.material.category) as any}
                                  size="xs"
                                >
                                  {item.material.category}
                                </Badge>
                                {hasAlerts && (
                                  <Badge variant="danger" size="xs" icon="alert-circle">
                                    {item.alerts.filter(a => !a.resolvedDate).length}
                                  </Badge>
                                )}
                              </div>
                              
                              <Typography variant="caption" color="muted" className="truncate">
                                {item.material.specifications.brand} • {item.material.specifications.grade}
                                {item.location.zone && ` • ${item.location.zone}`}
                              </Typography>
                            </div>
                          </div>
                          
                          <StatusCard
                            status={{
                              value: item.status.replace('_', ' ').toLowerCase(),
                              variant: getStatusColor(item.status)
                            }}
                            size="sm"
                          />
                        </div>
                        
                        {/* Quantity information */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <Typography variant="h6" className={cn(
                              'font-bold',
                              lowStock ? 'text-warning-600' : 'text-success-600'
                            )}>
                              {item.quantity.available}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Disponible
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-blue-600">
                              {item.quantity.physical}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Físico
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-orange-600">
                              {item.quantity.reserved}
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Reservado
                            </Typography>
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold text-purple-600">
                              ${(item.costTracking.totalValue / 1000000).toFixed(1)}M
                            </Typography>
                            <Typography variant="caption" color="muted">
                              Valor
                            </Typography>
                          </div>
                        </div>
                        
                        {/* Stock level indicator */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Stock Level</span>
                            <span>
                              {item.quantity.available} / {item.material.lifecycle.reorderPoint} (mín)
                            </span>
                          </div>
                          <ProgressBar
                            progress={Math.min((item.quantity.available / item.material.lifecycle.reorderPoint) * 100, 100)}
                            variant={lowStock ? 'warning' : 'success'}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        
                        {/* Recent batches */}
                        {item.batches.length > 0 && (
                          <div className="mb-3">
                            <Typography variant="caption" className="font-medium mb-1 block">
                              Lotes Recientes
                            </Typography>
                            <div className="flex flex-wrap gap-1">
                              {item.batches.slice(0, 3).map((batch) => {
                                const isExpired = batch.expiryDate && batch.expiryDate < new Date()
                                const isNearExpiry = batch.expiryDate && 
                                  batch.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                
                                return (
                                  <Badge
                                    key={batch.id}
                                    size="xs"
                                    variant={
                                      isExpired ? 'danger' :
                                      isNearExpiry ? 'warning' :
                                      batch.qualityStatus === 'APPROVED' ? 'success' :
                                      batch.qualityStatus === 'REJECTED' ? 'danger' :
                                      'secondary'
                                    }
                                    title={`Lote: ${batch.batchNumber} | Cantidad: ${batch.quantity} | Estado: ${batch.qualityStatus}`}
                                  >
                                    {batch.batchNumber}
                                  </Badge>
                                )
                              })}
                              {item.batches.length > 3 && (
                                <Badge size="xs" variant="secondary">
                                  +{item.batches.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => onAnalyticsView?.(item.materialId, {})}
                              leftIcon={<Icon name="bar-chart" size="xs" />}
                            >
                              Análisis
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setAdjustmentDialogOpen(true)}
                              leftIcon={<Icon name="edit" size="xs" />}
                            >
                              Ajustar
                            </Button>
                            
                            {enableTransfers && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => {
                                  // Open transfer dialog
                                }}
                                leftIcon={<Icon name="move" size="xs" />}
                              >
                                Transferir
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {lowStock && (
                              <Button
                                variant="warning"
                                size="xs"
                                onClick={() => onPurchaseOrderCreate?.({ 
                                  items: [{ materialId: item.materialId, quantityOrdered: item.material.lifecycle.economicOrderQuantity || 100 }] 
                                } as any)}
                                leftIcon={<Icon name="shopping-cart" size="xs" />}
                              >
                                Ordenar
                              </Button>
                            )}
                            
                            {enableDistribution && item.quantity.available > 0 && (
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() => setDistributionDialogOpen(true)}
                                leftIcon={<Icon name="send" size="xs" />}
                              >
                                Distribuir
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Other tabs would be implemented here */}
          {activeTab === 'materials' && (
            <div className="text-center py-12">
              <Typography variant="h6" className="font-semibold mb-2">
                Catálogo de Materiales
              </Typography>
              <Typography variant="body-default" color="muted">
                Gestiona el catálogo maestro de materiales de construcción
              </Typography>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <Typography variant="h6" className="font-semibold mb-2">
                Órdenes de Compra
              </Typography>
              <Typography variant="body-default" color="muted">
                Gestiona las órdenes de compra y recepción de materiales
              </Typography>
            </div>
          )}

          {activeTab === 'distributions' && (
            <div className="text-center py-12">
              <Typography variant="h6" className="font-semibold mb-2">
                Distribuciones
              </Typography>
              <Typography variant="body-default" color="muted">
                Controla la distribución de materiales a los proyectos
              </Typography>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <Typography variant="h6" className="font-semibold mb-2">
                Análisis y Reportes
              </Typography>
              <Typography variant="body-default" color="muted">
                Visualiza métricas de consumo, costos y eficiencia
              </Typography>
            </div>
          )}
        </div>

        {/* Distribution Dialog */}
        {distributionDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-semibold">
                  Nueva Distribución
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDistributionDialogOpen(false)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <FormField
                  name="projectId"
                  label="Proyecto"
                  placeholder="Seleccionar proyecto"
                  required
                />
                
                <FormField
                  name="requestedBy"
                  label="Solicitado por"
                  placeholder="Nombre del solicitante"
                  required
                />
                
                <FormField
                  name="requiredDate"
                  label="Fecha Requerida"
                  type="date"
                  required
                />
                
                <FormField
                  name="toLocation"
                  label="Ubicación de Entrega"
                  placeholder="Torre, piso, área"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setDistributionDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Handle create distribution
                    setDistributionDialogOpen(false)
                  }}
                >
                  Crear Distribución
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Adjustment Dialog */}
        {adjustmentDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-semibold">
                  Ajustar Inventario
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdjustmentDialogOpen(false)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <FormField
                  name="adjustment"
                  label="Ajuste de Cantidad"
                  type="number"
                  placeholder="0"
                  helperText="Valor positivo para aumentar, negativo para disminuir"
                  required
                />
                
                <FormField
                  name="reason"
                  label="Motivo del Ajuste"
                  placeholder="Explicar la razón del ajuste"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setAdjustmentDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Handle adjustment
                    setAdjustmentDialogOpen(false)
                  }}
                >
                  Aplicar Ajuste
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

MaterialTracker.displayName = 'MaterialTracker'

export { MaterialTracker, materialTrackerVariants }
export type { 
  MaterialTrackerProps,
  Material,
  MaterialInventory,
  PurchaseOrder,
  MaterialDistribution,
  MaterialAnalytics
}