# Use alpine linux to reduce image file size
FROM node:alpine
COPY . . 
RUN npm install
CMD ["npm", "start"]
