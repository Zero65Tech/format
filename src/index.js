let prettyJson = (data, breakFn, ...nodes) => {
  
  if(typeof data != 'object') {

    if(typeof data == 'number' && Number.isNaN(data))
      return '"NaN"';
    else
      return JSON.stringify(data);

  } else if(data instanceof Array) {

    let multiLine = breakFn ? breakFn(...nodes) : true;
    if(!multiLine)
      breakFn = () => false;

    let strArr = [];

    for(let [ idx, item ] of data.entries()) {
      if(typeof item == 'object' && item !== null) {
        strArr.push(prettyJson(item, breakFn, ...nodes, idx).replace(/\n/g, '\n  '));
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

    let multiLine = breakFn ? breakFn(...nodes) : true;
    if(!multiLine)
      breakFn = () => false;

    let strArr = [];
    for(let [ key, value ] of Object.entries(data)) {
      if(typeof value == 'object' && value !== null)
        strArr.push(`"${ key }": ${ prettyJson(value, breakFn, ...nodes, key).replace(/\n/g, '\n  ') }`);
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
