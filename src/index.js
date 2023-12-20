exports.number = (number, d = 0) => {

  if(!number || Math.abs(number) < 0.0001)
    return null;

  number = Math.round(number * Math.pow(10, d));

  let numberStr = Math.abs(number) + '';
  let l = numberStr.length;
  for(; l < d; l++)
    numberStr = '0' + numberStr;

  if(l == d)
    numberStr = '0.' + numberStr;
  else if(l <= 3 + d)
    numberStr = numberStr.substring(0, l - d) + (d ? '.' + numberStr.substring(l - d) : '');
  else if(l <= 5 + d)
    numberStr = numberStr.substring(0, l - 3 - d) + ',' + numberStr.substring(l - 3 - d, l - d) + (d ? '.' + numberStr.substring(l - d) : '')
  else
    numberStr = numberStr.substring(0, l - 5 - d) + ',' + numberStr.substring(l - 5 - d, l - 3 - d) + ',' + numberStr.substring(l - 3 - d, l - d) + (d ? '.' + numberStr.substring(l - d) : '');
  
  return (number < 0 ? '- ' : '') + numberStr;

};

exports.currency = (amount, d = 2) => {
  let f = exports.number(Math.abs(amount), d);
  if(f === null)
    return null;
  return amount < 0 ? ('- ₹' + f) : ('₹' + f);
}

exports.json = (data, wrap = 0, ...nodes) => {

  let multiLine = true;

  if(typeof wrap == 'number') {
    if(wrap > 0)
      wrap--;
    else
      multiLine = false;
  } else if(typeof wrap == 'function') {
    multiLine = wrap(nodes);
  }

  if(!multiLine)
    wrap = () => false;


  if(typeof data != 'object') {

    if(typeof data == 'number' && Number.isNaN(data))
      return '"NaN"';
    else
      return JSON.stringify(data);

  } else if(data instanceof Array) {

    let strArr = [];

    for(let [ idx, item ] of data.entries()) {
      if(typeof item == 'object' && item !== null) {
        strArr.push(exports.json(item, wrap, ...nodes, idx).replace(/\n/g, '\n  '));
      } else if(typeof item == 'number' && Number.isNaN(item)) {
        strArr.push('"NaN');
      } else {
        strArr.push(JSON.stringify(item));
      }
    }

    if(!strArr.length)
      return '[ ]';
    else if(!multiLine)
      return '[ ' + strArr.join(', ') + ' ]';
    else
      return '[\n  ' + strArr.join(',\n  ') + '\n]';

  } else {

    let strArr = [];
    for(let [ key, value ] of Object.entries(data)) {
      if(typeof value == 'object' && value !== null)
        strArr.push(`"${ key }": ${ exports.json(value, wrap, ...nodes, key).replace(/\n/g, '\n  ') }`);
      else if(typeof value == 'number' && Number.isNaN(value))
        strArr.push(`"${ key }": "NaN"`);
      else
        strArr.push(`"${ key }": ${ JSON.stringify(value) }`);
    }

    if(!strArr.length)
      return '{ }';
    else if(!multiLine)
      return '{ ' + strArr.join(', ') + ' }';
    else
      return '{\n  ' + strArr.join(',\n  ') + '\n}';

  }

}
