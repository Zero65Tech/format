exports.number = (number, d = 0) => {

  if(number === undefined || number === null)
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

exports.percentage = (number, d = 0) => {
  let f = exports.number(number, d);
  return f === null ? f : f + '%';
};

exports.currency = (amount, d = 0) => {

  if(amount === undefined || amount === null)
    return null;

  let f = exports.number(Math.abs(amount), d);
  
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
      else if(value !== undefined)
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

exports.gradient = (amount, min = -100, max = 100, mid = 0, minColor = 'deep-orange', maxColor = 'light-green') => {

  if(amount === undefined || amount === null || min == max)
    return '';

  if(amount < mid - (mid - min) / 10 * 9)
    return 'bg-' + minColor + '-darken-4';
  if(amount < mid - (mid - min) / 10 * 8)
    return 'bg-' + minColor + '-darken-3';
  if(amount < mid - (mid - min) / 10 * 7)
    return 'bg-' + minColor + '-darken-2';
  if(amount < mid - (mid - min) / 10 * 6)
    return 'bg-' + minColor + '-darken-1';
  if(amount < mid - (mid - min) / 10 * 5)
    return 'bg-' + minColor;
  if(amount < mid - (mid - min) / 10 * 4)
    return 'bg-' + minColor + '-lighten-1';
  if(amount < mid - (mid - min) / 10 * 3)
    return 'bg-' + minColor + '-lighten-2';
  if(amount < mid - (mid - min) / 10 * 2)
    return 'bg-' + minColor + '-lighten-3';
  if(amount < mid - (mid - min) / 10 * 1)
    return 'bg-' + minColor + '-lighten-4';
  if(amount <= mid - 0.00001)
    return 'bg-' + minColor + '-lighten-5';

  if(amount < mid + 0.00001)
    return '';

  if(amount <= mid + (max - mid) / 10 * 1)
    return 'bg-' + maxColor + '-lighten-5';
  if(amount <= mid + (max - mid) / 10 * 2)
    return 'bg-' + maxColor + '-lighten-4';
  if(amount <= mid + (max - mid) / 10 * 3)
    return 'bg-' + maxColor + '-lighten-3';
  if(amount <= mid + (max - mid) / 10 * 4)
    return 'bg-' + maxColor + '-lighten-2';
  if(amount <= mid + (max - mid) / 10 * 5)
    return 'bg-' + maxColor + '-lighten-1';
  if(amount <= mid + (max - mid) / 10 * 6)
    return 'bg-' + maxColor;
  if(amount <= mid + (max - mid) / 10 * 7)
    return 'bg-' + maxColor + '-darken-1';
  if(amount <= mid + (max - mid) / 10 * 8)
    return 'bg-' + maxColor + '-darken-2';
  if(amount <= mid + (max - mid) / 10 * 9)
    return 'bg-' + maxColor + '-darken-3';
  // if(amount <= max )
    return 'bg-' + maxColor + '-darken-4';

}

exports.gradientLite = (amount, min = -100, max = 100, mid = 0, minColor = 'amber', maxColor = 'lime') => {

  if(amount === undefined || amount === null || min == max)
    return '';

  if(amount < mid - (mid - min) / 6 * 5)
    return 'bg-' + minColor;
  if(amount < mid - (mid - min) / 6 * 4)
    return 'bg-' + minColor + '-lighten-1';
  if(amount < mid - (mid - min) / 6 * 3)
    return 'bg-' + minColor + '-lighten-2';
  if(amount < mid - (mid - min) / 6 * 2)
    return 'bg-' + minColor + '-lighten-3';
  if(amount < mid - (mid - min) / 6 * 1)
    return 'bg-' + minColor + '-lighten-4';
  if(amount <= mid - 0.00001)
    return 'bg-' + minColor + '-lighten-5';

  if(amount < mid + 0.00001)
    return '';

  if(amount <= mid + (max - mid) / 6 * 1)
    return 'bg-' + maxColor + '-lighten-5';
  if(amount <= mid + (max - mid) / 6 * 2)
    return 'bg-' + maxColor + '-lighten-4';
  if(amount <= mid + (max - mid) / 6 * 3)
    return 'bg-' + maxColor + '-lighten-3';
  if(amount <= mid + (max - mid) / 6 * 4)
    return 'bg-' + maxColor + '-lighten-2';
  if(amount <= mid + (max - mid) / 6 * 5)
    return 'bg-' + maxColor + '-lighten-1';
  // if(amount <= max )
    return 'bg-' + maxColor;

}

exports.gradientSingle = (amount, min = 0, max = 100, color = 'yellow') => {

  if(amount === undefined || amount === null || min == max)
    return '';

  if(amount < min)
    return '';
  if(amount < min + (max - min) / 6 * 1)
    return 'bg-' + color + '-lighten-5';
  if(amount < min + (max - min) / 6 * 2)
    return 'bg-' + color + '-lighten-4';
  if(amount < min + (max - min) / 6 * 3)
    return 'bg-' + color + '-lighten-3';
  if(amount < min + (max - min) / 6 * 4)
    return 'bg-' + color + '-lighten-2';
  if(amount < min + (max - min) / 6 * 5)
    return 'bg-' + color + '-lighten-1';
  // if(amount < max )
    return 'bg-' + color;

}
