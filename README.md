
how to run 

Frontend Setup (React)

Open another terminal and go to the frontend folder:

<pre> cd frontend </pre>


Install dependencies:

<pre> npm install </pre>


Run the development server:

<pre> npm run dev </pre>


 Backend Setup (Spring Boot)

1. Go to the backend folder:

<pre>cd backend</pre>
Update your src/main/resources/application.properties file with your database credentials:

<pre> 
spring.application.name=backend



spring.datasource.url=jdbc:mysql://localhost:3306/manager?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=


spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect


spring.jpa.properties.hibernate.format_sql=true

</pre>

Run the Spring Boot application:


<pre> mvn spring-boot:run </pre>


Cypress frontend e2e test
<pre> npx cypress open </pre>


This opens the Cypress Test Runner for you to test
