import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FormField } from './FormField'
import { Icon } from '@/components/atoms/Icon'

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'FormField molecule combines Input with Typography and validation messaging, optimized for construction site data entry with context-aware features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    constructionContext: {
      control: 'select',
      options: ['measurement', 'quantity', 'date', 'notes', 'code', 'general'],
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'spaced'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    validationState: {
      control: 'select',
      options: ['valid', 'invalid', 'warning', 'neutral'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    required: {
      control: 'boolean',
    },
    optional: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic form field
export const Default: Story = {
  args: {
    name: 'projectName',
    label: 'Nombre del Proyecto',
    placeholder: 'Ingrese el nombre del proyecto',
    helperText: 'Nombre completo del proyecto de construcción',
  },
}

// Construction context variations
export const ConstructionContexts: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <FormField
        name="area"
        label="Área de Construcción"
        placeholder="0.00"
        type="number"
        step="0.01"
        unitLabel="m²"
        constructionContext="measurement"
        helperText="Ingrese el área total en metros cuadrados"
        required
      />
      
      <FormField
        name="quantity"
        label="Cantidad de Material"
        placeholder="0"
        type="number"
        unitLabel="ton"
        constructionContext="quantity"
        helperText="Cantidad de material en toneladas"
        required
      />
      
      <FormField
        name="completionDate"
        label="Fecha de Entrega"
        type="date"
        constructionContext="date"
        helperText="Fecha prevista de finalización"
        required
      />
      
      <FormField
        name="observations"
        label="Observaciones"
        placeholder="Notas adicionales sobre el trabajo..."
        constructionContext="notes"
        helperText="Comentarios o instrucciones especiales"
      />
      
      <FormField
        name="unitCode"
        label="Código de Unidad"
        placeholder="EA-001"
        constructionContext="code"
        fieldCode="UC001"
        helperText="Código único de identificación de la unidad"
        required
      />
    </div>
  ),
}

// Validation states
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <FormField
        name="validField"
        label="Campo Válido"
        value="Proyecto Las Torres"
        successMessage="Nombre verificado correctamente"
        constructionContext="general"
        required
      />
      
      <FormField
        name="errorField"
        label="Campo con Error"
        value="123"
        errorMessage="El nombre debe tener al menos 5 caracteres"
        constructionContext="general"
        required
      />
      
      <FormField
        name="multiErrorField"
        label="Campo con Múltiples Errores"
        value=""
        errorMessage={[
          'Este campo es obligatorio',
          'Debe contener al menos 3 caracteres',
          'No puede contener números'
        ]}
        constructionContext="general"
        required
      />
      
      <FormField
        name="warningField"
        label="Campo con Advertencia"
        value="Proyecto Temporal"
        warningMessage="Este nombre parece ser temporal"
        constructionContext="general"
        helperText="Ingrese un nombre definitivo para el proyecto"
      />
      
      <FormField
        name="neutralField"
        label="Campo Neutral"
        placeholder="Sin validación específica"
        helperText="Este campo no tiene validaciones especiales"
        constructionContext="general"
      />
    </div>
  ),
}

// Required and optional fields
export const RequiredOptional: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <FormField
        name="requiredField"
        label="Campo Obligatorio"
        placeholder="Debe completar este campo"
        required
        showAsterisk
        constructionContext="general"
        helperText="Este campo es requerido para continuar"
      />
      
      <FormField
        name="optionalField"
        label="Campo Opcional"
        placeholder="Puede dejar este campo vacío"
        optional
        constructionContext="general"
        helperText="Este campo no es obligatorio"
      />
      
      <FormField
        name="requiredMeasurement"
        label="Medición Requerida"
        placeholder="0.00"
        type="number"
        step="0.01"
        unitLabel="m²"
        required
        constructionContext="measurement"
        helperText="Área exacta según planos"
      />
    </div>
  ),
}

