//Add item count 0 by default to the product list
function addKeyValue(obj, key, data){
  obj[key] = data;
}
let products = [];

//Show the product list on the main page
const xhr = new XMLHttpRequest();
xhr.onload = function(){
	let productList = "";
	if (this.status === 200) {
		try{
			products = JSON.parse(this.responseText);
			console.log('products', products)
			$.each(products.items, function( key, value ) {
				addKeyValue(value, 'amount', 0);
				productList += "<div class=\"product_box\">";
				productList += "    			<div class=\"product_discount\">";
				productList += "    				<div class=\"product_discount_box\">";
				productList += "    					<div class=\"discount_title\">"+value.discount+" %off<\/div>";
				productList += "    				<\/div>";
				productList += "    			<\/div>";
				productList += "    			<div class=\"product_image\">";
				productList += "    				<img src=\""+value.image+"\" class=\"img-responsive\" \/>";
				productList += "    			<\/div>";
				productList += "    			<div class=\"product_details\">";
				productList += "    				<div class=\"product_name\">"+value.name+"<\/div>";
				productList += "	    			<div class=\"product_price\">";
				productList += "	    				<div class=\"product_actual_price\">";
				productList += "	    					<del class=\"cut_price\"><span class=\"product_discount_price\">$"+value.price.display+"<\/span><\/del>";
				productList += "	    					<span class=\"product_discount_price\">$"+value.price.actual+"<\/span>";
				productList += "                            <button class=\"add_to_cart\"  onClick=handleAddToCart(\""+value.id+"\")>Add to cart</button>";
				productList += "	    				<\/div>";
				productList += "	    				";
				productList += "	    			<\/div>";
				productList += "	    		<\/div>";
				productList += "    		<\/div>";
	        });
	        $("#productList").html(productList);
		} catch (e) {
			console.log("There was an error in the JSON");
		}
	} else {
		console.warn("Did nor receive 200 OK from response");
	}
	showCartItem();
};
xhr.open('get', 'data.json');
xhr.send();

let cart = [];

const handleAddToCart = (clickedItem) => {

	// Is the item already added in the cart?
  	const isItemInCart = cart.find(item => item.id === clickedItem);
  	if (isItemInCart) {
	    return cart.map((event) => {
	    	if (event.id === clickedItem){
	        	event.amount = event.amount + 1;
	        }
	        showCartItem();
	    })
  	}

  	//First time the item is added
  	products.items.map((event) => {
  		if (event.id == clickedItem){
        	event.id = clickedItem
          	event.name = event.name
          	event.image = event.image
          	event.actual = event.price.actual
          	event.display = event.price.display
          	let updatedItemData = {}
          	updatedItemData = {id: event.id, name: event.name, image: event.image, actual:event.actual, display: event.display, amount: 1 }
          	cart.push(updatedItemData);
        }
    })
  	console.log("cartcartcart", cart)
  	showCartItem();
};

