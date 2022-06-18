/**
 * function to get min, max price of product
 * 
 * @param {Product} product
 * @returns {Float[2]}
 */

function getMinMaxPrice( product ) {
    return product.variants.reduce( ( acc, cur ) => {
        acc[ 0 ] = cur.sale_price ? Math.min( cur.sale_price, acc[ 0 ] ) : cur.price ? Math.min( cur.price, acc[ 0 ] ) : acc[ 0 ];
        acc[ 1 ] = cur.price ? Math.max( acc[ 1 ], cur.price ) : acc[ 1 ];
        return acc;
    }, [ product.sale_price ? product.sale_price : product.price ? product.price : Infinity, product.price ? product.price : 0 ] );
}


/**
 * function to get discount of product
 * 
 * @param {Product} product
 * @returns {Float[2]}
 */

function getDiscount( product ) {
    return product.variants.reduce( ( acc, cur ) => {
        acc = cur.sale_price ? [ ( cur.price - cur.sale_price ) * 100 ] / cur.price : acc;
        return acc;
    }, product.sale_price ? [ ( product.price - product.sale_price ) * 100 ] / product.price : 0 )
}

/**
 * 
 * @param {Product} product 
 * @returns {Boolean}
 */
function isSaleProduct( product ) {
    if ( product.sale_price ) return true;
    if ( product.variants.length > 0 ) return product.variants.find( item => item.sale_price ) ? true : false;
    return false;
}

module.exports.getMinMaxPrice = getMinMaxPrice;
module.exports.getDiscount = getDiscount;
module.exports.isSaleProduct = isSaleProduct;