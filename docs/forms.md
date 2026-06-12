# Documentación: Formularios e Interacción

## Estrategia de Implementación
- **Formularios Controlados**: Utilizamos el estado de React (`useState`) como única fuente de verdad para los valores de los inputs. Esto asegura que el estado de la aplicación siempre esté sincronizado con la interfaz.
- **Validación**: 
  - Se implementó validación en el lado del cliente (frontend) para evitar el envío de datos vacíos.
  - Se utiliza el atributo `required` en los elementos HTML para una validación nativa básica.
  - Se utiliza una lógica condicional en `handleSubmit` para prevenir el envío si los campos no cumplen con los requisitos mínimos (longitud, caracteres).
- **Feedback**: El usuario recibe una alerta visual tras una operación exitosa.

## Flujo de Datos