plugins {
    java
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
    alias(libs.plugins.openapi.generator)
    alias(libs.plugins.spotless)
}

group = "io.criew.nextuntis"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.liquibase:liquibase-core")
    implementation(libs.springdoc.openapi.starter)
    implementation(libs.swagger.annotations)
    implementation(libs.jackson.databind.nullable)

    runtimeOnly("org.postgresql:postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("com.h2database:h2")
}

openApiGenerate {
    generatorName = "spring"
    inputSpec = "$projectDir/src/main/resources/openapi/nextuntis-api.yaml"
    outputDir = layout.buildDirectory.dir("generated/openapi").get().asFile.absolutePath
    apiPackage = "io.criew.nextuntis.api"
    modelPackage = "io.criew.nextuntis.model"
    configOptions = mapOf(
        "interfaceOnly" to "true",
        "useSpringBoot3" to "true",
        "useTags" to "true",
        "dateLibrary" to "java8",
        "openApiNullable" to "true"
    )
}

sourceSets {
    main {
        java {
            srcDir(layout.buildDirectory.dir("generated/openapi/src/main/java"))
        }
    }
}

tasks.compileJava {
    dependsOn(tasks.openApiGenerate)
}

spotless {
    java {
        googleJavaFormat()
        removeUnusedImports()
        targetExclude("build/generated/**")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
