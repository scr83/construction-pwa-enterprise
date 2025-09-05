import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FormTemplate } from './FormTemplate'
import type { FormTemplateProps } from './FormTemplate'

const meta: Meta<typeof FormTemplate> = {
  title: 'Templates/FormTemplate',
  component: FormTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Plantilla para formularios de construcción con soporte multi-paso, campos especiales y validación automática.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['wizard', 'single'],
      description: 'Modo de visualización del formulario'
    },
    role: {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario para permisos'
    }
  }
}

export default meta
type Story = StoryObj<typeof FormTemplate>

// Datos de ejemplo para formularios
const projectFormSteps = [
  {
    id: 'general',
    title: 'Información General',
    subtitle: 'Datos básicos del proyecto',
    sections: [
      {
        id: 'basic',
        title: 'Datos del Proyecto',
        fields: [
          { id: 'nombre', label: 'Nombre del Proyecto', type: 'text' as const, required: true },
          { id: 'codigo', label: 'Código', type: 'text' as const, required: true },
          { id: 'descripcion', label: 'Descripción', type: 'textarea' as const },
          { id: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' as const, required: true },
          { id: 'presupuesto', label: 'Presupuesto', type: 'number' as const }
        ]
      }
    ]
  },
  {
    id: 'ubicacion',
    title: 'Ubicación y Terreno',
    subtitle: 'Información geográfica y características del terreno',
    sections: [
      {
        id: 'location',
        title: 'Ubicación',
        fields: [
          { id: 'direccion', label: 'Dirección', type: 'text' as const, required: true },
          { id: 'comuna', label: 'Comuna', type: 'text' as const, required: true },
          { id: 'region', label: 'Región', type: 'select' as const, options: ['RM', 'V', 'VIII'], required: true },
          { id: 'coordenadas', label: 'Coordenadas GPS', type: 'location' as const }
        ]
      },
      {
        id: 'terrain',
        title: 'Características del Terreno',
        fields: [
          { id: 'superficie', label: 'Superficie (m²)', type: 'number' as const },
          { id: 'tipo_suelo', label: 'Tipo de Suelo', type: 'select' as const, options: ['Arcilloso', 'Arenoso', 'Rocoso'] },
          { id: 'pendiente', label: 'Pendiente (%)', type: 'number' as const },
          { id: 'foto_terreno', label: 'Foto del Terreno', type: 'photo' as const }
        ]
      }
    ]
  },
  {
    id: 'documentos',
    title: 'Documentación',
    subtitle: 'Permisos, planos y documentos legales',
    sections: [
      {
        id: 'permits',
        title: 'Permisos y Licencias',
        fields: [
          { id: 'permiso_edificacion', label: 'Permiso de Edificación', type: 'file' as const },
          { id: 'planos', label: 'Planos Arquitectónicos', type: 'file' as const, multiple: true },
          { id: 'estudio_suelo', label: 'Estudio de Suelo', type: 'file' as const },
          { id: 'firma_responsable', label: 'Firma del Responsable', type: 'signature' as const, required: true }
        ]
      }
    ]
  }
]

const inspectionFormSections = [
  {
    id: 'general',
    title: 'Información General',
    fields: [
      { id: 'fecha', label: 'Fecha de Inspección', type: 'date' as const, required: true, defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'inspector', label: 'Inspector', type: 'text' as const, required: true },
      { id: 'proyecto', label: 'Proyecto', type: 'select' as const, options: ['Edificio Central', 'Torre Norte', 'Estacionamiento'], required: true },
      { id: 'ubicacion', label: 'Ubicación Exacta', type: 'location' as const }
    ]
  },
  {
    id: 'structural',
    title: 'Inspección Estructural',
    fields: [
      { id: 'estado_cimientos', label: 'Estado de Cimientos', type: 'select' as const, options: ['Excelente', 'Bueno', 'Regular', 'Deficiente'], required: true },
      { id: 'columnas', label: 'Estado de Columnas', type: 'select' as const, options: ['Excelente', 'Bueno', 'Regular', 'Deficiente'], required: true },
      { id: 'vigas', label: 'Estado de Vigas', type: 'select' as const, options: ['Excelente', 'Bueno', 'Regular', 'Deficiente'], required: true },
      { id: 'foto_estructura', label: 'Fotos de Estructura', type: 'photo' as const, multiple: true }
    ]
  },
  {
    id: 'quality',
    title: 'Control de Calidad',
    fields: [
      { id: 'hormigon_calidad', label: 'Calidad del Hormigón', type: 'select' as const, options: ['H20', 'H25', 'H30'], required: true },
      { id: 'resistencia', label: 'Resistencia (MPa)', type: 'number' as const },
      { id: 'codigo_barra', label: 'Código de Lote', type: 'barcode' as const },
      { id: 'observaciones', label: 'Observaciones', type: 'textarea' as const },
      { id: 'aprobacion', label: 'Aprobación del Control', type: 'signature' as const, required: true }
    ]
  }
]

const materialRequestSections = [
  {
    id: 'request',
    title: 'Solicitud de Materiales',
    fields: [
      { id: 'solicitante', label: 'Solicitante', type: 'text' as const, required: true },
      { id: 'proyecto', label: 'Proyecto', type: 'select' as const, options: ['Edificio Central', 'Torre Norte'], required: true },
      { id: 'fecha_necesidad', label: 'Fecha Necesidad', type: 'date' as const, required: true },
      { id: 'prioridad', label: 'Prioridad', type: 'select' as const, options: ['Alta', 'Media', 'Baja'], required: true }
    ]
  },
  {
    id: 'materials',
    title: 'Lista de Materiales',
    fields: [
      { id: 'cemento', label: 'Cemento (sacos)', type: 'number' as const },
      { id: 'arena', label: 'Arena (m³)', type: 'number' as const },
      { id: 'grava', label: 'Grava (m³)', type: 'number' as const },
      { id: 'fierro', label: 'Fierro (kg)', type: 'number' as const },
      { id: 'codigo_scan', label: 'Escanear Código', type: 'barcode' as const },
      { id: 'foto_materiales', label: 'Foto de Referencia', type: 'photo' as const }
    ]
  }
]

// Story Wrapper para manejo de estado
const FormWrapper = ({ children, ...props }: any) => {
  const [data, setData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDataChange = (newData: Record<string, any>) => {
    setData({ ...data, ...newData })
  }

  const handleNext = () => {
    if (props.steps && currentStep < props.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true)
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Formulario enviado:', formData)
    setIsSubmitting(false)
  }

  return (
    <FormTemplate
      {...props}
      data={data}
      currentStep={currentStep}
      isSubmitting={isSubmitting}
      onDataChange={handleDataChange}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
    />
  )
}

// Historias principales
export const ProjectCreationWizard: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="wizard"
      title="Crear Nuevo Proyecto"
      subtitle="Complete la información del proyecto en 3 pasos"
      steps={projectFormSteps}
      role="gerencia"
    />
  )
}

