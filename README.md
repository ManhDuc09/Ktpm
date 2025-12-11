## Frontend Setup (React)

Open another terminal and go to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

---

## Backend Setup (Spring Boot)

1. Go to the backend folder:

```
cd backend
```

2. Update your `src/main/resources/application.properties` file with your database credentials:

```
spring.application.name=backend

spring.datasource.url=jdbc:mysql://localhost:3306/manager?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
```

3. Run the Spring Boot application:

> Note: this project has been upgraded to Java 21 (LTS). Please install Java 21 and use it when building or running the backend.

```
mvn spring-boot:run
```

---

## Spring Boot Backend Tests

Run all backend tests:

```
mvn test
```

Run a specific test class:

```
mvn -Dtest=YourTestClassName test
```

---

## Cypress Frontend E2E Test

```
npx cypress open
```

---

## Jest Unit Tests (Frontend)

```
npm test
```

or

```
npm run test
```

---

## K6 Load Testing

Run your K6 test file (example: `loadtest.js`):

```
k6 run loadtest.js
```
