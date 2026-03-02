package com.autoflex.resource;

import java.util.List;

import com.autoflex.model.Product;
import com.autoflex.model.ProductComposition;
import com.autoflex.model.RawMaterial;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
        Long materialId = dto.materialId != null ? dto.materialId : dto.rawMaterialId;

        if (dto.productId == null || materialId == null || dto.quantity == null || dto.quantity <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("productId, materialId/rawMaterialId e quantity (> 0) são obrigatórios")
                    .build();
        }

        Product product = Product.findById(dto.productId);
        RawMaterial material = RawMaterial.findById(materialId);

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
        public Long rawMaterialId;
        public Double quantity;
    }
}
