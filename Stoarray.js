window.Stoarray = (function(){

  //private variables
  var _name,_type,_autosave;

  //constructor
  var Stoarray = function(name,opts){
    _name = name;
    _autosave = (opts.autosave === undefined)? true : !!opts.autosave;

    var ignore = opts.ignore;
    if(opts.debug){
      ignore = true;
      _autosave = false;
    }

    _initData.call(this,opts.defaultValues,ignore);

    _save.call(this);
    return this;
  }

  //private method
  function _initData(d,ignore){
    var fromStorage = (ignore)?null:JSON.parse(localStorage.getItem(_name));
    this.data = fromStorage || d || [];
    return this;
  }

  function _save(){
    if(_autosave){
      console.log('autosave')
      this.save();
    }
  }

  //array data methods
  Stoarray.prototype.use = function(method,fn,autre){
    var newData = this.data[method](fn.bind(this),autre);
    if(newData){
      this.data = newData;
    }
    return this;
  }

  Stoarray.prototype.each = function(fn){
    for(var i = 0; i<this.data.length;i++){
      fn.call(this);
    }
    return this;
  }

  Stoarray.prototype.push = function(data){
    if(!data instanceof Array){
      data = [data];
    }
    for(var i = 0; i<data.length;i++){
      this.data.push(data[i]);
    }
    _save.call(this);
    return this;
  }

  Stoarray.prototype.map = function(fn){
    this.data = this.data.map(fn.bind(this));
    _save.call(this);
    return this;
  }

  Stoarray.prototype.reduce = function(fn,tab){
    this.data = this.data.reduce(fn.bind(this),tab);
    _save.call(this);
    return this;
  }


  //localStorage methods
  Stoarray.prototype.save = function(){
    var dataString = JSON.stringify(this.data);
    localStorage.setItem(_name,dataString);
    return this;
  }


  //helper methods
  Stoarray.prototype.log = function(){
    console.log(this.data);
    return this;
  }

  Stoarray.prototype.addMethod = function(name,method){
    this[name] = function(){
      method.apply(this,arguments);
      _save.call(this);
      return this;
    }.bind(this);
    return this;
  }

  return Stoarray;

})();
