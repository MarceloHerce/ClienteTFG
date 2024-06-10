# Titulo del proyecto
#### Marcelo Herce Sanz
##### Desarrollo de Aplicaciones Web (DAW)

## Indice
- [Introducción](#introducción)
- [Objetivos](#objetivos)
- [Motivación](#motivación)
- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Guía de instalación](#guía-de-instalación)
- [Guía de uso](#guía-de-uso)
- [Enlace a la documentación](#enlace-a-la-documentación)
- [Enlaces de github](#enlaces-de-github)
- [Enlace a figma de la interfaz](#enlace-a-figma-de-la-interfaz)
- [Conclusión](#conclusión)
- [Contribuciones y agradecimientos](#contribuciones-y-agradecimientos)
- [Licencias](#licencias)
- [Contacto](#contacto)

## Introducción
Este proyecto es una pagina web que te permite grabar pantalla y almacenar los videos en Azure o descargalos en tu ordenador.

### Objetivos
Descubrir herramientas nuevas, mejorar el desarrollo de interfaces, trabajar con un CD/CI   .
- Trabajar con el formato Blob.
- Mejorar el desarrollo front-end mejorando la calidad del diseño.
- Trabajar con Azure.
- Implementar un despliegue basado en CI/CD.
- Profundizar el conocimiento de las herramientas de React.
- Trabajar con la documentación oficial.
- Implementar un diseño responsivo y mobile-first.
- Implementar autenticación y autorización.

### Motivación 
- Enfrentarme al reto de desarrollar una aplicación desde cero y en solitario.
- Trabajar con herramientas desconocidas como MediaRecorderApi y Azure Blob Storage.
- Mejorar el apartado de maquetación y paginas responsive.
- Cimentar los conocimientos aprendidos en el grado.
- Realizar un despliegue con Kubernetes.

### Tecnologías 
Frontal desarrollado con el framework de Javascript React/Vite, uso de dependencias como "@react-three/drei" y "@react-three/fiber", "react-hook-form", "react-icons", "react-router-dom" y "appcontext". Como framework de css el uso de Tailwind.
Backend desarrollado con Springboot, centrado en Springsecurity para la gestión de ususarios, lombok y el uso de las dependencias de azure.
Base de datos relacional con MySQL.
El proyecto se despliega en azure mediante el uso de Github actions en Kubernetes, mediante el
uso de un Registry propio.

### Funcionalidades
Los dos pilares fundamentales del proyecto son MediaRecorderApi y Azure Storage Blob.
MediaRecorderApi, permite grabar la pantalla y audio del sistema, ademas de la camara y microfono.
Azure Storage Blob permite subir blobs a azure y generar SAS tokens para su acceso ademas de borrar los blobs de cada usuario.
Github actions permite automatizar la dockerización y despliegue en Kubernetes.


### Guía de instalación
Primero se realizara un fork a los repositorios de github más abajo indicados.
Para ejecutar el proyecto sin realizar niguna modificación sera necesario disponer de una cuenta en Azure, ya que el despliegue esta configurado para ello, además de que la funcionalidad de almacenamiento en la nube, no funcionaria.
Como minimo sera necesario tener un Registry y Contenedor en Azure. Para el despliegue con kubernetes se debera crear un Cluster, una maquina virtual y una base de datos en la nube.
Para setear las variables de  entorno se usara las variables secretas de Github.

### Guía de uso
Una vez se encuentre todo desplegado y conectado, deberemos iniciar sesion para poder grabar pantalla. Para grabar pantalla sera obligatorio asignar un nombre, una vez se haya introducido el nombre, pulsaremos en grabar pantalla y selecionaremos los ajustes deseados. Cuando queramos detener la grabación pulsaremos en detener y posteriormente en dejar de compartir. Entonces tendremos dos opciones, descargar el video, o subirlo a azure. Una vez el video se haya subido podremos verlo, compartirlo, borrarlo o descargarlo.

### Enlace a la documentación
Se encuentra en el cliente [Screenrecorder](https://github.com/MarceloHerce/ClienteTFG)

### Enlaces de github
Frontend: [Screenrecorder](https://github.com/MarceloHerce/ClienteTFG)  
Backend: [ScreenrecorderApi](https://github.com/MarceloHerce/APIUserTFG)  
BBDD: [ScreenrecorderDatabase](https://github.com/MarceloHerce/BBDDTFG)

### Enlace a figma de la interfaz
[Screenrecorder figma](https://github.com/MarceloHerce/ClienteTFG)

### Conclusión

### Contribuciones y agradecimientos.
Agradecer a Rafa, María y Pablo, ayudarme a centrarme con sus preguntas y dudas.
Agradecer a Alberto los tips para el despliegue de Kubernetes en Azure.
Agradecer a los profesores la amplia formación en diversas tecnologías y herramientas.

### Licencias

### Contacto
marcelohercesanz@gmail.com
[Github](https://github.com/MarceloHerce)
