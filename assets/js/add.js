
var cartData = []
var data = []
updateButtonValue()

$.ajax({
    url: 'assets/data.json',
    dataType: 'json',
    success: function (data) {
        loadData(data)
    },
    error: function (err) {
        alert(err);
    }
})
function loadData(jsonData) {
    data = jsonData
    $.each(jsonData, function (index, item) {
        if (item.category == "fruits") {
            var fruitsSection = $('#fruits')
            fruitsSection.append("<div class='col-sm-3'><div class='card' id='" + item.id + "'><img class='card-img-top' src='" + item.img + "'><div class='card-body'><h5 class='card-title item-name'>" + item.name + "</h5><p class='card-text item-price'>Rs." + item.price + "(per/Kg)</p><button  class='btn btn-primary add-cart-btn'id='button" + item.id + "'onclick='addToCart(" + item.id + ");this.disabled=true'>Add To Cart</button></div></div></div>");
        }
        else if (item.category == "vegetable") {
            var vegetableSection = $('#vegetable')
            vegetableSection.append("<div class='col-sm-3'><div class='card' id='" + item.id + "'><img class='card-img-top' src='" + item.img + "' alt='Card image cap'><div class='card-body'><h5 class='card-title item-name'>" + item.name + "</h5><p class='card-text item-price'>Rs." + item.price + "(per/Kg)</p><button  class='btn btn-primary add-cart-btn'id='button" + item.id + "'onclick='addToCart(" + item.id + ");this.disabled=true'>Add To Cart</button></div></div>");
        }
    })
}
function addToCart(id) {
    if(JSON.parse(localStorage.getItem("cart-data"))){
        var cart=JSON.parse(localStorage.getItem("cart-data"))}
        else{
            cart=[]
        }    
    var currentObject = Object.values(data).find(object => object.id == id)
    cartData.push(currentObject)
    localStorage.setItem("cart-data", JSON.stringify(cartData))
    document.getElementById("cartCount").innerHTML = cartData.length
    updateButtonValue();
    displayTotal();
    checkCartButton();
}
function updateButtonValue(){
    console.log(JSON.parse(localStorage.getItem("cart-data")))
    if(JSON.parse(localStorage.getItem("cart-data")))
    {
        document.getElementById("cartCount").innerHTML=JSON.parse(localStorage.getItem("cart-data")).length
    }
    else{
        document.getElementById("cartCount").innerHTML=0
    }
    }
    
