FROM node:18 AS build
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package*.json ./
# COPY .env ./

# Instala las dependencias
RUN npm install --force

# Copia el código fuente de la aplicación
COPY src ./src
COPY public ./public

# Construye la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

# Copia el archivo de plantilla de Nginx
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copia el archivo nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Usa envsubst para generar el archivo de configuración final
RUN envsubst '${REACT_APP_API_BASE_URL} ${REACT_APP_APP_USUARIOS_URL} ${REACT_APP_APP_LUGARESTRABAJO_URL} ${REACT_APP_APP_HORARIOS_URL} ${REACT_APP_APP_MARCACIONES_URL} ${REACT_APP_APP_LOGINS_URL} ${REACT_APP_APP_PYAUTENBIO} ${REACT_APP_ADMIN_DASHBOARD_USERNAME} ${REACT_APP_ADMIN_DASHBOARD_PASSWORD} ${REACT_APP_API_KEY} ${REACT_APP_AUTH_DOMAIN} ${REACT_APP_PROJECT_ID} ${REACT_APP_STORAGE_BUCKET} ${REACT_APP_MESSAGING_SENDER_ID} ${REACT_APP_APP_ID} ${REACT_APP_MEASUREMENT_ID}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para el tráfico HTTP
EXPOSE 5000

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# Construccion de imagen dev en docker
# docker build --target dev . -t srab_dashboard

# Despliegue de la iamgen dockerlis
# docker run -it -p 3000:3000 -v ${PWD}:/app srab_dashboard