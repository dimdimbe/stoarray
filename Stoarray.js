window.Stoarray = (function(){

  //private variables
  var _name,_autosave,_events;
  var _eventsCallback = {};
  var _addedMethods = []

  //constructor
  var Stoarray = function(name,opts){
    _name = name;
    _autosave = (opts.autosave === undefined)? true : !!opts.autosave;
    _events = (opts.events === undefined)? true : !!opts.events;


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

    if(_events){
      _triggerEvent('change', this.data );
    }

    if(_autosave){
      console.log('autosave')
      this.save();
    }
  }

  //array data methods
  Stoarray.prototype.use = function(method,fn,autre){
    var newData = this.data[method](fn.bind(this),autre);

    var newStoarray = new Stoarray(_name, {
      autosave : false,
      events : _events,
      ignore : true,
      defaultValues : newData
    });

    _addedMethods.forEach(function(obj){
      newStoarray.addMethod(obj.name,obj.method)
    })

    return newStoarray;
  }

  Stoarray.prototype.each = function(fn){
    return this.use('forEach',fn);
  }

  Stoarray.prototype.push = function(data){

    if(!(data instanceof Array)){
      data = [data];
    }

    for(var i = 0; i<data.length;i++){
      this.data.push(data[i]);
    }
    _save.call(this);
    _triggerEvent('push',this.data, data );
    return this;
  }

  Stoarray.prototype.map = function(fn){
    return this.use('map',fn);
  }

  Stoarray.prototype.reduce = function(fn,a){
    return this.use('reduce',fn,a);
  }


  //localStorage methods
  Stoarray.prototype.save = function(){
    var dataString = JSON.stringify(this.data);
    localStorage.setItem(_name,dataString);
    _triggerEvent('saved',this.data);
    return this;
  }


  //helper methods
  Stoarray.prototype.log = function(){
    console.log(this.data);
    return this;
  }

  Stoarray.prototype.clean = function(){
    this.data = [];
    this.save();
    return this;
  }

  Stoarray.prototype.addMethod = function(name,method){
    _addedMethods.push({name:name,method,method})
    this[name] = function(){
      method.apply(this,arguments);
      _save.call(this);
      return this;
    }.bind(this);
    return this;
  }

  //events methods
  Stoarray.prototype.on = function(eventName,callback){

    if(_eventsCallback[eventName] && _eventsCallback[eventName] instanceof Array){
      _eventsCallback[eventName].push(callback)
    }else{
      _eventsCallback[eventName] = [callback]
    }
    return this;

  }

  function _triggerEvent(eventName,data,changed){

    if(!_events) return;

    if(_eventsCallback[eventName] && _eventsCallback[eventName].length >0){
      for(var i = 0; i<_eventsCallback[eventName].length;i++){
        _eventsCallback[eventName][i].call(null,data,changed)
      }
    }
  }

  return Stoarray;

})();