function displayTotal() {
    var cartRows = document.getElementById("cart-table").rows.length
    var total = 0

    var i = 0
    for (i = 1; i < cartRows; i++) {
        total = parseInt(document.getElementById("cart-table").rows[i].cells[2].innerHTML.substring(4)) + total
    }
    document.getElementById("totalCost").innerHTML = ''
    document.getElementById("totalCost").innerHTML = total;
}
function increment(curr, id) {
    var currentObject = Object.values(cartData).find(object => object.id === id);
    curr.parentNode.childNodes[1].childNodes[0].stepUp();
    var price = currentObject.price
    var qty = curr.parentNode.querySelector("#qty").value
    var totalAmount = price * qty
    curr.parentNode.parentNode.parentNode.childNodes[2].innerHTML = "Rs. " + totalAmount
    var cartItems = JSON.parse(localStorage.getItem("cart-data"))
   
    for (var i = 0; i < cartItems.length; i++) {
        if (currentObject.id === cartItems[i].id) {
            cartItems[i].quantity = qty;
            break;  
        }
    }
    localStorage.setItem("cart-data", JSON.stringify(cartItems));
    displayTotal()
    checkCartButton()
}
function decrement(curr, id) {
    var currentObject = Object.values(cartData).find(object => object.id === id);
    curr.parentNode.childNodes[1].childNodes[0].stepDown();
    var price = currentObject.price
    var qty = curr.parentNode.querySelector("#qty").value

    var totalAmount = price * qty
    curr.parentNode.parentNode.parentNode.childNodes[2].innerHTML = "Rs. " + totalAmount
    var cartItems = JSON.parse(localStorage.getItem("cart-data"))
   
    for (var i = 0; i < cartItems.length; i++) {
        if (currentObject.id === cartItems[i].id) { 
            cartItems[i].quantity = qty; 
        }
    }
    localStorage.setItem("cart-data", JSON.stringify(cartItems));
    displayTotal()
    checkCartButton()
}
function displayCart() {
    $("#cart-items").empty()
    var cartItems = JSON.parse(localStorage.getItem("cart-data"))
    for (index in cartItems) {

        $("#cart-items").append("<tr>" +
            "<td><img src='" + cartItems[index].img + "' class='card-img-cart'><h5 class='card-title item-name'>" + cartItems[index].name + "</h5></td>" +
            "<td><div class='d-flex align-items-center'><div class='dec-btn' onclick='decrement(this," + cartItems[index].id + ")'><i class='fas fa-minus'></i></div><span class='btn-inner--text'><input type='number' name='qty' class='text-center' id='qty' min='1' value='"+cartItems[index].quantity+"'></span><div class='dec-btn' onclick='increment(this," + cartItems[index].id + ")'><i class='fas fa-plus' aria-hidden='true'></i></div></div></td>" +
            "<td id='totalamt'> Rs. " + cartItems[index].price*cartItems[index].quantity + "</td>" +
            "<td><button class='button-delete' type='button' onclick='deleteRow(this," + cartItems[index].id + ")' ><i class='fas fa-trash-alt' aria-hidden='true'></i></button></td>" + "</tr>");
    }
    document.getElementById("cartCount").innerHTML = document.getElementById("cart-table").rows.length - 1
    displayTotal()
    checkCartButton()

}
function deleteRow(r, id) {
    document.getElementById("button" + id).disabled = false
    var currentObject = Object.values(cartData).find(object => object.id === id);
    var deleteData = JSON.parse(localStorage.getItem("cart-data"))
    cartData = deleteData.filter(function (object) {
        return object.id != id

    })
    
    localStorage.setItem("cart-data", JSON.stringify(cartData))
    console.log( JSON.parse(localStorage.getItem("cart-data")))
 
    displayCart()
    displayTotal()
    checkCartButton()
    if (cartData.length == 0) {
        location.href = '/index.html';
    }
}
$(".check").click(function () {
    var desc = ''   
    $.each(cartData, function (index, object) {
        if (cartData.length == 1) {
            desc = object.name;
        } else {
            desc = object.name + ' | ' + desc;
        }
    })
    if ($("#cart-table").is(":visible")) {
        document.querySelector(".check").innerHTML = "Back to cart"
    } else {
        document.querySelector(".check").innerHTML = "Checkout"
    }
    $("#cart-table").toggle();
    userEmail = localStorage.getItem('email')
    userPwd = localStorage.getItem('pw')
    var firstname = localStorage.getItem('firstname')
    var lastname = localStorage.getItem('lastname')
    var phone = localStorage.getItem('phone')
    if (userEmail) {
        if (window.confirm('You are already logged in..Continue checkout')) {
            var amount = document.getElementById("totalCost").innerHTML

            console.log(amount)
            var options = {
                "key": "rzp_test_HyaYlvYTOymEzW",
                "amount": parseInt(amount) * 100,
                "name": firstname + lastname,
                "description": desc,
                "image": "https://icons-for-free.com/iconfiles/png/512/business+costume+male+man+office+user+icon-1320196264882354682.png",
                "handler": function (response) {
                    if (response.razorpay_payment_id) {
                        paymentStatus = 1
                        if (paymentStatus) {
                            $.each(cartData, function (index, object) {
                                document.getElementById("button" + object.id).disabled = false
                            })
                            document.getElementById("totalCost").innerHTML = 0
                            location.href = './index.html'
                        }
                    }
                },
                "prefill": {
                    "name": "Prateek Nalwaya",
                    "email": userEmail,
                    "contact": phone
                },
                "notes": {
                    "address": "F-35,Bhopalpura,Udaipur"
                },
                "theme": {
                    "color": "#3EA0F1"
                }
            };
            var propay = new Razorpay(options);
            propay.open();
            cartData = []
            displayCart()
        } else {
            if ($("#cart-table").is(":visible")) {
                document.querySelector(".check").innerHTML = "Back to cart"
            } else {
                document.querySelector(".check").innerHTML = "Checkout"
            }
            $("#cart-table").toggle();
        }
    } else {
        $("#checkout-form").toggle();
    }
});
function store() {
    var userEmail = document.getElementById('email');
    var userPwd = document.getElementById('pw');
    localStorage.setItem('email', userEmail.value);
    localStorage.setItem('firstname', document.getElementById('fname').value);
    localStorage.setItem('lastname', document.getElementById('lname').value);
    localStorage.setItem('phone', document.getElementById('tel').value);
    localStorage.setItem('pw', userPwd.value);
}
function check() {
    var storedEmail = localStorage.getItem('email');
    var storedPw = localStorage.getItem('pw');
    var userEmail = document.getElementById('userEmail');

    var userPw = document.getElementById('userPw');
    var amount = document.querySelector("#totalCost").innerHTML
    if (userEmail.value == storedEmail && userPw.value == storedPw) {
        var options = {
            "key": "rzp_test_HyaYlvYTOymEzW",
            "amount": amount,
            "name": "Prateek Nalwaya",
            "description": "description",
            "image": ".assets/css/img/pay.png",
            "handler": function (response) {
                if (response.razorpay_payment_id) {
                    var paymentStatus = 1
                    if (paymentStatus) {
                        $.each(cartData, function (index, object) {
                            document.getElementById("button" + object.id).disabled = false
                        })

                        location.href = './index.html'
                    }
                }
            },
            "prefill": {
                "name": "Prateek Nalwaya",
                "email": userEmail,
                "contact": phone
            },
            "notes": {
                "address": "F-35 Bhopalpura,Udaipur"
            },
            "theme": {
                "color": "#3DDF01"
            }
        };
        var propay = new Razorpay(options);
        propay.open();
    }
    else {
        alert('Invalid credentials');
    }
}
function checkCartButton() {
    if (document.getElementById("cartCount").innerHTML == 0) {
        document.getElementById("cart").disabled = true
    } else {
        document.getElementById("cart").disabled = false
    }
}
