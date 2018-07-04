# Manual de Usuario - Stories Admin UI
---
### ¿Qué es Stories Admin UI?
---
* **Stories Admin UI** es una aplicación Web desarrollada en React con el objeto de servir como interfaz de administración para ciertos aspectos de la aplicación "Stories" desarrollada en Android y sus respectivos servidores (App Server y Shared Server). 

### ¿Qué aspectos es posible administrar desde Stories Admin UI?
---
* ***Archivos***: Permite la administración de archivos asociados con las historias subidas en la aplicación "Stories", ya sea por motivos administrativos o por violación de los términos y condiciones de la aplicación.
En cuanto a las acciones que permite se encuentran la **edición** de archivos en los siguientes campos: *Nombre* y *URL*, y también la **eliminación** de archivos.
* ***Servidores***: Permite la administración de servidores (App Servers) generados y asociados al Shared Server. 
En cuanto a las acciones que permite llevar a cabo se encuentran la **creación** de un nuevo servidor, la **edición** de un servidor en los siguientes campos: *Nombre* y *Server URL*, y por último, la **eliminación** de servidores.
* ***Estadísticas***: Ofrece la posibilidad de llevar un control estadístico de cada App Server según los siguientes criterios: *Usuarios Activos, Usuarios Registrados, Historias Subidas (en los últimos 10 días) y Consultas (por minuto)*.

### Guía de Instalación
---
##### Requisitos
---
* NodeJS (versión 8.x o superior)
* Git
* Docker (en caso de querer instalar con Docker)
> ***Nota:*** Las siguientes instrucciones son para sistemas UNIX (Linux/macOS)
##### Para clonar el repositorio
---
1. Ingresar el siguiente comando:
    ```
    $ git clone https://github.com/taller2-2018-1-grupo2/stories-react.git
    ```
##### Para correr Stories Admin UI de forma local (sin Docker)
---
Debemos realizar lo siguiente:
1. Una vez clonado el repositorio, abrimos una terminal en el directorio base del proyecto e ingresamos los siguientes comandos:
    ```
    $ npm install
    $ npm start
    ```

2. La aplicación se encontrará corriendo en la siguiente dirección: `localhost:3000`

##### Para correr Stories Admin UI de forma local (con Docker)
---
Debemos realizar lo siguiente:
1. Una vez clonado el repositorio, abrimos una terminal en el directorio base del proyecto e ingresamos los siguientes comandos:
    ```
    $ docker build -t sample-app .
    $ docker run -it \
      -v ${PWD}:/usr/src/app \
      -v /usr/src/app/node_modules \
      -p 3000:3000 \
      --rm \
      sample-app
    ```

2. La aplicación se encontrará corriendo en la siguiente dirección: `localhost:3000`

##### Para correr Stories Admin UI de forma remota (Deploy con Heroku)
---
> ***Nota:*** Para lo que sigue es necesario tener un usuario registrado en Heroku.

1. Es necesario ingresar los siguientes comandos en el directorio base de nuestro proyecto (reemplazando *$APP_NAME* por el nombre de nuestra aplicación):
    ```
    $ heroku create $APP_NAME --buildpack https://github.com/mars/create-react-app-buildpack.git
    $ git add .
    $ git commit -m "Start with create-react-app"
    $ git push heroku master
    ```

2. Luego, podremos abrir la URL pública de nuestra aplicación con el siguiente comando:
    ```
    $ heroku open
    ```

### Pantallas de la Aplicación
---
##### Login
---
![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/login.png "Logo Title Text 1")
La pantalla de **Login** brinda una interfaz donde ingresar las credenciales de Administrador (usuario y contraseña) otorgadas al momento de la entrega de la aplicación.
##### Archivos
---
![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/files.png "Logo Title Text 1")
La pantalla de **Archivos** ofrece la posibilidad de administrar los archivos actualmente asociados a un determinado servidor (en la barra de navegación se puede elegir para que servidor queremos ver los archivos asociados). 
***Acciones***
* ***Eliminar***: Para eliminar un archivo, debemos primero seleccionar el archivo que deseamos eliminar marcando el checkbox de la izquierda de la tabla y luego presionando el boton **DELETE** amarillo que se encuentra justo arriba de la misma.
* ***Editar***: Para editar un archivo, debemos hacer doble click en cualquiera de los campos editables del mismo (*URL* y *Nombre*) y luego en el campo de texto que se presenta ingresar el nuevo valor para ese campo.
    > ***Nota:*** Para los valores editables existen algunas restricciones:
    - Los valores ingresados para el campo **URL** tendran que tener el formato de una URL válida.
    - Los valores ingresados para el campo **Nombre** deberán tener un formato de archivo válido, incluyendo exclusivamente caracteres alfanumericos para el nombre y su respectiva extensión. Además, el nombre no debe ser igual a otro archivo ya existente en ese servidor.

