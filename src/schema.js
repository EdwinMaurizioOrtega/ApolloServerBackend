const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Product {
        id: Int!
        name: String
        slug: ID
        short_description: String
        long_description: String
        price: [Float]
        until: String
        sku: String
        stock: Int
        ratings: Float
        reviews: Int
        sale_count: Int
        is_top: Boolean
        is_new: Boolean
        is_featured: Boolean
        small_pictures: [Media]
        pictures: [Media]
        large_pictures: [Media]
        brands: [ProductBrand]
        tags: [ProductTag]
        categories: [ProductCategory]
        variants: [Variant]
        content: String
        discount: Int
    }

    type Media {
        width: Int
        height: Int
        url: String
    }

    type Variant {
        price: Float
        sale_price: Float
        size: Size
        color: Color
    }

    type Size {
        name: String
        size: String
        thumb: Media
    }

    type Color {
        name: String
        color: String
        thumb: Media
    }

    type ProductTag {
        id: Int!
        name: String
        slug: ID
    }

    type ProductCategory {
        id: Int!
        name: String
        slug: ID
    }

    type ProductCategoryResponse {
        id: Int!
        name: String
        slug: ID
        children: [ProductCategory]
    }

    type ProductBrand {
        id: Int!
        name: String
        slug: ID
    }

    type Video {
        url: String,
        width: Int,
        height: Int
    }

    type Post {
        id: Int!
        title: String
        slug: ID
        author: String
        date: String
        comments: Int
        content: String
        type: PostType
        large_picture: [Media]
        picture: [Media]
        small_picture: [Media]
        video: Video
        categories: [PostCategory]
    }

    type PostCategory {
        id: Int!
        name: String
        slug: ID
    }

    enum PostType {
        image
        video
        gallery
    }

    type ProductSingleResponse {
        data: Product
        prev: Product
        next: Product
        related: [Product]
    }

    type SpecialProducts {
        featured: [Product]
        bestSelling: [Product]
        topRated: [Product]
        latest: [Product]
        onSale: [Product]
    }

    type ShopSidebarResponse {
        categories: [ProductCategoryResponse],
        featured: [Product]
    }

    type ShopResponse {
        data: [Product]
        total: Int
        slugs: [String]
    }

    type PostsResponse {
        data: [Post]
        total: Int
        counts: [Int]
    }

    type PostSingleResponse {
        data: Post
        related: [Post]
    }

    type PostSidebarResponse {
        categories: [PostCategory]
        recent: [Post]
    }
    
    
    type Datos {
        cedula: String,
        nombre: String,
        direccion: String,
        telefono: String
        tipocliente: String
        correo: String
        producto: Producto     
        
    }
    
    type Producto {
        nocomp05: String
        codprod05: String
        fecmov05: String
        desprod01: String
        tieneGarantia: String
    }
    
    type sap {
        CodCliente: String
        Cliente: String
        Item: String
        FechaVenta: String
        Serie: String
    }
    
  
    type User {
        id: Int
        email: String
        password: String
        name: String
    }
    
     input NewUser {
        email: String
        password: String
        name: String
    }
    
    type Garantia {
        garantia: String
    }
    
    type Query {
        allUsers: [User!]!
        hello: String
        imeiPAC(imei: String!): Datos
        imeiSAP(imei: String!): [sap]
        garantiaLidenar(imei: String!): Garantia
        products(demo: String!, search: String, colors: [String] = [], sizes: [String] = [], brands: [String] = [], min_price: Int = null, max_price: Int = null, category: String, tag: String, ratings:[Int] = [], sortBy: String, from: Int = 0, to: Int): ShopResponse
        product(demo: String!, slug: String!, onlyData: Boolean): ProductSingleResponse
        specialProducts(demo: String!, featured: Boolean, bestSelling: Boolean, topRated: Boolean, latest: Boolean, onSale: Boolean, count: Int): SpecialProducts
        shopSidebarData(demo: String!, featured: Boolean): ShopSidebarResponse
        dealProducts(demo: String!, count: Int = 1): [Product]

        posts(demo: String!, category: String, from: Int = 0, to: Int, categories: [String]): PostsResponse
        post(demo: String!, slug: String!): PostSingleResponse
        postSidebarData(demo: String!): PostSidebarResponse
        
    }
    
    type Mutation {
        createUser(input: NewUser): User!

    }
    
`

module.exports = typeDefs;