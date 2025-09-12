'use client'

export function MaterialsManagement({ usuario, materiales = [], onMaterialRequest, onMaterialUpdate, onMaterialDelivery }) {
  // Safety check for props
  const safeMateriales = Array.isArray(materiales) ? materiales : []
  const safeUsuario = usuario || { rol: 'bodega', nombre: 'Usuario' }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Materiales
        </h1>
        <p className="text-gray-600 mb-4">
          Control de inventario y bodega - {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
        </p>
        
        {/* Materials KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Kits</h3>
            <p className="text-2xl font-bold text-gray-900">{safeMateriales.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
            <p className="text-2xl font-bold text-green-600">
              {safeMateriales.filter(m => m.status === 'disponible').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">En Tránsito</h3>
            <p className="text-2xl font-bold text-blue-600">
              {safeMateriales.filter(m => m.status === 'en_transito').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Solicitados</h3>
            <p className="text-2xl font-bold text-orange-600">
              {safeMateriales.filter(m => m.status === 'solicitado').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Agotados</h3>
            <p className="text-2xl font-bold text-red-600">
              {safeMateriales.filter(m => m.status === 'agotado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Materials list */}
      <div className="space-y-4">
        {safeMateriales.length > 0 ? (
          safeMateriales.map(material => (
            <div key={material.id} className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {material.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Categoría: {material.category === 'hormigon_acero' ? 'Hormigón y Acero' :
                               material.category === 'instalaciones' ? 'Instalaciones' :
                               material.category === 'acabados' ? 'Acabados' :
                               material.category === 'herramientas' ? 'Herramientas' :
                               material.category === 'equipos' ? 'Equipos de Seguridad' :
                               'Otros'}
                  </p>
                  <div className="flex gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${material.status === 'disponible' ? 'bg-green-100 text-green-800' :
                        material.status === 'en_transito' ? 'bg-blue-100 text-blue-800' :
                        material.status === 'solicitado' ? 'bg-orange-100 text-orange-800' :
                        material.status === 'reservado' ? 'bg-purple-100 text-purple-800' :
                        material.status === 'agotado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {material.status === 'disponible' ? 'Disponible' :
                       material.status === 'en_transito' ? 'En Tránsito' :
                       material.status === 'solicitado' ? 'Solicitado' :
                       material.status === 'reservado' ? 'Reservado' :
                       material.status === 'agotado' ? 'Agotado' :
                       material.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${material.priority === 'urgente' ? 'bg-red-100 text-red-800' :
                        material.priority === 'alta' ? 'bg-orange-100 text-orange-800' :
                        material.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {material.priority === 'urgente' ? 'Urgente' :
                       material.priority === 'alta' ? 'Alta' :
                       material.priority === 'media' ? 'Media' :
                       'Baja'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {material.actualCost && (
                    <p className="text-lg font-bold text-gray-900">
                      ${material.actualCost.toLocaleString('es-CL')}
                    </p>
                  )}
                  {material.estimatedCost && !material.actualCost && (
                    <p className="text-lg font-semibold text-gray-600">
                      ${material.estimatedCost.toLocaleString('es-CL')} (est.)
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Edificio: {material.building}</span>
                  <span>Unidad: {material.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Solicitado por: {material.requestedBy}</span>
                  <span>Entrega: {material.deliveryDate ? new Date(material.deliveryDate).toLocaleDateString('es-CL') : 'No definida'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Proveedor: {material.supplier || 'No asignado'}</span>
                  {material.approvedBy && <span>Aprobado por: {material.approvedBy}</span>}
                </div>
              </div>

              {/* Components/Items in the kit */}
              {material.components && material.components.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Componentes del Kit ({material.components.length} items):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {material.components.slice(0, 6).map((component, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className={`${component.delivered ? 'text-green-700' : 'text-gray-700'}`}>
                          • {component.name}
                        </span>
                        <span className={`font-medium ${component.delivered ? 'text-green-600' : 'text-gray-600'}`}>
                          {component.quantity} {component.unit} 
                          {component.delivered ? ' ✓' : component.notes ? ' ⚠️' : ' ⏳'}
                        </span>
                      </div>
                    ))}
                    {material.components.length > 6 && (
                      <div className="text-sm text-gray-500 col-span-full">
                        ... y {material.components.length - 6} componentes más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {material.notes && (
                <p className="text-sm text-gray-700 mt-3 pt-3 border-t">
                  📝 {material.notes}
                </p>
              )}

              {/* Action buttons based on status and role */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                {safeUsuario.rol === 'bodega' && material.status === 'solicitado' && (
                  <button
                    onClick={() => onMaterialUpdate && onMaterialUpdate(material.id, { status: 'en_transito' })}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    📦 Procesar Pedido
                  </button>
                )}
                
                {safeUsuario.rol === 'bodega' && material.status === 'en_transito' && (
                  <button
                    onClick={() => onMaterialUpdate && onMaterialUpdate(material.id, { status: 'disponible' })}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    ✅ Recibir Material
                  </button>
                )}
                
                {safeUsuario.rol === 'bodega' && material.status === 'disponible' && (
                  <button
                    onClick={() => onMaterialDelivery && onMaterialDelivery(material.id)}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                  >
                    🚚 Entregar a Terreno
                  </button>
                )}
                
                {(safeUsuario.rol === 'jefe_terreno' || safeUsuario.rol === 'oficina_tecnica') && (
                  <button
                    onClick={() => onMaterialRequest && onMaterialRequest({
                      name: `Material para ${material.unit}`,
                      building: material.building,
                      unit: material.unit,
                      priority: 'media',
                      requestedBy: safeUsuario.nombre
                    })}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                  >
                    🔄 Solicitar Similar
                  </button>
                )}
                
                {safeUsuario.rol === 'gerencia' && (
                  <button
                    onClick={() => console.log('Ver detalles completos:', material.id)}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    📊 Ver Detalles
                  </button>
                )}
                
                {material.status === 'agotado' && (
                  <button
                    onClick={() => onMaterialRequest && onMaterialRequest({
                      name: `Reposición - ${material.name}`,
                      priority: 'urgente',
                      notes: 'Reposición de material agotado'
                    })}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    🚨 Solicitar Reposición
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow border text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay materiales en el sistema
            </h3>
            <p className="text-gray-600">
              Los materiales aparecerán aquí cuando sean solicitados
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rol actual: {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Add new material request button for allowed roles */}
      {(safeUsuario.rol === 'bodega' || safeUsuario.rol === 'jefe_terreno' || safeUsuario.rol === 'oficina_tecnica') && onMaterialRequest && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onMaterialRequest({
              name: 'Nuevo Kit de Materiales',
              category: 'otros',
              status: 'solicitado',
              priority: 'media',
              requestedBy: safeUsuario.nombre
            })}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            📦 Solicitar Nuevo Material
          </button>
        </div>
      )}
    </div>
  )
}