export const QualityInspectionForm: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Inspección de Calidad"
      subtitle="Registro de inspección estructural y control de calidad"
      sections={inspectionFormSections}
      role="control_calidad"
      showProgress={false}
    />
  )
}

export const MaterialRequestForm: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Solicitud de Materiales"
      subtitle="Solicitar materiales para el proyecto"
      sections={materialRequestSections}
      role="jefe_terreno"
      enableAutoSave={true}
      autoSaveInterval={30000}
    />
  )
}

export const MobileFormExperience: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <FormWrapper
        {...args}
        mode="single"
        title="Inspección Móvil"
        subtitle="Optimizado para tablets y móviles"
        sections={inspectionFormSections.slice(0, 2)}
        role="control_calidad"
        size="sm"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const FormWithSpecialFields: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Campos Especiales"
      subtitle="Demostración de campos de foto, firma, ubicación y código de barras"
      sections={[
        {
          id: 'special',
          title: 'Campos Especiales para Construcción',
          fields: [
            { id: 'foto_avance', label: 'Foto de Avance', type: 'photo' as const, required: true },
            { id: 'ubicacion_exacta', label: 'Ubicación GPS', type: 'location' as const, required: true },
            { id: 'codigo_material', label: 'Código del Material', type: 'barcode' as const },
            { id: 'firma_supervisor', label: 'Firma del Supervisor', type: 'signature' as const, required: true },
            { id: 'notas', label: 'Notas Adicionales', type: 'textarea' as const }
          ]
        }
      ]}
      role="jefe_terreno"
    />
  )
}

