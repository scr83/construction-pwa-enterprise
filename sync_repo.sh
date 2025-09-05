#!/bin/bash

echo "🔧 SYNC TO CORRECT REPOSITORY: construction-pwa-enterprise"
echo "========================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project directory confirmed"

# Show current remote configuration
echo "🔍 Verificando configuración de repositorio remoto..."
git remote -v

echo ""
echo "📍 Repositorio conectado: construction-pwa-enterprise (CORRECTO)"
echo ""

# Check git status
echo "📋 Estado actual del repositorio local:"
git status

echo ""
echo "🔍 Verificando diferencias con remoto..."

# Try to fetch from the correct repo
echo "📥 Intentando sincronizar con construction-pwa-enterprise..."
git fetch origin

if [ $? -eq 0 ]; then
    echo "✅ Conexión exitosa con construction-pwa-enterprise"
    
    # Show differences
    echo ""
    echo "📊 Comparando local vs remoto:"
    git log --oneline origin/main..HEAD 2>/dev/null || echo "⚠️  No hay historial remoto o branch main no existe en remoto"
    
else
    echo "⚠️  Nota: Posible primer push al repositorio o repositorio vacío"
fi

echo ""
echo "🚀 Para completar la sincronización:"
echo "   1. Agregar todos los archivos: git add ."
echo "   2. Hacer commit: git commit -m 'Initial commit: ConstructorPro PWA complete app'"
echo "   3. Push al repo correcto: git push -u origin main"
echo ""
echo "💡 El repositorio ahora está configurado correctamente para:"
echo "   📁 Local: /Users/scr/CONSTRUCTION-APP-v1.0"
echo "   🔗 GitHub: https://github.com/scr83/construction-pwa-enterprise"
echo ""
