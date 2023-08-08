# Установка и запуск

Скопировать .env.example в .env:

<!-- prettier-ignore -->
```
cp .env.example .env
```

Внести в .env дынные для подключения к бд

Собрать и запустить контейнер:

```
docker-compose up -d --build
```

Адрес апи http://localhost:3001/api
