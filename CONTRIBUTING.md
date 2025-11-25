# Guía de Contribución

¡Gracias por tu interés en contribuir a Presupuesto Primitivo! 🎉

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que el bug no haya sido reportado ya en los [Issues](https://github.com/tu-usuario/budget-primitivo/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs comportamiento actual
   - Capturas de pantalla si aplica
   - Información del entorno (navegador, OS, versión de Node)

### Sugerir Features

Las sugerencias de nuevas funcionalidades son bienvenidas:

1. Revisa los issues existentes para evitar duplicados
2. Crea un issue con la etiqueta `enhancement`
3. Describe la funcionalidad propuesta y su caso de uso

### Pull Requests

1. **Fork el repositorio**
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. **Haz tus cambios** siguiendo las convenciones del proyecto
4. **Asegúrate de que el código funcione**:
   ```bash
   npm run dev
   ```
5. **Commit tus cambios** con mensajes descriptivos:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad X"
   ```
6. **Push a tu fork**:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
7. **Abre un Pull Request** en GitHub

## Convenciones de Código

### Estilo de Código

- Usa ESLint (si está configurado)
- Sigue las convenciones de React
- Mantén los componentes pequeños y enfocados
- Usa nombres descriptivos para variables y funciones

### Mensajes de Commit

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, dependencias, etc.

Ejemplos:
```
feat: agregar filtro por categoría en transacciones
fix: corregir cálculo de periodicidad mensual
docs: actualizar README con nuevas instrucciones
```

## Estructura del Código

- **Componentes**: En `src/components/`, un archivo por componente
- **Store**: Estado global en `src/store/`
- **Utilidades**: Funciones auxiliares en `src/utils/`
- **Estilos**: CSS global en `src/index.css`, componentes usan Chakra UI

## Testing

Antes de hacer un PR, asegúrate de:

- [ ] El código compila sin errores
- [ ] La aplicación funciona en modo desarrollo
- [ ] No hay errores en la consola del navegador
- [ ] Los cambios no rompen funcionalidades existentes

## Preguntas

Si tienes preguntas, puedes:

- Abrir un issue con la etiqueta `question`
- Contactar al mantenedor del proyecto

¡Gracias por contribuir! 🚀

