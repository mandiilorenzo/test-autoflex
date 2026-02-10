package com.autoflex.resource;

import com.autoflex.model.Product;
import com.autoflex.model.ProductComposition;
import com.autoflex.model.RawMaterial;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/production-suggestion")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @GET
    public ProductionResponse getSuggestion() {
        List<Product> products = Product.list("order by price desc");

        List<RawMaterial> materials = RawMaterial.listAll();
        Map<Long, Double> virtualStock = new HashMap<>();
        for (RawMaterial m : materials) {
            virtualStock.put(m.id, m.stockQuantity);
        }

        List<SuggestedProduct> suggestedProducts = new ArrayList<>();
        Double totalValue = 0.0;

        for (Product p : products) {
            List<ProductComposition> components = ProductComposition.list("product", p);

            if (components.isEmpty()) continue;

            int possibleQuantity = Integer.MAX_VALUE;

            for (ProductComposition comp : components) {
                double available = virtualStock.get(comp.rawMaterial.id);
                int canMake = (int) (available / comp.quantity);
                if (canMake < possibleQuantity) {
                    possibleQuantity = canMake;
                }
            }

            if (possibleQuantity > 0) {
                for (ProductComposition comp : components) {
                    double used = possibleQuantity * comp.quantity;
                    virtualStock.put(comp.rawMaterial.id, virtualStock.get(comp.rawMaterial.id) - used);
                }

                suggestedProducts.add(new SuggestedProduct(p.name, possibleQuantity, p.price * possibleQuantity));
                totalValue += p.price * possibleQuantity;
            }
        }

        return new ProductionResponse(suggestedProducts, totalValue);
    }
    
    public static class ProductionResponse {
        public List<SuggestedProduct> suggestions;
        public Double totalPotentialValue;

        public ProductionResponse(List<SuggestedProduct> suggestions, Double totalValue) {
            this.suggestions = suggestions;
            this.totalPotentialValue = totalValue;
        }
    }

    public static class SuggestedProduct {
        public String productName;
        public Integer quantity;
        public Double subtotal;

        public SuggestedProduct(String productName, Integer quantity, Double subtotal) {
            this.productName = productName;
            this.quantity = quantity;
            this.subtotal = subtotal;
        }
    }
}