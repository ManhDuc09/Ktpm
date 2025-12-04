package com.flogin.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ProductDTO {
	private String title;
	private String description;
	private int quantity;

	public ProductDTO() {
	}

	public ProductDTO(String title, String description, int quantity) {
		this.title = title;
		this.description = description;
		this.quantity = quantity;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getQuantity() {
		return this.quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

}