// Horizontal layout
export const HorizontalLayout: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <FormField
        name="projectCode"
        label="Código de Proyecto"
        placeholder="PROJ-2025-001"
        orientation="horizontal"
        labelWidth="48"
        constructionContext="code"
        helperText="Formato: PROJ-YYYY-### (ejemplo: PROJ-2025-001)"
        required
      />
      
      <FormField
        name="budget"
        label="Presupuesto Total"
        placeholder="0"
        type="number"
        unitLabel="CLP"
        orientation="horizontal"
        labelWidth="48"
        constructionContext="quantity"
        labelDescription="Monto total estimado del proyecto"
        helperText="Incluye materiales, mano de obra y gastos generales"
        required
      />
      
      <FormField
        name="contractor"
        label="Contratista Principal"
        placeholder="Nombre de la empresa"
        orientation="horizontal"
        labelWidth="48"
        constructionContext="general"
        helperText="Empresa responsable de la ejecución"
        optional
      />
    </div>
  ),
}

// With prefix and suffix
export const WithPrefixSuffix: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <FormField
        name="website"
        label="Sitio Web del Proyecto"
        placeholder="miproyecto.com"
        prefix={<Icon name="link" size="sm" />}
        constructionContext="general"
        helperText="URL del sitio web o página del proyecto"
      />
      
      <FormField
        name="phone"
        label="Teléfono de Contacto"
        placeholder="(+56) 9 1234 5678"
        type="tel"
        prefix={<Icon name="phone" size="sm" />}
        constructionContext="general"
        helperText="Número de contacto para coordinación"
        required
      />
      
      <FormField
        name="email"
        label="Email del Responsable"
        placeholder="responsable@construccion.com"
        type="email"
        suffix={<Icon name="mail" size="sm" />}
        constructionContext="general"
        helperText="Correo electrónico del jefe de proyecto"
        required
      />
      
      <FormField
        name="area"
        label="Superficie Total"
        placeholder="1250.50"
        type="number"
        step="0.01"
        suffix={<span className="text-sm font-medium">m²</span>}
        constructionContext="measurement"
        helperText="Área total de construcción en metros cuadrados"
        required
      />
    </div>
  ),
}

// Compact and spaced variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Variante Compacta</h3>
        <div className="space-y-3">
          <FormField
            name="compactField1"
            label="Campo 1"
            placeholder="Texto aquí"
            variant="compact"
            constructionContext="general"
          />
          <FormField
            name="compactField2"
            label="Campo 2"
            placeholder="Más texto"
            variant="compact"
            constructionContext="general"
            helperText="Ayuda breve"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Variante Por Defecto</h3>
        <div className="space-y-4">
          <FormField
            name="defaultField1"
            label="Campo 1"
            placeholder="Texto aquí"
            constructionContext="general"
            helperText="Texto de ayuda estándar"
          />
          <FormField
            name="defaultField2"
            label="Campo 2"
            placeholder="Más texto"
            constructionContext="general"
            helperText="Más información de ayuda"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Variante Espaciada</h3>
        <div className="space-y-6">
          <FormField
            name="spacedField1"
            label="Campo 1"
            placeholder="Texto aquí"
            variant="spaced"
            constructionContext="general"
            helperText="Espaciado generoso entre elementos"
          />
          <FormField
            name="spacedField2"
            label="Campo 2"
            placeholder="Más texto"
            variant="spaced"
            constructionContext="general"
            helperText="Mejor para formularios extensos"
          />
        </div>
      </div>
    </div>
  ),
}