##### Servidores
---
![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/servers.png "Logo Title Text 1")
La pantalla de **Servidores** nos permite administrar los servidores actualmente asociados al Shared Server y que se encuentran reconocidos por este.
***Acciones***

* ***Insertar***: Para insertar un nuevo servidor, debemos primero presionar el boton **NEW** celeste que se encuentra justo arriba de la tabla y posteriormente, en el cuadro que se nos presenta, ingresar el *Nombre* y la *Server URL* que queremos que tenga nuestro nuevo servidor. 
***Nota:*** Estos campos se encuentran sujetos a las mismas restricciones que al momento de editarlos.
![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/insertModal.png "Logo Title Text 1")
* ***Eliminar***: Para eliminar un servidor, debemos primero seleccionar el servidor que deseamos eliminar marcando el checkbox de la izquierda de la tabla y luego presionando el boton **DELETE** amarillo que se encuentra justo arriba de la misma.
* ***Editar***: Para editar un servidor, debemos hacer doble click en cualquiera de los campos editables del mismo (*Nombre* y *Server URL*) y luego en el campo de texto que se presenta ingresar el nuevo valor para ese campo.
    > ***Nota:*** Para los valores editables existen algunas restricciones:
    - Los valores ingresados para el campo **Server URL** tendran que tener el formato de una URL válida.
    - Los valores ingresados para el campo **Nombre** deberán incluir exclusivamente caracteres alfanumericos. Además, el nombre no debe ser igual a otro servidor ya existente.

##### Estadísticas
---
La pantalla de **Estadísticas** nos permite llevar un control de ciertos datos pertinentes a nuestros App Servers. Estos son los siguientes:

![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/stats1.png "Logo Title Text 1")

* ***Usuarios Activos:*** Nos muestra en un gráfico de torta la relación entre Usuarios Activos e Inactivos en el total de nuestros App Servers o en uno en particular, según lo que seleccionemos en el menú *"Elegir fuente"* que encontramos arriba del gráfico. Por defecto, la opción mostrada será la de *Todos* los App Servers disponibles. 
* ***Usuarios Registrados:*** Muestra en un gráfico de torta la distribución de usuarios en los distintos App Servers que tenemos operativos hasta el momento. Cada porción del gráfico representa a la cantidad de usuarios que se registraron utilizando ese App Server específico.

![alt text](https://github.com/taller2-2018-1-grupo2/stories-react/raw/master/docs/images/stats2.png "Logo Title Text 1")

* ***Historias Subidas (Últimos 10 dias):*** Este gráfico de barras nos muestra, para un período igual a los últimos 10 dias desde la fecha actual, como fue la creación de historias en cada día. Por defecto, muestra estos valores para *Todos* los App Servers disponibles, pero utilizando el menú *"Elegir fuente"* podemos filtrar los datos para un App Server en particular.
* ***Consultas (Por Minuto):*** Nos muestra en un gráfico de linea como se distribuyen las consultas en el período de tiempo seleccionado.
Para seleccionar el período de tiempo, debemos ingresar la cantidad de minutos que queremos que nos muestre en el cuadro situado arriba de la tabla y presionar el boton *"Actualizar"*. Por defecto, el valor tomado es 60 minutos.
Una vez hecho esto, tendremos la información disponible para *Todos* los App Servers, pero utilizando el menú *"Elegir fuente"* podemos filtrar la misma para cualquier App Server en particular.
    > ***Nota:*** Para que los cambios tengan el efecto deseado, debemos primero actualizar la cantidad de minutos a mostrar y luego filtrar por el App Server particular que deseamos ver. Si primero se filtra por el App Server y luego se actualiza el período de tiempo a visualizar, estaremos viendo las consultas para *Todos* los App Servers en ese período de tiempo, y no para el App Server específico que habiamos seleccionado anteriormente.