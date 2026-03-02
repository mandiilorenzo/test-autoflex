package com.autoflex.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(name = "stock_quantity", nullable = false)
    public Double stockQuantity;
}
