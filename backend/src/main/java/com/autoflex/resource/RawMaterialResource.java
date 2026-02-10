package com.autoflex.resource;

import com.autoflex.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
    public void delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.delete();
    }
}