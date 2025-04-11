# poc-3
caso de Estudio de Abogados.

El estudio de abogados Mendoza inició en los 2000 como un estudio pequeño 
pero ahora es un estudio grande. Y requiere optimizar las busquedas a través del sistema, que actualmente se utiliza con excel.

Se requiere migrar de Access a Postgrsql.

## Observaciones


Con respecto a la Base de Datos:

- La Base de datos no tiene estructura coherente ni estandar para entender los conceptos utilizados.

- Las relación entre las entidades no son claras.

- Los atributos en cada tabla no son los suficientes como para generar los endpoints requeridos según el informe.

Como el flujo principal del software es crear, asignar y cobrar un caso para el estudio de abogados. No se considera para el poc (OUT OF SCOPE):

- La autentificación
- Endpoint para accounting. Pues se entiende como un dashboard para el sistema de contabilidad.

En el caso de dashboardService, no se espicica el servicio que realiza este. Y causa confusión la repetición de endpints en la misma. Se ha considerado una abstracción para que realice un searchService, se ha inferido que es para la busqueda de casos.

Se ha considerado que el CaseService crea un caso, por lo que consideramos modificar el diagrama de arquitectura. De tal forma que conecte el CaseService con LawyerService para asignarse un abogado al caso. Que previamente se hacía cuando el abogado buscaba en la base de datos. Por lo que el LawerService tiene que conectar al CaseService.

En el caso del Search, no se ha especifícado una solución para resolver la lentitud en el sistema, que es el fallo principal de la arquitectura legacy. Por lo que se ha planteado generar un tsVector dentro de cases, para realizar búsquedas óptimas.