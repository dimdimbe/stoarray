# Stoarray

**Stoarray** is a wrapper around normal javascript **Array** object.

It allow you to add custom **methods** to it and handle the **local storage** manipulation for you.


## Code Example

In this exemple, we are going to make a simple **Shopping cart**

### Initialize the cart
```javascript
var cart = new Stoarray('shopping-cart',{
  autosave : true, //save itself after each modification (default: true)
  defaultValues : [{id: 0, name:'Stuff',count: 1}], //use only if the local storage is empty
  ignore : false, //ignore data coming from the store when initialize (default false)
  debug : false, //when true, override ignore to true and autosave to false
  events : true //emit change event and other (like 'push', etc) events (default: true)
});
```
### Array's Methods
For now, **Stoarray** only provide these Array's methods
```javascript
cart.push(something); //something can be an array
cart.each(fn);
cart.map(fn);
cart.reduce(fn,[]);
```

For **other** Array's built in methods, we provide ***use***
```javascript
cart.use('filter',fn);
```

### Event Methods
You can listen to **events** triggered when the array change.

The function take one or two parameters first one is always the array itself and the second one is sometimes what has changed
```javascript
cart.on('change',fn);
```

### LocalStorage Methods
If you want to save manually, use **save** method
```javascript
cart.save();
```

### Custom Methods
With **Stoarray** you can also add custom methods
```javascript
cart.addMethod('addProduct',function(id,count,name){
  var done = false;
  //this.data is the built in array object
  this.data = this.data.map(function(product){
    if(product.id === id){
      product.count += count;
      done = true;
    }
    return product;
  });

  if(!done){
    this.data.push({
      id : id,
      name : name,
      count : count
    });
  }
});

//now we can use it
cart.addProduct(0,3,'Stuff');
```

## Motivation

I was tired of handling localstorage when working with arrays.

I also did this to show to student friends how to build javascript *class*.

## Installation

For now, you have to manually download the file ans import it to your html page.

I will make it available on **npm** as soon as possible

## Tests

I didn't write test yet... If you want to help me to do that, come talking to me :)
