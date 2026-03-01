package com.autoflex.resource;

import java.util.List;

import com.autoflex.model.ProductComposition;
import com.autoflex.model.RawMaterial;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> getAll() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public Response create(RawMaterial rawMaterial) {
        rawMaterial.persist();
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial rawMaterial) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.name = rawMaterial.name;
        entity.stockQuantity = rawMaterial.stockQuantity;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }

        ProductComposition.delete("rawMaterial.id", id);

        entity.delete();
        return Response.noContent().build();
    }
}
