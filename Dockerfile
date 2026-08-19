FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# استفاده از فلگ legacy-peer-deps برای عبور از تداخل پکیج‌ها
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]