// Construction work registration form
export const ConstructionWorkForm: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary-900">Registro de Faena</h2>
        <p className="text-secondary-600">Complete la información del trabajo realizado</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="unitCode"
            label="Código de Unidad"
            placeholder="EA-001"
            constructionContext="code"
            fieldCode="UC"
            required
          />
          
          <FormField
            name="workType"
            label="Tipo de Faena"
            placeholder="Hormigón Radier"
            constructionContext="general"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="area"
            label="Área Trabajada"
            placeholder="0.00"
            type="number"
            step="0.01"
            unitLabel="m²"
            constructionContext="measurement"
            required
          />
          
          <FormField
            name="quantity"
            label="Cantidad de Material"
            placeholder="0.00"
            type="number"
            step="0.01"
            unitLabel="m³"
            constructionContext="quantity"
            required
          />
        </div>
        
        <FormField
          name="completionDate"
          label="Fecha de Ejecución"
          type="date"
          constructionContext="date"
          required
        />
        
        <FormField
          name="responsible"
          label="Responsable"
          placeholder="Juan Pérez"
          prefix={<Icon name="user" size="sm" />}
          constructionContext="general"
          required
        />
        
        <FormField
          name="observations"
          label="Observaciones"
          placeholder="Notas adicionales, condiciones especiales, materiales utilizados..."
          constructionContext="notes"
          helperText="Incluya cualquier información relevante sobre la ejecución del trabajo"
        />
        
        <div className="flex gap-4 pt-4 border-t">
          <button 
            type="button" 
            className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md hover:bg-secondary-50"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Registrar Faena
          </button>
        </div>
      </div>
    </div>
  ),
}

// Mobile-optimized form
export const MobileForm: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 mb-4">
        <h2 className="text-lg font-bold">Nuevo Trabajo</h2>
        <p className="text-primary-100 text-sm">Registro Rápido de Faena</p>
      </div>
      
      {/* Form */}
      <div className="px-4 space-y-4">
        <FormField
          name="unitCode"
          label="Unidad"
          placeholder="EA-001"
          constructionContext="code"
          size="lg"
          required
        />
        
        <FormField
          name="workType"
          label="Tipo de Trabajo"
          placeholder="Seleccionar tipo..."
          constructionContext="general"
          size="lg"
          required
        />
        
        <FormField
          name="area"
          label="Área (m²)"
          placeholder="0.00"
          type="number"
          step="0.01"
          constructionContext="measurement"
          size="lg"
          required
        />
        
        <FormField
          name="notes"
          label="Notas"
          placeholder="Observaciones..."
          constructionContext="notes"
          size="lg"
          helperText="Opcional - Información adicional"
        />
        
        <div className="pt-4 space-y-3">
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-md text-lg font-medium hover:bg-primary-700"
          >
            Registrar Faena
          </button>
          <button 
            type="button" 
            className="w-full px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md hover:bg-secondary-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
}

// Field validation showcase
export const ValidationShowcase: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      confirmPassword: '',
      projectBudget: '',
    })
    
    const [validationResults, setValidationResults] = React.useState<Record<string, boolean>>({})
    
    const handleValidation = (isValid: boolean, fieldName: string) => {
      setValidationResults(prev => ({
        ...prev,
        [fieldName]: isValid,
      }))
    }
    
    return (
      <div className="max-w-lg mx-auto">
        <h3 className="text-lg font-medium mb-6">Validación en Tiempo Real</h3>
        
        <div className="space-y-6">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="usuario@construccion.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            onValidation={handleValidation}
            constructionContext="general"
            required
            helperText="Debe ser un email válido"
          />
          
          <FormField
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            onValidation={handleValidation}
            constructionContext="general"
            required
            showPasswordToggle
            helperText="Debe tener al menos 8 caracteres"
          />
          
          <FormField
            name="projectBudget"
            label="Presupuesto del Proyecto"
            type="number"
            placeholder="0"
            unitLabel="CLP"
            value={formData.projectBudget}
            onChange={(e) => setFormData(prev => ({ ...prev, projectBudget: e.target.value }))}
            onValidation={handleValidation}
            constructionContext="quantity"
            required
            helperText="Debe ser un número positivo"
            min="1"
          />
          
          {/* Validation summary */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium mb-2">Estado de Validación:</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(validationResults).map(([field, isValid]) => (
                <div key={field} className="flex items-center gap-2">
                  {isValid ? (
                    <Icon name="check-circle" size="xs" variant="success" />
                  ) : (
                    <Icon name="x-circle" size="xs" variant="danger" />
                  )}
                  <span className={isValid ? 'text-success-700' : 'text-danger-700'}>
                    {field}: {isValid ? 'Válido' : 'Inválido'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}