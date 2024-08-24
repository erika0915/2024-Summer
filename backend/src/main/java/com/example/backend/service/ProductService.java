package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.Product;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ReviewRepository reviewRepository;


    public ProductDto productByCode(Long productCode){
        Product products = productRepository.findByProductCode(productCode);
        return ProductDto.createProductDto(products);
    }

    // 상품 코드로 상품 반환
    public ProductDetailDto productsByCode(Long productCode) {
        Product products = productRepository.findByProductCode(productCode);
        return ProductDetailDto.createProductDto(products);
    }

    // 상품 종류로 상품 반환
    public Map<String, List<ProductTypeDto>> productByType(String productType){
        List<Product> products = productRepository.findByProductType(productType);
        return products.stream()
                .collect(Collectors.groupingBy(
                        Product::getProductBank,
                        Collectors.mapping(product -> {
                            List<String> feats= Arrays.asList(
                                    product.getProductFeat1(),
                                    product.getProductFeat2(),
                                    product.getProductFeat3()
                            );
                            return new ProductTypeDto(product.getProductCode(), product.getProductName(), feats);
                        }, Collectors.toList())
                ));
    }

    // 관리자용 상품 이름 조회
    public List<ProductAdminDto> productNameByProductType(String productType){
        List<Product> products = productRepository.findByProductType(productType);
        return products.stream()
                .map(ProductAdminDto::createProductAdminDto)
                .collect(Collectors.toList());
    }

    // 상품 생성
    @Transactional
    public ProductDto create(ProductDto productDto) {
        // 상품 엔티티 생성
        Product product=Product.createProduct(productDto);
        // DB로 갱신
        Product created=productRepository.save(product);
        // 상품 엔티티를 DTO로 변환 및 반환
        return ProductDto.createProductDto(created);
    }

    // 상품 수정
    @Transactional
    public ProductDto update(Long productCode, ProductDto productDto) {
        // 상품 조회 및 예외 발생
        Product target=productRepository.findById(productCode)
                .orElseThrow(() -> new IllegalArgumentException("상품 수정 실패! 대상 상품이 없습니다."));
        // 상품 수정
        target.patch(productDto);
        // DB로 갱신
        Product updated=productRepository.save(target);
        //상품 엔티티를 DTO로 변환 및 반환
        return ProductDto.createProductDto(updated);
    }

    // 상품 삭제
    @Transactional
    public ProductDto delete(Long productCode) {
        // 상품 조회 및 예외 발생
        Product target=productRepository.findById(productCode)
                .orElseThrow(() -> new IllegalArgumentException("상품 삭제 실패! 대상 상품이 없습니다."));
        // 상품 삭제
        productRepository.delete(target);
        // 삭제 상품을 DTO로 변환 및 반환
        return ProductDto.createProductDto(target);
    }

    // 은행 명으로 검색
    public Map<String, List<ProductCategoryDto>> searchProductByBank(String productBank){
        List<Product> products = productRepository.findByProductBank(productBank);

        return products.stream()
                .collect(Collectors.groupingBy(
                        Product::getProductType, // 은행으로 그룹화
                        Collectors.mapping(product->{
                            List<String> feats = Arrays.asList(
                                    product.getProductFeat1(),
                                    product.getProductFeat2(),
                                    product.getProductFeat3()
                            );
                            return new ProductCategoryDto(product.getProductCode(), product.getProductName(), feats);
                        }, Collectors.toList())
                ));
    }
}
