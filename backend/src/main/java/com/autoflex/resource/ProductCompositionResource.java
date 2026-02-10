package com.autoflex.resource;

import com.autoflex.model.Product;
import com.autoflex.model.ProductComposition;
import com.autoflex.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/product-compositions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductCompositionResource {

    @GET
    @Path("/product/{productId}")
    public List<ProductComposition> getByProduct(@PathParam("productId") Long productId) {
        return ProductComposition.list("product.id", productId);
    }

    @POST
    @Transactional
    public Response addMaterialToProduct(CompositionDTO dto) {
        Product product = Product.findById(dto.productId);
        RawMaterial material = RawMaterial.findById(dto.materialId);

        if (product == null || material == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Product or Material not found").build();
        }

        ProductComposition composition = new ProductComposition();
        composition.product = product;
        composition.rawMaterial = material;
        composition.quantity = dto.quantity;
        composition.persist();

        return Response.status(Response.Status.CREATED).entity(composition).build();
    }

    public static class CompositionDTO {
        public Long productId;
        public Long materialId;
        public Double quantity;
    }
}