//Show the card details
function showCartItem() {
	let grandTotal = 0;
	let totalCartItemCost = 0;
	let totalCartItem = 0;
	let totalCartItemDiscount = 0;
	if (cart.length > 0) {
		let cartList="";
		cartList += "<table>";
		cartList += "	<tr>";
		cartList += "		<th>Items<\/th>";
		cartList += "		<th>Qty<\/th>";
		cartList += "		<th>Price<\/th>";
		cartList += "	<\/tr>";
		$.each(cart, function( key, value ) {
			let cartItemCost = 0;
			cartItemCost = value.amount * value.actual
			totalCartItemCost += cartItemCost
			grandTotal += cartItemCost
			cartItemCount = value.amount
			totalCartItem += cartItemCount
			cartItemDiscount = value.amount * (value.display - value.actual)
			totalCartItemDiscount += cartItemDiscount
			cartList += "<tr>";
			cartList += "	<td>";
			cartList += "		<div class=\"item_box\">";
			cartList += "			<div class=\"item_img\">";
			cartList += "				<img src=\""+value.image+"\" class=\"img-responsive\" \/>";
			cartList += "				<span class=\"cart_item_name\">"+value.name+"<\/span>";
			cartList += "               <span class=\"cart_item_clear increase_cart_item\"  onClick=handleRemoveItemFromCart(\""+value.id+"\")>X</span>";
			cartList += "			<\/div>";
			cartList += "		<\/div>";
			cartList += "	<\/td>";
			cartList += "	<td>";
			cartList += "		<div class=\"cart_qty\">";
			cartList += "                    <button class=\"decrease_cart_item\"  onClick=handleRemoveFromCart(\""+value.id+"\")>-</button>";
			cartList += "					 <span class=\"cart_item_count\">"+value.amount+"<\/span>";
			cartList += "                    <button class=\"increase_cart_item\"  onClick=handleAddToCart(\""+value.id+"\")>+</button>";
			cartList += "		<\/div>";
			cartList += "	<\/td>";
			cartList += "	<td>";
			cartList += "		<div class=\"cart_item_price\">$"+cartItemCost.toFixed(2)+"<\/div>";
			cartList += "	<\/td>";
			cartList += "<\/tr>";
    	});
        cartList += "			<\/table>";
        cartList += "<div class=\"total_amount_box\">";
		cartList += "	<table>";
		cartList += "		<tr>";
		cartList += "			<th>Total<\/th>";
		cartList += "			<td><\/td>";
		cartList += "			<td><\/td>";
		cartList += "		<\/tr>";
		cartList += "		<tr>";
		cartList += "			<th>Items(<span id=\"totalCartItem\">"+totalCartItem+"<\/span>)<\/th>";
		cartList += "			<td>:<\/td>";
		cartList += "			<td id=\"cartTotlaCost\">$"+totalCartItemCost.toFixed(2)+"<\/td>";
		cartList += "		<\/tr>";
		cartList += "		<tr>";
		cartList += "			<th>Discount<\/th>";
		cartList += "			<td>:<\/td>";
		cartList += "			<td id=\"totalCartItemDiscount\">-$"+totalCartItemDiscount.toFixed(2)+"<\/td>";
		cartList += "		<\/tr>";
		cartList += "		<tr>";
		cartList += "			<th>Type Discount<\/th>";
		cartList += "			<td>:<\/td>";
		cartList += "			<td>-$0<\/td>";
		cartList += "		<\/tr>";
		cartList += "		<tr class=\"grand_amt\">";
		cartList += "			<div class=\"order_total\">";
		cartList += "				<th>Order Total<\/th>";
		cartList += "				<td>:<\/td>";
		cartList += "				<td id=\"grandTotal\">$"+grandTotal.toFixed(2)+"<\/td>";
		cartList += "			<\/div>";
		cartList += "		<\/tr>";
		cartList += "	<\/table>";
		cartList += "<\/div>";
		$("#cartItem").html(cartList);
	} else {
		$("#cartTotlaCost").html("$"+totalCartItemCost.toFixed(2));
		$("#totalCartItemDiscount").html("-$"+totalCartItemDiscount.toFixed(2));
		$("#grandTotal").html("$"+grandTotal.toFixed(2));
		$("#totalCartItem").html(totalCartItem);
		$("#cartItem").html('<p>No Items in cart</p>');
	}
}

// Remove item count on press of minus button from cart
const handleRemoveFromCart = (id) => {
	const isItemInCart = cart.find(item => item.id === id);
  	if (isItemInCart) {
	    return cart.map((event) => {
	    	if (event.id === id){
	    		if (event.amount === 0) {
	    			cart = cart.filter((items) => items.id !== id)
	    		} else {
	    			event.amount = event.amount - 1;
	    		}
	    		showCartItem();
	        }
	    })
  	}
};

// Remove item from cart
const handleRemoveItemFromCart = (id) => {
	cart = cart.filter((items) => items.id !== id)
	showCartItem();
};
