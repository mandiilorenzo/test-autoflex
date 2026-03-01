package com.autoflex;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import static io.restassured.RestAssured.given;

@QuarkusTest
class BackendCrudResourceTest {

    @Test
    void productCrudFlow() {
        Integer productIdInt = given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Produto Teste CRUD",
                          "price": 49.9
                        }
                        """)
                .when()
                .post("/products")
                .then()
                .statusCode(201)
                .body("name", equalTo("Produto Teste CRUD"))
                .body("price", equalTo(49.9f))
                .extract()
                .path("id");
        Long productId = productIdInt.longValue();

        given()
                .when()
                .get("/products")
                .then()
                .statusCode(200)
                .body("id", hasItem(productId.intValue()));

        given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Produto Atualizado",
                          "price": 79.9
                        }
                        """)
                .when()
                .put("/products/{id}", productId)
                .then()
                .statusCode(200)
                .body("id", equalTo(productId.intValue()))
                .body("name", equalTo("Produto Atualizado"))
                .body("price", equalTo(79.9f));

        given()
                .when()
                .delete("/products/{id}", productId)
                .then()
                .statusCode(204);
    }

    @Test
    void rawMaterialCrudFlow() {
        Integer materialIdInt = given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Insumo Teste CRUD",
                          "stockQuantity": 120.0
                        }
                        """)
                .when()
                .post("/raw-materials")
                .then()
                .statusCode(201)
                .body("name", equalTo("Insumo Teste CRUD"))
                .body("stockQuantity", equalTo(120.0f))
                .extract()
                .path("id");
        Long materialId = materialIdInt.longValue();

        given()
                .when()
                .get("/raw-materials")
                .then()
                .statusCode(200)
                .body("id", hasItem(materialId.intValue()));

        given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Insumo Atualizado",
                          "stockQuantity": 80.0
                        }
                        """)
                .when()
                .put("/raw-materials/{id}", materialId)
                .then()
                .statusCode(200)
                .body("id", equalTo(materialId.intValue()))
                .body("name", equalTo("Insumo Atualizado"))
                .body("stockQuantity", equalTo(80.0f));

        given()
                .when()
                .delete("/raw-materials/{id}", materialId)
                .then()
                .statusCode(204);
    }

    @Test
    void deleteProductRemovesLinkedCompositions() {
        Integer materialIdInt = given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Insumo Composição",
                          "stockQuantity": 10.0
                        }
                        """)
                .when()
                .post("/raw-materials")
                .then()
                .statusCode(201)
                .extract()
                .path("id");
        Long materialId = materialIdInt.longValue();

        Integer productIdInt = given()
                .contentType("application/json")
                .body("""
                        {
                          "name": "Produto Composição",
                          "price": 25.0
                        }
                        """)
                .when()
                .post("/products")
                .then()
                .statusCode(201)
                .extract()
                .path("id");
        Long productId = productIdInt.longValue();

        given()
                .contentType("application/json")
                .body("""
                        {
                          "productId": %d,
                          "materialId": %d,
                          "quantity": 1.0
                        }
                        """.formatted(productId, materialId))
                .when()
                .post("/product-compositions")
                .then()
                .statusCode(201);

        given()
                .when()
                .delete("/products/{id}", productId)
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/product-compositions/product/{id}", productId)
                .then()
                .statusCode(200)
                .body(equalTo("[]"));

        given()
                .when()
                .delete("/raw-materials/{id}", materialId)
                .then()
                .statusCode(204);
    }
}
