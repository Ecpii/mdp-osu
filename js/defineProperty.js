Object.defineProperty(Object.prototype, 'solidify',{
  'value':function(obj){
    let propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function(name){
      let prop = obj[name];
      if( typeof prop === 'object' && prop !== null ){
        Object.solidify(prop);
      }
    });
    return Object.freeze(obj);
  },
  'enumerable': false
});
