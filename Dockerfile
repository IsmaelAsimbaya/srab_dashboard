# Utilizar la imagen oficial de Node.js como base
FROM node:18 AS dev

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
# COPY package.json package-lock.json* ./

# Instalar las dependencias necesarias
RUN npm install -g npm@latest
# RUN npm install --force
# COPY .env .env

# Copiar el código fuente de la aplicación
# COPY . .

# Exponer el puerto 3000 para la aplicación React
EXPOSE 3000

# Comando para iniciar la aplicación en modo de desarrollo
# CMD ["npm", "start"]

# Construccion de imagen dev en docker
# docker build --target dev . -t srab_dashboard

# Despliegue de la iamgen dockerlis
# docker run -it -p 3000:3000 -v ${PWD}:/app srab_dashboard