export const FormValidationDemo: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Validación de Formulario"
      subtitle="Demostración de validaciones y mensajes de error"
      sections={[
        {
          id: 'validation',
          title: 'Campos con Validación',
          fields: [
            { id: 'email', label: 'Email', type: 'email' as const, required: true },
            { id: 'telefono', label: 'Teléfono', type: 'tel' as const, required: true },
            { id: 'presupuesto', label: 'Presupuesto (mín. $1,000,000)', type: 'number' as const, required: true, min: 1000000 },
            { id: 'fecha_limite', label: 'Fecha Límite (futuro)', type: 'date' as const, required: true, min: new Date().toISOString().split('T')[0] },
            { id: 'descripcion', label: 'Descripción (min. 50 chars)', type: 'textarea' as const, required: true, minLength: 50 }
          ]
        }
      ]}
      role="oficina_tecnica"
      validation={{
        email: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? null : 'Email inválido'
        },
        telefono: (value) => {
          const phoneRegex = /^(\+56)?[2-9]\d{8}$/
          return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Teléfono chileno inválido'
        },
        presupuesto: (value) => {
          return parseFloat(value) >= 1000000 ? null : 'El presupuesto debe ser mayor a $1,000,000'
        }
      }}
    />
  )
}

export const AutoSaveDemo: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Guardado Automático"
      subtitle="Los datos se guardan automáticamente cada 10 segundos"
      sections={materialRequestSections.slice(0, 1)}
      role="bodega"
      enableAutoSave={true}
      autoSaveInterval={10000}
      onAutoSave={(data) => {
        console.log('Auto-guardado:', data)
      }}
    />
  )
}

export const ConditionalFields: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      mode="single"
      title="Campos Condicionales"
      subtitle="Campos que aparecen según otras selecciones"
      sections={[
        {
          id: 'conditional',
          title: 'Tipo de Inspección',
          fields: [
            { 
              id: 'tipo_inspeccion', 
              label: 'Tipo de Inspección', 
              type: 'select' as const, 
              options: ['Estructural', 'Eléctrica', 'Sanitaria'], 
              required: true 
            },
            { 
              id: 'resistencia_hormigon', 
              label: 'Resistencia del Hormigón', 
              type: 'number' as const, 
              condition: { field: 'tipo_inspeccion', value: 'Estructural' }
            },
            { 
              id: 'voltaje', 
              label: 'Voltaje (V)', 
              type: 'number' as const, 
              condition: { field: 'tipo_inspeccion', value: 'Eléctrica' }
            },
            { 
              id: 'presion_agua', 
              label: 'Presión del Agua (PSI)', 
              type: 'number' as const, 
              condition: { field: 'tipo_inspeccion', value: 'Sanitaria' }
            }
          ]
        }
      ]}
      role="control_calidad"
    />
  )
}

// Estados de loading y error
export const LoadingState: Story = {
  args: {
    mode: 'single',
    title: 'Cargando Formulario',
    subtitle: 'Estado de carga',
    sections: [],
    isLoading: true,
    role: 'gerencia'
  }
}

export const ErrorState: Story = {
  args: {
    mode: 'single',
    title: 'Error en Formulario',
    subtitle: 'Estado de error',
    sections: materialRequestSections.slice(0, 1),
    error: 'No se pudo cargar la información del proyecto. Verifique su conexión.',
    role: 'jefe_terreno'
  }
}