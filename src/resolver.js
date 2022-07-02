const {getMinMaxPrice, getDiscount, isSaleProduct} = require('./helpers/index');

const resolvers = {
    Query: {
        hello: async (root, args, ctx, info) => {
            return 'Hello';
        },

        products: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            let catSlugs = [];
            let products = demoData.products.map(product => {
                return {...product, price: getMinMaxPrice(product), discount: Math.round(getDiscount(product))}
            });

            if (args.category) {
                catSlugs.push(args.category);

                let subCat = demoData.productCategories.find(cat => cat.slug === args.category);
                if (subCat && subCat.children) {
                    subCat.children.forEach(item => {
                        catSlugs.push(item.slug);
                    })
                }
            }

            products = products.filter(item => {
                let flag = true;

                if (args.search) {
                    flag = item.name.toLowerCase().includes(args.search.toLowerCase());
                }

                if (flag && catSlugs.length > 0) {
                    let catFlag = false;
                    catSlugs.forEach(cat => {
                        if (item.categories.findIndex(itemCat => itemCat.slug === cat || cat === 'all') > -1)
                            catFlag = true;
                    })
                    flag = catFlag;
                }

                if (flag && args.tag) {
                    flag = item.tags && item.tags.find(tag => tag.slug === args.tag);
                }

                if (flag && (args.colors.length || args.sizes.length)) {
                    flag = item.variants.find(variant =>
                        (!args.colors.length || (variant.color && args.colors.find(color => color === variant.color.slug))) &&
                        (!args.sizes.length || (variant.size && args.sizes.find(size => size === variant.size.slug)))
                    );
                }

                if (flag && args.brands && args.brands.length) {
                    flag = item.brands && item.brands.find(brand => args.brands.find(slug => slug === brand.slug));
                }

                if (flag && (args.min_price !== null || args.max_price !== null)) {
                    let minPrice = args.min_price === null ? 0 : args.min_price;
                    let maxPrice = args.max_price === null ? 1000 : args.max_price;
                    flag = item.price[0] >= minPrice && item.price[0] <= maxPrice;
                }

                if (flag && args.ratings.length) {
                    flag = args.ratings && args.ratings.find(rating => rating === item.ratings);
                }

                return flag;
            });

            switch (args.sortBy) {
                case 'popularity':
                    products = products.sort((a, b) => b.sale_count - a.sale_count);
                    break;
                case 'rating':
                    products = products.sort((a, b) => b.ratings - a.ratings);
                    break;
                case 'price-high':
                    products = products.sort((a, b) => a.price[0] - b.price[0]);
                    break;
                case 'price-low':
                    products = products.sort((a, b) => b.price[0] - a.price[0]);
                    break;
                case 'date':
                case 'default':
                default:
                    break;
            }

            return {
                data: products.slice(args.from, args.to),
                total: products.length
            }
        },

        product: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            const products = demoData.products.map(product => {
                return {...product, price: getMinMaxPrice(product), discount: Math.round(getDiscount(product))}
            });
            const product = products.find(product => product.slug === args.slug);

            if (args.onlyData) {
                return {data: product};
            } else {
                const relatedProducts = products.filter(item => {
                    let rFlag = false;
                    item.categories.forEach(cat => {
                        if (product.categories.find(findCat => findCat.slug === cat.slug)) {
                            rFlag = true;
                        }
                    })

                    return rFlag;
                });

                const index = relatedProducts.findIndex(item => item.slug === product.slug);
                return {
                    data: product,
                    prev: index > 0 ? relatedProducts[index - 1] : null,
                    next: index < relatedProducts.length - 1 ? relatedProducts[index + 1] : null,
                    related: relatedProducts.filter(item => item.slug !== product.slug).slice(0, 7)
                };
            }
        },

        specialProducts: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            const products = demoData.products.map(product => {
                return {...product, price: getMinMaxPrice(product), discount: Math.round(getDiscount(product))}
            });
            let results = {};
            args.featured &&
            (results = {...results, featured: products.filter(item => item.is_featured).slice(0, args.count)});
            args.bestSelling &&
            (results = {
                ...results,
                bestSelling: products.sort((itemA, itemB) => itemB.sale_count - itemA.sale_count).slice(0, args.count)
            });
            args.topRated &&
            (results = {
                ...results,
                topRated: products.sort((itemA, itemB) => itemB.ratings - itemA.ratings).slice(0, args.count)
            });
            args.latest &&
            (results = {...results, latest: products.filter(item => item.is_new).slice(0, args.count)});
            args.onSale &&
            (results = {...results, onSale: products.filter(item => isSaleProduct(item)).slice(0, args.count)});
            return results;
        },

        dealProducts: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            const products = demoData.products.map(product => {
                return {...product, price: getMinMaxPrice(product)}
            });
            return products.filter(product => product.until).slice(0, args.count);
        },

        shopSidebarData: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            const categories = demoData.productCategories;
            const products = demoData.products.map(product => {
                return {...product, price: getMinMaxPrice(product)}
            });
            let results = {};
            results.categories = categories;
            if (args.featured) {
                results.featured = products.filter(item => item.is_featured).slice(0, 6);
            }
            return results;
        },

        posts: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            let posts = demoData.posts, counts;

            if (args.categories) {
                args.categories.forEach(item, index => {
                    counts[index + 1] = posts.filter(post => post.categories.find(cat => cat.slug === args.item)).length;
                })
            }
            if (args.category) {
                posts = posts.filter(post => post.categories.find(cat => args.category === 'all' || cat.slug === args.category));
            }
            return {
                data: posts.slice(args.from, args.to),
                total: posts.length,
                counts: counts
            };
        },

        post: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            let post = demoData.posts.find(post => post.slug === args.slug);
            let related = demoData.posts.filter(
                item => item.slug !== post.slug && item.categories.find(cat => post.categories.find(findCat => findCat.slug === cat.slug))
            )
            return {
                data: post,
                related: related.slice(0, 4)
            };
        },

        postSidebarData: async (root, args, ctx, info) => {
            const demoData = require(`./data/demo-${args.demo}.json`);
            const recentPosts = demoData.posts.sort((a, b) => new Date(a.date) > new Date(b.date)).slice(0, 3);

            return {
                recent: recentPosts
            }
        },

        imeiPAC: async (root, args, ctx, info) => {

            return datURL = fetch("http://10.1.10.201:8087/st/buscarimei/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    imei: `${args.gooo}`
                })

            }).then(response => response.json())
                .then(data => data)

        },

        imeiSAP: async (root, args, ctx, info) => {

            return datURL = fetch("http://192.168.0.110:8091/LIDENAR.asmx/GetImeis", {
                method: "POST"
            })
                .then(response => response.json())
                .then(imeiSAP => imeiSAP)

        },

        // unIMEI: async (root, args, ctx, info) => {
        //     //console.log(args)
        //     http.get("http://192.168.0.110:8091/LIDENAR.asmx/GetImeis").then { movies ->
        //         return movies
        //     }
        // }


    }
}

module.exports = resolvers;