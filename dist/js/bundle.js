(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var d3 = require('d3');

function Tree(opts) {
    //load in arguments from config object
    this.element = opts.element;
    if (opts.margin === undefined) {
        this.margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 120
        };
    } else {
        this.margin = opts.margin;
    }
    this.height = opts.height || 800 - this.margin.top - this.margin.bottom;
    this.width = opts.width || 960 - this.margin.right - this.margin.left;
    this.i = 0;
    this.duration = 750;

    this.tree = d3.layout.tree()
        .size([this.height, this.width]);

    this.svg = d3.select(this.element).append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
}

Tree.prototype.diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

Tree.prototype.setData = function(data) {
    this.root = data;
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // Recursively collapse the tree
    function collapse(node) {
        if (node.children) {
            node._children = node.children;
            node._children.forEach(collapse);
            node.children = null;
        }
    }

    this.root.children.forEach(collapse);
    this.update(this.root);
};

Tree.prototype.getData = function(url) {
    var _this = this;
    d3.json(url, function(error, data) {
        if (error) throw error;

        _this.setData(data);
    });
};

Tree.prototype.update = function(source) {
    var _this = this;

    // Toggle children on click
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        _this.update(d);
    }

    // Compute new tree layout
    var nodes = this.tree.nodes(this.root).reverse(),
        links = this.tree.links(nodes);

    // Normalize for fixed-depth
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // Update the nodes
    var node = this.svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++_this.i);
        });

    // Enter any new nodes at the parent's previous position
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click);

    nodeEnter.append('circle')
        .attr('r', 1e-6)
        .style('fill', function(d) {
            return d._children ? 'lightstellblue' : '#fff';
        });

    nodeEnter.append('text')
        .attr('x', function(d) {
            return d.children || d._children ? -10 : 10;
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style('fill-opacity', 1e-6);

    // Transition nodes to their new postition
    var nodeUpdate = node.transition()
        .duration(this.duration)
        .attr('transform', function(d) {
            return 'translate(' + d.y + ',' + d.x + ')';
        });

    nodeUpdate.select('circle')
        .attr('r', 4.5)
        .style('fill', function(d) {
            return d._children ? 'lightsteelblue' : '#fff';
        });

    nodeUpdate.select('text')
        .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = this.svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {
                x: source.x0,
                y: source.y0
            };
            return _this.diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.transition()
        .duration(this.duration)
        .attr("d", this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(this.duration)
        .attr("d", function(d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return _this.diagonal({
                source: o,
                target: o
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
};

module.exports = Tree;

},{"d3":2}],2:[function(require,module,exports){
!function() {
  var d3 = {
    version: "3.5.17"
  };
  var d3_arraySlice = [].slice, d3_array = function(list) {
    return d3_arraySlice.call(list);
  };
  var d3_document = this.document;
  function d3_documentElement(node) {
    return node && (node.ownerDocument || node.document || node).documentElement;
  }
  function d3_window(node) {
    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
  }
  if (d3_document) {
    try {
      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
    } catch (e) {
      d3_array = function(list) {
        var i = list.length, array = new Array(i);
        while (i--) array[i] = list[i];
        return array;
      };
    }
  }
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  if (d3_document) {
    try {
      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
    } catch (error) {
      var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
      d3_element_prototype.setAttribute = function(name, value) {
        d3_element_setAttribute.call(this, name, value + "");
      };
      d3_element_prototype.setAttributeNS = function(space, local, value) {
        d3_element_setAttributeNS.call(this, space, local, value + "");
      };
      d3_style_prototype.setProperty = function(name, value, priority) {
        d3_style_setProperty.call(this, name, value + "", priority);
      };
    }
  }
  d3.ascending = d3_ascending;
  function d3_ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  function d3_number(x) {
    return x === null ? NaN : +x;
  }
  function d3_numeric(x) {
    return !isNaN(x);
  }
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
    } else {
      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  d3.mean = function(array, f) {
    var s = 0, n = array.length, a, i = -1, j = n;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
    }
    if (j) return s / j;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    var numbers = [], n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
    }
    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
  };
  d3.variance = function(array, f) {
    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) {
        if (d3_numeric(a = d3_number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    } else {
      while (++i < n) {
        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }
    if (j > 1) return s / (j - 1);
  };
  d3.deviation = function() {
    var v = d3.variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };
  function d3_bisector(compare) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  }
  var d3_bisect = d3_bisector(d3_ascending);
  d3.bisectLeft = d3_bisect.left;
  d3.bisect = d3.bisectRight = d3_bisect.right;
  d3.bisector = function(f) {
    return d3_bisector(f.length === 1 ? function(d, x) {
      return d3_ascending(f(d), x);
    } : f);
  };
  d3.shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }
    var m = i1 - i0, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  d3.transpose = function(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = d3.min(matrix, d3_transposeLength), transpose = new Array(m); ++i < m; ) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n; ) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  };
  function d3_transposeLength(d) {
    return d.length;
  }
  d3.zip = function() {
    return d3.transpose(arguments);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  }
  d3.map = function(object, f) {
    var map = new d3_Map();
    if (object instanceof d3_Map) {
      object.forEach(function(key, value) {
        map.set(key, value);
      });
    } else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
      for (var key in object) map.set(key, object[key]);
    }
    return map;
  };
  function d3_Map() {
    this._ = Object.create(null);
  }
  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
  d3_class(d3_Map, {
    has: d3_map_has,
    get: function(key) {
      return this._[d3_map_escape(key)];
    },
    set: function(key, value) {
      return this._[d3_map_escape(key)] = value;
    },
    remove: d3_map_remove,
    keys: d3_map_keys,
    values: function() {
      var values = [];
      for (var key in this._) values.push(this._[key]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var key in this._) entries.push({
        key: d3_map_unescape(key),
        value: this._[key]
      });
      return entries;
    },
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
    }
  });
  function d3_map_escape(key) {
    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
  }
  function d3_map_unescape(key) {
    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
  }
  function d3_map_has(key) {
    return d3_map_escape(key) in this._;
  }
  function d3_map_remove(key) {
    return (key = d3_map_escape(key)) in this._ && delete this._[key];
  }
  function d3_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(d3_map_unescape(key));
    return keys;
  }
  function d3_map_size() {
    var size = 0;
    for (var key in this._) ++size;
    return size;
  }
  function d3_map_empty() {
    for (var key in this._) return false;
    return true;
  }
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function d3_Set() {
    this._ = Object.create(null);
  }
  d3_class(d3_Set, {
    has: d3_map_has,
    add: function(key) {
      this._[d3_map_escape(key += "")] = true;
      return key;
    },
    remove: d3_map_remove,
    values: d3_map_keys,
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key));
    }
  });
  d3.behavior = {};
  function d3_identity(d) {
    return d;
  }
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatches = function(n, s) {
    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
    d3_selectMatches = function(n, s) {
      return d3_selectMatcher.call(n, s);
    };
    return d3_selectMatches(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = Sizzle;
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3.select(d3_document.documentElement);
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsXhtml = "http://www.w3.org/1999/xhtml";
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: d3_nsXhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classes(name) {
    return (name + "").trim().split(/^|\s+/);
  }
  function d3_selection_classed(name, value) {
    name = d3_selection_classes(name).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) {
        var node = this.node();
        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
      }
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    function create() {
      var document = this.ownerDocument, namespace = this.namespaceURI;
      return namespace === d3_nsXhtml && document.documentElement.namespaceURI === d3_nsXhtml ? document.createElement(name) : document.createElementNS(namespace, name);
    }
    function createNS() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    }
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(d3_selectionRemove);
  };
  function d3_selectionRemove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
        for (i = -1; ++i < n; ) {
          if (node = group[i]) {
            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
              exitNodes[i] = node;
            } else {
              nodeByKeyValue.set(keyValue, node);
            }
            keyValues[i] = keyValue;
          }
        }
        for (i = -1; ++i < m; ) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          } else if (node !== true) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }
        for (i = -1; ++i < n; ) {
          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3_ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    d3_selection_each(this, function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3.select = function(node) {
    var group;
    if (typeof node === "string") {
      group = [ d3_select(node, d3_document) ];
      group.parentNode = d3_document.documentElement;
    } else {
      group = [ node ];
      group.parentNode = d3_documentElement(node);
    }
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group;
    if (typeof nodes === "string") {
      group = d3_array(d3_selectAll(nodes, d3_document));
      group.parentNode = d3_document.documentElement;
    } else {
      group = d3_array(nodes);
      group.parentNode = null;
    }
    return d3_selection([ group ]);
  };
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.slice(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  if (d3_document) {
    d3_selection_onFilters.forEach(function(k) {
      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
    });
  }
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect, d3_event_dragId = 0;
  function d3_event_dragSuppress(node) {
    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
    if (d3_event_dragSelect == null) {
      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
    }
    if (d3_event_dragSelect) {
      var style = d3_documentElement(node).style, select = style[d3_event_dragSelect];
      style[d3_event_dragSelect] = "none";
    }
    return function(suppressClick) {
      w.on(name, null);
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
      if (suppressClick) {
        var off = function() {
          w.on(click, null);
        };
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0) {
        var window = d3_window(container);
        if (window.scrollX || window.scrollY) {
          svg = d3.select("body").append("svg").style({
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            border: "none"
          }, "important");
          var ctm = svg[0][0].getScreenCTM();
          d3_mouse_bug44083 = !(ctm.f || ctm.e);
          svg.remove();
        }
      }
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touch = function(container, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return d3_mousePoint(container, touch);
      }
    }
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function dragstart(id, position, subject, move, end) {
      return function() {
        var that = this, target = d3.event.target.correspondingElement || d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId);
        if (origin) {
          dragOffset = origin.apply(that, arguments);
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
        } else {
          dragOffset = [ 0, 0 ];
        }
        dispatch({
          type: "dragstart"
        });
        function moved() {
          var position1 = position(parent, dragId), dx, dy;
          if (!position1) return;
          dx = position1[0] - position0[0];
          dy = position1[1] - position0[1];
          dragged |= dx | dy;
          position0 = position1;
          dispatch({
            type: "drag",
            x: position1[0] + dragOffset[0],
            y: position1[1] + dragOffset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          if (!position(parent, dragId)) return;
          dragSubject.on(move + dragName, null).on(end + dragName, null);
          dragRestore(dragged);
          dispatch({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  function d3_behavior_dragTouchId() {
    return d3.event.changedTouches[0].identifier;
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_cross2d(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function d3_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function d3_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function d3_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  d3.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < ε2) {
      S = Math.log(w1 / w0) / ρ;
      i = function(t) {
        return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S) ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / ρ;
      i = function(t) {
        var s = t * S, coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
      };
    }
    i.duration = S * 1e3;
    return i;
  };
  d3.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    if (!d3_behavior_zoomWheel) {
      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return d3.event.wheelDelta;
      }, "mousewheel") : (d3_behavior_zoomDelta = function() {
        return -d3.event.detail;
      }, "MozMousePixelScroll");
    }
    function zoom(g) {
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments), view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(dispatch);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(dispatch);
            };
          }).each("interrupt.zoom", function() {
            zoomended(dispatch);
          }).each("end.zoom", function() {
            zoomended(dispatch);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: null
      };
      scaleTo(+_);
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function zoomTo(that, p, l, k) {
      that.__chart__ = {
        x: view.x,
        y: view.y,
        k: view.k
      };
      scaleTo(Math.pow(2, k));
      translateTo(center0 = p, l);
      that = d3.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({
        type: "zoomstart"
      });
    }
    function zoomed(dispatch) {
      rescale();
      dispatch({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(dispatch) {
      if (!--zooming) dispatch({
        type: "zoomend"
      }), center0 = null;
    }
    function mousedowned() {
      var that = this, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that);
      d3_selection_interrupt.call(that);
      zoomstarted(dispatch);
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(that), location0);
        zoomed(dispatch);
      }
      function ended() {
        subject.on(mousemove, null).on(mouseup, null);
        dragRestore(dragged);
        zoomended(dispatch);
      }
    }
    function touchstarted() {
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that);
      started();
      zoomstarted(dispatch);
      subject.on(mousedown, null).on(touchstart, started);
      function relocate() {
        var touches = d3.touches(that);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var target = d3.event.target;
        d3.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
            d3_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = d3.touches(that), p0, l0, p1, l1;
        d3_selection_interrupt.call(that);
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }
      function ended() {
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        d3.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }
    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(dispatch);
      }, 50);
      d3_eventPreventDefault();
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
      translateTo(center0, translate0);
      zoomed(dispatch);
    }
    function dblclicked() {
      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel;
  d3.color = d3_color;
  function d3_color() {}
  d3_color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = d3_hsl;
  function d3_hsl(h, s, l) {
    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
  }
  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  d3.hcl = d3_hcl;
  function d3_hcl(h, c, l) {
    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
  }
  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
  d3_hclPrototype.brighter = function(k) {
    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = d3_lab;
  function d3_lab(l, a, b) {
    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_lab.prototype = new d3_color();
  d3_labPrototype.brighter = function(k) {
    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = d3_rgb;
  function d3_rgb(r, g, b) {
    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
  }
  function d3_rgbNumber(value) {
    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return new d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_rgb(k * this.r, k * this.g, k * this.b);
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (color = d3_rgb_names.get(format)) {
      return rgb(color.r, color.g, color.b);
    }
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
      if (format.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (format.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      dispatch.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  function d3_xhrHasResponse(request) {
    var type = request.responseType;
    return type && type !== "text" ? request.response : request.responseText;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr;
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }
        return text.slice(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function() {
    d3_timer.apply(this, arguments);
  };
  function d3_timer(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      n: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
    return timer;
  }
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_mark() {
    var now = Date.now(), timer = d3_timer_queueHead;
    while (timer) {
      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
      timer = timer.n;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.c) {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      } else {
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value = +value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  function d3_locale_numberFormat(locale) {
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = locale_grouping[j = (j + 1) % locale_grouping.length];
      }
      return t.reverse().join(locale_thousands);
    } : d3_identity;
    return function(specifier) {
      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
      if (precision) precision = +precision.substring(1);
      if (zfill || fill === "0" && align === "=") {
        zfill = fill = "0";
        align = "=";
      }
      switch (type) {
       case "n":
        comma = true;
        type = "g";
        break;

       case "%":
        scale = 100;
        suffix = "%";
        type = "f";
        break;

       case "p":
        scale = 100;
        suffix = "%";
        type = "r";
        break;

       case "b":
       case "o":
       case "x":
       case "X":
        if (symbol === "#") prefix = "0" + type.toLowerCase();

       case "c":
        exponent = false;

       case "d":
        integer = true;
        precision = 0;
        break;

       case "s":
        scale = -1;
        type = "r";
        break;
      }
      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
      if (type == "r" && !precision) type = "g";
      if (precision != null) {
        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
      }
      type = d3_format_types.get(type) || d3_format_typeDefault;
      var zcomma = zfill && comma;
      return function(value) {
        var fullSuffix = suffix;
        if (integer && value % 1) return "";
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
        if (scale < 0) {
          var unit = d3.formatPrefix(value, precision);
          value = unit.scale(value);
          fullSuffix = unit.symbol + suffix;
        } else {
          value *= scale;
        }
        value = type(value, precision);
        var i = value.lastIndexOf("."), before, after;
        if (i < 0) {
          var j = exponent ? value.lastIndexOf("e") : -1;
          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
        } else {
          before = value.substring(0, i);
          after = locale_decimal + value.substring(i + 1);
        }
        if (!zfill && comma) before = formatGroup(before, Infinity);
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
        negative += prefix;
        value = before + after;
        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
      };
    };
  }
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_time = d3.time = {}, d3_date = Date;
  function d3_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_date = Date;
      }
    };
  }
  d3_time.year = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3_time.years = d3_time.year.range;
  d3_time.years.utc = d3_time.year.utc.range;
  d3_time.day = d3_time_interval(function(date) {
    var day = new d3_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3_time.days = d3_time.day.range;
  d3_time.days.utc = d3_time.day.utc.range;
  d3_time.dayOfYear = function(date) {
    var year = d3_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
    i = 7 - i;
    var interval = d3_time[day] = d3_time_interval(function(date) {
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3_time[day + "s"] = interval.range;
    d3_time[day + "s"].utc = interval.utc.range;
    d3_time[day + "OfYear"] = function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3_time.week = d3_time.sunday;
  d3_time.weeks = d3_time.sunday.range;
  d3_time.weeks.utc = d3_time.sunday.utc.range;
  d3_time.weekOfYear = d3_time.sundayOfYear;
  function d3_locale_timeFormat(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
    function d3_time_format(template) {
      var n = template.length;
      function format(date) {
        var string = [], i = -1, j = 0, c, p, f;
        while (++i < n) {
          if (template.charCodeAt(i) === 37) {
            string.push(template.slice(j, i));
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
            string.push(c);
            j = i + 1;
          }
        }
        string.push(template.slice(j, i));
        return string.join("");
      }
      format.parse = function(string) {
        var d = {
          y: 1900,
          m: 0,
          d: 1,
          H: 0,
          M: 0,
          S: 0,
          L: 0,
          Z: null
        }, i = d3_time_parse(d, template, string, 0);
        if (i != string.length) return null;
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          date.setFullYear(d.y, 0, 1);
          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
        } else date.setFullYear(d.y, d.m, d.d);
        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
        return localZ ? date._ : date;
      };
      format.toString = function() {
        return template;
      };
      return format;
    }
    function d3_time_parse(date, template, string, j) {
      var c, p, t, i = 0, n = template.length, m = string.length;
      while (i < n) {
        if (j >= m) return -1;
        c = template.charCodeAt(i++);
        if (c === 37) {
          t = template.charAt(i++);
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
          if (!p || (j = p(date, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }
      return j;
    }
    d3_time_format.utc = function(template) {
      var local = d3_time_format(template);
      function format(date) {
        try {
          d3_date = d3_date_utc;
          var utc = new d3_date();
          utc._ = date;
          return local(utc);
        } finally {
          d3_date = Date;
        }
      }
      format.parse = function(string) {
        try {
          d3_date = d3_date_utc;
          var date = local.parse(string);
          return date && date._;
        } finally {
          d3_date = Date;
        }
      };
      format.toString = local.toString;
      return format;
    };
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
    locale_periods.forEach(function(p, i) {
      d3_time_periodLookup.set(p.toLowerCase(), i);
    });
    var d3_time_formats = {
      a: function(d) {
        return locale_shortDays[d.getDay()];
      },
      A: function(d) {
        return locale_days[d.getDay()];
      },
      b: function(d) {
        return locale_shortMonths[d.getMonth()];
      },
      B: function(d) {
        return locale_months[d.getMonth()];
      },
      c: d3_time_format(locale_dateTime),
      d: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      e: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      H: function(d, p) {
        return d3_time_formatPad(d.getHours(), p, 2);
      },
      I: function(d, p) {
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
      },
      j: function(d, p) {
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
      },
      L: function(d, p) {
        return d3_time_formatPad(d.getMilliseconds(), p, 3);
      },
      m: function(d, p) {
        return d3_time_formatPad(d.getMonth() + 1, p, 2);
      },
      M: function(d, p) {
        return d3_time_formatPad(d.getMinutes(), p, 2);
      },
      p: function(d) {
        return locale_periods[+(d.getHours() >= 12)];
      },
      S: function(d, p) {
        return d3_time_formatPad(d.getSeconds(), p, 2);
      },
      U: function(d, p) {
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
      },
      w: function(d) {
        return d.getDay();
      },
      W: function(d, p) {
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
      },
      x: d3_time_format(locale_date),
      X: d3_time_format(locale_time),
      y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
      },
      Y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
      },
      Z: d3_time_zone,
      "%": function() {
        return "%";
      }
    };
    var d3_time_parsers = {
      a: d3_time_parseWeekdayAbbrev,
      A: d3_time_parseWeekday,
      b: d3_time_parseMonthAbbrev,
      B: d3_time_parseMonth,
      c: d3_time_parseLocaleFull,
      d: d3_time_parseDay,
      e: d3_time_parseDay,
      H: d3_time_parseHour24,
      I: d3_time_parseHour24,
      j: d3_time_parseDayOfYear,
      L: d3_time_parseMilliseconds,
      m: d3_time_parseMonthNumber,
      M: d3_time_parseMinutes,
      p: d3_time_parseAmPm,
      S: d3_time_parseSeconds,
      U: d3_time_parseWeekNumberSunday,
      w: d3_time_parseWeekdayNumber,
      W: d3_time_parseWeekNumberMonday,
      x: d3_time_parseLocaleDate,
      X: d3_time_parseLocaleTime,
      y: d3_time_parseYear,
      Y: d3_time_parseFullYear,
      Z: d3_time_parseZone,
      "%": d3_time_parseLiteralPercent
    };
    function d3_time_parseWeekdayAbbrev(date, string, i) {
      d3_time_dayAbbrevRe.lastIndex = 0;
      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseWeekday(date, string, i) {
      d3_time_dayRe.lastIndex = 0;
      var n = d3_time_dayRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonthAbbrev(date, string, i) {
      d3_time_monthAbbrevRe.lastIndex = 0;
      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonth(date, string, i) {
      d3_time_monthRe.lastIndex = 0;
      var n = d3_time_monthRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseLocaleFull(date, string, i) {
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
    }
    function d3_time_parseLocaleDate(date, string, i) {
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
    }
    function d3_time_parseLocaleTime(date, string, i) {
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
    }
    function d3_time_parseAmPm(date, string, i) {
      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (date.p = n, i);
    }
    return d3_time_format;
  }
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
    i + 5) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  function d3_time_formatMulti(formats) {
    var n = formats.length, i = -1;
    while (++i < n) formats[i][0] = this(formats[i][0]);
    return function(date) {
      var i = 0, f = formats[i];
      while (!f[1](date)) f = formats[++i];
      return f[0](date);
    };
  }
  d3.locale = function(locale) {
    return {
      numberFormat: d3_locale_numberFormat(locale),
      timeFormat: d3_locale_timeFormat(locale)
    };
  };
  var d3_locale_enUS = d3.locale({
    decimal: ".",
    thousands: ",",
    grouping: [ 3 ],
    currency: [ "$", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  });
  d3.format = d3_locale_enUS.numberFormat;
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      object = object.coordinates;
      listener.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
      a.o = b;
      subject.push(a);
      clip.push(b);
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
      a.o = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
      clip[i].e = entry = !entry;
    }
    var start = subject[0], points, point;
    while (1) {
      var current = start, isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      listener.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, listener);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, listener);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
    return function(rotate, listener) {
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
          if (segments.length) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
          } else if (clipStartInside) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        var point = rotate(λ, φ);
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        var point = rotate(λ, φ);
        line.point(point[0], point[1]);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
      function pointRing(λ, φ) {
        ring.push([ λ, φ ]);
        var point = rotate(λ, φ);
        ringListener.point(point[0], point[1]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          if (n > 0) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            while (++i < n) listener.point((point = segment[i])[0], point[1]);
            listener.lineEnd();
          }
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
        if (abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * halfπ;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (abs(from[0] - to[0]) > ε) {
      var s = from[0] < to[0] ? π : -π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
    }
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < -ε) ^ winding & 1;
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
  }
  function d3_geom_clipLine(x0, y0, x1, y1) {
    return function(line) {
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      if (t0 > 0) line.a = {
        x: ax + t0 * dx,
        y: ay + t0 * dy
      };
      if (t1 < 1) line.b = {
        x: ax + t1 * dx,
        y: ay + t1 * dy
      };
      return line;
    };
  }
  var d3_geo_clipExtentMAX = 1e9;
  d3.geo.clipExtent = function() {
    var x0, y0, x1, y1, stream, clip, clipExtent = {
      stream: function(output) {
        if (stream) stream.valid = false;
        stream = clip(output);
        stream.valid = true;
        return stream;
      },
      extent: function(_) {
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
        if (stream) stream.valid = false, stream = null;
        return clipExtent;
      }
    };
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
  };
  function d3_geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
          clean = true;
        },
        polygonEnd: function() {
          listener = listener_;
          segments = d3.merge(segments);
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
          if (inside || visible) {
            listener.polygonStart();
            if (inside) {
              listener.lineStart();
              interpolate(null, null, 1, listener);
              listener.lineEnd();
            }
            if (visible) {
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
            }
            listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function pointVisible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (pointVisible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first, clean;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
        var v = pointVisible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var l = {
              a: {
                x: x_,
                y: y_
              },
              b: {
                x: x,
                y: y
              }
            };
            if (clipLine(l)) {
              if (!v_) {
                listener.lineStart();
                listener.point(l.a.x, l.a.y);
              }
              listener.point(l.b.x, l.b.y);
              if (!v) listener.lineEnd();
              clean = false;
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.x, b.x);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x + pointRadius, y);
      context.arc(x, y, pointRadius, 0, τ);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      return (maxDepth ? resampleRecursive : resampleNone)(stream);
    }
    function resampleNone(stream) {
      return d3_geo_transformPoint(stream, function(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      });
    }
    function resampleRecursive(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(x, y) {
      return project([ x * d3_degrees, y * d3_degrees ]);
    });
    return function(stream) {
      return d3_geo_projectionRadians(resample(stream));
    };
  }
  d3.geo.transform = function(methods) {
    return {
      stream: function(stream) {
        var transform = new d3_geo_transform(stream);
        for (var k in methods) transform[k] = methods[k];
        return transform;
      }
    };
  };
  function d3_geo_transform(stream) {
    this.stream = stream;
  }
  d3_geo_transform.prototype = {
    point: function(x, y) {
      this.stream.point(x, y);
    },
    sphere: function() {
      this.stream.sphere();
    },
    lineStart: function() {
      this.stream.lineStart();
    },
    lineEnd: function() {
      this.stream.lineEnd();
    },
    polygonStart: function() {
      this.stream.polygonStart();
    },
    polygonEnd: function() {
      this.stream.polygonEnd();
    }
  };
  function d3_geo_transformPoint(stream, point) {
    return {
      point: point,
      sphere: function() {
        stream.sphere();
      },
      lineStart: function() {
        stream.lineStart();
      },
      lineEnd: function() {
        stream.lineEnd();
      },
      polygonStart: function() {
        stream.polygonStart();
      },
      polygonEnd: function() {
        stream.polygonEnd();
      }
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) stream.valid = false, stream = null;
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadians(stream) {
    return d3_geo_transformPoint(stream, function(x, y) {
      stream.point(x * d3_radians, y * d3_radians);
    });
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_identityRotation(λ, φ) {
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
  }
  d3_geo_identityRotation.invert = d3_geo_equirectangular;
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      var step = direction * precision;
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * τ;
      } else {
        from = radius + direction * τ;
        to = radius - .5 * step;
      }
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      if (F > 0) {
        if (φ < -halfπ + ε) φ = -halfπ + ε;
      } else {
        if (φ > halfπ - ε) φ = halfπ - ε;
      }
      var ρ = F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
  };
  (d3.geo.transverseMercator = function() {
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
    projection.center = function(_) {
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
    };
    projection.rotate = function(_) {
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
      [ _[0], _[1], _[2] - 90 ]);
    };
    return rotate([ 0, 0, 90 ]);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  function d3_geom_pointX(d) {
    return d[0];
  }
  function d3_geom_pointY(d) {
    return d[1];
  }
  d3.geom.hull = function(vertices) {
    var x = d3_geom_pointX, y = d3_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
      for (i = 0; i < n; i++) {
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
      }
      points.sort(d3_geom_hullOrder);
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
      return polygon;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullUpper(points) {
    var n = points.length, hull = [ 0, 1 ], hs = 2;
    for (var i = 2; i < n; i++) {
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
      hull[hs++] = i;
    }
    return hull.slice(0, hs);
  }
  function d3_geom_hullOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
  function d3_geom_voronoiBeach() {
    d3_geom_voronoiRedBlackNode(this);
    this.edge = this.site = this.circle = null;
  }
  function d3_geom_voronoiCreateBeach(site) {
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
    beach.site = site;
    return beach;
  }
  function d3_geom_voronoiDetachBeach(beach) {
    d3_geom_voronoiDetachCircle(beach);
    d3_geom_voronoiBeaches.remove(beach);
    d3_geom_voronoiBeachPool.push(beach);
    d3_geom_voronoiRedBlackNode(beach);
  }
  function d3_geom_voronoiRemoveBeach(beach) {
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
      x: x,
      y: y
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
    d3_geom_voronoiDetachBeach(beach);
    var lArc = previous;
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
      previous = lArc.P;
      disappearing.unshift(lArc);
      d3_geom_voronoiDetachBeach(lArc);
      lArc = previous;
    }
    disappearing.unshift(lArc);
    d3_geom_voronoiDetachCircle(lArc);
    var rArc = next;
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
      next = rArc.N;
      disappearing.push(rArc);
      d3_geom_voronoiDetachBeach(rArc);
      rArc = next;
    }
    disappearing.push(rArc);
    d3_geom_voronoiDetachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) {
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiAddBeach(site) {
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
    while (node) {
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
      if (dxl > ε) node = node.L; else {
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
        if (dxr > ε) {
          if (!node.R) {
            lArc = node;
            break;
          }
          node = node.R;
        } else {
          if (dxl > -ε) {
            lArc = node.P;
            rArc = node;
          } else if (dxr > -ε) {
            lArc = node;
            rArc = node.N;
          } else {
            lArc = rArc = node;
          }
          break;
        }
      }
    }
    var newArc = d3_geom_voronoiCreateBeach(site);
    d3_geom_voronoiBeaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
      d3_geom_voronoiDetachCircle(lArc);
      rArc = d3_geom_voronoiCreateBeach(lArc.site);
      d3_geom_voronoiBeaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      d3_geom_voronoiAttachCircle(lArc);
      d3_geom_voronoiAttachCircle(rArc);
      return;
    }
    if (!rArc) {
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      return;
    }
    d3_geom_voronoiDetachCircle(lArc);
    d3_geom_voronoiDetachCircle(rArc);
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
      x: (cy * hb - by * hc) / d + ax,
      y: (bx * hc - cx * hb) / d + ay
    };
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
  }
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
  }
  function d3_geom_voronoiCell(site) {
    this.site = site;
    this.edges = [];
  }
  d3_geom_voronoiCell.prototype.prepare = function() {
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
    while (iHalfEdge--) {
      edge = halfEdges[iHalfEdge].edge;
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
    }
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
    return halfEdges.length;
  };
  function d3_geom_voronoiCloseCells(extent) {
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
    while (iCell--) {
      cell = cells[iCell];
      if (!cell || !cell.prepare()) continue;
      halfEdges = cell.edges;
      nHalfEdges = halfEdges.length;
      iHalfEdge = 0;
      while (iHalfEdge < nHalfEdges) {
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
          } : null), cell.site, null));
          ++nHalfEdges;
        }
      }
    }
  }
  function d3_geom_voronoiHalfEdgeOrder(a, b) {
    return b.angle - a.angle;
  }
  function d3_geom_voronoiCircle() {
    d3_geom_voronoiRedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
  }
  function d3_geom_voronoiAttachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -ε2) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = cy + Math.sqrt(x * x + y * y);
    circle.cy = cy;
    arc.circle = circle;
    var before = null, node = d3_geom_voronoiCircles._;
    while (node) {
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
        if (node.L) node = node.L; else {
          before = node.P;
          break;
        }
      } else {
        if (node.R) node = node.R; else {
          before = node;
          break;
        }
      }
    }
    d3_geom_voronoiCircles.insert(before, circle);
    if (!before) d3_geom_voronoiFirstCircle = circle;
  }
  function d3_geom_voronoiDetachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
      d3_geom_voronoiCircles.remove(circle);
      d3_geom_voronoiCirclePool.push(circle);
      d3_geom_voronoiRedBlackNode(circle);
      arc.circle = null;
    }
  }
  function d3_geom_voronoiClipEdges(extent) {
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
    while (i--) {
      e = edges[i];
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
        e.a = e.b = null;
        edges.splice(i, 1);
      }
    }
  }
  function d3_geom_voronoiConnectEdge(edge, extent) {
    var vb = edge.b;
    if (vb) return true;
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) {
        if (!va) va = {
          x: fx,
          y: y0
        }; else if (va.y >= y1) return;
        vb = {
          x: fx,
          y: y1
        };
      } else {
        if (!va) va = {
          x: fx,
          y: y1
        }; else if (va.y < y0) return;
        vb = {
          x: fx,
          y: y0
        };
      }
    } else {
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) {
        if (lx > rx) {
          if (!va) va = {
            x: (y0 - fb) / fm,
            y: y0
          }; else if (va.y >= y1) return;
          vb = {
            x: (y1 - fb) / fm,
            y: y1
          };
        } else {
          if (!va) va = {
            x: (y1 - fb) / fm,
            y: y1
          }; else if (va.y < y0) return;
          vb = {
            x: (y0 - fb) / fm,
            y: y0
          };
        }
      } else {
        if (ly < ry) {
          if (!va) va = {
            x: x0,
            y: fm * x0 + fb
          }; else if (va.x >= x1) return;
          vb = {
            x: x1,
            y: fm * x1 + fb
          };
        } else {
          if (!va) va = {
            x: x1,
            y: fm * x1 + fb
          }; else if (va.x < x0) return;
          vb = {
            x: x0,
            y: fm * x0 + fb
          };
        }
      }
    }
    edge.a = va;
    edge.b = vb;
    return true;
  }
  function d3_geom_voronoiEdge(lSite, rSite) {
    this.l = lSite;
    this.r = rSite;
    this.a = this.b = null;
  }
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, rSite);
    d3_geom_voronoiEdges.push(edge);
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
    return edge;
  }
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, null);
    edge.a = va;
    edge.b = vb;
    d3_geom_voronoiEdges.push(edge);
    return edge;
  }
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
    if (!edge.a && !edge.b) {
      edge.a = vertex;
      edge.l = lSite;
      edge.r = rSite;
    } else if (edge.l === rSite) {
      edge.b = vertex;
    } else {
      edge.a = vertex;
    }
  }
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
    var va = edge.a, vb = edge.b;
    this.edge = edge;
    this.site = lSite;
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
  }
  d3_geom_voronoiHalfEdge.prototype = {
    start: function() {
      return this.edge.l === this.site ? this.edge.a : this.edge.b;
    },
    end: function() {
      return this.edge.l === this.site ? this.edge.b : this.edge.a;
    }
  };
  function d3_geom_voronoiRedBlackTree() {
    this._ = null;
  }
  function d3_geom_voronoiRedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
  }
  d3_geom_voronoiRedBlackTree.prototype = {
    insert: function(after, node) {
      var parent, grandpa, uncle;
      if (after) {
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) {
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        } else {
          after.R = node;
        }
        parent = after;
      } else if (this._) {
        after = d3_geom_voronoiRedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      } else {
        node.P = node.N = null;
        this._ = node;
        parent = null;
      }
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
      after = node;
      while (parent && parent.C) {
        grandpa = parent.U;
        if (parent === grandpa.L) {
          uncle = grandpa.R;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.R) {
              d3_geom_voronoiRedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
          }
        } else {
          uncle = grandpa.L;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.L) {
              d3_geom_voronoiRedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
          }
        }
        parent = after.U;
      }
      this._.C = false;
    },
    remove: function(node) {
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
      if (parent) {
        if (parent.L === node) parent.L = next; else parent.R = next;
      } else {
        this._ = next;
      }
      if (left && right) {
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) {
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        } else {
          next.U = parent;
          parent = next;
          node = next.R;
        }
      } else {
        red = node.C;
        node = next;
      }
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) {
        node.C = false;
        return;
      }
      do {
        if (node === this._) break;
        if (node === parent.L) {
          sibling = parent.R;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            sibling = parent.R;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.R || !sibling.R.C) {
              sibling.L.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateRight(this, sibling);
              sibling = parent.R;
            }
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            node = this._;
            break;
          }
        } else {
          sibling = parent.L;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            sibling = parent.L;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.L || !sibling.L.C) {
              sibling.R.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            }
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            node = this._;
            break;
          }
        }
        sibling.C = true;
        node = parent;
        parent = parent.U;
      } while (!node.C);
      if (node) node.C = false;
    }
  };
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  }
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  }
  function d3_geom_voronoiRedBlackFirst(node) {
    while (node.L) node = node.L;
    return node;
  }
  function d3_geom_voronoi(sites, bbox) {
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
    d3_geom_voronoiEdges = [];
    d3_geom_voronoiCells = new Array(sites.length);
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
    while (true) {
      circle = d3_geom_voronoiFirstCircle;
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
        if (site.x !== x0 || site.y !== y0) {
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
          d3_geom_voronoiAddBeach(site);
          x0 = site.x, y0 = site.y;
        }
        site = sites.pop();
      } else if (circle) {
        d3_geom_voronoiRemoveBeach(circle.arc);
      } else {
        break;
      }
    }
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
    var diagram = {
      cells: d3_geom_voronoiCells,
      edges: d3_geom_voronoiEdges
    };
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
    return diagram;
  }
  function d3_geom_voronoiVertexOrder(a, b) {
    return b.y - a.y || b.x - a.x;
  }
  d3.geom.voronoi = function(points) {
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
    if (points) return voronoi(points);
    function voronoi(data) {
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
          var s = e.start();
          return [ s.x, s.y ];
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
        polygon.point = data[i];
      });
      return polygons;
    }
    function sites(data) {
      return data.map(function(d, i) {
        return {
          x: Math.round(fx(d, i) / ε) * ε,
          y: Math.round(fy(d, i) / ε) * ε,
          i: i
        };
      });
    }
    voronoi.links = function(data) {
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
        return edge.l && edge.r;
      }).map(function(edge) {
        return {
          source: data[edge.l.i],
          target: data[edge.r.i]
        };
      });
    };
    voronoi.triangles = function(data) {
      var triangles = [];
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
        while (++j < m) {
          e0 = e1;
          s0 = s1;
          e1 = edges[j].edge;
          s1 = e1.l === site ? e1.r : e1.l;
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
          }
        }
      });
      return triangles;
    };
    voronoi.x = function(_) {
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    return voronoi;
  };
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
  function d3_geom_voronoiTriangleArea(a, b, c) {
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
  }
  d3.geom.delaunay = function(vertices) {
    return d3.geom.voronoi().triangles(vertices);
  };
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = xm; else x2 = xm;
        if (below) y1 = ym; else y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      root.find = function(point) {
        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
    var minDistance2 = Infinity, closestPoint;
    (function find(node, x1, y1, x2, y2) {
      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
      if (point = node.point) {
        var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
        if (distance2 < minDistance2) {
          var distance = Math.sqrt(minDistance2 = distance2);
          x0 = x - distance, y0 = y - distance;
          x3 = x + distance, y3 = y + distance;
          closestPoint = point;
        }
      }
      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
        if (node = children[i & 3]) switch (i & 3) {
         case 0:
          find(node, x1, y1, xm, ym);
          break;

         case 1:
          find(node, xm, y1, x2, ym);
          break;

         case 2:
          find(node, x1, ym, xm, y2);
          break;

         case 3:
          find(node, xm, ym, x2, y2);
          break;
        }
      }
    })(root, x0, y0, x3, y3);
    return closestPoint;
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    a = +a, b = +b;
    return function(t) {
      return a * (1 - t) + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm; else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({
          i: i,
          x: d3_interpolateNumber(am, bm)
        });
      }
      bi = d3_interpolate_numberB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
      return b(t) + "";
    }) : function() {
      return b;
    } : (b = q.length, function(t) {
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    });
  }
  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransformPop(s) {
    return s.length ? s.pop() + "," : "";
  }
  function d3_interpolateTranslate(ta, tb, s, q) {
    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
      var i = s.push("translate(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    }
  }
  function d3_interpolateRotate(ra, rb, s, q) {
    if (ra !== rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");
    }
  }
  function d3_interpolateSkew(wa, wb, s, q) {
    if (wa !== wb) {
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");
    }
  }
  function d3_interpolateScale(ka, kb, s, q) {
    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
      var i = s.push(d3_interpolateTransformPop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] !== 1 || kb[1] !== 1) {
      s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");
    }
  }
  function d3_interpolateTransform(a, b) {
    var s = [], q = [];
    a = d3.transform(a), b = d3.transform(b);
    d3_interpolateTranslate(a.translate, b.translate, s, q);
    d3_interpolateRotate(a.rotate, b.rotate, s, q);
    d3_interpolateSkew(a.skew, b.skew, s, q);
    d3_interpolateScale(a.scale, b.scale, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: groupSums[di]
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), timer, size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
          if (dw * dw / theta2 < dn) {
            if (dn < chargeDistance2) {
              var k = quad.charge / dn;
              node.px -= dx * k;
              node.py -= dy * k;
            }
            return true;
          }
          if (quad.point && dn && dn < chargeDistance2) {
            var k = quad.pointCharge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        timer = null;
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.chargeDistance = function(x) {
      if (!arguments.length) return Math.sqrt(chargeDistance2);
      chargeDistance2 = x * x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return Math.sqrt(theta2);
      theta2 = x * x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) {
          alpha = x;
        } else {
          timer.c = null, timer.t = NaN, timer = null;
          event.end({
            type: "end",
            alpha: alpha = 0
          });
        }
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        timer = d3_timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, l = candidates.length, x;
        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function hierarchy(root) {
      var stack = [ root ], nodes = [], node;
      root.depth = 0;
      while ((node = stack.pop()) != null) {
        nodes.push(node);
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
          var n, childs, child;
          while (--n >= 0) {
            stack.push(child = childs[n]);
            child.parent = node;
            child.depth = node.depth + 1;
          }
          if (value) node.value = 0;
          node.children = childs;
        } else {
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
          delete node.children;
        }
      }
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var childs, parent;
        if (sort && (childs = node.children)) childs.sort(sort);
        if (value && (parent = node.parent)) parent.value += node.value;
      });
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      if (value) {
        d3_layout_hierarchyVisitBefore(root, function(node) {
          if (node.children) node.value = 0;
        });
        d3_layout_hierarchyVisitAfter(root, function(node) {
          var parent;
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
          if (parent = node.parent) parent.value += node.value;
        });
      }
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyVisitBefore(node, callback) {
    var nodes = [ node ];
    while ((node = nodes.pop()) != null) {
      callback(node);
      if ((children = node.children) && (n = children.length)) {
        var n, children;
        while (--n >= 0) nodes.push(children[n]);
      }
    }
  }
  function d3_layout_hierarchyVisitAfter(node, callback) {
    var nodes = [ node ], nodes2 = [];
    while ((node = nodes.pop()) != null) {
      nodes2.push(node);
      if ((children = node.children) && (n = children.length)) {
        var i = -1, n, children;
        while (++i < n) nodes.push(children[i]);
      }
    }
    while ((node = nodes2.pop()) != null) {
      callback(node);
    }
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
    function pie(data) {
      var n = data.length, values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), sum = d3.sum(values), k = sum ? (da - n * pa) / sum : 0, index = d3.range(n), arcs = [], v;
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      index.forEach(function(i) {
        arcs[i] = {
          data: data[i],
          value: v = values[i],
          startAngle: a,
          endAngle: a += v * k + pa,
          padAngle: p
        };
      });
      return arcs;
    }
    pie.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return pie;
    };
    pie.sort = function(_) {
      if (!arguments.length) return sort;
      sort = _;
      return pie;
    };
    pie.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      return pie;
    };
    pie.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      return pie;
    };
    pie.padAngle = function(_) {
      if (!arguments.length) return padAngle;
      padAngle = _;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      if (!(n = data.length)) return data;
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var m = series[0].length, n, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
      d3_layout_hierarchyVisitBefore(root1, secondWalk);
      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
        var left = root0, right = root0, bottom = root0;
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
      return nodes;
    }
    function wrapTree(root0) {
      var root1 = {
        A: null,
        children: [ root0 ]
      }, queue = [ root1 ], node1;
      while ((node1 = queue.pop()) != null) {
        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
          queue.push((children[i] = child = {
            _: children[i],
            parent: node1,
            children: (child = children[i].children) && child.slice() || [],
            A: null,
            a: null,
            z: 0,
            m: 0,
            c: 0,
            s: 0,
            t: null,
            i: i
          }).a = child);
        }
      }
      return root1.children[0];
    }
    function firstWalk(v) {
      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
      if (children.length) {
        d3_layout_treeShift(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        } else {
          v.z = midpoint;
        }
      } else if (w) {
        v.z = w.z + separation(v._, w._);
      }
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    }
    function secondWalk(v) {
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    }
    function apportion(v, w, ancestor) {
      if (w) {
        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
          vom = d3_layout_treeLeft(vom);
          vop = d3_layout_treeRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) {
            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          }
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        }
        if (vim && !d3_layout_treeRight(vop)) {
          vop.t = vim;
          vop.m += sim - sop;
        }
        if (vip && !d3_layout_treeLeft(vom)) {
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        }
      }
      return ancestor;
    }
    function sizeNode(node) {
      node.x *= size[0];
      node.y = node.depth * size[1];
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null ? sizeNode : null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) == null ? null : sizeNode;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(v) {
    var children = v.children;
    return children.length ? children[0] : v.t;
  }
  function d3_layout_treeRight(v) {
    var children = v.children, n;
    return (n = children.length) ? children[n - 1] : v.t;
  }
  function d3_layout_treeMove(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  }
  function d3_layout_treeShift(v) {
    var shift = 0, change = 0, children = v.children, i = children.length, w;
    while (--i >= 0) {
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    }
  }
  function d3_layout_treeAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = root.y = 0;
      if (root.value) root.dx = size[0], root.dy = size[1]; else root.dx = root.dy = 0;
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    bates: function(m) {
      var random = d3.random.irwinHall(m);
      return function() {
        return random() / m;
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    return domain;
  }
  function d3_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var range = d3_scale_linearTickRange(domain, m);
    if (format) {
      var match = d3_format_re.exec(format);
      match.shift();
      if (match[8] === "s") {
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
        match[8] = "f";
        format = d3.format(match.join(""));
        return function(d) {
          return format(prefix.scale(d)) + prefix.symbol;
        };
      }
      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
      format = match.join("");
    } else {
      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
    }
    return d3.format(format);
  }
  var d3_scale_linearFormatSignificant = {
    s: 1,
    g: 1,
    p: 1,
    r: 1,
    e: 1
  };
  function d3_scale_linearPrecision(value) {
    return -Math.floor(Math.log(value) / Math.LN10 + .01);
  }
  function d3_scale_linearFormatPrecision(type, range) {
    var p = d3_scale_linearPrecision(range[2]);
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
      if (isFinite(j - i)) {
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(1, base * n / scale.ticks().length);
      return function(d) {
        var i = d / pow(Math.round(log(d)));
        if (i * base < base - .5) i *= base;
        return i <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
      0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundPoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
      0) : (stop - start) / (domain.length - 1 + padding) | 0;
      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {
        t: "rangeRoundPoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg = {};
  function d3_zero() {
    return 0;
  }
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
    function arc() {
      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
        if (!cw) p1 *= -1;
        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
      }
      if (r1) {
        x0 = r1 * Math.cos(a0 + p1);
        y0 = r1 * Math.sin(a0 + p1);
        x1 = r1 * Math.cos(a1 - p1);
        y1 = r1 * Math.sin(a1 - p1);
        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
          var h1 = (a0 + a1) / 2;
          x0 = r1 * Math.cos(h1);
          y0 = r1 * Math.sin(h1);
          x1 = y1 = null;
        }
      } else {
        x0 = y0 = 0;
      }
      if (r0) {
        x2 = r0 * Math.cos(a1 - p0);
        y2 = r0 * Math.sin(a1 - p0);
        x3 = r0 * Math.cos(a0 + p0);
        y3 = r0 * Math.sin(a0 + p0);
        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
          var h0 = (a0 + a1) / 2;
          x2 = r0 * Math.cos(h0);
          y2 = r0 * Math.sin(h0);
          x3 = y3 = null;
        }
      } else {
        x2 = y2 = 0;
      }
      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
        cr = r0 < r1 ^ cw ? 0 : 1;
        var rc1 = rc, rc0 = rc;
        if (da < π) {
          var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
        }
        if (x1 != null) {
          var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
          if (rc === rc1) {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
          } else {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
          }
        } else {
          path.push("M", x0, ",", y0);
        }
        if (x3 != null) {
          var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
          if (rc === rc0) {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          } else {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          }
        } else {
          path.push("L", x2, ",", y2);
        }
      } else {
        path.push("M", x0, ",", y0);
        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
        path.push("L", x2, ",", y2);
        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
      }
      path.push("Z");
      return path.join("");
    }
    function circleSegment(r1, cw) {
      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.cornerRadius = function(v) {
      if (!arguments.length) return cornerRadius;
      cornerRadius = d3_functor(v);
      return arc;
    };
    arc.padRadius = function(v) {
      if (!arguments.length) return padRadius;
      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.padAngle = function(v) {
      if (!arguments.length) return padAngle;
      padAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcAuto = "auto";
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function d3_svg_arcPadAngle(d) {
    return d && d.padAngle;
  }
  function d3_svg_arcSweep(x0, y0, x1, y1) {
    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
  }
  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
  }
  function d3_svg_line(projection) {
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.length > 1 ? points.join("L") : points + "Z";
  }
  function d3_svg_lineLinearClosed(points) {
    return points.join("L") + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] - halfπ;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  d3_selectionPrototype.transition = function(name) {
    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_selectionPrototype.interrupt = function(name) {
    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
  };
  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
  function d3_selection_interruptNS(ns) {
    return function() {
      var lock, activeId, active;
      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
        active.timer.c = null;
        active.timer.t = NaN;
        if (--lock.count) delete lock[activeId]; else delete this[ns];
        lock.active += .5;
        active.event && active.event.interrupt.call(this, this.__data__, active.index);
      }
    };
  }
  function d3_transition(groups, ns, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.namespace = ns;
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection, name) {
    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node[ns][id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.namespace, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node[ns][id].tween.remove(name);
    } : function(node) {
      node[ns][id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id, ns = groups.namespace;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node[ns][id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    var ns = this.namespace;
    return this.each("end.transition", function() {
      var p;
      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node[ns][id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].delay;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node[ns][id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].duration;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node[ns][id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      try {
        d3_transitionInheritId = id;
        d3_selection_each(this, function(node, i, j) {
          d3_transitionInherit = node[ns][id];
          type.call(node, node.__data__, i, j);
        });
      } finally {
        d3_transitionInherit = inherit;
        d3_transitionInheritId = inheritId;
      }
    } else {
      d3_selection_each(this, function(node) {
        var transition = node[ns][id];
        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = node[ns][id0];
          d3_transitionNode(node, i, ns, id1, {
            time: transition.time,
            ease: transition.ease,
            delay: transition.delay + transition.duration,
            duration: transition.duration
          });
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id1);
  };
  function d3_transitionNamespace(name) {
    return name == null ? "__transition__" : "__transition_" + name + "__";
  }
  function d3_transitionNode(node, i, ns, id, inherit) {
    var lock = node[ns] || (node[ns] = {
      active: 0,
      count: 0
    }), transition = lock[id], time, timer, duration, ease, tweens;
    function schedule(elapsed) {
      var delay = transition.delay;
      timer.t = delay + time;
      if (delay <= elapsed) return start(elapsed - delay);
      timer.c = start;
    }
    function start(elapsed) {
      var activeId = lock.active, active = lock[activeId];
      if (active) {
        active.timer.c = null;
        active.timer.t = NaN;
        --lock.count;
        delete lock[activeId];
        active.event && active.event.interrupt.call(node, node.__data__, active.index);
      }
      for (var cancelId in lock) {
        if (+cancelId < id) {
          var cancel = lock[cancelId];
          cancel.timer.c = null;
          cancel.timer.t = NaN;
          --lock.count;
          delete lock[cancelId];
        }
      }
      timer.c = tick;
      d3_timer(function() {
        if (timer.c && tick(elapsed || 1)) {
          timer.c = null;
          timer.t = NaN;
        }
        return 1;
      }, 0, time);
      lock.active = id;
      transition.event && transition.event.start.call(node, node.__data__, i);
      tweens = [];
      transition.tween.forEach(function(key, value) {
        if (value = value.call(node, node.__data__, i)) {
          tweens.push(value);
        }
      });
      ease = transition.ease;
      duration = transition.duration;
    }
    function tick(elapsed) {
      var t = elapsed / duration, e = ease(t), n = tweens.length;
      while (n > 0) {
        tweens[--n].call(node, e);
      }
      if (t >= 1) {
        transition.event && transition.event.end.call(node, node.__data__, i);
        if (--lock.count) delete lock[id]; else delete node[ns];
        return 1;
      }
    }
    if (!transition) {
      time = inherit.time;
      timer = d3_timer(schedule, 0, time);
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        timer: timer,
        delay: inherit.delay,
        duration: inherit.duration,
        ease: inherit.ease,
        index: i
      };
      inherit = null;
      ++lock.count;
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
        if (orient === "bottom" || orient === "top") {
          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
        } else {
          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
        }
        lineEnter.attr(y2, sign * innerTickSize);
        textEnter.attr(y1, sign * tickSpacing);
        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
        if (scale1.rangeBand) {
          var x = scale1, dx = x.rangeBand() / 2;
          scale0 = scale1 = function(d) {
            return x(d) + dx;
          };
        } else if (scale0.rangeBand) {
          scale0 = scale1;
        } else {
          tickExit.call(tickTransform, scale1, scale0);
        }
        tickEnter.call(tickTransform, scale0, scale1);
        tickUpdate.call(tickTransform, scale1, scale1);
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = d3_array(arguments);
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x) {
      var n = arguments.length;
      if (!n) return innerTickSize;
      innerTickSize = +x;
      outerTickSize = +arguments[n - 1];
      return axis;
    };
    axis.innerTickSize = function(x) {
      if (!arguments.length) return innerTickSize;
      innerTickSize = +x;
      return axis;
    };
    axis.outerTickSize = function(x) {
      if (!arguments.length) return outerTickSize;
      outerTickSize = +x;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function() {
      return arguments.length && axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x0, x1) {
    selection.attr("transform", function(d) {
      var v0 = x0(d);
      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y0, y1) {
    selection.attr("transform", function(d) {
      var v0 = y0(d);
      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
    });
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
    function brush(g) {
      g.each(function() {
        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        var background = g.selectAll(".background").data([ 0 ]);
        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
        var resize = g.selectAll(".resize").data(resizes, d3_identity);
        resize.exit().remove();
        resize.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        resize.style("display", brush.empty() ? "none" : null);
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
        if (x) {
          range = d3_scaleRange(x);
          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
          redrawX(gUpdate);
        }
        if (y) {
          range = d3_scaleRange(y);
          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
          redrawY(gUpdate);
        }
        redraw(gUpdate);
      });
    }
    brush.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), extent1 = {
          x: xExtent,
          y: yExtent,
          i: xExtentDomain,
          j: yExtentDomain
        }, extent0 = this.__chart__ || extent1;
        this.__chart__ = extent1;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.brush", function() {
            xExtentDomain = extent0.i;
            yExtentDomain = extent0.j;
            xExtent = extent0.x;
            yExtent = extent0.y;
            event_({
              type: "brushstart"
            });
          }).tween("brush:brush", function() {
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
            xExtentDomain = yExtentDomain = null;
            return function(t) {
              xExtent = extent1.x = xi(t);
              yExtent = extent1.y = yi(t);
              event_({
                type: "brush",
                mode: "resize"
              });
            };
          }).each("end.brush", function() {
            xExtentDomain = extent1.i;
            yExtentDomain = extent1.j;
            event_({
              type: "brush",
              mode: "resize"
            });
            event_({
              type: "brushend"
            });
          });
        } else {
          event_({
            type: "brushstart"
          });
          event_({
            type: "brush",
            mode: "resize"
          });
          event_({
            type: "brushend"
          });
        }
      });
    };
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", xExtent[0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", yExtent[0]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset;
      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      g.interrupt().selectAll("*").interrupt();
      if (dragging) {
        origin[0] = xExtent[0] - origin[0];
        origin[1] = yExtent[0] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
        origin[0] = xExtent[ex];
        origin[1] = yExtent[ey];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= xExtent[1];
            origin[1] -= yExtent[1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += xExtent[1];
          origin[1] += yExtent[1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = d3.mouse(target), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
            origin[0] = xExtent[+(point[0] < center[0])];
            origin[1] = yExtent[+(point[1] < center[1])];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0] != min || extent[1] != max) {
          if (i) yExtentDomain = null; else xExtentDomain = null;
          extent[0] = min;
          extent[1] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        if (x) {
          if (xExtentDomain) {
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
          } else {
            x0 = xExtent[0], x1 = xExtent[1];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          if (yExtentDomain) {
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
          } else {
            y0 = yExtent[0], y1 = yExtent[1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        xExtentDomain = [ x0, x1 ];
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        yExtentDomain = [ y0, y1 ];
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
      }
      return brush;
    };
    brush.clear = function() {
      if (!brush.empty()) {
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
        xExtentDomain = yExtentDomain = null;
      }
      return brush;
    };
    brush.empty = function() {
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
  var d3_time_formatUtc = d3_time_format.utc;
  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3_time.second = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3_time.seconds = d3_time.second.range;
  d3_time.seconds.utc = d3_time.second.utc.range;
  d3_time.minute = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3_time.minutes = d3_time.minute.range;
  d3_time.minutes.utc = d3_time.minute.utc.range;
  d3_time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3_time.hours = d3_time.hour.range;
  d3_time.hours.utc = d3_time.hour.utc.range;
  d3_time.month = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3_time.months = d3_time.month.range;
  d3_time.months.utc = d3_time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    function tickMethod(extent, count) {
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
        return d / 31536e6;
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    }
    scale.nice = function(interval, skip) {
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
      if (method) interval = method[0], skip = method[1];
      function skipped(date) {
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
      }
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
        floor: function(date) {
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
          return date;
        },
        ceil: function(date) {
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
          return date;
        }
      } : interval));
    };
    scale.ticks = function(interval, skip) {
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
        range: interval
      }, skip ];
      if (method) interval = method[0], skip = method[1];
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
    return d.getMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getMinutes();
  } ], [ "%I %p", function(d) {
    return d.getHours();
  } ], [ "%a %d", function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getDate() != 1;
  } ], [ "%B", function(d) {
    return d.getMonth();
  } ], [ "%Y", d3_true ] ]);
  var d3_time_scaleMilliseconds = {
    range: function(start, stop, step) {
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
    },
    floor: d3_identity,
    ceil: d3_identity
  };
  d3_time_scaleLocalMethods.year = d3_time.year;
  d3_time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
    return d.getUTCMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getUTCSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getUTCMinutes();
  } ], [ "%I %p", function(d) {
    return d.getUTCHours();
  } ], [ "%a %d", function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getUTCDate() != 1;
  } ], [ "%B", function(d) {
    return d.getUTCMonth();
  } ], [ "%Y", d3_true ] ]);
  d3_time_scaleUtcMethods.year = d3_time.year.utc;
  d3_time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  if (typeof define === "function" && define.amd) this.d3 = d3, define(d3); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
}();
},{}],3:[function(require,module,exports){
var Tree = require('../d3-collapsible-tree.js');

var el = document.querySelector('body');

// you can also set a couple of other things like dimensions in this object
var options = {
    element: el
};

var tree = new Tree(options);

// Get some sample data
tree.getData("data/flare.json");

},{"../d3-collapsible-tree.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5ub2RlX21vZHVsZXMvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZDMtY29sbGFwc2libGUtdHJlZS5qcyIsIm5vZGVfbW9kdWxlcy9kMy9kMy5qcyIsInNyYy9leGFtcGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2oxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5mdW5jdGlvbiBUcmVlKG9wdHMpIHtcbiAgICAvL2xvYWQgaW4gYXJndW1lbnRzIGZyb20gY29uZmlnIG9iamVjdFxuICAgIHRoaXMuZWxlbWVudCA9IG9wdHMuZWxlbWVudDtcbiAgICBpZiAob3B0cy5tYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICByaWdodDogMTIwLFxuICAgICAgICAgICAgYm90dG9tOiAyMCxcbiAgICAgICAgICAgIGxlZnQ6IDEyMFxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFyZ2luID0gb3B0cy5tYXJnaW47XG4gICAgfVxuICAgIHRoaXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHQgfHwgODAwIC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tO1xuICAgIHRoaXMud2lkdGggPSBvcHRzLndpZHRoIHx8IDk2MCAtIHRoaXMubWFyZ2luLnJpZ2h0IC0gdGhpcy5tYXJnaW4ubGVmdDtcbiAgICB0aGlzLmkgPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSA3NTA7XG5cbiAgICB0aGlzLnRyZWUgPSBkMy5sYXlvdXQudHJlZSgpXG4gICAgICAgIC5zaXplKFt0aGlzLmhlaWdodCwgdGhpcy53aWR0aF0pO1xuXG4gICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KS5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0aGlzLm1hcmdpbi5sZWZ0ICsgJywnICsgdGhpcy5tYXJnaW4udG9wICsgJyknKTtcbn1cblxuVHJlZS5wcm90b3R5cGUuZGlhZ29uYWwgPSBkMy5zdmcuZGlhZ29uYWwoKVxuICAgIC5wcm9qZWN0aW9uKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIFtkLnksIGQueF07XG4gICAgfSk7XG5cblRyZWUucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy5yb290ID0gZGF0YTtcbiAgICB0aGlzLnJvb3QueDAgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgdGhpcy5yb290LnkwID0gMDtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbGxhcHNlIHRoZSB0cmVlXG4gICAgZnVuY3Rpb24gY29sbGFwc2Uobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgbm9kZS5fY2hpbGRyZW4uZm9yRWFjaChjb2xsYXBzZSk7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucm9vdC5jaGlsZHJlbi5mb3JFYWNoKGNvbGxhcHNlKTtcbiAgICB0aGlzLnVwZGF0ZSh0aGlzLnJvb3QpO1xufTtcblxuVHJlZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG5cbiAgICAgICAgX3RoaXMuc2V0RGF0YShkYXRhKTtcbiAgICB9KTtcbn07XG5cblRyZWUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUb2dnbGUgY2hpbGRyZW4gb24gY2xpY2tcbiAgICBmdW5jdGlvbiBjbGljayhkKSB7XG4gICAgICAgIGlmIChkLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBkLl9jaGlsZHJlbiA9IGQuY2hpbGRyZW47XG4gICAgICAgICAgICBkLmNoaWxkcmVuID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGQuY2hpbGRyZW4gPSBkLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIGQuX2NoaWxkcmVuID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy51cGRhdGUoZCk7XG4gICAgfVxuXG4gICAgLy8gQ29tcHV0ZSBuZXcgdHJlZSBsYXlvdXRcbiAgICB2YXIgbm9kZXMgPSB0aGlzLnRyZWUubm9kZXModGhpcy5yb290KS5yZXZlcnNlKCksXG4gICAgICAgIGxpbmtzID0gdGhpcy50cmVlLmxpbmtzKG5vZGVzKTtcblxuICAgIC8vIE5vcm1hbGl6ZSBmb3IgZml4ZWQtZGVwdGhcbiAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgZC55ID0gZC5kZXB0aCAqIDE4MDtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgbm9kZXNcbiAgICB2YXIgbm9kZSA9IHRoaXMuc3ZnLnNlbGVjdEFsbChcImcubm9kZVwiKVxuICAgICAgICAuZGF0YShub2RlcywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQuaWQgfHwgKGQuaWQgPSArK190aGlzLmkpO1xuICAgICAgICB9KTtcblxuICAgIC8vIEVudGVyIGFueSBuZXcgbm9kZXMgYXQgdGhlIHBhcmVudCdzIHByZXZpb3VzIHBvc2l0aW9uXG4gICAgdmFyIG5vZGVFbnRlciA9IG5vZGUuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbm9kZScpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgc291cmNlLnkwICsgJywnICsgc291cmNlLngwICsgJyknO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrJywgY2xpY2spO1xuXG4gICAgbm9kZUVudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLmF0dHIoJ3InLCAxZS02KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5fY2hpbGRyZW4gPyAnbGlnaHRzdGVsbGJsdWUnIDogJyNmZmYnO1xuICAgICAgICB9KTtcblxuICAgIG5vZGVFbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmNoaWxkcmVuIHx8IGQuX2NoaWxkcmVuID8gLTEwIDogMTA7XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdkeScsICcuMzVlbScpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmNoaWxkcmVuIHx8IGQuX2NoaWxkcmVuID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcbiAgICAgICAgfSlcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQubmFtZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAxZS02KTtcblxuICAgIC8vIFRyYW5zaXRpb24gbm9kZXMgdG8gdGhlaXIgbmV3IHBvc3RpdGlvblxuICAgIHZhciBub2RlVXBkYXRlID0gbm9kZS50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKHRoaXMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC55ICsgJywnICsgZC54ICsgJyknO1xuICAgICAgICB9KTtcblxuICAgIG5vZGVVcGRhdGUuc2VsZWN0KCdjaXJjbGUnKVxuICAgICAgICAuYXR0cigncicsIDQuNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQuX2NoaWxkcmVuID8gJ2xpZ2h0c3RlZWxibHVlJyA6ICcjZmZmJztcbiAgICAgICAgfSk7XG5cbiAgICBub2RlVXBkYXRlLnNlbGVjdCgndGV4dCcpXG4gICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMSk7XG5cbiAgICAvLyBUcmFuc2l0aW9uIGV4aXRpbmcgbm9kZXMgdG8gdGhlIHBhcmVudCdzIG5ldyBwb3NpdGlvbi5cbiAgICB2YXIgbm9kZUV4aXQgPSBub2RlLmV4aXQoKS50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKHRoaXMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHNvdXJjZS55ICsgXCIsXCIgKyBzb3VyY2UueCArIFwiKVwiO1xuICAgICAgICB9KVxuICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICBub2RlRXhpdC5zZWxlY3QoXCJjaXJjbGVcIilcbiAgICAgICAgLmF0dHIoXCJyXCIsIDFlLTYpO1xuXG4gICAgbm9kZUV4aXQuc2VsZWN0KFwidGV4dFwiKVxuICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMWUtNik7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGxpbmtz4oCmXG4gICAgdmFyIGxpbmsgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJwYXRoLmxpbmtcIilcbiAgICAgICAgLmRhdGEobGlua3MsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLnRhcmdldC5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBFbnRlciBhbnkgbmV3IGxpbmtzIGF0IHRoZSBwYXJlbnQncyBwcmV2aW91cyBwb3NpdGlvbi5cbiAgICBsaW5rLmVudGVyKCkuaW5zZXJ0KFwicGF0aFwiLCBcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcbiAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHZhciBvID0ge1xuICAgICAgICAgICAgICAgIHg6IHNvdXJjZS54MCxcbiAgICAgICAgICAgICAgICB5OiBzb3VyY2UueTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZGlhZ29uYWwoe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogbyxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IG9cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIC8vIFRyYW5zaXRpb24gbGlua3MgdG8gdGhlaXIgbmV3IHBvc2l0aW9uLlxuICAgIGxpbmsudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbih0aGlzLmR1cmF0aW9uKVxuICAgICAgICAuYXR0cihcImRcIiwgdGhpcy5kaWFnb25hbCk7XG5cbiAgICAvLyBUcmFuc2l0aW9uIGV4aXRpbmcgbm9kZXMgdG8gdGhlIHBhcmVudCdzIG5ldyBwb3NpdGlvbi5cbiAgICBsaW5rLmV4aXQoKS50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKHRoaXMuZHVyYXRpb24pXG4gICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgbyA9IHtcbiAgICAgICAgICAgICAgICB4OiBzb3VyY2UueCxcbiAgICAgICAgICAgICAgICB5OiBzb3VyY2UueVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5kaWFnb25hbCh7XG4gICAgICAgICAgICAgICAgc291cmNlOiBvLFxuICAgICAgICAgICAgICAgIHRhcmdldDogb1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5yZW1vdmUoKTtcblxuICAgIC8vIFN0YXNoIHRoZSBvbGQgcG9zaXRpb25zIGZvciB0cmFuc2l0aW9uLlxuICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICBkLngwID0gZC54O1xuICAgICAgICBkLnkwID0gZC55O1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlO1xuIiwiIWZ1bmN0aW9uKCkge1xuICB2YXIgZDMgPSB7XG4gICAgdmVyc2lvbjogXCIzLjUuMTdcIlxuICB9O1xuICB2YXIgZDNfYXJyYXlTbGljZSA9IFtdLnNsaWNlLCBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICByZXR1cm4gZDNfYXJyYXlTbGljZS5jYWxsKGxpc3QpO1xuICB9O1xuICB2YXIgZDNfZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50O1xuICBmdW5jdGlvbiBkM19kb2N1bWVudEVsZW1lbnQobm9kZSkge1xuICAgIHJldHVybiBub2RlICYmIChub2RlLm93bmVyRG9jdW1lbnQgfHwgbm9kZS5kb2N1bWVudCB8fCBub2RlKS5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfd2luZG93KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAmJiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyB8fCBub2RlLmRvY3VtZW50ICYmIG5vZGUgfHwgbm9kZS5kZWZhdWx0Vmlldyk7XG4gIH1cbiAgaWYgKGQzX2RvY3VtZW50KSB7XG4gICAgdHJ5IHtcbiAgICAgIGQzX2FycmF5KGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzKVswXS5ub2RlVHlwZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICAgICAgdmFyIGkgPSBsaXN0Lmxlbmd0aCwgYXJyYXkgPSBuZXcgQXJyYXkoaSk7XG4gICAgICAgIHdoaWxlIChpLS0pIGFycmF5W2ldID0gbGlzdFtpXTtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKCFEYXRlLm5vdykgRGF0ZS5ub3cgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gIH07XG4gIGlmIChkM19kb2N1bWVudCkge1xuICAgIHRyeSB7XG4gICAgICBkM19kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpLnN0eWxlLnNldFByb3BlcnR5KFwib3BhY2l0eVwiLCAwLCBcIlwiKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdmFyIGQzX2VsZW1lbnRfcHJvdG90eXBlID0gdGhpcy5FbGVtZW50LnByb3RvdHlwZSwgZDNfZWxlbWVudF9zZXRBdHRyaWJ1dGUgPSBkM19lbGVtZW50X3Byb3RvdHlwZS5zZXRBdHRyaWJ1dGUsIGQzX2VsZW1lbnRfc2V0QXR0cmlidXRlTlMgPSBkM19lbGVtZW50X3Byb3RvdHlwZS5zZXRBdHRyaWJ1dGVOUywgZDNfc3R5bGVfcHJvdG90eXBlID0gdGhpcy5DU1NTdHlsZURlY2xhcmF0aW9uLnByb3RvdHlwZSwgZDNfc3R5bGVfc2V0UHJvcGVydHkgPSBkM19zdHlsZV9wcm90b3R5cGUuc2V0UHJvcGVydHk7XG4gICAgICBkM19lbGVtZW50X3Byb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgICBkM19lbGVtZW50X3NldEF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUsIHZhbHVlICsgXCJcIik7XG4gICAgICB9O1xuICAgICAgZDNfZWxlbWVudF9wcm90b3R5cGUuc2V0QXR0cmlidXRlTlMgPSBmdW5jdGlvbihzcGFjZSwgbG9jYWwsIHZhbHVlKSB7XG4gICAgICAgIGQzX2VsZW1lbnRfc2V0QXR0cmlidXRlTlMuY2FsbCh0aGlzLCBzcGFjZSwgbG9jYWwsIHZhbHVlICsgXCJcIik7XG4gICAgICB9O1xuICAgICAgZDNfc3R5bGVfcHJvdG90eXBlLnNldFByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gICAgICAgIGQzX3N0eWxlX3NldFByb3BlcnR5LmNhbGwodGhpcywgbmFtZSwgdmFsdWUgKyBcIlwiLCBwcmlvcml0eSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBkMy5hc2NlbmRpbmcgPSBkM19hc2NlbmRpbmc7XG4gIGZ1bmN0aW9uIGQzX2FzY2VuZGluZyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xuICB9XG4gIGQzLmRlc2NlbmRpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIgPCBhID8gLTEgOiBiID4gYSA/IDEgOiBiID49IGEgPyAwIDogTmFOO1xuICB9O1xuICBkMy5taW4gPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBpID0gLTEsIG4gPSBhcnJheS5sZW5ndGgsIGEsIGI7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID49IGIpIHtcbiAgICAgICAgYSA9IGI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGEgPiBiKSBhID0gYjtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGIgPj0gYikge1xuICAgICAgICBhID0gYjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpICE9IG51bGwgJiYgYSA+IGIpIGEgPSBiO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfTtcbiAgZDMubWF4ID0gZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gYXJyYXkubGVuZ3RoLCBhLCBiO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwgJiYgYiA+PSBiKSB7XG4gICAgICAgIGEgPSBiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID4gYSkgYSA9IGI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCAmJiBiID49IGIpIHtcbiAgICAgICAgYSA9IGI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGIgPiBhKSBhID0gYjtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH07XG4gIGQzLmV4dGVudCA9IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgdmFyIGkgPSAtMSwgbiA9IGFycmF5Lmxlbmd0aCwgYSwgYiwgYztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikge1xuICAgICAgICBhID0gYyA9IGI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhID4gYikgYSA9IGI7XG4gICAgICAgIGlmIChjIDwgYikgYyA9IGI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCAmJiBiID49IGIpIHtcbiAgICAgICAgYSA9IGMgPSBiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoYSA+IGIpIGEgPSBiO1xuICAgICAgICBpZiAoYyA8IGIpIGMgPSBiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWyBhLCBjIF07XG4gIH07XG4gIGZ1bmN0aW9uIGQzX251bWJlcih4KSB7XG4gICAgcmV0dXJuIHggPT09IG51bGwgPyBOYU4gOiAreDtcbiAgfVxuICBmdW5jdGlvbiBkM19udW1lcmljKHgpIHtcbiAgICByZXR1cm4gIWlzTmFOKHgpO1xuICB9XG4gIGQzLnN1bSA9IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgdmFyIHMgPSAwLCBuID0gYXJyYXkubGVuZ3RoLCBhLCBpID0gLTE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoZDNfbnVtZXJpYyhhID0gK2FycmF5W2ldKSkgcyArPSBhO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKGQzX251bWVyaWMoYSA9ICtmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpIHMgKz0gYTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH07XG4gIGQzLm1lYW4gPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBzID0gMCwgbiA9IGFycmF5Lmxlbmd0aCwgYSwgaSA9IC0xLCBqID0gbjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmIChkM19udW1lcmljKGEgPSBkM19udW1iZXIoYXJyYXlbaV0pKSkgcyArPSBhOyBlbHNlIC0tajtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmIChkM19udW1lcmljKGEgPSBkM19udW1iZXIoZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpKSkgcyArPSBhOyBlbHNlIC0tajtcbiAgICB9XG4gICAgaWYgKGopIHJldHVybiBzIC8gajtcbiAgfTtcbiAgZDMucXVhbnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIHApIHtcbiAgICB2YXIgSCA9ICh2YWx1ZXMubGVuZ3RoIC0gMSkgKiBwICsgMSwgaCA9IE1hdGguZmxvb3IoSCksIHYgPSArdmFsdWVzW2ggLSAxXSwgZSA9IEggLSBoO1xuICAgIHJldHVybiBlID8gdiArIGUgKiAodmFsdWVzW2hdIC0gdikgOiB2O1xuICB9O1xuICBkMy5tZWRpYW4gPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBudW1iZXJzID0gW10sIG4gPSBhcnJheS5sZW5ndGgsIGEsIGkgPSAtMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmIChkM19udW1lcmljKGEgPSBkM19udW1iZXIoYXJyYXlbaV0pKSkgbnVtYmVycy5wdXNoKGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKGQzX251bWVyaWMoYSA9IGQzX251bWJlcihmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpKSBudW1iZXJzLnB1c2goYSk7XG4gICAgfVxuICAgIGlmIChudW1iZXJzLmxlbmd0aCkgcmV0dXJuIGQzLnF1YW50aWxlKG51bWJlcnMuc29ydChkM19hc2NlbmRpbmcpLCAuNSk7XG4gIH07XG4gIGQzLnZhcmlhbmNlID0gZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICB2YXIgbiA9IGFycmF5Lmxlbmd0aCwgbSA9IDAsIGEsIGQsIHMgPSAwLCBpID0gLTEsIGogPSAwO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBpZiAoZDNfbnVtZXJpYyhhID0gZDNfbnVtYmVyKGFycmF5W2ldKSkpIHtcbiAgICAgICAgICBkID0gYSAtIG07XG4gICAgICAgICAgbSArPSBkIC8gKytqO1xuICAgICAgICAgIHMgKz0gZCAqIChhIC0gbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKGQzX251bWVyaWMoYSA9IGQzX251bWJlcihmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpKSB7XG4gICAgICAgICAgZCA9IGEgLSBtO1xuICAgICAgICAgIG0gKz0gZCAvICsrajtcbiAgICAgICAgICBzICs9IGQgKiAoYSAtIG0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gMSkgcmV0dXJuIHMgLyAoaiAtIDEpO1xuICB9O1xuICBkMy5kZXZpYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IGQzLnZhcmlhbmNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHYgPyBNYXRoLnNxcnQodikgOiB2O1xuICB9O1xuICBmdW5jdGlvbiBkM19iaXNlY3Rvcihjb21wYXJlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGxvID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSBoaSA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPCAwKSBsbyA9IG1pZCArIDE7IGVsc2UgaGkgPSBtaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvO1xuICAgICAgfSxcbiAgICAgIHJpZ2h0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBsbyA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgNCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpID4gMCkgaGkgPSBtaWQ7IGVsc2UgbG8gPSBtaWQgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsbztcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHZhciBkM19iaXNlY3QgPSBkM19iaXNlY3RvcihkM19hc2NlbmRpbmcpO1xuICBkMy5iaXNlY3RMZWZ0ID0gZDNfYmlzZWN0LmxlZnQ7XG4gIGQzLmJpc2VjdCA9IGQzLmJpc2VjdFJpZ2h0ID0gZDNfYmlzZWN0LnJpZ2h0O1xuICBkMy5iaXNlY3RvciA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gZDNfYmlzZWN0b3IoZi5sZW5ndGggPT09IDEgPyBmdW5jdGlvbihkLCB4KSB7XG4gICAgICByZXR1cm4gZDNfYXNjZW5kaW5nKGYoZCksIHgpO1xuICAgIH0gOiBmKTtcbiAgfTtcbiAgZDMuc2h1ZmZsZSA9IGZ1bmN0aW9uKGFycmF5LCBpMCwgaTEpIHtcbiAgICBpZiAoKG0gPSBhcmd1bWVudHMubGVuZ3RoKSA8IDMpIHtcbiAgICAgIGkxID0gYXJyYXkubGVuZ3RoO1xuICAgICAgaWYgKG0gPCAyKSBpMCA9IDA7XG4gICAgfVxuICAgIHZhciBtID0gaTEgLSBpMCwgdCwgaTtcbiAgICB3aGlsZSAobSkge1xuICAgICAgaSA9IE1hdGgucmFuZG9tKCkgKiBtLS0gfCAwO1xuICAgICAgdCA9IGFycmF5W20gKyBpMF0sIGFycmF5W20gKyBpMF0gPSBhcnJheVtpICsgaTBdLCBhcnJheVtpICsgaTBdID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xuICBkMy5wZXJtdXRlID0gZnVuY3Rpb24oYXJyYXksIGluZGV4ZXMpIHtcbiAgICB2YXIgaSA9IGluZGV4ZXMubGVuZ3RoLCBwZXJtdXRlcyA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSBwZXJtdXRlc1tpXSA9IGFycmF5W2luZGV4ZXNbaV1dO1xuICAgIHJldHVybiBwZXJtdXRlcztcbiAgfTtcbiAgZDMucGFpcnMgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aCAtIDEsIHAwLCBwMSA9IGFycmF5WzBdLCBwYWlycyA9IG5ldyBBcnJheShuIDwgMCA/IDAgOiBuKTtcbiAgICB3aGlsZSAoaSA8IG4pIHBhaXJzW2ldID0gWyBwMCA9IHAxLCBwMSA9IGFycmF5WysraV0gXTtcbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG4gIGQzLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKG1hdHJpeCkge1xuICAgIGlmICghKG4gPSBtYXRyaXgubGVuZ3RoKSkgcmV0dXJuIFtdO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbSA9IGQzLm1pbihtYXRyaXgsIGQzX3RyYW5zcG9zZUxlbmd0aCksIHRyYW5zcG9zZSA9IG5ldyBBcnJheShtKTsgKytpIDwgbTsgKSB7XG4gICAgICBmb3IgKHZhciBqID0gLTEsIG4sIHJvdyA9IHRyYW5zcG9zZVtpXSA9IG5ldyBBcnJheShuKTsgKytqIDwgbjsgKSB7XG4gICAgICAgIHJvd1tqXSA9IG1hdHJpeFtqXVtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zcG9zZTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfdHJhbnNwb3NlTGVuZ3RoKGQpIHtcbiAgICByZXR1cm4gZC5sZW5ndGg7XG4gIH1cbiAgZDMuemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzLnRyYW5zcG9zZShhcmd1bWVudHMpO1xuICB9O1xuICBkMy5rZXlzID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcbiAgZDMudmFsdWVzID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBtYXApIHZhbHVlcy5wdXNoKG1hcFtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuICBkMy5lbnRyaWVzID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSBlbnRyaWVzLnB1c2goe1xuICAgICAga2V5OiBrZXksXG4gICAgICB2YWx1ZTogbWFwW2tleV1cbiAgICB9KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfTtcbiAgZDMubWVyZ2UgPSBmdW5jdGlvbihhcnJheXMpIHtcbiAgICB2YXIgbiA9IGFycmF5cy5sZW5ndGgsIG0sIGkgPSAtMSwgaiA9IDAsIG1lcmdlZCwgYXJyYXk7XG4gICAgd2hpbGUgKCsraSA8IG4pIGogKz0gYXJyYXlzW2ldLmxlbmd0aDtcbiAgICBtZXJnZWQgPSBuZXcgQXJyYXkoaik7XG4gICAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgICBhcnJheSA9IGFycmF5c1tuXTtcbiAgICAgIG0gPSBhcnJheS5sZW5ndGg7XG4gICAgICB3aGlsZSAoLS1tID49IDApIHtcbiAgICAgICAgbWVyZ2VkWy0tal0gPSBhcnJheVttXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfTtcbiAgdmFyIGFicyA9IE1hdGguYWJzO1xuICBkMy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcihcImluZmluaXRlIHJhbmdlXCIpO1xuICAgIHZhciByYW5nZSA9IFtdLCBrID0gZDNfcmFuZ2VfaW50ZWdlclNjYWxlKGFicyhzdGVwKSksIGkgPSAtMSwgajtcbiAgICBzdGFydCAqPSBrLCBzdG9wICo9IGssIHN0ZXAgKj0gaztcbiAgICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGogLyBrKTsgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqIC8gayk7XG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuICBmdW5jdGlvbiBkM19yYW5nZV9pbnRlZ2VyU2NhbGUoeCkge1xuICAgIHZhciBrID0gMTtcbiAgICB3aGlsZSAoeCAqIGsgJSAxKSBrICo9IDEwO1xuICAgIHJldHVybiBrO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2NsYXNzKGN0b3IsIHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNba2V5XSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBkMy5tYXAgPSBmdW5jdGlvbihvYmplY3QsIGYpIHtcbiAgICB2YXIgbWFwID0gbmV3IGQzX01hcCgpO1xuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBkM19NYXApIHtcbiAgICAgIG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICB2YXIgaSA9IC0xLCBuID0gb2JqZWN0Lmxlbmd0aCwgbztcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB3aGlsZSAoKytpIDwgbikgbWFwLnNldChpLCBvYmplY3RbaV0pOyBlbHNlIHdoaWxlICgrK2kgPCBuKSBtYXAuc2V0KGYuY2FsbChvYmplY3QsIG8gPSBvYmplY3RbaV0sIGkpLCBvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkgbWFwLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfTWFwKCkge1xuICAgIHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbiAgdmFyIGQzX21hcF9wcm90byA9IFwiX19wcm90b19fXCIsIGQzX21hcF96ZXJvID0gXCJcXHgwMFwiO1xuICBkM19jbGFzcyhkM19NYXAsIHtcbiAgICBoYXM6IGQzX21hcF9oYXMsXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9bZDNfbWFwX2VzY2FwZShrZXkpXTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX1tkM19tYXBfZXNjYXBlKGtleSldID0gdmFsdWU7XG4gICAgfSxcbiAgICByZW1vdmU6IGQzX21hcF9yZW1vdmUsXG4gICAga2V5czogZDNfbWFwX2tleXMsXG4gICAgdmFsdWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl8pIHZhbHVlcy5wdXNoKHRoaXMuX1trZXldKTtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSxcbiAgICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fKSBlbnRyaWVzLnB1c2goe1xuICAgICAgICBrZXk6IGQzX21hcF91bmVzY2FwZShrZXkpLFxuICAgICAgICB2YWx1ZTogdGhpcy5fW2tleV1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgfSxcbiAgICBzaXplOiBkM19tYXBfc2l6ZSxcbiAgICBlbXB0eTogZDNfbWFwX2VtcHR5LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGYpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl8pIGYuY2FsbCh0aGlzLCBkM19tYXBfdW5lc2NhcGUoa2V5KSwgdGhpcy5fW2tleV0pO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGQzX21hcF9lc2NhcGUoa2V5KSB7XG4gICAgcmV0dXJuIChrZXkgKz0gXCJcIikgPT09IGQzX21hcF9wcm90byB8fCBrZXlbMF0gPT09IGQzX21hcF96ZXJvID8gZDNfbWFwX3plcm8gKyBrZXkgOiBrZXk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbWFwX3VuZXNjYXBlKGtleSkge1xuICAgIHJldHVybiAoa2V5ICs9IFwiXCIpWzBdID09PSBkM19tYXBfemVybyA/IGtleS5zbGljZSgxKSA6IGtleTtcbiAgfVxuICBmdW5jdGlvbiBkM19tYXBfaGFzKGtleSkge1xuICAgIHJldHVybiBkM19tYXBfZXNjYXBlKGtleSkgaW4gdGhpcy5fO1xuICB9XG4gIGZ1bmN0aW9uIGQzX21hcF9yZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIChrZXkgPSBkM19tYXBfZXNjYXBlKGtleSkpIGluIHRoaXMuXyAmJiBkZWxldGUgdGhpcy5fW2tleV07XG4gIH1cbiAgZnVuY3Rpb24gZDNfbWFwX2tleXMoKSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fKSBrZXlzLnB1c2goZDNfbWFwX3VuZXNjYXBlKGtleSkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9XG4gIGZ1bmN0aW9uIGQzX21hcF9zaXplKCkge1xuICAgIHZhciBzaXplID0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fKSArK3NpemU7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbWFwX2VtcHR5KCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl8pIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBkMy5uZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5lc3QgPSB7fSwga2V5cyA9IFtdLCBzb3J0S2V5cyA9IFtdLCBzb3J0VmFsdWVzLCByb2xsdXA7XG4gICAgZnVuY3Rpb24gbWFwKG1hcFR5cGUsIGFycmF5LCBkZXB0aCkge1xuICAgICAgaWYgKGRlcHRoID49IGtleXMubGVuZ3RoKSByZXR1cm4gcm9sbHVwID8gcm9sbHVwLmNhbGwobmVzdCwgYXJyYXkpIDogc29ydFZhbHVlcyA/IGFycmF5LnNvcnQoc29ydFZhbHVlcykgOiBhcnJheTtcbiAgICAgIHZhciBpID0gLTEsIG4gPSBhcnJheS5sZW5ndGgsIGtleSA9IGtleXNbZGVwdGgrK10sIGtleVZhbHVlLCBvYmplY3QsIHNldHRlciwgdmFsdWVzQnlLZXkgPSBuZXcgZDNfTWFwKCksIHZhbHVlcztcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgPSB2YWx1ZXNCeUtleS5nZXQoa2V5VmFsdWUgPSBrZXkob2JqZWN0ID0gYXJyYXlbaV0pKSkge1xuICAgICAgICAgIHZhbHVlcy5wdXNoKG9iamVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVzQnlLZXkuc2V0KGtleVZhbHVlLCBbIG9iamVjdCBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1hcFR5cGUpIHtcbiAgICAgICAgb2JqZWN0ID0gbWFwVHlwZSgpO1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihrZXlWYWx1ZSwgdmFsdWVzKSB7XG4gICAgICAgICAgb2JqZWN0LnNldChrZXlWYWx1ZSwgbWFwKG1hcFR5cGUsIHZhbHVlcywgZGVwdGgpKTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdCA9IHt9O1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihrZXlWYWx1ZSwgdmFsdWVzKSB7XG4gICAgICAgICAgb2JqZWN0W2tleVZhbHVlXSA9IG1hcChtYXBUeXBlLCB2YWx1ZXMsIGRlcHRoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHZhbHVlc0J5S2V5LmZvckVhY2goc2V0dGVyKTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVudHJpZXMobWFwLCBkZXB0aCkge1xuICAgICAgaWYgKGRlcHRoID49IGtleXMubGVuZ3RoKSByZXR1cm4gbWFwO1xuICAgICAgdmFyIGFycmF5ID0gW10sIHNvcnRLZXkgPSBzb3J0S2V5c1tkZXB0aCsrXTtcbiAgICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwga2V5TWFwKSB7XG4gICAgICAgIGFycmF5LnB1c2goe1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlczogZW50cmllcyhrZXlNYXAsIGRlcHRoKVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNvcnRLZXkgPyBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHNvcnRLZXkoYS5rZXksIGIua2V5KTtcbiAgICAgIH0pIDogYXJyYXk7XG4gICAgfVxuICAgIG5lc3QubWFwID0gZnVuY3Rpb24oYXJyYXksIG1hcFR5cGUpIHtcbiAgICAgIHJldHVybiBtYXAobWFwVHlwZSwgYXJyYXksIDApO1xuICAgIH07XG4gICAgbmVzdC5lbnRyaWVzID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzKG1hcChkMy5tYXAsIGFycmF5LCAwKSwgMCk7XG4gICAgfTtcbiAgICBuZXN0LmtleSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgIGtleXMucHVzaChkKTtcbiAgICAgIHJldHVybiBuZXN0O1xuICAgIH07XG4gICAgbmVzdC5zb3J0S2V5cyA9IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICBzb3J0S2V5c1trZXlzLmxlbmd0aCAtIDFdID0gb3JkZXI7XG4gICAgICByZXR1cm4gbmVzdDtcbiAgICB9O1xuICAgIG5lc3Quc29ydFZhbHVlcyA9IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICBzb3J0VmFsdWVzID0gb3JkZXI7XG4gICAgICByZXR1cm4gbmVzdDtcbiAgICB9O1xuICAgIG5lc3Qucm9sbHVwID0gZnVuY3Rpb24oZikge1xuICAgICAgcm9sbHVwID0gZjtcbiAgICAgIHJldHVybiBuZXN0O1xuICAgIH07XG4gICAgcmV0dXJuIG5lc3Q7XG4gIH07XG4gIGQzLnNldCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHNldCA9IG5ldyBkM19TZXQoKTtcbiAgICBpZiAoYXJyYXkpIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSBzZXQuYWRkKGFycmF5W2ldKTtcbiAgICByZXR1cm4gc2V0O1xuICB9O1xuICBmdW5jdGlvbiBkM19TZXQoKSB7XG4gICAgdGhpcy5fID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfVxuICBkM19jbGFzcyhkM19TZXQsIHtcbiAgICBoYXM6IGQzX21hcF9oYXMsXG4gICAgYWRkOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHRoaXMuX1tkM19tYXBfZXNjYXBlKGtleSArPSBcIlwiKV0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9LFxuICAgIHJlbW92ZTogZDNfbWFwX3JlbW92ZSxcbiAgICB2YWx1ZXM6IGQzX21hcF9rZXlzLFxuICAgIHNpemU6IGQzX21hcF9zaXplLFxuICAgIGVtcHR5OiBkM19tYXBfZW1wdHksXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oZikge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuXykgZi5jYWxsKHRoaXMsIGQzX21hcF91bmVzY2FwZShrZXkpKTtcbiAgICB9XG4gIH0pO1xuICBkMy5iZWhhdmlvciA9IHt9O1xuICBmdW5jdGlvbiBkM19pZGVudGl0eShkKSB7XG4gICAgcmV0dXJuIGQ7XG4gIH1cbiAgZDMucmViaW5kID0gZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB2YXIgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoLCBtZXRob2Q7XG4gICAgd2hpbGUgKCsraSA8IG4pIHRhcmdldFttZXRob2QgPSBhcmd1bWVudHNbaV1dID0gZDNfcmViaW5kKHRhcmdldCwgc291cmNlLCBzb3VyY2VbbWV0aG9kXSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfcmViaW5kKHRhcmdldCwgc291cmNlLCBtZXRob2QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBtZXRob2QuYXBwbHkoc291cmNlLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBzb3VyY2UgPyB0YXJnZXQgOiB2YWx1ZTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX3ZlbmRvclN5bWJvbChvYmplY3QsIG5hbWUpIHtcbiAgICBpZiAobmFtZSBpbiBvYmplY3QpIHJldHVybiBuYW1lO1xuICAgIG5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGQzX3ZlbmRvclByZWZpeGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIHByZWZpeE5hbWUgPSBkM192ZW5kb3JQcmVmaXhlc1tpXSArIG5hbWU7XG4gICAgICBpZiAocHJlZml4TmFtZSBpbiBvYmplY3QpIHJldHVybiBwcmVmaXhOYW1lO1xuICAgIH1cbiAgfVxuICB2YXIgZDNfdmVuZG9yUHJlZml4ZXMgPSBbIFwid2Via2l0XCIsIFwibXNcIiwgXCJtb3pcIiwgXCJNb3pcIiwgXCJvXCIsIFwiT1wiIF07XG4gIGZ1bmN0aW9uIGQzX25vb3AoKSB7fVxuICBkMy5kaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCgpLCBpID0gLTEsIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfZGlzcGF0Y2goKSB7fVxuICBkM19kaXNwYXRjaC5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIHZhciBpID0gdHlwZS5pbmRleE9mKFwiLlwiKSwgbmFtZSA9IFwiXCI7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgbmFtZSA9IHR5cGUuc2xpY2UoaSArIDEpO1xuICAgICAgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSk7XG4gICAgfVxuICAgIGlmICh0eXBlKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyB0aGlzW3R5cGVdLm9uKG5hbWUpIDogdGhpc1t0eXBlXS5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSBmb3IgKHR5cGUgaW4gdGhpcykge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhpc1t0eXBlXS5vbihuYW1lLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpIHtcbiAgICB2YXIgbGlzdGVuZXJzID0gW10sIGxpc3RlbmVyQnlOYW1lID0gbmV3IGQzX01hcCgpO1xuICAgIGZ1bmN0aW9uIGV2ZW50KCkge1xuICAgICAgdmFyIHogPSBsaXN0ZW5lcnMsIGkgPSAtMSwgbiA9IHoubGVuZ3RoLCBsO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmIChsID0geltpXS5vbikgbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoO1xuICAgIH1cbiAgICBldmVudC5vbiA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbCA9IGxpc3RlbmVyQnlOYW1lLmdldChuYW1lKSwgaTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGwgJiYgbC5vbjtcbiAgICAgIGlmIChsKSB7XG4gICAgICAgIGwub24gPSBudWxsO1xuICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuc2xpY2UoMCwgaSA9IGxpc3RlbmVycy5pbmRleE9mKGwpKS5jb25jYXQobGlzdGVuZXJzLnNsaWNlKGkgKyAxKSk7XG4gICAgICAgIGxpc3RlbmVyQnlOYW1lLnJlbW92ZShuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChsaXN0ZW5lcikgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXJCeU5hbWUuc2V0KG5hbWUsIHtcbiAgICAgICAgb246IGxpc3RlbmVyXG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gZGlzcGF0Y2g7XG4gICAgfTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cbiAgZDMuZXZlbnQgPSBudWxsO1xuICBmdW5jdGlvbiBkM19ldmVudFByZXZlbnREZWZhdWx0KCkge1xuICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZXZlbnRTb3VyY2UoKSB7XG4gICAgdmFyIGUgPSBkMy5ldmVudCwgcztcbiAgICB3aGlsZSAocyA9IGUuc291cmNlRXZlbnQpIGUgPSBzO1xuICAgIHJldHVybiBlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2V2ZW50RGlzcGF0Y2godGFyZ2V0KSB7XG4gICAgdmFyIGRpc3BhdGNoID0gbmV3IGQzX2Rpc3BhdGNoKCksIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcbiAgICBkaXNwYXRjaC5vZiA9IGZ1bmN0aW9uKHRoaXosIGFyZ3VtZW50eikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGUwID0gZTEuc291cmNlRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgICAgICBlMS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgZDMuZXZlbnQgPSBlMTtcbiAgICAgICAgICBkaXNwYXRjaFtlMS50eXBlXS5hcHBseSh0aGl6LCBhcmd1bWVudHopO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGQzLmV2ZW50ID0gZTA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH1cbiAgZDMucmVxdW90ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKGQzX3JlcXVvdGVfcmUsIFwiXFxcXCQmXCIpO1xuICB9O1xuICB2YXIgZDNfcmVxdW90ZV9yZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcbiAgdmFyIGQzX3N1YmNsYXNzID0ge30uX19wcm90b19fID8gZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICB9IDogZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm90b3R5cGUpIG9iamVjdFtwcm9wZXJ0eV0gPSBwcm90b3R5cGVbcHJvcGVydHldO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb24oZ3JvdXBzKSB7XG4gICAgZDNfc3ViY2xhc3MoZ3JvdXBzLCBkM19zZWxlY3Rpb25Qcm90b3R5cGUpO1xuICAgIHJldHVybiBncm91cHM7XG4gIH1cbiAgdmFyIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHtcbiAgICByZXR1cm4gbi5xdWVyeVNlbGVjdG9yKHMpO1xuICB9LCBkM19zZWxlY3RBbGwgPSBmdW5jdGlvbihzLCBuKSB7XG4gICAgcmV0dXJuIG4ucXVlcnlTZWxlY3RvckFsbChzKTtcbiAgfSwgZDNfc2VsZWN0TWF0Y2hlcyA9IGZ1bmN0aW9uKG4sIHMpIHtcbiAgICB2YXIgZDNfc2VsZWN0TWF0Y2hlciA9IG4ubWF0Y2hlcyB8fCBuW2QzX3ZlbmRvclN5bWJvbChuLCBcIm1hdGNoZXNTZWxlY3RvclwiKV07XG4gICAgZDNfc2VsZWN0TWF0Y2hlcyA9IGZ1bmN0aW9uKG4sIHMpIHtcbiAgICAgIHJldHVybiBkM19zZWxlY3RNYXRjaGVyLmNhbGwobiwgcyk7XG4gICAgfTtcbiAgICByZXR1cm4gZDNfc2VsZWN0TWF0Y2hlcyhuLCBzKTtcbiAgfTtcbiAgaWYgKHR5cGVvZiBTaXp6bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHtcbiAgICAgIHJldHVybiBTaXp6bGUocywgbilbMF0gfHwgbnVsbDtcbiAgICB9O1xuICAgIGQzX3NlbGVjdEFsbCA9IFNpenpsZTtcbiAgICBkM19zZWxlY3RNYXRjaGVzID0gU2l6emxlLm1hdGNoZXNTZWxlY3RvcjtcbiAgfVxuICBkMy5zZWxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDMuc2VsZWN0KGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gIH07XG4gIHZhciBkM19zZWxlY3Rpb25Qcm90b3R5cGUgPSBkMy5zZWxlY3Rpb24ucHJvdG90eXBlID0gW107XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgIHZhciBzdWJncm91cHMgPSBbXSwgc3ViZ3JvdXAsIHN1Ym5vZGUsIGdyb3VwLCBub2RlO1xuICAgIHNlbGVjdG9yID0gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTsgKSB7XG4gICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOyApIHtcbiAgICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICAgIHN1Ymdyb3VwLnB1c2goc3Vibm9kZSA9IHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpO1xuICAgICAgICAgIGlmIChzdWJub2RlICYmIFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWJncm91cC5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19zZWxlY3Qoc2VsZWN0b3IsIHRoaXMpO1xuICAgIH07XG4gIH1cbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgdmFyIHN1Ymdyb3VwcyA9IFtdLCBzdWJncm91cCwgbm9kZTtcbiAgICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07ICkge1xuICAgICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47ICkge1xuICAgICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBkM19hcnJheShzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSk7XG4gICAgICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgPyBzZWxlY3RvciA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGQzX3NlbGVjdEFsbChzZWxlY3RvciwgdGhpcyk7XG4gICAgfTtcbiAgfVxuICB2YXIgZDNfbnNYaHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuICB2YXIgZDNfbnNQcmVmaXggPSB7XG4gICAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgeGh0bWw6IGQzX25zWGh0bWwsXG4gICAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICAgIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIixcbiAgICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG4gIH07XG4gIGQzLm5zID0ge1xuICAgIHByZWZpeDogZDNfbnNQcmVmaXgsXG4gICAgcXVhbGlmeTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGkgPSBuYW1lLmluZGV4T2YoXCI6XCIpLCBwcmVmaXggPSBuYW1lO1xuICAgICAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICAgICAgcmV0dXJuIGQzX25zUHJlZml4Lmhhc093blByb3BlcnR5KHByZWZpeCkgPyB7XG4gICAgICAgIHNwYWNlOiBkM19uc1ByZWZpeFtwcmVmaXhdLFxuICAgICAgICBsb2NhbDogbmFtZVxuICAgICAgfSA6IG5hbWU7XG4gICAgfVxuICB9O1xuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgICAgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSk7XG4gICAgICAgIHJldHVybiBuYW1lLmxvY2FsID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKSA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgfVxuICAgICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkpO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuICAgIGZ1bmN0aW9uIGF0dHJOdWxsKCkge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dHJOdWxsTlMoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhdHRyQ29uc3RhbnQoKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKCkge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhdHRyRnVuY3Rpb25OUygpIHtcbiAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7IGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBuYW1lLmxvY2FsID8gYXR0ck51bGxOUyA6IGF0dHJOdWxsIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24gOiBuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfY29sbGFwc2Uocykge1xuICAgIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgfVxuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuY2xhc3NlZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKSwgbiA9IChuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkpLmxlbmd0aCwgaSA9IC0xO1xuICAgICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIXZhbHVlLmNvbnRhaW5zKG5hbWVbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZVtpXSkudGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGQzLnJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkge1xuICAgIHJldHVybiAobmFtZSArIFwiXCIpLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkubWFwKGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZSk7XG4gICAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcbiAgICBmdW5jdGlvbiBjbGFzc2VkQ29uc3RhbnQoKSB7XG4gICAgICB2YXIgaSA9IC0xO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgdmFsdWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IC0xLCB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjbGFzc2VkRnVuY3Rpb24gOiBjbGFzc2VkQ29uc3RhbnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKG5hbWUpIHtcbiAgICB2YXIgcmUgPSBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpO1xuICAgIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgICAgaWYgKGMgPSBub2RlLmNsYXNzTGlzdCkgcmV0dXJuIHZhbHVlID8gYy5hZGQobmFtZSkgOiBjLnJlbW92ZShuYW1lKTtcbiAgICAgIHZhciBjID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmICghcmUudGVzdChjKSkgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjICsgXCIgXCIgKyBuYW1lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMucmVwbGFjZShyZSwgXCIgXCIpKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKG4gPCAzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaWYgKG4gPCAyKSB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIGZvciAocHJpb3JpdHkgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShwcmlvcml0eSwgbmFtZVtwcmlvcml0eV0sIHZhbHVlKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKG4gPCAyKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICAgIHJldHVybiBkM193aW5kb3cobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuICAgICAgfVxuICAgICAgcHJpb3JpdHkgPSBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICAgIGZ1bmN0aW9uIHN0eWxlTnVsbCgpIHtcbiAgICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQoKSB7XG4gICAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpOyBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IHN0eWxlTnVsbCA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc3R5bGVGdW5jdGlvbiA6IHN0eWxlQ29uc3RhbnQ7XG4gIH1cbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLnByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHRoaXMubm9kZSgpW25hbWVdO1xuICAgICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3Byb3BlcnR5KHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuICAgIGZ1bmN0aW9uIHByb3BlcnR5TnVsbCgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KCkge1xuICAgICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07IGVsc2UgdGhpc1tuYW1lXSA9IHg7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gcHJvcGVydHlOdWxsIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBwcm9wZXJ0eUZ1bmN0aW9uIDogcHJvcGVydHlDb25zdGFudDtcbiAgfVxuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUudGV4dCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgICB9IDogdmFsdWUgPT0gbnVsbCA/IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgfSA6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH0pIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG4gIH07XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5odG1sID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgICB9IDogdmFsdWUgPT0gbnVsbCA/IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH0gOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgfSkgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG4gIH07XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKG5hbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpIHtcbiAgICBmdW5jdGlvbiBjcmVhdGUoKSB7XG4gICAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsIG5hbWVzcGFjZSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgICAgcmV0dXJuIG5hbWVzcGFjZSA9PT0gZDNfbnNYaHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSBkM19uc1hodG1sID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIG5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVOUygpIHtcbiAgICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiAobmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSkpLmxvY2FsID8gY3JlYXRlTlMgOiBjcmVhdGU7XG4gIH1cbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICAgIG5hbWUgPSBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKTtcbiAgICBiZWZvcmUgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3IoYmVmb3JlKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBiZWZvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgICB9KTtcbiAgfTtcbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uUmVtb3ZlKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uUmVtb3ZlKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHZhciBpID0gLTEsIG4gPSB0aGlzLmxlbmd0aCwgZ3JvdXAsIG5vZGU7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICB2YWx1ZSA9IG5ldyBBcnJheShuID0gKGdyb3VwID0gdGhpc1swXSkubGVuZ3RoKTtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgICB2YWx1ZVtpXSA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYmluZChncm91cCwgZ3JvdXBEYXRhKSB7XG4gICAgICB2YXIgaSwgbiA9IGdyb3VwLmxlbmd0aCwgbSA9IGdyb3VwRGF0YS5sZW5ndGgsIG4wID0gTWF0aC5taW4obiwgbSksIHVwZGF0ZU5vZGVzID0gbmV3IEFycmF5KG0pLCBlbnRlck5vZGVzID0gbmV3IEFycmF5KG0pLCBleGl0Tm9kZXMgPSBuZXcgQXJyYXkobiksIG5vZGUsIG5vZGVEYXRhO1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICB2YXIgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwKCksIGtleVZhbHVlcyA9IG5ldyBBcnJheShuKSwga2V5VmFsdWU7XG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOyApIHtcbiAgICAgICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSkpKSB7XG4gICAgICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBtOyApIHtcbiAgICAgICAgICBpZiAoIShub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlID0ga2V5LmNhbGwoZ3JvdXBEYXRhLCBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXSwgaSkpKSkge1xuICAgICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChub2RlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgICBub2RlLl9fZGF0YV9fID0gbm9kZURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47ICkge1xuICAgICAgICAgIGlmIChpIGluIGtleVZhbHVlcyAmJiBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjA7ICkge1xuICAgICAgICAgIG5vZGUgPSBncm91cFtpXTtcbiAgICAgICAgICBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXTtcbiAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICAgICAgdXBkYXRlTm9kZXNbaV0gPSBub2RlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKG5vZGVEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7aSA8IG07ICsraSkge1xuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZ3JvdXBEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKDtpIDwgbjsgKytpKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVudGVyTm9kZXMudXBkYXRlID0gdXBkYXRlTm9kZXM7XG4gICAgICBlbnRlck5vZGVzLnBhcmVudE5vZGUgPSB1cGRhdGVOb2Rlcy5wYXJlbnROb2RlID0gZXhpdE5vZGVzLnBhcmVudE5vZGUgPSBncm91cC5wYXJlbnROb2RlO1xuICAgICAgZW50ZXIucHVzaChlbnRlck5vZGVzKTtcbiAgICAgIHVwZGF0ZS5wdXNoKHVwZGF0ZU5vZGVzKTtcbiAgICAgIGV4aXQucHVzaChleGl0Tm9kZXMpO1xuICAgIH1cbiAgICB2YXIgZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXIoW10pLCB1cGRhdGUgPSBkM19zZWxlY3Rpb24oW10pLCBleGl0ID0gZDNfc2VsZWN0aW9uKFtdKTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZS5jYWxsKGdyb3VwLCBncm91cC5wYXJlbnROb2RlLl9fZGF0YV9fLCBpKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZS5lbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGVudGVyO1xuICAgIH07XG4gICAgdXBkYXRlLmV4aXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGl0O1xuICAgIH07XG4gICAgcmV0dXJuIHVwZGF0ZTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX19kYXRhX186IGRhdGFcbiAgICB9O1xuICB9XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXR1bSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpIDogdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIpO1xuICB9O1xuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIHN1Ymdyb3VwcyA9IFtdLCBzdWJncm91cCwgZ3JvdXAsIG5vZGU7XG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZDNfc2VsZWN0aW9uX2ZpbHRlcihmaWx0ZXIpO1xuICAgIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IChncm91cCA9IHRoaXNbal0pLnBhcmVudE5vZGU7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgZmlsdGVyLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpIHtcbiAgICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ZpbHRlcihzZWxlY3Rvcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19zZWxlY3RNYXRjaGVzKHRoaXMsIHNlbGVjdG9yKTtcbiAgICB9O1xuICB9XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5vcmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOyApIHtcbiAgICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7ICkge1xuICAgICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgY29tcGFyYXRvciA9IGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOyApIHRoaXNbal0uc29ydChjb21wYXJhdG9yKTtcbiAgICByZXR1cm4gdGhpcy5vcmRlcigpO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IoY29tcGFyYXRvcikge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgY29tcGFyYXRvciA9IGQzX2FzY2VuZGluZztcbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICAgIH07XG4gIH1cbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHJldHVybiBkM19zZWxlY3Rpb25fZWFjaCh0aGlzLCBmdW5jdGlvbihub2RlLCBpLCBqKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopO1xuICAgIH0pO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb25fZWFjaChncm91cHMsIGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2sobm9kZSwgaSwgaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cHM7XG4gIH1cbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBhcmdzID0gZDNfYXJyYXkoYXJndW1lbnRzKTtcbiAgICBjYWxsYmFjay5hcHBseShhcmdzWzBdID0gdGhpcywgYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5ub2RlKCk7XG4gIH07XG4gIGQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuID0gMDtcbiAgICBkM19zZWxlY3Rpb25fZWFjaCh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgICsrbjtcbiAgICB9KTtcbiAgICByZXR1cm4gbjtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VudGVyKHNlbGVjdGlvbikge1xuICAgIGQzX3N1YmNsYXNzKHNlbGVjdGlvbiwgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlKTtcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xuICB9XG4gIHZhciBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUgPSBbXTtcbiAgZDMuc2VsZWN0aW9uLmVudGVyID0gZDNfc2VsZWN0aW9uX2VudGVyO1xuICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlID0gZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlO1xuICBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuYXBwZW5kID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZDtcbiAgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuICBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUubm9kZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlO1xuICBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuY2FsbCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5jYWxsO1xuICBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2l6ZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplO1xuICBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICB2YXIgc3ViZ3JvdXBzID0gW10sIHN1Ymdyb3VwLCBzdWJub2RlLCB1cGdyb3VwLCBncm91cCwgbm9kZTtcbiAgICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTsgKSB7XG4gICAgICB1cGdyb3VwID0gKGdyb3VwID0gdGhpc1tqXSkudXBkYXRlO1xuICAgICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgICBzdWJncm91cC5wYXJlbnROb2RlID0gZ3JvdXAucGFyZW50Tm9kZTtcbiAgICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjsgKSB7XG4gICAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgICBzdWJncm91cC5wdXNoKHVwZ3JvdXBbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuY2FsbChncm91cC5wYXJlbnROb2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgICAgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG4gIH07XG4gIGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIGJlZm9yZSA9IGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZSh0aGlzKTtcbiAgICByZXR1cm4gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydC5jYWxsKHRoaXMsIG5hbWUsIGJlZm9yZSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZShlbnRlcikge1xuICAgIHZhciBpMCwgajA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGopIHtcbiAgICAgIHZhciBncm91cCA9IGVudGVyW2pdLnVwZGF0ZSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTtcbiAgICAgIGlmIChqICE9IGowKSBqMCA9IGosIGkwID0gMDtcbiAgICAgIGlmIChpID49IGkwKSBpMCA9IGkgKyAxO1xuICAgICAgd2hpbGUgKCEobm9kZSA9IGdyb3VwW2kwXSkgJiYgKytpMCA8IG4pIDtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gIH1cbiAgZDMuc2VsZWN0ID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBncm91cDtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGdyb3VwID0gWyBkM19zZWxlY3Qobm9kZSwgZDNfZG9jdW1lbnQpIF07XG4gICAgICBncm91cC5wYXJlbnROb2RlID0gZDNfZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBncm91cCA9IFsgbm9kZSBdO1xuICAgICAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudChub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX3NlbGVjdGlvbihbIGdyb3VwIF0pO1xuICB9O1xuICBkMy5zZWxlY3RBbGwgPSBmdW5jdGlvbihub2Rlcykge1xuICAgIHZhciBncm91cDtcbiAgICBpZiAodHlwZW9mIG5vZGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBncm91cCA9IGQzX2FycmF5KGQzX3NlbGVjdEFsbChub2RlcywgZDNfZG9jdW1lbnQpKTtcbiAgICAgIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyb3VwID0gZDNfYXJyYXkobm9kZXMpO1xuICAgICAgZ3JvdXAucGFyZW50Tm9kZSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBkM19zZWxlY3Rpb24oWyBncm91cCBdKTtcbiAgfTtcbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKG4gPCAzKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaWYgKG4gPCAyKSBsaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNhcHR1cmUgaW4gdHlwZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbihjYXB0dXJlLCB0eXBlW2NhcHR1cmVdLCBsaXN0ZW5lcikpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmIChuIDwgMikgcmV0dXJuIChuID0gdGhpcy5ub2RlKClbXCJfX29uXCIgKyB0eXBlXSkgJiYgbi5fO1xuICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkpO1xuICB9O1xuICBmdW5jdGlvbiBkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgICB2YXIgbmFtZSA9IFwiX19vblwiICsgdHlwZSwgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksIHdyYXAgPSBkM19zZWxlY3Rpb25fb25MaXN0ZW5lcjtcbiAgICBpZiAoaSA+IDApIHR5cGUgPSB0eXBlLnNsaWNlKDAsIGkpO1xuICAgIHZhciBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLmdldCh0eXBlKTtcbiAgICBpZiAoZmlsdGVyKSB0eXBlID0gZmlsdGVyLCB3cmFwID0gZDNfc2VsZWN0aW9uX29uRmlsdGVyO1xuICAgIGZ1bmN0aW9uIG9uUmVtb3ZlKCkge1xuICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgaWYgKGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGwsIGwuJCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbkFkZCgpIHtcbiAgICAgIHZhciBsID0gd3JhcChsaXN0ZW5lciwgZDNfYXJyYXkoYXJndW1lbnRzKSk7XG4gICAgICBvblJlbW92ZS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXNbbmFtZV0gPSBsLCBsLiQgPSBjYXB0dXJlKTtcbiAgICAgIGwuXyA9IGxpc3RlbmVyO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiXl9fb24oW14uXSspXCIgKyBkMy5yZXF1b3RlKHR5cGUpICsgXCIkXCIpLCBtYXRjaDtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICBpZiAobWF0Y2ggPSBuYW1lLm1hdGNoKHJlKSkge1xuICAgICAgICAgIHZhciBsID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuJCk7XG4gICAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGkgPyBsaXN0ZW5lciA/IG9uQWRkIDogb25SZW1vdmUgOiBsaXN0ZW5lciA/IGQzX25vb3AgOiByZW1vdmVBbGw7XG4gIH1cbiAgdmFyIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMgPSBkMy5tYXAoe1xuICAgIG1vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsXG4gICAgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwiXG4gIH0pO1xuICBpZiAoZDNfZG9jdW1lbnQpIHtcbiAgICBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgaWYgKFwib25cIiArIGsgaW4gZDNfZG9jdW1lbnQpIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMucmVtb3ZlKGspO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIG8gPSBkMy5ldmVudDtcbiAgICAgIGQzLmV2ZW50ID0gZTtcbiAgICAgIGFyZ3VtZW50elswXSA9IHRoaXMuX19kYXRhX187XG4gICAgICB0cnkge1xuICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHopO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZDMuZXZlbnQgPSBvO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uRmlsdGVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgICB2YXIgbCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopO1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcywgcmVsYXRlZCA9IGUucmVsYXRlZFRhcmdldDtcbiAgICAgIGlmICghcmVsYXRlZCB8fCByZWxhdGVkICE9PSB0YXJnZXQgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldCkgJiA4KSkge1xuICAgICAgICBsLmNhbGwodGFyZ2V0LCBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHZhciBkM19ldmVudF9kcmFnU2VsZWN0LCBkM19ldmVudF9kcmFnSWQgPSAwO1xuICBmdW5jdGlvbiBkM19ldmVudF9kcmFnU3VwcHJlc3Mobm9kZSkge1xuICAgIHZhciBuYW1lID0gXCIuZHJhZ3N1cHByZXNzLVwiICsgKytkM19ldmVudF9kcmFnSWQsIGNsaWNrID0gXCJjbGlja1wiICsgbmFtZSwgdyA9IGQzLnNlbGVjdChkM193aW5kb3cobm9kZSkpLm9uKFwidG91Y2htb3ZlXCIgKyBuYW1lLCBkM19ldmVudFByZXZlbnREZWZhdWx0KS5vbihcImRyYWdzdGFydFwiICsgbmFtZSwgZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCkub24oXCJzZWxlY3RzdGFydFwiICsgbmFtZSwgZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCk7XG4gICAgaWYgKGQzX2V2ZW50X2RyYWdTZWxlY3QgPT0gbnVsbCkge1xuICAgICAgZDNfZXZlbnRfZHJhZ1NlbGVjdCA9IFwib25zZWxlY3RzdGFydFwiIGluIG5vZGUgPyBmYWxzZSA6IGQzX3ZlbmRvclN5bWJvbChub2RlLnN0eWxlLCBcInVzZXJTZWxlY3RcIik7XG4gICAgfVxuICAgIGlmIChkM19ldmVudF9kcmFnU2VsZWN0KSB7XG4gICAgICB2YXIgc3R5bGUgPSBkM19kb2N1bWVudEVsZW1lbnQobm9kZSkuc3R5bGUsIHNlbGVjdCA9IHN0eWxlW2QzX2V2ZW50X2RyYWdTZWxlY3RdO1xuICAgICAgc3R5bGVbZDNfZXZlbnRfZHJhZ1NlbGVjdF0gPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN1cHByZXNzQ2xpY2spIHtcbiAgICAgIHcub24obmFtZSwgbnVsbCk7XG4gICAgICBpZiAoZDNfZXZlbnRfZHJhZ1NlbGVjdCkgc3R5bGVbZDNfZXZlbnRfZHJhZ1NlbGVjdF0gPSBzZWxlY3Q7XG4gICAgICBpZiAoc3VwcHJlc3NDbGljaykge1xuICAgICAgICB2YXIgb2ZmID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdy5vbihjbGljaywgbnVsbCk7XG4gICAgICAgIH07XG4gICAgICAgIHcub24oY2xpY2ssIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvZmYoKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIHNldFRpbWVvdXQob2ZmLCAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGQzLm1vdXNlID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGQzX21vdXNlUG9pbnQoY29udGFpbmVyLCBkM19ldmVudFNvdXJjZSgpKTtcbiAgfTtcbiAgdmFyIGQzX21vdXNlX2J1ZzQ0MDgzID0gdGhpcy5uYXZpZ2F0b3IgJiYgL1dlYktpdC8udGVzdCh0aGlzLm5hdmlnYXRvci51c2VyQWdlbnQpID8gLTEgOiAwO1xuICBmdW5jdGlvbiBkM19tb3VzZVBvaW50KGNvbnRhaW5lciwgZSkge1xuICAgIGlmIChlLmNoYW5nZWRUb3VjaGVzKSBlID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICB2YXIgc3ZnID0gY29udGFpbmVyLm93bmVyU1ZHRWxlbWVudCB8fCBjb250YWluZXI7XG4gICAgaWYgKHN2Zy5jcmVhdGVTVkdQb2ludCkge1xuICAgICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgICBpZiAoZDNfbW91c2VfYnVnNDQwODMgPCAwKSB7XG4gICAgICAgIHZhciB3aW5kb3cgPSBkM193aW5kb3coY29udGFpbmVyKTtcbiAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxYIHx8IHdpbmRvdy5zY3JvbGxZKSB7XG4gICAgICAgICAgc3ZnID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJzdmdcIikuc3R5bGUoe1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIlxuICAgICAgICAgIH0sIFwiaW1wb3J0YW50XCIpO1xuICAgICAgICAgIHZhciBjdG0gPSBzdmdbMF1bMF0uZ2V0U2NyZWVuQ1RNKCk7XG4gICAgICAgICAgZDNfbW91c2VfYnVnNDQwODMgPSAhKGN0bS5mIHx8IGN0bS5lKTtcbiAgICAgICAgICBzdmcucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkM19tb3VzZV9idWc0NDA4MykgcG9pbnQueCA9IGUucGFnZVgsIHBvaW50LnkgPSBlLnBhZ2VZOyBlbHNlIHBvaW50LnggPSBlLmNsaWVudFgsIFxuICAgICAgcG9pbnQueSA9IGUuY2xpZW50WTtcbiAgICAgIHBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKGNvbnRhaW5lci5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICAgICAgcmV0dXJuIFsgcG9pbnQueCwgcG9pbnQueSBdO1xuICAgIH1cbiAgICB2YXIgcmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gWyBlLmNsaWVudFggLSByZWN0LmxlZnQgLSBjb250YWluZXIuY2xpZW50TGVmdCwgZS5jbGllbnRZIC0gcmVjdC50b3AgLSBjb250YWluZXIuY2xpZW50VG9wIF07XG4gIH1cbiAgZDMudG91Y2ggPSBmdW5jdGlvbihjb250YWluZXIsIHRvdWNoZXMsIGlkZW50aWZpZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGlkZW50aWZpZXIgPSB0b3VjaGVzLCB0b3VjaGVzID0gZDNfZXZlbnRTb3VyY2UoKS5jaGFuZ2VkVG91Y2hlcztcbiAgICBpZiAodG91Y2hlcykgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzLmxlbmd0aCwgdG91Y2g7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgodG91Y2ggPSB0b3VjaGVzW2ldKS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICAgIHJldHVybiBkM19tb3VzZVBvaW50KGNvbnRhaW5lciwgdG91Y2gpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZDMuYmVoYXZpb3IuZHJhZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBldmVudCA9IGQzX2V2ZW50RGlzcGF0Y2goZHJhZywgXCJkcmFnXCIsIFwiZHJhZ3N0YXJ0XCIsIFwiZHJhZ2VuZFwiKSwgb3JpZ2luID0gbnVsbCwgbW91c2Vkb3duID0gZHJhZ3N0YXJ0KGQzX25vb3AsIGQzLm1vdXNlLCBkM193aW5kb3csIFwibW91c2Vtb3ZlXCIsIFwibW91c2V1cFwiKSwgdG91Y2hzdGFydCA9IGRyYWdzdGFydChkM19iZWhhdmlvcl9kcmFnVG91Y2hJZCwgZDMudG91Y2gsIGQzX2lkZW50aXR5LCBcInRvdWNobW92ZVwiLCBcInRvdWNoZW5kXCIpO1xuICAgIGZ1bmN0aW9uIGRyYWcoKSB7XG4gICAgICB0aGlzLm9uKFwibW91c2Vkb3duLmRyYWdcIiwgbW91c2Vkb3duKS5vbihcInRvdWNoc3RhcnQuZHJhZ1wiLCB0b3VjaHN0YXJ0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZHJhZ3N0YXJ0KGlkLCBwb3NpdGlvbiwgc3ViamVjdCwgbW92ZSwgZW5kKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcywgdGFyZ2V0ID0gZDMuZXZlbnQudGFyZ2V0LmNvcnJlc3BvbmRpbmdFbGVtZW50IHx8IGQzLmV2ZW50LnRhcmdldCwgcGFyZW50ID0gdGhhdC5wYXJlbnROb2RlLCBkaXNwYXRjaCA9IGV2ZW50Lm9mKHRoYXQsIGFyZ3VtZW50cyksIGRyYWdnZWQgPSAwLCBkcmFnSWQgPSBpZCgpLCBkcmFnTmFtZSA9IFwiLmRyYWdcIiArIChkcmFnSWQgPT0gbnVsbCA/IFwiXCIgOiBcIi1cIiArIGRyYWdJZCksIGRyYWdPZmZzZXQsIGRyYWdTdWJqZWN0ID0gZDMuc2VsZWN0KHN1YmplY3QodGFyZ2V0KSkub24obW92ZSArIGRyYWdOYW1lLCBtb3ZlZCkub24oZW5kICsgZHJhZ05hbWUsIGVuZGVkKSwgZHJhZ1Jlc3RvcmUgPSBkM19ldmVudF9kcmFnU3VwcHJlc3ModGFyZ2V0KSwgcG9zaXRpb24wID0gcG9zaXRpb24ocGFyZW50LCBkcmFnSWQpO1xuICAgICAgICBpZiAob3JpZ2luKSB7XG4gICAgICAgICAgZHJhZ09mZnNldCA9IG9yaWdpbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICAgICAgICAgIGRyYWdPZmZzZXQgPSBbIGRyYWdPZmZzZXQueCAtIHBvc2l0aW9uMFswXSwgZHJhZ09mZnNldC55IC0gcG9zaXRpb24wWzFdIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHJhZ09mZnNldCA9IFsgMCwgMCBdO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBcImRyYWdzdGFydFwiXG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3ZlZCgpIHtcbiAgICAgICAgICB2YXIgcG9zaXRpb24xID0gcG9zaXRpb24ocGFyZW50LCBkcmFnSWQpLCBkeCwgZHk7XG4gICAgICAgICAgaWYgKCFwb3NpdGlvbjEpIHJldHVybjtcbiAgICAgICAgICBkeCA9IHBvc2l0aW9uMVswXSAtIHBvc2l0aW9uMFswXTtcbiAgICAgICAgICBkeSA9IHBvc2l0aW9uMVsxXSAtIHBvc2l0aW9uMFsxXTtcbiAgICAgICAgICBkcmFnZ2VkIHw9IGR4IHwgZHk7XG4gICAgICAgICAgcG9zaXRpb24wID0gcG9zaXRpb24xO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHJhZ1wiLFxuICAgICAgICAgICAgeDogcG9zaXRpb24xWzBdICsgZHJhZ09mZnNldFswXSxcbiAgICAgICAgICAgIHk6IHBvc2l0aW9uMVsxXSArIGRyYWdPZmZzZXRbMV0sXG4gICAgICAgICAgICBkeDogZHgsXG4gICAgICAgICAgICBkeTogZHlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlbmRlZCgpIHtcbiAgICAgICAgICBpZiAoIXBvc2l0aW9uKHBhcmVudCwgZHJhZ0lkKSkgcmV0dXJuO1xuICAgICAgICAgIGRyYWdTdWJqZWN0Lm9uKG1vdmUgKyBkcmFnTmFtZSwgbnVsbCkub24oZW5kICsgZHJhZ05hbWUsIG51bGwpO1xuICAgICAgICAgIGRyYWdSZXN0b3JlKGRyYWdnZWQpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHJhZ2VuZFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGRyYWcub3JpZ2luID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZ2luO1xuICAgICAgb3JpZ2luID0geDtcbiAgICAgIHJldHVybiBkcmFnO1xuICAgIH07XG4gICAgcmV0dXJuIGQzLnJlYmluZChkcmFnLCBldmVudCwgXCJvblwiKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfYmVoYXZpb3JfZHJhZ1RvdWNoSWQoKSB7XG4gICAgcmV0dXJuIGQzLmV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmlkZW50aWZpZXI7XG4gIH1cbiAgZDMudG91Y2hlcyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgdG91Y2hlcykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgdG91Y2hlcyA9IGQzX2V2ZW50U291cmNlKCkudG91Y2hlcztcbiAgICByZXR1cm4gdG91Y2hlcyA/IGQzX2FycmF5KHRvdWNoZXMpLm1hcChmdW5jdGlvbih0b3VjaCkge1xuICAgICAgdmFyIHBvaW50ID0gZDNfbW91c2VQb2ludChjb250YWluZXIsIHRvdWNoKTtcbiAgICAgIHBvaW50LmlkZW50aWZpZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuICAgICAgcmV0dXJuIHBvaW50O1xuICAgIH0pIDogW107XG4gIH07XG4gIHZhciDOtSA9IDFlLTYsIM61MiA9IM61ICogzrUsIM+AID0gTWF0aC5QSSwgz4QgPSAyICogz4AsIM+EzrUgPSDPhCAtIM61LCBoYWxmz4AgPSDPgCAvIDIsIGQzX3JhZGlhbnMgPSDPgCAvIDE4MCwgZDNfZGVncmVlcyA9IDE4MCAvIM+AO1xuICBmdW5jdGlvbiBkM19zZ24oeCkge1xuICAgIHJldHVybiB4ID4gMCA/IDEgOiB4IDwgMCA/IC0xIDogMDtcbiAgfVxuICBmdW5jdGlvbiBkM19jcm9zczJkKGEsIGIsIGMpIHtcbiAgICByZXR1cm4gKGJbMF0gLSBhWzBdKSAqIChjWzFdIC0gYVsxXSkgLSAoYlsxXSAtIGFbMV0pICogKGNbMF0gLSBhWzBdKTtcbiAgfVxuICBmdW5jdGlvbiBkM19hY29zKHgpIHtcbiAgICByZXR1cm4geCA+IDEgPyAwIDogeCA8IC0xID8gz4AgOiBNYXRoLmFjb3MoeCk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfYXNpbih4KSB7XG4gICAgcmV0dXJuIHggPiAxID8gaGFsZs+AIDogeCA8IC0xID8gLWhhbGbPgCA6IE1hdGguYXNpbih4KTtcbiAgfVxuICBmdW5jdGlvbiBkM19zaW5oKHgpIHtcbiAgICByZXR1cm4gKCh4ID0gTWF0aC5leHAoeCkpIC0gMSAvIHgpIC8gMjtcbiAgfVxuICBmdW5jdGlvbiBkM19jb3NoKHgpIHtcbiAgICByZXR1cm4gKCh4ID0gTWF0aC5leHAoeCkpICsgMSAvIHgpIC8gMjtcbiAgfVxuICBmdW5jdGlvbiBkM190YW5oKHgpIHtcbiAgICByZXR1cm4gKCh4ID0gTWF0aC5leHAoMiAqIHgpKSAtIDEpIC8gKHggKyAxKTtcbiAgfVxuICBmdW5jdGlvbiBkM19oYXZlcnNpbih4KSB7XG4gICAgcmV0dXJuICh4ID0gTWF0aC5zaW4oeCAvIDIpKSAqIHg7XG4gIH1cbiAgdmFyIM+BID0gTWF0aC5TUVJUMiwgz4EyID0gMiwgz4E0ID0gNDtcbiAgZDMuaW50ZXJwb2xhdGVab29tID0gZnVuY3Rpb24ocDAsIHAxKSB7XG4gICAgdmFyIHV4MCA9IHAwWzBdLCB1eTAgPSBwMFsxXSwgdzAgPSBwMFsyXSwgdXgxID0gcDFbMF0sIHV5MSA9IHAxWzFdLCB3MSA9IHAxWzJdLCBkeCA9IHV4MSAtIHV4MCwgZHkgPSB1eTEgLSB1eTAsIGQyID0gZHggKiBkeCArIGR5ICogZHksIGksIFM7XG4gICAgaWYgKGQyIDwgzrUyKSB7XG4gICAgICBTID0gTWF0aC5sb2codzEgLyB3MCkgLyDPgTtcbiAgICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBbIHV4MCArIHQgKiBkeCwgdXkwICsgdCAqIGR5LCB3MCAqIE1hdGguZXhwKM+BICogdCAqIFMpIF07XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZDEgPSBNYXRoLnNxcnQoZDIpLCBiMCA9ICh3MSAqIHcxIC0gdzAgKiB3MCArIM+BNCAqIGQyKSAvICgyICogdzAgKiDPgTIgKiBkMSksIGIxID0gKHcxICogdzEgLSB3MCAqIHcwIC0gz4E0ICogZDIpIC8gKDIgKiB3MSAqIM+BMiAqIGQxKSwgcjAgPSBNYXRoLmxvZyhNYXRoLnNxcnQoYjAgKiBiMCArIDEpIC0gYjApLCByMSA9IE1hdGgubG9nKE1hdGguc3FydChiMSAqIGIxICsgMSkgLSBiMSk7XG4gICAgICBTID0gKHIxIC0gcjApIC8gz4E7XG4gICAgICBpID0gZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcyA9IHQgKiBTLCBjb3NocjAgPSBkM19jb3NoKHIwKSwgdSA9IHcwIC8gKM+BMiAqIGQxKSAqIChjb3NocjAgKiBkM190YW5oKM+BICogcyArIHIwKSAtIGQzX3NpbmgocjApKTtcbiAgICAgICAgcmV0dXJuIFsgdXgwICsgdSAqIGR4LCB1eTAgKyB1ICogZHksIHcwICogY29zaHIwIC8gZDNfY29zaCjPgSAqIHMgKyByMCkgXTtcbiAgICAgIH07XG4gICAgfVxuICAgIGkuZHVyYXRpb24gPSBTICogMWUzO1xuICAgIHJldHVybiBpO1xuICB9O1xuICBkMy5iZWhhdmlvci56b29tID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXcgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIGs6IDFcbiAgICB9LCB0cmFuc2xhdGUwLCBjZW50ZXIwLCBjZW50ZXIsIHNpemUgPSBbIDk2MCwgNTAwIF0sIHNjYWxlRXh0ZW50ID0gZDNfYmVoYXZpb3Jfem9vbUluZmluaXR5LCBkdXJhdGlvbiA9IDI1MCwgem9vbWluZyA9IDAsIG1vdXNlZG93biA9IFwibW91c2Vkb3duLnpvb21cIiwgbW91c2Vtb3ZlID0gXCJtb3VzZW1vdmUuem9vbVwiLCBtb3VzZXVwID0gXCJtb3VzZXVwLnpvb21cIiwgbW91c2V3aGVlbFRpbWVyLCB0b3VjaHN0YXJ0ID0gXCJ0b3VjaHN0YXJ0Lnpvb21cIiwgdG91Y2h0aW1lLCBldmVudCA9IGQzX2V2ZW50RGlzcGF0Y2goem9vbSwgXCJ6b29tc3RhcnRcIiwgXCJ6b29tXCIsIFwiem9vbWVuZFwiKSwgeDAsIHgxLCB5MCwgeTE7XG4gICAgaWYgKCFkM19iZWhhdmlvcl96b29tV2hlZWwpIHtcbiAgICAgIGQzX2JlaGF2aW9yX3pvb21XaGVlbCA9IFwib253aGVlbFwiIGluIGQzX2RvY3VtZW50ID8gKGQzX2JlaGF2aW9yX3pvb21EZWx0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gLWQzLmV2ZW50LmRlbHRhWSAqIChkMy5ldmVudC5kZWx0YU1vZGUgPyAxMjAgOiAxKTtcbiAgICAgIH0sIFwid2hlZWxcIikgOiBcIm9ubW91c2V3aGVlbFwiIGluIGQzX2RvY3VtZW50ID8gKGQzX2JlaGF2aW9yX3pvb21EZWx0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZDMuZXZlbnQud2hlZWxEZWx0YTtcbiAgICAgIH0sIFwibW91c2V3aGVlbFwiKSA6IChkM19iZWhhdmlvcl96b29tRGVsdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIC1kMy5ldmVudC5kZXRhaWw7XG4gICAgICB9LCBcIk1vek1vdXNlUGl4ZWxTY3JvbGxcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHpvb20oZykge1xuICAgICAgZy5vbihtb3VzZWRvd24sIG1vdXNlZG93bmVkKS5vbihkM19iZWhhdmlvcl96b29tV2hlZWwgKyBcIi56b29tXCIsIG1vdXNld2hlZWxlZCkub24oXCJkYmxjbGljay56b29tXCIsIGRibGNsaWNrZWQpLm9uKHRvdWNoc3RhcnQsIHRvdWNoc3RhcnRlZCk7XG4gICAgfVxuICAgIHpvb20uZXZlbnQgPSBmdW5jdGlvbihnKSB7XG4gICAgICBnLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkaXNwYXRjaCA9IGV2ZW50Lm9mKHRoaXMsIGFyZ3VtZW50cyksIHZpZXcxID0gdmlldztcbiAgICAgICAgaWYgKGQzX3RyYW5zaXRpb25Jbmhlcml0SWQpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykudHJhbnNpdGlvbigpLmVhY2goXCJzdGFydC56b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlldyA9IHRoaXMuX19jaGFydF9fIHx8IHtcbiAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgazogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHpvb21zdGFydGVkKGRpc3BhdGNoKTtcbiAgICAgICAgICB9KS50d2VlbihcInpvb206em9vbVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkeCA9IHNpemVbMF0sIGR5ID0gc2l6ZVsxXSwgY3ggPSBjZW50ZXIwID8gY2VudGVyMFswXSA6IGR4IC8gMiwgY3kgPSBjZW50ZXIwID8gY2VudGVyMFsxXSA6IGR5IC8gMiwgaSA9IGQzLmludGVycG9sYXRlWm9vbShbIChjeCAtIHZpZXcueCkgLyB2aWV3LmssIChjeSAtIHZpZXcueSkgLyB2aWV3LmssIGR4IC8gdmlldy5rIF0sIFsgKGN4IC0gdmlldzEueCkgLyB2aWV3MS5rLCAoY3kgLSB2aWV3MS55KSAvIHZpZXcxLmssIGR4IC8gdmlldzEuayBdKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgIHZhciBsID0gaSh0KSwgayA9IGR4IC8gbFsyXTtcbiAgICAgICAgICAgICAgdGhpcy5fX2NoYXJ0X18gPSB2aWV3ID0ge1xuICAgICAgICAgICAgICAgIHg6IGN4IC0gbFswXSAqIGssXG4gICAgICAgICAgICAgICAgeTogY3kgLSBsWzFdICogayxcbiAgICAgICAgICAgICAgICBrOiBrXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHpvb21lZChkaXNwYXRjaCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLmVhY2goXCJpbnRlcnJ1cHQuem9vbVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHpvb21lbmRlZChkaXNwYXRjaCk7XG4gICAgICAgICAgfSkuZWFjaChcImVuZC56b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgem9vbWVuZGVkKGRpc3BhdGNoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fY2hhcnRfXyA9IHZpZXc7XG4gICAgICAgICAgem9vbXN0YXJ0ZWQoZGlzcGF0Y2gpO1xuICAgICAgICAgIHpvb21lZChkaXNwYXRjaCk7XG4gICAgICAgICAgem9vbWVuZGVkKGRpc3BhdGNoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICB6b29tLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgdmlldy54LCB2aWV3LnkgXTtcbiAgICAgIHZpZXcgPSB7XG4gICAgICAgIHg6ICtfWzBdLFxuICAgICAgICB5OiArX1sxXSxcbiAgICAgICAgazogdmlldy5rXG4gICAgICB9O1xuICAgICAgcmVzY2FsZSgpO1xuICAgICAgcmV0dXJuIHpvb207XG4gICAgfTtcbiAgICB6b29tLnNjYWxlID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdmlldy5rO1xuICAgICAgdmlldyA9IHtcbiAgICAgICAgeDogdmlldy54LFxuICAgICAgICB5OiB2aWV3LnksXG4gICAgICAgIGs6IG51bGxcbiAgICAgIH07XG4gICAgICBzY2FsZVRvKCtfKTtcbiAgICAgIHJlc2NhbGUoKTtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH07XG4gICAgem9vbS5zY2FsZUV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlRXh0ZW50O1xuICAgICAgc2NhbGVFeHRlbnQgPSBfID09IG51bGwgPyBkM19iZWhhdmlvcl96b29tSW5maW5pdHkgOiBbICtfWzBdLCArX1sxXSBdO1xuICAgICAgcmV0dXJuIHpvb207XG4gICAgfTtcbiAgICB6b29tLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbnRlcjtcbiAgICAgIGNlbnRlciA9IF8gJiYgWyArX1swXSwgK19bMV0gXTtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH07XG4gICAgem9vbS5zaXplID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2l6ZTtcbiAgICAgIHNpemUgPSBfICYmIFsgK19bMF0sICtfWzFdIF07XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIHpvb20uZHVyYXRpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkdXJhdGlvbjtcbiAgICAgIGR1cmF0aW9uID0gK187XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIHpvb20ueCA9IGZ1bmN0aW9uKHopIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHgxO1xuICAgICAgeDEgPSB6O1xuICAgICAgeDAgPSB6LmNvcHkoKTtcbiAgICAgIHZpZXcgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIGs6IDFcbiAgICAgIH07XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIHpvb20ueSA9IGZ1bmN0aW9uKHopIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHkxO1xuICAgICAgeTEgPSB6O1xuICAgICAgeTAgPSB6LmNvcHkoKTtcbiAgICAgIHZpZXcgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIGs6IDFcbiAgICAgIH07XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxvY2F0aW9uKHApIHtcbiAgICAgIHJldHVybiBbIChwWzBdIC0gdmlldy54KSAvIHZpZXcuaywgKHBbMV0gLSB2aWV3LnkpIC8gdmlldy5rIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvaW50KGwpIHtcbiAgICAgIHJldHVybiBbIGxbMF0gKiB2aWV3LmsgKyB2aWV3LngsIGxbMV0gKiB2aWV3LmsgKyB2aWV3LnkgXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2NhbGVUbyhzKSB7XG4gICAgICB2aWV3LmsgPSBNYXRoLm1heChzY2FsZUV4dGVudFswXSwgTWF0aC5taW4oc2NhbGVFeHRlbnRbMV0sIHMpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlVG8ocCwgbCkge1xuICAgICAgbCA9IHBvaW50KGwpO1xuICAgICAgdmlldy54ICs9IHBbMF0gLSBsWzBdO1xuICAgICAgdmlldy55ICs9IHBbMV0gLSBsWzFdO1xuICAgIH1cbiAgICBmdW5jdGlvbiB6b29tVG8odGhhdCwgcCwgbCwgaykge1xuICAgICAgdGhhdC5fX2NoYXJ0X18gPSB7XG4gICAgICAgIHg6IHZpZXcueCxcbiAgICAgICAgeTogdmlldy55LFxuICAgICAgICBrOiB2aWV3LmtcbiAgICAgIH07XG4gICAgICBzY2FsZVRvKE1hdGgucG93KDIsIGspKTtcbiAgICAgIHRyYW5zbGF0ZVRvKGNlbnRlcjAgPSBwLCBsKTtcbiAgICAgIHRoYXQgPSBkMy5zZWxlY3QodGhhdCk7XG4gICAgICBpZiAoZHVyYXRpb24gPiAwKSB0aGF0ID0gdGhhdC50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pO1xuICAgICAgdGhhdC5jYWxsKHpvb20uZXZlbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgICAgaWYgKHgxKSB4MS5kb21haW4oeDAucmFuZ2UoKS5tYXAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4gKHggLSB2aWV3LngpIC8gdmlldy5rO1xuICAgICAgfSkubWFwKHgwLmludmVydCkpO1xuICAgICAgaWYgKHkxKSB5MS5kb21haW4oeTAucmFuZ2UoKS5tYXAoZnVuY3Rpb24oeSkge1xuICAgICAgICByZXR1cm4gKHkgLSB2aWV3LnkpIC8gdmlldy5rO1xuICAgICAgfSkubWFwKHkwLmludmVydCkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB6b29tc3RhcnRlZChkaXNwYXRjaCkge1xuICAgICAgaWYgKCF6b29taW5nKyspIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogXCJ6b29tc3RhcnRcIlxuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHpvb21lZChkaXNwYXRjaCkge1xuICAgICAgcmVzY2FsZSgpO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcInpvb21cIixcbiAgICAgICAgc2NhbGU6IHZpZXcuayxcbiAgICAgICAgdHJhbnNsYXRlOiBbIHZpZXcueCwgdmlldy55IF1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiB6b29tZW5kZWQoZGlzcGF0Y2gpIHtcbiAgICAgIGlmICghLS16b29taW5nKSBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFwiem9vbWVuZFwiXG4gICAgICB9KSwgY2VudGVyMCA9IG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1vdXNlZG93bmVkKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLCBkaXNwYXRjaCA9IGV2ZW50Lm9mKHRoYXQsIGFyZ3VtZW50cyksIGRyYWdnZWQgPSAwLCBzdWJqZWN0ID0gZDMuc2VsZWN0KGQzX3dpbmRvdyh0aGF0KSkub24obW91c2Vtb3ZlLCBtb3ZlZCkub24obW91c2V1cCwgZW5kZWQpLCBsb2NhdGlvbjAgPSBsb2NhdGlvbihkMy5tb3VzZSh0aGF0KSksIGRyYWdSZXN0b3JlID0gZDNfZXZlbnRfZHJhZ1N1cHByZXNzKHRoYXQpO1xuICAgICAgZDNfc2VsZWN0aW9uX2ludGVycnVwdC5jYWxsKHRoYXQpO1xuICAgICAgem9vbXN0YXJ0ZWQoZGlzcGF0Y2gpO1xuICAgICAgZnVuY3Rpb24gbW92ZWQoKSB7XG4gICAgICAgIGRyYWdnZWQgPSAxO1xuICAgICAgICB0cmFuc2xhdGVUbyhkMy5tb3VzZSh0aGF0KSwgbG9jYXRpb24wKTtcbiAgICAgICAgem9vbWVkKGRpc3BhdGNoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGVuZGVkKCkge1xuICAgICAgICBzdWJqZWN0Lm9uKG1vdXNlbW92ZSwgbnVsbCkub24obW91c2V1cCwgbnVsbCk7XG4gICAgICAgIGRyYWdSZXN0b3JlKGRyYWdnZWQpO1xuICAgICAgICB6b29tZW5kZWQoZGlzcGF0Y2gpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB0b3VjaHN0YXJ0ZWQoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsIGRpc3BhdGNoID0gZXZlbnQub2YodGhhdCwgYXJndW1lbnRzKSwgbG9jYXRpb25zMCA9IHt9LCBkaXN0YW5jZTAgPSAwLCBzY2FsZTAsIHpvb21OYW1lID0gXCIuem9vbS1cIiArIGQzLmV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmlkZW50aWZpZXIsIHRvdWNobW92ZSA9IFwidG91Y2htb3ZlXCIgKyB6b29tTmFtZSwgdG91Y2hlbmQgPSBcInRvdWNoZW5kXCIgKyB6b29tTmFtZSwgdGFyZ2V0cyA9IFtdLCBzdWJqZWN0ID0gZDMuc2VsZWN0KHRoYXQpLCBkcmFnUmVzdG9yZSA9IGQzX2V2ZW50X2RyYWdTdXBwcmVzcyh0aGF0KTtcbiAgICAgIHN0YXJ0ZWQoKTtcbiAgICAgIHpvb21zdGFydGVkKGRpc3BhdGNoKTtcbiAgICAgIHN1YmplY3Qub24obW91c2Vkb3duLCBudWxsKS5vbih0b3VjaHN0YXJ0LCBzdGFydGVkKTtcbiAgICAgIGZ1bmN0aW9uIHJlbG9jYXRlKCkge1xuICAgICAgICB2YXIgdG91Y2hlcyA9IGQzLnRvdWNoZXModGhhdCk7XG4gICAgICAgIHNjYWxlMCA9IHZpZXcuaztcbiAgICAgICAgdG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICBpZiAodC5pZGVudGlmaWVyIGluIGxvY2F0aW9uczApIGxvY2F0aW9uczBbdC5pZGVudGlmaWVyXSA9IGxvY2F0aW9uKHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRvdWNoZXM7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBzdGFydGVkKCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZDMuZXZlbnQudGFyZ2V0O1xuICAgICAgICBkMy5zZWxlY3QodGFyZ2V0KS5vbih0b3VjaG1vdmUsIG1vdmVkKS5vbih0b3VjaGVuZCwgZW5kZWQpO1xuICAgICAgICB0YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICAgICAgdmFyIGNoYW5nZWQgPSBkMy5ldmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjaGFuZ2VkLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgIGxvY2F0aW9uczBbY2hhbmdlZFtpXS5pZGVudGlmaWVyXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRvdWNoZXMgPSByZWxvY2F0ZSgpLCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBpZiAobm93IC0gdG91Y2h0aW1lIDwgNTAwKSB7XG4gICAgICAgICAgICB2YXIgcCA9IHRvdWNoZXNbMF07XG4gICAgICAgICAgICB6b29tVG8odGhhdCwgcCwgbG9jYXRpb25zMFtwLmlkZW50aWZpZXJdLCBNYXRoLmZsb29yKE1hdGgubG9nKHZpZXcuaykgLyBNYXRoLkxOMikgKyAxKTtcbiAgICAgICAgICAgIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG91Y2h0aW1lID0gbm93O1xuICAgICAgICB9IGVsc2UgaWYgKHRvdWNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHZhciBwID0gdG91Y2hlc1swXSwgcSA9IHRvdWNoZXNbMV0sIGR4ID0gcFswXSAtIHFbMF0sIGR5ID0gcFsxXSAtIHFbMV07XG4gICAgICAgICAgZGlzdGFuY2UwID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG1vdmVkKCkge1xuICAgICAgICB2YXIgdG91Y2hlcyA9IGQzLnRvdWNoZXModGhhdCksIHAwLCBsMCwgcDEsIGwxO1xuICAgICAgICBkM19zZWxlY3Rpb25faW50ZXJydXB0LmNhbGwodGhhdCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gdG91Y2hlcy5sZW5ndGg7IGkgPCBuOyArK2ksIGwxID0gbnVsbCkge1xuICAgICAgICAgIHAxID0gdG91Y2hlc1tpXTtcbiAgICAgICAgICBpZiAobDEgPSBsb2NhdGlvbnMwW3AxLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICBpZiAobDApIGJyZWFrO1xuICAgICAgICAgICAgcDAgPSBwMSwgbDAgPSBsMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGwxKSB7XG4gICAgICAgICAgdmFyIGRpc3RhbmNlMSA9IChkaXN0YW5jZTEgPSBwMVswXSAtIHAwWzBdKSAqIGRpc3RhbmNlMSArIChkaXN0YW5jZTEgPSBwMVsxXSAtIHAwWzFdKSAqIGRpc3RhbmNlMSwgc2NhbGUxID0gZGlzdGFuY2UwICYmIE1hdGguc3FydChkaXN0YW5jZTEgLyBkaXN0YW5jZTApO1xuICAgICAgICAgIHAwID0gWyAocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyIF07XG4gICAgICAgICAgbDAgPSBbIChsMFswXSArIGwxWzBdKSAvIDIsIChsMFsxXSArIGwxWzFdKSAvIDIgXTtcbiAgICAgICAgICBzY2FsZVRvKHNjYWxlMSAqIHNjYWxlMCk7XG4gICAgICAgIH1cbiAgICAgICAgdG91Y2h0aW1lID0gbnVsbDtcbiAgICAgICAgdHJhbnNsYXRlVG8ocDAsIGwwKTtcbiAgICAgICAgem9vbWVkKGRpc3BhdGNoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGVuZGVkKCkge1xuICAgICAgICBpZiAoZDMuZXZlbnQudG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgY2hhbmdlZCA9IGQzLmV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gY2hhbmdlZC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhdGlvbnMwW2NoYW5nZWRbaV0uaWRlbnRpZmllcl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGlkZW50aWZpZXIgaW4gbG9jYXRpb25zMCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgcmVsb2NhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZDMuc2VsZWN0QWxsKHRhcmdldHMpLm9uKHpvb21OYW1lLCBudWxsKTtcbiAgICAgICAgc3ViamVjdC5vbihtb3VzZWRvd24sIG1vdXNlZG93bmVkKS5vbih0b3VjaHN0YXJ0LCB0b3VjaHN0YXJ0ZWQpO1xuICAgICAgICBkcmFnUmVzdG9yZSgpO1xuICAgICAgICB6b29tZW5kZWQoZGlzcGF0Y2gpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBtb3VzZXdoZWVsZWQoKSB7XG4gICAgICB2YXIgZGlzcGF0Y2ggPSBldmVudC5vZih0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKG1vdXNld2hlZWxUaW1lcikgY2xlYXJUaW1lb3V0KG1vdXNld2hlZWxUaW1lcik7IGVsc2UgZDNfc2VsZWN0aW9uX2ludGVycnVwdC5jYWxsKHRoaXMpLCBcbiAgICAgIHRyYW5zbGF0ZTAgPSBsb2NhdGlvbihjZW50ZXIwID0gY2VudGVyIHx8IGQzLm1vdXNlKHRoaXMpKSwgem9vbXN0YXJ0ZWQoZGlzcGF0Y2gpO1xuICAgICAgbW91c2V3aGVlbFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbW91c2V3aGVlbFRpbWVyID0gbnVsbDtcbiAgICAgICAgem9vbWVuZGVkKGRpc3BhdGNoKTtcbiAgICAgIH0sIDUwKTtcbiAgICAgIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNjYWxlVG8oTWF0aC5wb3coMiwgZDNfYmVoYXZpb3Jfem9vbURlbHRhKCkgKiAuMDAyKSAqIHZpZXcuayk7XG4gICAgICB0cmFuc2xhdGVUbyhjZW50ZXIwLCB0cmFuc2xhdGUwKTtcbiAgICAgIHpvb21lZChkaXNwYXRjaCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRibGNsaWNrZWQoKSB7XG4gICAgICB2YXIgcCA9IGQzLm1vdXNlKHRoaXMpLCBrID0gTWF0aC5sb2codmlldy5rKSAvIE1hdGguTE4yO1xuICAgICAgem9vbVRvKHRoaXMsIHAsIGxvY2F0aW9uKHApLCBkMy5ldmVudC5zaGlmdEtleSA/IE1hdGguY2VpbChrKSAtIDEgOiBNYXRoLmZsb29yKGspICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkMy5yZWJpbmQoem9vbSwgZXZlbnQsIFwib25cIik7XG4gIH07XG4gIHZhciBkM19iZWhhdmlvcl96b29tSW5maW5pdHkgPSBbIDAsIEluZmluaXR5IF0sIGQzX2JlaGF2aW9yX3pvb21EZWx0YSwgZDNfYmVoYXZpb3Jfem9vbVdoZWVsO1xuICBkMy5jb2xvciA9IGQzX2NvbG9yO1xuICBmdW5jdGlvbiBkM19jb2xvcigpIHt9XG4gIGQzX2NvbG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgfTtcbiAgZDMuaHNsID0gZDNfaHNsO1xuICBmdW5jdGlvbiBkM19oc2woaCwgcywgbCkge1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgZDNfaHNsID8gdm9pZCAodGhpcy5oID0gK2gsIHRoaXMucyA9ICtzLCB0aGlzLmwgPSArbCkgOiBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGggaW5zdGFuY2VvZiBkM19oc2wgPyBuZXcgZDNfaHNsKGguaCwgaC5zLCBoLmwpIDogZDNfcmdiX3BhcnNlKFwiXCIgKyBoLCBkM19yZ2JfaHNsLCBkM19oc2wpIDogbmV3IGQzX2hzbChoLCBzLCBsKTtcbiAgfVxuICB2YXIgZDNfaHNsUHJvdG90eXBlID0gZDNfaHNsLnByb3RvdHlwZSA9IG5ldyBkM19jb2xvcigpO1xuICBkM19oc2xQcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IE1hdGgucG93KC43LCBhcmd1bWVudHMubGVuZ3RoID8gayA6IDEpO1xuICAgIHJldHVybiBuZXcgZDNfaHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgLyBrKTtcbiAgfTtcbiAgZDNfaHNsUHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gTWF0aC5wb3coLjcsIGFyZ3VtZW50cy5sZW5ndGggPyBrIDogMSk7XG4gICAgcmV0dXJuIG5ldyBkM19oc2wodGhpcy5oLCB0aGlzLnMsIGsgKiB0aGlzLmwpO1xuICB9O1xuICBkM19oc2xQcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX2hzbF9yZ2IodGhpcy5oLCB0aGlzLnMsIHRoaXMubCk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2hzbF9yZ2IoaCwgcywgbCkge1xuICAgIHZhciBtMSwgbTI7XG4gICAgaCA9IGlzTmFOKGgpID8gMCA6IChoICU9IDM2MCkgPCAwID8gaCArIDM2MCA6IGg7XG4gICAgcyA9IGlzTmFOKHMpID8gMCA6IHMgPCAwID8gMCA6IHMgPiAxID8gMSA6IHM7XG4gICAgbCA9IGwgPCAwID8gMCA6IGwgPiAxID8gMSA6IGw7XG4gICAgbTIgPSBsIDw9IC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICBmdW5jdGlvbiB2KGgpIHtcbiAgICAgIGlmIChoID4gMzYwKSBoIC09IDM2MDsgZWxzZSBpZiAoaCA8IDApIGggKz0gMzYwO1xuICAgICAgaWYgKGggPCA2MCkgcmV0dXJuIG0xICsgKG0yIC0gbTEpICogaCAvIDYwO1xuICAgICAgaWYgKGggPCAxODApIHJldHVybiBtMjtcbiAgICAgIGlmIChoIDwgMjQwKSByZXR1cm4gbTEgKyAobTIgLSBtMSkgKiAoMjQwIC0gaCkgLyA2MDtcbiAgICAgIHJldHVybiBtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdnYoaCkge1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQodihoKSAqIDI1NSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgZDNfcmdiKHZ2KGggKyAxMjApLCB2dihoKSwgdnYoaCAtIDEyMCkpO1xuICB9XG4gIGQzLmhjbCA9IGQzX2hjbDtcbiAgZnVuY3Rpb24gZDNfaGNsKGgsIGMsIGwpIHtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGQzX2hjbCA/IHZvaWQgKHRoaXMuaCA9ICtoLCB0aGlzLmMgPSArYywgdGhpcy5sID0gK2wpIDogYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBoIGluc3RhbmNlb2YgZDNfaGNsID8gbmV3IGQzX2hjbChoLmgsIGguYywgaC5sKSA6IGggaW5zdGFuY2VvZiBkM19sYWIgPyBkM19sYWJfaGNsKGgubCwgaC5hLCBoLmIpIDogZDNfbGFiX2hjbCgoaCA9IGQzX3JnYl9sYWIoKGggPSBkMy5yZ2IoaCkpLnIsIGguZywgaC5iKSkubCwgaC5hLCBoLmIpIDogbmV3IGQzX2hjbChoLCBjLCBsKTtcbiAgfVxuICB2YXIgZDNfaGNsUHJvdG90eXBlID0gZDNfaGNsLnByb3RvdHlwZSA9IG5ldyBkM19jb2xvcigpO1xuICBkM19oY2xQcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBkM19oY2wodGhpcy5oLCB0aGlzLmMsIE1hdGgubWluKDEwMCwgdGhpcy5sICsgZDNfbGFiX0sgKiAoYXJndW1lbnRzLmxlbmd0aCA/IGsgOiAxKSkpO1xuICB9O1xuICBkM19oY2xQcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgZDNfaGNsKHRoaXMuaCwgdGhpcy5jLCBNYXRoLm1heCgwLCB0aGlzLmwgLSBkM19sYWJfSyAqIChhcmd1bWVudHMubGVuZ3RoID8gayA6IDEpKSk7XG4gIH07XG4gIGQzX2hjbFByb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfaGNsX2xhYih0aGlzLmgsIHRoaXMuYywgdGhpcy5sKS5yZ2IoKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfaGNsX2xhYihoLCBjLCBsKSB7XG4gICAgaWYgKGlzTmFOKGgpKSBoID0gMDtcbiAgICBpZiAoaXNOYU4oYykpIGMgPSAwO1xuICAgIHJldHVybiBuZXcgZDNfbGFiKGwsIE1hdGguY29zKGggKj0gZDNfcmFkaWFucykgKiBjLCBNYXRoLnNpbihoKSAqIGMpO1xuICB9XG4gIGQzLmxhYiA9IGQzX2xhYjtcbiAgZnVuY3Rpb24gZDNfbGFiKGwsIGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGQzX2xhYiA/IHZvaWQgKHRoaXMubCA9ICtsLCB0aGlzLmEgPSArYSwgdGhpcy5iID0gK2IpIDogYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBsIGluc3RhbmNlb2YgZDNfbGFiID8gbmV3IGQzX2xhYihsLmwsIGwuYSwgbC5iKSA6IGwgaW5zdGFuY2VvZiBkM19oY2wgPyBkM19oY2xfbGFiKGwuaCwgbC5jLCBsLmwpIDogZDNfcmdiX2xhYigobCA9IGQzX3JnYihsKSkuciwgbC5nLCBsLmIpIDogbmV3IGQzX2xhYihsLCBhLCBiKTtcbiAgfVxuICB2YXIgZDNfbGFiX0sgPSAxODtcbiAgdmFyIGQzX2xhYl9YID0gLjk1MDQ3LCBkM19sYWJfWSA9IDEsIGQzX2xhYl9aID0gMS4wODg4MztcbiAgdmFyIGQzX2xhYlByb3RvdHlwZSA9IGQzX2xhYi5wcm90b3R5cGUgPSBuZXcgZDNfY29sb3IoKTtcbiAgZDNfbGFiUHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgZDNfbGFiKE1hdGgubWluKDEwMCwgdGhpcy5sICsgZDNfbGFiX0sgKiAoYXJndW1lbnRzLmxlbmd0aCA/IGsgOiAxKSksIHRoaXMuYSwgdGhpcy5iKTtcbiAgfTtcbiAgZDNfbGFiUHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IGQzX2xhYihNYXRoLm1heCgwLCB0aGlzLmwgLSBkM19sYWJfSyAqIChhcmd1bWVudHMubGVuZ3RoID8gayA6IDEpKSwgdGhpcy5hLCB0aGlzLmIpO1xuICB9O1xuICBkM19sYWJQcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX2xhYl9yZ2IodGhpcy5sLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2xhYl9yZ2IobCwgYSwgYikge1xuICAgIHZhciB5ID0gKGwgKyAxNikgLyAxMTYsIHggPSB5ICsgYSAvIDUwMCwgeiA9IHkgLSBiIC8gMjAwO1xuICAgIHggPSBkM19sYWJfeHl6KHgpICogZDNfbGFiX1g7XG4gICAgeSA9IGQzX2xhYl94eXooeSkgKiBkM19sYWJfWTtcbiAgICB6ID0gZDNfbGFiX3h5eih6KSAqIGQzX2xhYl9aO1xuICAgIHJldHVybiBuZXcgZDNfcmdiKGQzX3h5el9yZ2IoMy4yNDA0NTQyICogeCAtIDEuNTM3MTM4NSAqIHkgLSAuNDk4NTMxNCAqIHopLCBkM194eXpfcmdiKC0uOTY5MjY2ICogeCArIDEuODc2MDEwOCAqIHkgKyAuMDQxNTU2ICogeiksIGQzX3h5el9yZ2IoLjA1NTY0MzQgKiB4IC0gLjIwNDAyNTkgKiB5ICsgMS4wNTcyMjUyICogeikpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xhYl9oY2wobCwgYSwgYikge1xuICAgIHJldHVybiBsID4gMCA/IG5ldyBkM19oY2woTWF0aC5hdGFuMihiLCBhKSAqIGQzX2RlZ3JlZXMsIE1hdGguc3FydChhICogYSArIGIgKiBiKSwgbCkgOiBuZXcgZDNfaGNsKE5hTiwgTmFOLCBsKTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYWJfeHl6KHgpIHtcbiAgICByZXR1cm4geCA+IC4yMDY4OTMwMzQgPyB4ICogeCAqIHggOiAoeCAtIDQgLyAyOSkgLyA3Ljc4NzAzNztcbiAgfVxuICBmdW5jdGlvbiBkM194eXpfbGFiKHgpIHtcbiAgICByZXR1cm4geCA+IC4wMDg4NTYgPyBNYXRoLnBvdyh4LCAxIC8gMykgOiA3Ljc4NzAzNyAqIHggKyA0IC8gMjk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfeHl6X3JnYihyKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoMjU1ICogKHIgPD0gLjAwMzA0ID8gMTIuOTIgKiByIDogMS4wNTUgKiBNYXRoLnBvdyhyLCAxIC8gMi40KSAtIC4wNTUpKTtcbiAgfVxuICBkMy5yZ2IgPSBkM19yZ2I7XG4gIGZ1bmN0aW9uIGQzX3JnYihyLCBnLCBiKSB7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBkM19yZ2IgPyB2b2lkICh0aGlzLnIgPSB+fnIsIHRoaXMuZyA9IH5+ZywgdGhpcy5iID0gfn5iKSA6IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gciBpbnN0YW5jZW9mIGQzX3JnYiA/IG5ldyBkM19yZ2Ioci5yLCByLmcsIHIuYikgOiBkM19yZ2JfcGFyc2UoXCJcIiArIHIsIGQzX3JnYiwgZDNfaHNsX3JnYikgOiBuZXcgZDNfcmdiKHIsIGcsIGIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3JnYk51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgZDNfcmdiKHZhbHVlID4+IDE2LCB2YWx1ZSA+PiA4ICYgMjU1LCB2YWx1ZSAmIDI1NSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfcmdiU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIGQzX3JnYk51bWJlcih2YWx1ZSkgKyBcIlwiO1xuICB9XG4gIHZhciBkM19yZ2JQcm90b3R5cGUgPSBkM19yZ2IucHJvdG90eXBlID0gbmV3IGQzX2NvbG9yKCk7XG4gIGQzX3JnYlByb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gTWF0aC5wb3coLjcsIGFyZ3VtZW50cy5sZW5ndGggPyBrIDogMSk7XG4gICAgdmFyIHIgPSB0aGlzLnIsIGcgPSB0aGlzLmcsIGIgPSB0aGlzLmIsIGkgPSAzMDtcbiAgICBpZiAoIXIgJiYgIWcgJiYgIWIpIHJldHVybiBuZXcgZDNfcmdiKGksIGksIGkpO1xuICAgIGlmIChyICYmIHIgPCBpKSByID0gaTtcbiAgICBpZiAoZyAmJiBnIDwgaSkgZyA9IGk7XG4gICAgaWYgKGIgJiYgYiA8IGkpIGIgPSBpO1xuICAgIHJldHVybiBuZXcgZDNfcmdiKE1hdGgubWluKDI1NSwgciAvIGspLCBNYXRoLm1pbigyNTUsIGcgLyBrKSwgTWF0aC5taW4oMjU1LCBiIC8gaykpO1xuICB9O1xuICBkM19yZ2JQcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBNYXRoLnBvdyguNywgYXJndW1lbnRzLmxlbmd0aCA/IGsgOiAxKTtcbiAgICByZXR1cm4gbmV3IGQzX3JnYihrICogdGhpcy5yLCBrICogdGhpcy5nLCBrICogdGhpcy5iKTtcbiAgfTtcbiAgZDNfcmdiUHJvdG90eXBlLmhzbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19yZ2JfaHNsKHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICB9O1xuICBkM19yZ2JQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCIjXCIgKyBkM19yZ2JfaGV4KHRoaXMucikgKyBkM19yZ2JfaGV4KHRoaXMuZykgKyBkM19yZ2JfaGV4KHRoaXMuYik7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3JnYl9oZXgodikge1xuICAgIHJldHVybiB2IDwgMTYgPyBcIjBcIiArIE1hdGgubWF4KDAsIHYpLnRvU3RyaW5nKDE2KSA6IE1hdGgubWluKDI1NSwgdikudG9TdHJpbmcoMTYpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3JnYl9wYXJzZShmb3JtYXQsIHJnYiwgaHNsKSB7XG4gICAgdmFyIHIgPSAwLCBnID0gMCwgYiA9IDAsIG0xLCBtMiwgY29sb3I7XG4gICAgbTEgPSAvKFthLXpdKylcXCgoLiopXFwpLy5leGVjKGZvcm1hdCA9IGZvcm1hdC50b0xvd2VyQ2FzZSgpKTtcbiAgICBpZiAobTEpIHtcbiAgICAgIG0yID0gbTFbMl0uc3BsaXQoXCIsXCIpO1xuICAgICAgc3dpdGNoIChtMVsxXSkge1xuICAgICAgIGNhc2UgXCJoc2xcIjpcbiAgICAgICAge1xuICAgICAgICAgIHJldHVybiBoc2wocGFyc2VGbG9hdChtMlswXSksIHBhcnNlRmxvYXQobTJbMV0pIC8gMTAwLCBwYXJzZUZsb2F0KG0yWzJdKSAvIDEwMCk7XG4gICAgICAgIH1cblxuICAgICAgIGNhc2UgXCJyZ2JcIjpcbiAgICAgICAge1xuICAgICAgICAgIHJldHVybiByZ2IoZDNfcmdiX3BhcnNlTnVtYmVyKG0yWzBdKSwgZDNfcmdiX3BhcnNlTnVtYmVyKG0yWzFdKSwgZDNfcmdiX3BhcnNlTnVtYmVyKG0yWzJdKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbG9yID0gZDNfcmdiX25hbWVzLmdldChmb3JtYXQpKSB7XG4gICAgICByZXR1cm4gcmdiKGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ICE9IG51bGwgJiYgZm9ybWF0LmNoYXJBdCgwKSA9PT0gXCIjXCIgJiYgIWlzTmFOKGNvbG9yID0gcGFyc2VJbnQoZm9ybWF0LnNsaWNlKDEpLCAxNikpKSB7XG4gICAgICBpZiAoZm9ybWF0Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICByID0gKGNvbG9yICYgMzg0MCkgPj4gNDtcbiAgICAgICAgciA9IHIgPj4gNCB8IHI7XG4gICAgICAgIGcgPSBjb2xvciAmIDI0MDtcbiAgICAgICAgZyA9IGcgPj4gNCB8IGc7XG4gICAgICAgIGIgPSBjb2xvciAmIDE1O1xuICAgICAgICBiID0gYiA8PCA0IHwgYjtcbiAgICAgIH0gZWxzZSBpZiAoZm9ybWF0Lmxlbmd0aCA9PT0gNykge1xuICAgICAgICByID0gKGNvbG9yICYgMTY3MTE2ODApID4+IDE2O1xuICAgICAgICBnID0gKGNvbG9yICYgNjUyODApID4+IDg7XG4gICAgICAgIGIgPSBjb2xvciAmIDI1NTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJnYihyLCBnLCBiKTtcbiAgfVxuICBmdW5jdGlvbiBkM19yZ2JfaHNsKHIsIGcsIGIpIHtcbiAgICB2YXIgbWluID0gTWF0aC5taW4ociAvPSAyNTUsIGcgLz0gMjU1LCBiIC89IDI1NSksIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBkID0gbWF4IC0gbWluLCBoLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xuICAgIGlmIChkKSB7XG4gICAgICBzID0gbCA8IC41ID8gZCAvIChtYXggKyBtaW4pIDogZCAvICgyIC0gbWF4IC0gbWluKTtcbiAgICAgIGlmIChyID09IG1heCkgaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBlbHNlIGlmIChnID09IG1heCkgaCA9IChiIC0gcikgLyBkICsgMjsgZWxzZSBoID0gKHIgLSBnKSAvIGQgKyA0O1xuICAgICAgaCAqPSA2MDtcbiAgICB9IGVsc2Uge1xuICAgICAgaCA9IE5hTjtcbiAgICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGQzX2hzbChoLCBzLCBsKTtcbiAgfVxuICBmdW5jdGlvbiBkM19yZ2JfbGFiKHIsIGcsIGIpIHtcbiAgICByID0gZDNfcmdiX3h5eihyKTtcbiAgICBnID0gZDNfcmdiX3h5eihnKTtcbiAgICBiID0gZDNfcmdiX3h5eihiKTtcbiAgICB2YXIgeCA9IGQzX3h5el9sYWIoKC40MTI0NTY0ICogciArIC4zNTc1NzYxICogZyArIC4xODA0Mzc1ICogYikgLyBkM19sYWJfWCksIHkgPSBkM194eXpfbGFiKCguMjEyNjcyOSAqIHIgKyAuNzE1MTUyMiAqIGcgKyAuMDcyMTc1ICogYikgLyBkM19sYWJfWSksIHogPSBkM194eXpfbGFiKCguMDE5MzMzOSAqIHIgKyAuMTE5MTkyICogZyArIC45NTAzMDQxICogYikgLyBkM19sYWJfWik7XG4gICAgcmV0dXJuIGQzX2xhYigxMTYgKiB5IC0gMTYsIDUwMCAqICh4IC0geSksIDIwMCAqICh5IC0geikpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3JnYl94eXoocikge1xuICAgIHJldHVybiAociAvPSAyNTUpIDw9IC4wNDA0NSA/IHIgLyAxMi45MiA6IE1hdGgucG93KChyICsgLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgfVxuICBmdW5jdGlvbiBkM19yZ2JfcGFyc2VOdW1iZXIoYykge1xuICAgIHZhciBmID0gcGFyc2VGbG9hdChjKTtcbiAgICByZXR1cm4gYy5jaGFyQXQoYy5sZW5ndGggLSAxKSA9PT0gXCIlXCIgPyBNYXRoLnJvdW5kKGYgKiAyLjU1KSA6IGY7XG4gIH1cbiAgdmFyIGQzX3JnYl9uYW1lcyA9IGQzLm1hcCh7XG4gICAgYWxpY2VibHVlOiAxNTc5MjM4MyxcbiAgICBhbnRpcXVld2hpdGU6IDE2NDQ0Mzc1LFxuICAgIGFxdWE6IDY1NTM1LFxuICAgIGFxdWFtYXJpbmU6IDgzODg1NjQsXG4gICAgYXp1cmU6IDE1Nzk0MTc1LFxuICAgIGJlaWdlOiAxNjExOTI2MCxcbiAgICBiaXNxdWU6IDE2NzcwMjQ0LFxuICAgIGJsYWNrOiAwLFxuICAgIGJsYW5jaGVkYWxtb25kOiAxNjc3MjA0NSxcbiAgICBibHVlOiAyNTUsXG4gICAgYmx1ZXZpb2xldDogOTA1NTIwMixcbiAgICBicm93bjogMTA4MjQyMzQsXG4gICAgYnVybHl3b29kOiAxNDU5NjIzMSxcbiAgICBjYWRldGJsdWU6IDYyNjY1MjgsXG4gICAgY2hhcnRyZXVzZTogODM4ODM1MixcbiAgICBjaG9jb2xhdGU6IDEzNzg5NDcwLFxuICAgIGNvcmFsOiAxNjc0NDI3MixcbiAgICBjb3JuZmxvd2VyYmx1ZTogNjU5MTk4MSxcbiAgICBjb3Juc2lsazogMTY3NzUzODgsXG4gICAgY3JpbXNvbjogMTQ0MjMxMDAsXG4gICAgY3lhbjogNjU1MzUsXG4gICAgZGFya2JsdWU6IDEzOSxcbiAgICBkYXJrY3lhbjogMzU3MjMsXG4gICAgZGFya2dvbGRlbnJvZDogMTIwOTI5MzksXG4gICAgZGFya2dyYXk6IDExMTE5MDE3LFxuICAgIGRhcmtncmVlbjogMjU2MDAsXG4gICAgZGFya2dyZXk6IDExMTE5MDE3LFxuICAgIGRhcmtraGFraTogMTI0MzMyNTksXG4gICAgZGFya21hZ2VudGE6IDkxMDk2NDMsXG4gICAgZGFya29saXZlZ3JlZW46IDU1OTc5OTksXG4gICAgZGFya29yYW5nZTogMTY3NDc1MjAsXG4gICAgZGFya29yY2hpZDogMTAwNDAwMTIsXG4gICAgZGFya3JlZDogOTEwOTUwNCxcbiAgICBkYXJrc2FsbW9uOiAxNTMwODQxMCxcbiAgICBkYXJrc2VhZ3JlZW46IDk0MTk5MTksXG4gICAgZGFya3NsYXRlYmx1ZTogNDczNDM0NyxcbiAgICBkYXJrc2xhdGVncmF5OiAzMTAwNDk1LFxuICAgIGRhcmtzbGF0ZWdyZXk6IDMxMDA0OTUsXG4gICAgZGFya3R1cnF1b2lzZTogNTI5NDUsXG4gICAgZGFya3Zpb2xldDogOTY5OTUzOSxcbiAgICBkZWVwcGluazogMTY3MTY5NDcsXG4gICAgZGVlcHNreWJsdWU6IDQ5MTUxLFxuICAgIGRpbWdyYXk6IDY5MDgyNjUsXG4gICAgZGltZ3JleTogNjkwODI2NSxcbiAgICBkb2RnZXJibHVlOiAyMDAzMTk5LFxuICAgIGZpcmVicmljazogMTE2NzQxNDYsXG4gICAgZmxvcmFsd2hpdGU6IDE2Nzc1OTIwLFxuICAgIGZvcmVzdGdyZWVuOiAyMjYzODQyLFxuICAgIGZ1Y2hzaWE6IDE2NzExOTM1LFxuICAgIGdhaW5zYm9ybzogMTQ0NzQ0NjAsXG4gICAgZ2hvc3R3aGl0ZTogMTYzMTY2NzEsXG4gICAgZ29sZDogMTY3NjY3MjAsXG4gICAgZ29sZGVucm9kOiAxNDMyOTEyMCxcbiAgICBncmF5OiA4NDIxNTA0LFxuICAgIGdyZWVuOiAzMjc2OCxcbiAgICBncmVlbnllbGxvdzogMTE0MDMwNTUsXG4gICAgZ3JleTogODQyMTUwNCxcbiAgICBob25leWRldzogMTU3OTQxNjAsXG4gICAgaG90cGluazogMTY3Mzg3NDAsXG4gICAgaW5kaWFucmVkOiAxMzQ1ODUyNCxcbiAgICBpbmRpZ286IDQ5MTUzMzAsXG4gICAgaXZvcnk6IDE2Nzc3MjAwLFxuICAgIGtoYWtpOiAxNTc4NzY2MCxcbiAgICBsYXZlbmRlcjogMTUxMzI0MTAsXG4gICAgbGF2ZW5kZXJibHVzaDogMTY3NzMzNjUsXG4gICAgbGF3bmdyZWVuOiA4MTkwOTc2LFxuICAgIGxlbW9uY2hpZmZvbjogMTY3NzU4ODUsXG4gICAgbGlnaHRibHVlOiAxMTM5MzI1NCxcbiAgICBsaWdodGNvcmFsOiAxNTc2MTUzNixcbiAgICBsaWdodGN5YW46IDE0NzQ1NTk5LFxuICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiAxNjQ0ODIxMCxcbiAgICBsaWdodGdyYXk6IDEzODgyMzIzLFxuICAgIGxpZ2h0Z3JlZW46IDk0OTgyNTYsXG4gICAgbGlnaHRncmV5OiAxMzg4MjMyMyxcbiAgICBsaWdodHBpbms6IDE2NzU4NDY1LFxuICAgIGxpZ2h0c2FsbW9uOiAxNjc1Mjc2MixcbiAgICBsaWdodHNlYWdyZWVuOiAyMTQyODkwLFxuICAgIGxpZ2h0c2t5Ymx1ZTogODkwMDM0NixcbiAgICBsaWdodHNsYXRlZ3JheTogNzgzMzc1MyxcbiAgICBsaWdodHNsYXRlZ3JleTogNzgzMzc1MyxcbiAgICBsaWdodHN0ZWVsYmx1ZTogMTE1ODQ3MzQsXG4gICAgbGlnaHR5ZWxsb3c6IDE2Nzc3MTg0LFxuICAgIGxpbWU6IDY1MjgwLFxuICAgIGxpbWVncmVlbjogMzMyOTMzMCxcbiAgICBsaW5lbjogMTY0NDU2NzAsXG4gICAgbWFnZW50YTogMTY3MTE5MzUsXG4gICAgbWFyb29uOiA4Mzg4NjA4LFxuICAgIG1lZGl1bWFxdWFtYXJpbmU6IDY3MzczMjIsXG4gICAgbWVkaXVtYmx1ZTogMjA1LFxuICAgIG1lZGl1bW9yY2hpZDogMTIyMTE2NjcsXG4gICAgbWVkaXVtcHVycGxlOiA5NjYyNjgzLFxuICAgIG1lZGl1bXNlYWdyZWVuOiAzOTc4MDk3LFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogODA4Nzc5MCxcbiAgICBtZWRpdW1zcHJpbmdncmVlbjogNjQxNTQsXG4gICAgbWVkaXVtdHVycXVvaXNlOiA0NzcyMzAwLFxuICAgIG1lZGl1bXZpb2xldHJlZDogMTMwNDcxNzMsXG4gICAgbWlkbmlnaHRibHVlOiAxNjQ0OTEyLFxuICAgIG1pbnRjcmVhbTogMTYxMjE4NTAsXG4gICAgbWlzdHlyb3NlOiAxNjc3MDI3MyxcbiAgICBtb2NjYXNpbjogMTY3NzAyMjksXG4gICAgbmF2YWpvd2hpdGU6IDE2NzY4Njg1LFxuICAgIG5hdnk6IDEyOCxcbiAgICBvbGRsYWNlOiAxNjY0MzU1OCxcbiAgICBvbGl2ZTogODQyMTM3NixcbiAgICBvbGl2ZWRyYWI6IDcwNDg3MzksXG4gICAgb3JhbmdlOiAxNjc1MzkyMCxcbiAgICBvcmFuZ2VyZWQ6IDE2NzI5MzQ0LFxuICAgIG9yY2hpZDogMTQzMTU3MzQsXG4gICAgcGFsZWdvbGRlbnJvZDogMTU2NTcxMzAsXG4gICAgcGFsZWdyZWVuOiAxMDAyNTg4MCxcbiAgICBwYWxldHVycXVvaXNlOiAxMTUyOTk2NixcbiAgICBwYWxldmlvbGV0cmVkOiAxNDM4MTIwMyxcbiAgICBwYXBheWF3aGlwOiAxNjc3MzA3NyxcbiAgICBwZWFjaHB1ZmY6IDE2NzY3NjczLFxuICAgIHBlcnU6IDEzNDY4OTkxLFxuICAgIHBpbms6IDE2NzYxMDM1LFxuICAgIHBsdW06IDE0NTI0NjM3LFxuICAgIHBvd2RlcmJsdWU6IDExNTkxOTEwLFxuICAgIHB1cnBsZTogODM4ODczNixcbiAgICByZWJlY2NhcHVycGxlOiA2Njk3ODgxLFxuICAgIHJlZDogMTY3MTE2ODAsXG4gICAgcm9zeWJyb3duOiAxMjM1NzUxOSxcbiAgICByb3lhbGJsdWU6IDQyODY5NDUsXG4gICAgc2FkZGxlYnJvd246IDkxMjcxODcsXG4gICAgc2FsbW9uOiAxNjQxNjg4MixcbiAgICBzYW5keWJyb3duOiAxNjAzMjg2NCxcbiAgICBzZWFncmVlbjogMzA1MDMyNyxcbiAgICBzZWFzaGVsbDogMTY3NzQ2MzgsXG4gICAgc2llbm5hOiAxMDUwNjc5NyxcbiAgICBzaWx2ZXI6IDEyNjMyMjU2LFxuICAgIHNreWJsdWU6IDg5MDAzMzEsXG4gICAgc2xhdGVibHVlOiA2OTcwMDYxLFxuICAgIHNsYXRlZ3JheTogNzM3Mjk0NCxcbiAgICBzbGF0ZWdyZXk6IDczNzI5NDQsXG4gICAgc25vdzogMTY3NzU5MzAsXG4gICAgc3ByaW5nZ3JlZW46IDY1NDA3LFxuICAgIHN0ZWVsYmx1ZTogNDYyMDk4MCxcbiAgICB0YW46IDEzODA4NzgwLFxuICAgIHRlYWw6IDMyODk2LFxuICAgIHRoaXN0bGU6IDE0MjA0ODg4LFxuICAgIHRvbWF0bzogMTY3MzcwOTUsXG4gICAgdHVycXVvaXNlOiA0MjUxODU2LFxuICAgIHZpb2xldDogMTU2MzEwODYsXG4gICAgd2hlYXQ6IDE2MTEzMzMxLFxuICAgIHdoaXRlOiAxNjc3NzIxNSxcbiAgICB3aGl0ZXNtb2tlOiAxNjExOTI4NSxcbiAgICB5ZWxsb3c6IDE2Nzc2OTYwLFxuICAgIHllbGxvd2dyZWVuOiAxMDE0NTA3NFxuICB9KTtcbiAgZDNfcmdiX25hbWVzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIGQzX3JnYl9uYW1lcy5zZXQoa2V5LCBkM19yZ2JOdW1iZXIodmFsdWUpKTtcbiAgfSk7XG4gIGZ1bmN0aW9uIGQzX2Z1bmN0b3Iodikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gXCJmdW5jdGlvblwiID8gdiA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHY7XG4gICAgfTtcbiAgfVxuICBkMy5mdW5jdG9yID0gZDNfZnVuY3RvcjtcbiAgZDMueGhyID0gZDNfeGhyVHlwZShkM19pZGVudGl0eSk7XG4gIGZ1bmN0aW9uIGQzX3hoclR5cGUocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odXJsLCBtaW1lVHlwZSwgY2FsbGJhY2spIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHR5cGVvZiBtaW1lVHlwZSA9PT0gXCJmdW5jdGlvblwiKSBjYWxsYmFjayA9IG1pbWVUeXBlLCBcbiAgICAgIG1pbWVUeXBlID0gbnVsbDtcbiAgICAgIHJldHVybiBkM194aHIodXJsLCBtaW1lVHlwZSwgcmVzcG9uc2UsIGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX3hocih1cmwsIG1pbWVUeXBlLCByZXNwb25zZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgeGhyID0ge30sIGRpc3BhdGNoID0gZDMuZGlzcGF0Y2goXCJiZWZvcmVzZW5kXCIsIFwicHJvZ3Jlc3NcIiwgXCJsb2FkXCIsIFwiZXJyb3JcIiksIGhlYWRlcnMgPSB7fSwgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpLCByZXNwb25zZVR5cGUgPSBudWxsO1xuICAgIGlmICh0aGlzLlhEb21haW5SZXF1ZXN0ICYmICEoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiByZXF1ZXN0KSAmJiAvXihodHRwKHMpPzopP1xcL1xcLy8udGVzdCh1cmwpKSByZXF1ZXN0ID0gbmV3IFhEb21haW5SZXF1ZXN0KCk7XG4gICAgXCJvbmxvYWRcIiBpbiByZXF1ZXN0ID8gcmVxdWVzdC5vbmxvYWQgPSByZXF1ZXN0Lm9uZXJyb3IgPSByZXNwb25kIDogcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlcXVlc3QucmVhZHlTdGF0ZSA+IDMgJiYgcmVzcG9uZCgpO1xuICAgIH07XG4gICAgZnVuY3Rpb24gcmVzcG9uZCgpIHtcbiAgICAgIHZhciBzdGF0dXMgPSByZXF1ZXN0LnN0YXR1cywgcmVzdWx0O1xuICAgICAgaWYgKCFzdGF0dXMgJiYgZDNfeGhySGFzUmVzcG9uc2UocmVxdWVzdCkgfHwgc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSByZXNwb25zZS5jYWxsKHhociwgcmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkaXNwYXRjaC5lcnJvci5jYWxsKHhociwgZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BhdGNoLmxvYWQuY2FsbCh4aHIsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwYXRjaC5lcnJvci5jYWxsKHhociwgcmVxdWVzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgbyA9IGQzLmV2ZW50O1xuICAgICAgZDMuZXZlbnQgPSBldmVudDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRpc3BhdGNoLnByb2dyZXNzLmNhbGwoeGhyLCByZXF1ZXN0KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzLmV2ZW50ID0gbztcbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5oZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgbmFtZSA9IChuYW1lICsgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGhlYWRlcnNbbmFtZV07XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkgZGVsZXRlIGhlYWRlcnNbbmFtZV07IGVsc2UgaGVhZGVyc1tuYW1lXSA9IHZhbHVlICsgXCJcIjtcbiAgICAgIHJldHVybiB4aHI7XG4gICAgfTtcbiAgICB4aHIubWltZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbWltZVR5cGU7XG4gICAgICBtaW1lVHlwZSA9IHZhbHVlID09IG51bGwgPyBudWxsIDogdmFsdWUgKyBcIlwiO1xuICAgICAgcmV0dXJuIHhocjtcbiAgICB9O1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmVzcG9uc2VUeXBlO1xuICAgICAgcmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gICAgICByZXR1cm4geGhyO1xuICAgIH07XG4gICAgeGhyLnJlc3BvbnNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlc3BvbnNlID0gdmFsdWU7XG4gICAgICByZXR1cm4geGhyO1xuICAgIH07XG4gICAgWyBcImdldFwiLCBcInBvc3RcIiBdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICB4aHJbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geGhyLnNlbmQuYXBwbHkoeGhyLCBbIG1ldGhvZCBdLmNvbmNhdChkM19hcnJheShhcmd1bWVudHMpKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHhoci5zZW5kID0gZnVuY3Rpb24obWV0aG9kLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2sgPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICBpZiAobWltZVR5cGUgIT0gbnVsbCAmJiAhKFwiYWNjZXB0XCIgaW4gaGVhZGVycykpIGhlYWRlcnNbXCJhY2NlcHRcIl0gPSBtaW1lVHlwZSArIFwiLCovKlwiO1xuICAgICAgaWYgKHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcikgZm9yICh2YXIgbmFtZSBpbiBoZWFkZXJzKSByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gICAgICBpZiAobWltZVR5cGUgIT0gbnVsbCAmJiByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUpIHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZSk7XG4gICAgICBpZiAocmVzcG9uc2VUeXBlICE9IG51bGwpIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlO1xuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHhoci5vbihcImVycm9yXCIsIGNhbGxiYWNrKS5vbihcImxvYWRcIiwgZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0KTtcbiAgICAgIH0pO1xuICAgICAgZGlzcGF0Y2guYmVmb3Jlc2VuZC5jYWxsKHhociwgcmVxdWVzdCk7XG4gICAgICByZXF1ZXN0LnNlbmQoZGF0YSA9PSBudWxsID8gbnVsbCA6IGRhdGEpO1xuICAgICAgcmV0dXJuIHhocjtcbiAgICB9O1xuICAgIHhoci5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgcmV0dXJuIHhocjtcbiAgICB9O1xuICAgIGQzLnJlYmluZCh4aHIsIGRpc3BhdGNoLCBcIm9uXCIpO1xuICAgIHJldHVybiBjYWxsYmFjayA9PSBudWxsID8geGhyIDogeGhyLmdldChkM194aHJfZml4Q2FsbGJhY2soY2FsbGJhY2spKTtcbiAgfVxuICBmdW5jdGlvbiBkM194aHJfZml4Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICByZXR1cm4gY2FsbGJhY2subGVuZ3RoID09PSAxID8gZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yID09IG51bGwgPyByZXF1ZXN0IDogbnVsbCk7XG4gICAgfSA6IGNhbGxiYWNrO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3hockhhc1Jlc3BvbnNlKHJlcXVlc3QpIHtcbiAgICB2YXIgdHlwZSA9IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICAgIHJldHVybiB0eXBlICYmIHR5cGUgIT09IFwidGV4dFwiID8gcmVxdWVzdC5yZXNwb25zZSA6IHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuICB9XG4gIGQzLmRzdiA9IGZ1bmN0aW9uKGRlbGltaXRlciwgbWltZVR5cGUpIHtcbiAgICB2YXIgcmVGb3JtYXQgPSBuZXcgUmVnRXhwKCdbXCInICsgZGVsaW1pdGVyICsgXCJcXG5dXCIpLCBkZWxpbWl0ZXJDb2RlID0gZGVsaW1pdGVyLmNoYXJDb2RlQXQoMCk7XG4gICAgZnVuY3Rpb24gZHN2KHVybCwgcm93LCBjYWxsYmFjaykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBjYWxsYmFjayA9IHJvdywgcm93ID0gbnVsbDtcbiAgICAgIHZhciB4aHIgPSBkM194aHIodXJsLCBtaW1lVHlwZSwgcm93ID09IG51bGwgPyByZXNwb25zZSA6IHR5cGVkUmVzcG9uc2Uocm93KSwgY2FsbGJhY2spO1xuICAgICAgeGhyLnJvdyA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB4aHIucmVzcG9uc2UoKHJvdyA9IF8pID09IG51bGwgPyByZXNwb25zZSA6IHR5cGVkUmVzcG9uc2UoXykpIDogcm93O1xuICAgICAgfTtcbiAgICAgIHJldHVybiB4aHI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlcXVlc3QpIHtcbiAgICAgIHJldHVybiBkc3YucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0eXBlZFJlc3BvbnNlKGYpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBkc3YucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQsIGYpO1xuICAgICAgfTtcbiAgICB9XG4gICAgZHN2LnBhcnNlID0gZnVuY3Rpb24odGV4dCwgZikge1xuICAgICAgdmFyIG87XG4gICAgICByZXR1cm4gZHN2LnBhcnNlUm93cyh0ZXh0LCBmdW5jdGlvbihyb3csIGkpIHtcbiAgICAgICAgaWYgKG8pIHJldHVybiBvKHJvdywgaSAtIDEpO1xuICAgICAgICB2YXIgYSA9IG5ldyBGdW5jdGlvbihcImRcIiwgXCJyZXR1cm4ge1wiICsgcm93Lm1hcChmdW5jdGlvbihuYW1lLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgXCI6IGRbXCIgKyBpICsgXCJdXCI7XG4gICAgICAgIH0pLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xuICAgICAgICBvID0gZiA/IGZ1bmN0aW9uKHJvdywgaSkge1xuICAgICAgICAgIHJldHVybiBmKGEocm93KSwgaSk7XG4gICAgICAgIH0gOiBhO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBkc3YucGFyc2VSb3dzID0gZnVuY3Rpb24odGV4dCwgZikge1xuICAgICAgdmFyIEVPTCA9IHt9LCBFT0YgPSB7fSwgcm93cyA9IFtdLCBOID0gdGV4dC5sZW5ndGgsIEkgPSAwLCBuID0gMCwgdCwgZW9sO1xuICAgICAgZnVuY3Rpb24gdG9rZW4oKSB7XG4gICAgICAgIGlmIChJID49IE4pIHJldHVybiBFT0Y7XG4gICAgICAgIGlmIChlb2wpIHJldHVybiBlb2wgPSBmYWxzZSwgRU9MO1xuICAgICAgICB2YXIgaiA9IEk7XG4gICAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoaikgPT09IDM0KSB7XG4gICAgICAgICAgdmFyIGkgPSBqO1xuICAgICAgICAgIHdoaWxlIChpKysgPCBOKSB7XG4gICAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkpID09PSAzNCkge1xuICAgICAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkgKyAxKSAhPT0gMzQpIGJyZWFrO1xuICAgICAgICAgICAgICArK2k7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIEkgPSBpICsgMjtcbiAgICAgICAgICB2YXIgYyA9IHRleHQuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgICAgaWYgKGMgPT09IDEzKSB7XG4gICAgICAgICAgICBlb2wgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpICsgMikgPT09IDEwKSArK0k7XG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAxMCkge1xuICAgICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UoaiArIDEsIGkpLnJlcGxhY2UoL1wiXCIvZywgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKEkgPCBOKSB7XG4gICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoSSsrKSwgayA9IDE7XG4gICAgICAgICAgaWYgKGMgPT09IDEwKSBlb2wgPSB0cnVlOyBlbHNlIGlmIChjID09PSAxMykge1xuICAgICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoSSkgPT09IDEwKSArK0ksICsraztcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgIT09IGRlbGltaXRlckNvZGUpIGNvbnRpbnVlO1xuICAgICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGosIEkgLSBrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShqKTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgodCA9IHRva2VuKCkpICE9PSBFT0YpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgd2hpbGUgKHQgIT09IEVPTCAmJiB0ICE9PSBFT0YpIHtcbiAgICAgICAgICBhLnB1c2godCk7XG4gICAgICAgICAgdCA9IHRva2VuKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYgJiYgKGEgPSBmKGEsIG4rKykpID09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICByb3dzLnB1c2goYSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcm93cztcbiAgICB9O1xuICAgIGRzdi5mb3JtYXQgPSBmdW5jdGlvbihyb3dzKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyb3dzWzBdKSkgcmV0dXJuIGRzdi5mb3JtYXRSb3dzKHJvd3MpO1xuICAgICAgdmFyIGZpZWxkU2V0ID0gbmV3IGQzX1NldCgpLCBmaWVsZHMgPSBbXTtcbiAgICAgIHJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICAgICAgZm9yICh2YXIgZmllbGQgaW4gcm93KSB7XG4gICAgICAgICAgaWYgKCFmaWVsZFNldC5oYXMoZmllbGQpKSB7XG4gICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZFNldC5hZGQoZmllbGQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFsgZmllbGRzLm1hcChmb3JtYXRWYWx1ZSkuam9pbihkZWxpbWl0ZXIpIF0uY29uY2F0KHJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gZmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHJldHVybiBmb3JtYXRWYWx1ZShyb3dbZmllbGRdKTtcbiAgICAgICAgfSkuam9pbihkZWxpbWl0ZXIpO1xuICAgICAgfSkpLmpvaW4oXCJcXG5cIik7XG4gICAgfTtcbiAgICBkc3YuZm9ybWF0Um93cyA9IGZ1bmN0aW9uKHJvd3MpIHtcbiAgICAgIHJldHVybiByb3dzLm1hcChmb3JtYXRSb3cpLmpvaW4oXCJcXG5cIik7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBmb3JtYXRSb3cocm93KSB7XG4gICAgICByZXR1cm4gcm93Lm1hcChmb3JtYXRWYWx1ZSkuam9pbihkZWxpbWl0ZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh0ZXh0KSB7XG4gICAgICByZXR1cm4gcmVGb3JtYXQudGVzdCh0ZXh0KSA/ICdcIicgKyB0ZXh0LnJlcGxhY2UoL1xcXCIvZywgJ1wiXCInKSArICdcIicgOiB0ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gZHN2O1xuICB9O1xuICBkMy5jc3YgPSBkMy5kc3YoXCIsXCIsIFwidGV4dC9jc3ZcIik7XG4gIGQzLnRzdiA9IGQzLmRzdihcIlx0XCIsIFwidGV4dC90YWItc2VwYXJhdGVkLXZhbHVlc1wiKTtcbiAgdmFyIGQzX3RpbWVyX3F1ZXVlSGVhZCwgZDNfdGltZXJfcXVldWVUYWlsLCBkM190aW1lcl9pbnRlcnZhbCwgZDNfdGltZXJfdGltZW91dCwgZDNfdGltZXJfZnJhbWUgPSB0aGlzW2QzX3ZlbmRvclN5bWJvbCh0aGlzLCBcInJlcXVlc3RBbmltYXRpb25GcmFtZVwiKV0gfHwgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAxNyk7XG4gIH07XG4gIGQzLnRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgZDNfdGltZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfdGltZXIoY2FsbGJhY2ssIGRlbGF5LCB0aGVuKSB7XG4gICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChuIDwgMikgZGVsYXkgPSAwO1xuICAgIGlmIChuIDwgMykgdGhlbiA9IERhdGUubm93KCk7XG4gICAgdmFyIHRpbWUgPSB0aGVuICsgZGVsYXksIHRpbWVyID0ge1xuICAgICAgYzogY2FsbGJhY2ssXG4gICAgICB0OiB0aW1lLFxuICAgICAgbjogbnVsbFxuICAgIH07XG4gICAgaWYgKGQzX3RpbWVyX3F1ZXVlVGFpbCkgZDNfdGltZXJfcXVldWVUYWlsLm4gPSB0aW1lcjsgZWxzZSBkM190aW1lcl9xdWV1ZUhlYWQgPSB0aW1lcjtcbiAgICBkM190aW1lcl9xdWV1ZVRhaWwgPSB0aW1lcjtcbiAgICBpZiAoIWQzX3RpbWVyX2ludGVydmFsKSB7XG4gICAgICBkM190aW1lcl90aW1lb3V0ID0gY2xlYXJUaW1lb3V0KGQzX3RpbWVyX3RpbWVvdXQpO1xuICAgICAgZDNfdGltZXJfaW50ZXJ2YWwgPSAxO1xuICAgICAgZDNfdGltZXJfZnJhbWUoZDNfdGltZXJfc3RlcCk7XG4gICAgfVxuICAgIHJldHVybiB0aW1lcjtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lcl9zdGVwKCkge1xuICAgIHZhciBub3cgPSBkM190aW1lcl9tYXJrKCksIGRlbGF5ID0gZDNfdGltZXJfc3dlZXAoKSAtIG5vdztcbiAgICBpZiAoZGVsYXkgPiAyNCkge1xuICAgICAgaWYgKGlzRmluaXRlKGRlbGF5KSkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZDNfdGltZXJfdGltZW91dCk7XG4gICAgICAgIGQzX3RpbWVyX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGQzX3RpbWVyX3N0ZXAsIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGQzX3RpbWVyX2ludGVydmFsID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZDNfdGltZXJfaW50ZXJ2YWwgPSAxO1xuICAgICAgZDNfdGltZXJfZnJhbWUoZDNfdGltZXJfc3RlcCk7XG4gICAgfVxuICB9XG4gIGQzLnRpbWVyLmZsdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgZDNfdGltZXJfbWFyaygpO1xuICAgIGQzX3RpbWVyX3N3ZWVwKCk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3RpbWVyX21hcmsoKSB7XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCksIHRpbWVyID0gZDNfdGltZXJfcXVldWVIZWFkO1xuICAgIHdoaWxlICh0aW1lcikge1xuICAgICAgaWYgKG5vdyA+PSB0aW1lci50ICYmIHRpbWVyLmMobm93IC0gdGltZXIudCkpIHRpbWVyLmMgPSBudWxsO1xuICAgICAgdGltZXIgPSB0aW1lci5uO1xuICAgIH1cbiAgICByZXR1cm4gbm93O1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVyX3N3ZWVwKCkge1xuICAgIHZhciB0MCwgdDEgPSBkM190aW1lcl9xdWV1ZUhlYWQsIHRpbWUgPSBJbmZpbml0eTtcbiAgICB3aGlsZSAodDEpIHtcbiAgICAgIGlmICh0MS5jKSB7XG4gICAgICAgIGlmICh0MS50IDwgdGltZSkgdGltZSA9IHQxLnQ7XG4gICAgICAgIHQxID0gKHQwID0gdDEpLm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0MSA9IHQwID8gdDAubiA9IHQxLm4gOiBkM190aW1lcl9xdWV1ZUhlYWQgPSB0MS5uO1xuICAgICAgfVxuICAgIH1cbiAgICBkM190aW1lcl9xdWV1ZVRhaWwgPSB0MDtcbiAgICByZXR1cm4gdGltZTtcbiAgfVxuICBmdW5jdGlvbiBkM19mb3JtYXRfcHJlY2lzaW9uKHgsIHApIHtcbiAgICByZXR1cm4gcCAtICh4ID8gTWF0aC5jZWlsKE1hdGgubG9nKHgpIC8gTWF0aC5MTjEwKSA6IDEpO1xuICB9XG4gIGQzLnJvdW5kID0gZnVuY3Rpb24oeCwgbikge1xuICAgIHJldHVybiBuID8gTWF0aC5yb3VuZCh4ICogKG4gPSBNYXRoLnBvdygxMCwgbikpKSAvIG4gOiBNYXRoLnJvdW5kKHgpO1xuICB9O1xuICB2YXIgZDNfZm9ybWF0UHJlZml4ZXMgPSBbIFwieVwiLCBcInpcIiwgXCJhXCIsIFwiZlwiLCBcInBcIiwgXCJuXCIsIFwiwrVcIiwgXCJtXCIsIFwiXCIsIFwia1wiLCBcIk1cIiwgXCJHXCIsIFwiVFwiLCBcIlBcIiwgXCJFXCIsIFwiWlwiLCBcIllcIiBdLm1hcChkM19mb3JtYXRQcmVmaXgpO1xuICBkMy5mb3JtYXRQcmVmaXggPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIGlmICh2YWx1ZSA9ICt2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgKj0gLTE7XG4gICAgICBpZiAocHJlY2lzaW9uKSB2YWx1ZSA9IGQzLnJvdW5kKHZhbHVlLCBkM19mb3JtYXRfcHJlY2lzaW9uKHZhbHVlLCBwcmVjaXNpb24pKTtcbiAgICAgIGkgPSAxICsgTWF0aC5mbG9vcigxZS0xMiArIE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4xMCk7XG4gICAgICBpID0gTWF0aC5tYXgoLTI0LCBNYXRoLm1pbigyNCwgTWF0aC5mbG9vcigoaSAtIDEpIC8gMykgKiAzKSk7XG4gICAgfVxuICAgIHJldHVybiBkM19mb3JtYXRQcmVmaXhlc1s4ICsgaSAvIDNdO1xuICB9O1xuICBmdW5jdGlvbiBkM19mb3JtYXRQcmVmaXgoZCwgaSkge1xuICAgIHZhciBrID0gTWF0aC5wb3coMTAsIGFicyg4IC0gaSkgKiAzKTtcbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGU6IGkgPiA4ID8gZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZCAvIGs7XG4gICAgICB9IDogZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZCAqIGs7XG4gICAgICB9LFxuICAgICAgc3ltYm9sOiBkXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19sb2NhbGVfbnVtYmVyRm9ybWF0KGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVfZGVjaW1hbCA9IGxvY2FsZS5kZWNpbWFsLCBsb2NhbGVfdGhvdXNhbmRzID0gbG9jYWxlLnRob3VzYW5kcywgbG9jYWxlX2dyb3VwaW5nID0gbG9jYWxlLmdyb3VwaW5nLCBsb2NhbGVfY3VycmVuY3kgPSBsb2NhbGUuY3VycmVuY3ksIGZvcm1hdEdyb3VwID0gbG9jYWxlX2dyb3VwaW5nICYmIGxvY2FsZV90aG91c2FuZHMgPyBmdW5jdGlvbih2YWx1ZSwgd2lkdGgpIHtcbiAgICAgIHZhciBpID0gdmFsdWUubGVuZ3RoLCB0ID0gW10sIGogPSAwLCBnID0gbG9jYWxlX2dyb3VwaW5nWzBdLCBsZW5ndGggPSAwO1xuICAgICAgd2hpbGUgKGkgPiAwICYmIGcgPiAwKSB7XG4gICAgICAgIGlmIChsZW5ndGggKyBnICsgMSA+IHdpZHRoKSBnID0gTWF0aC5tYXgoMSwgd2lkdGggLSBsZW5ndGgpO1xuICAgICAgICB0LnB1c2godmFsdWUuc3Vic3RyaW5nKGkgLT0gZywgaSArIGcpKTtcbiAgICAgICAgaWYgKChsZW5ndGggKz0gZyArIDEpID4gd2lkdGgpIGJyZWFrO1xuICAgICAgICBnID0gbG9jYWxlX2dyb3VwaW5nW2ogPSAoaiArIDEpICUgbG9jYWxlX2dyb3VwaW5nLmxlbmd0aF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdC5yZXZlcnNlKCkuam9pbihsb2NhbGVfdGhvdXNhbmRzKTtcbiAgICB9IDogZDNfaWRlbnRpdHk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIG1hdGNoID0gZDNfZm9ybWF0X3JlLmV4ZWMoc3BlY2lmaWVyKSwgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLCBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLCBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsIHpmaWxsID0gbWF0Y2hbNV0sIHdpZHRoID0gK21hdGNoWzZdLCBjb21tYSA9IG1hdGNoWzddLCBwcmVjaXNpb24gPSBtYXRjaFs4XSwgdHlwZSA9IG1hdGNoWzldLCBzY2FsZSA9IDEsIHByZWZpeCA9IFwiXCIsIHN1ZmZpeCA9IFwiXCIsIGludGVnZXIgPSBmYWxzZSwgZXhwb25lbnQgPSB0cnVlO1xuICAgICAgaWYgKHByZWNpc2lvbikgcHJlY2lzaW9uID0gK3ByZWNpc2lvbi5zdWJzdHJpbmcoMSk7XG4gICAgICBpZiAoemZpbGwgfHwgZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSB7XG4gICAgICAgIHpmaWxsID0gZmlsbCA9IFwiMFwiO1xuICAgICAgICBhbGlnbiA9IFwiPVwiO1xuICAgICAgfVxuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgY2FzZSBcIm5cIjpcbiAgICAgICAgY29tbWEgPSB0cnVlO1xuICAgICAgICB0eXBlID0gXCJnXCI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgc2NhbGUgPSAxMDA7XG4gICAgICAgIHN1ZmZpeCA9IFwiJVwiO1xuICAgICAgICB0eXBlID0gXCJmXCI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAgY2FzZSBcInBcIjpcbiAgICAgICAgc2NhbGUgPSAxMDA7XG4gICAgICAgIHN1ZmZpeCA9IFwiJVwiO1xuICAgICAgICB0eXBlID0gXCJyXCI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAgY2FzZSBcImJcIjpcbiAgICAgICBjYXNlIFwib1wiOlxuICAgICAgIGNhc2UgXCJ4XCI6XG4gICAgICAgY2FzZSBcIlhcIjpcbiAgICAgICAgaWYgKHN5bWJvbCA9PT0gXCIjXCIpIHByZWZpeCA9IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgY2FzZSBcImNcIjpcbiAgICAgICAgZXhwb25lbnQgPSBmYWxzZTtcblxuICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgIGludGVnZXIgPSB0cnVlO1xuICAgICAgICBwcmVjaXNpb24gPSAwO1xuICAgICAgICBicmVhaztcblxuICAgICAgIGNhc2UgXCJzXCI6XG4gICAgICAgIHNjYWxlID0gLTE7XG4gICAgICAgIHR5cGUgPSBcInJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoc3ltYm9sID09PSBcIiRcIikgcHJlZml4ID0gbG9jYWxlX2N1cnJlbmN5WzBdLCBzdWZmaXggPSBsb2NhbGVfY3VycmVuY3lbMV07XG4gICAgICBpZiAodHlwZSA9PSBcInJcIiAmJiAhcHJlY2lzaW9uKSB0eXBlID0gXCJnXCI7XG4gICAgICBpZiAocHJlY2lzaW9uICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJnXCIpIHByZWNpc2lvbiA9IE1hdGgubWF4KDEsIE1hdGgubWluKDIxLCBwcmVjaXNpb24pKTsgZWxzZSBpZiAodHlwZSA9PSBcImVcIiB8fCB0eXBlID09IFwiZlwiKSBwcmVjaXNpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG4gICAgICB9XG4gICAgICB0eXBlID0gZDNfZm9ybWF0X3R5cGVzLmdldCh0eXBlKSB8fCBkM19mb3JtYXRfdHlwZURlZmF1bHQ7XG4gICAgICB2YXIgemNvbW1hID0gemZpbGwgJiYgY29tbWE7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIGZ1bGxTdWZmaXggPSBzdWZmaXg7XG4gICAgICAgIGlmIChpbnRlZ2VyICYmIHZhbHVlICUgMSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHZhciBuZWdhdGl2ZSA9IHZhbHVlIDwgMCB8fCB2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwID8gKHZhbHVlID0gLXZhbHVlLCBcIi1cIikgOiBzaWduID09PSBcIi1cIiA/IFwiXCIgOiBzaWduO1xuICAgICAgICBpZiAoc2NhbGUgPCAwKSB7XG4gICAgICAgICAgdmFyIHVuaXQgPSBkMy5mb3JtYXRQcmVmaXgodmFsdWUsIHByZWNpc2lvbik7XG4gICAgICAgICAgdmFsdWUgPSB1bml0LnNjYWxlKHZhbHVlKTtcbiAgICAgICAgICBmdWxsU3VmZml4ID0gdW5pdC5zeW1ib2wgKyBzdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgKj0gc2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSB0eXBlKHZhbHVlLCBwcmVjaXNpb24pO1xuICAgICAgICB2YXIgaSA9IHZhbHVlLmxhc3RJbmRleE9mKFwiLlwiKSwgYmVmb3JlLCBhZnRlcjtcbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgdmFyIGogPSBleHBvbmVudCA/IHZhbHVlLmxhc3RJbmRleE9mKFwiZVwiKSA6IC0xO1xuICAgICAgICAgIGlmIChqIDwgMCkgYmVmb3JlID0gdmFsdWUsIGFmdGVyID0gXCJcIjsgZWxzZSBiZWZvcmUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgaiksIGFmdGVyID0gdmFsdWUuc3Vic3RyaW5nKGopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZm9yZSA9IHZhbHVlLnN1YnN0cmluZygwLCBpKTtcbiAgICAgICAgICBhZnRlciA9IGxvY2FsZV9kZWNpbWFsICsgdmFsdWUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXpmaWxsICYmIGNvbW1hKSBiZWZvcmUgPSBmb3JtYXRHcm91cChiZWZvcmUsIEluZmluaXR5KTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHByZWZpeC5sZW5ndGggKyBiZWZvcmUubGVuZ3RoICsgYWZ0ZXIubGVuZ3RoICsgKHpjb21tYSA/IDAgOiBuZWdhdGl2ZS5sZW5ndGgpLCBwYWRkaW5nID0gbGVuZ3RoIDwgd2lkdGggPyBuZXcgQXJyYXkobGVuZ3RoID0gd2lkdGggLSBsZW5ndGggKyAxKS5qb2luKGZpbGwpIDogXCJcIjtcbiAgICAgICAgaWYgKHpjb21tYSkgYmVmb3JlID0gZm9ybWF0R3JvdXAocGFkZGluZyArIGJlZm9yZSwgcGFkZGluZy5sZW5ndGggPyB3aWR0aCAtIGFmdGVyLmxlbmd0aCA6IEluZmluaXR5KTtcbiAgICAgICAgbmVnYXRpdmUgKz0gcHJlZml4O1xuICAgICAgICB2YWx1ZSA9IGJlZm9yZSArIGFmdGVyO1xuICAgICAgICByZXR1cm4gKGFsaWduID09PSBcIjxcIiA/IG5lZ2F0aXZlICsgdmFsdWUgKyBwYWRkaW5nIDogYWxpZ24gPT09IFwiPlwiID8gcGFkZGluZyArIG5lZ2F0aXZlICsgdmFsdWUgOiBhbGlnbiA9PT0gXCJeXCIgPyBwYWRkaW5nLnN1YnN0cmluZygwLCBsZW5ndGggPj49IDEpICsgbmVnYXRpdmUgKyB2YWx1ZSArIHBhZGRpbmcuc3Vic3RyaW5nKGxlbmd0aCkgOiBuZWdhdGl2ZSArICh6Y29tbWEgPyB2YWx1ZSA6IHBhZGRpbmcgKyB2YWx1ZSkpICsgZnVsbFN1ZmZpeDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICB2YXIgZDNfZm9ybWF0X3JlID0gLyg/OihbXntdKT8oWzw+PV5dKSk/KFsrXFwtIF0pPyhbJCNdKT8oMCk/KFxcZCspPygsKT8oXFwuLT9cXGQrKT8oW2EteiVdKT8vaTtcbiAgdmFyIGQzX2Zvcm1hdF90eXBlcyA9IGQzLm1hcCh7XG4gICAgYjogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHgudG9TdHJpbmcoMik7XG4gICAgfSxcbiAgICBjOiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh4KTtcbiAgICB9LFxuICAgIG86IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB4LnRvU3RyaW5nKDgpO1xuICAgIH0sXG4gICAgeDogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHgudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICAgWDogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHgudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgfSxcbiAgICBnOiBmdW5jdGlvbih4LCBwKSB7XG4gICAgICByZXR1cm4geC50b1ByZWNpc2lvbihwKTtcbiAgICB9LFxuICAgIGU6IGZ1bmN0aW9uKHgsIHApIHtcbiAgICAgIHJldHVybiB4LnRvRXhwb25lbnRpYWwocCk7XG4gICAgfSxcbiAgICBmOiBmdW5jdGlvbih4LCBwKSB7XG4gICAgICByZXR1cm4geC50b0ZpeGVkKHApO1xuICAgIH0sXG4gICAgcjogZnVuY3Rpb24oeCwgcCkge1xuICAgICAgcmV0dXJuICh4ID0gZDMucm91bmQoeCwgZDNfZm9ybWF0X3ByZWNpc2lvbih4LCBwKSkpLnRvRml4ZWQoTWF0aC5tYXgoMCwgTWF0aC5taW4oMjAsIGQzX2Zvcm1hdF9wcmVjaXNpb24oeCAqICgxICsgMWUtMTUpLCBwKSkpKTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBkM19mb3JtYXRfdHlwZURlZmF1bHQoeCkge1xuICAgIHJldHVybiB4ICsgXCJcIjtcbiAgfVxuICB2YXIgZDNfdGltZSA9IGQzLnRpbWUgPSB7fSwgZDNfZGF0ZSA9IERhdGU7XG4gIGZ1bmN0aW9uIGQzX2RhdGVfdXRjKCkge1xuICAgIHRoaXMuXyA9IG5ldyBEYXRlKGFyZ3VtZW50cy5sZW5ndGggPiAxID8gRGF0ZS5VVEMuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGFyZ3VtZW50c1swXSk7XG4gIH1cbiAgZDNfZGF0ZV91dGMucHJvdG90eXBlID0ge1xuICAgIGdldERhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuXy5nZXRVVENEYXRlKCk7XG4gICAgfSxcbiAgICBnZXREYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuXy5nZXRVVENEYXkoKTtcbiAgICB9LFxuICAgIGdldEZ1bGxZZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl8uZ2V0VVRDRnVsbFllYXIoKTtcbiAgICB9LFxuICAgIGdldEhvdXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl8uZ2V0VVRDSG91cnMoKTtcbiAgICB9LFxuICAgIGdldE1pbGxpc2Vjb25kczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICAgIH0sXG4gICAgZ2V0TWludXRlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB9LFxuICAgIGdldE1vbnRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl8uZ2V0VVRDTW9udGgoKTtcbiAgICB9LFxuICAgIGdldFNlY29uZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuXy5nZXRVVENTZWNvbmRzKCk7XG4gICAgfSxcbiAgICBnZXRUaW1lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl8uZ2V0VGltZSgpO1xuICAgIH0sXG4gICAgZ2V0VGltZXpvbmVPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICB2YWx1ZU9mOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl8udmFsdWVPZigpO1xuICAgIH0sXG4gICAgc2V0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBkM190aW1lX3Byb3RvdHlwZS5zZXRVVENEYXRlLmFwcGx5KHRoaXMuXywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNldERheTogZnVuY3Rpb24oKSB7XG4gICAgICBkM190aW1lX3Byb3RvdHlwZS5zZXRVVENEYXkuYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2V0RnVsbFllYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfdGltZV9wcm90b3R5cGUuc2V0VVRDRnVsbFllYXIuYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2V0SG91cnM6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfdGltZV9wcm90b3R5cGUuc2V0VVRDSG91cnMuYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2V0TWlsbGlzZWNvbmRzOiBmdW5jdGlvbigpIHtcbiAgICAgIGQzX3RpbWVfcHJvdG90eXBlLnNldFVUQ01pbGxpc2Vjb25kcy5hcHBseSh0aGlzLl8sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzZXRNaW51dGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIGQzX3RpbWVfcHJvdG90eXBlLnNldFVUQ01pbnV0ZXMuYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2V0TW9udGg6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfdGltZV9wcm90b3R5cGUuc2V0VVRDTW9udGguYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2V0U2Vjb25kczogZnVuY3Rpb24oKSB7XG4gICAgICBkM190aW1lX3Byb3RvdHlwZS5zZXRVVENTZWNvbmRzLmFwcGx5KHRoaXMuXywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNldFRpbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfdGltZV9wcm90b3R5cGUuc2V0VGltZS5hcHBseSh0aGlzLl8sIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuICB2YXIgZDNfdGltZV9wcm90b3R5cGUgPSBEYXRlLnByb3RvdHlwZTtcbiAgZnVuY3Rpb24gZDNfdGltZV9pbnRlcnZhbChsb2NhbCwgc3RlcCwgbnVtYmVyKSB7XG4gICAgZnVuY3Rpb24gcm91bmQoZGF0ZSkge1xuICAgICAgdmFyIGQwID0gbG9jYWwoZGF0ZSksIGQxID0gb2Zmc2V0KGQwLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjZWlsKGRhdGUpIHtcbiAgICAgIHN0ZXAoZGF0ZSA9IGxvY2FsKG5ldyBkM19kYXRlKGRhdGUgLSAxKSksIDEpO1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9mZnNldChkYXRlLCBrKSB7XG4gICAgICBzdGVwKGRhdGUgPSBuZXcgZDNfZGF0ZSgrZGF0ZSksIGspO1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmdlKHQwLCB0MSwgZHQpIHtcbiAgICAgIHZhciB0aW1lID0gY2VpbCh0MCksIHRpbWVzID0gW107XG4gICAgICBpZiAoZHQgPiAxKSB7XG4gICAgICAgIHdoaWxlICh0aW1lIDwgdDEpIHtcbiAgICAgICAgICBpZiAoIShudW1iZXIodGltZSkgJSBkdCkpIHRpbWVzLnB1c2gobmV3IERhdGUoK3RpbWUpKTtcbiAgICAgICAgICBzdGVwKHRpbWUsIDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAodGltZSA8IHQxKSB0aW1lcy5wdXNoKG5ldyBEYXRlKCt0aW1lKSksIHN0ZXAodGltZSwgMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGltZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmdlX3V0Yyh0MCwgdDEsIGR0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBkM19kYXRlID0gZDNfZGF0ZV91dGM7XG4gICAgICAgIHZhciB1dGMgPSBuZXcgZDNfZGF0ZV91dGMoKTtcbiAgICAgICAgdXRjLl8gPSB0MDtcbiAgICAgICAgcmV0dXJuIHJhbmdlKHV0YywgdDEsIGR0KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzX2RhdGUgPSBEYXRlO1xuICAgICAgfVxuICAgIH1cbiAgICBsb2NhbC5mbG9vciA9IGxvY2FsO1xuICAgIGxvY2FsLnJvdW5kID0gcm91bmQ7XG4gICAgbG9jYWwuY2VpbCA9IGNlaWw7XG4gICAgbG9jYWwub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIGxvY2FsLnJhbmdlID0gcmFuZ2U7XG4gICAgdmFyIHV0YyA9IGxvY2FsLnV0YyA9IGQzX3RpbWVfaW50ZXJ2YWxfdXRjKGxvY2FsKTtcbiAgICB1dGMuZmxvb3IgPSB1dGM7XG4gICAgdXRjLnJvdW5kID0gZDNfdGltZV9pbnRlcnZhbF91dGMocm91bmQpO1xuICAgIHV0Yy5jZWlsID0gZDNfdGltZV9pbnRlcnZhbF91dGMoY2VpbCk7XG4gICAgdXRjLm9mZnNldCA9IGQzX3RpbWVfaW50ZXJ2YWxfdXRjKG9mZnNldCk7XG4gICAgdXRjLnJhbmdlID0gcmFuZ2VfdXRjO1xuICAgIHJldHVybiBsb2NhbDtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX2ludGVydmFsX3V0YyhtZXRob2QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZGF0ZSwgaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZDNfZGF0ZSA9IGQzX2RhdGVfdXRjO1xuICAgICAgICB2YXIgdXRjID0gbmV3IGQzX2RhdGVfdXRjKCk7XG4gICAgICAgIHV0Yy5fID0gZGF0ZTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZCh1dGMsIGspLl87XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBkM19kYXRlID0gRGF0ZTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGQzX3RpbWUueWVhciA9IGQzX3RpbWVfaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUgPSBkM190aW1lLmRheShkYXRlKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICAgIHJldHVybiBkYXRlO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICB9KTtcbiAgZDNfdGltZS55ZWFycyA9IGQzX3RpbWUueWVhci5yYW5nZTtcbiAgZDNfdGltZS55ZWFycy51dGMgPSBkM190aW1lLnllYXIudXRjLnJhbmdlO1xuICBkM190aW1lLmRheSA9IGQzX3RpbWVfaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXkgPSBuZXcgZDNfZGF0ZSgyZTMsIDApO1xuICAgIGRheS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkpO1xuICAgIHJldHVybiBkYXk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXREYXRlKCkgLSAxO1xuICB9KTtcbiAgZDNfdGltZS5kYXlzID0gZDNfdGltZS5kYXkucmFuZ2U7XG4gIGQzX3RpbWUuZGF5cy51dGMgPSBkM190aW1lLmRheS51dGMucmFuZ2U7XG4gIGQzX3RpbWUuZGF5T2ZZZWFyID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciB5ZWFyID0gZDNfdGltZS55ZWFyKGRhdGUpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKChkYXRlIC0geWVhciAtIChkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgLSB5ZWFyLmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1KTtcbiAgfTtcbiAgWyBcInN1bmRheVwiLCBcIm1vbmRheVwiLCBcInR1ZXNkYXlcIiwgXCJ3ZWRuZXNkYXlcIiwgXCJ0aHVyc2RheVwiLCBcImZyaWRheVwiLCBcInNhdHVyZGF5XCIgXS5mb3JFYWNoKGZ1bmN0aW9uKGRheSwgaSkge1xuICAgIGkgPSA3IC0gaTtcbiAgICB2YXIgaW50ZXJ2YWwgPSBkM190aW1lW2RheV0gPSBkM190aW1lX2ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIChkYXRlID0gZDNfdGltZS5kYXkoZGF0ZSkpLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIGkpICUgNyk7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIE1hdGguZmxvb3Iob2Zmc2V0KSAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBkYXkgPSBkM190aW1lLnllYXIoZGF0ZSkuZ2V0RGF5KCk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoZDNfdGltZS5kYXlPZlllYXIoZGF0ZSkgKyAoZGF5ICsgaSkgJSA3KSAvIDcpIC0gKGRheSAhPT0gaSk7XG4gICAgfSk7XG4gICAgZDNfdGltZVtkYXkgKyBcInNcIl0gPSBpbnRlcnZhbC5yYW5nZTtcbiAgICBkM190aW1lW2RheSArIFwic1wiXS51dGMgPSBpbnRlcnZhbC51dGMucmFuZ2U7XG4gICAgZDNfdGltZVtkYXkgKyBcIk9mWWVhclwiXSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBkYXkgPSBkM190aW1lLnllYXIoZGF0ZSkuZ2V0RGF5KCk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoZDNfdGltZS5kYXlPZlllYXIoZGF0ZSkgKyAoZGF5ICsgaSkgJSA3KSAvIDcpO1xuICAgIH07XG4gIH0pO1xuICBkM190aW1lLndlZWsgPSBkM190aW1lLnN1bmRheTtcbiAgZDNfdGltZS53ZWVrcyA9IGQzX3RpbWUuc3VuZGF5LnJhbmdlO1xuICBkM190aW1lLndlZWtzLnV0YyA9IGQzX3RpbWUuc3VuZGF5LnV0Yy5yYW5nZTtcbiAgZDNfdGltZS53ZWVrT2ZZZWFyID0gZDNfdGltZS5zdW5kYXlPZlllYXI7XG4gIGZ1bmN0aW9uIGQzX2xvY2FsZV90aW1lRm9ybWF0KGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsIGxvY2FsZV90aW1lID0gbG9jYWxlLnRpbWUsIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsIGxvY2FsZV9kYXlzID0gbG9jYWxlLmRheXMsIGxvY2FsZV9zaG9ydERheXMgPSBsb2NhbGUuc2hvcnREYXlzLCBsb2NhbGVfbW9udGhzID0gbG9jYWxlLm1vbnRocywgbG9jYWxlX3Nob3J0TW9udGhzID0gbG9jYWxlLnNob3J0TW9udGhzO1xuICAgIGZ1bmN0aW9uIGQzX3RpbWVfZm9ybWF0KHRlbXBsYXRlKSB7XG4gICAgICB2YXIgbiA9IHRlbXBsYXRlLmxlbmd0aDtcbiAgICAgIGZ1bmN0aW9uIGZvcm1hdChkYXRlKSB7XG4gICAgICAgIHZhciBzdHJpbmcgPSBbXSwgaSA9IC0xLCBqID0gMCwgYywgcCwgZjtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAodGVtcGxhdGUuY2hhckNvZGVBdChpKSA9PT0gMzcpIHtcbiAgICAgICAgICAgIHN0cmluZy5wdXNoKHRlbXBsYXRlLnNsaWNlKGosIGkpKTtcbiAgICAgICAgICAgIGlmICgocCA9IGQzX3RpbWVfZm9ybWF0UGFkc1tjID0gdGVtcGxhdGUuY2hhckF0KCsraSldKSAhPSBudWxsKSBjID0gdGVtcGxhdGUuY2hhckF0KCsraSk7XG4gICAgICAgICAgICBpZiAoZiA9IGQzX3RpbWVfZm9ybWF0c1tjXSkgYyA9IGYoZGF0ZSwgcCA9PSBudWxsID8gYyA9PT0gXCJlXCIgPyBcIiBcIiA6IFwiMFwiIDogcCk7XG4gICAgICAgICAgICBzdHJpbmcucHVzaChjKTtcbiAgICAgICAgICAgIGogPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RyaW5nLnB1c2godGVtcGxhdGUuc2xpY2UoaiwgaSkpO1xuICAgICAgICByZXR1cm4gc3RyaW5nLmpvaW4oXCJcIik7XG4gICAgICB9XG4gICAgICBmb3JtYXQucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgdmFyIGQgPSB7XG4gICAgICAgICAgeTogMTkwMCxcbiAgICAgICAgICBtOiAwLFxuICAgICAgICAgIGQ6IDEsXG4gICAgICAgICAgSDogMCxcbiAgICAgICAgICBNOiAwLFxuICAgICAgICAgIFM6IDAsXG4gICAgICAgICAgTDogMCxcbiAgICAgICAgICBaOiBudWxsXG4gICAgICAgIH0sIGkgPSBkM190aW1lX3BhcnNlKGQsIHRlbXBsYXRlLCBzdHJpbmcsIDApO1xuICAgICAgICBpZiAoaSAhPSBzdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICAgICAgaWYgKFwicFwiIGluIGQpIGQuSCA9IGQuSCAlIDEyICsgZC5wICogMTI7XG4gICAgICAgIHZhciBsb2NhbFogPSBkLlogIT0gbnVsbCAmJiBkM19kYXRlICE9PSBkM19kYXRlX3V0YywgZGF0ZSA9IG5ldyAobG9jYWxaID8gZDNfZGF0ZV91dGMgOiBkM19kYXRlKSgpO1xuICAgICAgICBpZiAoXCJqXCIgaW4gZCkgZGF0ZS5zZXRGdWxsWWVhcihkLnksIDAsIGQuaik7IGVsc2UgaWYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkge1xuICAgICAgICAgIGlmICghKFwid1wiIGluIGQpKSBkLncgPSBcIldcIiBpbiBkID8gMSA6IDA7XG4gICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcihkLnksIDAsIDEpO1xuICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoZC55LCAwLCBcIldcIiBpbiBkID8gKGQudyArIDYpICUgNyArIGQuVyAqIDcgLSAoZGF0ZS5nZXREYXkoKSArIDUpICUgNyA6IGQudyArIGQuVSAqIDcgLSAoZGF0ZS5nZXREYXkoKSArIDYpICUgNyk7XG4gICAgICAgIH0gZWxzZSBkYXRlLnNldEZ1bGxZZWFyKGQueSwgZC5tLCBkLmQpO1xuICAgICAgICBkYXRlLnNldEhvdXJzKGQuSCArIChkLlogLyAxMDAgfCAwKSwgZC5NICsgZC5aICUgMTAwLCBkLlMsIGQuTCk7XG4gICAgICAgIHJldHVybiBsb2NhbFogPyBkYXRlLl8gOiBkYXRlO1xuICAgICAgfTtcbiAgICAgIGZvcm1hdC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZShkYXRlLCB0ZW1wbGF0ZSwgc3RyaW5nLCBqKSB7XG4gICAgICB2YXIgYywgcCwgdCwgaSA9IDAsIG4gPSB0ZW1wbGF0ZS5sZW5ndGgsIG0gPSBzdHJpbmcubGVuZ3RoO1xuICAgICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICAgIGlmIChqID49IG0pIHJldHVybiAtMTtcbiAgICAgICAgYyA9IHRlbXBsYXRlLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgICAgdCA9IHRlbXBsYXRlLmNoYXJBdChpKyspO1xuICAgICAgICAgIHAgPSBkM190aW1lX3BhcnNlcnNbdCBpbiBkM190aW1lX2Zvcm1hdFBhZHMgPyB0ZW1wbGF0ZS5jaGFyQXQoaSsrKSA6IHRdO1xuICAgICAgICAgIGlmICghcCB8fCAoaiA9IHAoZGF0ZSwgc3RyaW5nLCBqKSkgPCAwKSByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYyAhPSBzdHJpbmcuY2hhckNvZGVBdChqKyspKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gajtcbiAgICB9XG4gICAgZDNfdGltZV9mb3JtYXQudXRjID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgIHZhciBsb2NhbCA9IGQzX3RpbWVfZm9ybWF0KHRlbXBsYXRlKTtcbiAgICAgIGZ1bmN0aW9uIGZvcm1hdChkYXRlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZDNfZGF0ZSA9IGQzX2RhdGVfdXRjO1xuICAgICAgICAgIHZhciB1dGMgPSBuZXcgZDNfZGF0ZSgpO1xuICAgICAgICAgIHV0Yy5fID0gZGF0ZTtcbiAgICAgICAgICByZXR1cm4gbG9jYWwodXRjKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBkM19kYXRlID0gRGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9ybWF0LnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZDNfZGF0ZSA9IGQzX2RhdGVfdXRjO1xuICAgICAgICAgIHZhciBkYXRlID0gbG9jYWwucGFyc2Uoc3RyaW5nKTtcbiAgICAgICAgICByZXR1cm4gZGF0ZSAmJiBkYXRlLl87XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgZDNfZGF0ZSA9IERhdGU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBmb3JtYXQudG9TdHJpbmcgPSBsb2NhbC50b1N0cmluZztcbiAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfTtcbiAgICBkM190aW1lX2Zvcm1hdC5tdWx0aSA9IGQzX3RpbWVfZm9ybWF0LnV0Yy5tdWx0aSA9IGQzX3RpbWVfZm9ybWF0TXVsdGk7XG4gICAgdmFyIGQzX3RpbWVfcGVyaW9kTG9va3VwID0gZDMubWFwKCksIGQzX3RpbWVfZGF5UmUgPSBkM190aW1lX2Zvcm1hdFJlKGxvY2FsZV9kYXlzKSwgZDNfdGltZV9kYXlMb29rdXAgPSBkM190aW1lX2Zvcm1hdExvb2t1cChsb2NhbGVfZGF5cyksIGQzX3RpbWVfZGF5QWJicmV2UmUgPSBkM190aW1lX2Zvcm1hdFJlKGxvY2FsZV9zaG9ydERheXMpLCBkM190aW1lX2RheUFiYnJldkxvb2t1cCA9IGQzX3RpbWVfZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydERheXMpLCBkM190aW1lX21vbnRoUmUgPSBkM190aW1lX2Zvcm1hdFJlKGxvY2FsZV9tb250aHMpLCBkM190aW1lX21vbnRoTG9va3VwID0gZDNfdGltZV9mb3JtYXRMb29rdXAobG9jYWxlX21vbnRocyksIGQzX3RpbWVfbW9udGhBYmJyZXZSZSA9IGQzX3RpbWVfZm9ybWF0UmUobG9jYWxlX3Nob3J0TW9udGhzKSwgZDNfdGltZV9tb250aEFiYnJldkxvb2t1cCA9IGQzX3RpbWVfZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydE1vbnRocyk7XG4gICAgbG9jYWxlX3BlcmlvZHMuZm9yRWFjaChmdW5jdGlvbihwLCBpKSB7XG4gICAgICBkM190aW1lX3BlcmlvZExvb2t1cC5zZXQocC50b0xvd2VyQ2FzZSgpLCBpKTtcbiAgICB9KTtcbiAgICB2YXIgZDNfdGltZV9mb3JtYXRzID0ge1xuICAgICAgYTogZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gbG9jYWxlX3Nob3J0RGF5c1tkLmdldERheSgpXTtcbiAgICAgIH0sXG4gICAgICBBOiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGVfZGF5c1tkLmdldERheSgpXTtcbiAgICAgIH0sXG4gICAgICBiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRNb250aCgpXTtcbiAgICAgIH0sXG4gICAgICBCOiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGVfbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICB9LFxuICAgICAgYzogZDNfdGltZV9mb3JtYXQobG9jYWxlX2RhdGVUaW1lKSxcbiAgICAgIGQ6IGZ1bmN0aW9uKGQsIHApIHtcbiAgICAgICAgcmV0dXJuIGQzX3RpbWVfZm9ybWF0UGFkKGQuZ2V0RGF0ZSgpLCBwLCAyKTtcbiAgICAgIH0sXG4gICAgICBlOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldERhdGUoKSwgcCwgMik7XG4gICAgICB9LFxuICAgICAgSDogZnVuY3Rpb24oZCwgcCkge1xuICAgICAgICByZXR1cm4gZDNfdGltZV9mb3JtYXRQYWQoZC5nZXRIb3VycygpLCBwLCAyKTtcbiAgICAgIH0sXG4gICAgICBJOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldEhvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gICAgICB9LFxuICAgICAgajogZnVuY3Rpb24oZCwgcCkge1xuICAgICAgICByZXR1cm4gZDNfdGltZV9mb3JtYXRQYWQoMSArIGQzX3RpbWUuZGF5T2ZZZWFyKGQpLCBwLCAzKTtcbiAgICAgIH0sXG4gICAgICBMOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldE1pbGxpc2Vjb25kcygpLCBwLCAzKTtcbiAgICAgIH0sXG4gICAgICBtOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbiAgICAgIH0sXG4gICAgICBNOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldE1pbnV0ZXMoKSwgcCwgMik7XG4gICAgICB9LFxuICAgICAgcDogZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldEhvdXJzKCkgPj0gMTIpXTtcbiAgICAgIH0sXG4gICAgICBTOiBmdW5jdGlvbihkLCBwKSB7XG4gICAgICAgIHJldHVybiBkM190aW1lX2Zvcm1hdFBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG4gICAgICB9LFxuICAgICAgVTogZnVuY3Rpb24oZCwgcCkge1xuICAgICAgICByZXR1cm4gZDNfdGltZV9mb3JtYXRQYWQoZDNfdGltZS5zdW5kYXlPZlllYXIoZCksIHAsIDIpO1xuICAgICAgfSxcbiAgICAgIHc6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGQuZ2V0RGF5KCk7XG4gICAgICB9LFxuICAgICAgVzogZnVuY3Rpb24oZCwgcCkge1xuICAgICAgICByZXR1cm4gZDNfdGltZV9mb3JtYXRQYWQoZDNfdGltZS5tb25kYXlPZlllYXIoZCksIHAsIDIpO1xuICAgICAgfSxcbiAgICAgIHg6IGQzX3RpbWVfZm9ybWF0KGxvY2FsZV9kYXRlKSxcbiAgICAgIFg6IGQzX3RpbWVfZm9ybWF0KGxvY2FsZV90aW1lKSxcbiAgICAgIHk6IGZ1bmN0aW9uKGQsIHApIHtcbiAgICAgICAgcmV0dXJuIGQzX3RpbWVfZm9ybWF0UGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMCwgcCwgMik7XG4gICAgICB9LFxuICAgICAgWTogZnVuY3Rpb24oZCwgcCkge1xuICAgICAgICByZXR1cm4gZDNfdGltZV9mb3JtYXRQYWQoZC5nZXRGdWxsWWVhcigpICUgMWU0LCBwLCA0KTtcbiAgICAgIH0sXG4gICAgICBaOiBkM190aW1lX3pvbmUsXG4gICAgICBcIiVcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcIiVcIjtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkM190aW1lX3BhcnNlcnMgPSB7XG4gICAgICBhOiBkM190aW1lX3BhcnNlV2Vla2RheUFiYnJldixcbiAgICAgIEE6IGQzX3RpbWVfcGFyc2VXZWVrZGF5LFxuICAgICAgYjogZDNfdGltZV9wYXJzZU1vbnRoQWJicmV2LFxuICAgICAgQjogZDNfdGltZV9wYXJzZU1vbnRoLFxuICAgICAgYzogZDNfdGltZV9wYXJzZUxvY2FsZUZ1bGwsXG4gICAgICBkOiBkM190aW1lX3BhcnNlRGF5LFxuICAgICAgZTogZDNfdGltZV9wYXJzZURheSxcbiAgICAgIEg6IGQzX3RpbWVfcGFyc2VIb3VyMjQsXG4gICAgICBJOiBkM190aW1lX3BhcnNlSG91cjI0LFxuICAgICAgajogZDNfdGltZV9wYXJzZURheU9mWWVhcixcbiAgICAgIEw6IGQzX3RpbWVfcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgICBtOiBkM190aW1lX3BhcnNlTW9udGhOdW1iZXIsXG4gICAgICBNOiBkM190aW1lX3BhcnNlTWludXRlcyxcbiAgICAgIHA6IGQzX3RpbWVfcGFyc2VBbVBtLFxuICAgICAgUzogZDNfdGltZV9wYXJzZVNlY29uZHMsXG4gICAgICBVOiBkM190aW1lX3BhcnNlV2Vla051bWJlclN1bmRheSxcbiAgICAgIHc6IGQzX3RpbWVfcGFyc2VXZWVrZGF5TnVtYmVyLFxuICAgICAgVzogZDNfdGltZV9wYXJzZVdlZWtOdW1iZXJNb25kYXksXG4gICAgICB4OiBkM190aW1lX3BhcnNlTG9jYWxlRGF0ZSxcbiAgICAgIFg6IGQzX3RpbWVfcGFyc2VMb2NhbGVUaW1lLFxuICAgICAgeTogZDNfdGltZV9wYXJzZVllYXIsXG4gICAgICBZOiBkM190aW1lX3BhcnNlRnVsbFllYXIsXG4gICAgICBaOiBkM190aW1lX3BhcnNlWm9uZSxcbiAgICAgIFwiJVwiOiBkM190aW1lX3BhcnNlTGl0ZXJhbFBlcmNlbnRcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VXZWVrZGF5QWJicmV2KGRhdGUsIHN0cmluZywgaSkge1xuICAgICAgZDNfdGltZV9kYXlBYmJyZXZSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG4gPSBkM190aW1lX2RheUFiYnJldlJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGRhdGUudyA9IGQzX3RpbWVfZGF5QWJicmV2TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VXZWVrZGF5KGRhdGUsIHN0cmluZywgaSkge1xuICAgICAgZDNfdGltZV9kYXlSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG4gPSBkM190aW1lX2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGRhdGUudyA9IGQzX3RpbWVfZGF5TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VNb250aEFiYnJldihkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICAgIGQzX3RpbWVfbW9udGhBYmJyZXZSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG4gPSBkM190aW1lX21vbnRoQWJicmV2UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZGF0ZS5tID0gZDNfdGltZV9tb250aEFiYnJldkxvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkM190aW1lX3BhcnNlTW9udGgoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgICBkM190aW1lX21vbnRoUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBuID0gZDNfdGltZV9tb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGRhdGUubSA9IGQzX3RpbWVfbW9udGhMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZUxvY2FsZUZ1bGwoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gZDNfdGltZV9wYXJzZShkYXRlLCBkM190aW1lX2Zvcm1hdHMuYy50b1N0cmluZygpLCBzdHJpbmcsIGkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkM190aW1lX3BhcnNlTG9jYWxlRGF0ZShkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICAgIHJldHVybiBkM190aW1lX3BhcnNlKGRhdGUsIGQzX3RpbWVfZm9ybWF0cy54LnRvU3RyaW5nKCksIHN0cmluZywgaSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VMb2NhbGVUaW1lKGRhdGUsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIGQzX3RpbWVfcGFyc2UoZGF0ZSwgZDNfdGltZV9mb3JtYXRzLlgudG9TdHJpbmcoKSwgc3RyaW5nLCBpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZUFtUG0oZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IGQzX3RpbWVfcGVyaW9kTG9va3VwLmdldChzdHJpbmcuc2xpY2UoaSwgaSArPSAyKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIHJldHVybiBuID09IG51bGwgPyAtMSA6IChkYXRlLnAgPSBuLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX3RpbWVfZm9ybWF0O1xuICB9XG4gIHZhciBkM190aW1lX2Zvcm1hdFBhZHMgPSB7XG4gICAgXCItXCI6IFwiXCIsXG4gICAgXzogXCIgXCIsXG4gICAgXCIwXCI6IFwiMFwiXG4gIH0sIGQzX3RpbWVfbnVtYmVyUmUgPSAvXlxccypcXGQrLywgZDNfdGltZV9wZXJjZW50UmUgPSAvXiUvO1xuICBmdW5jdGlvbiBkM190aW1lX2Zvcm1hdFBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIiwgc3RyaW5nID0gKHNpZ24gPyAtdmFsdWUgOiB2YWx1ZSkgKyBcIlwiLCBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfdGltZV9mb3JtYXRSZShuYW1lcykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKGQzLnJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX2Zvcm1hdExvb2t1cChuYW1lcykge1xuICAgIHZhciBtYXAgPSBuZXcgZDNfTWFwKCksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgbWFwLnNldChuYW1lc1tpXS50b0xvd2VyQ2FzZSgpLCBpKTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VXZWVrZGF5TnVtYmVyKGRhdGUsIHN0cmluZywgaSkge1xuICAgIGQzX3RpbWVfbnVtYmVyUmUubGFzdEluZGV4ID0gMDtcbiAgICB2YXIgbiA9IGQzX3RpbWVfbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgICByZXR1cm4gbiA/IChkYXRlLncgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VXZWVrTnVtYmVyU3VuZGF5KGRhdGUsIHN0cmluZywgaSkge1xuICAgIGQzX3RpbWVfbnVtYmVyUmUubGFzdEluZGV4ID0gMDtcbiAgICB2YXIgbiA9IGQzX3RpbWVfbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGRhdGUuVSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cbiAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZVdlZWtOdW1iZXJNb25kYXkoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgZDNfdGltZV9udW1iZXJSZS5sYXN0SW5kZXggPSAwO1xuICAgIHZhciBuID0gZDNfdGltZV9udW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZGF0ZS5XID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlRnVsbFllYXIoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgZDNfdGltZV9udW1iZXJSZS5sYXN0SW5kZXggPSAwO1xuICAgIHZhciBuID0gZDNfdGltZV9udW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgNCkpO1xuICAgIHJldHVybiBuID8gKGRhdGUueSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cbiAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZVllYXIoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgZDNfdGltZV9udW1iZXJSZS5sYXN0SW5kZXggPSAwO1xuICAgIHZhciBuID0gZDNfdGltZV9udW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGRhdGUueSA9IGQzX3RpbWVfZXhwYW5kWWVhcigrblswXSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlWm9uZShkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICByZXR1cm4gL15bKy1dXFxkezR9JC8udGVzdChzdHJpbmcgPSBzdHJpbmcuc2xpY2UoaSwgaSArIDUpKSA/IChkYXRlLlogPSAtc3RyaW5nLCBcbiAgICBpICsgNSkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX2V4cGFuZFllYXIoZCkge1xuICAgIHJldHVybiBkICsgKGQgPiA2OCA/IDE5MDAgOiAyZTMpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VNb250aE51bWJlcihkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICBkM190aW1lX251bWJlclJlLmxhc3RJbmRleCA9IDA7XG4gICAgdmFyIG4gPSBkM190aW1lX251bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZGF0ZS5tID0gblswXSAtIDEsIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlRGF5KGRhdGUsIHN0cmluZywgaSkge1xuICAgIGQzX3RpbWVfbnVtYmVyUmUubGFzdEluZGV4ID0gMDtcbiAgICB2YXIgbiA9IGQzX3RpbWVfbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkYXRlLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfcGFyc2VEYXlPZlllYXIoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgZDNfdGltZV9udW1iZXJSZS5sYXN0SW5kZXggPSAwO1xuICAgIHZhciBuID0gZDNfdGltZV9udW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICAgIHJldHVybiBuID8gKGRhdGUuaiA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cbiAgZnVuY3Rpb24gZDNfdGltZV9wYXJzZUhvdXIyNChkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICBkM190aW1lX251bWJlclJlLmxhc3RJbmRleCA9IDA7XG4gICAgdmFyIG4gPSBkM190aW1lX251bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZGF0ZS5IID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlTWludXRlcyhkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICBkM190aW1lX251bWJlclJlLmxhc3RJbmRleCA9IDA7XG4gICAgdmFyIG4gPSBkM190aW1lX251bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZGF0ZS5NID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlU2Vjb25kcyhkYXRlLCBzdHJpbmcsIGkpIHtcbiAgICBkM190aW1lX251bWJlclJlLmxhc3RJbmRleCA9IDA7XG4gICAgdmFyIG4gPSBkM190aW1lX251bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZGF0ZS5TID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlTWlsbGlzZWNvbmRzKGRhdGUsIHN0cmluZywgaSkge1xuICAgIGQzX3RpbWVfbnVtYmVyUmUubGFzdEluZGV4ID0gMDtcbiAgICB2YXIgbiA9IGQzX3RpbWVfbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgICByZXR1cm4gbiA/IChkYXRlLkwgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfem9uZShkKSB7XG4gICAgdmFyIHogPSBkLmdldFRpbWV6b25lT2Zmc2V0KCksIHpzID0geiA+IDAgPyBcIi1cIiA6IFwiK1wiLCB6aCA9IGFicyh6KSAvIDYwIHwgMCwgem0gPSBhYnMoeikgJSA2MDtcbiAgICByZXR1cm4genMgKyBkM190aW1lX2Zvcm1hdFBhZCh6aCwgXCIwXCIsIDIpICsgZDNfdGltZV9mb3JtYXRQYWQoem0sIFwiMFwiLCAyKTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX3BhcnNlTGl0ZXJhbFBlcmNlbnQoZGF0ZSwgc3RyaW5nLCBpKSB7XG4gICAgZDNfdGltZV9wZXJjZW50UmUubGFzdEluZGV4ID0gMDtcbiAgICB2YXIgbiA9IGQzX3RpbWVfcGVyY2VudFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgcmV0dXJuIG4gPyBpICsgblswXS5sZW5ndGggOiAtMTtcbiAgfVxuICBmdW5jdGlvbiBkM190aW1lX2Zvcm1hdE11bHRpKGZvcm1hdHMpIHtcbiAgICB2YXIgbiA9IGZvcm1hdHMubGVuZ3RoLCBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IG4pIGZvcm1hdHNbaV1bMF0gPSB0aGlzKGZvcm1hdHNbaV1bMF0pO1xuICAgIHJldHVybiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgaSA9IDAsIGYgPSBmb3JtYXRzW2ldO1xuICAgICAgd2hpbGUgKCFmWzFdKGRhdGUpKSBmID0gZm9ybWF0c1srK2ldO1xuICAgICAgcmV0dXJuIGZbMF0oZGF0ZSk7XG4gICAgfTtcbiAgfVxuICBkMy5sb2NhbGUgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtYmVyRm9ybWF0OiBkM19sb2NhbGVfbnVtYmVyRm9ybWF0KGxvY2FsZSksXG4gICAgICB0aW1lRm9ybWF0OiBkM19sb2NhbGVfdGltZUZvcm1hdChsb2NhbGUpXG4gICAgfTtcbiAgfTtcbiAgdmFyIGQzX2xvY2FsZV9lblVTID0gZDMubG9jYWxlKHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbIDMgXSxcbiAgICBjdXJyZW5jeTogWyBcIiRcIiwgXCJcIiBdLFxuICAgIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgZGF0ZTogXCIlbS8lZC8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbIFwiQU1cIiwgXCJQTVwiIF0sXG4gICAgZGF5czogWyBcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCIgXSxcbiAgICBzaG9ydERheXM6IFsgXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIiBdLFxuICAgIG1vbnRoczogWyBcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSxcbiAgICBzaG9ydE1vbnRoczogWyBcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiIF1cbiAgfSk7XG4gIGQzLmZvcm1hdCA9IGQzX2xvY2FsZV9lblVTLm51bWJlckZvcm1hdDtcbiAgZDMuZ2VvID0ge307XG4gIGZ1bmN0aW9uIGQzX2FkZGVyKCkge31cbiAgZDNfYWRkZXIucHJvdG90eXBlID0ge1xuICAgIHM6IDAsXG4gICAgdDogMCxcbiAgICBhZGQ6IGZ1bmN0aW9uKHkpIHtcbiAgICAgIGQzX2FkZGVyU3VtKHksIHRoaXMudCwgZDNfYWRkZXJUZW1wKTtcbiAgICAgIGQzX2FkZGVyU3VtKGQzX2FkZGVyVGVtcC5zLCB0aGlzLnMsIHRoaXMpO1xuICAgICAgaWYgKHRoaXMucykgdGhpcy50ICs9IGQzX2FkZGVyVGVtcC50OyBlbHNlIHRoaXMucyA9IGQzX2FkZGVyVGVtcC50O1xuICAgIH0sXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zID0gdGhpcy50ID0gMDtcbiAgICB9LFxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucztcbiAgICB9XG4gIH07XG4gIHZhciBkM19hZGRlclRlbXAgPSBuZXcgZDNfYWRkZXIoKTtcbiAgZnVuY3Rpb24gZDNfYWRkZXJTdW0oYSwgYiwgbykge1xuICAgIHZhciB4ID0gby5zID0gYSArIGIsIGJ2ID0geCAtIGEsIGF2ID0geCAtIGJ2O1xuICAgIG8udCA9IGEgLSBhdiArIChiIC0gYnYpO1xuICB9XG4gIGQzLmdlby5zdHJlYW0gPSBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgaWYgKG9iamVjdCAmJiBkM19nZW9fc3RyZWFtT2JqZWN0VHlwZS5oYXNPd25Qcm9wZXJ0eShvYmplY3QudHlwZSkpIHtcbiAgICAgIGQzX2dlb19zdHJlYW1PYmplY3RUeXBlW29iamVjdC50eXBlXShvYmplY3QsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZDNfZ2VvX3N0cmVhbUdlb21ldHJ5KG9iamVjdCwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvX3N0cmVhbUdlb21ldHJ5KGdlb21ldHJ5LCBsaXN0ZW5lcikge1xuICAgIGlmIChnZW9tZXRyeSAmJiBkM19nZW9fc3RyZWFtR2VvbWV0cnlUeXBlLmhhc093blByb3BlcnR5KGdlb21ldHJ5LnR5cGUpKSB7XG4gICAgICBkM19nZW9fc3RyZWFtR2VvbWV0cnlUeXBlW2dlb21ldHJ5LnR5cGVdKGdlb21ldHJ5LCBsaXN0ZW5lcik7XG4gICAgfVxuICB9XG4gIHZhciBkM19nZW9fc3RyZWFtT2JqZWN0VHlwZSA9IHtcbiAgICBGZWF0dXJlOiBmdW5jdGlvbihmZWF0dXJlLCBsaXN0ZW5lcikge1xuICAgICAgZDNfZ2VvX3N0cmVhbUdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cnksIGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIEZlYXR1cmVDb2xsZWN0aW9uOiBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgZmVhdHVyZXMgPSBvYmplY3QuZmVhdHVyZXMsIGkgPSAtMSwgbiA9IGZlYXR1cmVzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBkM19nZW9fc3RyZWFtR2VvbWV0cnkoZmVhdHVyZXNbaV0uZ2VvbWV0cnksIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG4gIHZhciBkM19nZW9fc3RyZWFtR2VvbWV0cnlUeXBlID0ge1xuICAgIFNwaGVyZTogZnVuY3Rpb24ob2JqZWN0LCBsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIuc3BoZXJlKCk7XG4gICAgfSxcbiAgICBQb2ludDogZnVuY3Rpb24ob2JqZWN0LCBsaXN0ZW5lcikge1xuICAgICAgb2JqZWN0ID0gb2JqZWN0LmNvb3JkaW5hdGVzO1xuICAgICAgbGlzdGVuZXIucG9pbnQob2JqZWN0WzBdLCBvYmplY3RbMV0sIG9iamVjdFsyXSk7XG4gICAgfSxcbiAgICBNdWx0aVBvaW50OiBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBvYmplY3QgPSBjb29yZGluYXRlc1tpXSwgbGlzdGVuZXIucG9pbnQob2JqZWN0WzBdLCBvYmplY3RbMV0sIG9iamVjdFsyXSk7XG4gICAgfSxcbiAgICBMaW5lU3RyaW5nOiBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgICBkM19nZW9fc3RyZWFtTGluZShvYmplY3QuY29vcmRpbmF0ZXMsIGxpc3RlbmVyLCAwKTtcbiAgICB9LFxuICAgIE11bHRpTGluZVN0cmluZzogZnVuY3Rpb24ob2JqZWN0LCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGNvb3JkaW5hdGVzID0gb2JqZWN0LmNvb3JkaW5hdGVzLCBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgICB3aGlsZSAoKytpIDwgbikgZDNfZ2VvX3N0cmVhbUxpbmUoY29vcmRpbmF0ZXNbaV0sIGxpc3RlbmVyLCAwKTtcbiAgICB9LFxuICAgIFBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgbGlzdGVuZXIpIHtcbiAgICAgIGQzX2dlb19zdHJlYW1Qb2x5Z29uKG9iamVjdC5jb29yZGluYXRlcywgbGlzdGVuZXIpO1xuICAgIH0sXG4gICAgTXVsdGlQb2x5Z29uOiBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBkM19nZW9fc3RyZWFtUG9seWdvbihjb29yZGluYXRlc1tpXSwgbGlzdGVuZXIpO1xuICAgIH0sXG4gICAgR2VvbWV0cnlDb2xsZWN0aW9uOiBmdW5jdGlvbihvYmplY3QsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgZ2VvbWV0cmllcyA9IG9iamVjdC5nZW9tZXRyaWVzLCBpID0gLTEsIG4gPSBnZW9tZXRyaWVzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBkM19nZW9fc3RyZWFtR2VvbWV0cnkoZ2VvbWV0cmllc1tpXSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvX3N0cmVhbUxpbmUoY29vcmRpbmF0ZXMsIGxpc3RlbmVyLCBjbG9zZWQpIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoIC0gY2xvc2VkLCBjb29yZGluYXRlO1xuICAgIGxpc3RlbmVyLmxpbmVTdGFydCgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBjb29yZGluYXRlID0gY29vcmRpbmF0ZXNbaV0sIGxpc3RlbmVyLnBvaW50KGNvb3JkaW5hdGVbMF0sIGNvb3JkaW5hdGVbMV0sIGNvb3JkaW5hdGVbMl0pO1xuICAgIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fc3RyZWFtUG9seWdvbihjb29yZGluYXRlcywgbGlzdGVuZXIpIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIGxpc3RlbmVyLnBvbHlnb25TdGFydCgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBkM19nZW9fc3RyZWFtTGluZShjb29yZGluYXRlc1tpXSwgbGlzdGVuZXIsIDEpO1xuICAgIGxpc3RlbmVyLnBvbHlnb25FbmQoKTtcbiAgfVxuICBkMy5nZW8uYXJlYSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGQzX2dlb19hcmVhU3VtID0gMDtcbiAgICBkMy5nZW8uc3RyZWFtKG9iamVjdCwgZDNfZ2VvX2FyZWEpO1xuICAgIHJldHVybiBkM19nZW9fYXJlYVN1bTtcbiAgfTtcbiAgdmFyIGQzX2dlb19hcmVhU3VtLCBkM19nZW9fYXJlYVJpbmdTdW0gPSBuZXcgZDNfYWRkZXIoKTtcbiAgdmFyIGQzX2dlb19hcmVhID0ge1xuICAgIHNwaGVyZTogZnVuY3Rpb24oKSB7XG4gICAgICBkM19nZW9fYXJlYVN1bSArPSA0ICogz4A7XG4gICAgfSxcbiAgICBwb2ludDogZDNfbm9vcCxcbiAgICBsaW5lU3RhcnQ6IGQzX25vb3AsXG4gICAgbGluZUVuZDogZDNfbm9vcCxcbiAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfZ2VvX2FyZWFSaW5nU3VtLnJlc2V0KCk7XG4gICAgICBkM19nZW9fYXJlYS5saW5lU3RhcnQgPSBkM19nZW9fYXJlYVJpbmdTdGFydDtcbiAgICB9LFxuICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZWEgPSAyICogZDNfZ2VvX2FyZWFSaW5nU3VtO1xuICAgICAgZDNfZ2VvX2FyZWFTdW0gKz0gYXJlYSA8IDAgPyA0ICogz4AgKyBhcmVhIDogYXJlYTtcbiAgICAgIGQzX2dlb19hcmVhLmxpbmVTdGFydCA9IGQzX2dlb19hcmVhLmxpbmVFbmQgPSBkM19nZW9fYXJlYS5wb2ludCA9IGQzX25vb3A7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fYXJlYVJpbmdTdGFydCgpIHtcbiAgICB2YXIgzrswMCwgz4YwMCwgzrswLCBjb3PPhjAsIHNpbs+GMDtcbiAgICBkM19nZW9fYXJlYS5wb2ludCA9IGZ1bmN0aW9uKM67LCDPhikge1xuICAgICAgZDNfZ2VvX2FyZWEucG9pbnQgPSBuZXh0UG9pbnQ7XG4gICAgICDOuzAgPSAozrswMCA9IM67KSAqIGQzX3JhZGlhbnMsIGNvc8+GMCA9IE1hdGguY29zKM+GID0gKM+GMDAgPSDPhikgKiBkM19yYWRpYW5zIC8gMiArIM+AIC8gNCksIFxuICAgICAgc2luz4YwID0gTWF0aC5zaW4oz4YpO1xuICAgIH07XG4gICAgZnVuY3Rpb24gbmV4dFBvaW50KM67LCDPhikge1xuICAgICAgzrsgKj0gZDNfcmFkaWFucztcbiAgICAgIM+GID0gz4YgKiBkM19yYWRpYW5zIC8gMiArIM+AIC8gNDtcbiAgICAgIHZhciBkzrsgPSDOuyAtIM67MCwgc2TOuyA9IGTOuyA+PSAwID8gMSA6IC0xLCBhZM67ID0gc2TOuyAqIGTOuywgY29zz4YgPSBNYXRoLmNvcyjPhiksIHNpbs+GID0gTWF0aC5zaW4oz4YpLCBrID0gc2luz4YwICogc2luz4YsIHUgPSBjb3PPhjAgKiBjb3PPhiArIGsgKiBNYXRoLmNvcyhhZM67KSwgdiA9IGsgKiBzZM67ICogTWF0aC5zaW4oYWTOuyk7XG4gICAgICBkM19nZW9fYXJlYVJpbmdTdW0uYWRkKE1hdGguYXRhbjIodiwgdSkpO1xuICAgICAgzrswID0gzrssIGNvc8+GMCA9IGNvc8+GLCBzaW7PhjAgPSBzaW7PhjtcbiAgICB9XG4gICAgZDNfZ2VvX2FyZWEubGluZUVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbmV4dFBvaW50KM67MDAsIM+GMDApO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NhcnRlc2lhbihzcGhlcmljYWwpIHtcbiAgICB2YXIgzrsgPSBzcGhlcmljYWxbMF0sIM+GID0gc3BoZXJpY2FsWzFdLCBjb3PPhiA9IE1hdGguY29zKM+GKTtcbiAgICByZXR1cm4gWyBjb3PPhiAqIE1hdGguY29zKM67KSwgY29zz4YgKiBNYXRoLnNpbijOuyksIE1hdGguc2luKM+GKSBdO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jYXJ0ZXNpYW5Eb3QoYSwgYikge1xuICAgIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdICsgYVsyXSAqIGJbMl07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NhcnRlc2lhbkNyb3NzKGEsIGIpIHtcbiAgICByZXR1cm4gWyBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdLCBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLCBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdIF07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NhcnRlc2lhbkFkZChhLCBiKSB7XG4gICAgYVswXSArPSBiWzBdO1xuICAgIGFbMV0gKz0gYlsxXTtcbiAgICBhWzJdICs9IGJbMl07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NhcnRlc2lhblNjYWxlKHZlY3Rvciwgaykge1xuICAgIHJldHVybiBbIHZlY3RvclswXSAqIGssIHZlY3RvclsxXSAqIGssIHZlY3RvclsyXSAqIGsgXTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2FydGVzaWFuTm9ybWFsaXplKGQpIHtcbiAgICB2YXIgbCA9IE1hdGguc3FydChkWzBdICogZFswXSArIGRbMV0gKiBkWzFdICsgZFsyXSAqIGRbMl0pO1xuICAgIGRbMF0gLz0gbDtcbiAgICBkWzFdIC89IGw7XG4gICAgZFsyXSAvPSBsO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19zcGhlcmljYWwoY2FydGVzaWFuKSB7XG4gICAgcmV0dXJuIFsgTWF0aC5hdGFuMihjYXJ0ZXNpYW5bMV0sIGNhcnRlc2lhblswXSksIGQzX2FzaW4oY2FydGVzaWFuWzJdKSBdO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19zcGhlcmljYWxFcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGFicyhhWzBdIC0gYlswXSkgPCDOtSAmJiBhYnMoYVsxXSAtIGJbMV0pIDwgzrU7XG4gIH1cbiAgZDMuZ2VvLmJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciDOuzAsIM+GMCwgzrsxLCDPhjEsIM67XywgzrtfXywgz4ZfXywgcDAsIGTOu1N1bSwgcmFuZ2VzLCByYW5nZTtcbiAgICB2YXIgYm91bmQgPSB7XG4gICAgICBwb2ludDogcG9pbnQsXG4gICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBib3VuZC5wb2ludCA9IHJpbmdQb2ludDtcbiAgICAgICAgYm91bmQubGluZVN0YXJ0ID0gcmluZ1N0YXJ0O1xuICAgICAgICBib3VuZC5saW5lRW5kID0gcmluZ0VuZDtcbiAgICAgICAgZM67U3VtID0gMDtcbiAgICAgICAgZDNfZ2VvX2FyZWEucG9seWdvblN0YXJ0KCk7XG4gICAgICB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGQzX2dlb19hcmVhLnBvbHlnb25FbmQoKTtcbiAgICAgICAgYm91bmQucG9pbnQgPSBwb2ludDtcbiAgICAgICAgYm91bmQubGluZVN0YXJ0ID0gbGluZVN0YXJ0O1xuICAgICAgICBib3VuZC5saW5lRW5kID0gbGluZUVuZDtcbiAgICAgICAgaWYgKGQzX2dlb19hcmVhUmluZ1N1bSA8IDApIM67MCA9IC0ozrsxID0gMTgwKSwgz4YwID0gLSjPhjEgPSA5MCk7IGVsc2UgaWYgKGTOu1N1bSA+IM61KSDPhjEgPSA5MDsgZWxzZSBpZiAoZM67U3VtIDwgLc61KSDPhjAgPSAtOTA7XG4gICAgICAgIHJhbmdlWzBdID0gzrswLCByYW5nZVsxXSA9IM67MTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIHBvaW50KM67LCDPhikge1xuICAgICAgcmFuZ2VzLnB1c2gocmFuZ2UgPSBbIM67MCA9IM67LCDOuzEgPSDOuyBdKTtcbiAgICAgIGlmICjPhiA8IM+GMCkgz4YwID0gz4Y7XG4gICAgICBpZiAoz4YgPiDPhjEpIM+GMSA9IM+GO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lUG9pbnQozrssIM+GKSB7XG4gICAgICB2YXIgcCA9IGQzX2dlb19jYXJ0ZXNpYW4oWyDOuyAqIGQzX3JhZGlhbnMsIM+GICogZDNfcmFkaWFucyBdKTtcbiAgICAgIGlmIChwMCkge1xuICAgICAgICB2YXIgbm9ybWFsID0gZDNfZ2VvX2NhcnRlc2lhbkNyb3NzKHAwLCBwKSwgZXF1YXRvcmlhbCA9IFsgbm9ybWFsWzFdLCAtbm9ybWFsWzBdLCAwIF0sIGluZmxlY3Rpb24gPSBkM19nZW9fY2FydGVzaWFuQ3Jvc3MoZXF1YXRvcmlhbCwgbm9ybWFsKTtcbiAgICAgICAgZDNfZ2VvX2NhcnRlc2lhbk5vcm1hbGl6ZShpbmZsZWN0aW9uKTtcbiAgICAgICAgaW5mbGVjdGlvbiA9IGQzX2dlb19zcGhlcmljYWwoaW5mbGVjdGlvbik7XG4gICAgICAgIHZhciBkzrsgPSDOuyAtIM67XywgcyA9IGTOuyA+IDAgPyAxIDogLTEsIM67aSA9IGluZmxlY3Rpb25bMF0gKiBkM19kZWdyZWVzICogcywgYW50aW1lcmlkaWFuID0gYWJzKGTOuykgPiAxODA7XG4gICAgICAgIGlmIChhbnRpbWVyaWRpYW4gXiAocyAqIM67XyA8IM67aSAmJiDOu2kgPCBzICogzrspKSB7XG4gICAgICAgICAgdmFyIM+GaSA9IGluZmxlY3Rpb25bMV0gKiBkM19kZWdyZWVzO1xuICAgICAgICAgIGlmICjPhmkgPiDPhjEpIM+GMSA9IM+GaTtcbiAgICAgICAgfSBlbHNlIGlmICjOu2kgPSAozrtpICsgMzYwKSAlIDM2MCAtIDE4MCwgYW50aW1lcmlkaWFuIF4gKHMgKiDOu18gPCDOu2kgJiYgzrtpIDwgcyAqIM67KSkge1xuICAgICAgICAgIHZhciDPhmkgPSAtaW5mbGVjdGlvblsxXSAqIGQzX2RlZ3JlZXM7XG4gICAgICAgICAgaWYgKM+GaSA8IM+GMCkgz4YwID0gz4ZpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICjPhiA8IM+GMCkgz4YwID0gz4Y7XG4gICAgICAgICAgaWYgKM+GID4gz4YxKSDPhjEgPSDPhjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW50aW1lcmlkaWFuKSB7XG4gICAgICAgICAgaWYgKM67IDwgzrtfKSB7XG4gICAgICAgICAgICBpZiAoYW5nbGUozrswLCDOuykgPiBhbmdsZSjOuzAsIM67MSkpIM67MSA9IM67O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYW5nbGUozrssIM67MSkgPiBhbmdsZSjOuzAsIM67MSkpIM67MCA9IM67O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAozrsxID49IM67MCkge1xuICAgICAgICAgICAgaWYgKM67IDwgzrswKSDOuzAgPSDOuztcbiAgICAgICAgICAgIGlmICjOuyA+IM67MSkgzrsxID0gzrs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICjOuyA+IM67Xykge1xuICAgICAgICAgICAgICBpZiAoYW5nbGUozrswLCDOuykgPiBhbmdsZSjOuzAsIM67MSkpIM67MSA9IM67O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGFuZ2xlKM67LCDOuzEpID4gYW5nbGUozrswLCDOuzEpKSDOuzAgPSDOuztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50KM67LCDPhik7XG4gICAgICB9XG4gICAgICBwMCA9IHAsIM67XyA9IM67O1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICBib3VuZC5wb2ludCA9IGxpbmVQb2ludDtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIHJhbmdlWzBdID0gzrswLCByYW5nZVsxXSA9IM67MTtcbiAgICAgIGJvdW5kLnBvaW50ID0gcG9pbnQ7XG4gICAgICBwMCA9IG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJpbmdQb2ludCjOuywgz4YpIHtcbiAgICAgIGlmIChwMCkge1xuICAgICAgICB2YXIgZM67ID0gzrsgLSDOu187XG4gICAgICAgIGTOu1N1bSArPSBhYnMoZM67KSA+IDE4MCA/IGTOuyArIChkzrsgPiAwID8gMzYwIDogLTM2MCkgOiBkzrs7XG4gICAgICB9IGVsc2UgzrtfXyA9IM67LCDPhl9fID0gz4Y7XG4gICAgICBkM19nZW9fYXJlYS5wb2ludCjOuywgz4YpO1xuICAgICAgbGluZVBvaW50KM67LCDPhik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJpbmdTdGFydCgpIHtcbiAgICAgIGQzX2dlb19hcmVhLmxpbmVTdGFydCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByaW5nRW5kKCkge1xuICAgICAgcmluZ1BvaW50KM67X18sIM+GX18pO1xuICAgICAgZDNfZ2VvX2FyZWEubGluZUVuZCgpO1xuICAgICAgaWYgKGFicyhkzrtTdW0pID4gzrUpIM67MCA9IC0ozrsxID0gMTgwKTtcbiAgICAgIHJhbmdlWzBdID0gzrswLCByYW5nZVsxXSA9IM67MTtcbiAgICAgIHAwID0gbnVsbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gYW5nbGUozrswLCDOuzEpIHtcbiAgICAgIHJldHVybiAozrsxIC09IM67MCkgPCAwID8gzrsxICsgMzYwIDogzrsxO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb21wYXJlUmFuZ2VzKGEsIGIpIHtcbiAgICAgIHJldHVybiBhWzBdIC0gYlswXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gd2l0aGluUmFuZ2UoeCwgcmFuZ2UpIHtcbiAgICAgIHJldHVybiByYW5nZVswXSA8PSByYW5nZVsxXSA/IHJhbmdlWzBdIDw9IHggJiYgeCA8PSByYW5nZVsxXSA6IHggPCByYW5nZVswXSB8fCByYW5nZVsxXSA8IHg7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgICDPhjEgPSDOuzEgPSAtKM67MCA9IM+GMCA9IEluZmluaXR5KTtcbiAgICAgIHJhbmdlcyA9IFtdO1xuICAgICAgZDMuZ2VvLnN0cmVhbShmZWF0dXJlLCBib3VuZCk7XG4gICAgICB2YXIgbiA9IHJhbmdlcy5sZW5ndGg7XG4gICAgICBpZiAobikge1xuICAgICAgICByYW5nZXMuc29ydChjb21wYXJlUmFuZ2VzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGEgPSByYW5nZXNbMF0sIGIsIG1lcmdlZCA9IFsgYSBdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgYiA9IHJhbmdlc1tpXTtcbiAgICAgICAgICBpZiAod2l0aGluUmFuZ2UoYlswXSwgYSkgfHwgd2l0aGluUmFuZ2UoYlsxXSwgYSkpIHtcbiAgICAgICAgICAgIGlmIChhbmdsZShhWzBdLCBiWzFdKSA+IGFuZ2xlKGFbMF0sIGFbMV0pKSBhWzFdID0gYlsxXTtcbiAgICAgICAgICAgIGlmIChhbmdsZShiWzBdLCBhWzFdKSA+IGFuZ2xlKGFbMF0sIGFbMV0pKSBhWzBdID0gYlswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVyZ2VkLnB1c2goYSA9IGIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYmVzdCA9IC1JbmZpbml0eSwgZM67O1xuICAgICAgICBmb3IgKHZhciBuID0gbWVyZ2VkLmxlbmd0aCAtIDEsIGkgPSAwLCBhID0gbWVyZ2VkW25dLCBiOyBpIDw9IG47IGEgPSBiLCArK2kpIHtcbiAgICAgICAgICBiID0gbWVyZ2VkW2ldO1xuICAgICAgICAgIGlmICgoZM67ID0gYW5nbGUoYVsxXSwgYlswXSkpID4gYmVzdCkgYmVzdCA9IGTOuywgzrswID0gYlswXSwgzrsxID0gYVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmFuZ2VzID0gcmFuZ2UgPSBudWxsO1xuICAgICAgcmV0dXJuIM67MCA9PT0gSW5maW5pdHkgfHwgz4YwID09PSBJbmZpbml0eSA/IFsgWyBOYU4sIE5hTiBdLCBbIE5hTiwgTmFOIF0gXSA6IFsgWyDOuzAsIM+GMCBdLCBbIM67MSwgz4YxIF0gXTtcbiAgICB9O1xuICB9KCk7XG4gIGQzLmdlby5jZW50cm9pZCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGQzX2dlb19jZW50cm9pZFcwID0gZDNfZ2VvX2NlbnRyb2lkVzEgPSBkM19nZW9fY2VudHJvaWRYMCA9IGQzX2dlb19jZW50cm9pZFkwID0gZDNfZ2VvX2NlbnRyb2lkWjAgPSBkM19nZW9fY2VudHJvaWRYMSA9IGQzX2dlb19jZW50cm9pZFkxID0gZDNfZ2VvX2NlbnRyb2lkWjEgPSBkM19nZW9fY2VudHJvaWRYMiA9IGQzX2dlb19jZW50cm9pZFkyID0gZDNfZ2VvX2NlbnRyb2lkWjIgPSAwO1xuICAgIGQzLmdlby5zdHJlYW0ob2JqZWN0LCBkM19nZW9fY2VudHJvaWQpO1xuICAgIHZhciB4ID0gZDNfZ2VvX2NlbnRyb2lkWDIsIHkgPSBkM19nZW9fY2VudHJvaWRZMiwgeiA9IGQzX2dlb19jZW50cm9pZFoyLCBtID0geCAqIHggKyB5ICogeSArIHogKiB6O1xuICAgIGlmIChtIDwgzrUyKSB7XG4gICAgICB4ID0gZDNfZ2VvX2NlbnRyb2lkWDEsIHkgPSBkM19nZW9fY2VudHJvaWRZMSwgeiA9IGQzX2dlb19jZW50cm9pZFoxO1xuICAgICAgaWYgKGQzX2dlb19jZW50cm9pZFcxIDwgzrUpIHggPSBkM19nZW9fY2VudHJvaWRYMCwgeSA9IGQzX2dlb19jZW50cm9pZFkwLCB6ID0gZDNfZ2VvX2NlbnRyb2lkWjA7XG4gICAgICBtID0geCAqIHggKyB5ICogeSArIHogKiB6O1xuICAgICAgaWYgKG0gPCDOtTIpIHJldHVybiBbIE5hTiwgTmFOIF07XG4gICAgfVxuICAgIHJldHVybiBbIE1hdGguYXRhbjIoeSwgeCkgKiBkM19kZWdyZWVzLCBkM19hc2luKHogLyBNYXRoLnNxcnQobSkpICogZDNfZGVncmVlcyBdO1xuICB9O1xuICB2YXIgZDNfZ2VvX2NlbnRyb2lkVzAsIGQzX2dlb19jZW50cm9pZFcxLCBkM19nZW9fY2VudHJvaWRYMCwgZDNfZ2VvX2NlbnRyb2lkWTAsIGQzX2dlb19jZW50cm9pZFowLCBkM19nZW9fY2VudHJvaWRYMSwgZDNfZ2VvX2NlbnRyb2lkWTEsIGQzX2dlb19jZW50cm9pZFoxLCBkM19nZW9fY2VudHJvaWRYMiwgZDNfZ2VvX2NlbnRyb2lkWTIsIGQzX2dlb19jZW50cm9pZFoyO1xuICB2YXIgZDNfZ2VvX2NlbnRyb2lkID0ge1xuICAgIHNwaGVyZTogZDNfbm9vcCxcbiAgICBwb2ludDogZDNfZ2VvX2NlbnRyb2lkUG9pbnQsXG4gICAgbGluZVN0YXJ0OiBkM19nZW9fY2VudHJvaWRMaW5lU3RhcnQsXG4gICAgbGluZUVuZDogZDNfZ2VvX2NlbnRyb2lkTGluZUVuZCxcbiAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkLmxpbmVTdGFydCA9IGQzX2dlb19jZW50cm9pZFJpbmdTdGFydDtcbiAgICB9LFxuICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkLmxpbmVTdGFydCA9IGQzX2dlb19jZW50cm9pZExpbmVTdGFydDtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb19jZW50cm9pZFBvaW50KM67LCDPhikge1xuICAgIM67ICo9IGQzX3JhZGlhbnM7XG4gICAgdmFyIGNvc8+GID0gTWF0aC5jb3Moz4YgKj0gZDNfcmFkaWFucyk7XG4gICAgZDNfZ2VvX2NlbnRyb2lkUG9pbnRYWVooY29zz4YgKiBNYXRoLmNvcyjOuyksIGNvc8+GICogTWF0aC5zaW4ozrspLCBNYXRoLnNpbijPhikpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jZW50cm9pZFBvaW50WFlaKHgsIHksIHopIHtcbiAgICArK2QzX2dlb19jZW50cm9pZFcwO1xuICAgIGQzX2dlb19jZW50cm9pZFgwICs9ICh4IC0gZDNfZ2VvX2NlbnRyb2lkWDApIC8gZDNfZ2VvX2NlbnRyb2lkVzA7XG4gICAgZDNfZ2VvX2NlbnRyb2lkWTAgKz0gKHkgLSBkM19nZW9fY2VudHJvaWRZMCkgLyBkM19nZW9fY2VudHJvaWRXMDtcbiAgICBkM19nZW9fY2VudHJvaWRaMCArPSAoeiAtIGQzX2dlb19jZW50cm9pZFowKSAvIGQzX2dlb19jZW50cm9pZFcwO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jZW50cm9pZExpbmVTdGFydCgpIHtcbiAgICB2YXIgeDAsIHkwLCB6MDtcbiAgICBkM19nZW9fY2VudHJvaWQucG9pbnQgPSBmdW5jdGlvbijOuywgz4YpIHtcbiAgICAgIM67ICo9IGQzX3JhZGlhbnM7XG4gICAgICB2YXIgY29zz4YgPSBNYXRoLmNvcyjPhiAqPSBkM19yYWRpYW5zKTtcbiAgICAgIHgwID0gY29zz4YgKiBNYXRoLmNvcyjOuyk7XG4gICAgICB5MCA9IGNvc8+GICogTWF0aC5zaW4ozrspO1xuICAgICAgejAgPSBNYXRoLnNpbijPhik7XG4gICAgICBkM19nZW9fY2VudHJvaWQucG9pbnQgPSBuZXh0UG9pbnQ7XG4gICAgICBkM19nZW9fY2VudHJvaWRQb2ludFhZWih4MCwgeTAsIHowKTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIG5leHRQb2ludCjOuywgz4YpIHtcbiAgICAgIM67ICo9IGQzX3JhZGlhbnM7XG4gICAgICB2YXIgY29zz4YgPSBNYXRoLmNvcyjPhiAqPSBkM19yYWRpYW5zKSwgeCA9IGNvc8+GICogTWF0aC5jb3MozrspLCB5ID0gY29zz4YgKiBNYXRoLnNpbijOuyksIHogPSBNYXRoLnNpbijPhiksIHcgPSBNYXRoLmF0YW4yKE1hdGguc3FydCgodyA9IHkwICogeiAtIHowICogeSkgKiB3ICsgKHcgPSB6MCAqIHggLSB4MCAqIHopICogdyArICh3ID0geDAgKiB5IC0geTAgKiB4KSAqIHcpLCB4MCAqIHggKyB5MCAqIHkgKyB6MCAqIHopO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkVzEgKz0gdztcbiAgICAgIGQzX2dlb19jZW50cm9pZFgxICs9IHcgKiAoeDAgKyAoeDAgPSB4KSk7XG4gICAgICBkM19nZW9fY2VudHJvaWRZMSArPSB3ICogKHkwICsgKHkwID0geSkpO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWjEgKz0gdyAqICh6MCArICh6MCA9IHopKTtcbiAgICAgIGQzX2dlb19jZW50cm9pZFBvaW50WFlaKHgwLCB5MCwgejApO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2VudHJvaWRMaW5lRW5kKCkge1xuICAgIGQzX2dlb19jZW50cm9pZC5wb2ludCA9IGQzX2dlb19jZW50cm9pZFBvaW50O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jZW50cm9pZFJpbmdTdGFydCgpIHtcbiAgICB2YXIgzrswMCwgz4YwMCwgeDAsIHkwLCB6MDtcbiAgICBkM19nZW9fY2VudHJvaWQucG9pbnQgPSBmdW5jdGlvbijOuywgz4YpIHtcbiAgICAgIM67MDAgPSDOuywgz4YwMCA9IM+GO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkLnBvaW50ID0gbmV4dFBvaW50O1xuICAgICAgzrsgKj0gZDNfcmFkaWFucztcbiAgICAgIHZhciBjb3PPhiA9IE1hdGguY29zKM+GICo9IGQzX3JhZGlhbnMpO1xuICAgICAgeDAgPSBjb3PPhiAqIE1hdGguY29zKM67KTtcbiAgICAgIHkwID0gY29zz4YgKiBNYXRoLnNpbijOuyk7XG4gICAgICB6MCA9IE1hdGguc2luKM+GKTtcbiAgICAgIGQzX2dlb19jZW50cm9pZFBvaW50WFlaKHgwLCB5MCwgejApO1xuICAgIH07XG4gICAgZDNfZ2VvX2NlbnRyb2lkLmxpbmVFbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG5leHRQb2ludCjOuzAwLCDPhjAwKTtcbiAgICAgIGQzX2dlb19jZW50cm9pZC5saW5lRW5kID0gZDNfZ2VvX2NlbnRyb2lkTGluZUVuZDtcbiAgICAgIGQzX2dlb19jZW50cm9pZC5wb2ludCA9IGQzX2dlb19jZW50cm9pZFBvaW50O1xuICAgIH07XG4gICAgZnVuY3Rpb24gbmV4dFBvaW50KM67LCDPhikge1xuICAgICAgzrsgKj0gZDNfcmFkaWFucztcbiAgICAgIHZhciBjb3PPhiA9IE1hdGguY29zKM+GICo9IGQzX3JhZGlhbnMpLCB4ID0gY29zz4YgKiBNYXRoLmNvcyjOuyksIHkgPSBjb3PPhiAqIE1hdGguc2luKM67KSwgeiA9IE1hdGguc2luKM+GKSwgY3ggPSB5MCAqIHogLSB6MCAqIHksIGN5ID0gejAgKiB4IC0geDAgKiB6LCBjeiA9IHgwICogeSAtIHkwICogeCwgbSA9IE1hdGguc3FydChjeCAqIGN4ICsgY3kgKiBjeSArIGN6ICogY3opLCB1ID0geDAgKiB4ICsgeTAgKiB5ICsgejAgKiB6LCB2ID0gbSAmJiAtZDNfYWNvcyh1KSAvIG0sIHcgPSBNYXRoLmF0YW4yKG0sIHUpO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWDIgKz0gdiAqIGN4O1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWTIgKz0gdiAqIGN5O1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWjIgKz0gdiAqIGN6O1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkVzEgKz0gdztcbiAgICAgIGQzX2dlb19jZW50cm9pZFgxICs9IHcgKiAoeDAgKyAoeDAgPSB4KSk7XG4gICAgICBkM19nZW9fY2VudHJvaWRZMSArPSB3ICogKHkwICsgKHkwID0geSkpO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWjEgKz0gdyAqICh6MCArICh6MCA9IHopKTtcbiAgICAgIGQzX2dlb19jZW50cm9pZFBvaW50WFlaKHgwLCB5MCwgejApO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY29tcG9zZShhLCBiKSB7XG4gICAgZnVuY3Rpb24gY29tcG9zZSh4LCB5KSB7XG4gICAgICByZXR1cm4geCA9IGEoeCwgeSksIGIoeFswXSwgeFsxXSk7XG4gICAgfVxuICAgIGlmIChhLmludmVydCAmJiBiLmludmVydCkgY29tcG9zZS5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4geCA9IGIuaW52ZXJ0KHgsIHkpLCB4ICYmIGEuaW52ZXJ0KHhbMF0sIHhbMV0pO1xuICAgIH07XG4gICAgcmV0dXJuIGNvbXBvc2U7XG4gIH1cbiAgZnVuY3Rpb24gZDNfdHJ1ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2xpcFBvbHlnb24oc2VnbWVudHMsIGNvbXBhcmUsIGNsaXBTdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIHN1YmplY3QgPSBbXSwgY2xpcCA9IFtdO1xuICAgIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24oc2VnbWVudCkge1xuICAgICAgaWYgKChuID0gc2VnbWVudC5sZW5ndGggLSAxKSA8PSAwKSByZXR1cm47XG4gICAgICB2YXIgbiwgcDAgPSBzZWdtZW50WzBdLCBwMSA9IHNlZ21lbnRbbl07XG4gICAgICBpZiAoZDNfZ2VvX3NwaGVyaWNhbEVxdWFsKHAwLCBwMSkpIHtcbiAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSBsaXN0ZW5lci5wb2ludCgocDAgPSBzZWdtZW50W2ldKVswXSwgcDBbMV0pO1xuICAgICAgICBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhID0gbmV3IGQzX2dlb19jbGlwUG9seWdvbkludGVyc2VjdGlvbihwMCwgc2VnbWVudCwgbnVsbCwgdHJ1ZSksIGIgPSBuZXcgZDNfZ2VvX2NsaXBQb2x5Z29uSW50ZXJzZWN0aW9uKHAwLCBudWxsLCBhLCBmYWxzZSk7XG4gICAgICBhLm8gPSBiO1xuICAgICAgc3ViamVjdC5wdXNoKGEpO1xuICAgICAgY2xpcC5wdXNoKGIpO1xuICAgICAgYSA9IG5ldyBkM19nZW9fY2xpcFBvbHlnb25JbnRlcnNlY3Rpb24ocDEsIHNlZ21lbnQsIG51bGwsIGZhbHNlKTtcbiAgICAgIGIgPSBuZXcgZDNfZ2VvX2NsaXBQb2x5Z29uSW50ZXJzZWN0aW9uKHAxLCBudWxsLCBhLCB0cnVlKTtcbiAgICAgIGEubyA9IGI7XG4gICAgICBzdWJqZWN0LnB1c2goYSk7XG4gICAgICBjbGlwLnB1c2goYik7XG4gICAgfSk7XG4gICAgY2xpcC5zb3J0KGNvbXBhcmUpO1xuICAgIGQzX2dlb19jbGlwUG9seWdvbkxpbmtDaXJjdWxhcihzdWJqZWN0KTtcbiAgICBkM19nZW9fY2xpcFBvbHlnb25MaW5rQ2lyY3VsYXIoY2xpcCk7XG4gICAgaWYgKCFzdWJqZWN0Lmxlbmd0aCkgcmV0dXJuO1xuICAgIGZvciAodmFyIGkgPSAwLCBlbnRyeSA9IGNsaXBTdGFydEluc2lkZSwgbiA9IGNsaXAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICBjbGlwW2ldLmUgPSBlbnRyeSA9ICFlbnRyeTtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gc3ViamVjdFswXSwgcG9pbnRzLCBwb2ludDtcbiAgICB3aGlsZSAoMSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBzdGFydCwgaXNTdWJqZWN0ID0gdHJ1ZTtcbiAgICAgIHdoaWxlIChjdXJyZW50LnYpIGlmICgoY3VycmVudCA9IGN1cnJlbnQubikgPT09IHN0YXJ0KSByZXR1cm47XG4gICAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgIGRvIHtcbiAgICAgICAgY3VycmVudC52ID0gY3VycmVudC5vLnYgPSB0cnVlO1xuICAgICAgICBpZiAoY3VycmVudC5lKSB7XG4gICAgICAgICAgaWYgKGlzU3ViamVjdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSBsaXN0ZW5lci5wb2ludCgocG9pbnQgPSBwb2ludHNbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGludGVycG9sYXRlKGN1cnJlbnQueCwgY3VycmVudC5uLngsIDEsIGxpc3RlbmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNTdWJqZWN0KSB7XG4gICAgICAgICAgICBwb2ludHMgPSBjdXJyZW50LnAuejtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIGxpc3RlbmVyLnBvaW50KChwb2ludCA9IHBvaW50c1tpXSlbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJwb2xhdGUoY3VycmVudC54LCBjdXJyZW50LnAueCwgLTEsIGxpc3RlbmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucDtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5vO1xuICAgICAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgICAgIGlzU3ViamVjdCA9ICFpc1N1YmplY3Q7XG4gICAgICB9IHdoaWxlICghY3VycmVudC52KTtcbiAgICAgIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NsaXBQb2x5Z29uTGlua0NpcmN1bGFyKGFycmF5KSB7XG4gICAgaWYgKCEobiA9IGFycmF5Lmxlbmd0aCkpIHJldHVybjtcbiAgICB2YXIgbiwgaSA9IDAsIGEgPSBhcnJheVswXSwgYjtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYS5uID0gYiA9IGFycmF5W2ldO1xuICAgICAgYi5wID0gYTtcbiAgICAgIGEgPSBiO1xuICAgIH1cbiAgICBhLm4gPSBiID0gYXJyYXlbMF07XG4gICAgYi5wID0gYTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2xpcFBvbHlnb25JbnRlcnNlY3Rpb24ocG9pbnQsIHBvaW50cywgb3RoZXIsIGVudHJ5KSB7XG4gICAgdGhpcy54ID0gcG9pbnQ7XG4gICAgdGhpcy56ID0gcG9pbnRzO1xuICAgIHRoaXMubyA9IG90aGVyO1xuICAgIHRoaXMuZSA9IGVudHJ5O1xuICAgIHRoaXMudiA9IGZhbHNlO1xuICAgIHRoaXMubiA9IHRoaXMucCA9IG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NsaXAocG9pbnRWaXNpYmxlLCBjbGlwTGluZSwgaW50ZXJwb2xhdGUsIGNsaXBTdGFydCkge1xuICAgIHJldHVybiBmdW5jdGlvbihyb3RhdGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGluZSA9IGNsaXBMaW5lKGxpc3RlbmVyKSwgcm90YXRlZENsaXBTdGFydCA9IHJvdGF0ZS5pbnZlcnQoY2xpcFN0YXJ0WzBdLCBjbGlwU3RhcnRbMV0pO1xuICAgICAgdmFyIGNsaXAgPSB7XG4gICAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2xpcC5wb2ludCA9IHBvaW50UmluZztcbiAgICAgICAgICBjbGlwLmxpbmVTdGFydCA9IHJpbmdTdGFydDtcbiAgICAgICAgICBjbGlwLmxpbmVFbmQgPSByaW5nRW5kO1xuICAgICAgICAgIHNlZ21lbnRzID0gW107XG4gICAgICAgICAgcG9seWdvbiA9IFtdO1xuICAgICAgICB9LFxuICAgICAgICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICAgICAgY2xpcC5saW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG4gICAgICAgICAgY2xpcC5saW5lRW5kID0gbGluZUVuZDtcbiAgICAgICAgICBzZWdtZW50cyA9IGQzLm1lcmdlKHNlZ21lbnRzKTtcbiAgICAgICAgICB2YXIgY2xpcFN0YXJ0SW5zaWRlID0gZDNfZ2VvX3BvaW50SW5Qb2x5Z29uKHJvdGF0ZWRDbGlwU3RhcnQsIHBvbHlnb24pO1xuICAgICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghcG9seWdvblN0YXJ0ZWQpIGxpc3RlbmVyLnBvbHlnb25TdGFydCgpLCBwb2x5Z29uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBkM19nZW9fY2xpcFBvbHlnb24oc2VnbWVudHMsIGQzX2dlb19jbGlwU29ydCwgY2xpcFN0YXJ0SW5zaWRlLCBpbnRlcnBvbGF0ZSwgbGlzdGVuZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2xpcFN0YXJ0SW5zaWRlKSB7XG4gICAgICAgICAgICBpZiAoIXBvbHlnb25TdGFydGVkKSBsaXN0ZW5lci5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBpbnRlcnBvbGF0ZShudWxsLCBudWxsLCAxLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwb2x5Z29uU3RhcnRlZCkgbGlzdGVuZXIucG9seWdvbkVuZCgpLCBwb2x5Z29uU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgIHNlZ21lbnRzID0gcG9seWdvbiA9IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIHNwaGVyZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGlzdGVuZXIucG9seWdvblN0YXJ0KCk7XG4gICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgbGlzdGVuZXIpO1xuICAgICAgICAgIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgICAgICAgICBsaXN0ZW5lci5wb2x5Z29uRW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBwb2ludCjOuywgz4YpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gcm90YXRlKM67LCDPhik7XG4gICAgICAgIGlmIChwb2ludFZpc2libGUozrsgPSBwb2ludFswXSwgz4YgPSBwb2ludFsxXSkpIGxpc3RlbmVyLnBvaW50KM67LCDPhik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBwb2ludExpbmUozrssIM+GKSB7XG4gICAgICAgIHZhciBwb2ludCA9IHJvdGF0ZSjOuywgz4YpO1xuICAgICAgICBsaW5lLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBwb2ludExpbmU7XG4gICAgICAgIGxpbmUubGluZVN0YXJ0KCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICAgIGxpbmUubGluZUVuZCgpO1xuICAgICAgfVxuICAgICAgdmFyIHNlZ21lbnRzO1xuICAgICAgdmFyIGJ1ZmZlciA9IGQzX2dlb19jbGlwQnVmZmVyTGlzdGVuZXIoKSwgcmluZ0xpc3RlbmVyID0gY2xpcExpbmUoYnVmZmVyKSwgcG9seWdvblN0YXJ0ZWQgPSBmYWxzZSwgcG9seWdvbiwgcmluZztcbiAgICAgIGZ1bmN0aW9uIHBvaW50UmluZyjOuywgz4YpIHtcbiAgICAgICAgcmluZy5wdXNoKFsgzrssIM+GIF0pO1xuICAgICAgICB2YXIgcG9pbnQgPSByb3RhdGUozrssIM+GKTtcbiAgICAgICAgcmluZ0xpc3RlbmVyLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiByaW5nU3RhcnQoKSB7XG4gICAgICAgIHJpbmdMaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgcmluZyA9IFtdO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmluZ0VuZCgpIHtcbiAgICAgICAgcG9pbnRSaW5nKHJpbmdbMF1bMF0sIHJpbmdbMF1bMV0pO1xuICAgICAgICByaW5nTGlzdGVuZXIubGluZUVuZCgpO1xuICAgICAgICB2YXIgY2xlYW4gPSByaW5nTGlzdGVuZXIuY2xlYW4oKSwgcmluZ1NlZ21lbnRzID0gYnVmZmVyLmJ1ZmZlcigpLCBzZWdtZW50LCBuID0gcmluZ1NlZ21lbnRzLmxlbmd0aDtcbiAgICAgICAgcmluZy5wb3AoKTtcbiAgICAgICAgcG9seWdvbi5wdXNoKHJpbmcpO1xuICAgICAgICByaW5nID0gbnVsbDtcbiAgICAgICAgaWYgKCFuKSByZXR1cm47XG4gICAgICAgIGlmIChjbGVhbiAmIDEpIHtcbiAgICAgICAgICBzZWdtZW50ID0gcmluZ1NlZ21lbnRzWzBdO1xuICAgICAgICAgIHZhciBuID0gc2VnbWVudC5sZW5ndGggLSAxLCBpID0gLTEsIHBvaW50O1xuICAgICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgbGlzdGVuZXIucG9seWdvblN0YXJ0KCksIHBvbHlnb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxpc3RlbmVyLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IG4pIGxpc3RlbmVyLnBvaW50KChwb2ludCA9IHNlZ21lbnRbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgICAgICBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobiA+IDEgJiYgY2xlYW4gJiAyKSByaW5nU2VnbWVudHMucHVzaChyaW5nU2VnbWVudHMucG9wKCkuY29uY2F0KHJpbmdTZWdtZW50cy5zaGlmdCgpKSk7XG4gICAgICAgIHNlZ21lbnRzLnB1c2gocmluZ1NlZ21lbnRzLmZpbHRlcihkM19nZW9fY2xpcFNlZ21lbnRMZW5ndGgxKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2xpcDtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jbGlwU2VnbWVudExlbmd0aDEoc2VnbWVudCkge1xuICAgIHJldHVybiBzZWdtZW50Lmxlbmd0aCA+IDE7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NsaXBCdWZmZXJMaXN0ZW5lcigpIHtcbiAgICB2YXIgbGluZXMgPSBbXSwgbGluZTtcbiAgICByZXR1cm4ge1xuICAgICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGluZXMucHVzaChsaW5lID0gW10pO1xuICAgICAgfSxcbiAgICAgIHBvaW50OiBmdW5jdGlvbijOuywgz4YpIHtcbiAgICAgICAgbGluZS5wdXNoKFsgzrssIM+GIF0pO1xuICAgICAgfSxcbiAgICAgIGxpbmVFbmQ6IGQzX25vb3AsXG4gICAgICBidWZmZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gbGluZXM7XG4gICAgICAgIGxpbmVzID0gW107XG4gICAgICAgIGxpbmUgPSBudWxsO1xuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgfSxcbiAgICAgIHJlam9pbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAxKSBsaW5lcy5wdXNoKGxpbmVzLnBvcCgpLmNvbmNhdChsaW5lcy5zaGlmdCgpKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2xpcFNvcnQoYSwgYikge1xuICAgIHJldHVybiAoKGEgPSBhLngpWzBdIDwgMCA/IGFbMV0gLSBoYWxmz4AgLSDOtSA6IGhhbGbPgCAtIGFbMV0pIC0gKChiID0gYi54KVswXSA8IDAgPyBiWzFdIC0gaGFsZs+AIC0gzrUgOiBoYWxmz4AgLSBiWzFdKTtcbiAgfVxuICB2YXIgZDNfZ2VvX2NsaXBBbnRpbWVyaWRpYW4gPSBkM19nZW9fY2xpcChkM190cnVlLCBkM19nZW9fY2xpcEFudGltZXJpZGlhbkxpbmUsIGQzX2dlb19jbGlwQW50aW1lcmlkaWFuSW50ZXJwb2xhdGUsIFsgLc+ALCAtz4AgLyAyIF0pO1xuICBmdW5jdGlvbiBkM19nZW9fY2xpcEFudGltZXJpZGlhbkxpbmUobGlzdGVuZXIpIHtcbiAgICB2YXIgzrswID0gTmFOLCDPhjAgPSBOYU4sIHPOuzAgPSBOYU4sIGNsZWFuO1xuICAgIHJldHVybiB7XG4gICAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgY2xlYW4gPSAxO1xuICAgICAgfSxcbiAgICAgIHBvaW50OiBmdW5jdGlvbijOuzEsIM+GMSkge1xuICAgICAgICB2YXIgc867MSA9IM67MSA+IDAgPyDPgCA6IC3PgCwgZM67ID0gYWJzKM67MSAtIM67MCk7XG4gICAgICAgIGlmIChhYnMoZM67IC0gz4ApIDwgzrUpIHtcbiAgICAgICAgICBsaXN0ZW5lci5wb2ludCjOuzAsIM+GMCA9ICjPhjAgKyDPhjEpIC8gMiA+IDAgPyBoYWxmz4AgOiAtaGFsZs+AKTtcbiAgICAgICAgICBsaXN0ZW5lci5wb2ludChzzrswLCDPhjApO1xuICAgICAgICAgIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgICAgICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgICBsaXN0ZW5lci5wb2ludChzzrsxLCDPhjApO1xuICAgICAgICAgIGxpc3RlbmVyLnBvaW50KM67MSwgz4YwKTtcbiAgICAgICAgICBjbGVhbiA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc867MCAhPT0gc867MSAmJiBkzrsgPj0gz4ApIHtcbiAgICAgICAgICBpZiAoYWJzKM67MCAtIHPOuzApIDwgzrUpIM67MCAtPSBzzrswICogzrU7XG4gICAgICAgICAgaWYgKGFicyjOuzEgLSBzzrsxKSA8IM61KSDOuzEgLT0gc867MSAqIM61O1xuICAgICAgICAgIM+GMCA9IGQzX2dlb19jbGlwQW50aW1lcmlkaWFuSW50ZXJzZWN0KM67MCwgz4YwLCDOuzEsIM+GMSk7XG4gICAgICAgICAgbGlzdGVuZXIucG9pbnQoc867MCwgz4YwKTtcbiAgICAgICAgICBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgbGlzdGVuZXIucG9pbnQoc867MSwgz4YwKTtcbiAgICAgICAgICBjbGVhbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXIucG9pbnQozrswID0gzrsxLCDPhjAgPSDPhjEpO1xuICAgICAgICBzzrswID0gc867MTtcbiAgICAgIH0sXG4gICAgICBsaW5lRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGlzdGVuZXIubGluZUVuZCgpO1xuICAgICAgICDOuzAgPSDPhjAgPSBOYU47XG4gICAgICB9LFxuICAgICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gMiAtIGNsZWFuO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NsaXBBbnRpbWVyaWRpYW5JbnRlcnNlY3QozrswLCDPhjAsIM67MSwgz4YxKSB7XG4gICAgdmFyIGNvc8+GMCwgY29zz4YxLCBzaW7OuzBfzrsxID0gTWF0aC5zaW4ozrswIC0gzrsxKTtcbiAgICByZXR1cm4gYWJzKHNpbs67MF/OuzEpID4gzrUgPyBNYXRoLmF0YW4oKE1hdGguc2luKM+GMCkgKiAoY29zz4YxID0gTWF0aC5jb3Moz4YxKSkgKiBNYXRoLnNpbijOuzEpIC0gTWF0aC5zaW4oz4YxKSAqIChjb3PPhjAgPSBNYXRoLmNvcyjPhjApKSAqIE1hdGguc2luKM67MCkpIC8gKGNvc8+GMCAqIGNvc8+GMSAqIHNpbs67MF/OuzEpKSA6ICjPhjAgKyDPhjEpIC8gMjtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2xpcEFudGltZXJpZGlhbkludGVycG9sYXRlKGZyb20sIHRvLCBkaXJlY3Rpb24sIGxpc3RlbmVyKSB7XG4gICAgdmFyIM+GO1xuICAgIGlmIChmcm9tID09IG51bGwpIHtcbiAgICAgIM+GID0gZGlyZWN0aW9uICogaGFsZs+AO1xuICAgICAgbGlzdGVuZXIucG9pbnQoLc+ALCDPhik7XG4gICAgICBsaXN0ZW5lci5wb2ludCgwLCDPhik7XG4gICAgICBsaXN0ZW5lci5wb2ludCjPgCwgz4YpO1xuICAgICAgbGlzdGVuZXIucG9pbnQoz4AsIDApO1xuICAgICAgbGlzdGVuZXIucG9pbnQoz4AsIC3Phik7XG4gICAgICBsaXN0ZW5lci5wb2ludCgwLCAtz4YpO1xuICAgICAgbGlzdGVuZXIucG9pbnQoLc+ALCAtz4YpO1xuICAgICAgbGlzdGVuZXIucG9pbnQoLc+ALCAwKTtcbiAgICAgIGxpc3RlbmVyLnBvaW50KC3PgCwgz4YpO1xuICAgIH0gZWxzZSBpZiAoYWJzKGZyb21bMF0gLSB0b1swXSkgPiDOtSkge1xuICAgICAgdmFyIHMgPSBmcm9tWzBdIDwgdG9bMF0gPyDPgCA6IC3PgDtcbiAgICAgIM+GID0gZGlyZWN0aW9uICogcyAvIDI7XG4gICAgICBsaXN0ZW5lci5wb2ludCgtcywgz4YpO1xuICAgICAgbGlzdGVuZXIucG9pbnQoMCwgz4YpO1xuICAgICAgbGlzdGVuZXIucG9pbnQocywgz4YpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ZW5lci5wb2ludCh0b1swXSwgdG9bMV0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fcG9pbnRJblBvbHlnb24ocG9pbnQsIHBvbHlnb24pIHtcbiAgICB2YXIgbWVyaWRpYW4gPSBwb2ludFswXSwgcGFyYWxsZWwgPSBwb2ludFsxXSwgbWVyaWRpYW5Ob3JtYWwgPSBbIE1hdGguc2luKG1lcmlkaWFuKSwgLU1hdGguY29zKG1lcmlkaWFuKSwgMCBdLCBwb2xhckFuZ2xlID0gMCwgd2luZGluZyA9IDA7XG4gICAgZDNfZ2VvX2FyZWFSaW5nU3VtLnJlc2V0KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIHJpbmcgPSBwb2x5Z29uW2ldLCBtID0gcmluZy5sZW5ndGg7XG4gICAgICBpZiAoIW0pIGNvbnRpbnVlO1xuICAgICAgdmFyIHBvaW50MCA9IHJpbmdbMF0sIM67MCA9IHBvaW50MFswXSwgz4YwID0gcG9pbnQwWzFdIC8gMiArIM+AIC8gNCwgc2luz4YwID0gTWF0aC5zaW4oz4YwKSwgY29zz4YwID0gTWF0aC5jb3Moz4YwKSwgaiA9IDE7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAoaiA9PT0gbSkgaiA9IDA7XG4gICAgICAgIHBvaW50ID0gcmluZ1tqXTtcbiAgICAgICAgdmFyIM67ID0gcG9pbnRbMF0sIM+GID0gcG9pbnRbMV0gLyAyICsgz4AgLyA0LCBzaW7PhiA9IE1hdGguc2luKM+GKSwgY29zz4YgPSBNYXRoLmNvcyjPhiksIGTOuyA9IM67IC0gzrswLCBzZM67ID0gZM67ID49IDAgPyAxIDogLTEsIGFkzrsgPSBzZM67ICogZM67LCBhbnRpbWVyaWRpYW4gPSBhZM67ID4gz4AsIGsgPSBzaW7PhjAgKiBzaW7PhjtcbiAgICAgICAgZDNfZ2VvX2FyZWFSaW5nU3VtLmFkZChNYXRoLmF0YW4yKGsgKiBzZM67ICogTWF0aC5zaW4oYWTOuyksIGNvc8+GMCAqIGNvc8+GICsgayAqIE1hdGguY29zKGFkzrspKSk7XG4gICAgICAgIHBvbGFyQW5nbGUgKz0gYW50aW1lcmlkaWFuID8gZM67ICsgc2TOuyAqIM+EIDogZM67O1xuICAgICAgICBpZiAoYW50aW1lcmlkaWFuIF4gzrswID49IG1lcmlkaWFuIF4gzrsgPj0gbWVyaWRpYW4pIHtcbiAgICAgICAgICB2YXIgYXJjID0gZDNfZ2VvX2NhcnRlc2lhbkNyb3NzKGQzX2dlb19jYXJ0ZXNpYW4ocG9pbnQwKSwgZDNfZ2VvX2NhcnRlc2lhbihwb2ludCkpO1xuICAgICAgICAgIGQzX2dlb19jYXJ0ZXNpYW5Ob3JtYWxpemUoYXJjKTtcbiAgICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0gZDNfZ2VvX2NhcnRlc2lhbkNyb3NzKG1lcmlkaWFuTm9ybWFsLCBhcmMpO1xuICAgICAgICAgIGQzX2dlb19jYXJ0ZXNpYW5Ob3JtYWxpemUoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICB2YXIgz4ZhcmMgPSAoYW50aW1lcmlkaWFuIF4gZM67ID49IDAgPyAtMSA6IDEpICogZDNfYXNpbihpbnRlcnNlY3Rpb25bMl0pO1xuICAgICAgICAgIGlmIChwYXJhbGxlbCA+IM+GYXJjIHx8IHBhcmFsbGVsID09PSDPhmFyYyAmJiAoYXJjWzBdIHx8IGFyY1sxXSkpIHtcbiAgICAgICAgICAgIHdpbmRpbmcgKz0gYW50aW1lcmlkaWFuIF4gZM67ID49IDAgPyAxIDogLTE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaisrKSBicmVhaztcbiAgICAgICAgzrswID0gzrssIHNpbs+GMCA9IHNpbs+GLCBjb3PPhjAgPSBjb3PPhiwgcG9pbnQwID0gcG9pbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAocG9sYXJBbmdsZSA8IC3OtSB8fCBwb2xhckFuZ2xlIDwgzrUgJiYgZDNfZ2VvX2FyZWFSaW5nU3VtIDwgLc61KSBeIHdpbmRpbmcgJiAxO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19jbGlwQ2lyY2xlKHJhZGl1cykge1xuICAgIHZhciBjciA9IE1hdGguY29zKHJhZGl1cyksIHNtYWxsUmFkaXVzID0gY3IgPiAwLCBub3RIZW1pc3BoZXJlID0gYWJzKGNyKSA+IM61LCBpbnRlcnBvbGF0ZSA9IGQzX2dlb19jaXJjbGVJbnRlcnBvbGF0ZShyYWRpdXMsIDYgKiBkM19yYWRpYW5zKTtcbiAgICByZXR1cm4gZDNfZ2VvX2NsaXAodmlzaWJsZSwgY2xpcExpbmUsIGludGVycG9sYXRlLCBzbWFsbFJhZGl1cyA/IFsgMCwgLXJhZGl1cyBdIDogWyAtz4AsIHJhZGl1cyAtIM+AIF0pO1xuICAgIGZ1bmN0aW9uIHZpc2libGUozrssIM+GKSB7XG4gICAgICByZXR1cm4gTWF0aC5jb3MozrspICogTWF0aC5jb3Moz4YpID4gY3I7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsaXBMaW5lKGxpc3RlbmVyKSB7XG4gICAgICB2YXIgcG9pbnQwLCBjMCwgdjAsIHYwMCwgY2xlYW47XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHYwMCA9IHYwID0gZmFsc2U7XG4gICAgICAgICAgY2xlYW4gPSAxO1xuICAgICAgICB9LFxuICAgICAgICBwb2ludDogZnVuY3Rpb24ozrssIM+GKSB7XG4gICAgICAgICAgdmFyIHBvaW50MSA9IFsgzrssIM+GIF0sIHBvaW50MiwgdiA9IHZpc2libGUozrssIM+GKSwgYyA9IHNtYWxsUmFkaXVzID8gdiA/IDAgOiBjb2RlKM67LCDPhikgOiB2ID8gY29kZSjOuyArICjOuyA8IDAgPyDPgCA6IC3PgCksIM+GKSA6IDA7XG4gICAgICAgICAgaWYgKCFwb2ludDAgJiYgKHYwMCA9IHYwID0gdikpIGxpc3RlbmVyLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGlmICh2ICE9PSB2MCkge1xuICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICAgIGlmIChkM19nZW9fc3BoZXJpY2FsRXF1YWwocG9pbnQwLCBwb2ludDIpIHx8IGQzX2dlb19zcGhlcmljYWxFcXVhbChwb2ludDEsIHBvaW50MikpIHtcbiAgICAgICAgICAgICAgcG9pbnQxWzBdICs9IM61O1xuICAgICAgICAgICAgICBwb2ludDFbMV0gKz0gzrU7XG4gICAgICAgICAgICAgIHYgPSB2aXNpYmxlKHBvaW50MVswXSwgcG9pbnQxWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHYgIT09IHYwKSB7XG4gICAgICAgICAgICBjbGVhbiA9IDA7XG4gICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MSwgcG9pbnQwKTtcbiAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQocG9pbnQyWzBdLCBwb2ludDJbMV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQocG9pbnQyWzBdLCBwb2ludDJbMV0pO1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludDAgPSBwb2ludDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChub3RIZW1pc3BoZXJlICYmIHBvaW50MCAmJiBzbWFsbFJhZGl1cyBeIHYpIHtcbiAgICAgICAgICAgIHZhciB0O1xuICAgICAgICAgICAgaWYgKCEoYyAmIGMwKSAmJiAodCA9IGludGVyc2VjdChwb2ludDEsIHBvaW50MCwgdHJ1ZSkpKSB7XG4gICAgICAgICAgICAgIGNsZWFuID0gMDtcbiAgICAgICAgICAgICAgaWYgKHNtYWxsUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQodFswXVswXSwgdFswXVsxXSk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQodFsxXVswXSwgdFsxXVsxXSk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIubGluZUVuZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnBvaW50KHRbMV1bMF0sIHRbMV1bMV0pO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wb2ludCh0WzBdWzBdLCB0WzBdWzFdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodiAmJiAoIXBvaW50MCB8fCAhZDNfZ2VvX3NwaGVyaWNhbEVxdWFsKHBvaW50MCwgcG9pbnQxKSkpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLnBvaW50KHBvaW50MVswXSwgcG9pbnQxWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcG9pbnQwID0gcG9pbnQxLCB2MCA9IHYsIGMwID0gYztcbiAgICAgICAgfSxcbiAgICAgICAgbGluZUVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHYwKSBsaXN0ZW5lci5saW5lRW5kKCk7XG4gICAgICAgICAgcG9pbnQwID0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBjbGVhbiB8ICh2MDAgJiYgdjApIDw8IDE7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludGVyc2VjdChhLCBiLCB0d28pIHtcbiAgICAgIHZhciBwYSA9IGQzX2dlb19jYXJ0ZXNpYW4oYSksIHBiID0gZDNfZ2VvX2NhcnRlc2lhbihiKTtcbiAgICAgIHZhciBuMSA9IFsgMSwgMCwgMCBdLCBuMiA9IGQzX2dlb19jYXJ0ZXNpYW5Dcm9zcyhwYSwgcGIpLCBuMm4yID0gZDNfZ2VvX2NhcnRlc2lhbkRvdChuMiwgbjIpLCBuMW4yID0gbjJbMF0sIGRldGVybWluYW50ID0gbjJuMiAtIG4xbjIgKiBuMW4yO1xuICAgICAgaWYgKCFkZXRlcm1pbmFudCkgcmV0dXJuICF0d28gJiYgYTtcbiAgICAgIHZhciBjMSA9IGNyICogbjJuMiAvIGRldGVybWluYW50LCBjMiA9IC1jciAqIG4xbjIgLyBkZXRlcm1pbmFudCwgbjF4bjIgPSBkM19nZW9fY2FydGVzaWFuQ3Jvc3MobjEsIG4yKSwgQSA9IGQzX2dlb19jYXJ0ZXNpYW5TY2FsZShuMSwgYzEpLCBCID0gZDNfZ2VvX2NhcnRlc2lhblNjYWxlKG4yLCBjMik7XG4gICAgICBkM19nZW9fY2FydGVzaWFuQWRkKEEsIEIpO1xuICAgICAgdmFyIHUgPSBuMXhuMiwgdyA9IGQzX2dlb19jYXJ0ZXNpYW5Eb3QoQSwgdSksIHV1ID0gZDNfZ2VvX2NhcnRlc2lhbkRvdCh1LCB1KSwgdDIgPSB3ICogdyAtIHV1ICogKGQzX2dlb19jYXJ0ZXNpYW5Eb3QoQSwgQSkgLSAxKTtcbiAgICAgIGlmICh0MiA8IDApIHJldHVybjtcbiAgICAgIHZhciB0ID0gTWF0aC5zcXJ0KHQyKSwgcSA9IGQzX2dlb19jYXJ0ZXNpYW5TY2FsZSh1LCAoLXcgLSB0KSAvIHV1KTtcbiAgICAgIGQzX2dlb19jYXJ0ZXNpYW5BZGQocSwgQSk7XG4gICAgICBxID0gZDNfZ2VvX3NwaGVyaWNhbChxKTtcbiAgICAgIGlmICghdHdvKSByZXR1cm4gcTtcbiAgICAgIHZhciDOuzAgPSBhWzBdLCDOuzEgPSBiWzBdLCDPhjAgPSBhWzFdLCDPhjEgPSBiWzFdLCB6O1xuICAgICAgaWYgKM67MSA8IM67MCkgeiA9IM67MCwgzrswID0gzrsxLCDOuzEgPSB6O1xuICAgICAgdmFyIM60zrsgPSDOuzEgLSDOuzAsIHBvbGFyID0gYWJzKM60zrsgLSDPgCkgPCDOtSwgbWVyaWRpYW4gPSBwb2xhciB8fCDOtM67IDwgzrU7XG4gICAgICBpZiAoIXBvbGFyICYmIM+GMSA8IM+GMCkgeiA9IM+GMCwgz4YwID0gz4YxLCDPhjEgPSB6O1xuICAgICAgaWYgKG1lcmlkaWFuID8gcG9sYXIgPyDPhjAgKyDPhjEgPiAwIF4gcVsxXSA8IChhYnMocVswXSAtIM67MCkgPCDOtSA/IM+GMCA6IM+GMSkgOiDPhjAgPD0gcVsxXSAmJiBxWzFdIDw9IM+GMSA6IM60zrsgPiDPgCBeICjOuzAgPD0gcVswXSAmJiBxWzBdIDw9IM67MSkpIHtcbiAgICAgICAgdmFyIHExID0gZDNfZ2VvX2NhcnRlc2lhblNjYWxlKHUsICgtdyArIHQpIC8gdXUpO1xuICAgICAgICBkM19nZW9fY2FydGVzaWFuQWRkKHExLCBBKTtcbiAgICAgICAgcmV0dXJuIFsgcSwgZDNfZ2VvX3NwaGVyaWNhbChxMSkgXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gY29kZSjOuywgz4YpIHtcbiAgICAgIHZhciByID0gc21hbGxSYWRpdXMgPyByYWRpdXMgOiDPgCAtIHJhZGl1cywgY29kZSA9IDA7XG4gICAgICBpZiAozrsgPCAtcikgY29kZSB8PSAxOyBlbHNlIGlmICjOuyA+IHIpIGNvZGUgfD0gMjtcbiAgICAgIGlmICjPhiA8IC1yKSBjb2RlIHw9IDQ7IGVsc2UgaWYgKM+GID4gcikgY29kZSB8PSA4O1xuICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fY2xpcExpbmUoeDAsIHkwLCB4MSwgeTEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIGEgPSBsaW5lLmEsIGIgPSBsaW5lLmIsIGF4ID0gYS54LCBheSA9IGEueSwgYnggPSBiLngsIGJ5ID0gYi55LCB0MCA9IDAsIHQxID0gMSwgZHggPSBieCAtIGF4LCBkeSA9IGJ5IC0gYXksIHI7XG4gICAgICByID0geDAgLSBheDtcbiAgICAgIGlmICghZHggJiYgciA+IDApIHJldHVybjtcbiAgICAgIHIgLz0gZHg7XG4gICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICAgICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICAgICAgfSBlbHNlIGlmIChkeCA+IDApIHtcbiAgICAgICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgICAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gICAgICB9XG4gICAgICByID0geDEgLSBheDtcbiAgICAgIGlmICghZHggJiYgciA8IDApIHJldHVybjtcbiAgICAgIHIgLz0gZHg7XG4gICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICAgICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICAgICAgfSBlbHNlIGlmIChkeCA+IDApIHtcbiAgICAgICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgICAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gICAgICB9XG4gICAgICByID0geTAgLSBheTtcbiAgICAgIGlmICghZHkgJiYgciA+IDApIHJldHVybjtcbiAgICAgIHIgLz0gZHk7XG4gICAgICBpZiAoZHkgPCAwKSB7XG4gICAgICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICAgICAgaWYgKHIgPCB0MSkgdDEgPSByO1xuICAgICAgfSBlbHNlIGlmIChkeSA+IDApIHtcbiAgICAgICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgICAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gICAgICB9XG4gICAgICByID0geTEgLSBheTtcbiAgICAgIGlmICghZHkgJiYgciA8IDApIHJldHVybjtcbiAgICAgIHIgLz0gZHk7XG4gICAgICBpZiAoZHkgPCAwKSB7XG4gICAgICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICAgICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICAgICAgfSBlbHNlIGlmIChkeSA+IDApIHtcbiAgICAgICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgICAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gICAgICB9XG4gICAgICBpZiAodDAgPiAwKSBsaW5lLmEgPSB7XG4gICAgICAgIHg6IGF4ICsgdDAgKiBkeCxcbiAgICAgICAgeTogYXkgKyB0MCAqIGR5XG4gICAgICB9O1xuICAgICAgaWYgKHQxIDwgMSkgbGluZS5iID0ge1xuICAgICAgICB4OiBheCArIHQxICogZHgsXG4gICAgICAgIHk6IGF5ICsgdDEgKiBkeVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG4gIH1cbiAgdmFyIGQzX2dlb19jbGlwRXh0ZW50TUFYID0gMWU5O1xuICBkMy5nZW8uY2xpcEV4dGVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4MCwgeTAsIHgxLCB5MSwgc3RyZWFtLCBjbGlwLCBjbGlwRXh0ZW50ID0ge1xuICAgICAgc3RyZWFtOiBmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgaWYgKHN0cmVhbSkgc3RyZWFtLnZhbGlkID0gZmFsc2U7XG4gICAgICAgIHN0cmVhbSA9IGNsaXAob3V0cHV0KTtcbiAgICAgICAgc3RyZWFtLnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHN0cmVhbTtcbiAgICAgIH0sXG4gICAgICBleHRlbnQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gWyBbIHgwLCB5MCBdLCBbIHgxLCB5MSBdIF07XG4gICAgICAgIGNsaXAgPSBkM19nZW9fY2xpcEV4dGVudCh4MCA9ICtfWzBdWzBdLCB5MCA9ICtfWzBdWzFdLCB4MSA9ICtfWzFdWzBdLCB5MSA9ICtfWzFdWzFdKTtcbiAgICAgICAgaWYgKHN0cmVhbSkgc3RyZWFtLnZhbGlkID0gZmFsc2UsIHN0cmVhbSA9IG51bGw7XG4gICAgICAgIHJldHVybiBjbGlwRXh0ZW50O1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGNsaXBFeHRlbnQuZXh0ZW50KFsgWyAwLCAwIF0sIFsgOTYwLCA1MDAgXSBdKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvX2NsaXBFeHRlbnQoeDAsIHkwLCB4MSwgeTEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0ZW5lcl8gPSBsaXN0ZW5lciwgYnVmZmVyTGlzdGVuZXIgPSBkM19nZW9fY2xpcEJ1ZmZlckxpc3RlbmVyKCksIGNsaXBMaW5lID0gZDNfZ2VvbV9jbGlwTGluZSh4MCwgeTAsIHgxLCB5MSksIHNlZ21lbnRzLCBwb2x5Z29uLCByaW5nO1xuICAgICAgdmFyIGNsaXAgPSB7XG4gICAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGlzdGVuZXIgPSBidWZmZXJMaXN0ZW5lcjtcbiAgICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICAgIHBvbHlnb24gPSBbXTtcbiAgICAgICAgICBjbGVhbiA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJfO1xuICAgICAgICAgIHNlZ21lbnRzID0gZDMubWVyZ2Uoc2VnbWVudHMpO1xuICAgICAgICAgIHZhciBjbGlwU3RhcnRJbnNpZGUgPSBpbnNpZGVQb2x5Z29uKFsgeDAsIHkxIF0pLCBpbnNpZGUgPSBjbGVhbiAmJiBjbGlwU3RhcnRJbnNpZGUsIHZpc2libGUgPSBzZWdtZW50cy5sZW5ndGg7XG4gICAgICAgICAgaWYgKGluc2lkZSB8fCB2aXNpYmxlKSB7XG4gICAgICAgICAgICBsaXN0ZW5lci5wb2x5Z29uU3RhcnQoKTtcbiAgICAgICAgICAgIGlmIChpbnNpZGUpIHtcbiAgICAgICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIGludGVycG9sYXRlKG51bGwsIG51bGwsIDEsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgbGlzdGVuZXIubGluZUVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZpc2libGUpIHtcbiAgICAgICAgICAgICAgZDNfZ2VvX2NsaXBQb2x5Z29uKHNlZ21lbnRzLCBjb21wYXJlLCBjbGlwU3RhcnRJbnNpZGUsIGludGVycG9sYXRlLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0ZW5lci5wb2x5Z29uRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlZ21lbnRzID0gcG9seWdvbiA9IHJpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gaW5zaWRlUG9seWdvbihwKSB7XG4gICAgICAgIHZhciB3biA9IDAsIG4gPSBwb2x5Z29uLmxlbmd0aCwgeSA9IHBbMV07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDEsIHYgPSBwb2x5Z29uW2ldLCBtID0gdi5sZW5ndGgsIGEgPSB2WzBdLCBiOyBqIDwgbTsgKytqKSB7XG4gICAgICAgICAgICBiID0gdltqXTtcbiAgICAgICAgICAgIGlmIChhWzFdIDw9IHkpIHtcbiAgICAgICAgICAgICAgaWYgKGJbMV0gPiB5ICYmIGQzX2Nyb3NzMmQoYSwgYiwgcCkgPiAwKSArK3duO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGJbMV0gPD0geSAmJiBkM19jcm9zczJkKGEsIGIsIHApIDwgMCkgLS13bjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGEgPSBiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd24gIT09IDA7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgYSA9IDAsIGExID0gMDtcbiAgICAgICAgaWYgKGZyb20gPT0gbnVsbCB8fCAoYSA9IGNvcm5lcihmcm9tLCBkaXJlY3Rpb24pKSAhPT0gKGExID0gY29ybmVyKHRvLCBkaXJlY3Rpb24pKSB8fCBjb21wYXJlUG9pbnRzKGZyb20sIHRvKSA8IDAgXiBkaXJlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQoYSA9PT0gMCB8fCBhID09PSAzID8geDAgOiB4MSwgYSA+IDEgPyB5MSA6IHkwKTtcbiAgICAgICAgICB9IHdoaWxlICgoYSA9IChhICsgZGlyZWN0aW9uICsgNCkgJSA0KSAhPT0gYTEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3RlbmVyLnBvaW50KHRvWzBdLCB0b1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHBvaW50VmlzaWJsZSh4LCB5KSB7XG4gICAgICAgIHJldHVybiB4MCA8PSB4ICYmIHggPD0geDEgJiYgeTAgPD0geSAmJiB5IDw9IHkxO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgICBpZiAocG9pbnRWaXNpYmxlKHgsIHkpKSBsaXN0ZW5lci5wb2ludCh4LCB5KTtcbiAgICAgIH1cbiAgICAgIHZhciB4X18sIHlfXywgdl9fLCB4XywgeV8sIHZfLCBmaXJzdCwgY2xlYW47XG4gICAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgICAgIGlmIChwb2x5Z29uKSBwb2x5Z29uLnB1c2gocmluZyA9IFtdKTtcbiAgICAgICAgZmlyc3QgPSB0cnVlO1xuICAgICAgICB2XyA9IGZhbHNlO1xuICAgICAgICB4XyA9IHlfID0gTmFOO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgICAgaWYgKHNlZ21lbnRzKSB7XG4gICAgICAgICAgbGluZVBvaW50KHhfXywgeV9fKTtcbiAgICAgICAgICBpZiAodl9fICYmIHZfKSBidWZmZXJMaXN0ZW5lci5yZWpvaW4oKTtcbiAgICAgICAgICBzZWdtZW50cy5wdXNoKGJ1ZmZlckxpc3RlbmVyLmJ1ZmZlcigpKTtcbiAgICAgICAgfVxuICAgICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICAgIGlmICh2XykgbGlzdGVuZXIubGluZUVuZCgpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbGluZVBvaW50KHgsIHkpIHtcbiAgICAgICAgeCA9IE1hdGgubWF4KC1kM19nZW9fY2xpcEV4dGVudE1BWCwgTWF0aC5taW4oZDNfZ2VvX2NsaXBFeHRlbnRNQVgsIHgpKTtcbiAgICAgICAgeSA9IE1hdGgubWF4KC1kM19nZW9fY2xpcEV4dGVudE1BWCwgTWF0aC5taW4oZDNfZ2VvX2NsaXBFeHRlbnRNQVgsIHkpKTtcbiAgICAgICAgdmFyIHYgPSBwb2ludFZpc2libGUoeCwgeSk7XG4gICAgICAgIGlmIChwb2x5Z29uKSByaW5nLnB1c2goWyB4LCB5IF0pO1xuICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICB4X18gPSB4LCB5X18gPSB5LCB2X18gPSB2O1xuICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQoeCwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2ICYmIHZfKSBsaXN0ZW5lci5wb2ludCh4LCB5KTsgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbCA9IHtcbiAgICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIHg6IHhfLFxuICAgICAgICAgICAgICAgIHk6IHlfXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGI6IHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjbGlwTGluZShsKSkge1xuICAgICAgICAgICAgICBpZiAoIXZfKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQobC5hLngsIGwuYS55KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsaXN0ZW5lci5wb2ludChsLmIueCwgbC5iLnkpO1xuICAgICAgICAgICAgICBpZiAoIXYpIGxpc3RlbmVyLmxpbmVFbmQoKTtcbiAgICAgICAgICAgICAgY2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodikge1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saW5lU3RhcnQoKTtcbiAgICAgICAgICAgICAgbGlzdGVuZXIucG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAgIGNsZWFuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHhfID0geCwgeV8gPSB5LCB2XyA9IHY7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2xpcDtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGNvcm5lcihwLCBkaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBhYnMocFswXSAtIHgwKSA8IM61ID8gZGlyZWN0aW9uID4gMCA/IDAgOiAzIDogYWJzKHBbMF0gLSB4MSkgPCDOtSA/IGRpcmVjdGlvbiA+IDAgPyAyIDogMSA6IGFicyhwWzFdIC0geTApIDwgzrUgPyBkaXJlY3Rpb24gPiAwID8gMSA6IDAgOiBkaXJlY3Rpb24gPiAwID8gMyA6IDI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAgcmV0dXJuIGNvbXBhcmVQb2ludHMoYS54LCBiLngpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb21wYXJlUG9pbnRzKGEsIGIpIHtcbiAgICAgIHZhciBjYSA9IGNvcm5lcihhLCAxKSwgY2IgPSBjb3JuZXIoYiwgMSk7XG4gICAgICByZXR1cm4gY2EgIT09IGNiID8gY2EgLSBjYiA6IGNhID09PSAwID8gYlsxXSAtIGFbMV0gOiBjYSA9PT0gMSA/IGFbMF0gLSBiWzBdIDogY2EgPT09IDIgPyBhWzFdIC0gYlsxXSA6IGJbMF0gLSBhWzBdO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY29uaWMocHJvamVjdEF0KSB7XG4gICAgdmFyIM+GMCA9IDAsIM+GMSA9IM+AIC8gMywgbSA9IGQzX2dlb19wcm9qZWN0aW9uTXV0YXRvcihwcm9qZWN0QXQpLCBwID0gbSjPhjAsIM+GMSk7XG4gICAgcC5wYXJhbGxlbHMgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBbIM+GMCAvIM+AICogMTgwLCDPhjEgLyDPgCAqIDE4MCBdO1xuICAgICAgcmV0dXJuIG0oz4YwID0gX1swXSAqIM+AIC8gMTgwLCDPhjEgPSBfWzFdICogz4AgLyAxODApO1xuICAgIH07XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2NvbmljRXF1YWxBcmVhKM+GMCwgz4YxKSB7XG4gICAgdmFyIHNpbs+GMCA9IE1hdGguc2luKM+GMCksIG4gPSAoc2luz4YwICsgTWF0aC5zaW4oz4YxKSkgLyAyLCBDID0gMSArIHNpbs+GMCAqICgyICogbiAtIHNpbs+GMCksIM+BMCA9IE1hdGguc3FydChDKSAvIG47XG4gICAgZnVuY3Rpb24gZm9yd2FyZCjOuywgz4YpIHtcbiAgICAgIHZhciDPgSA9IE1hdGguc3FydChDIC0gMiAqIG4gKiBNYXRoLnNpbijPhikpIC8gbjtcbiAgICAgIHJldHVybiBbIM+BICogTWF0aC5zaW4ozrsgKj0gbiksIM+BMCAtIM+BICogTWF0aC5jb3MozrspIF07XG4gICAgfVxuICAgIGZvcndhcmQuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgdmFyIM+BMF95ID0gz4EwIC0geTtcbiAgICAgIHJldHVybiBbIE1hdGguYXRhbjIoeCwgz4EwX3kpIC8gbiwgZDNfYXNpbigoQyAtICh4ICogeCArIM+BMF95ICogz4EwX3kpICogbiAqIG4pIC8gKDIgKiBuKSkgXTtcbiAgICB9O1xuICAgIHJldHVybiBmb3J3YXJkO1xuICB9XG4gIChkMy5nZW8uY29uaWNFcXVhbEFyZWEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfZ2VvX2NvbmljKGQzX2dlb19jb25pY0VxdWFsQXJlYSk7XG4gIH0pLnJhdyA9IGQzX2dlb19jb25pY0VxdWFsQXJlYTtcbiAgZDMuZ2VvLmFsYmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkMy5nZW8uY29uaWNFcXVhbEFyZWEoKS5yb3RhdGUoWyA5NiwgMCBdKS5jZW50ZXIoWyAtLjYsIDM4LjcgXSkucGFyYWxsZWxzKFsgMjkuNSwgNDUuNSBdKS5zY2FsZSgxMDcwKTtcbiAgfTtcbiAgZDMuZ2VvLmFsYmVyc1VzYSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb3dlcjQ4ID0gZDMuZ2VvLmFsYmVycygpO1xuICAgIHZhciBhbGFza2EgPSBkMy5nZW8uY29uaWNFcXVhbEFyZWEoKS5yb3RhdGUoWyAxNTQsIDAgXSkuY2VudGVyKFsgLTIsIDU4LjUgXSkucGFyYWxsZWxzKFsgNTUsIDY1IF0pO1xuICAgIHZhciBoYXdhaWkgPSBkMy5nZW8uY29uaWNFcXVhbEFyZWEoKS5yb3RhdGUoWyAxNTcsIDAgXSkuY2VudGVyKFsgLTMsIDE5LjkgXSkucGFyYWxsZWxzKFsgOCwgMTggXSk7XG4gICAgdmFyIHBvaW50LCBwb2ludFN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHBvaW50ID0gWyB4LCB5IF07XG4gICAgICB9XG4gICAgfSwgbG93ZXI0OFBvaW50LCBhbGFza2FQb2ludCwgaGF3YWlpUG9pbnQ7XG4gICAgZnVuY3Rpb24gYWxiZXJzVXNhKGNvb3JkaW5hdGVzKSB7XG4gICAgICB2YXIgeCA9IGNvb3JkaW5hdGVzWzBdLCB5ID0gY29vcmRpbmF0ZXNbMV07XG4gICAgICBwb2ludCA9IG51bGw7XG4gICAgICAobG93ZXI0OFBvaW50KHgsIHkpLCBwb2ludCkgfHwgKGFsYXNrYVBvaW50KHgsIHkpLCBwb2ludCkgfHwgaGF3YWlpUG9pbnQoeCwgeSk7XG4gICAgICByZXR1cm4gcG9pbnQ7XG4gICAgfVxuICAgIGFsYmVyc1VzYS5pbnZlcnQgPSBmdW5jdGlvbihjb29yZGluYXRlcykge1xuICAgICAgdmFyIGsgPSBsb3dlcjQ4LnNjYWxlKCksIHQgPSBsb3dlcjQ4LnRyYW5zbGF0ZSgpLCB4ID0gKGNvb3JkaW5hdGVzWzBdIC0gdFswXSkgLyBrLCB5ID0gKGNvb3JkaW5hdGVzWzFdIC0gdFsxXSkgLyBrO1xuICAgICAgcmV0dXJuICh5ID49IC4xMiAmJiB5IDwgLjIzNCAmJiB4ID49IC0uNDI1ICYmIHggPCAtLjIxNCA/IGFsYXNrYSA6IHkgPj0gLjE2NiAmJiB5IDwgLjIzNCAmJiB4ID49IC0uMjE0ICYmIHggPCAtLjExNSA/IGhhd2FpaSA6IGxvd2VyNDgpLmludmVydChjb29yZGluYXRlcyk7XG4gICAgfTtcbiAgICBhbGJlcnNVc2Euc3RyZWFtID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICB2YXIgbG93ZXI0OFN0cmVhbSA9IGxvd2VyNDguc3RyZWFtKHN0cmVhbSksIGFsYXNrYVN0cmVhbSA9IGFsYXNrYS5zdHJlYW0oc3RyZWFtKSwgaGF3YWlpU3RyZWFtID0gaGF3YWlpLnN0cmVhbShzdHJlYW0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgICBsb3dlcjQ4U3RyZWFtLnBvaW50KHgsIHkpO1xuICAgICAgICAgIGFsYXNrYVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgICBoYXdhaWlTdHJlYW0ucG9pbnQoeCwgeSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNwaGVyZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG93ZXI0OFN0cmVhbS5zcGhlcmUoKTtcbiAgICAgICAgICBhbGFza2FTdHJlYW0uc3BoZXJlKCk7XG4gICAgICAgICAgaGF3YWlpU3RyZWFtLnNwaGVyZSgpO1xuICAgICAgICB9LFxuICAgICAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxvd2VyNDhTdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgYWxhc2thU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGhhd2FpaVN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbGluZUVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG93ZXI0OFN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgYWxhc2thU3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgICBoYXdhaWlTdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICB9LFxuICAgICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxvd2VyNDhTdHJlYW0ucG9seWdvblN0YXJ0KCk7XG4gICAgICAgICAgYWxhc2thU3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICAgICAgICAgIGhhd2FpaVN0cmVhbS5wb2x5Z29uU3RhcnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG93ZXI0OFN0cmVhbS5wb2x5Z29uRW5kKCk7XG4gICAgICAgICAgYWxhc2thU3RyZWFtLnBvbHlnb25FbmQoKTtcbiAgICAgICAgICBoYXdhaWlTdHJlYW0ucG9seWdvbkVuZCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gICAgYWxiZXJzVXNhLnByZWNpc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxvd2VyNDgucHJlY2lzaW9uKCk7XG4gICAgICBsb3dlcjQ4LnByZWNpc2lvbihfKTtcbiAgICAgIGFsYXNrYS5wcmVjaXNpb24oXyk7XG4gICAgICBoYXdhaWkucHJlY2lzaW9uKF8pO1xuICAgICAgcmV0dXJuIGFsYmVyc1VzYTtcbiAgICB9O1xuICAgIGFsYmVyc1VzYS5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxvd2VyNDguc2NhbGUoKTtcbiAgICAgIGxvd2VyNDguc2NhbGUoXyk7XG4gICAgICBhbGFza2Euc2NhbGUoXyAqIC4zNSk7XG4gICAgICBoYXdhaWkuc2NhbGUoXyk7XG4gICAgICByZXR1cm4gYWxiZXJzVXNhLnRyYW5zbGF0ZShsb3dlcjQ4LnRyYW5zbGF0ZSgpKTtcbiAgICB9O1xuICAgIGFsYmVyc1VzYS50cmFuc2xhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsb3dlcjQ4LnRyYW5zbGF0ZSgpO1xuICAgICAgdmFyIGsgPSBsb3dlcjQ4LnNjYWxlKCksIHggPSArX1swXSwgeSA9ICtfWzFdO1xuICAgICAgbG93ZXI0OFBvaW50ID0gbG93ZXI0OC50cmFuc2xhdGUoXykuY2xpcEV4dGVudChbIFsgeCAtIC40NTUgKiBrLCB5IC0gLjIzOCAqIGsgXSwgWyB4ICsgLjQ1NSAqIGssIHkgKyAuMjM4ICogayBdIF0pLnN0cmVhbShwb2ludFN0cmVhbSkucG9pbnQ7XG4gICAgICBhbGFza2FQb2ludCA9IGFsYXNrYS50cmFuc2xhdGUoWyB4IC0gLjMwNyAqIGssIHkgKyAuMjAxICogayBdKS5jbGlwRXh0ZW50KFsgWyB4IC0gLjQyNSAqIGsgKyDOtSwgeSArIC4xMiAqIGsgKyDOtSBdLCBbIHggLSAuMjE0ICogayAtIM61LCB5ICsgLjIzNCAqIGsgLSDOtSBdIF0pLnN0cmVhbShwb2ludFN0cmVhbSkucG9pbnQ7XG4gICAgICBoYXdhaWlQb2ludCA9IGhhd2FpaS50cmFuc2xhdGUoWyB4IC0gLjIwNSAqIGssIHkgKyAuMjEyICogayBdKS5jbGlwRXh0ZW50KFsgWyB4IC0gLjIxNCAqIGsgKyDOtSwgeSArIC4xNjYgKiBrICsgzrUgXSwgWyB4IC0gLjExNSAqIGsgLSDOtSwgeSArIC4yMzQgKiBrIC0gzrUgXSBdKS5zdHJlYW0ocG9pbnRTdHJlYW0pLnBvaW50O1xuICAgICAgcmV0dXJuIGFsYmVyc1VzYTtcbiAgICB9O1xuICAgIHJldHVybiBhbGJlcnNVc2Euc2NhbGUoMTA3MCk7XG4gIH07XG4gIHZhciBkM19nZW9fcGF0aEFyZWFTdW0sIGQzX2dlb19wYXRoQXJlYVBvbHlnb24sIGQzX2dlb19wYXRoQXJlYSA9IHtcbiAgICBwb2ludDogZDNfbm9vcCxcbiAgICBsaW5lU3RhcnQ6IGQzX25vb3AsXG4gICAgbGluZUVuZDogZDNfbm9vcCxcbiAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZDNfZ2VvX3BhdGhBcmVhUG9seWdvbiA9IDA7XG4gICAgICBkM19nZW9fcGF0aEFyZWEubGluZVN0YXJ0ID0gZDNfZ2VvX3BhdGhBcmVhUmluZ1N0YXJ0O1xuICAgIH0sXG4gICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBkM19nZW9fcGF0aEFyZWEubGluZVN0YXJ0ID0gZDNfZ2VvX3BhdGhBcmVhLmxpbmVFbmQgPSBkM19nZW9fcGF0aEFyZWEucG9pbnQgPSBkM19ub29wO1xuICAgICAgZDNfZ2VvX3BhdGhBcmVhU3VtICs9IGFicyhkM19nZW9fcGF0aEFyZWFQb2x5Z29uIC8gMik7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fcGF0aEFyZWFSaW5nU3RhcnQoKSB7XG4gICAgdmFyIHgwMCwgeTAwLCB4MCwgeTA7XG4gICAgZDNfZ2VvX3BhdGhBcmVhLnBvaW50ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgZDNfZ2VvX3BhdGhBcmVhLnBvaW50ID0gbmV4dFBvaW50O1xuICAgICAgeDAwID0geDAgPSB4LCB5MDAgPSB5MCA9IHk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBuZXh0UG9pbnQoeCwgeSkge1xuICAgICAgZDNfZ2VvX3BhdGhBcmVhUG9seWdvbiArPSB5MCAqIHggLSB4MCAqIHk7XG4gICAgICB4MCA9IHgsIHkwID0geTtcbiAgICB9XG4gICAgZDNfZ2VvX3BhdGhBcmVhLmxpbmVFbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG5leHRQb2ludCh4MDAsIHkwMCk7XG4gICAgfTtcbiAgfVxuICB2YXIgZDNfZ2VvX3BhdGhCb3VuZHNYMCwgZDNfZ2VvX3BhdGhCb3VuZHNZMCwgZDNfZ2VvX3BhdGhCb3VuZHNYMSwgZDNfZ2VvX3BhdGhCb3VuZHNZMTtcbiAgdmFyIGQzX2dlb19wYXRoQm91bmRzID0ge1xuICAgIHBvaW50OiBkM19nZW9fcGF0aEJvdW5kc1BvaW50LFxuICAgIGxpbmVTdGFydDogZDNfbm9vcCxcbiAgICBsaW5lRW5kOiBkM19ub29wLFxuICAgIHBvbHlnb25TdGFydDogZDNfbm9vcCxcbiAgICBwb2x5Z29uRW5kOiBkM19ub29wXG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb19wYXRoQm91bmRzUG9pbnQoeCwgeSkge1xuICAgIGlmICh4IDwgZDNfZ2VvX3BhdGhCb3VuZHNYMCkgZDNfZ2VvX3BhdGhCb3VuZHNYMCA9IHg7XG4gICAgaWYgKHggPiBkM19nZW9fcGF0aEJvdW5kc1gxKSBkM19nZW9fcGF0aEJvdW5kc1gxID0geDtcbiAgICBpZiAoeSA8IGQzX2dlb19wYXRoQm91bmRzWTApIGQzX2dlb19wYXRoQm91bmRzWTAgPSB5O1xuICAgIGlmICh5ID4gZDNfZ2VvX3BhdGhCb3VuZHNZMSkgZDNfZ2VvX3BhdGhCb3VuZHNZMSA9IHk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX3BhdGhCdWZmZXIoKSB7XG4gICAgdmFyIHBvaW50Q2lyY2xlID0gZDNfZ2VvX3BhdGhCdWZmZXJDaXJjbGUoNC41KSwgYnVmZmVyID0gW107XG4gICAgdmFyIHN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5wb2ludCA9IHBvaW50TGluZVN0YXJ0O1xuICAgICAgfSxcbiAgICAgIGxpbmVFbmQ6IGxpbmVFbmQsXG4gICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdHJlYW0ubGluZUVuZCA9IGxpbmVFbmRQb2x5Z29uO1xuICAgICAgfSxcbiAgICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdHJlYW0ubGluZUVuZCA9IGxpbmVFbmQ7XG4gICAgICAgIHN0cmVhbS5wb2ludCA9IHBvaW50O1xuICAgICAgfSxcbiAgICAgIHBvaW50UmFkaXVzOiBmdW5jdGlvbihfKSB7XG4gICAgICAgIHBvaW50Q2lyY2xlID0gZDNfZ2VvX3BhdGhCdWZmZXJDaXJjbGUoXyk7XG4gICAgICAgIHJldHVybiBzdHJlYW07XG4gICAgICB9LFxuICAgICAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gYnVmZmVyLmpvaW4oXCJcIik7XG4gICAgICAgICAgYnVmZmVyID0gW107XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgYnVmZmVyLnB1c2goXCJNXCIsIHgsIFwiLFwiLCB5LCBwb2ludENpcmNsZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvaW50TGluZVN0YXJ0KHgsIHkpIHtcbiAgICAgIGJ1ZmZlci5wdXNoKFwiTVwiLCB4LCBcIixcIiwgeSk7XG4gICAgICBzdHJlYW0ucG9pbnQgPSBwb2ludExpbmU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvaW50TGluZSh4LCB5KSB7XG4gICAgICBidWZmZXIucHVzaChcIkxcIiwgeCwgXCIsXCIsIHkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgc3RyZWFtLnBvaW50ID0gcG9pbnQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpbmVFbmRQb2x5Z29uKCkge1xuICAgICAgYnVmZmVyLnB1c2goXCJaXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyZWFtO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19wYXRoQnVmZmVyQ2lyY2xlKHJhZGl1cykge1xuICAgIHJldHVybiBcIm0wLFwiICsgcmFkaXVzICsgXCJhXCIgKyByYWRpdXMgKyBcIixcIiArIHJhZGl1cyArIFwiIDAgMSwxIDAsXCIgKyAtMiAqIHJhZGl1cyArIFwiYVwiICsgcmFkaXVzICsgXCIsXCIgKyByYWRpdXMgKyBcIiAwIDEsMSAwLFwiICsgMiAqIHJhZGl1cyArIFwielwiO1xuICB9XG4gIHZhciBkM19nZW9fcGF0aENlbnRyb2lkID0ge1xuICAgIHBvaW50OiBkM19nZW9fcGF0aENlbnRyb2lkUG9pbnQsXG4gICAgbGluZVN0YXJ0OiBkM19nZW9fcGF0aENlbnRyb2lkTGluZVN0YXJ0LFxuICAgIGxpbmVFbmQ6IGQzX2dlb19wYXRoQ2VudHJvaWRMaW5lRW5kLFxuICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBkM19nZW9fcGF0aENlbnRyb2lkLmxpbmVTdGFydCA9IGQzX2dlb19wYXRoQ2VudHJvaWRSaW5nU3RhcnQ7XG4gICAgfSxcbiAgICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGQzX2dlb19wYXRoQ2VudHJvaWQucG9pbnQgPSBkM19nZW9fcGF0aENlbnRyb2lkUG9pbnQ7XG4gICAgICBkM19nZW9fcGF0aENlbnRyb2lkLmxpbmVTdGFydCA9IGQzX2dlb19wYXRoQ2VudHJvaWRMaW5lU3RhcnQ7XG4gICAgICBkM19nZW9fcGF0aENlbnRyb2lkLmxpbmVFbmQgPSBkM19nZW9fcGF0aENlbnRyb2lkTGluZUVuZDtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb19wYXRoQ2VudHJvaWRQb2ludCh4LCB5KSB7XG4gICAgZDNfZ2VvX2NlbnRyb2lkWDAgKz0geDtcbiAgICBkM19nZW9fY2VudHJvaWRZMCArPSB5O1xuICAgICsrZDNfZ2VvX2NlbnRyb2lkWjA7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX3BhdGhDZW50cm9pZExpbmVTdGFydCgpIHtcbiAgICB2YXIgeDAsIHkwO1xuICAgIGQzX2dlb19wYXRoQ2VudHJvaWQucG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICBkM19nZW9fcGF0aENlbnRyb2lkLnBvaW50ID0gbmV4dFBvaW50O1xuICAgICAgZDNfZ2VvX3BhdGhDZW50cm9pZFBvaW50KHgwID0geCwgeTAgPSB5KTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIG5leHRQb2ludCh4LCB5KSB7XG4gICAgICB2YXIgZHggPSB4IC0geDAsIGR5ID0geSAtIHkwLCB6ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgIGQzX2dlb19jZW50cm9pZFgxICs9IHogKiAoeDAgKyB4KSAvIDI7XG4gICAgICBkM19nZW9fY2VudHJvaWRZMSArPSB6ICogKHkwICsgeSkgLyAyO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWjEgKz0gejtcbiAgICAgIGQzX2dlb19wYXRoQ2VudHJvaWRQb2ludCh4MCA9IHgsIHkwID0geSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19wYXRoQ2VudHJvaWRMaW5lRW5kKCkge1xuICAgIGQzX2dlb19wYXRoQ2VudHJvaWQucG9pbnQgPSBkM19nZW9fcGF0aENlbnRyb2lkUG9pbnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX3BhdGhDZW50cm9pZFJpbmdTdGFydCgpIHtcbiAgICB2YXIgeDAwLCB5MDAsIHgwLCB5MDtcbiAgICBkM19nZW9fcGF0aENlbnRyb2lkLnBvaW50ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgZDNfZ2VvX3BhdGhDZW50cm9pZC5wb2ludCA9IG5leHRQb2ludDtcbiAgICAgIGQzX2dlb19wYXRoQ2VudHJvaWRQb2ludCh4MDAgPSB4MCA9IHgsIHkwMCA9IHkwID0geSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBuZXh0UG9pbnQoeCwgeSkge1xuICAgICAgdmFyIGR4ID0geCAtIHgwLCBkeSA9IHkgLSB5MCwgeiA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICBkM19nZW9fY2VudHJvaWRYMSArPSB6ICogKHgwICsgeCkgLyAyO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWTEgKz0geiAqICh5MCArIHkpIC8gMjtcbiAgICAgIGQzX2dlb19jZW50cm9pZFoxICs9IHo7XG4gICAgICB6ID0geTAgKiB4IC0geDAgKiB5O1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWDIgKz0geiAqICh4MCArIHgpO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWTIgKz0geiAqICh5MCArIHkpO1xuICAgICAgZDNfZ2VvX2NlbnRyb2lkWjIgKz0geiAqIDM7XG4gICAgICBkM19nZW9fcGF0aENlbnRyb2lkUG9pbnQoeDAgPSB4LCB5MCA9IHkpO1xuICAgIH1cbiAgICBkM19nZW9fcGF0aENlbnRyb2lkLmxpbmVFbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG5leHRQb2ludCh4MDAsIHkwMCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fcGF0aENvbnRleHQoY29udGV4dCkge1xuICAgIHZhciBwb2ludFJhZGl1cyA9IDQuNTtcbiAgICB2YXIgc3RyZWFtID0ge1xuICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLnBvaW50ID0gcG9pbnRMaW5lU3RhcnQ7XG4gICAgICB9LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5saW5lRW5kID0gbGluZUVuZFBvbHlnb247XG4gICAgICB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5saW5lRW5kID0gbGluZUVuZDtcbiAgICAgICAgc3RyZWFtLnBvaW50ID0gcG9pbnQ7XG4gICAgICB9LFxuICAgICAgcG9pbnRSYWRpdXM6IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgcG9pbnRSYWRpdXMgPSBfO1xuICAgICAgICByZXR1cm4gc3RyZWFtO1xuICAgICAgfSxcbiAgICAgIHJlc3VsdDogZDNfbm9vcFxuICAgIH07XG4gICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCArIHBvaW50UmFkaXVzLCB5KTtcbiAgICAgIGNvbnRleHQuYXJjKHgsIHksIHBvaW50UmFkaXVzLCAwLCDPhCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvaW50TGluZVN0YXJ0KHgsIHkpIHtcbiAgICAgIGNvbnRleHQubW92ZVRvKHgsIHkpO1xuICAgICAgc3RyZWFtLnBvaW50ID0gcG9pbnRMaW5lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwb2ludExpbmUoeCwgeSkge1xuICAgICAgY29udGV4dC5saW5lVG8oeCwgeSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpbmVFbmQoKSB7XG4gICAgICBzdHJlYW0ucG9pbnQgPSBwb2ludDtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGluZUVuZFBvbHlnb24oKSB7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyZWFtO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19yZXNhbXBsZShwcm9qZWN0KSB7XG4gICAgdmFyIM60MiA9IC41LCBjb3NNaW5EaXN0YW5jZSA9IE1hdGguY29zKDMwICogZDNfcmFkaWFucyksIG1heERlcHRoID0gMTY7XG4gICAgZnVuY3Rpb24gcmVzYW1wbGUoc3RyZWFtKSB7XG4gICAgICByZXR1cm4gKG1heERlcHRoID8gcmVzYW1wbGVSZWN1cnNpdmUgOiByZXNhbXBsZU5vbmUpKHN0cmVhbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc2FtcGxlTm9uZShzdHJlYW0pIHtcbiAgICAgIHJldHVybiBkM19nZW9fdHJhbnNmb3JtUG9pbnQoc3RyZWFtLCBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHggPSBwcm9qZWN0KHgsIHkpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoeFswXSwgeFsxXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzYW1wbGVSZWN1cnNpdmUoc3RyZWFtKSB7XG4gICAgICB2YXIgzrswMCwgz4YwMCwgeDAwLCB5MDAsIGEwMCwgYjAwLCBjMDAsIM67MCwgeDAsIHkwLCBhMCwgYjAsIGMwO1xuICAgICAgdmFyIHJlc2FtcGxlID0ge1xuICAgICAgICBwb2ludDogcG9pbnQsXG4gICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICBsaW5lRW5kOiBsaW5lRW5kLFxuICAgICAgICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0cmVhbS5wb2x5Z29uU3RhcnQoKTtcbiAgICAgICAgICByZXNhbXBsZS5saW5lU3RhcnQgPSByaW5nU3RhcnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0cmVhbS5wb2x5Z29uRW5kKCk7XG4gICAgICAgICAgcmVzYW1wbGUubGluZVN0YXJ0ID0gbGluZVN0YXJ0O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgICAgICB4ID0gcHJvamVjdCh4LCB5KTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHhbMF0sIHhbMV0pO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbGluZVN0YXJ0KCkge1xuICAgICAgICB4MCA9IE5hTjtcbiAgICAgICAgcmVzYW1wbGUucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGxpbmVQb2ludCjOuywgz4YpIHtcbiAgICAgICAgdmFyIGMgPSBkM19nZW9fY2FydGVzaWFuKFsgzrssIM+GIF0pLCBwID0gcHJvamVjdCjOuywgz4YpO1xuICAgICAgICByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIM67MCwgYTAsIGIwLCBjMCwgeDAgPSBwWzBdLCB5MCA9IHBbMV0sIM67MCA9IM67LCBhMCA9IGNbMF0sIGIwID0gY1sxXSwgYzAgPSBjWzJdLCBtYXhEZXB0aCwgc3RyZWFtKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHgwLCB5MCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBsaW5lRW5kKCkge1xuICAgICAgICByZXNhbXBsZS5wb2ludCA9IHBvaW50O1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmluZ1N0YXJ0KCkge1xuICAgICAgICBsaW5lU3RhcnQoKTtcbiAgICAgICAgcmVzYW1wbGUucG9pbnQgPSByaW5nUG9pbnQ7XG4gICAgICAgIHJlc2FtcGxlLmxpbmVFbmQgPSByaW5nRW5kO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmluZ1BvaW50KM67LCDPhikge1xuICAgICAgICBsaW5lUG9pbnQozrswMCA9IM67LCDPhjAwID0gz4YpLCB4MDAgPSB4MCwgeTAwID0geTAsIGEwMCA9IGEwLCBiMDAgPSBiMCwgYzAwID0gYzA7XG4gICAgICAgIHJlc2FtcGxlLnBvaW50ID0gbGluZVBvaW50O1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmluZ0VuZCgpIHtcbiAgICAgICAgcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCDOuzAsIGEwLCBiMCwgYzAsIHgwMCwgeTAwLCDOuzAwLCBhMDAsIGIwMCwgYzAwLCBtYXhEZXB0aCwgc3RyZWFtKTtcbiAgICAgICAgcmVzYW1wbGUubGluZUVuZCA9IGxpbmVFbmQ7XG4gICAgICAgIGxpbmVFbmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNhbXBsZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCDOuzAsIGEwLCBiMCwgYzAsIHgxLCB5MSwgzrsxLCBhMSwgYjEsIGMxLCBkZXB0aCwgc3RyZWFtKSB7XG4gICAgICB2YXIgZHggPSB4MSAtIHgwLCBkeSA9IHkxIC0geTAsIGQyID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICBpZiAoZDIgPiA0ICogzrQyICYmIGRlcHRoLS0pIHtcbiAgICAgICAgdmFyIGEgPSBhMCArIGExLCBiID0gYjAgKyBiMSwgYyA9IGMwICsgYzEsIG0gPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYiArIGMgKiBjKSwgz4YyID0gTWF0aC5hc2luKGMgLz0gbSksIM67MiA9IGFicyhhYnMoYykgLSAxKSA8IM61IHx8IGFicyjOuzAgLSDOuzEpIDwgzrUgPyAozrswICsgzrsxKSAvIDIgOiBNYXRoLmF0YW4yKGIsIGEpLCBwID0gcHJvamVjdCjOuzIsIM+GMiksIHgyID0gcFswXSwgeTIgPSBwWzFdLCBkeDIgPSB4MiAtIHgwLCBkeTIgPSB5MiAtIHkwLCBkeiA9IGR5ICogZHgyIC0gZHggKiBkeTI7XG4gICAgICAgIGlmIChkeiAqIGR6IC8gZDIgPiDOtDIgfHwgYWJzKChkeCAqIGR4MiArIGR5ICogZHkyKSAvIGQyIC0gLjUpID4gLjMgfHwgYTAgKiBhMSArIGIwICogYjEgKyBjMCAqIGMxIDwgY29zTWluRGlzdGFuY2UpIHtcbiAgICAgICAgICByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIM67MCwgYTAsIGIwLCBjMCwgeDIsIHkyLCDOuzIsIGEgLz0gbSwgYiAvPSBtLCBjLCBkZXB0aCwgc3RyZWFtKTtcbiAgICAgICAgICBzdHJlYW0ucG9pbnQoeDIsIHkyKTtcbiAgICAgICAgICByZXNhbXBsZUxpbmVUbyh4MiwgeTIsIM67MiwgYSwgYiwgYywgeDEsIHkxLCDOuzEsIGExLCBiMSwgYzEsIGRlcHRoLCBzdHJlYW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlc2FtcGxlLnByZWNpc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIE1hdGguc3FydCjOtDIpO1xuICAgICAgbWF4RGVwdGggPSAozrQyID0gXyAqIF8pID4gMCAmJiAxNjtcbiAgICAgIHJldHVybiByZXNhbXBsZTtcbiAgICB9O1xuICAgIHJldHVybiByZXNhbXBsZTtcbiAgfVxuICBkMy5nZW8ucGF0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb2ludFJhZGl1cyA9IDQuNSwgcHJvamVjdGlvbiwgY29udGV4dCwgcHJvamVjdFN0cmVhbSwgY29udGV4dFN0cmVhbSwgY2FjaGVTdHJlYW07XG4gICAgZnVuY3Rpb24gcGF0aChvYmplY3QpIHtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwb2ludFJhZGl1cyA9PT0gXCJmdW5jdGlvblwiKSBjb250ZXh0U3RyZWFtLnBvaW50UmFkaXVzKCtwb2ludFJhZGl1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKCFjYWNoZVN0cmVhbSB8fCAhY2FjaGVTdHJlYW0udmFsaWQpIGNhY2hlU3RyZWFtID0gcHJvamVjdFN0cmVhbShjb250ZXh0U3RyZWFtKTtcbiAgICAgICAgZDMuZ2VvLnN0cmVhbShvYmplY3QsIGNhY2hlU3RyZWFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZXh0U3RyZWFtLnJlc3VsdCgpO1xuICAgIH1cbiAgICBwYXRoLmFyZWEgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGQzX2dlb19wYXRoQXJlYVN1bSA9IDA7XG4gICAgICBkMy5nZW8uc3RyZWFtKG9iamVjdCwgcHJvamVjdFN0cmVhbShkM19nZW9fcGF0aEFyZWEpKTtcbiAgICAgIHJldHVybiBkM19nZW9fcGF0aEFyZWFTdW07XG4gICAgfTtcbiAgICBwYXRoLmNlbnRyb2lkID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICBkM19nZW9fY2VudHJvaWRYMCA9IGQzX2dlb19jZW50cm9pZFkwID0gZDNfZ2VvX2NlbnRyb2lkWjAgPSBkM19nZW9fY2VudHJvaWRYMSA9IGQzX2dlb19jZW50cm9pZFkxID0gZDNfZ2VvX2NlbnRyb2lkWjEgPSBkM19nZW9fY2VudHJvaWRYMiA9IGQzX2dlb19jZW50cm9pZFkyID0gZDNfZ2VvX2NlbnRyb2lkWjIgPSAwO1xuICAgICAgZDMuZ2VvLnN0cmVhbShvYmplY3QsIHByb2plY3RTdHJlYW0oZDNfZ2VvX3BhdGhDZW50cm9pZCkpO1xuICAgICAgcmV0dXJuIGQzX2dlb19jZW50cm9pZFoyID8gWyBkM19nZW9fY2VudHJvaWRYMiAvIGQzX2dlb19jZW50cm9pZFoyLCBkM19nZW9fY2VudHJvaWRZMiAvIGQzX2dlb19jZW50cm9pZFoyIF0gOiBkM19nZW9fY2VudHJvaWRaMSA/IFsgZDNfZ2VvX2NlbnRyb2lkWDEgLyBkM19nZW9fY2VudHJvaWRaMSwgZDNfZ2VvX2NlbnRyb2lkWTEgLyBkM19nZW9fY2VudHJvaWRaMSBdIDogZDNfZ2VvX2NlbnRyb2lkWjAgPyBbIGQzX2dlb19jZW50cm9pZFgwIC8gZDNfZ2VvX2NlbnRyb2lkWjAsIGQzX2dlb19jZW50cm9pZFkwIC8gZDNfZ2VvX2NlbnRyb2lkWjAgXSA6IFsgTmFOLCBOYU4gXTtcbiAgICB9O1xuICAgIHBhdGguYm91bmRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICBkM19nZW9fcGF0aEJvdW5kc1gxID0gZDNfZ2VvX3BhdGhCb3VuZHNZMSA9IC0oZDNfZ2VvX3BhdGhCb3VuZHNYMCA9IGQzX2dlb19wYXRoQm91bmRzWTAgPSBJbmZpbml0eSk7XG4gICAgICBkMy5nZW8uc3RyZWFtKG9iamVjdCwgcHJvamVjdFN0cmVhbShkM19nZW9fcGF0aEJvdW5kcykpO1xuICAgICAgcmV0dXJuIFsgWyBkM19nZW9fcGF0aEJvdW5kc1gwLCBkM19nZW9fcGF0aEJvdW5kc1kwIF0sIFsgZDNfZ2VvX3BhdGhCb3VuZHNYMSwgZDNfZ2VvX3BhdGhCb3VuZHNZMSBdIF07XG4gICAgfTtcbiAgICBwYXRoLnByb2plY3Rpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBwcm9qZWN0aW9uO1xuICAgICAgcHJvamVjdFN0cmVhbSA9IChwcm9qZWN0aW9uID0gXykgPyBfLnN0cmVhbSB8fCBkM19nZW9fcGF0aFByb2plY3RTdHJlYW0oXykgOiBkM19pZGVudGl0eTtcbiAgICAgIHJldHVybiByZXNldCgpO1xuICAgIH07XG4gICAgcGF0aC5jb250ZXh0ID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29udGV4dDtcbiAgICAgIGNvbnRleHRTdHJlYW0gPSAoY29udGV4dCA9IF8pID09IG51bGwgPyBuZXcgZDNfZ2VvX3BhdGhCdWZmZXIoKSA6IG5ldyBkM19nZW9fcGF0aENvbnRleHQoXyk7XG4gICAgICBpZiAodHlwZW9mIHBvaW50UmFkaXVzICE9PSBcImZ1bmN0aW9uXCIpIGNvbnRleHRTdHJlYW0ucG9pbnRSYWRpdXMocG9pbnRSYWRpdXMpO1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfTtcbiAgICBwYXRoLnBvaW50UmFkaXVzID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcG9pbnRSYWRpdXM7XG4gICAgICBwb2ludFJhZGl1cyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogKGNvbnRleHRTdHJlYW0ucG9pbnRSYWRpdXMoK18pLCArXyk7XG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgY2FjaGVTdHJlYW0gPSBudWxsO1xuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoLnByb2plY3Rpb24oZDMuZ2VvLmFsYmVyc1VzYSgpKS5jb250ZXh0KG51bGwpO1xuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fcGF0aFByb2plY3RTdHJlYW0ocHJvamVjdCkge1xuICAgIHZhciByZXNhbXBsZSA9IGQzX2dlb19yZXNhbXBsZShmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4gcHJvamVjdChbIHggKiBkM19kZWdyZWVzLCB5ICogZDNfZGVncmVlcyBdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICByZXR1cm4gZDNfZ2VvX3Byb2plY3Rpb25SYWRpYW5zKHJlc2FtcGxlKHN0cmVhbSkpO1xuICAgIH07XG4gIH1cbiAgZDMuZ2VvLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RyZWFtOiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IG5ldyBkM19nZW9fdHJhbnNmb3JtKHN0cmVhbSk7XG4gICAgICAgIGZvciAodmFyIGsgaW4gbWV0aG9kcykgdHJhbnNmb3JtW2tdID0gbWV0aG9kc1trXTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fdHJhbnNmb3JtKHN0cmVhbSkge1xuICAgIHRoaXMuc3RyZWFtID0gc3RyZWFtO1xuICB9XG4gIGQzX2dlb190cmFuc2Zvcm0ucHJvdG90eXBlID0ge1xuICAgIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICB0aGlzLnN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICB9LFxuICAgIHNwaGVyZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0cmVhbS5zcGhlcmUoKTtcbiAgICB9LFxuICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICB9LFxuICAgIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdHJlYW0ubGluZUVuZCgpO1xuICAgIH0sXG4gICAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICAgIH0sXG4gICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0cmVhbS5wb2x5Z29uRW5kKCk7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fdHJhbnNmb3JtUG9pbnQoc3RyZWFtLCBwb2ludCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb2ludDogcG9pbnQsXG4gICAgICBzcGhlcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdHJlYW0uc3BoZXJlKCk7XG4gICAgICB9LFxuICAgICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgfSxcbiAgICAgIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgfSxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5wb2x5Z29uU3RhcnQoKTtcbiAgICAgIH0sXG4gICAgICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLnBvbHlnb25FbmQoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGQzLmdlby5wcm9qZWN0aW9uID0gZDNfZ2VvX3Byb2plY3Rpb247XG4gIGQzLmdlby5wcm9qZWN0aW9uTXV0YXRvciA9IGQzX2dlb19wcm9qZWN0aW9uTXV0YXRvcjtcbiAgZnVuY3Rpb24gZDNfZ2VvX3Byb2plY3Rpb24ocHJvamVjdCkge1xuICAgIHJldHVybiBkM19nZW9fcHJvamVjdGlvbk11dGF0b3IoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9KSgpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19wcm9qZWN0aW9uTXV0YXRvcihwcm9qZWN0QXQpIHtcbiAgICB2YXIgcHJvamVjdCwgcm90YXRlLCBwcm9qZWN0Um90YXRlLCBwcm9qZWN0UmVzYW1wbGUgPSBkM19nZW9fcmVzYW1wbGUoZnVuY3Rpb24oeCwgeSkge1xuICAgICAgeCA9IHByb2plY3QoeCwgeSk7XG4gICAgICByZXR1cm4gWyB4WzBdICogayArIM60eCwgzrR5IC0geFsxXSAqIGsgXTtcbiAgICB9KSwgayA9IDE1MCwgeCA9IDQ4MCwgeSA9IDI1MCwgzrsgPSAwLCDPhiA9IDAsIM60zrsgPSAwLCDOtM+GID0gMCwgzrTOsyA9IDAsIM60eCwgzrR5LCBwcmVjbGlwID0gZDNfZ2VvX2NsaXBBbnRpbWVyaWRpYW4sIHBvc3RjbGlwID0gZDNfaWRlbnRpdHksIGNsaXBBbmdsZSA9IG51bGwsIGNsaXBFeHRlbnQgPSBudWxsLCBzdHJlYW07XG4gICAgZnVuY3Rpb24gcHJvamVjdGlvbihwb2ludCkge1xuICAgICAgcG9pbnQgPSBwcm9qZWN0Um90YXRlKHBvaW50WzBdICogZDNfcmFkaWFucywgcG9pbnRbMV0gKiBkM19yYWRpYW5zKTtcbiAgICAgIHJldHVybiBbIHBvaW50WzBdICogayArIM60eCwgzrR5IC0gcG9pbnRbMV0gKiBrIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludmVydChwb2ludCkge1xuICAgICAgcG9pbnQgPSBwcm9qZWN0Um90YXRlLmludmVydCgocG9pbnRbMF0gLSDOtHgpIC8gaywgKM60eSAtIHBvaW50WzFdKSAvIGspO1xuICAgICAgcmV0dXJuIHBvaW50ICYmIFsgcG9pbnRbMF0gKiBkM19kZWdyZWVzLCBwb2ludFsxXSAqIGQzX2RlZ3JlZXMgXTtcbiAgICB9XG4gICAgcHJvamVjdGlvbi5zdHJlYW0gPSBmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgIGlmIChzdHJlYW0pIHN0cmVhbS52YWxpZCA9IGZhbHNlO1xuICAgICAgc3RyZWFtID0gZDNfZ2VvX3Byb2plY3Rpb25SYWRpYW5zKHByZWNsaXAocm90YXRlLCBwcm9qZWN0UmVzYW1wbGUocG9zdGNsaXAob3V0cHV0KSkpKTtcbiAgICAgIHN0cmVhbS52YWxpZCA9IHRydWU7XG4gICAgICByZXR1cm4gc3RyZWFtO1xuICAgIH07XG4gICAgcHJvamVjdGlvbi5jbGlwQW5nbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGlwQW5nbGU7XG4gICAgICBwcmVjbGlwID0gXyA9PSBudWxsID8gKGNsaXBBbmdsZSA9IF8sIGQzX2dlb19jbGlwQW50aW1lcmlkaWFuKSA6IGQzX2dlb19jbGlwQ2lyY2xlKChjbGlwQW5nbGUgPSArXykgKiBkM19yYWRpYW5zKTtcbiAgICAgIHJldHVybiBpbnZhbGlkYXRlKCk7XG4gICAgfTtcbiAgICBwcm9qZWN0aW9uLmNsaXBFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGlwRXh0ZW50O1xuICAgICAgY2xpcEV4dGVudCA9IF87XG4gICAgICBwb3N0Y2xpcCA9IF8gPyBkM19nZW9fY2xpcEV4dGVudChfWzBdWzBdLCBfWzBdWzFdLCBfWzFdWzBdLCBfWzFdWzFdKSA6IGQzX2lkZW50aXR5O1xuICAgICAgcmV0dXJuIGludmFsaWRhdGUoKTtcbiAgICB9O1xuICAgIHByb2plY3Rpb24uc2NhbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBrO1xuICAgICAgayA9ICtfO1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfTtcbiAgICBwcm9qZWN0aW9uLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgeCwgeSBdO1xuICAgICAgeCA9ICtfWzBdO1xuICAgICAgeSA9ICtfWzFdO1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfTtcbiAgICBwcm9qZWN0aW9uLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgzrsgKiBkM19kZWdyZWVzLCDPhiAqIGQzX2RlZ3JlZXMgXTtcbiAgICAgIM67ID0gX1swXSAlIDM2MCAqIGQzX3JhZGlhbnM7XG4gICAgICDPhiA9IF9bMV0gJSAzNjAgKiBkM19yYWRpYW5zO1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfTtcbiAgICBwcm9qZWN0aW9uLnJvdGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgzrTOuyAqIGQzX2RlZ3JlZXMsIM60z4YgKiBkM19kZWdyZWVzLCDOtM6zICogZDNfZGVncmVlcyBdO1xuICAgICAgzrTOuyA9IF9bMF0gJSAzNjAgKiBkM19yYWRpYW5zO1xuICAgICAgzrTPhiA9IF9bMV0gJSAzNjAgKiBkM19yYWRpYW5zO1xuICAgICAgzrTOsyA9IF8ubGVuZ3RoID4gMiA/IF9bMl0gJSAzNjAgKiBkM19yYWRpYW5zIDogMDtcbiAgICAgIHJldHVybiByZXNldCgpO1xuICAgIH07XG4gICAgZDMucmViaW5kKHByb2plY3Rpb24sIHByb2plY3RSZXNhbXBsZSwgXCJwcmVjaXNpb25cIik7XG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICBwcm9qZWN0Um90YXRlID0gZDNfZ2VvX2NvbXBvc2Uocm90YXRlID0gZDNfZ2VvX3JvdGF0aW9uKM60zrssIM60z4YsIM60zrMpLCBwcm9qZWN0KTtcbiAgICAgIHZhciBjZW50ZXIgPSBwcm9qZWN0KM67LCDPhik7XG4gICAgICDOtHggPSB4IC0gY2VudGVyWzBdICogaztcbiAgICAgIM60eSA9IHkgKyBjZW50ZXJbMV0gKiBrO1xuICAgICAgcmV0dXJuIGludmFsaWRhdGUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW52YWxpZGF0ZSgpIHtcbiAgICAgIGlmIChzdHJlYW0pIHN0cmVhbS52YWxpZCA9IGZhbHNlLCBzdHJlYW0gPSBudWxsO1xuICAgICAgcmV0dXJuIHByb2plY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2plY3QgPSBwcm9qZWN0QXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHByb2plY3Rpb24uaW52ZXJ0ID0gcHJvamVjdC5pbnZlcnQgJiYgaW52ZXJ0O1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fcHJvamVjdGlvblJhZGlhbnMoc3RyZWFtKSB7XG4gICAgcmV0dXJuIGQzX2dlb190cmFuc2Zvcm1Qb2ludChzdHJlYW0sIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHN0cmVhbS5wb2ludCh4ICogZDNfcmFkaWFucywgeSAqIGQzX3JhZGlhbnMpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19lcXVpcmVjdGFuZ3VsYXIozrssIM+GKSB7XG4gICAgcmV0dXJuIFsgzrssIM+GIF07XG4gIH1cbiAgKGQzLmdlby5lcXVpcmVjdGFuZ3VsYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfZ2VvX3Byb2plY3Rpb24oZDNfZ2VvX2VxdWlyZWN0YW5ndWxhcik7XG4gIH0pLnJhdyA9IGQzX2dlb19lcXVpcmVjdGFuZ3VsYXIuaW52ZXJ0ID0gZDNfZ2VvX2VxdWlyZWN0YW5ndWxhcjtcbiAgZDMuZ2VvLnJvdGF0aW9uID0gZnVuY3Rpb24ocm90YXRlKSB7XG4gICAgcm90YXRlID0gZDNfZ2VvX3JvdGF0aW9uKHJvdGF0ZVswXSAlIDM2MCAqIGQzX3JhZGlhbnMsIHJvdGF0ZVsxXSAqIGQzX3JhZGlhbnMsIHJvdGF0ZS5sZW5ndGggPiAyID8gcm90YXRlWzJdICogZDNfcmFkaWFucyA6IDApO1xuICAgIGZ1bmN0aW9uIGZvcndhcmQoY29vcmRpbmF0ZXMpIHtcbiAgICAgIGNvb3JkaW5hdGVzID0gcm90YXRlKGNvb3JkaW5hdGVzWzBdICogZDNfcmFkaWFucywgY29vcmRpbmF0ZXNbMV0gKiBkM19yYWRpYW5zKTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkM19kZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkM19kZWdyZWVzLCBjb29yZGluYXRlcztcbiAgICB9XG4gICAgZm9yd2FyZC5pbnZlcnQgPSBmdW5jdGlvbihjb29yZGluYXRlcykge1xuICAgICAgY29vcmRpbmF0ZXMgPSByb3RhdGUuaW52ZXJ0KGNvb3JkaW5hdGVzWzBdICogZDNfcmFkaWFucywgY29vcmRpbmF0ZXNbMV0gKiBkM19yYWRpYW5zKTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkM19kZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkM19kZWdyZWVzLCBjb29yZGluYXRlcztcbiAgICB9O1xuICAgIHJldHVybiBmb3J3YXJkO1xuICB9O1xuICBmdW5jdGlvbiBkM19nZW9faWRlbnRpdHlSb3RhdGlvbijOuywgz4YpIHtcbiAgICByZXR1cm4gWyDOuyA+IM+AID8gzrsgLSDPhCA6IM67IDwgLc+AID8gzrsgKyDPhCA6IM67LCDPhiBdO1xuICB9XG4gIGQzX2dlb19pZGVudGl0eVJvdGF0aW9uLmludmVydCA9IGQzX2dlb19lcXVpcmVjdGFuZ3VsYXI7XG4gIGZ1bmN0aW9uIGQzX2dlb19yb3RhdGlvbijOtM67LCDOtM+GLCDOtM6zKSB7XG4gICAgcmV0dXJuIM60zrsgPyDOtM+GIHx8IM60zrMgPyBkM19nZW9fY29tcG9zZShkM19nZW9fcm90YXRpb27OuyjOtM67KSwgZDNfZ2VvX3JvdGF0aW9uz4bOsyjOtM+GLCDOtM6zKSkgOiBkM19nZW9fcm90YXRpb27OuyjOtM67KSA6IM60z4YgfHwgzrTOsyA/IGQzX2dlb19yb3RhdGlvbs+GzrMozrTPhiwgzrTOsykgOiBkM19nZW9faWRlbnRpdHlSb3RhdGlvbjtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fZm9yd2FyZFJvdGF0aW9uzrsozrTOuykge1xuICAgIHJldHVybiBmdW5jdGlvbijOuywgz4YpIHtcbiAgICAgIHJldHVybiDOuyArPSDOtM67LCBbIM67ID4gz4AgPyDOuyAtIM+EIDogzrsgPCAtz4AgPyDOuyArIM+EIDogzrssIM+GIF07XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fcm90YXRpb27OuyjOtM67KSB7XG4gICAgdmFyIHJvdGF0aW9uID0gZDNfZ2VvX2ZvcndhcmRSb3RhdGlvbs67KM60zrspO1xuICAgIHJvdGF0aW9uLmludmVydCA9IGQzX2dlb19mb3J3YXJkUm90YXRpb27OuygtzrTOuyk7XG4gICAgcmV0dXJuIHJvdGF0aW9uO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb19yb3RhdGlvbs+GzrMozrTPhiwgzrTOsykge1xuICAgIHZhciBjb3POtM+GID0gTWF0aC5jb3MozrTPhiksIHNpbs60z4YgPSBNYXRoLnNpbijOtM+GKSwgY29zzrTOsyA9IE1hdGguY29zKM60zrMpLCBzaW7OtM6zID0gTWF0aC5zaW4ozrTOsyk7XG4gICAgZnVuY3Rpb24gcm90YXRpb24ozrssIM+GKSB7XG4gICAgICB2YXIgY29zz4YgPSBNYXRoLmNvcyjPhiksIHggPSBNYXRoLmNvcyjOuykgKiBjb3PPhiwgeSA9IE1hdGguc2luKM67KSAqIGNvc8+GLCB6ID0gTWF0aC5zaW4oz4YpLCBrID0geiAqIGNvc860z4YgKyB4ICogc2luzrTPhjtcbiAgICAgIHJldHVybiBbIE1hdGguYXRhbjIoeSAqIGNvc860zrMgLSBrICogc2luzrTOsywgeCAqIGNvc860z4YgLSB6ICogc2luzrTPhiksIGQzX2FzaW4oayAqIGNvc860zrMgKyB5ICogc2luzrTOsykgXTtcbiAgICB9XG4gICAgcm90YXRpb24uaW52ZXJ0ID0gZnVuY3Rpb24ozrssIM+GKSB7XG4gICAgICB2YXIgY29zz4YgPSBNYXRoLmNvcyjPhiksIHggPSBNYXRoLmNvcyjOuykgKiBjb3PPhiwgeSA9IE1hdGguc2luKM67KSAqIGNvc8+GLCB6ID0gTWF0aC5zaW4oz4YpLCBrID0geiAqIGNvc860zrMgLSB5ICogc2luzrTOsztcbiAgICAgIHJldHVybiBbIE1hdGguYXRhbjIoeSAqIGNvc860zrMgKyB6ICogc2luzrTOsywgeCAqIGNvc860z4YgKyBrICogc2luzrTPhiksIGQzX2FzaW4oayAqIGNvc860z4YgLSB4ICogc2luzrTPhikgXTtcbiAgICB9O1xuICAgIHJldHVybiByb3RhdGlvbjtcbiAgfVxuICBkMy5nZW8uY2lyY2xlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9yaWdpbiA9IFsgMCwgMCBdLCBhbmdsZSwgcHJlY2lzaW9uID0gNiwgaW50ZXJwb2xhdGU7XG4gICAgZnVuY3Rpb24gY2lyY2xlKCkge1xuICAgICAgdmFyIGNlbnRlciA9IHR5cGVvZiBvcmlnaW4gPT09IFwiZnVuY3Rpb25cIiA/IG9yaWdpbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb3JpZ2luLCByb3RhdGUgPSBkM19nZW9fcm90YXRpb24oLWNlbnRlclswXSAqIGQzX3JhZGlhbnMsIC1jZW50ZXJbMV0gKiBkM19yYWRpYW5zLCAwKS5pbnZlcnQsIHJpbmcgPSBbXTtcbiAgICAgIGludGVycG9sYXRlKG51bGwsIG51bGwsIDEsIHtcbiAgICAgICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgICByaW5nLnB1c2goeCA9IHJvdGF0ZSh4LCB5KSk7XG4gICAgICAgICAgeFswXSAqPSBkM19kZWdyZWVzLCB4WzFdICo9IGQzX2RlZ3JlZXM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbIHJpbmcgXVxuICAgICAgfTtcbiAgICB9XG4gICAgY2lyY2xlLm9yaWdpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWdpbjtcbiAgICAgIG9yaWdpbiA9IHg7XG4gICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH07XG4gICAgY2lyY2xlLmFuZ2xlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYW5nbGU7XG4gICAgICBpbnRlcnBvbGF0ZSA9IGQzX2dlb19jaXJjbGVJbnRlcnBvbGF0ZSgoYW5nbGUgPSAreCkgKiBkM19yYWRpYW5zLCBwcmVjaXNpb24gKiBkM19yYWRpYW5zKTtcbiAgICAgIHJldHVybiBjaXJjbGU7XG4gICAgfTtcbiAgICBjaXJjbGUucHJlY2lzaW9uID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcHJlY2lzaW9uO1xuICAgICAgaW50ZXJwb2xhdGUgPSBkM19nZW9fY2lyY2xlSW50ZXJwb2xhdGUoYW5nbGUgKiBkM19yYWRpYW5zLCAocHJlY2lzaW9uID0gK18pICogZDNfcmFkaWFucyk7XG4gICAgICByZXR1cm4gY2lyY2xlO1xuICAgIH07XG4gICAgcmV0dXJuIGNpcmNsZS5hbmdsZSg5MCk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb19jaXJjbGVJbnRlcnBvbGF0ZShyYWRpdXMsIHByZWNpc2lvbikge1xuICAgIHZhciBjciA9IE1hdGguY29zKHJhZGl1cyksIHNyID0gTWF0aC5zaW4ocmFkaXVzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oZnJvbSwgdG8sIGRpcmVjdGlvbiwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBzdGVwID0gZGlyZWN0aW9uICogcHJlY2lzaW9uO1xuICAgICAgaWYgKGZyb20gIT0gbnVsbCkge1xuICAgICAgICBmcm9tID0gZDNfZ2VvX2NpcmNsZUFuZ2xlKGNyLCBmcm9tKTtcbiAgICAgICAgdG8gPSBkM19nZW9fY2lyY2xlQW5nbGUoY3IsIHRvKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA+IDAgPyBmcm9tIDwgdG8gOiBmcm9tID4gdG8pIGZyb20gKz0gZGlyZWN0aW9uICogz4Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcm9tID0gcmFkaXVzICsgZGlyZWN0aW9uICogz4Q7XG4gICAgICAgIHRvID0gcmFkaXVzIC0gLjUgKiBzdGVwO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgcG9pbnQsIHQgPSBmcm9tOyBkaXJlY3Rpb24gPiAwID8gdCA+IHRvIDogdCA8IHRvOyB0IC09IHN0ZXApIHtcbiAgICAgICAgbGlzdGVuZXIucG9pbnQoKHBvaW50ID0gZDNfZ2VvX3NwaGVyaWNhbChbIGNyLCAtc3IgKiBNYXRoLmNvcyh0KSwgLXNyICogTWF0aC5zaW4odCkgXSkpWzBdLCBwb2ludFsxXSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9fY2lyY2xlQW5nbGUoY3IsIHBvaW50KSB7XG4gICAgdmFyIGEgPSBkM19nZW9fY2FydGVzaWFuKHBvaW50KTtcbiAgICBhWzBdIC09IGNyO1xuICAgIGQzX2dlb19jYXJ0ZXNpYW5Ob3JtYWxpemUoYSk7XG4gICAgdmFyIGFuZ2xlID0gZDNfYWNvcygtYVsxXSk7XG4gICAgcmV0dXJuICgoLWFbMl0gPCAwID8gLWFuZ2xlIDogYW5nbGUpICsgMiAqIE1hdGguUEkgLSDOtSkgJSAoMiAqIE1hdGguUEkpO1xuICB9XG4gIGQzLmdlby5kaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgzpTOuyA9IChiWzBdIC0gYVswXSkgKiBkM19yYWRpYW5zLCDPhjAgPSBhWzFdICogZDNfcmFkaWFucywgz4YxID0gYlsxXSAqIGQzX3JhZGlhbnMsIHNpbs6UzrsgPSBNYXRoLnNpbijOlM67KSwgY29zzpTOuyA9IE1hdGguY29zKM6UzrspLCBzaW7PhjAgPSBNYXRoLnNpbijPhjApLCBjb3PPhjAgPSBNYXRoLmNvcyjPhjApLCBzaW7PhjEgPSBNYXRoLnNpbijPhjEpLCBjb3PPhjEgPSBNYXRoLmNvcyjPhjEpLCB0O1xuICAgIHJldHVybiBNYXRoLmF0YW4yKE1hdGguc3FydCgodCA9IGNvc8+GMSAqIHNpbs6UzrspICogdCArICh0ID0gY29zz4YwICogc2luz4YxIC0gc2luz4YwICogY29zz4YxICogY29zzpTOuykgKiB0KSwgc2luz4YwICogc2luz4YxICsgY29zz4YwICogY29zz4YxICogY29zzpTOuyk7XG4gIH07XG4gIGQzLmdlby5ncmF0aWN1bGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeDEsIHgwLCBYMSwgWDAsIHkxLCB5MCwgWTEsIFkwLCBkeCA9IDEwLCBkeSA9IGR4LCBEWCA9IDkwLCBEWSA9IDM2MCwgeCwgeSwgWCwgWSwgcHJlY2lzaW9uID0gMi41O1xuICAgIGZ1bmN0aW9uIGdyYXRpY3VsZSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwiTXVsdGlMaW5lU3RyaW5nXCIsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBsaW5lcygpXG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW5lcygpIHtcbiAgICAgIHJldHVybiBkMy5yYW5nZShNYXRoLmNlaWwoWDAgLyBEWCkgKiBEWCwgWDEsIERYKS5tYXAoWCkuY29uY2F0KGQzLnJhbmdlKE1hdGguY2VpbChZMCAvIERZKSAqIERZLCBZMSwgRFkpLm1hcChZKSkuY29uY2F0KGQzLnJhbmdlKE1hdGguY2VpbCh4MCAvIGR4KSAqIGR4LCB4MSwgZHgpLmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiBhYnMoeCAlIERYKSA+IM61O1xuICAgICAgfSkubWFwKHgpKS5jb25jYXQoZDMucmFuZ2UoTWF0aC5jZWlsKHkwIC8gZHkpICogZHksIHkxLCBkeSkuZmlsdGVyKGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgcmV0dXJuIGFicyh5ICUgRFkpID4gzrU7XG4gICAgICB9KS5tYXAoeSkpO1xuICAgIH1cbiAgICBncmF0aWN1bGUubGluZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBsaW5lcygpLm1hcChmdW5jdGlvbihjb29yZGluYXRlcykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBncmF0aWN1bGUub3V0bGluZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbIFgoWDApLmNvbmNhdChZKFkxKS5zbGljZSgxKSwgWChYMSkucmV2ZXJzZSgpLnNsaWNlKDEpLCBZKFkwKS5yZXZlcnNlKCkuc2xpY2UoMSkpIF1cbiAgICAgIH07XG4gICAgfTtcbiAgICBncmF0aWN1bGUuZXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZ3JhdGljdWxlLm1pbm9yRXh0ZW50KCk7XG4gICAgICByZXR1cm4gZ3JhdGljdWxlLm1ham9yRXh0ZW50KF8pLm1pbm9yRXh0ZW50KF8pO1xuICAgIH07XG4gICAgZ3JhdGljdWxlLm1ham9yRXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gWyBbIFgwLCBZMCBdLCBbIFgxLCBZMSBdIF07XG4gICAgICBYMCA9ICtfWzBdWzBdLCBYMSA9ICtfWzFdWzBdO1xuICAgICAgWTAgPSArX1swXVsxXSwgWTEgPSArX1sxXVsxXTtcbiAgICAgIGlmIChYMCA+IFgxKSBfID0gWDAsIFgwID0gWDEsIFgxID0gXztcbiAgICAgIGlmIChZMCA+IFkxKSBfID0gWTAsIFkwID0gWTEsIFkxID0gXztcbiAgICAgIHJldHVybiBncmF0aWN1bGUucHJlY2lzaW9uKHByZWNpc2lvbik7XG4gICAgfTtcbiAgICBncmF0aWN1bGUubWlub3JFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBbIFsgeDAsIHkwIF0sIFsgeDEsIHkxIF0gXTtcbiAgICAgIHgwID0gK19bMF1bMF0sIHgxID0gK19bMV1bMF07XG4gICAgICB5MCA9ICtfWzBdWzFdLCB5MSA9ICtfWzFdWzFdO1xuICAgICAgaWYgKHgwID4geDEpIF8gPSB4MCwgeDAgPSB4MSwgeDEgPSBfO1xuICAgICAgaWYgKHkwID4geTEpIF8gPSB5MCwgeTAgPSB5MSwgeTEgPSBfO1xuICAgICAgcmV0dXJuIGdyYXRpY3VsZS5wcmVjaXNpb24ocHJlY2lzaW9uKTtcbiAgICB9O1xuICAgIGdyYXRpY3VsZS5zdGVwID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZ3JhdGljdWxlLm1pbm9yU3RlcCgpO1xuICAgICAgcmV0dXJuIGdyYXRpY3VsZS5tYWpvclN0ZXAoXykubWlub3JTdGVwKF8pO1xuICAgIH07XG4gICAgZ3JhdGljdWxlLm1ham9yU3RlcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgRFgsIERZIF07XG4gICAgICBEWCA9ICtfWzBdLCBEWSA9ICtfWzFdO1xuICAgICAgcmV0dXJuIGdyYXRpY3VsZTtcbiAgICB9O1xuICAgIGdyYXRpY3VsZS5taW5vclN0ZXAgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBbIGR4LCBkeSBdO1xuICAgICAgZHggPSArX1swXSwgZHkgPSArX1sxXTtcbiAgICAgIHJldHVybiBncmF0aWN1bGU7XG4gICAgfTtcbiAgICBncmF0aWN1bGUucHJlY2lzaW9uID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcHJlY2lzaW9uO1xuICAgICAgcHJlY2lzaW9uID0gK187XG4gICAgICB4ID0gZDNfZ2VvX2dyYXRpY3VsZVgoeTAsIHkxLCA5MCk7XG4gICAgICB5ID0gZDNfZ2VvX2dyYXRpY3VsZVkoeDAsIHgxLCBwcmVjaXNpb24pO1xuICAgICAgWCA9IGQzX2dlb19ncmF0aWN1bGVYKFkwLCBZMSwgOTApO1xuICAgICAgWSA9IGQzX2dlb19ncmF0aWN1bGVZKFgwLCBYMSwgcHJlY2lzaW9uKTtcbiAgICAgIHJldHVybiBncmF0aWN1bGU7XG4gICAgfTtcbiAgICByZXR1cm4gZ3JhdGljdWxlLm1ham9yRXh0ZW50KFsgWyAtMTgwLCAtOTAgKyDOtSBdLCBbIDE4MCwgOTAgLSDOtSBdIF0pLm1pbm9yRXh0ZW50KFsgWyAtMTgwLCAtODAgLSDOtSBdLCBbIDE4MCwgODAgKyDOtSBdIF0pO1xuICB9O1xuICBmdW5jdGlvbiBkM19nZW9fZ3JhdGljdWxlWCh5MCwgeTEsIGR5KSB7XG4gICAgdmFyIHkgPSBkMy5yYW5nZSh5MCwgeTEgLSDOtSwgZHkpLmNvbmNhdCh5MSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB5Lm1hcChmdW5jdGlvbih5KSB7XG4gICAgICAgIHJldHVybiBbIHgsIHkgXTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2dyYXRpY3VsZVkoeDAsIHgxLCBkeCkge1xuICAgIHZhciB4ID0gZDMucmFuZ2UoeDAsIHgxIC0gzrUsIGR4KS5jb25jYXQoeDEpO1xuICAgIHJldHVybiBmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4geC5tYXAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4gWyB4LCB5IF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX3NvdXJjZShkKSB7XG4gICAgcmV0dXJuIGQuc291cmNlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RhcmdldChkKSB7XG4gICAgcmV0dXJuIGQudGFyZ2V0O1xuICB9XG4gIGQzLmdlby5ncmVhdEFyYyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb3VyY2UgPSBkM19zb3VyY2UsIHNvdXJjZV8sIHRhcmdldCA9IGQzX3RhcmdldCwgdGFyZ2V0XztcbiAgICBmdW5jdGlvbiBncmVhdEFyYygpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBjb29yZGluYXRlczogWyBzb3VyY2VfIHx8IHNvdXJjZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0YXJnZXRfIHx8IHRhcmdldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIF1cbiAgICAgIH07XG4gICAgfVxuICAgIGdyZWF0QXJjLmRpc3RhbmNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDMuZ2VvLmRpc3RhbmNlKHNvdXJjZV8gfHwgc291cmNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRhcmdldF8gfHwgdGFyZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gICAgZ3JlYXRBcmMuc291cmNlID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc291cmNlO1xuICAgICAgc291cmNlID0gXywgc291cmNlXyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBudWxsIDogXztcbiAgICAgIHJldHVybiBncmVhdEFyYztcbiAgICB9O1xuICAgIGdyZWF0QXJjLnRhcmdldCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRhcmdldDtcbiAgICAgIHRhcmdldCA9IF8sIHRhcmdldF8gPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gbnVsbCA6IF87XG4gICAgICByZXR1cm4gZ3JlYXRBcmM7XG4gICAgfTtcbiAgICBncmVhdEFyYy5wcmVjaXNpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gZ3JlYXRBcmMgOiAwO1xuICAgIH07XG4gICAgcmV0dXJuIGdyZWF0QXJjO1xuICB9O1xuICBkMy5nZW8uaW50ZXJwb2xhdGUgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCkge1xuICAgIHJldHVybiBkM19nZW9faW50ZXJwb2xhdGUoc291cmNlWzBdICogZDNfcmFkaWFucywgc291cmNlWzFdICogZDNfcmFkaWFucywgdGFyZ2V0WzBdICogZDNfcmFkaWFucywgdGFyZ2V0WzFdICogZDNfcmFkaWFucyk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb19pbnRlcnBvbGF0ZSh4MCwgeTAsIHgxLCB5MSkge1xuICAgIHZhciBjeTAgPSBNYXRoLmNvcyh5MCksIHN5MCA9IE1hdGguc2luKHkwKSwgY3kxID0gTWF0aC5jb3MoeTEpLCBzeTEgPSBNYXRoLnNpbih5MSksIGt4MCA9IGN5MCAqIE1hdGguY29zKHgwKSwga3kwID0gY3kwICogTWF0aC5zaW4oeDApLCBreDEgPSBjeTEgKiBNYXRoLmNvcyh4MSksIGt5MSA9IGN5MSAqIE1hdGguc2luKHgxKSwgZCA9IDIgKiBNYXRoLmFzaW4oTWF0aC5zcXJ0KGQzX2hhdmVyc2luKHkxIC0geTApICsgY3kwICogY3kxICogZDNfaGF2ZXJzaW4oeDEgLSB4MCkpKSwgayA9IDEgLyBNYXRoLnNpbihkKTtcbiAgICB2YXIgaW50ZXJwb2xhdGUgPSBkID8gZnVuY3Rpb24odCkge1xuICAgICAgdmFyIEIgPSBNYXRoLnNpbih0ICo9IGQpICogaywgQSA9IE1hdGguc2luKGQgLSB0KSAqIGssIHggPSBBICoga3gwICsgQiAqIGt4MSwgeSA9IEEgKiBreTAgKyBCICoga3kxLCB6ID0gQSAqIHN5MCArIEIgKiBzeTE7XG4gICAgICByZXR1cm4gWyBNYXRoLmF0YW4yKHksIHgpICogZDNfZGVncmVlcywgTWF0aC5hdGFuMih6LCBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSkpICogZDNfZGVncmVlcyBdO1xuICAgIH0gOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbIHgwICogZDNfZGVncmVlcywgeTAgKiBkM19kZWdyZWVzIF07XG4gICAgfTtcbiAgICBpbnRlcnBvbGF0ZS5kaXN0YW5jZSA9IGQ7XG4gICAgcmV0dXJuIGludGVycG9sYXRlO1xuICB9XG4gIGQzLmdlby5sZW5ndGggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBkM19nZW9fbGVuZ3RoU3VtID0gMDtcbiAgICBkMy5nZW8uc3RyZWFtKG9iamVjdCwgZDNfZ2VvX2xlbmd0aCk7XG4gICAgcmV0dXJuIGQzX2dlb19sZW5ndGhTdW07XG4gIH07XG4gIHZhciBkM19nZW9fbGVuZ3RoU3VtO1xuICB2YXIgZDNfZ2VvX2xlbmd0aCA9IHtcbiAgICBzcGhlcmU6IGQzX25vb3AsXG4gICAgcG9pbnQ6IGQzX25vb3AsXG4gICAgbGluZVN0YXJ0OiBkM19nZW9fbGVuZ3RoTGluZVN0YXJ0LFxuICAgIGxpbmVFbmQ6IGQzX25vb3AsXG4gICAgcG9seWdvblN0YXJ0OiBkM19ub29wLFxuICAgIHBvbHlnb25FbmQ6IGQzX25vb3BcbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvX2xlbmd0aExpbmVTdGFydCgpIHtcbiAgICB2YXIgzrswLCBzaW7PhjAsIGNvc8+GMDtcbiAgICBkM19nZW9fbGVuZ3RoLnBvaW50ID0gZnVuY3Rpb24ozrssIM+GKSB7XG4gICAgICDOuzAgPSDOuyAqIGQzX3JhZGlhbnMsIHNpbs+GMCA9IE1hdGguc2luKM+GICo9IGQzX3JhZGlhbnMpLCBjb3PPhjAgPSBNYXRoLmNvcyjPhik7XG4gICAgICBkM19nZW9fbGVuZ3RoLnBvaW50ID0gbmV4dFBvaW50O1xuICAgIH07XG4gICAgZDNfZ2VvX2xlbmd0aC5saW5lRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBkM19nZW9fbGVuZ3RoLnBvaW50ID0gZDNfZ2VvX2xlbmd0aC5saW5lRW5kID0gZDNfbm9vcDtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIG5leHRQb2ludCjOuywgz4YpIHtcbiAgICAgIHZhciBzaW7PhiA9IE1hdGguc2luKM+GICo9IGQzX3JhZGlhbnMpLCBjb3PPhiA9IE1hdGguY29zKM+GKSwgdCA9IGFicygozrsgKj0gZDNfcmFkaWFucykgLSDOuzApLCBjb3POlM67ID0gTWF0aC5jb3ModCk7XG4gICAgICBkM19nZW9fbGVuZ3RoU3VtICs9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KCh0ID0gY29zz4YgKiBNYXRoLnNpbih0KSkgKiB0ICsgKHQgPSBjb3PPhjAgKiBzaW7PhiAtIHNpbs+GMCAqIGNvc8+GICogY29zzpTOuykgKiB0KSwgc2luz4YwICogc2luz4YgKyBjb3PPhjAgKiBjb3PPhiAqIGNvc86UzrspO1xuICAgICAgzrswID0gzrssIHNpbs+GMCA9IHNpbs+GLCBjb3PPhjAgPSBjb3PPhjtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvX2F6aW11dGhhbChzY2FsZSwgYW5nbGUpIHtcbiAgICBmdW5jdGlvbiBhemltdXRoYWwozrssIM+GKSB7XG4gICAgICB2YXIgY29zzrsgPSBNYXRoLmNvcyjOuyksIGNvc8+GID0gTWF0aC5jb3Moz4YpLCBrID0gc2NhbGUoY29zzrsgKiBjb3PPhik7XG4gICAgICByZXR1cm4gWyBrICogY29zz4YgKiBNYXRoLnNpbijOuyksIGsgKiBNYXRoLnNpbijPhikgXTtcbiAgICB9XG4gICAgYXppbXV0aGFsLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHZhciDPgSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KSwgYyA9IGFuZ2xlKM+BKSwgc2luYyA9IE1hdGguc2luKGMpLCBjb3NjID0gTWF0aC5jb3MoYyk7XG4gICAgICByZXR1cm4gWyBNYXRoLmF0YW4yKHggKiBzaW5jLCDPgSAqIGNvc2MpLCBNYXRoLmFzaW4oz4EgJiYgeSAqIHNpbmMgLyDPgSkgXTtcbiAgICB9O1xuICAgIHJldHVybiBhemltdXRoYWw7XG4gIH1cbiAgdmFyIGQzX2dlb19hemltdXRoYWxFcXVhbEFyZWEgPSBkM19nZW9fYXppbXV0aGFsKGZ1bmN0aW9uKGNvc867Y29zz4YpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KDIgLyAoMSArIGNvc867Y29zz4YpKTtcbiAgfSwgZnVuY3Rpb24oz4EpIHtcbiAgICByZXR1cm4gMiAqIE1hdGguYXNpbijPgSAvIDIpO1xuICB9KTtcbiAgKGQzLmdlby5hemltdXRoYWxFcXVhbEFyZWEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfZ2VvX3Byb2plY3Rpb24oZDNfZ2VvX2F6aW11dGhhbEVxdWFsQXJlYSk7XG4gIH0pLnJhdyA9IGQzX2dlb19hemltdXRoYWxFcXVhbEFyZWE7XG4gIHZhciBkM19nZW9fYXppbXV0aGFsRXF1aWRpc3RhbnQgPSBkM19nZW9fYXppbXV0aGFsKGZ1bmN0aW9uKGNvc867Y29zz4YpIHtcbiAgICB2YXIgYyA9IE1hdGguYWNvcyhjb3POu2Nvc8+GKTtcbiAgICByZXR1cm4gYyAmJiBjIC8gTWF0aC5zaW4oYyk7XG4gIH0sIGQzX2lkZW50aXR5KTtcbiAgKGQzLmdlby5hemltdXRoYWxFcXVpZGlzdGFudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19nZW9fcHJvamVjdGlvbihkM19nZW9fYXppbXV0aGFsRXF1aWRpc3RhbnQpO1xuICB9KS5yYXcgPSBkM19nZW9fYXppbXV0aGFsRXF1aWRpc3RhbnQ7XG4gIGZ1bmN0aW9uIGQzX2dlb19jb25pY0NvbmZvcm1hbCjPhjAsIM+GMSkge1xuICAgIHZhciBjb3PPhjAgPSBNYXRoLmNvcyjPhjApLCB0ID0gZnVuY3Rpb24oz4YpIHtcbiAgICAgIHJldHVybiBNYXRoLnRhbijPgCAvIDQgKyDPhiAvIDIpO1xuICAgIH0sIG4gPSDPhjAgPT09IM+GMSA/IE1hdGguc2luKM+GMCkgOiBNYXRoLmxvZyhjb3PPhjAgLyBNYXRoLmNvcyjPhjEpKSAvIE1hdGgubG9nKHQoz4YxKSAvIHQoz4YwKSksIEYgPSBjb3PPhjAgKiBNYXRoLnBvdyh0KM+GMCksIG4pIC8gbjtcbiAgICBpZiAoIW4pIHJldHVybiBkM19nZW9fbWVyY2F0b3I7XG4gICAgZnVuY3Rpb24gZm9yd2FyZCjOuywgz4YpIHtcbiAgICAgIGlmIChGID4gMCkge1xuICAgICAgICBpZiAoz4YgPCAtaGFsZs+AICsgzrUpIM+GID0gLWhhbGbPgCArIM61O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKM+GID4gaGFsZs+AIC0gzrUpIM+GID0gaGFsZs+AIC0gzrU7XG4gICAgICB9XG4gICAgICB2YXIgz4EgPSBGIC8gTWF0aC5wb3codCjPhiksIG4pO1xuICAgICAgcmV0dXJuIFsgz4EgKiBNYXRoLnNpbihuICogzrspLCBGIC0gz4EgKiBNYXRoLmNvcyhuICogzrspIF07XG4gICAgfVxuICAgIGZvcndhcmQuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgdmFyIM+BMF95ID0gRiAtIHksIM+BID0gZDNfc2duKG4pICogTWF0aC5zcXJ0KHggKiB4ICsgz4EwX3kgKiDPgTBfeSk7XG4gICAgICByZXR1cm4gWyBNYXRoLmF0YW4yKHgsIM+BMF95KSAvIG4sIDIgKiBNYXRoLmF0YW4oTWF0aC5wb3coRiAvIM+BLCAxIC8gbikpIC0gaGFsZs+AIF07XG4gICAgfTtcbiAgICByZXR1cm4gZm9yd2FyZDtcbiAgfVxuICAoZDMuZ2VvLmNvbmljQ29uZm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX2dlb19jb25pYyhkM19nZW9fY29uaWNDb25mb3JtYWwpO1xuICB9KS5yYXcgPSBkM19nZW9fY29uaWNDb25mb3JtYWw7XG4gIGZ1bmN0aW9uIGQzX2dlb19jb25pY0VxdWlkaXN0YW50KM+GMCwgz4YxKSB7XG4gICAgdmFyIGNvc8+GMCA9IE1hdGguY29zKM+GMCksIG4gPSDPhjAgPT09IM+GMSA/IE1hdGguc2luKM+GMCkgOiAoY29zz4YwIC0gTWF0aC5jb3Moz4YxKSkgLyAoz4YxIC0gz4YwKSwgRyA9IGNvc8+GMCAvIG4gKyDPhjA7XG4gICAgaWYgKGFicyhuKSA8IM61KSByZXR1cm4gZDNfZ2VvX2VxdWlyZWN0YW5ndWxhcjtcbiAgICBmdW5jdGlvbiBmb3J3YXJkKM67LCDPhikge1xuICAgICAgdmFyIM+BID0gRyAtIM+GO1xuICAgICAgcmV0dXJuIFsgz4EgKiBNYXRoLnNpbihuICogzrspLCBHIC0gz4EgKiBNYXRoLmNvcyhuICogzrspIF07XG4gICAgfVxuICAgIGZvcndhcmQuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgdmFyIM+BMF95ID0gRyAtIHk7XG4gICAgICByZXR1cm4gWyBNYXRoLmF0YW4yKHgsIM+BMF95KSAvIG4sIEcgLSBkM19zZ24obikgKiBNYXRoLnNxcnQoeCAqIHggKyDPgTBfeSAqIM+BMF95KSBdO1xuICAgIH07XG4gICAgcmV0dXJuIGZvcndhcmQ7XG4gIH1cbiAgKGQzLmdlby5jb25pY0VxdWlkaXN0YW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX2dlb19jb25pYyhkM19nZW9fY29uaWNFcXVpZGlzdGFudCk7XG4gIH0pLnJhdyA9IGQzX2dlb19jb25pY0VxdWlkaXN0YW50O1xuICB2YXIgZDNfZ2VvX2dub21vbmljID0gZDNfZ2VvX2F6aW11dGhhbChmdW5jdGlvbihjb3POu2Nvc8+GKSB7XG4gICAgcmV0dXJuIDEgLyBjb3POu2Nvc8+GO1xuICB9LCBNYXRoLmF0YW4pO1xuICAoZDMuZ2VvLmdub21vbmljID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX2dlb19wcm9qZWN0aW9uKGQzX2dlb19nbm9tb25pYyk7XG4gIH0pLnJhdyA9IGQzX2dlb19nbm9tb25pYztcbiAgZnVuY3Rpb24gZDNfZ2VvX21lcmNhdG9yKM67LCDPhikge1xuICAgIHJldHVybiBbIM67LCBNYXRoLmxvZyhNYXRoLnRhbijPgCAvIDQgKyDPhiAvIDIpKSBdO1xuICB9XG4gIGQzX2dlb19tZXJjYXRvci5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcmV0dXJuIFsgeCwgMiAqIE1hdGguYXRhbihNYXRoLmV4cCh5KSkgLSBoYWxmz4AgXTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvX21lcmNhdG9yUHJvamVjdGlvbihwcm9qZWN0KSB7XG4gICAgdmFyIG0gPSBkM19nZW9fcHJvamVjdGlvbihwcm9qZWN0KSwgc2NhbGUgPSBtLnNjYWxlLCB0cmFuc2xhdGUgPSBtLnRyYW5zbGF0ZSwgY2xpcEV4dGVudCA9IG0uY2xpcEV4dGVudCwgY2xpcEF1dG87XG4gICAgbS5zY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHYgPSBzY2FsZS5hcHBseShtLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHYgPT09IG0gPyBjbGlwQXV0byA/IG0uY2xpcEV4dGVudChudWxsKSA6IG0gOiB2O1xuICAgIH07XG4gICAgbS50cmFuc2xhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2ID0gdHJhbnNsYXRlLmFwcGx5KG0sIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdiA9PT0gbSA/IGNsaXBBdXRvID8gbS5jbGlwRXh0ZW50KG51bGwpIDogbSA6IHY7XG4gICAgfTtcbiAgICBtLmNsaXBFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgICB2YXIgdiA9IGNsaXBFeHRlbnQuYXBwbHkobSwgYXJndW1lbnRzKTtcbiAgICAgIGlmICh2ID09PSBtKSB7XG4gICAgICAgIGlmIChjbGlwQXV0byA9IF8gPT0gbnVsbCkge1xuICAgICAgICAgIHZhciBrID0gz4AgKiBzY2FsZSgpLCB0ID0gdHJhbnNsYXRlKCk7XG4gICAgICAgICAgY2xpcEV4dGVudChbIFsgdFswXSAtIGssIHRbMV0gLSBrIF0sIFsgdFswXSArIGssIHRbMV0gKyBrIF0gXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2xpcEF1dG8pIHtcbiAgICAgICAgdiA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdjtcbiAgICB9O1xuICAgIHJldHVybiBtLmNsaXBFeHRlbnQobnVsbCk7XG4gIH1cbiAgKGQzLmdlby5tZXJjYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19nZW9fbWVyY2F0b3JQcm9qZWN0aW9uKGQzX2dlb19tZXJjYXRvcik7XG4gIH0pLnJhdyA9IGQzX2dlb19tZXJjYXRvcjtcbiAgdmFyIGQzX2dlb19vcnRob2dyYXBoaWMgPSBkM19nZW9fYXppbXV0aGFsKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAxO1xuICB9LCBNYXRoLmFzaW4pO1xuICAoZDMuZ2VvLm9ydGhvZ3JhcGhpYyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19nZW9fcHJvamVjdGlvbihkM19nZW9fb3J0aG9ncmFwaGljKTtcbiAgfSkucmF3ID0gZDNfZ2VvX29ydGhvZ3JhcGhpYztcbiAgdmFyIGQzX2dlb19zdGVyZW9ncmFwaGljID0gZDNfZ2VvX2F6aW11dGhhbChmdW5jdGlvbihjb3POu2Nvc8+GKSB7XG4gICAgcmV0dXJuIDEgLyAoMSArIGNvc867Y29zz4YpO1xuICB9LCBmdW5jdGlvbijPgSkge1xuICAgIHJldHVybiAyICogTWF0aC5hdGFuKM+BKTtcbiAgfSk7XG4gIChkMy5nZW8uc3RlcmVvZ3JhcGhpYyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19nZW9fcHJvamVjdGlvbihkM19nZW9fc3RlcmVvZ3JhcGhpYyk7XG4gIH0pLnJhdyA9IGQzX2dlb19zdGVyZW9ncmFwaGljO1xuICBmdW5jdGlvbiBkM19nZW9fdHJhbnN2ZXJzZU1lcmNhdG9yKM67LCDPhikge1xuICAgIHJldHVybiBbIE1hdGgubG9nKE1hdGgudGFuKM+AIC8gNCArIM+GIC8gMikpLCAtzrsgXTtcbiAgfVxuICBkM19nZW9fdHJhbnN2ZXJzZU1lcmNhdG9yLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4gWyAteSwgMiAqIE1hdGguYXRhbihNYXRoLmV4cCh4KSkgLSBoYWxmz4AgXTtcbiAgfTtcbiAgKGQzLmdlby50cmFuc3ZlcnNlTWVyY2F0b3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcHJvamVjdGlvbiA9IGQzX2dlb19tZXJjYXRvclByb2plY3Rpb24oZDNfZ2VvX3RyYW5zdmVyc2VNZXJjYXRvciksIGNlbnRlciA9IHByb2plY3Rpb24uY2VudGVyLCByb3RhdGUgPSBwcm9qZWN0aW9uLnJvdGF0ZTtcbiAgICBwcm9qZWN0aW9uLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBfID8gY2VudGVyKFsgLV9bMV0sIF9bMF0gXSkgOiAoXyA9IGNlbnRlcigpLCBbIF9bMV0sIC1fWzBdIF0pO1xuICAgIH07XG4gICAgcHJvamVjdGlvbi5yb3RhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gXyA/IHJvdGF0ZShbIF9bMF0sIF9bMV0sIF8ubGVuZ3RoID4gMiA/IF9bMl0gKyA5MCA6IDkwIF0pIDogKF8gPSByb3RhdGUoKSwgXG4gICAgICBbIF9bMF0sIF9bMV0sIF9bMl0gLSA5MCBdKTtcbiAgICB9O1xuICAgIHJldHVybiByb3RhdGUoWyAwLCAwLCA5MCBdKTtcbiAgfSkucmF3ID0gZDNfZ2VvX3RyYW5zdmVyc2VNZXJjYXRvcjtcbiAgZDMuZ2VvbSA9IHt9O1xuICBmdW5jdGlvbiBkM19nZW9tX3BvaW50WChkKSB7XG4gICAgcmV0dXJuIGRbMF07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV9wb2ludFkoZCkge1xuICAgIHJldHVybiBkWzFdO1xuICB9XG4gIGQzLmdlb20uaHVsbCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gICAgdmFyIHggPSBkM19nZW9tX3BvaW50WCwgeSA9IGQzX2dlb21fcG9pbnRZO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gaHVsbCh2ZXJ0aWNlcyk7XG4gICAgZnVuY3Rpb24gaHVsbChkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPCAzKSByZXR1cm4gW107XG4gICAgICB2YXIgZnggPSBkM19mdW5jdG9yKHgpLCBmeSA9IGQzX2Z1bmN0b3IoeSksIGksIG4gPSBkYXRhLmxlbmd0aCwgcG9pbnRzID0gW10sIGZsaXBwZWRQb2ludHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgcG9pbnRzLnB1c2goWyArZnguY2FsbCh0aGlzLCBkYXRhW2ldLCBpKSwgK2Z5LmNhbGwodGhpcywgZGF0YVtpXSwgaSksIGkgXSk7XG4gICAgICB9XG4gICAgICBwb2ludHMuc29ydChkM19nZW9tX2h1bGxPcmRlcik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBmbGlwcGVkUG9pbnRzLnB1c2goWyBwb2ludHNbaV1bMF0sIC1wb2ludHNbaV1bMV0gXSk7XG4gICAgICB2YXIgdXBwZXIgPSBkM19nZW9tX2h1bGxVcHBlcihwb2ludHMpLCBsb3dlciA9IGQzX2dlb21faHVsbFVwcGVyKGZsaXBwZWRQb2ludHMpO1xuICAgICAgdmFyIHNraXBMZWZ0ID0gbG93ZXJbMF0gPT09IHVwcGVyWzBdLCBza2lwUmlnaHQgPSBsb3dlcltsb3dlci5sZW5ndGggLSAxXSA9PT0gdXBwZXJbdXBwZXIubGVuZ3RoIC0gMV0sIHBvbHlnb24gPSBbXTtcbiAgICAgIGZvciAoaSA9IHVwcGVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSBwb2x5Z29uLnB1c2goZGF0YVtwb2ludHNbdXBwZXJbaV1dWzJdXSk7XG4gICAgICBmb3IgKGkgPSArc2tpcExlZnQ7IGkgPCBsb3dlci5sZW5ndGggLSBza2lwUmlnaHQ7ICsraSkgcG9seWdvbi5wdXNoKGRhdGFbcG9pbnRzW2xvd2VyW2ldXVsyXV0pO1xuICAgICAgcmV0dXJuIHBvbHlnb247XG4gICAgfVxuICAgIGh1bGwueCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCBodWxsKSA6IHg7XG4gICAgfTtcbiAgICBodWxsLnkgPSBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gXywgaHVsbCkgOiB5O1xuICAgIH07XG4gICAgcmV0dXJuIGh1bGw7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb21faHVsbFVwcGVyKHBvaW50cykge1xuICAgIHZhciBuID0gcG9pbnRzLmxlbmd0aCwgaHVsbCA9IFsgMCwgMSBdLCBocyA9IDI7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBuOyBpKyspIHtcbiAgICAgIHdoaWxlIChocyA+IDEgJiYgZDNfY3Jvc3MyZChwb2ludHNbaHVsbFtocyAtIDJdXSwgcG9pbnRzW2h1bGxbaHMgLSAxXV0sIHBvaW50c1tpXSkgPD0gMCkgLS1ocztcbiAgICAgIGh1bGxbaHMrK10gPSBpO1xuICAgIH1cbiAgICByZXR1cm4gaHVsbC5zbGljZSgwLCBocyk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV9odWxsT3JkZXIoYSwgYikge1xuICAgIHJldHVybiBhWzBdIC0gYlswXSB8fCBhWzFdIC0gYlsxXTtcbiAgfVxuICBkMy5nZW9tLnBvbHlnb24gPSBmdW5jdGlvbihjb29yZGluYXRlcykge1xuICAgIGQzX3N1YmNsYXNzKGNvb3JkaW5hdGVzLCBkM19nZW9tX3BvbHlnb25Qcm90b3R5cGUpO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfTtcbiAgdmFyIGQzX2dlb21fcG9seWdvblByb3RvdHlwZSA9IGQzLmdlb20ucG9seWdvbi5wcm90b3R5cGUgPSBbXTtcbiAgZDNfZ2VvbV9wb2x5Z29uUHJvdG90eXBlLmFyZWEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gdGhpcy5sZW5ndGgsIGEsIGIgPSB0aGlzW24gLSAxXSwgYXJlYSA9IDA7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGEgPSBiO1xuICAgICAgYiA9IHRoaXNbaV07XG4gICAgICBhcmVhICs9IGFbMV0gKiBiWzBdIC0gYVswXSAqIGJbMV07XG4gICAgfVxuICAgIHJldHVybiBhcmVhICogLjU7XG4gIH07XG4gIGQzX2dlb21fcG9seWdvblByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gdGhpcy5sZW5ndGgsIHggPSAwLCB5ID0gMCwgYSwgYiA9IHRoaXNbbiAtIDFdLCBjO1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgayA9IC0xIC8gKDYgKiB0aGlzLmFyZWEoKSk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGEgPSBiO1xuICAgICAgYiA9IHRoaXNbaV07XG4gICAgICBjID0gYVswXSAqIGJbMV0gLSBiWzBdICogYVsxXTtcbiAgICAgIHggKz0gKGFbMF0gKyBiWzBdKSAqIGM7XG4gICAgICB5ICs9IChhWzFdICsgYlsxXSkgKiBjO1xuICAgIH1cbiAgICByZXR1cm4gWyB4ICogaywgeSAqIGsgXTtcbiAgfTtcbiAgZDNfZ2VvbV9wb2x5Z29uUHJvdG90eXBlLmNsaXAgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgdmFyIGlucHV0LCBjbG9zZWQgPSBkM19nZW9tX3BvbHlnb25DbG9zZWQoc3ViamVjdCksIGkgPSAtMSwgbiA9IHRoaXMubGVuZ3RoIC0gZDNfZ2VvbV9wb2x5Z29uQ2xvc2VkKHRoaXMpLCBqLCBtLCBhID0gdGhpc1tuIC0gMV0sIGIsIGMsIGQ7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlucHV0ID0gc3ViamVjdC5zbGljZSgpO1xuICAgICAgc3ViamVjdC5sZW5ndGggPSAwO1xuICAgICAgYiA9IHRoaXNbaV07XG4gICAgICBjID0gaW5wdXRbKG0gPSBpbnB1dC5sZW5ndGggLSBjbG9zZWQpIC0gMV07XG4gICAgICBqID0gLTE7XG4gICAgICB3aGlsZSAoKytqIDwgbSkge1xuICAgICAgICBkID0gaW5wdXRbal07XG4gICAgICAgIGlmIChkM19nZW9tX3BvbHlnb25JbnNpZGUoZCwgYSwgYikpIHtcbiAgICAgICAgICBpZiAoIWQzX2dlb21fcG9seWdvbkluc2lkZShjLCBhLCBiKSkge1xuICAgICAgICAgICAgc3ViamVjdC5wdXNoKGQzX2dlb21fcG9seWdvbkludGVyc2VjdChjLCBkLCBhLCBiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YmplY3QucHVzaChkKTtcbiAgICAgICAgfSBlbHNlIGlmIChkM19nZW9tX3BvbHlnb25JbnNpZGUoYywgYSwgYikpIHtcbiAgICAgICAgICBzdWJqZWN0LnB1c2goZDNfZ2VvbV9wb2x5Z29uSW50ZXJzZWN0KGMsIGQsIGEsIGIpKTtcbiAgICAgICAgfVxuICAgICAgICBjID0gZDtcbiAgICAgIH1cbiAgICAgIGlmIChjbG9zZWQpIHN1YmplY3QucHVzaChzdWJqZWN0WzBdKTtcbiAgICAgIGEgPSBiO1xuICAgIH1cbiAgICByZXR1cm4gc3ViamVjdDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvbV9wb2x5Z29uSW5zaWRlKHAsIGEsIGIpIHtcbiAgICByZXR1cm4gKGJbMF0gLSBhWzBdKSAqIChwWzFdIC0gYVsxXSkgPCAoYlsxXSAtIGFbMV0pICogKHBbMF0gLSBhWzBdKTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3BvbHlnb25JbnRlcnNlY3QoYywgZCwgYSwgYikge1xuICAgIHZhciB4MSA9IGNbMF0sIHgzID0gYVswXSwgeDIxID0gZFswXSAtIHgxLCB4NDMgPSBiWzBdIC0geDMsIHkxID0gY1sxXSwgeTMgPSBhWzFdLCB5MjEgPSBkWzFdIC0geTEsIHk0MyA9IGJbMV0gLSB5MywgdWEgPSAoeDQzICogKHkxIC0geTMpIC0geTQzICogKHgxIC0geDMpKSAvICh5NDMgKiB4MjEgLSB4NDMgKiB5MjEpO1xuICAgIHJldHVybiBbIHgxICsgdWEgKiB4MjEsIHkxICsgdWEgKiB5MjEgXTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3BvbHlnb25DbG9zZWQoY29vcmRpbmF0ZXMpIHtcbiAgICB2YXIgYSA9IGNvb3JkaW5hdGVzWzBdLCBiID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuICEoYVswXSAtIGJbMF0gfHwgYVsxXSAtIGJbMV0pO1xuICB9XG4gIHZhciBkM19nZW9tX3Zvcm9ub2lFZGdlcywgZDNfZ2VvbV92b3Jvbm9pQ2VsbHMsIGQzX2dlb21fdm9yb25vaUJlYWNoZXMsIGQzX2dlb21fdm9yb25vaUJlYWNoUG9vbCA9IFtdLCBkM19nZW9tX3Zvcm9ub2lGaXJzdENpcmNsZSwgZDNfZ2VvbV92b3Jvbm9pQ2lyY2xlcywgZDNfZ2VvbV92b3Jvbm9pQ2lyY2xlUG9vbCA9IFtdO1xuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lCZWFjaCgpIHtcbiAgICBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja05vZGUodGhpcyk7XG4gICAgdGhpcy5lZGdlID0gdGhpcy5zaXRlID0gdGhpcy5jaXJjbGUgPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaUNyZWF0ZUJlYWNoKHNpdGUpIHtcbiAgICB2YXIgYmVhY2ggPSBkM19nZW9tX3Zvcm9ub2lCZWFjaFBvb2wucG9wKCkgfHwgbmV3IGQzX2dlb21fdm9yb25vaUJlYWNoKCk7XG4gICAgYmVhY2guc2l0ZSA9IHNpdGU7XG4gICAgcmV0dXJuIGJlYWNoO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaURldGFjaEJlYWNoKGJlYWNoKSB7XG4gICAgZDNfZ2VvbV92b3Jvbm9pRGV0YWNoQ2lyY2xlKGJlYWNoKTtcbiAgICBkM19nZW9tX3Zvcm9ub2lCZWFjaGVzLnJlbW92ZShiZWFjaCk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pQmVhY2hQb29sLnB1c2goYmVhY2gpO1xuICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrTm9kZShiZWFjaCk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pUmVtb3ZlQmVhY2goYmVhY2gpIHtcbiAgICB2YXIgY2lyY2xlID0gYmVhY2guY2lyY2xlLCB4ID0gY2lyY2xlLngsIHkgPSBjaXJjbGUuY3ksIHZlcnRleCA9IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSwgcHJldmlvdXMgPSBiZWFjaC5QLCBuZXh0ID0gYmVhY2guTiwgZGlzYXBwZWFyaW5nID0gWyBiZWFjaCBdO1xuICAgIGQzX2dlb21fdm9yb25vaURldGFjaEJlYWNoKGJlYWNoKTtcbiAgICB2YXIgbEFyYyA9IHByZXZpb3VzO1xuICAgIHdoaWxlIChsQXJjLmNpcmNsZSAmJiBhYnMoeCAtIGxBcmMuY2lyY2xlLngpIDwgzrUgJiYgYWJzKHkgLSBsQXJjLmNpcmNsZS5jeSkgPCDOtSkge1xuICAgICAgcHJldmlvdXMgPSBsQXJjLlA7XG4gICAgICBkaXNhcHBlYXJpbmcudW5zaGlmdChsQXJjKTtcbiAgICAgIGQzX2dlb21fdm9yb25vaURldGFjaEJlYWNoKGxBcmMpO1xuICAgICAgbEFyYyA9IHByZXZpb3VzO1xuICAgIH1cbiAgICBkaXNhcHBlYXJpbmcudW5zaGlmdChsQXJjKTtcbiAgICBkM19nZW9tX3Zvcm9ub2lEZXRhY2hDaXJjbGUobEFyYyk7XG4gICAgdmFyIHJBcmMgPSBuZXh0O1xuICAgIHdoaWxlIChyQXJjLmNpcmNsZSAmJiBhYnMoeCAtIHJBcmMuY2lyY2xlLngpIDwgzrUgJiYgYWJzKHkgLSByQXJjLmNpcmNsZS5jeSkgPCDOtSkge1xuICAgICAgbmV4dCA9IHJBcmMuTjtcbiAgICAgIGRpc2FwcGVhcmluZy5wdXNoKHJBcmMpO1xuICAgICAgZDNfZ2VvbV92b3Jvbm9pRGV0YWNoQmVhY2gockFyYyk7XG4gICAgICByQXJjID0gbmV4dDtcbiAgICB9XG4gICAgZGlzYXBwZWFyaW5nLnB1c2gockFyYyk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pRGV0YWNoQ2lyY2xlKHJBcmMpO1xuICAgIHZhciBuQXJjcyA9IGRpc2FwcGVhcmluZy5sZW5ndGgsIGlBcmM7XG4gICAgZm9yIChpQXJjID0gMTsgaUFyYyA8IG5BcmNzOyArK2lBcmMpIHtcbiAgICAgIHJBcmMgPSBkaXNhcHBlYXJpbmdbaUFyY107XG4gICAgICBsQXJjID0gZGlzYXBwZWFyaW5nW2lBcmMgLSAxXTtcbiAgICAgIGQzX2dlb21fdm9yb25vaVNldEVkZ2VFbmQockFyYy5lZGdlLCBsQXJjLnNpdGUsIHJBcmMuc2l0ZSwgdmVydGV4KTtcbiAgICB9XG4gICAgbEFyYyA9IGRpc2FwcGVhcmluZ1swXTtcbiAgICByQXJjID0gZGlzYXBwZWFyaW5nW25BcmNzIC0gMV07XG4gICAgckFyYy5lZGdlID0gZDNfZ2VvbV92b3Jvbm9pQ3JlYXRlRWRnZShsQXJjLnNpdGUsIHJBcmMuc2l0ZSwgbnVsbCwgdmVydGV4KTtcbiAgICBkM19nZW9tX3Zvcm9ub2lBdHRhY2hDaXJjbGUobEFyYyk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pQXR0YWNoQ2lyY2xlKHJBcmMpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaUFkZEJlYWNoKHNpdGUpIHtcbiAgICB2YXIgeCA9IHNpdGUueCwgZGlyZWN0cml4ID0gc2l0ZS55LCBsQXJjLCByQXJjLCBkeGwsIGR4ciwgbm9kZSA9IGQzX2dlb21fdm9yb25vaUJlYWNoZXMuXztcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgZHhsID0gZDNfZ2VvbV92b3Jvbm9pTGVmdEJyZWFrUG9pbnQobm9kZSwgZGlyZWN0cml4KSAtIHg7XG4gICAgICBpZiAoZHhsID4gzrUpIG5vZGUgPSBub2RlLkw7IGVsc2Uge1xuICAgICAgICBkeHIgPSB4IC0gZDNfZ2VvbV92b3Jvbm9pUmlnaHRCcmVha1BvaW50KG5vZGUsIGRpcmVjdHJpeCk7XG4gICAgICAgIGlmIChkeHIgPiDOtSkge1xuICAgICAgICAgIGlmICghbm9kZS5SKSB7XG4gICAgICAgICAgICBsQXJjID0gbm9kZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2RlID0gbm9kZS5SO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChkeGwgPiAtzrUpIHtcbiAgICAgICAgICAgIGxBcmMgPSBub2RlLlA7XG4gICAgICAgICAgICByQXJjID0gbm9kZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGR4ciA+IC3OtSkge1xuICAgICAgICAgICAgbEFyYyA9IG5vZGU7XG4gICAgICAgICAgICByQXJjID0gbm9kZS5OO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsQXJjID0gckFyYyA9IG5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBuZXdBcmMgPSBkM19nZW9tX3Zvcm9ub2lDcmVhdGVCZWFjaChzaXRlKTtcbiAgICBkM19nZW9tX3Zvcm9ub2lCZWFjaGVzLmluc2VydChsQXJjLCBuZXdBcmMpO1xuICAgIGlmICghbEFyYyAmJiAhckFyYykgcmV0dXJuO1xuICAgIGlmIChsQXJjID09PSByQXJjKSB7XG4gICAgICBkM19nZW9tX3Zvcm9ub2lEZXRhY2hDaXJjbGUobEFyYyk7XG4gICAgICByQXJjID0gZDNfZ2VvbV92b3Jvbm9pQ3JlYXRlQmVhY2gobEFyYy5zaXRlKTtcbiAgICAgIGQzX2dlb21fdm9yb25vaUJlYWNoZXMuaW5zZXJ0KG5ld0FyYywgckFyYyk7XG4gICAgICBuZXdBcmMuZWRnZSA9IHJBcmMuZWRnZSA9IGQzX2dlb21fdm9yb25vaUNyZWF0ZUVkZ2UobEFyYy5zaXRlLCBuZXdBcmMuc2l0ZSk7XG4gICAgICBkM19nZW9tX3Zvcm9ub2lBdHRhY2hDaXJjbGUobEFyYyk7XG4gICAgICBkM19nZW9tX3Zvcm9ub2lBdHRhY2hDaXJjbGUockFyYyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghckFyYykge1xuICAgICAgbmV3QXJjLmVkZ2UgPSBkM19nZW9tX3Zvcm9ub2lDcmVhdGVFZGdlKGxBcmMuc2l0ZSwgbmV3QXJjLnNpdGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkM19nZW9tX3Zvcm9ub2lEZXRhY2hDaXJjbGUobEFyYyk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pRGV0YWNoQ2lyY2xlKHJBcmMpO1xuICAgIHZhciBsU2l0ZSA9IGxBcmMuc2l0ZSwgYXggPSBsU2l0ZS54LCBheSA9IGxTaXRlLnksIGJ4ID0gc2l0ZS54IC0gYXgsIGJ5ID0gc2l0ZS55IC0gYXksIHJTaXRlID0gckFyYy5zaXRlLCBjeCA9IHJTaXRlLnggLSBheCwgY3kgPSByU2l0ZS55IC0gYXksIGQgPSAyICogKGJ4ICogY3kgLSBieSAqIGN4KSwgaGIgPSBieCAqIGJ4ICsgYnkgKiBieSwgaGMgPSBjeCAqIGN4ICsgY3kgKiBjeSwgdmVydGV4ID0ge1xuICAgICAgeDogKGN5ICogaGIgLSBieSAqIGhjKSAvIGQgKyBheCxcbiAgICAgIHk6IChieCAqIGhjIC0gY3ggKiBoYikgLyBkICsgYXlcbiAgICB9O1xuICAgIGQzX2dlb21fdm9yb25vaVNldEVkZ2VFbmQockFyYy5lZGdlLCBsU2l0ZSwgclNpdGUsIHZlcnRleCk7XG4gICAgbmV3QXJjLmVkZ2UgPSBkM19nZW9tX3Zvcm9ub2lDcmVhdGVFZGdlKGxTaXRlLCBzaXRlLCBudWxsLCB2ZXJ0ZXgpO1xuICAgIHJBcmMuZWRnZSA9IGQzX2dlb21fdm9yb25vaUNyZWF0ZUVkZ2Uoc2l0ZSwgclNpdGUsIG51bGwsIHZlcnRleCk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pQXR0YWNoQ2lyY2xlKGxBcmMpO1xuICAgIGQzX2dlb21fdm9yb25vaUF0dGFjaENpcmNsZShyQXJjKTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lMZWZ0QnJlYWtQb2ludChhcmMsIGRpcmVjdHJpeCkge1xuICAgIHZhciBzaXRlID0gYXJjLnNpdGUsIHJmb2N4ID0gc2l0ZS54LCByZm9jeSA9IHNpdGUueSwgcGJ5MiA9IHJmb2N5IC0gZGlyZWN0cml4O1xuICAgIGlmICghcGJ5MikgcmV0dXJuIHJmb2N4O1xuICAgIHZhciBsQXJjID0gYXJjLlA7XG4gICAgaWYgKCFsQXJjKSByZXR1cm4gLUluZmluaXR5O1xuICAgIHNpdGUgPSBsQXJjLnNpdGU7XG4gICAgdmFyIGxmb2N4ID0gc2l0ZS54LCBsZm9jeSA9IHNpdGUueSwgcGxieTIgPSBsZm9jeSAtIGRpcmVjdHJpeDtcbiAgICBpZiAoIXBsYnkyKSByZXR1cm4gbGZvY3g7XG4gICAgdmFyIGhsID0gbGZvY3ggLSByZm9jeCwgYWJ5MiA9IDEgLyBwYnkyIC0gMSAvIHBsYnkyLCBiID0gaGwgLyBwbGJ5MjtcbiAgICBpZiAoYWJ5MikgcmV0dXJuICgtYiArIE1hdGguc3FydChiICogYiAtIDIgKiBhYnkyICogKGhsICogaGwgLyAoLTIgKiBwbGJ5MikgLSBsZm9jeSArIHBsYnkyIC8gMiArIHJmb2N5IC0gcGJ5MiAvIDIpKSkgLyBhYnkyICsgcmZvY3g7XG4gICAgcmV0dXJuIChyZm9jeCArIGxmb2N4KSAvIDI7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pUmlnaHRCcmVha1BvaW50KGFyYywgZGlyZWN0cml4KSB7XG4gICAgdmFyIHJBcmMgPSBhcmMuTjtcbiAgICBpZiAockFyYykgcmV0dXJuIGQzX2dlb21fdm9yb25vaUxlZnRCcmVha1BvaW50KHJBcmMsIGRpcmVjdHJpeCk7XG4gICAgdmFyIHNpdGUgPSBhcmMuc2l0ZTtcbiAgICByZXR1cm4gc2l0ZS55ID09PSBkaXJlY3RyaXggPyBzaXRlLnggOiBJbmZpbml0eTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lDZWxsKHNpdGUpIHtcbiAgICB0aGlzLnNpdGUgPSBzaXRlO1xuICAgIHRoaXMuZWRnZXMgPSBbXTtcbiAgfVxuICBkM19nZW9tX3Zvcm9ub2lDZWxsLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhhbGZFZGdlcyA9IHRoaXMuZWRnZXMsIGlIYWxmRWRnZSA9IGhhbGZFZGdlcy5sZW5ndGgsIGVkZ2U7XG4gICAgd2hpbGUgKGlIYWxmRWRnZS0tKSB7XG4gICAgICBlZGdlID0gaGFsZkVkZ2VzW2lIYWxmRWRnZV0uZWRnZTtcbiAgICAgIGlmICghZWRnZS5iIHx8ICFlZGdlLmEpIGhhbGZFZGdlcy5zcGxpY2UoaUhhbGZFZGdlLCAxKTtcbiAgICB9XG4gICAgaGFsZkVkZ2VzLnNvcnQoZDNfZ2VvbV92b3Jvbm9pSGFsZkVkZ2VPcmRlcik7XG4gICAgcmV0dXJuIGhhbGZFZGdlcy5sZW5ndGg7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaUNsb3NlQ2VsbHMoZXh0ZW50KSB7XG4gICAgdmFyIHgwID0gZXh0ZW50WzBdWzBdLCB4MSA9IGV4dGVudFsxXVswXSwgeTAgPSBleHRlbnRbMF1bMV0sIHkxID0gZXh0ZW50WzFdWzFdLCB4MiwgeTIsIHgzLCB5MywgY2VsbHMgPSBkM19nZW9tX3Zvcm9ub2lDZWxscywgaUNlbGwgPSBjZWxscy5sZW5ndGgsIGNlbGwsIGlIYWxmRWRnZSwgaGFsZkVkZ2VzLCBuSGFsZkVkZ2VzLCBzdGFydCwgZW5kO1xuICAgIHdoaWxlIChpQ2VsbC0tKSB7XG4gICAgICBjZWxsID0gY2VsbHNbaUNlbGxdO1xuICAgICAgaWYgKCFjZWxsIHx8ICFjZWxsLnByZXBhcmUoKSkgY29udGludWU7XG4gICAgICBoYWxmRWRnZXMgPSBjZWxsLmVkZ2VzO1xuICAgICAgbkhhbGZFZGdlcyA9IGhhbGZFZGdlcy5sZW5ndGg7XG4gICAgICBpSGFsZkVkZ2UgPSAwO1xuICAgICAgd2hpbGUgKGlIYWxmRWRnZSA8IG5IYWxmRWRnZXMpIHtcbiAgICAgICAgZW5kID0gaGFsZkVkZ2VzW2lIYWxmRWRnZV0uZW5kKCksIHgzID0gZW5kLngsIHkzID0gZW5kLnk7XG4gICAgICAgIHN0YXJ0ID0gaGFsZkVkZ2VzWysraUhhbGZFZGdlICUgbkhhbGZFZGdlc10uc3RhcnQoKSwgeDIgPSBzdGFydC54LCB5MiA9IHN0YXJ0Lnk7XG4gICAgICAgIGlmIChhYnMoeDMgLSB4MikgPiDOtSB8fCBhYnMoeTMgLSB5MikgPiDOtSkge1xuICAgICAgICAgIGhhbGZFZGdlcy5zcGxpY2UoaUhhbGZFZGdlLCAwLCBuZXcgZDNfZ2VvbV92b3Jvbm9pSGFsZkVkZ2UoZDNfZ2VvbV92b3Jvbm9pQ3JlYXRlQm9yZGVyRWRnZShjZWxsLnNpdGUsIGVuZCwgYWJzKHgzIC0geDApIDwgzrUgJiYgeTEgLSB5MyA+IM61ID8ge1xuICAgICAgICAgICAgeDogeDAsXG4gICAgICAgICAgICB5OiBhYnMoeDIgLSB4MCkgPCDOtSA/IHkyIDogeTFcbiAgICAgICAgICB9IDogYWJzKHkzIC0geTEpIDwgzrUgJiYgeDEgLSB4MyA+IM61ID8ge1xuICAgICAgICAgICAgeDogYWJzKHkyIC0geTEpIDwgzrUgPyB4MiA6IHgxLFxuICAgICAgICAgICAgeTogeTFcbiAgICAgICAgICB9IDogYWJzKHgzIC0geDEpIDwgzrUgJiYgeTMgLSB5MCA+IM61ID8ge1xuICAgICAgICAgICAgeDogeDEsXG4gICAgICAgICAgICB5OiBhYnMoeDIgLSB4MSkgPCDOtSA/IHkyIDogeTBcbiAgICAgICAgICB9IDogYWJzKHkzIC0geTApIDwgzrUgJiYgeDMgLSB4MCA+IM61ID8ge1xuICAgICAgICAgICAgeDogYWJzKHkyIC0geTApIDwgzrUgPyB4MiA6IHgwLFxuICAgICAgICAgICAgeTogeTBcbiAgICAgICAgICB9IDogbnVsbCksIGNlbGwuc2l0ZSwgbnVsbCkpO1xuICAgICAgICAgICsrbkhhbGZFZGdlcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lIYWxmRWRnZU9yZGVyKGEsIGIpIHtcbiAgICByZXR1cm4gYi5hbmdsZSAtIGEuYW5nbGU7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pQ2lyY2xlKCkge1xuICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrTm9kZSh0aGlzKTtcbiAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLmFyYyA9IHRoaXMuc2l0ZSA9IHRoaXMuY3kgPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaUF0dGFjaENpcmNsZShhcmMpIHtcbiAgICB2YXIgbEFyYyA9IGFyYy5QLCByQXJjID0gYXJjLk47XG4gICAgaWYgKCFsQXJjIHx8ICFyQXJjKSByZXR1cm47XG4gICAgdmFyIGxTaXRlID0gbEFyYy5zaXRlLCBjU2l0ZSA9IGFyYy5zaXRlLCByU2l0ZSA9IHJBcmMuc2l0ZTtcbiAgICBpZiAobFNpdGUgPT09IHJTaXRlKSByZXR1cm47XG4gICAgdmFyIGJ4ID0gY1NpdGUueCwgYnkgPSBjU2l0ZS55LCBheCA9IGxTaXRlLnggLSBieCwgYXkgPSBsU2l0ZS55IC0gYnksIGN4ID0gclNpdGUueCAtIGJ4LCBjeSA9IHJTaXRlLnkgLSBieTtcbiAgICB2YXIgZCA9IDIgKiAoYXggKiBjeSAtIGF5ICogY3gpO1xuICAgIGlmIChkID49IC3OtTIpIHJldHVybjtcbiAgICB2YXIgaGEgPSBheCAqIGF4ICsgYXkgKiBheSwgaGMgPSBjeCAqIGN4ICsgY3kgKiBjeSwgeCA9IChjeSAqIGhhIC0gYXkgKiBoYykgLyBkLCB5ID0gKGF4ICogaGMgLSBjeCAqIGhhKSAvIGQsIGN5ID0geSArIGJ5O1xuICAgIHZhciBjaXJjbGUgPSBkM19nZW9tX3Zvcm9ub2lDaXJjbGVQb29sLnBvcCgpIHx8IG5ldyBkM19nZW9tX3Zvcm9ub2lDaXJjbGUoKTtcbiAgICBjaXJjbGUuYXJjID0gYXJjO1xuICAgIGNpcmNsZS5zaXRlID0gY1NpdGU7XG4gICAgY2lyY2xlLnggPSB4ICsgYng7XG4gICAgY2lyY2xlLnkgPSBjeSArIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICBjaXJjbGUuY3kgPSBjeTtcbiAgICBhcmMuY2lyY2xlID0gY2lyY2xlO1xuICAgIHZhciBiZWZvcmUgPSBudWxsLCBub2RlID0gZDNfZ2VvbV92b3Jvbm9pQ2lyY2xlcy5fO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBpZiAoY2lyY2xlLnkgPCBub2RlLnkgfHwgY2lyY2xlLnkgPT09IG5vZGUueSAmJiBjaXJjbGUueCA8PSBub2RlLngpIHtcbiAgICAgICAgaWYgKG5vZGUuTCkgbm9kZSA9IG5vZGUuTDsgZWxzZSB7XG4gICAgICAgICAgYmVmb3JlID0gbm9kZS5QO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobm9kZS5SKSBub2RlID0gbm9kZS5SOyBlbHNlIHtcbiAgICAgICAgICBiZWZvcmUgPSBub2RlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGQzX2dlb21fdm9yb25vaUNpcmNsZXMuaW5zZXJ0KGJlZm9yZSwgY2lyY2xlKTtcbiAgICBpZiAoIWJlZm9yZSkgZDNfZ2VvbV92b3Jvbm9pRmlyc3RDaXJjbGUgPSBjaXJjbGU7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pRGV0YWNoQ2lyY2xlKGFyYykge1xuICAgIHZhciBjaXJjbGUgPSBhcmMuY2lyY2xlO1xuICAgIGlmIChjaXJjbGUpIHtcbiAgICAgIGlmICghY2lyY2xlLlApIGQzX2dlb21fdm9yb25vaUZpcnN0Q2lyY2xlID0gY2lyY2xlLk47XG4gICAgICBkM19nZW9tX3Zvcm9ub2lDaXJjbGVzLnJlbW92ZShjaXJjbGUpO1xuICAgICAgZDNfZ2VvbV92b3Jvbm9pQ2lyY2xlUG9vbC5wdXNoKGNpcmNsZSk7XG4gICAgICBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja05vZGUoY2lyY2xlKTtcbiAgICAgIGFyYy5jaXJjbGUgPSBudWxsO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lDbGlwRWRnZXMoZXh0ZW50KSB7XG4gICAgdmFyIGVkZ2VzID0gZDNfZ2VvbV92b3Jvbm9pRWRnZXMsIGNsaXAgPSBkM19nZW9tX2NsaXBMaW5lKGV4dGVudFswXVswXSwgZXh0ZW50WzBdWzFdLCBleHRlbnRbMV1bMF0sIGV4dGVudFsxXVsxXSksIGkgPSBlZGdlcy5sZW5ndGgsIGU7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZSA9IGVkZ2VzW2ldO1xuICAgICAgaWYgKCFkM19nZW9tX3Zvcm9ub2lDb25uZWN0RWRnZShlLCBleHRlbnQpIHx8ICFjbGlwKGUpIHx8IGFicyhlLmEueCAtIGUuYi54KSA8IM61ICYmIGFicyhlLmEueSAtIGUuYi55KSA8IM61KSB7XG4gICAgICAgIGUuYSA9IGUuYiA9IG51bGw7XG4gICAgICAgIGVkZ2VzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pQ29ubmVjdEVkZ2UoZWRnZSwgZXh0ZW50KSB7XG4gICAgdmFyIHZiID0gZWRnZS5iO1xuICAgIGlmICh2YikgcmV0dXJuIHRydWU7XG4gICAgdmFyIHZhID0gZWRnZS5hLCB4MCA9IGV4dGVudFswXVswXSwgeDEgPSBleHRlbnRbMV1bMF0sIHkwID0gZXh0ZW50WzBdWzFdLCB5MSA9IGV4dGVudFsxXVsxXSwgbFNpdGUgPSBlZGdlLmwsIHJTaXRlID0gZWRnZS5yLCBseCA9IGxTaXRlLngsIGx5ID0gbFNpdGUueSwgcnggPSByU2l0ZS54LCByeSA9IHJTaXRlLnksIGZ4ID0gKGx4ICsgcngpIC8gMiwgZnkgPSAobHkgKyByeSkgLyAyLCBmbSwgZmI7XG4gICAgaWYgKHJ5ID09PSBseSkge1xuICAgICAgaWYgKGZ4IDwgeDAgfHwgZnggPj0geDEpIHJldHVybjtcbiAgICAgIGlmIChseCA+IHJ4KSB7XG4gICAgICAgIGlmICghdmEpIHZhID0ge1xuICAgICAgICAgIHg6IGZ4LFxuICAgICAgICAgIHk6IHkwXG4gICAgICAgIH07IGVsc2UgaWYgKHZhLnkgPj0geTEpIHJldHVybjtcbiAgICAgICAgdmIgPSB7XG4gICAgICAgICAgeDogZngsXG4gICAgICAgICAgeTogeTFcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdmEpIHZhID0ge1xuICAgICAgICAgIHg6IGZ4LFxuICAgICAgICAgIHk6IHkxXG4gICAgICAgIH07IGVsc2UgaWYgKHZhLnkgPCB5MCkgcmV0dXJuO1xuICAgICAgICB2YiA9IHtcbiAgICAgICAgICB4OiBmeCxcbiAgICAgICAgICB5OiB5MFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmbSA9IChseCAtIHJ4KSAvIChyeSAtIGx5KTtcbiAgICAgIGZiID0gZnkgLSBmbSAqIGZ4O1xuICAgICAgaWYgKGZtIDwgLTEgfHwgZm0gPiAxKSB7XG4gICAgICAgIGlmIChseCA+IHJ4KSB7XG4gICAgICAgICAgaWYgKCF2YSkgdmEgPSB7XG4gICAgICAgICAgICB4OiAoeTAgLSBmYikgLyBmbSxcbiAgICAgICAgICAgIHk6IHkwXG4gICAgICAgICAgfTsgZWxzZSBpZiAodmEueSA+PSB5MSkgcmV0dXJuO1xuICAgICAgICAgIHZiID0ge1xuICAgICAgICAgICAgeDogKHkxIC0gZmIpIC8gZm0sXG4gICAgICAgICAgICB5OiB5MVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF2YSkgdmEgPSB7XG4gICAgICAgICAgICB4OiAoeTEgLSBmYikgLyBmbSxcbiAgICAgICAgICAgIHk6IHkxXG4gICAgICAgICAgfTsgZWxzZSBpZiAodmEueSA8IHkwKSByZXR1cm47XG4gICAgICAgICAgdmIgPSB7XG4gICAgICAgICAgICB4OiAoeTAgLSBmYikgLyBmbSxcbiAgICAgICAgICAgIHk6IHkwXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGx5IDwgcnkpIHtcbiAgICAgICAgICBpZiAoIXZhKSB2YSA9IHtcbiAgICAgICAgICAgIHg6IHgwLFxuICAgICAgICAgICAgeTogZm0gKiB4MCArIGZiXG4gICAgICAgICAgfTsgZWxzZSBpZiAodmEueCA+PSB4MSkgcmV0dXJuO1xuICAgICAgICAgIHZiID0ge1xuICAgICAgICAgICAgeDogeDEsXG4gICAgICAgICAgICB5OiBmbSAqIHgxICsgZmJcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghdmEpIHZhID0ge1xuICAgICAgICAgICAgeDogeDEsXG4gICAgICAgICAgICB5OiBmbSAqIHgxICsgZmJcbiAgICAgICAgICB9OyBlbHNlIGlmICh2YS54IDwgeDApIHJldHVybjtcbiAgICAgICAgICB2YiA9IHtcbiAgICAgICAgICAgIHg6IHgwLFxuICAgICAgICAgICAgeTogZm0gKiB4MCArIGZiXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlZGdlLmEgPSB2YTtcbiAgICBlZGdlLmIgPSB2YjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lFZGdlKGxTaXRlLCByU2l0ZSkge1xuICAgIHRoaXMubCA9IGxTaXRlO1xuICAgIHRoaXMuciA9IHJTaXRlO1xuICAgIHRoaXMuYSA9IHRoaXMuYiA9IG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pQ3JlYXRlRWRnZShsU2l0ZSwgclNpdGUsIHZhLCB2Yikge1xuICAgIHZhciBlZGdlID0gbmV3IGQzX2dlb21fdm9yb25vaUVkZ2UobFNpdGUsIHJTaXRlKTtcbiAgICBkM19nZW9tX3Zvcm9ub2lFZGdlcy5wdXNoKGVkZ2UpO1xuICAgIGlmICh2YSkgZDNfZ2VvbV92b3Jvbm9pU2V0RWRnZUVuZChlZGdlLCBsU2l0ZSwgclNpdGUsIHZhKTtcbiAgICBpZiAodmIpIGQzX2dlb21fdm9yb25vaVNldEVkZ2VFbmQoZWRnZSwgclNpdGUsIGxTaXRlLCB2Yik7XG4gICAgZDNfZ2VvbV92b3Jvbm9pQ2VsbHNbbFNpdGUuaV0uZWRnZXMucHVzaChuZXcgZDNfZ2VvbV92b3Jvbm9pSGFsZkVkZ2UoZWRnZSwgbFNpdGUsIHJTaXRlKSk7XG4gICAgZDNfZ2VvbV92b3Jvbm9pQ2VsbHNbclNpdGUuaV0uZWRnZXMucHVzaChuZXcgZDNfZ2VvbV92b3Jvbm9pSGFsZkVkZ2UoZWRnZSwgclNpdGUsIGxTaXRlKSk7XG4gICAgcmV0dXJuIGVkZ2U7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pQ3JlYXRlQm9yZGVyRWRnZShsU2l0ZSwgdmEsIHZiKSB7XG4gICAgdmFyIGVkZ2UgPSBuZXcgZDNfZ2VvbV92b3Jvbm9pRWRnZShsU2l0ZSwgbnVsbCk7XG4gICAgZWRnZS5hID0gdmE7XG4gICAgZWRnZS5iID0gdmI7XG4gICAgZDNfZ2VvbV92b3Jvbm9pRWRnZXMucHVzaChlZGdlKTtcbiAgICByZXR1cm4gZWRnZTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lTZXRFZGdlRW5kKGVkZ2UsIGxTaXRlLCByU2l0ZSwgdmVydGV4KSB7XG4gICAgaWYgKCFlZGdlLmEgJiYgIWVkZ2UuYikge1xuICAgICAgZWRnZS5hID0gdmVydGV4O1xuICAgICAgZWRnZS5sID0gbFNpdGU7XG4gICAgICBlZGdlLnIgPSByU2l0ZTtcbiAgICB9IGVsc2UgaWYgKGVkZ2UubCA9PT0gclNpdGUpIHtcbiAgICAgIGVkZ2UuYiA9IHZlcnRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgZWRnZS5hID0gdmVydGV4O1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lIYWxmRWRnZShlZGdlLCBsU2l0ZSwgclNpdGUpIHtcbiAgICB2YXIgdmEgPSBlZGdlLmEsIHZiID0gZWRnZS5iO1xuICAgIHRoaXMuZWRnZSA9IGVkZ2U7XG4gICAgdGhpcy5zaXRlID0gbFNpdGU7XG4gICAgdGhpcy5hbmdsZSA9IHJTaXRlID8gTWF0aC5hdGFuMihyU2l0ZS55IC0gbFNpdGUueSwgclNpdGUueCAtIGxTaXRlLngpIDogZWRnZS5sID09PSBsU2l0ZSA/IE1hdGguYXRhbjIodmIueCAtIHZhLngsIHZhLnkgLSB2Yi55KSA6IE1hdGguYXRhbjIodmEueCAtIHZiLngsIHZiLnkgLSB2YS55KTtcbiAgfVxuICBkM19nZW9tX3Zvcm9ub2lIYWxmRWRnZS5wcm90b3R5cGUgPSB7XG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRnZS5sID09PSB0aGlzLnNpdGUgPyB0aGlzLmVkZ2UuYSA6IHRoaXMuZWRnZS5iO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkZ2UubCA9PT0gdGhpcy5zaXRlID8gdGhpcy5lZGdlLmIgOiB0aGlzLmVkZ2UuYTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrVHJlZSgpIHtcbiAgICB0aGlzLl8gPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrTm9kZShub2RlKSB7XG4gICAgbm9kZS5VID0gbm9kZS5DID0gbm9kZS5MID0gbm9kZS5SID0gbm9kZS5QID0gbm9kZS5OID0gbnVsbDtcbiAgfVxuICBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja1RyZWUucHJvdG90eXBlID0ge1xuICAgIGluc2VydDogZnVuY3Rpb24oYWZ0ZXIsIG5vZGUpIHtcbiAgICAgIHZhciBwYXJlbnQsIGdyYW5kcGEsIHVuY2xlO1xuICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgIG5vZGUuUCA9IGFmdGVyO1xuICAgICAgICBub2RlLk4gPSBhZnRlci5OO1xuICAgICAgICBpZiAoYWZ0ZXIuTikgYWZ0ZXIuTi5QID0gbm9kZTtcbiAgICAgICAgYWZ0ZXIuTiA9IG5vZGU7XG4gICAgICAgIGlmIChhZnRlci5SKSB7XG4gICAgICAgICAgYWZ0ZXIgPSBhZnRlci5SO1xuICAgICAgICAgIHdoaWxlIChhZnRlci5MKSBhZnRlciA9IGFmdGVyLkw7XG4gICAgICAgICAgYWZ0ZXIuTCA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWZ0ZXIuUiA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gYWZ0ZXI7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuXykge1xuICAgICAgICBhZnRlciA9IGQzX2dlb21fdm9yb25vaVJlZEJsYWNrRmlyc3QodGhpcy5fKTtcbiAgICAgICAgbm9kZS5QID0gbnVsbDtcbiAgICAgICAgbm9kZS5OID0gYWZ0ZXI7XG4gICAgICAgIGFmdGVyLlAgPSBhZnRlci5MID0gbm9kZTtcbiAgICAgICAgcGFyZW50ID0gYWZ0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLlAgPSBub2RlLk4gPSBudWxsO1xuICAgICAgICB0aGlzLl8gPSBub2RlO1xuICAgICAgICBwYXJlbnQgPSBudWxsO1xuICAgICAgfVxuICAgICAgbm9kZS5MID0gbm9kZS5SID0gbnVsbDtcbiAgICAgIG5vZGUuVSA9IHBhcmVudDtcbiAgICAgIG5vZGUuQyA9IHRydWU7XG4gICAgICBhZnRlciA9IG5vZGU7XG4gICAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudC5DKSB7XG4gICAgICAgIGdyYW5kcGEgPSBwYXJlbnQuVTtcbiAgICAgICAgaWYgKHBhcmVudCA9PT0gZ3JhbmRwYS5MKSB7XG4gICAgICAgICAgdW5jbGUgPSBncmFuZHBhLlI7XG4gICAgICAgICAgaWYgKHVuY2xlICYmIHVuY2xlLkMpIHtcbiAgICAgICAgICAgIHBhcmVudC5DID0gdW5jbGUuQyA9IGZhbHNlO1xuICAgICAgICAgICAgZ3JhbmRwYS5DID0gdHJ1ZTtcbiAgICAgICAgICAgIGFmdGVyID0gZ3JhbmRwYTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGFmdGVyID09PSBwYXJlbnQuUikge1xuICAgICAgICAgICAgICBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja1JvdGF0ZUxlZnQodGhpcywgcGFyZW50KTtcbiAgICAgICAgICAgICAgYWZ0ZXIgPSBwYXJlbnQ7XG4gICAgICAgICAgICAgIHBhcmVudCA9IGFmdGVyLlU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuQyA9IGZhbHNlO1xuICAgICAgICAgICAgZ3JhbmRwYS5DID0gdHJ1ZTtcbiAgICAgICAgICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrUm90YXRlUmlnaHQodGhpcywgZ3JhbmRwYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVuY2xlID0gZ3JhbmRwYS5MO1xuICAgICAgICAgIGlmICh1bmNsZSAmJiB1bmNsZS5DKSB7XG4gICAgICAgICAgICBwYXJlbnQuQyA9IHVuY2xlLkMgPSBmYWxzZTtcbiAgICAgICAgICAgIGdyYW5kcGEuQyA9IHRydWU7XG4gICAgICAgICAgICBhZnRlciA9IGdyYW5kcGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhZnRlciA9PT0gcGFyZW50LkwpIHtcbiAgICAgICAgICAgICAgZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tSb3RhdGVSaWdodCh0aGlzLCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZnRlciA9IHBhcmVudDtcbiAgICAgICAgICAgICAgcGFyZW50ID0gYWZ0ZXIuVTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5DID0gZmFsc2U7XG4gICAgICAgICAgICBncmFuZHBhLkMgPSB0cnVlO1xuICAgICAgICAgICAgZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tSb3RhdGVMZWZ0KHRoaXMsIGdyYW5kcGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQgPSBhZnRlci5VO1xuICAgICAgfVxuICAgICAgdGhpcy5fLkMgPSBmYWxzZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuTikgbm9kZS5OLlAgPSBub2RlLlA7XG4gICAgICBpZiAobm9kZS5QKSBub2RlLlAuTiA9IG5vZGUuTjtcbiAgICAgIG5vZGUuTiA9IG5vZGUuUCA9IG51bGw7XG4gICAgICB2YXIgcGFyZW50ID0gbm9kZS5VLCBzaWJsaW5nLCBsZWZ0ID0gbm9kZS5MLCByaWdodCA9IG5vZGUuUiwgbmV4dCwgcmVkO1xuICAgICAgaWYgKCFsZWZ0KSBuZXh0ID0gcmlnaHQ7IGVsc2UgaWYgKCFyaWdodCkgbmV4dCA9IGxlZnQ7IGVsc2UgbmV4dCA9IGQzX2dlb21fdm9yb25vaVJlZEJsYWNrRmlyc3QocmlnaHQpO1xuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LkwgPT09IG5vZGUpIHBhcmVudC5MID0gbmV4dDsgZWxzZSBwYXJlbnQuUiA9IG5leHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl8gPSBuZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGxlZnQgJiYgcmlnaHQpIHtcbiAgICAgICAgcmVkID0gbmV4dC5DO1xuICAgICAgICBuZXh0LkMgPSBub2RlLkM7XG4gICAgICAgIG5leHQuTCA9IGxlZnQ7XG4gICAgICAgIGxlZnQuVSA9IG5leHQ7XG4gICAgICAgIGlmIChuZXh0ICE9PSByaWdodCkge1xuICAgICAgICAgIHBhcmVudCA9IG5leHQuVTtcbiAgICAgICAgICBuZXh0LlUgPSBub2RlLlU7XG4gICAgICAgICAgbm9kZSA9IG5leHQuUjtcbiAgICAgICAgICBwYXJlbnQuTCA9IG5vZGU7XG4gICAgICAgICAgbmV4dC5SID0gcmlnaHQ7XG4gICAgICAgICAgcmlnaHQuVSA9IG5leHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dC5VID0gcGFyZW50O1xuICAgICAgICAgIHBhcmVudCA9IG5leHQ7XG4gICAgICAgICAgbm9kZSA9IG5leHQuUjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkID0gbm9kZS5DO1xuICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlKSBub2RlLlUgPSBwYXJlbnQ7XG4gICAgICBpZiAocmVkKSByZXR1cm47XG4gICAgICBpZiAobm9kZSAmJiBub2RlLkMpIHtcbiAgICAgICAgbm9kZS5DID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuXykgYnJlYWs7XG4gICAgICAgIGlmIChub2RlID09PSBwYXJlbnQuTCkge1xuICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnQuUjtcbiAgICAgICAgICBpZiAoc2libGluZy5DKSB7XG4gICAgICAgICAgICBzaWJsaW5nLkMgPSBmYWxzZTtcbiAgICAgICAgICAgIHBhcmVudC5DID0gdHJ1ZTtcbiAgICAgICAgICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrUm90YXRlTGVmdCh0aGlzLCBwYXJlbnQpO1xuICAgICAgICAgICAgc2libGluZyA9IHBhcmVudC5SO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2libGluZy5MICYmIHNpYmxpbmcuTC5DIHx8IHNpYmxpbmcuUiAmJiBzaWJsaW5nLlIuQykge1xuICAgICAgICAgICAgaWYgKCFzaWJsaW5nLlIgfHwgIXNpYmxpbmcuUi5DKSB7XG4gICAgICAgICAgICAgIHNpYmxpbmcuTC5DID0gZmFsc2U7XG4gICAgICAgICAgICAgIHNpYmxpbmcuQyA9IHRydWU7XG4gICAgICAgICAgICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrUm90YXRlUmlnaHQodGhpcywgc2libGluZyk7XG4gICAgICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnQuUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpYmxpbmcuQyA9IHBhcmVudC5DO1xuICAgICAgICAgICAgcGFyZW50LkMgPSBzaWJsaW5nLlIuQyA9IGZhbHNlO1xuICAgICAgICAgICAgZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tSb3RhdGVMZWZ0KHRoaXMsIHBhcmVudCk7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5fO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnQuTDtcbiAgICAgICAgICBpZiAoc2libGluZy5DKSB7XG4gICAgICAgICAgICBzaWJsaW5nLkMgPSBmYWxzZTtcbiAgICAgICAgICAgIHBhcmVudC5DID0gdHJ1ZTtcbiAgICAgICAgICAgIGQzX2dlb21fdm9yb25vaVJlZEJsYWNrUm90YXRlUmlnaHQodGhpcywgcGFyZW50KTtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnQuTDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNpYmxpbmcuTCAmJiBzaWJsaW5nLkwuQyB8fCBzaWJsaW5nLlIgJiYgc2libGluZy5SLkMpIHtcbiAgICAgICAgICAgIGlmICghc2libGluZy5MIHx8ICFzaWJsaW5nLkwuQykge1xuICAgICAgICAgICAgICBzaWJsaW5nLlIuQyA9IGZhbHNlO1xuICAgICAgICAgICAgICBzaWJsaW5nLkMgPSB0cnVlO1xuICAgICAgICAgICAgICBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja1JvdGF0ZUxlZnQodGhpcywgc2libGluZyk7XG4gICAgICAgICAgICAgIHNpYmxpbmcgPSBwYXJlbnQuTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpYmxpbmcuQyA9IHBhcmVudC5DO1xuICAgICAgICAgICAgcGFyZW50LkMgPSBzaWJsaW5nLkwuQyA9IGZhbHNlO1xuICAgICAgICAgICAgZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tSb3RhdGVSaWdodCh0aGlzLCBwYXJlbnQpO1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMuXztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzaWJsaW5nLkMgPSB0cnVlO1xuICAgICAgICBub2RlID0gcGFyZW50O1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQuVTtcbiAgICAgIH0gd2hpbGUgKCFub2RlLkMpO1xuICAgICAgaWYgKG5vZGUpIG5vZGUuQyA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tSb3RhdGVMZWZ0KHRyZWUsIG5vZGUpIHtcbiAgICB2YXIgcCA9IG5vZGUsIHEgPSBub2RlLlIsIHBhcmVudCA9IHAuVTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LkwgPT09IHApIHBhcmVudC5MID0gcTsgZWxzZSBwYXJlbnQuUiA9IHE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUuXyA9IHE7XG4gICAgfVxuICAgIHEuVSA9IHBhcmVudDtcbiAgICBwLlUgPSBxO1xuICAgIHAuUiA9IHEuTDtcbiAgICBpZiAocC5SKSBwLlIuVSA9IHA7XG4gICAgcS5MID0gcDtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja1JvdGF0ZVJpZ2h0KHRyZWUsIG5vZGUpIHtcbiAgICB2YXIgcCA9IG5vZGUsIHEgPSBub2RlLkwsIHBhcmVudCA9IHAuVTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LkwgPT09IHApIHBhcmVudC5MID0gcTsgZWxzZSBwYXJlbnQuUiA9IHE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUuXyA9IHE7XG4gICAgfVxuICAgIHEuVSA9IHBhcmVudDtcbiAgICBwLlUgPSBxO1xuICAgIHAuTCA9IHEuUjtcbiAgICBpZiAocC5MKSBwLkwuVSA9IHA7XG4gICAgcS5SID0gcDtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lSZWRCbGFja0ZpcnN0KG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5MKSBub2RlID0gbm9kZS5MO1xuICAgIHJldHVybiBub2RlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fdm9yb25vaShzaXRlcywgYmJveCkge1xuICAgIHZhciBzaXRlID0gc2l0ZXMuc29ydChkM19nZW9tX3Zvcm9ub2lWZXJ0ZXhPcmRlcikucG9wKCksIHgwLCB5MCwgY2lyY2xlO1xuICAgIGQzX2dlb21fdm9yb25vaUVkZ2VzID0gW107XG4gICAgZDNfZ2VvbV92b3Jvbm9pQ2VsbHMgPSBuZXcgQXJyYXkoc2l0ZXMubGVuZ3RoKTtcbiAgICBkM19nZW9tX3Zvcm9ub2lCZWFjaGVzID0gbmV3IGQzX2dlb21fdm9yb25vaVJlZEJsYWNrVHJlZSgpO1xuICAgIGQzX2dlb21fdm9yb25vaUNpcmNsZXMgPSBuZXcgZDNfZ2VvbV92b3Jvbm9pUmVkQmxhY2tUcmVlKCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNpcmNsZSA9IGQzX2dlb21fdm9yb25vaUZpcnN0Q2lyY2xlO1xuICAgICAgaWYgKHNpdGUgJiYgKCFjaXJjbGUgfHwgc2l0ZS55IDwgY2lyY2xlLnkgfHwgc2l0ZS55ID09PSBjaXJjbGUueSAmJiBzaXRlLnggPCBjaXJjbGUueCkpIHtcbiAgICAgICAgaWYgKHNpdGUueCAhPT0geDAgfHwgc2l0ZS55ICE9PSB5MCkge1xuICAgICAgICAgIGQzX2dlb21fdm9yb25vaUNlbGxzW3NpdGUuaV0gPSBuZXcgZDNfZ2VvbV92b3Jvbm9pQ2VsbChzaXRlKTtcbiAgICAgICAgICBkM19nZW9tX3Zvcm9ub2lBZGRCZWFjaChzaXRlKTtcbiAgICAgICAgICB4MCA9IHNpdGUueCwgeTAgPSBzaXRlLnk7XG4gICAgICAgIH1cbiAgICAgICAgc2l0ZSA9IHNpdGVzLnBvcCgpO1xuICAgICAgfSBlbHNlIGlmIChjaXJjbGUpIHtcbiAgICAgICAgZDNfZ2VvbV92b3Jvbm9pUmVtb3ZlQmVhY2goY2lyY2xlLmFyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJib3gpIGQzX2dlb21fdm9yb25vaUNsaXBFZGdlcyhiYm94KSwgZDNfZ2VvbV92b3Jvbm9pQ2xvc2VDZWxscyhiYm94KTtcbiAgICB2YXIgZGlhZ3JhbSA9IHtcbiAgICAgIGNlbGxzOiBkM19nZW9tX3Zvcm9ub2lDZWxscyxcbiAgICAgIGVkZ2VzOiBkM19nZW9tX3Zvcm9ub2lFZGdlc1xuICAgIH07XG4gICAgZDNfZ2VvbV92b3Jvbm9pQmVhY2hlcyA9IGQzX2dlb21fdm9yb25vaUNpcmNsZXMgPSBkM19nZW9tX3Zvcm9ub2lFZGdlcyA9IGQzX2dlb21fdm9yb25vaUNlbGxzID0gbnVsbDtcbiAgICByZXR1cm4gZGlhZ3JhbTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3Zvcm9ub2lWZXJ0ZXhPcmRlcihhLCBiKSB7XG4gICAgcmV0dXJuIGIueSAtIGEueSB8fCBiLnggLSBhLng7XG4gIH1cbiAgZDMuZ2VvbS52b3Jvbm9pID0gZnVuY3Rpb24ocG9pbnRzKSB7XG4gICAgdmFyIHggPSBkM19nZW9tX3BvaW50WCwgeSA9IGQzX2dlb21fcG9pbnRZLCBmeCA9IHgsIGZ5ID0geSwgY2xpcEV4dGVudCA9IGQzX2dlb21fdm9yb25vaUNsaXBFeHRlbnQ7XG4gICAgaWYgKHBvaW50cykgcmV0dXJuIHZvcm9ub2kocG9pbnRzKTtcbiAgICBmdW5jdGlvbiB2b3Jvbm9pKGRhdGEpIHtcbiAgICAgIHZhciBwb2x5Z29ucyA9IG5ldyBBcnJheShkYXRhLmxlbmd0aCksIHgwID0gY2xpcEV4dGVudFswXVswXSwgeTAgPSBjbGlwRXh0ZW50WzBdWzFdLCB4MSA9IGNsaXBFeHRlbnRbMV1bMF0sIHkxID0gY2xpcEV4dGVudFsxXVsxXTtcbiAgICAgIGQzX2dlb21fdm9yb25vaShzaXRlcyhkYXRhKSwgY2xpcEV4dGVudCkuY2VsbHMuZm9yRWFjaChmdW5jdGlvbihjZWxsLCBpKSB7XG4gICAgICAgIHZhciBlZGdlcyA9IGNlbGwuZWRnZXMsIHNpdGUgPSBjZWxsLnNpdGUsIHBvbHlnb24gPSBwb2x5Z29uc1tpXSA9IGVkZ2VzLmxlbmd0aCA/IGVkZ2VzLm1hcChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIHMgPSBlLnN0YXJ0KCk7XG4gICAgICAgICAgcmV0dXJuIFsgcy54LCBzLnkgXTtcbiAgICAgICAgfSkgOiBzaXRlLnggPj0geDAgJiYgc2l0ZS54IDw9IHgxICYmIHNpdGUueSA+PSB5MCAmJiBzaXRlLnkgPD0geTEgPyBbIFsgeDAsIHkxIF0sIFsgeDEsIHkxIF0sIFsgeDEsIHkwIF0sIFsgeDAsIHkwIF0gXSA6IFtdO1xuICAgICAgICBwb2x5Z29uLnBvaW50ID0gZGF0YVtpXTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBvbHlnb25zO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaXRlcyhkYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IE1hdGgucm91bmQoZngoZCwgaSkgLyDOtSkgKiDOtSxcbiAgICAgICAgICB5OiBNYXRoLnJvdW5kKGZ5KGQsIGkpIC8gzrUpICogzrUsXG4gICAgICAgICAgaTogaVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZvcm9ub2kubGlua3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gZDNfZ2VvbV92b3Jvbm9pKHNpdGVzKGRhdGEpKS5lZGdlcy5maWx0ZXIoZnVuY3Rpb24oZWRnZSkge1xuICAgICAgICByZXR1cm4gZWRnZS5sICYmIGVkZ2UucjtcbiAgICAgIH0pLm1hcChmdW5jdGlvbihlZGdlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc291cmNlOiBkYXRhW2VkZ2UubC5pXSxcbiAgICAgICAgICB0YXJnZXQ6IGRhdGFbZWRnZS5yLmldXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZvcm9ub2kudHJpYW5nbGVzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIHRyaWFuZ2xlcyA9IFtdO1xuICAgICAgZDNfZ2VvbV92b3Jvbm9pKHNpdGVzKGRhdGEpKS5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIGkpIHtcbiAgICAgICAgdmFyIHNpdGUgPSBjZWxsLnNpdGUsIGVkZ2VzID0gY2VsbC5lZGdlcy5zb3J0KGQzX2dlb21fdm9yb25vaUhhbGZFZGdlT3JkZXIpLCBqID0gLTEsIG0gPSBlZGdlcy5sZW5ndGgsIGUwLCBzMCwgZTEgPSBlZGdlc1ttIC0gMV0uZWRnZSwgczEgPSBlMS5sID09PSBzaXRlID8gZTEuciA6IGUxLmw7XG4gICAgICAgIHdoaWxlICgrK2ogPCBtKSB7XG4gICAgICAgICAgZTAgPSBlMTtcbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIGUxID0gZWRnZXNbal0uZWRnZTtcbiAgICAgICAgICBzMSA9IGUxLmwgPT09IHNpdGUgPyBlMS5yIDogZTEubDtcbiAgICAgICAgICBpZiAoaSA8IHMwLmkgJiYgaSA8IHMxLmkgJiYgZDNfZ2VvbV92b3Jvbm9pVHJpYW5nbGVBcmVhKHNpdGUsIHMwLCBzMSkgPCAwKSB7XG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChbIGRhdGFbaV0sIGRhdGFbczAuaV0sIGRhdGFbczEuaV0gXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cmlhbmdsZXM7XG4gICAgfTtcbiAgICB2b3Jvbm9pLnggPSBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmeCA9IGQzX2Z1bmN0b3IoeCA9IF8pLCB2b3Jvbm9pKSA6IHg7XG4gICAgfTtcbiAgICB2b3Jvbm9pLnkgPSBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmeSA9IGQzX2Z1bmN0b3IoeSA9IF8pLCB2b3Jvbm9pKSA6IHk7XG4gICAgfTtcbiAgICB2b3Jvbm9pLmNsaXBFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGlwRXh0ZW50ID09PSBkM19nZW9tX3Zvcm9ub2lDbGlwRXh0ZW50ID8gbnVsbCA6IGNsaXBFeHRlbnQ7XG4gICAgICBjbGlwRXh0ZW50ID0gXyA9PSBudWxsID8gZDNfZ2VvbV92b3Jvbm9pQ2xpcEV4dGVudCA6IF87XG4gICAgICByZXR1cm4gdm9yb25vaTtcbiAgICB9O1xuICAgIHZvcm9ub2kuc2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsaXBFeHRlbnQgPT09IGQzX2dlb21fdm9yb25vaUNsaXBFeHRlbnQgPyBudWxsIDogY2xpcEV4dGVudCAmJiBjbGlwRXh0ZW50WzFdO1xuICAgICAgcmV0dXJuIHZvcm9ub2kuY2xpcEV4dGVudChfICYmIFsgWyAwLCAwIF0sIF8gXSk7XG4gICAgfTtcbiAgICByZXR1cm4gdm9yb25vaTtcbiAgfTtcbiAgdmFyIGQzX2dlb21fdm9yb25vaUNsaXBFeHRlbnQgPSBbIFsgLTFlNiwgLTFlNiBdLCBbIDFlNiwgMWU2IF0gXTtcbiAgZnVuY3Rpb24gZDNfZ2VvbV92b3Jvbm9pVHJpYW5nbGVBcmVhKGEsIGIsIGMpIHtcbiAgICByZXR1cm4gKGEueCAtIGMueCkgKiAoYi55IC0gYS55KSAtIChhLnggLSBiLngpICogKGMueSAtIGEueSk7XG4gIH1cbiAgZDMuZ2VvbS5kZWxhdW5heSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gICAgcmV0dXJuIGQzLmdlb20udm9yb25vaSgpLnRyaWFuZ2xlcyh2ZXJ0aWNlcyk7XG4gIH07XG4gIGQzLmdlb20ucXVhZHRyZWUgPSBmdW5jdGlvbihwb2ludHMsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIHggPSBkM19nZW9tX3BvaW50WCwgeSA9IGQzX2dlb21fcG9pbnRZLCBjb21wYXQ7XG4gICAgaWYgKGNvbXBhdCA9IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHggPSBkM19nZW9tX3F1YWR0cmVlQ29tcGF0WDtcbiAgICAgIHkgPSBkM19nZW9tX3F1YWR0cmVlQ29tcGF0WTtcbiAgICAgIGlmIChjb21wYXQgPT09IDMpIHtcbiAgICAgICAgeTIgPSB5MTtcbiAgICAgICAgeDIgPSB4MTtcbiAgICAgICAgeTEgPSB4MSA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVhZHRyZWUocG9pbnRzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVhZHRyZWUoZGF0YSkge1xuICAgICAgdmFyIGQsIGZ4ID0gZDNfZnVuY3Rvcih4KSwgZnkgPSBkM19mdW5jdG9yKHkpLCB4cywgeXMsIGksIG4sIHgxXywgeTFfLCB4Ml8sIHkyXztcbiAgICAgIGlmICh4MSAhPSBudWxsKSB7XG4gICAgICAgIHgxXyA9IHgxLCB5MV8gPSB5MSwgeDJfID0geDIsIHkyXyA9IHkyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeDJfID0geTJfID0gLSh4MV8gPSB5MV8gPSBJbmZpbml0eSk7XG4gICAgICAgIHhzID0gW10sIHlzID0gW107XG4gICAgICAgIG4gPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgaWYgKGNvbXBhdCkgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICAgIGQgPSBkYXRhW2ldO1xuICAgICAgICAgIGlmIChkLnggPCB4MV8pIHgxXyA9IGQueDtcbiAgICAgICAgICBpZiAoZC55IDwgeTFfKSB5MV8gPSBkLnk7XG4gICAgICAgICAgaWYgKGQueCA+IHgyXykgeDJfID0gZC54O1xuICAgICAgICAgIGlmIChkLnkgPiB5Ml8pIHkyXyA9IGQueTtcbiAgICAgICAgICB4cy5wdXNoKGQueCk7XG4gICAgICAgICAgeXMucHVzaChkLnkpO1xuICAgICAgICB9IGVsc2UgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICAgIHZhciB4XyA9ICtmeChkID0gZGF0YVtpXSwgaSksIHlfID0gK2Z5KGQsIGkpO1xuICAgICAgICAgIGlmICh4XyA8IHgxXykgeDFfID0geF87XG4gICAgICAgICAgaWYgKHlfIDwgeTFfKSB5MV8gPSB5XztcbiAgICAgICAgICBpZiAoeF8gPiB4Ml8pIHgyXyA9IHhfO1xuICAgICAgICAgIGlmICh5XyA+IHkyXykgeTJfID0geV87XG4gICAgICAgICAgeHMucHVzaCh4Xyk7XG4gICAgICAgICAgeXMucHVzaCh5Xyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBkeCA9IHgyXyAtIHgxXywgZHkgPSB5Ml8gLSB5MV87XG4gICAgICBpZiAoZHggPiBkeSkgeTJfID0geTFfICsgZHg7IGVsc2UgeDJfID0geDFfICsgZHk7XG4gICAgICBmdW5jdGlvbiBpbnNlcnQobiwgZCwgeCwgeSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgaWYgKGlzTmFOKHgpIHx8IGlzTmFOKHkpKSByZXR1cm47XG4gICAgICAgIGlmIChuLmxlYWYpIHtcbiAgICAgICAgICB2YXIgbnggPSBuLngsIG55ID0gbi55O1xuICAgICAgICAgIGlmIChueCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoYWJzKG54IC0geCkgKyBhYnMobnkgLSB5KSA8IC4wMSkge1xuICAgICAgICAgICAgICBpbnNlcnRDaGlsZChuLCBkLCB4LCB5LCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgblBvaW50ID0gbi5wb2ludDtcbiAgICAgICAgICAgICAgbi54ID0gbi55ID0gbi5wb2ludCA9IG51bGw7XG4gICAgICAgICAgICAgIGluc2VydENoaWxkKG4sIG5Qb2ludCwgbngsIG55LCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgICAgICAgICAgIGluc2VydENoaWxkKG4sIGQsIHgsIHksIHgxLCB5MSwgeDIsIHkyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbi54ID0geCwgbi55ID0geSwgbi5wb2ludCA9IGQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluc2VydENoaWxkKG4sIGQsIHgsIHksIHgxLCB5MSwgeDIsIHkyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gaW5zZXJ0Q2hpbGQobiwgZCwgeCwgeSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgdmFyIHhtID0gKHgxICsgeDIpICogLjUsIHltID0gKHkxICsgeTIpICogLjUsIHJpZ2h0ID0geCA+PSB4bSwgYmVsb3cgPSB5ID49IHltLCBpID0gYmVsb3cgPDwgMSB8IHJpZ2h0O1xuICAgICAgICBuLmxlYWYgPSBmYWxzZTtcbiAgICAgICAgbiA9IG4ubm9kZXNbaV0gfHwgKG4ubm9kZXNbaV0gPSBkM19nZW9tX3F1YWR0cmVlTm9kZSgpKTtcbiAgICAgICAgaWYgKHJpZ2h0KSB4MSA9IHhtOyBlbHNlIHgyID0geG07XG4gICAgICAgIGlmIChiZWxvdykgeTEgPSB5bTsgZWxzZSB5MiA9IHltO1xuICAgICAgICBpbnNlcnQobiwgZCwgeCwgeSwgeDEsIHkxLCB4MiwgeTIpO1xuICAgICAgfVxuICAgICAgdmFyIHJvb3QgPSBkM19nZW9tX3F1YWR0cmVlTm9kZSgpO1xuICAgICAgcm9vdC5hZGQgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgIGluc2VydChyb290LCBkLCArZngoZCwgKytpKSwgK2Z5KGQsIGkpLCB4MV8sIHkxXywgeDJfLCB5Ml8pO1xuICAgICAgfTtcbiAgICAgIHJvb3QudmlzaXQgPSBmdW5jdGlvbihmKSB7XG4gICAgICAgIGQzX2dlb21fcXVhZHRyZWVWaXNpdChmLCByb290LCB4MV8sIHkxXywgeDJfLCB5Ml8pO1xuICAgICAgfTtcbiAgICAgIHJvb3QuZmluZCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICAgIHJldHVybiBkM19nZW9tX3F1YWR0cmVlRmluZChyb290LCBwb2ludFswXSwgcG9pbnRbMV0sIHgxXywgeTFfLCB4Ml8sIHkyXyk7XG4gICAgICB9O1xuICAgICAgaSA9IC0xO1xuICAgICAgaWYgKHgxID09IG51bGwpIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpbnNlcnQocm9vdCwgZGF0YVtpXSwgeHNbaV0sIHlzW2ldLCB4MV8sIHkxXywgeDJfLCB5Ml8pO1xuICAgICAgICB9XG4gICAgICAgIC0taTtcbiAgICAgIH0gZWxzZSBkYXRhLmZvckVhY2gocm9vdC5hZGQpO1xuICAgICAgeHMgPSB5cyA9IGRhdGEgPSBkID0gbnVsbDtcbiAgICAgIHJldHVybiByb290O1xuICAgIH1cbiAgICBxdWFkdHJlZS54ID0gZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeCA9IF8sIHF1YWR0cmVlKSA6IHg7XG4gICAgfTtcbiAgICBxdWFkdHJlZS55ID0gZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHF1YWR0cmVlKSA6IHk7XG4gICAgfTtcbiAgICBxdWFkdHJlZS5leHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB4MSA9PSBudWxsID8gbnVsbCA6IFsgWyB4MSwgeTEgXSwgWyB4MiwgeTIgXSBdO1xuICAgICAgaWYgKF8gPT0gbnVsbCkgeDEgPSB5MSA9IHgyID0geTIgPSBudWxsOyBlbHNlIHgxID0gK19bMF1bMF0sIHkxID0gK19bMF1bMV0sIHgyID0gK19bMV1bMF0sIFxuICAgICAgeTIgPSArX1sxXVsxXTtcbiAgICAgIHJldHVybiBxdWFkdHJlZTtcbiAgICB9O1xuICAgIHF1YWR0cmVlLnNpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB4MSA9PSBudWxsID8gbnVsbCA6IFsgeDIgLSB4MSwgeTIgLSB5MSBdO1xuICAgICAgaWYgKF8gPT0gbnVsbCkgeDEgPSB5MSA9IHgyID0geTIgPSBudWxsOyBlbHNlIHgxID0geTEgPSAwLCB4MiA9ICtfWzBdLCB5MiA9ICtfWzFdO1xuICAgICAgcmV0dXJuIHF1YWR0cmVlO1xuICAgIH07XG4gICAgcmV0dXJuIHF1YWR0cmVlO1xuICB9O1xuICBmdW5jdGlvbiBkM19nZW9tX3F1YWR0cmVlQ29tcGF0WChkKSB7XG4gICAgcmV0dXJuIGQueDtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3F1YWR0cmVlQ29tcGF0WShkKSB7XG4gICAgcmV0dXJuIGQueTtcbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3F1YWR0cmVlTm9kZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVhZjogdHJ1ZSxcbiAgICAgIG5vZGVzOiBbXSxcbiAgICAgIHBvaW50OiBudWxsLFxuICAgICAgeDogbnVsbCxcbiAgICAgIHk6IG51bGxcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2dlb21fcXVhZHRyZWVWaXNpdChmLCBub2RlLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGlmICghZihub2RlLCB4MSwgeTEsIHgyLCB5MikpIHtcbiAgICAgIHZhciBzeCA9ICh4MSArIHgyKSAqIC41LCBzeSA9ICh5MSArIHkyKSAqIC41LCBjaGlsZHJlbiA9IG5vZGUubm9kZXM7XG4gICAgICBpZiAoY2hpbGRyZW5bMF0pIGQzX2dlb21fcXVhZHRyZWVWaXNpdChmLCBjaGlsZHJlblswXSwgeDEsIHkxLCBzeCwgc3kpO1xuICAgICAgaWYgKGNoaWxkcmVuWzFdKSBkM19nZW9tX3F1YWR0cmVlVmlzaXQoZiwgY2hpbGRyZW5bMV0sIHN4LCB5MSwgeDIsIHN5KTtcbiAgICAgIGlmIChjaGlsZHJlblsyXSkgZDNfZ2VvbV9xdWFkdHJlZVZpc2l0KGYsIGNoaWxkcmVuWzJdLCB4MSwgc3ksIHN4LCB5Mik7XG4gICAgICBpZiAoY2hpbGRyZW5bM10pIGQzX2dlb21fcXVhZHRyZWVWaXNpdChmLCBjaGlsZHJlblszXSwgc3gsIHN5LCB4MiwgeTIpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19nZW9tX3F1YWR0cmVlRmluZChyb290LCB4LCB5LCB4MCwgeTAsIHgzLCB5Mykge1xuICAgIHZhciBtaW5EaXN0YW5jZTIgPSBJbmZpbml0eSwgY2xvc2VzdFBvaW50O1xuICAgIChmdW5jdGlvbiBmaW5kKG5vZGUsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICBpZiAoeDEgPiB4MyB8fCB5MSA+IHkzIHx8IHgyIDwgeDAgfHwgeTIgPCB5MCkgcmV0dXJuO1xuICAgICAgaWYgKHBvaW50ID0gbm9kZS5wb2ludCkge1xuICAgICAgICB2YXIgcG9pbnQsIGR4ID0geCAtIG5vZGUueCwgZHkgPSB5IC0gbm9kZS55LCBkaXN0YW5jZTIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgaWYgKGRpc3RhbmNlMiA8IG1pbkRpc3RhbmNlMikge1xuICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChtaW5EaXN0YW5jZTIgPSBkaXN0YW5jZTIpO1xuICAgICAgICAgIHgwID0geCAtIGRpc3RhbmNlLCB5MCA9IHkgLSBkaXN0YW5jZTtcbiAgICAgICAgICB4MyA9IHggKyBkaXN0YW5jZSwgeTMgPSB5ICsgZGlzdGFuY2U7XG4gICAgICAgICAgY2xvc2VzdFBvaW50ID0gcG9pbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUubm9kZXMsIHhtID0gKHgxICsgeDIpICogLjUsIHltID0gKHkxICsgeTIpICogLjUsIHJpZ2h0ID0geCA+PSB4bSwgYmVsb3cgPSB5ID49IHltO1xuICAgICAgZm9yICh2YXIgaSA9IGJlbG93IDw8IDEgfCByaWdodCwgaiA9IGkgKyA0OyBpIDwgajsgKytpKSB7XG4gICAgICAgIGlmIChub2RlID0gY2hpbGRyZW5baSAmIDNdKSBzd2l0Y2ggKGkgJiAzKSB7XG4gICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgZmluZChub2RlLCB4MSwgeTEsIHhtLCB5bSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBmaW5kKG5vZGUsIHhtLCB5MSwgeDIsIHltKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIGZpbmQobm9kZSwgeDEsIHltLCB4bSwgeTIpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgZmluZChub2RlLCB4bSwgeW0sIHgyLCB5Mik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KShyb290LCB4MCwgeTAsIHgzLCB5Myk7XG4gICAgcmV0dXJuIGNsb3Nlc3RQb2ludDtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZVJnYiA9IGQzX2ludGVycG9sYXRlUmdiO1xuICBmdW5jdGlvbiBkM19pbnRlcnBvbGF0ZVJnYihhLCBiKSB7XG4gICAgYSA9IGQzLnJnYihhKTtcbiAgICBiID0gZDMucmdiKGIpO1xuICAgIHZhciBhciA9IGEuciwgYWcgPSBhLmcsIGFiID0gYS5iLCBiciA9IGIuciAtIGFyLCBiZyA9IGIuZyAtIGFnLCBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gXCIjXCIgKyBkM19yZ2JfaGV4KE1hdGgucm91bmQoYXIgKyBiciAqIHQpKSArIGQzX3JnYl9oZXgoTWF0aC5yb3VuZChhZyArIGJnICogdCkpICsgZDNfcmdiX2hleChNYXRoLnJvdW5kKGFiICsgYmIgKiB0KSk7XG4gICAgfTtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZU9iamVjdCA9IGQzX2ludGVycG9sYXRlT2JqZWN0O1xuICBmdW5jdGlvbiBkM19pbnRlcnBvbGF0ZU9iamVjdChhLCBiKSB7XG4gICAgdmFyIGkgPSB7fSwgYyA9IHt9LCBrO1xuICAgIGZvciAoayBpbiBhKSB7XG4gICAgICBpZiAoayBpbiBiKSB7XG4gICAgICAgIGlba10gPSBkM19pbnRlcnBvbGF0ZShhW2tdLCBiW2tdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNba10gPSBhW2tdO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGsgaW4gYikge1xuICAgICAgaWYgKCEoayBpbiBhKSkge1xuICAgICAgICBjW2tdID0gYltrXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGZvciAoayBpbiBpKSBjW2tdID0gaVtrXSh0KTtcbiAgICAgIHJldHVybiBjO1xuICAgIH07XG4gIH1cbiAgZDMuaW50ZXJwb2xhdGVOdW1iZXIgPSBkM19pbnRlcnBvbGF0ZU51bWJlcjtcbiAgZnVuY3Rpb24gZDNfaW50ZXJwb2xhdGVOdW1iZXIoYSwgYikge1xuICAgIGEgPSArYSwgYiA9ICtiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gYSAqICgxIC0gdCkgKyBiICogdDtcbiAgICB9O1xuICB9XG4gIGQzLmludGVycG9sYXRlU3RyaW5nID0gZDNfaW50ZXJwb2xhdGVTdHJpbmc7XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlU3RyaW5nKGEsIGIpIHtcbiAgICB2YXIgYmkgPSBkM19pbnRlcnBvbGF0ZV9udW1iZXJBLmxhc3RJbmRleCA9IGQzX2ludGVycG9sYXRlX251bWJlckIubGFzdEluZGV4ID0gMCwgYW0sIGJtLCBicywgaSA9IC0xLCBzID0gW10sIHEgPSBbXTtcbiAgICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcbiAgICB3aGlsZSAoKGFtID0gZDNfaW50ZXJwb2xhdGVfbnVtYmVyQS5leGVjKGEpKSAmJiAoYm0gPSBkM19pbnRlcnBvbGF0ZV9udW1iZXJCLmV4ZWMoYikpKSB7XG4gICAgICBpZiAoKGJzID0gYm0uaW5kZXgpID4gYmkpIHtcbiAgICAgICAgYnMgPSBiLnNsaWNlKGJpLCBicyk7XG4gICAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyBlbHNlIHNbKytpXSA9IGJzO1xuICAgICAgfVxuICAgICAgaWYgKChhbSA9IGFtWzBdKSA9PT0gKGJtID0gYm1bMF0pKSB7XG4gICAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyBlbHNlIHNbKytpXSA9IGJtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgICAgcS5wdXNoKHtcbiAgICAgICAgICBpOiBpLFxuICAgICAgICAgIHg6IGQzX2ludGVycG9sYXRlTnVtYmVyKGFtLCBibSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBiaSA9IGQzX2ludGVycG9sYXRlX251bWJlckIubGFzdEluZGV4O1xuICAgIH1cbiAgICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgICAgYnMgPSBiLnNsaWNlKGJpKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyBlbHNlIHNbKytpXSA9IGJzO1xuICAgIH1cbiAgICByZXR1cm4gcy5sZW5ndGggPCAyID8gcVswXSA/IChiID0gcVswXS54LCBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gYih0KSArIFwiXCI7XG4gICAgfSkgOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBiO1xuICAgIH0gOiAoYiA9IHEubGVuZ3RoLCBmdW5jdGlvbih0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbzsgaSA8IGI7ICsraSkgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgZDNfaW50ZXJwb2xhdGVfbnVtYmVyQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZywgZDNfaW50ZXJwb2xhdGVfbnVtYmVyQiA9IG5ldyBSZWdFeHAoZDNfaW50ZXJwb2xhdGVfbnVtYmVyQS5zb3VyY2UsIFwiZ1wiKTtcbiAgZDMuaW50ZXJwb2xhdGUgPSBkM19pbnRlcnBvbGF0ZTtcbiAgZnVuY3Rpb24gZDNfaW50ZXJwb2xhdGUoYSwgYikge1xuICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdG9ycy5sZW5ndGgsIGY7XG4gICAgd2hpbGUgKC0taSA+PSAwICYmICEoZiA9IGQzLmludGVycG9sYXRvcnNbaV0oYSwgYikpKSA7XG4gICAgcmV0dXJuIGY7XG4gIH1cbiAgZDMuaW50ZXJwb2xhdG9ycyA9IFsgZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciB0ID0gdHlwZW9mIGI7XG4gICAgcmV0dXJuICh0ID09PSBcInN0cmluZ1wiID8gZDNfcmdiX25hbWVzLmhhcyhiLnRvTG93ZXJDYXNlKCkpIHx8IC9eKCN8cmdiXFwofGhzbFxcKCkvaS50ZXN0KGIpID8gZDNfaW50ZXJwb2xhdGVSZ2IgOiBkM19pbnRlcnBvbGF0ZVN0cmluZyA6IGIgaW5zdGFuY2VvZiBkM19jb2xvciA/IGQzX2ludGVycG9sYXRlUmdiIDogQXJyYXkuaXNBcnJheShiKSA/IGQzX2ludGVycG9sYXRlQXJyYXkgOiB0ID09PSBcIm9iamVjdFwiICYmIGlzTmFOKGIpID8gZDNfaW50ZXJwb2xhdGVPYmplY3QgOiBkM19pbnRlcnBvbGF0ZU51bWJlcikoYSwgYik7XG4gIH0gXTtcbiAgZDMuaW50ZXJwb2xhdGVBcnJheSA9IGQzX2ludGVycG9sYXRlQXJyYXk7XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlQXJyYXkoYSwgYikge1xuICAgIHZhciB4ID0gW10sIGMgPSBbXSwgbmEgPSBhLmxlbmd0aCwgbmIgPSBiLmxlbmd0aCwgbjAgPSBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpLCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuMDsgKytpKSB4LnB1c2goZDNfaW50ZXJwb2xhdGUoYVtpXSwgYltpXSkpO1xuICAgIGZvciAoO2kgPCBuYTsgKytpKSBjW2ldID0gYVtpXTtcbiAgICBmb3IgKDtpIDwgbmI7ICsraSkgY1tpXSA9IGJbaV07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuMDsgKytpKSBjW2ldID0geFtpXSh0KTtcbiAgICAgIHJldHVybiBjO1xuICAgIH07XG4gIH1cbiAgdmFyIGQzX2Vhc2VfZGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19pZGVudGl0eTtcbiAgfTtcbiAgdmFyIGQzX2Vhc2UgPSBkMy5tYXAoe1xuICAgIGxpbmVhcjogZDNfZWFzZV9kZWZhdWx0LFxuICAgIHBvbHk6IGQzX2Vhc2VfcG9seSxcbiAgICBxdWFkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19lYXNlX3F1YWQ7XG4gICAgfSxcbiAgICBjdWJpYzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfZWFzZV9jdWJpYztcbiAgICB9LFxuICAgIHNpbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfZWFzZV9zaW47XG4gICAgfSxcbiAgICBleHA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGQzX2Vhc2VfZXhwO1xuICAgIH0sXG4gICAgY2lyY2xlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19lYXNlX2NpcmNsZTtcbiAgICB9LFxuICAgIGVsYXN0aWM6IGQzX2Vhc2VfZWxhc3RpYyxcbiAgICBiYWNrOiBkM19lYXNlX2JhY2ssXG4gICAgYm91bmNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19lYXNlX2JvdW5jZTtcbiAgICB9XG4gIH0pO1xuICB2YXIgZDNfZWFzZV9tb2RlID0gZDMubWFwKHtcbiAgICBcImluXCI6IGQzX2lkZW50aXR5LFxuICAgIG91dDogZDNfZWFzZV9yZXZlcnNlLFxuICAgIFwiaW4tb3V0XCI6IGQzX2Vhc2VfcmVmbGVjdCxcbiAgICBcIm91dC1pblwiOiBmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZDNfZWFzZV9yZWZsZWN0KGQzX2Vhc2VfcmV2ZXJzZShmKSk7XG4gICAgfVxuICB9KTtcbiAgZDMuZWFzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IG5hbWUuaW5kZXhPZihcIi1cIiksIHQgPSBpID49IDAgPyBuYW1lLnNsaWNlKDAsIGkpIDogbmFtZSwgbSA9IGkgPj0gMCA/IG5hbWUuc2xpY2UoaSArIDEpIDogXCJpblwiO1xuICAgIHQgPSBkM19lYXNlLmdldCh0KSB8fCBkM19lYXNlX2RlZmF1bHQ7XG4gICAgbSA9IGQzX2Vhc2VfbW9kZS5nZXQobSkgfHwgZDNfaWRlbnRpdHk7XG4gICAgcmV0dXJuIGQzX2Vhc2VfY2xhbXAobSh0LmFwcGx5KG51bGwsIGQzX2FycmF5U2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSkpO1xuICB9O1xuICBmdW5jdGlvbiBkM19lYXNlX2NsYW1wKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIHQgPD0gMCA/IDAgOiB0ID49IDEgPyAxIDogZih0KTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfcmV2ZXJzZShmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiAxIC0gZigxIC0gdCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM19lYXNlX3JlZmxlY3QoZikge1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gLjUgKiAodCA8IC41ID8gZigyICogdCkgOiAyIC0gZigyIC0gMiAqIHQpKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfcXVhZCh0KSB7XG4gICAgcmV0dXJuIHQgKiB0O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfY3ViaWModCkge1xuICAgIHJldHVybiB0ICogdCAqIHQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZWFzZV9jdWJpY0luT3V0KHQpIHtcbiAgICBpZiAodCA8PSAwKSByZXR1cm4gMDtcbiAgICBpZiAodCA+PSAxKSByZXR1cm4gMTtcbiAgICB2YXIgdDIgPSB0ICogdCwgdDMgPSB0MiAqIHQ7XG4gICAgcmV0dXJuIDQgKiAodCA8IC41ID8gdDMgOiAzICogKHQgLSB0MikgKyB0MyAtIC43NSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZWFzZV9wb2x5KGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHQsIGUpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZWFzZV9zaW4odCkge1xuICAgIHJldHVybiAxIC0gTWF0aC5jb3ModCAqIGhhbGbPgCk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfZWFzZV9leHAodCkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfY2lyY2xlKHQpIHtcbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gdCAqIHQpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfZWxhc3RpYyhhLCBwKSB7XG4gICAgdmFyIHM7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBwID0gLjQ1O1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSBzID0gcCAvIM+EICogTWF0aC5hc2luKDEgLyBhKTsgZWxzZSBhID0gMSwgcyA9IHAgLyA0O1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gMSArIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0IC0gcykgKiDPhCAvIHApO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfZWFzZV9iYWNrKHMpIHtcbiAgICBpZiAoIXMpIHMgPSAxLjcwMTU4O1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gdCAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2Vhc2VfYm91bmNlKHQpIHtcbiAgICByZXR1cm4gdCA8IDEgLyAyLjc1ID8gNy41NjI1ICogdCAqIHQgOiB0IDwgMiAvIDIuNzUgPyA3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUgOiB0IDwgMi41IC8gMi43NSA/IDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAuOTM3NSA6IDcuNTYyNSAqICh0IC09IDIuNjI1IC8gMi43NSkgKiB0ICsgLjk4NDM3NTtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZUhjbCA9IGQzX2ludGVycG9sYXRlSGNsO1xuICBmdW5jdGlvbiBkM19pbnRlcnBvbGF0ZUhjbChhLCBiKSB7XG4gICAgYSA9IGQzLmhjbChhKTtcbiAgICBiID0gZDMuaGNsKGIpO1xuICAgIHZhciBhaCA9IGEuaCwgYWMgPSBhLmMsIGFsID0gYS5sLCBiaCA9IGIuaCAtIGFoLCBiYyA9IGIuYyAtIGFjLCBibCA9IGIubCAtIGFsO1xuICAgIGlmIChpc05hTihiYykpIGJjID0gMCwgYWMgPSBpc05hTihhYykgPyBiLmMgOiBhYztcbiAgICBpZiAoaXNOYU4oYmgpKSBiaCA9IDAsIGFoID0gaXNOYU4oYWgpID8gYi5oIDogYWg7IGVsc2UgaWYgKGJoID4gMTgwKSBiaCAtPSAzNjA7IGVsc2UgaWYgKGJoIDwgLTE4MCkgYmggKz0gMzYwO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gZDNfaGNsX2xhYihhaCArIGJoICogdCwgYWMgKyBiYyAqIHQsIGFsICsgYmwgKiB0KSArIFwiXCI7XG4gICAgfTtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZUhzbCA9IGQzX2ludGVycG9sYXRlSHNsO1xuICBmdW5jdGlvbiBkM19pbnRlcnBvbGF0ZUhzbChhLCBiKSB7XG4gICAgYSA9IGQzLmhzbChhKTtcbiAgICBiID0gZDMuaHNsKGIpO1xuICAgIHZhciBhaCA9IGEuaCwgYXMgPSBhLnMsIGFsID0gYS5sLCBiaCA9IGIuaCAtIGFoLCBicyA9IGIucyAtIGFzLCBibCA9IGIubCAtIGFsO1xuICAgIGlmIChpc05hTihicykpIGJzID0gMCwgYXMgPSBpc05hTihhcykgPyBiLnMgOiBhcztcbiAgICBpZiAoaXNOYU4oYmgpKSBiaCA9IDAsIGFoID0gaXNOYU4oYWgpID8gYi5oIDogYWg7IGVsc2UgaWYgKGJoID4gMTgwKSBiaCAtPSAzNjA7IGVsc2UgaWYgKGJoIDwgLTE4MCkgYmggKz0gMzYwO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gZDNfaHNsX3JnYihhaCArIGJoICogdCwgYXMgKyBicyAqIHQsIGFsICsgYmwgKiB0KSArIFwiXCI7XG4gICAgfTtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZUxhYiA9IGQzX2ludGVycG9sYXRlTGFiO1xuICBmdW5jdGlvbiBkM19pbnRlcnBvbGF0ZUxhYihhLCBiKSB7XG4gICAgYSA9IGQzLmxhYihhKTtcbiAgICBiID0gZDMubGFiKGIpO1xuICAgIHZhciBhbCA9IGEubCwgYWEgPSBhLmEsIGFiID0gYS5iLCBibCA9IGIubCAtIGFsLCBiYSA9IGIuYSAtIGFhLCBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gZDNfbGFiX3JnYihhbCArIGJsICogdCwgYWEgKyBiYSAqIHQsIGFiICsgYmIgKiB0KSArIFwiXCI7XG4gICAgfTtcbiAgfVxuICBkMy5pbnRlcnBvbGF0ZVJvdW5kID0gZDNfaW50ZXJwb2xhdGVSb3VuZDtcbiAgZnVuY3Rpb24gZDNfaW50ZXJwb2xhdGVSb3VuZChhLCBiKSB7XG4gICAgYiAtPSBhO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gTWF0aC5yb3VuZChhICsgYiAqIHQpO1xuICAgIH07XG4gIH1cbiAgZDMudHJhbnNmb3JtID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdmFyIGcgPSBkM19kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZDMubnMucHJlZml4LnN2ZywgXCJnXCIpO1xuICAgIHJldHVybiAoZDMudHJhbnNmb3JtID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nICE9IG51bGwpIHtcbiAgICAgICAgZy5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgc3RyaW5nKTtcbiAgICAgICAgdmFyIHQgPSBnLnRyYW5zZm9ybS5iYXNlVmFsLmNvbnNvbGlkYXRlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IGQzX3RyYW5zZm9ybSh0ID8gdC5tYXRyaXggOiBkM190cmFuc2Zvcm1JZGVudGl0eSk7XG4gICAgfSkoc3RyaW5nKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfdHJhbnNmb3JtKG0pIHtcbiAgICB2YXIgcjAgPSBbIG0uYSwgbS5iIF0sIHIxID0gWyBtLmMsIG0uZCBdLCBreCA9IGQzX3RyYW5zZm9ybU5vcm1hbGl6ZShyMCksIGt6ID0gZDNfdHJhbnNmb3JtRG90KHIwLCByMSksIGt5ID0gZDNfdHJhbnNmb3JtTm9ybWFsaXplKGQzX3RyYW5zZm9ybUNvbWJpbmUocjEsIHIwLCAta3opKSB8fCAwO1xuICAgIGlmIChyMFswXSAqIHIxWzFdIDwgcjFbMF0gKiByMFsxXSkge1xuICAgICAgcjBbMF0gKj0gLTE7XG4gICAgICByMFsxXSAqPSAtMTtcbiAgICAgIGt4ICo9IC0xO1xuICAgICAga3ogKj0gLTE7XG4gICAgfVxuICAgIHRoaXMucm90YXRlID0gKGt4ID8gTWF0aC5hdGFuMihyMFsxXSwgcjBbMF0pIDogTWF0aC5hdGFuMigtcjFbMF0sIHIxWzFdKSkgKiBkM19kZWdyZWVzO1xuICAgIHRoaXMudHJhbnNsYXRlID0gWyBtLmUsIG0uZiBdO1xuICAgIHRoaXMuc2NhbGUgPSBbIGt4LCBreSBdO1xuICAgIHRoaXMuc2tldyA9IGt5ID8gTWF0aC5hdGFuMihreiwga3kpICogZDNfZGVncmVlcyA6IDA7XG4gIH1cbiAgZDNfdHJhbnNmb3JtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHRoaXMudHJhbnNsYXRlICsgXCIpcm90YXRlKFwiICsgdGhpcy5yb3RhdGUgKyBcIilza2V3WChcIiArIHRoaXMuc2tldyArIFwiKXNjYWxlKFwiICsgdGhpcy5zY2FsZSArIFwiKVwiO1xuICB9O1xuICBmdW5jdGlvbiBkM190cmFuc2Zvcm1Eb3QoYSwgYikge1xuICAgIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RyYW5zZm9ybU5vcm1hbGl6ZShhKSB7XG4gICAgdmFyIGsgPSBNYXRoLnNxcnQoZDNfdHJhbnNmb3JtRG90KGEsIGEpKTtcbiAgICBpZiAoaykge1xuICAgICAgYVswXSAvPSBrO1xuICAgICAgYVsxXSAvPSBrO1xuICAgIH1cbiAgICByZXR1cm4gaztcbiAgfVxuICBmdW5jdGlvbiBkM190cmFuc2Zvcm1Db21iaW5lKGEsIGIsIGspIHtcbiAgICBhWzBdICs9IGsgKiBiWzBdO1xuICAgIGFbMV0gKz0gayAqIGJbMV07XG4gICAgcmV0dXJuIGE7XG4gIH1cbiAgdmFyIGQzX3RyYW5zZm9ybUlkZW50aXR5ID0ge1xuICAgIGE6IDEsXG4gICAgYjogMCxcbiAgICBjOiAwLFxuICAgIGQ6IDEsXG4gICAgZTogMCxcbiAgICBmOiAwXG4gIH07XG4gIGQzLmludGVycG9sYXRlVHJhbnNmb3JtID0gZDNfaW50ZXJwb2xhdGVUcmFuc2Zvcm07XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlVHJhbnNmb3JtUG9wKHMpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPyBzLnBvcCgpICsgXCIsXCIgOiBcIlwiO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlVHJhbnNsYXRlKHRhLCB0YiwgcywgcSkge1xuICAgIGlmICh0YVswXSAhPT0gdGJbMF0gfHwgdGFbMV0gIT09IHRiWzFdKSB7XG4gICAgICB2YXIgaSA9IHMucHVzaChcInRyYW5zbGF0ZShcIiwgbnVsbCwgXCIsXCIsIG51bGwsIFwiKVwiKTtcbiAgICAgIHEucHVzaCh7XG4gICAgICAgIGk6IGkgLSA0LFxuICAgICAgICB4OiBkM19pbnRlcnBvbGF0ZU51bWJlcih0YVswXSwgdGJbMF0pXG4gICAgICB9LCB7XG4gICAgICAgIGk6IGkgLSAyLFxuICAgICAgICB4OiBkM19pbnRlcnBvbGF0ZU51bWJlcih0YVsxXSwgdGJbMV0pXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRiWzBdIHx8IHRiWzFdKSB7XG4gICAgICBzLnB1c2goXCJ0cmFuc2xhdGUoXCIgKyB0YiArIFwiKVwiKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfaW50ZXJwb2xhdGVSb3RhdGUocmEsIHJiLCBzLCBxKSB7XG4gICAgaWYgKHJhICE9PSByYikge1xuICAgICAgaWYgKHJhIC0gcmIgPiAxODApIHJiICs9IDM2MDsgZWxzZSBpZiAocmIgLSByYSA+IDE4MCkgcmEgKz0gMzYwO1xuICAgICAgcS5wdXNoKHtcbiAgICAgICAgaTogcy5wdXNoKGQzX2ludGVycG9sYXRlVHJhbnNmb3JtUG9wKHMpICsgXCJyb3RhdGUoXCIsIG51bGwsIFwiKVwiKSAtIDIsXG4gICAgICAgIHg6IGQzX2ludGVycG9sYXRlTnVtYmVyKHJhLCByYilcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmIpIHtcbiAgICAgIHMucHVzaChkM19pbnRlcnBvbGF0ZVRyYW5zZm9ybVBvcChzKSArIFwicm90YXRlKFwiICsgcmIgKyBcIilcIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlU2tldyh3YSwgd2IsIHMsIHEpIHtcbiAgICBpZiAod2EgIT09IHdiKSB7XG4gICAgICBxLnB1c2goe1xuICAgICAgICBpOiBzLnB1c2goZDNfaW50ZXJwb2xhdGVUcmFuc2Zvcm1Qb3AocykgKyBcInNrZXdYKFwiLCBudWxsLCBcIilcIikgLSAyLFxuICAgICAgICB4OiBkM19pbnRlcnBvbGF0ZU51bWJlcih3YSwgd2IpXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdiKSB7XG4gICAgICBzLnB1c2goZDNfaW50ZXJwb2xhdGVUcmFuc2Zvcm1Qb3AocykgKyBcInNrZXdYKFwiICsgd2IgKyBcIilcIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlU2NhbGUoa2EsIGtiLCBzLCBxKSB7XG4gICAgaWYgKGthWzBdICE9PSBrYlswXSB8fCBrYVsxXSAhPT0ga2JbMV0pIHtcbiAgICAgIHZhciBpID0gcy5wdXNoKGQzX2ludGVycG9sYXRlVHJhbnNmb3JtUG9wKHMpICsgXCJzY2FsZShcIiwgbnVsbCwgXCIsXCIsIG51bGwsIFwiKVwiKTtcbiAgICAgIHEucHVzaCh7XG4gICAgICAgIGk6IGkgLSA0LFxuICAgICAgICB4OiBkM19pbnRlcnBvbGF0ZU51bWJlcihrYVswXSwga2JbMF0pXG4gICAgICB9LCB7XG4gICAgICAgIGk6IGkgLSAyLFxuICAgICAgICB4OiBkM19pbnRlcnBvbGF0ZU51bWJlcihrYVsxXSwga2JbMV0pXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGtiWzBdICE9PSAxIHx8IGtiWzFdICE9PSAxKSB7XG4gICAgICBzLnB1c2goZDNfaW50ZXJwb2xhdGVUcmFuc2Zvcm1Qb3AocykgKyBcInNjYWxlKFwiICsga2IgKyBcIilcIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGQzX2ludGVycG9sYXRlVHJhbnNmb3JtKGEsIGIpIHtcbiAgICB2YXIgcyA9IFtdLCBxID0gW107XG4gICAgYSA9IGQzLnRyYW5zZm9ybShhKSwgYiA9IGQzLnRyYW5zZm9ybShiKTtcbiAgICBkM19pbnRlcnBvbGF0ZVRyYW5zbGF0ZShhLnRyYW5zbGF0ZSwgYi50cmFuc2xhdGUsIHMsIHEpO1xuICAgIGQzX2ludGVycG9sYXRlUm90YXRlKGEucm90YXRlLCBiLnJvdGF0ZSwgcywgcSk7XG4gICAgZDNfaW50ZXJwb2xhdGVTa2V3KGEuc2tldywgYi5za2V3LCBzLCBxKTtcbiAgICBkM19pbnRlcnBvbGF0ZVNjYWxlKGEuc2NhbGUsIGIuc2NhbGUsIHMsIHEpO1xuICAgIGEgPSBiID0gbnVsbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgdmFyIGkgPSAtMSwgbiA9IHEubGVuZ3RoLCBvO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIHNbKG8gPSBxW2ldKS5pXSA9IG8ueCh0KTtcbiAgICAgIHJldHVybiBzLmpvaW4oXCJcIik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkM191bmludGVycG9sYXRlTnVtYmVyKGEsIGIpIHtcbiAgICBiID0gKGIgLT0gYSA9ICthKSB8fCAxIC8gYjtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuICh4IC0gYSkgLyBiO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfdW5pbnRlcnBvbGF0ZUNsYW1wKGEsIGIpIHtcbiAgICBiID0gKGIgLT0gYSA9ICthKSB8fCAxIC8gYjtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEsICh4IC0gYSkgLyBiKSk7XG4gICAgfTtcbiAgfVxuICBkMy5sYXlvdXQgPSB7fTtcbiAgZDMubGF5b3V0LmJ1bmRsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihsaW5rcykge1xuICAgICAgdmFyIHBhdGhzID0gW10sIGkgPSAtMSwgbiA9IGxpbmtzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBwYXRocy5wdXNoKGQzX2xheW91dF9idW5kbGVQYXRoKGxpbmtzW2ldKSk7XG4gICAgICByZXR1cm4gcGF0aHM7XG4gICAgfTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2J1bmRsZVBhdGgobGluaykge1xuICAgIHZhciBzdGFydCA9IGxpbmsuc291cmNlLCBlbmQgPSBsaW5rLnRhcmdldCwgbGNhID0gZDNfbGF5b3V0X2J1bmRsZUxlYXN0Q29tbW9uQW5jZXN0b3Ioc3RhcnQsIGVuZCksIHBvaW50cyA9IFsgc3RhcnQgXTtcbiAgICB3aGlsZSAoc3RhcnQgIT09IGxjYSkge1xuICAgICAgc3RhcnQgPSBzdGFydC5wYXJlbnQ7XG4gICAgICBwb2ludHMucHVzaChzdGFydCk7XG4gICAgfVxuICAgIHZhciBrID0gcG9pbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoZW5kICE9PSBsY2EpIHtcbiAgICAgIHBvaW50cy5zcGxpY2UoaywgMCwgZW5kKTtcbiAgICAgIGVuZCA9IGVuZC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2J1bmRsZUFuY2VzdG9ycyhub2RlKSB7XG4gICAgdmFyIGFuY2VzdG9ycyA9IFtdLCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICB3aGlsZSAocGFyZW50ICE9IG51bGwpIHtcbiAgICAgIGFuY2VzdG9ycy5wdXNoKG5vZGUpO1xuICAgICAgbm9kZSA9IHBhcmVudDtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIGFuY2VzdG9ycy5wdXNoKG5vZGUpO1xuICAgIHJldHVybiBhbmNlc3RvcnM7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2J1bmRsZUxlYXN0Q29tbW9uQW5jZXN0b3IoYSwgYikge1xuICAgIGlmIChhID09PSBiKSByZXR1cm4gYTtcbiAgICB2YXIgYU5vZGVzID0gZDNfbGF5b3V0X2J1bmRsZUFuY2VzdG9ycyhhKSwgYk5vZGVzID0gZDNfbGF5b3V0X2J1bmRsZUFuY2VzdG9ycyhiKSwgYU5vZGUgPSBhTm9kZXMucG9wKCksIGJOb2RlID0gYk5vZGVzLnBvcCgpLCBzaGFyZWROb2RlID0gbnVsbDtcbiAgICB3aGlsZSAoYU5vZGUgPT09IGJOb2RlKSB7XG4gICAgICBzaGFyZWROb2RlID0gYU5vZGU7XG4gICAgICBhTm9kZSA9IGFOb2Rlcy5wb3AoKTtcbiAgICAgIGJOb2RlID0gYk5vZGVzLnBvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gc2hhcmVkTm9kZTtcbiAgfVxuICBkMy5sYXlvdXQuY2hvcmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hvcmQgPSB7fSwgY2hvcmRzLCBncm91cHMsIG1hdHJpeCwgbiwgcGFkZGluZyA9IDAsIHNvcnRHcm91cHMsIHNvcnRTdWJncm91cHMsIHNvcnRDaG9yZHM7XG4gICAgZnVuY3Rpb24gcmVsYXlvdXQoKSB7XG4gICAgICB2YXIgc3ViZ3JvdXBzID0ge30sIGdyb3VwU3VtcyA9IFtdLCBncm91cEluZGV4ID0gZDMucmFuZ2UobiksIHN1Ymdyb3VwSW5kZXggPSBbXSwgaywgeCwgeDAsIGksIGo7XG4gICAgICBjaG9yZHMgPSBbXTtcbiAgICAgIGdyb3VwcyA9IFtdO1xuICAgICAgayA9IDAsIGkgPSAtMTtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIHggPSAwLCBqID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2ogPCBuKSB7XG4gICAgICAgICAgeCArPSBtYXRyaXhbaV1bal07XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXBTdW1zLnB1c2goeCk7XG4gICAgICAgIHN1Ymdyb3VwSW5kZXgucHVzaChkMy5yYW5nZShuKSk7XG4gICAgICAgIGsgKz0geDtcbiAgICAgIH1cbiAgICAgIGlmIChzb3J0R3JvdXBzKSB7XG4gICAgICAgIGdyb3VwSW5kZXguc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIHNvcnRHcm91cHMoZ3JvdXBTdW1zW2FdLCBncm91cFN1bXNbYl0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzb3J0U3ViZ3JvdXBzKSB7XG4gICAgICAgIHN1Ymdyb3VwSW5kZXguZm9yRWFjaChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgZC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3J0U3ViZ3JvdXBzKG1hdHJpeFtpXVthXSwgbWF0cml4W2ldW2JdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBrID0gKM+EIC0gcGFkZGluZyAqIG4pIC8gaztcbiAgICAgIHggPSAwLCBpID0gLTE7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICB4MCA9IHgsIGogPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraiA8IG4pIHtcbiAgICAgICAgICB2YXIgZGkgPSBncm91cEluZGV4W2ldLCBkaiA9IHN1Ymdyb3VwSW5kZXhbZGldW2pdLCB2ID0gbWF0cml4W2RpXVtkal0sIGEwID0geCwgYTEgPSB4ICs9IHYgKiBrO1xuICAgICAgICAgIHN1Ymdyb3Vwc1tkaSArIFwiLVwiICsgZGpdID0ge1xuICAgICAgICAgICAgaW5kZXg6IGRpLFxuICAgICAgICAgICAgc3ViaW5kZXg6IGRqLFxuICAgICAgICAgICAgc3RhcnRBbmdsZTogYTAsXG4gICAgICAgICAgICBlbmRBbmdsZTogYTEsXG4gICAgICAgICAgICB2YWx1ZTogdlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXBzW2RpXSA9IHtcbiAgICAgICAgICBpbmRleDogZGksXG4gICAgICAgICAgc3RhcnRBbmdsZTogeDAsXG4gICAgICAgICAgZW5kQW5nbGU6IHgsXG4gICAgICAgICAgdmFsdWU6IGdyb3VwU3Vtc1tkaV1cbiAgICAgICAgfTtcbiAgICAgICAgeCArPSBwYWRkaW5nO1xuICAgICAgfVxuICAgICAgaSA9IC0xO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaiA9IGkgLSAxO1xuICAgICAgICB3aGlsZSAoKytqIDwgbikge1xuICAgICAgICAgIHZhciBzb3VyY2UgPSBzdWJncm91cHNbaSArIFwiLVwiICsgal0sIHRhcmdldCA9IHN1Ymdyb3Vwc1tqICsgXCItXCIgKyBpXTtcbiAgICAgICAgICBpZiAoc291cmNlLnZhbHVlIHx8IHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgICAgY2hvcmRzLnB1c2goc291cmNlLnZhbHVlIDwgdGFyZ2V0LnZhbHVlID8ge1xuICAgICAgICAgICAgICBzb3VyY2U6IHRhcmdldCxcbiAgICAgICAgICAgICAgdGFyZ2V0OiBzb3VyY2VcbiAgICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc29ydENob3JkcykgcmVzb3J0KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc29ydCgpIHtcbiAgICAgIGNob3Jkcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHNvcnRDaG9yZHMoKGEuc291cmNlLnZhbHVlICsgYS50YXJnZXQudmFsdWUpIC8gMiwgKGIuc291cmNlLnZhbHVlICsgYi50YXJnZXQudmFsdWUpIC8gMik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgY2hvcmQubWF0cml4ID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbWF0cml4O1xuICAgICAgbiA9IChtYXRyaXggPSB4KSAmJiBtYXRyaXgubGVuZ3RoO1xuICAgICAgY2hvcmRzID0gZ3JvdXBzID0gbnVsbDtcbiAgICAgIHJldHVybiBjaG9yZDtcbiAgICB9O1xuICAgIGNob3JkLnBhZGRpbmcgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBwYWRkaW5nO1xuICAgICAgcGFkZGluZyA9IHg7XG4gICAgICBjaG9yZHMgPSBncm91cHMgPSBudWxsO1xuICAgICAgcmV0dXJuIGNob3JkO1xuICAgIH07XG4gICAgY2hvcmQuc29ydEdyb3VwcyA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNvcnRHcm91cHM7XG4gICAgICBzb3J0R3JvdXBzID0geDtcbiAgICAgIGNob3JkcyA9IGdyb3VwcyA9IG51bGw7XG4gICAgICByZXR1cm4gY2hvcmQ7XG4gICAgfTtcbiAgICBjaG9yZC5zb3J0U3ViZ3JvdXBzID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc29ydFN1Ymdyb3VwcztcbiAgICAgIHNvcnRTdWJncm91cHMgPSB4O1xuICAgICAgY2hvcmRzID0gbnVsbDtcbiAgICAgIHJldHVybiBjaG9yZDtcbiAgICB9O1xuICAgIGNob3JkLnNvcnRDaG9yZHMgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzb3J0Q2hvcmRzO1xuICAgICAgc29ydENob3JkcyA9IHg7XG4gICAgICBpZiAoY2hvcmRzKSByZXNvcnQoKTtcbiAgICAgIHJldHVybiBjaG9yZDtcbiAgICB9O1xuICAgIGNob3JkLmNob3JkcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFjaG9yZHMpIHJlbGF5b3V0KCk7XG4gICAgICByZXR1cm4gY2hvcmRzO1xuICAgIH07XG4gICAgY2hvcmQuZ3JvdXBzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWdyb3VwcykgcmVsYXlvdXQoKTtcbiAgICAgIHJldHVybiBncm91cHM7XG4gICAgfTtcbiAgICByZXR1cm4gY2hvcmQ7XG4gIH07XG4gIGQzLmxheW91dC5mb3JjZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmb3JjZSA9IHt9LCBldmVudCA9IGQzLmRpc3BhdGNoKFwic3RhcnRcIiwgXCJ0aWNrXCIsIFwiZW5kXCIpLCB0aW1lciwgc2l6ZSA9IFsgMSwgMSBdLCBkcmFnLCBhbHBoYSwgZnJpY3Rpb24gPSAuOSwgbGlua0Rpc3RhbmNlID0gZDNfbGF5b3V0X2ZvcmNlTGlua0Rpc3RhbmNlLCBsaW5rU3RyZW5ndGggPSBkM19sYXlvdXRfZm9yY2VMaW5rU3RyZW5ndGgsIGNoYXJnZSA9IC0zMCwgY2hhcmdlRGlzdGFuY2UyID0gZDNfbGF5b3V0X2ZvcmNlQ2hhcmdlRGlzdGFuY2UyLCBncmF2aXR5ID0gLjEsIHRoZXRhMiA9IC42NCwgbm9kZXMgPSBbXSwgbGlua3MgPSBbXSwgZGlzdGFuY2VzLCBzdHJlbmd0aHMsIGNoYXJnZXM7XG4gICAgZnVuY3Rpb24gcmVwdWxzZShub2RlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocXVhZCwgeDEsIF8sIHgyKSB7XG4gICAgICAgIGlmIChxdWFkLnBvaW50ICE9PSBub2RlKSB7XG4gICAgICAgICAgdmFyIGR4ID0gcXVhZC5jeCAtIG5vZGUueCwgZHkgPSBxdWFkLmN5IC0gbm9kZS55LCBkdyA9IHgyIC0geDEsIGRuID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICAgICAgaWYgKGR3ICogZHcgLyB0aGV0YTIgPCBkbikge1xuICAgICAgICAgICAgaWYgKGRuIDwgY2hhcmdlRGlzdGFuY2UyKSB7XG4gICAgICAgICAgICAgIHZhciBrID0gcXVhZC5jaGFyZ2UgLyBkbjtcbiAgICAgICAgICAgICAgbm9kZS5weCAtPSBkeCAqIGs7XG4gICAgICAgICAgICAgIG5vZGUucHkgLT0gZHkgKiBrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChxdWFkLnBvaW50ICYmIGRuICYmIGRuIDwgY2hhcmdlRGlzdGFuY2UyKSB7XG4gICAgICAgICAgICB2YXIgayA9IHF1YWQucG9pbnRDaGFyZ2UgLyBkbjtcbiAgICAgICAgICAgIG5vZGUucHggLT0gZHggKiBrO1xuICAgICAgICAgICAgbm9kZS5weSAtPSBkeSAqIGs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhcXVhZC5jaGFyZ2U7XG4gICAgICB9O1xuICAgIH1cbiAgICBmb3JjZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoKGFscGhhICo9IC45OSkgPCAuMDA1KSB7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgZXZlbnQuZW5kKHtcbiAgICAgICAgICB0eXBlOiBcImVuZFwiLFxuICAgICAgICAgIGFscGhhOiBhbHBoYSA9IDBcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgdmFyIG4gPSBub2Rlcy5sZW5ndGgsIG0gPSBsaW5rcy5sZW5ndGgsIHEsIGksIG8sIHMsIHQsIGwsIGssIHgsIHk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSB7XG4gICAgICAgIG8gPSBsaW5rc1tpXTtcbiAgICAgICAgcyA9IG8uc291cmNlO1xuICAgICAgICB0ID0gby50YXJnZXQ7XG4gICAgICAgIHggPSB0LnggLSBzLng7XG4gICAgICAgIHkgPSB0LnkgLSBzLnk7XG4gICAgICAgIGlmIChsID0geCAqIHggKyB5ICogeSkge1xuICAgICAgICAgIGwgPSBhbHBoYSAqIHN0cmVuZ3Roc1tpXSAqICgobCA9IE1hdGguc3FydChsKSkgLSBkaXN0YW5jZXNbaV0pIC8gbDtcbiAgICAgICAgICB4ICo9IGw7XG4gICAgICAgICAgeSAqPSBsO1xuICAgICAgICAgIHQueCAtPSB4ICogKGsgPSBzLndlaWdodCArIHQud2VpZ2h0ID8gcy53ZWlnaHQgLyAocy53ZWlnaHQgKyB0LndlaWdodCkgOiAuNSk7XG4gICAgICAgICAgdC55IC09IHkgKiBrO1xuICAgICAgICAgIHMueCArPSB4ICogKGsgPSAxIC0gayk7XG4gICAgICAgICAgcy55ICs9IHkgKiBrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoayA9IGFscGhhICogZ3Jhdml0eSkge1xuICAgICAgICB4ID0gc2l6ZVswXSAvIDI7XG4gICAgICAgIHkgPSBzaXplWzFdIC8gMjtcbiAgICAgICAgaSA9IC0xO1xuICAgICAgICBpZiAoaykgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBvID0gbm9kZXNbaV07XG4gICAgICAgICAgby54ICs9ICh4IC0gby54KSAqIGs7XG4gICAgICAgICAgby55ICs9ICh5IC0gby55KSAqIGs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGFyZ2UpIHtcbiAgICAgICAgZDNfbGF5b3V0X2ZvcmNlQWNjdW11bGF0ZShxID0gZDMuZ2VvbS5xdWFkdHJlZShub2RlcyksIGFscGhhLCBjaGFyZ2VzKTtcbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmICghKG8gPSBub2Rlc1tpXSkuZml4ZWQpIHtcbiAgICAgICAgICAgIHEudmlzaXQocmVwdWxzZShvKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpID0gLTE7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBvID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChvLmZpeGVkKSB7XG4gICAgICAgICAgby54ID0gby5weDtcbiAgICAgICAgICBvLnkgPSBvLnB5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8ueCAtPSAoby5weCAtIChvLnB4ID0gby54KSkgKiBmcmljdGlvbjtcbiAgICAgICAgICBvLnkgLT0gKG8ucHkgLSAoby5weSA9IG8ueSkpICogZnJpY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGV2ZW50LnRpY2soe1xuICAgICAgICB0eXBlOiBcInRpY2tcIixcbiAgICAgICAgYWxwaGE6IGFscGhhXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZvcmNlLm5vZGVzID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbm9kZXM7XG4gICAgICBub2RlcyA9IHg7XG4gICAgICByZXR1cm4gZm9yY2U7XG4gICAgfTtcbiAgICBmb3JjZS5saW5rcyA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxpbmtzO1xuICAgICAgbGlua3MgPSB4O1xuICAgICAgcmV0dXJuIGZvcmNlO1xuICAgIH07XG4gICAgZm9yY2Uuc2l6ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNpemU7XG4gICAgICBzaXplID0geDtcbiAgICAgIHJldHVybiBmb3JjZTtcbiAgICB9O1xuICAgIGZvcmNlLmxpbmtEaXN0YW5jZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxpbmtEaXN0YW5jZTtcbiAgICAgIGxpbmtEaXN0YW5jZSA9IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyB4IDogK3g7XG4gICAgICByZXR1cm4gZm9yY2U7XG4gICAgfTtcbiAgICBmb3JjZS5kaXN0YW5jZSA9IGZvcmNlLmxpbmtEaXN0YW5jZTtcbiAgICBmb3JjZS5saW5rU3RyZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsaW5rU3RyZW5ndGg7XG4gICAgICBsaW5rU3RyZW5ndGggPSB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiID8geCA6ICt4O1xuICAgICAgcmV0dXJuIGZvcmNlO1xuICAgIH07XG4gICAgZm9yY2UuZnJpY3Rpb24gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBmcmljdGlvbjtcbiAgICAgIGZyaWN0aW9uID0gK3g7XG4gICAgICByZXR1cm4gZm9yY2U7XG4gICAgfTtcbiAgICBmb3JjZS5jaGFyZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjaGFyZ2U7XG4gICAgICBjaGFyZ2UgPSB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiID8geCA6ICt4O1xuICAgICAgcmV0dXJuIGZvcmNlO1xuICAgIH07XG4gICAgZm9yY2UuY2hhcmdlRGlzdGFuY2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBNYXRoLnNxcnQoY2hhcmdlRGlzdGFuY2UyKTtcbiAgICAgIGNoYXJnZURpc3RhbmNlMiA9IHggKiB4O1xuICAgICAgcmV0dXJuIGZvcmNlO1xuICAgIH07XG4gICAgZm9yY2UuZ3Jhdml0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGdyYXZpdHk7XG4gICAgICBncmF2aXR5ID0gK3g7XG4gICAgICByZXR1cm4gZm9yY2U7XG4gICAgfTtcbiAgICBmb3JjZS50aGV0YSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIE1hdGguc3FydCh0aGV0YTIpO1xuICAgICAgdGhldGEyID0geCAqIHg7XG4gICAgICByZXR1cm4gZm9yY2U7XG4gICAgfTtcbiAgICBmb3JjZS5hbHBoYSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFscGhhO1xuICAgICAgeCA9ICt4O1xuICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgIGlmICh4ID4gMCkge1xuICAgICAgICAgIGFscGhhID0geDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lci5jID0gbnVsbCwgdGltZXIudCA9IE5hTiwgdGltZXIgPSBudWxsO1xuICAgICAgICAgIGV2ZW50LmVuZCh7XG4gICAgICAgICAgICB0eXBlOiBcImVuZFwiLFxuICAgICAgICAgICAgYWxwaGE6IGFscGhhID0gMFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHggPiAwKSB7XG4gICAgICAgIGV2ZW50LnN0YXJ0KHtcbiAgICAgICAgICB0eXBlOiBcInN0YXJ0XCIsXG4gICAgICAgICAgYWxwaGE6IGFscGhhID0geFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZXIgPSBkM190aW1lcihmb3JjZS50aWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JjZTtcbiAgICB9O1xuICAgIGZvcmNlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbSA9IGxpbmtzLmxlbmd0aCwgdyA9IHNpemVbMF0sIGggPSBzaXplWzFdLCBuZWlnaGJvcnMsIG87XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIChvID0gbm9kZXNbaV0pLmluZGV4ID0gaTtcbiAgICAgICAgby53ZWlnaHQgPSAwO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IG07ICsraSkge1xuICAgICAgICBvID0gbGlua3NbaV07XG4gICAgICAgIGlmICh0eXBlb2Ygby5zb3VyY2UgPT0gXCJudW1iZXJcIikgby5zb3VyY2UgPSBub2Rlc1tvLnNvdXJjZV07XG4gICAgICAgIGlmICh0eXBlb2Ygby50YXJnZXQgPT0gXCJudW1iZXJcIikgby50YXJnZXQgPSBub2Rlc1tvLnRhcmdldF07XG4gICAgICAgICsrby5zb3VyY2Uud2VpZ2h0O1xuICAgICAgICArK28udGFyZ2V0LndlaWdodDtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgbyA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAoaXNOYU4oby54KSkgby54ID0gcG9zaXRpb24oXCJ4XCIsIHcpO1xuICAgICAgICBpZiAoaXNOYU4oby55KSkgby55ID0gcG9zaXRpb24oXCJ5XCIsIGgpO1xuICAgICAgICBpZiAoaXNOYU4oby5weCkpIG8ucHggPSBvLng7XG4gICAgICAgIGlmIChpc05hTihvLnB5KSkgby5weSA9IG8ueTtcbiAgICAgIH1cbiAgICAgIGRpc3RhbmNlcyA9IFtdO1xuICAgICAgaWYgKHR5cGVvZiBsaW5rRGlzdGFuY2UgPT09IFwiZnVuY3Rpb25cIikgZm9yIChpID0gMDsgaSA8IG07ICsraSkgZGlzdGFuY2VzW2ldID0gK2xpbmtEaXN0YW5jZS5jYWxsKHRoaXMsIGxpbmtzW2ldLCBpKTsgZWxzZSBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSBkaXN0YW5jZXNbaV0gPSBsaW5rRGlzdGFuY2U7XG4gICAgICBzdHJlbmd0aHMgPSBbXTtcbiAgICAgIGlmICh0eXBlb2YgbGlua1N0cmVuZ3RoID09PSBcImZ1bmN0aW9uXCIpIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHN0cmVuZ3Roc1tpXSA9ICtsaW5rU3RyZW5ndGguY2FsbCh0aGlzLCBsaW5rc1tpXSwgaSk7IGVsc2UgZm9yIChpID0gMDsgaSA8IG07ICsraSkgc3RyZW5ndGhzW2ldID0gbGlua1N0cmVuZ3RoO1xuICAgICAgY2hhcmdlcyA9IFtdO1xuICAgICAgaWYgKHR5cGVvZiBjaGFyZ2UgPT09IFwiZnVuY3Rpb25cIikgZm9yIChpID0gMDsgaSA8IG47ICsraSkgY2hhcmdlc1tpXSA9ICtjaGFyZ2UuY2FsbCh0aGlzLCBub2Rlc1tpXSwgaSk7IGVsc2UgZm9yIChpID0gMDsgaSA8IG47ICsraSkgY2hhcmdlc1tpXSA9IGNoYXJnZTtcbiAgICAgIGZ1bmN0aW9uIHBvc2l0aW9uKGRpbWVuc2lvbiwgc2l6ZSkge1xuICAgICAgICBpZiAoIW5laWdoYm9ycykge1xuICAgICAgICAgIG5laWdoYm9ycyA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbjsgKytqKSB7XG4gICAgICAgICAgICBuZWlnaGJvcnNbal0gPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikge1xuICAgICAgICAgICAgdmFyIG8gPSBsaW5rc1tqXTtcbiAgICAgICAgICAgIG5laWdoYm9yc1tvLnNvdXJjZS5pbmRleF0ucHVzaChvLnRhcmdldCk7XG4gICAgICAgICAgICBuZWlnaGJvcnNbby50YXJnZXQuaW5kZXhdLnB1c2goby5zb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FuZGlkYXRlcyA9IG5laWdoYm9yc1tpXSwgaiA9IC0xLCBsID0gY2FuZGlkYXRlcy5sZW5ndGgsIHg7XG4gICAgICAgIHdoaWxlICgrK2ogPCBsKSBpZiAoIWlzTmFOKHggPSBjYW5kaWRhdGVzW2pdW2RpbWVuc2lvbl0pKSByZXR1cm4geDtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiBzaXplO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZvcmNlLnJlc3VtZSgpO1xuICAgIH07XG4gICAgZm9yY2UucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZm9yY2UuYWxwaGEoLjEpO1xuICAgIH07XG4gICAgZm9yY2Uuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZvcmNlLmFscGhhKDApO1xuICAgIH07XG4gICAgZm9yY2UuZHJhZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFkcmFnKSBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpLm9yaWdpbihkM19pZGVudGl0eSkub24oXCJkcmFnc3RhcnQuZm9yY2VcIiwgZDNfbGF5b3V0X2ZvcmNlRHJhZ3N0YXJ0KS5vbihcImRyYWcuZm9yY2VcIiwgZHJhZ21vdmUpLm9uKFwiZHJhZ2VuZC5mb3JjZVwiLCBkM19sYXlvdXRfZm9yY2VEcmFnZW5kKTtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRyYWc7XG4gICAgICB0aGlzLm9uKFwibW91c2VvdmVyLmZvcmNlXCIsIGQzX2xheW91dF9mb3JjZU1vdXNlb3Zlcikub24oXCJtb3VzZW91dC5mb3JjZVwiLCBkM19sYXlvdXRfZm9yY2VNb3VzZW91dCkuY2FsbChkcmFnKTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGRyYWdtb3ZlKGQpIHtcbiAgICAgIGQucHggPSBkMy5ldmVudC54LCBkLnB5ID0gZDMuZXZlbnQueTtcbiAgICAgIGZvcmNlLnJlc3VtZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZDMucmViaW5kKGZvcmNlLCBldmVudCwgXCJvblwiKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2ZvcmNlRHJhZ3N0YXJ0KGQpIHtcbiAgICBkLmZpeGVkIHw9IDI7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2ZvcmNlRHJhZ2VuZChkKSB7XG4gICAgZC5maXhlZCAmPSB+NjtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfZm9yY2VNb3VzZW92ZXIoZCkge1xuICAgIGQuZml4ZWQgfD0gNDtcbiAgICBkLnB4ID0gZC54LCBkLnB5ID0gZC55O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9mb3JjZU1vdXNlb3V0KGQpIHtcbiAgICBkLmZpeGVkICY9IH40O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9mb3JjZUFjY3VtdWxhdGUocXVhZCwgYWxwaGEsIGNoYXJnZXMpIHtcbiAgICB2YXIgY3ggPSAwLCBjeSA9IDA7XG4gICAgcXVhZC5jaGFyZ2UgPSAwO1xuICAgIGlmICghcXVhZC5sZWFmKSB7XG4gICAgICB2YXIgbm9kZXMgPSBxdWFkLm5vZGVzLCBuID0gbm9kZXMubGVuZ3RoLCBpID0gLTEsIGM7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBjID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChjID09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICBkM19sYXlvdXRfZm9yY2VBY2N1bXVsYXRlKGMsIGFscGhhLCBjaGFyZ2VzKTtcbiAgICAgICAgcXVhZC5jaGFyZ2UgKz0gYy5jaGFyZ2U7XG4gICAgICAgIGN4ICs9IGMuY2hhcmdlICogYy5jeDtcbiAgICAgICAgY3kgKz0gYy5jaGFyZ2UgKiBjLmN5O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocXVhZC5wb2ludCkge1xuICAgICAgaWYgKCFxdWFkLmxlYWYpIHtcbiAgICAgICAgcXVhZC5wb2ludC54ICs9IE1hdGgucmFuZG9tKCkgLSAuNTtcbiAgICAgICAgcXVhZC5wb2ludC55ICs9IE1hdGgucmFuZG9tKCkgLSAuNTtcbiAgICAgIH1cbiAgICAgIHZhciBrID0gYWxwaGEgKiBjaGFyZ2VzW3F1YWQucG9pbnQuaW5kZXhdO1xuICAgICAgcXVhZC5jaGFyZ2UgKz0gcXVhZC5wb2ludENoYXJnZSA9IGs7XG4gICAgICBjeCArPSBrICogcXVhZC5wb2ludC54O1xuICAgICAgY3kgKz0gayAqIHF1YWQucG9pbnQueTtcbiAgICB9XG4gICAgcXVhZC5jeCA9IGN4IC8gcXVhZC5jaGFyZ2U7XG4gICAgcXVhZC5jeSA9IGN5IC8gcXVhZC5jaGFyZ2U7XG4gIH1cbiAgdmFyIGQzX2xheW91dF9mb3JjZUxpbmtEaXN0YW5jZSA9IDIwLCBkM19sYXlvdXRfZm9yY2VMaW5rU3RyZW5ndGggPSAxLCBkM19sYXlvdXRfZm9yY2VDaGFyZ2VEaXN0YW5jZTIgPSBJbmZpbml0eTtcbiAgZDMubGF5b3V0LmhpZXJhcmNoeSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb3J0ID0gZDNfbGF5b3V0X2hpZXJhcmNoeVNvcnQsIGNoaWxkcmVuID0gZDNfbGF5b3V0X2hpZXJhcmNoeUNoaWxkcmVuLCB2YWx1ZSA9IGQzX2xheW91dF9oaWVyYXJjaHlWYWx1ZTtcbiAgICBmdW5jdGlvbiBoaWVyYXJjaHkocm9vdCkge1xuICAgICAgdmFyIHN0YWNrID0gWyByb290IF0sIG5vZGVzID0gW10sIG5vZGU7XG4gICAgICByb290LmRlcHRoID0gMDtcbiAgICAgIHdoaWxlICgobm9kZSA9IHN0YWNrLnBvcCgpKSAhPSBudWxsKSB7XG4gICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIGlmICgoY2hpbGRzID0gY2hpbGRyZW4uY2FsbChoaWVyYXJjaHksIG5vZGUsIG5vZGUuZGVwdGgpKSAmJiAobiA9IGNoaWxkcy5sZW5ndGgpKSB7XG4gICAgICAgICAgdmFyIG4sIGNoaWxkcywgY2hpbGQ7XG4gICAgICAgICAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGNoaWxkID0gY2hpbGRzW25dKTtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG5vZGU7XG4gICAgICAgICAgICBjaGlsZC5kZXB0aCA9IG5vZGUuZGVwdGggKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUpIG5vZGUudmFsdWUgPSAwO1xuICAgICAgICAgIG5vZGUuY2hpbGRyZW4gPSBjaGlsZHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHZhbHVlKSBub2RlLnZhbHVlID0gK3ZhbHVlLmNhbGwoaGllcmFyY2h5LCBub2RlLCBub2RlLmRlcHRoKSB8fCAwO1xuICAgICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkM19sYXlvdXRfaGllcmFyY2h5VmlzaXRBZnRlcihyb290LCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBjaGlsZHMsIHBhcmVudDtcbiAgICAgICAgaWYgKHNvcnQgJiYgKGNoaWxkcyA9IG5vZGUuY2hpbGRyZW4pKSBjaGlsZHMuc29ydChzb3J0KTtcbiAgICAgICAgaWYgKHZhbHVlICYmIChwYXJlbnQgPSBub2RlLnBhcmVudCkpIHBhcmVudC52YWx1ZSArPSBub2RlLnZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICAgIGhpZXJhcmNoeS5zb3J0ID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc29ydDtcbiAgICAgIHNvcnQgPSB4O1xuICAgICAgcmV0dXJuIGhpZXJhcmNoeTtcbiAgICB9O1xuICAgIGhpZXJhcmNoeS5jaGlsZHJlbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgY2hpbGRyZW4gPSB4O1xuICAgICAgcmV0dXJuIGhpZXJhcmNoeTtcbiAgICB9O1xuICAgIGhpZXJhcmNoeS52YWx1ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHZhbHVlO1xuICAgICAgdmFsdWUgPSB4O1xuICAgICAgcmV0dXJuIGhpZXJhcmNoeTtcbiAgICB9O1xuICAgIGhpZXJhcmNoeS5yZXZhbHVlID0gZnVuY3Rpb24ocm9vdCkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEJlZm9yZShyb290LCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIG5vZGUudmFsdWUgPSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgZDNfbGF5b3V0X2hpZXJhcmNoeVZpc2l0QWZ0ZXIocm9vdCwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIHZhciBwYXJlbnQ7XG4gICAgICAgICAgaWYgKCFub2RlLmNoaWxkcmVuKSBub2RlLnZhbHVlID0gK3ZhbHVlLmNhbGwoaGllcmFyY2h5LCBub2RlLCBub2RlLmRlcHRoKSB8fCAwO1xuICAgICAgICAgIGlmIChwYXJlbnQgPSBub2RlLnBhcmVudCkgcGFyZW50LnZhbHVlICs9IG5vZGUudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfTtcbiAgICByZXR1cm4gaGllcmFyY2h5O1xuICB9O1xuICBmdW5jdGlvbiBkM19sYXlvdXRfaGllcmFyY2h5UmViaW5kKG9iamVjdCwgaGllcmFyY2h5KSB7XG4gICAgZDMucmViaW5kKG9iamVjdCwgaGllcmFyY2h5LCBcInNvcnRcIiwgXCJjaGlsZHJlblwiLCBcInZhbHVlXCIpO1xuICAgIG9iamVjdC5ub2RlcyA9IG9iamVjdDtcbiAgICBvYmplY3QubGlua3MgPSBkM19sYXlvdXRfaGllcmFyY2h5TGlua3M7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfaGllcmFyY2h5VmlzaXRCZWZvcmUobm9kZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbm9kZXMgPSBbIG5vZGUgXTtcbiAgICB3aGlsZSAoKG5vZGUgPSBub2Rlcy5wb3AoKSkgIT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sobm9kZSk7XG4gICAgICBpZiAoKGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbikgJiYgKG4gPSBjaGlsZHJlbi5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBuLCBjaGlsZHJlbjtcbiAgICAgICAgd2hpbGUgKC0tbiA+PSAwKSBub2Rlcy5wdXNoKGNoaWxkcmVuW25dKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2hpZXJhcmNoeVZpc2l0QWZ0ZXIobm9kZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbm9kZXMgPSBbIG5vZGUgXSwgbm9kZXMyID0gW107XG4gICAgd2hpbGUgKChub2RlID0gbm9kZXMucG9wKCkpICE9IG51bGwpIHtcbiAgICAgIG5vZGVzMi5wdXNoKG5vZGUpO1xuICAgICAgaWYgKChjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4pICYmIChuID0gY2hpbGRyZW4ubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuLCBjaGlsZHJlbjtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIG5vZGVzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoKG5vZGUgPSBub2RlczIucG9wKCkpICE9IG51bGwpIHtcbiAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfaGllcmFyY2h5Q2hpbGRyZW4oZCkge1xuICAgIHJldHVybiBkLmNoaWxkcmVuO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9oaWVyYXJjaHlWYWx1ZShkKSB7XG4gICAgcmV0dXJuIGQudmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2hpZXJhcmNoeVNvcnQoYSwgYikge1xuICAgIHJldHVybiBiLnZhbHVlIC0gYS52YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfaGllcmFyY2h5TGlua3Mobm9kZXMpIHtcbiAgICByZXR1cm4gZDMubWVyZ2Uobm9kZXMubWFwKGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgcmV0dXJuIChwYXJlbnQuY2hpbGRyZW4gfHwgW10pLm1hcChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNvdXJjZTogcGFyZW50LFxuICAgICAgICAgIHRhcmdldDogY2hpbGRcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuICBkMy5sYXlvdXQucGFydGl0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhpZXJhcmNoeSA9IGQzLmxheW91dC5oaWVyYXJjaHkoKSwgc2l6ZSA9IFsgMSwgMSBdO1xuICAgIGZ1bmN0aW9uIHBvc2l0aW9uKG5vZGUsIHgsIGR4LCBkeSkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgIG5vZGUueCA9IHg7XG4gICAgICBub2RlLnkgPSBub2RlLmRlcHRoICogZHk7XG4gICAgICBub2RlLmR4ID0gZHg7XG4gICAgICBub2RlLmR5ID0gZHk7XG4gICAgICBpZiAoY2hpbGRyZW4gJiYgKG4gPSBjaGlsZHJlbi5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG4sIGMsIGQ7XG4gICAgICAgIGR4ID0gbm9kZS52YWx1ZSA/IGR4IC8gbm9kZS52YWx1ZSA6IDA7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgcG9zaXRpb24oYyA9IGNoaWxkcmVuW2ldLCB4LCBkID0gYy52YWx1ZSAqIGR4LCBkeSk7XG4gICAgICAgICAgeCArPSBkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlcHRoKG5vZGUpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4sIGQgPSAwO1xuICAgICAgaWYgKGNoaWxkcmVuICYmIChuID0gY2hpbGRyZW4ubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgZCA9IE1hdGgubWF4KGQsIGRlcHRoKGNoaWxkcmVuW2ldKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMSArIGQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhcnRpdGlvbihkLCBpKSB7XG4gICAgICB2YXIgbm9kZXMgPSBoaWVyYXJjaHkuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgIHBvc2l0aW9uKG5vZGVzWzBdLCAwLCBzaXplWzBdLCBzaXplWzFdIC8gZGVwdGgobm9kZXNbMF0pKTtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gICAgcGFydGl0aW9uLnNpemUgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaXplO1xuICAgICAgc2l6ZSA9IHg7XG4gICAgICByZXR1cm4gcGFydGl0aW9uO1xuICAgIH07XG4gICAgcmV0dXJuIGQzX2xheW91dF9oaWVyYXJjaHlSZWJpbmQocGFydGl0aW9uLCBoaWVyYXJjaHkpO1xuICB9O1xuICBkMy5sYXlvdXQucGllID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gTnVtYmVyLCBzb3J0ID0gZDNfbGF5b3V0X3BpZVNvcnRCeVZhbHVlLCBzdGFydEFuZ2xlID0gMCwgZW5kQW5nbGUgPSDPhCwgcGFkQW5nbGUgPSAwO1xuICAgIGZ1bmN0aW9uIHBpZShkYXRhKSB7XG4gICAgICB2YXIgbiA9IGRhdGEubGVuZ3RoLCB2YWx1ZXMgPSBkYXRhLm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiArdmFsdWUuY2FsbChwaWUsIGQsIGkpO1xuICAgICAgfSksIGEgPSArKHR5cGVvZiBzdGFydEFuZ2xlID09PSBcImZ1bmN0aW9uXCIgPyBzdGFydEFuZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBzdGFydEFuZ2xlKSwgZGEgPSAodHlwZW9mIGVuZEFuZ2xlID09PSBcImZ1bmN0aW9uXCIgPyBlbmRBbmdsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogZW5kQW5nbGUpIC0gYSwgcCA9IE1hdGgubWluKE1hdGguYWJzKGRhKSAvIG4sICsodHlwZW9mIHBhZEFuZ2xlID09PSBcImZ1bmN0aW9uXCIgPyBwYWRBbmdsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogcGFkQW5nbGUpKSwgcGEgPSBwICogKGRhIDwgMCA/IC0xIDogMSksIHN1bSA9IGQzLnN1bSh2YWx1ZXMpLCBrID0gc3VtID8gKGRhIC0gbiAqIHBhKSAvIHN1bSA6IDAsIGluZGV4ID0gZDMucmFuZ2UobiksIGFyY3MgPSBbXSwgdjtcbiAgICAgIGlmIChzb3J0ICE9IG51bGwpIGluZGV4LnNvcnQoc29ydCA9PT0gZDNfbGF5b3V0X3BpZVNvcnRCeVZhbHVlID8gZnVuY3Rpb24oaSwgaikge1xuICAgICAgICByZXR1cm4gdmFsdWVzW2pdIC0gdmFsdWVzW2ldO1xuICAgICAgfSA6IGZ1bmN0aW9uKGksIGopIHtcbiAgICAgICAgcmV0dXJuIHNvcnQoZGF0YVtpXSwgZGF0YVtqXSk7XG4gICAgICB9KTtcbiAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICBhcmNzW2ldID0ge1xuICAgICAgICAgIGRhdGE6IGRhdGFbaV0sXG4gICAgICAgICAgdmFsdWU6IHYgPSB2YWx1ZXNbaV0sXG4gICAgICAgICAgc3RhcnRBbmdsZTogYSxcbiAgICAgICAgICBlbmRBbmdsZTogYSArPSB2ICogayArIHBhLFxuICAgICAgICAgIHBhZEFuZ2xlOiBwXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhcmNzO1xuICAgIH1cbiAgICBwaWUudmFsdWUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB2YWx1ZTtcbiAgICAgIHZhbHVlID0gXztcbiAgICAgIHJldHVybiBwaWU7XG4gICAgfTtcbiAgICBwaWUuc29ydCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNvcnQ7XG4gICAgICBzb3J0ID0gXztcbiAgICAgIHJldHVybiBwaWU7XG4gICAgfTtcbiAgICBwaWUuc3RhcnRBbmdsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHN0YXJ0QW5nbGU7XG4gICAgICBzdGFydEFuZ2xlID0gXztcbiAgICAgIHJldHVybiBwaWU7XG4gICAgfTtcbiAgICBwaWUuZW5kQW5nbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBlbmRBbmdsZTtcbiAgICAgIGVuZEFuZ2xlID0gXztcbiAgICAgIHJldHVybiBwaWU7XG4gICAgfTtcbiAgICBwaWUucGFkQW5nbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBwYWRBbmdsZTtcbiAgICAgIHBhZEFuZ2xlID0gXztcbiAgICAgIHJldHVybiBwaWU7XG4gICAgfTtcbiAgICByZXR1cm4gcGllO1xuICB9O1xuICB2YXIgZDNfbGF5b3V0X3BpZVNvcnRCeVZhbHVlID0ge307XG4gIGQzLmxheW91dC5zdGFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBkM19pZGVudGl0eSwgb3JkZXIgPSBkM19sYXlvdXRfc3RhY2tPcmRlckRlZmF1bHQsIG9mZnNldCA9IGQzX2xheW91dF9zdGFja09mZnNldFplcm8sIG91dCA9IGQzX2xheW91dF9zdGFja091dCwgeCA9IGQzX2xheW91dF9zdGFja1gsIHkgPSBkM19sYXlvdXRfc3RhY2tZO1xuICAgIGZ1bmN0aW9uIHN0YWNrKGRhdGEsIGluZGV4KSB7XG4gICAgICBpZiAoIShuID0gZGF0YS5sZW5ndGgpKSByZXR1cm4gZGF0YTtcbiAgICAgIHZhciBzZXJpZXMgPSBkYXRhLm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXMuY2FsbChzdGFjaywgZCwgaSk7XG4gICAgICB9KTtcbiAgICAgIHZhciBwb2ludHMgPSBzZXJpZXMubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGQubWFwKGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAgICAgICByZXR1cm4gWyB4LmNhbGwoc3RhY2ssIHYsIGkpLCB5LmNhbGwoc3RhY2ssIHYsIGkpIF07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB2YXIgb3JkZXJzID0gb3JkZXIuY2FsbChzdGFjaywgcG9pbnRzLCBpbmRleCk7XG4gICAgICBzZXJpZXMgPSBkMy5wZXJtdXRlKHNlcmllcywgb3JkZXJzKTtcbiAgICAgIHBvaW50cyA9IGQzLnBlcm11dGUocG9pbnRzLCBvcmRlcnMpO1xuICAgICAgdmFyIG9mZnNldHMgPSBvZmZzZXQuY2FsbChzdGFjaywgcG9pbnRzLCBpbmRleCk7XG4gICAgICB2YXIgbSA9IHNlcmllc1swXS5sZW5ndGgsIG4sIGksIGosIG87XG4gICAgICBmb3IgKGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgICAgIG91dC5jYWxsKHN0YWNrLCBzZXJpZXNbMF1bal0sIG8gPSBvZmZzZXRzW2pdLCBwb2ludHNbMF1bal1bMV0pO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgb3V0LmNhbGwoc3RhY2ssIHNlcmllc1tpXVtqXSwgbyArPSBwb2ludHNbaSAtIDFdW2pdWzFdLCBwb2ludHNbaV1bal1bMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgc3RhY2sudmFsdWVzID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdmFsdWVzO1xuICAgICAgdmFsdWVzID0geDtcbiAgICAgIHJldHVybiBzdGFjaztcbiAgICB9O1xuICAgIHN0YWNrLm9yZGVyID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JkZXI7XG4gICAgICBvcmRlciA9IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyB4IDogZDNfbGF5b3V0X3N0YWNrT3JkZXJzLmdldCh4KSB8fCBkM19sYXlvdXRfc3RhY2tPcmRlckRlZmF1bHQ7XG4gICAgICByZXR1cm4gc3RhY2s7XG4gICAgfTtcbiAgICBzdGFjay5vZmZzZXQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvZmZzZXQ7XG4gICAgICBvZmZzZXQgPSB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiID8geCA6IGQzX2xheW91dF9zdGFja09mZnNldHMuZ2V0KHgpIHx8IGQzX2xheW91dF9zdGFja09mZnNldFplcm87XG4gICAgICByZXR1cm4gc3RhY2s7XG4gICAgfTtcbiAgICBzdGFjay54ID0gZnVuY3Rpb24oeikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geDtcbiAgICAgIHggPSB6O1xuICAgICAgcmV0dXJuIHN0YWNrO1xuICAgIH07XG4gICAgc3RhY2sueSA9IGZ1bmN0aW9uKHopIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHk7XG4gICAgICB5ID0gejtcbiAgICAgIHJldHVybiBzdGFjaztcbiAgICB9O1xuICAgIHN0YWNrLm91dCA9IGZ1bmN0aW9uKHopIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG91dDtcbiAgICAgIG91dCA9IHo7XG4gICAgICByZXR1cm4gc3RhY2s7XG4gICAgfTtcbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9zdGFja1goZCkge1xuICAgIHJldHVybiBkLng7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3N0YWNrWShkKSB7XG4gICAgcmV0dXJuIGQueTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfc3RhY2tPdXQoZCwgeTAsIHkpIHtcbiAgICBkLnkwID0geTA7XG4gICAgZC55ID0geTtcbiAgfVxuICB2YXIgZDNfbGF5b3V0X3N0YWNrT3JkZXJzID0gZDMubWFwKHtcbiAgICBcImluc2lkZS1vdXRcIjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIG4gPSBkYXRhLmxlbmd0aCwgaSwgaiwgbWF4ID0gZGF0YS5tYXAoZDNfbGF5b3V0X3N0YWNrTWF4SW5kZXgpLCBzdW1zID0gZGF0YS5tYXAoZDNfbGF5b3V0X3N0YWNrUmVkdWNlU3VtKSwgaW5kZXggPSBkMy5yYW5nZShuKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIG1heFthXSAtIG1heFtiXTtcbiAgICAgIH0pLCB0b3AgPSAwLCBib3R0b20gPSAwLCB0b3BzID0gW10sIGJvdHRvbXMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaiA9IGluZGV4W2ldO1xuICAgICAgICBpZiAodG9wIDwgYm90dG9tKSB7XG4gICAgICAgICAgdG9wICs9IHN1bXNbal07XG4gICAgICAgICAgdG9wcy5wdXNoKGopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvdHRvbSArPSBzdW1zW2pdO1xuICAgICAgICAgIGJvdHRvbXMucHVzaChqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJvdHRvbXMucmV2ZXJzZSgpLmNvbmNhdCh0b3BzKTtcbiAgICB9LFxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBkMy5yYW5nZShkYXRhLmxlbmd0aCkucmV2ZXJzZSgpO1xuICAgIH0sXG4gICAgXCJkZWZhdWx0XCI6IGQzX2xheW91dF9zdGFja09yZGVyRGVmYXVsdFxuICB9KTtcbiAgdmFyIGQzX2xheW91dF9zdGFja09mZnNldHMgPSBkMy5tYXAoe1xuICAgIHNpbGhvdWV0dGU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBuID0gZGF0YS5sZW5ndGgsIG0gPSBkYXRhWzBdLmxlbmd0aCwgc3VtcyA9IFtdLCBtYXggPSAwLCBpLCBqLCBvLCB5MCA9IFtdO1xuICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikge1xuICAgICAgICBmb3IgKGkgPSAwLCBvID0gMDsgaSA8IG47IGkrKykgbyArPSBkYXRhW2ldW2pdWzFdO1xuICAgICAgICBpZiAobyA+IG1heCkgbWF4ID0gbztcbiAgICAgICAgc3Vtcy5wdXNoKG8pO1xuICAgICAgfVxuICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikge1xuICAgICAgICB5MFtqXSA9IChtYXggLSBzdW1zW2pdKSAvIDI7XG4gICAgICB9XG4gICAgICByZXR1cm4geTA7XG4gICAgfSxcbiAgICB3aWdnbGU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBuID0gZGF0YS5sZW5ndGgsIHggPSBkYXRhWzBdLCBtID0geC5sZW5ndGgsIGksIGosIGssIHMxLCBzMiwgczMsIGR4LCBvLCBvMCwgeTAgPSBbXTtcbiAgICAgIHkwWzBdID0gbyA9IG8wID0gMDtcbiAgICAgIGZvciAoaiA9IDE7IGogPCBtOyArK2opIHtcbiAgICAgICAgZm9yIChpID0gMCwgczEgPSAwOyBpIDwgbjsgKytpKSBzMSArPSBkYXRhW2ldW2pdWzFdO1xuICAgICAgICBmb3IgKGkgPSAwLCBzMiA9IDAsIGR4ID0geFtqXVswXSAtIHhbaiAtIDFdWzBdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgZm9yIChrID0gMCwgczMgPSAoZGF0YVtpXVtqXVsxXSAtIGRhdGFbaV1baiAtIDFdWzFdKSAvICgyICogZHgpOyBrIDwgaTsgKytrKSB7XG4gICAgICAgICAgICBzMyArPSAoZGF0YVtrXVtqXVsxXSAtIGRhdGFba11baiAtIDFdWzFdKSAvIGR4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzMiArPSBzMyAqIGRhdGFbaV1bal1bMV07XG4gICAgICAgIH1cbiAgICAgICAgeTBbal0gPSBvIC09IHMxID8gczIgLyBzMSAqIGR4IDogMDtcbiAgICAgICAgaWYgKG8gPCBvMCkgbzAgPSBvO1xuICAgICAgfVxuICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikgeTBbal0gLT0gbzA7XG4gICAgICByZXR1cm4geTA7XG4gICAgfSxcbiAgICBleHBhbmQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBuID0gZGF0YS5sZW5ndGgsIG0gPSBkYXRhWzBdLmxlbmd0aCwgayA9IDEgLyBuLCBpLCBqLCBvLCB5MCA9IFtdO1xuICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikge1xuICAgICAgICBmb3IgKGkgPSAwLCBvID0gMDsgaSA8IG47IGkrKykgbyArPSBkYXRhW2ldW2pdWzFdO1xuICAgICAgICBpZiAobykgZm9yIChpID0gMDsgaSA8IG47IGkrKykgZGF0YVtpXVtqXVsxXSAvPSBvOyBlbHNlIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIGRhdGFbaV1bal1bMV0gPSBrO1xuICAgICAgfVxuICAgICAgZm9yIChqID0gMDsgaiA8IG07ICsraikgeTBbal0gPSAwO1xuICAgICAgcmV0dXJuIHkwO1xuICAgIH0sXG4gICAgemVybzogZDNfbGF5b3V0X3N0YWNrT2Zmc2V0WmVyb1xuICB9KTtcbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3N0YWNrT3JkZXJEZWZhdWx0KGRhdGEpIHtcbiAgICByZXR1cm4gZDMucmFuZ2UoZGF0YS5sZW5ndGgpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9zdGFja09mZnNldFplcm8oZGF0YSkge1xuICAgIHZhciBqID0gLTEsIG0gPSBkYXRhWzBdLmxlbmd0aCwgeTAgPSBbXTtcbiAgICB3aGlsZSAoKytqIDwgbSkgeTBbal0gPSAwO1xuICAgIHJldHVybiB5MDtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfc3RhY2tNYXhJbmRleChhcnJheSkge1xuICAgIHZhciBpID0gMSwgaiA9IDAsIHYgPSBhcnJheVswXVsxXSwgaywgbiA9IGFycmF5Lmxlbmd0aDtcbiAgICBmb3IgKDtpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKGsgPSBhcnJheVtpXVsxXSkgPiB2KSB7XG4gICAgICAgIGogPSBpO1xuICAgICAgICB2ID0gaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGo7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3N0YWNrUmVkdWNlU3VtKGQpIHtcbiAgICByZXR1cm4gZC5yZWR1Y2UoZDNfbGF5b3V0X3N0YWNrU3VtLCAwKTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfc3RhY2tTdW0ocCwgZCkge1xuICAgIHJldHVybiBwICsgZFsxXTtcbiAgfVxuICBkMy5sYXlvdXQuaGlzdG9ncmFtID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZyZXF1ZW5jeSA9IHRydWUsIHZhbHVlciA9IE51bWJlciwgcmFuZ2VyID0gZDNfbGF5b3V0X2hpc3RvZ3JhbVJhbmdlLCBiaW5uZXIgPSBkM19sYXlvdXRfaGlzdG9ncmFtQmluU3R1cmdlcztcbiAgICBmdW5jdGlvbiBoaXN0b2dyYW0oZGF0YSwgaSkge1xuICAgICAgdmFyIGJpbnMgPSBbXSwgdmFsdWVzID0gZGF0YS5tYXAodmFsdWVyLCB0aGlzKSwgcmFuZ2UgPSByYW5nZXIuY2FsbCh0aGlzLCB2YWx1ZXMsIGkpLCB0aHJlc2hvbGRzID0gYmlubmVyLmNhbGwodGhpcywgcmFuZ2UsIHZhbHVlcywgaSksIGJpbiwgaSA9IC0xLCBuID0gdmFsdWVzLmxlbmd0aCwgbSA9IHRocmVzaG9sZHMubGVuZ3RoIC0gMSwgayA9IGZyZXF1ZW5jeSA/IDEgOiAxIC8gbiwgeDtcbiAgICAgIHdoaWxlICgrK2kgPCBtKSB7XG4gICAgICAgIGJpbiA9IGJpbnNbaV0gPSBbXTtcbiAgICAgICAgYmluLmR4ID0gdGhyZXNob2xkc1tpICsgMV0gLSAoYmluLnggPSB0aHJlc2hvbGRzW2ldKTtcbiAgICAgICAgYmluLnkgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKG0gPiAwKSB7XG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICB4ID0gdmFsdWVzW2ldO1xuICAgICAgICAgIGlmICh4ID49IHJhbmdlWzBdICYmIHggPD0gcmFuZ2VbMV0pIHtcbiAgICAgICAgICAgIGJpbiA9IGJpbnNbZDMuYmlzZWN0KHRocmVzaG9sZHMsIHgsIDEsIG0pIC0gMV07XG4gICAgICAgICAgICBiaW4ueSArPSBrO1xuICAgICAgICAgICAgYmluLnB1c2goZGF0YVtpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmlucztcbiAgICB9XG4gICAgaGlzdG9ncmFtLnZhbHVlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdmFsdWVyO1xuICAgICAgdmFsdWVyID0geDtcbiAgICAgIHJldHVybiBoaXN0b2dyYW07XG4gICAgfTtcbiAgICBoaXN0b2dyYW0ucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZXI7XG4gICAgICByYW5nZXIgPSBkM19mdW5jdG9yKHgpO1xuICAgICAgcmV0dXJuIGhpc3RvZ3JhbTtcbiAgICB9O1xuICAgIGhpc3RvZ3JhbS5iaW5zID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmlubmVyO1xuICAgICAgYmlubmVyID0gdHlwZW9mIHggPT09IFwibnVtYmVyXCIgPyBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICByZXR1cm4gZDNfbGF5b3V0X2hpc3RvZ3JhbUJpbkZpeGVkKHJhbmdlLCB4KTtcbiAgICAgIH0gOiBkM19mdW5jdG9yKHgpO1xuICAgICAgcmV0dXJuIGhpc3RvZ3JhbTtcbiAgICB9O1xuICAgIGhpc3RvZ3JhbS5mcmVxdWVuY3kgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBmcmVxdWVuY3k7XG4gICAgICBmcmVxdWVuY3kgPSAhIXg7XG4gICAgICByZXR1cm4gaGlzdG9ncmFtO1xuICAgIH07XG4gICAgcmV0dXJuIGhpc3RvZ3JhbTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2hpc3RvZ3JhbUJpblN0dXJnZXMocmFuZ2UsIHZhbHVlcykge1xuICAgIHJldHVybiBkM19sYXlvdXRfaGlzdG9ncmFtQmluRml4ZWQocmFuZ2UsIE1hdGguY2VpbChNYXRoLmxvZyh2YWx1ZXMubGVuZ3RoKSAvIE1hdGguTE4yICsgMSkpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9oaXN0b2dyYW1CaW5GaXhlZChyYW5nZSwgbikge1xuICAgIHZhciB4ID0gLTEsIGIgPSArcmFuZ2VbMF0sIG0gPSAocmFuZ2VbMV0gLSBiKSAvIG4sIGYgPSBbXTtcbiAgICB3aGlsZSAoKyt4IDw9IG4pIGZbeF0gPSBtICogeCArIGI7XG4gICAgcmV0dXJuIGY7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X2hpc3RvZ3JhbVJhbmdlKHZhbHVlcykge1xuICAgIHJldHVybiBbIGQzLm1pbih2YWx1ZXMpLCBkMy5tYXgodmFsdWVzKSBdO1xuICB9XG4gIGQzLmxheW91dC5wYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhpZXJhcmNoeSA9IGQzLmxheW91dC5oaWVyYXJjaHkoKS5zb3J0KGQzX2xheW91dF9wYWNrU29ydCksIHBhZGRpbmcgPSAwLCBzaXplID0gWyAxLCAxIF0sIHJhZGl1cztcbiAgICBmdW5jdGlvbiBwYWNrKGQsIGkpIHtcbiAgICAgIHZhciBub2RlcyA9IGhpZXJhcmNoeS5jYWxsKHRoaXMsIGQsIGkpLCByb290ID0gbm9kZXNbMF0sIHcgPSBzaXplWzBdLCBoID0gc2l6ZVsxXSwgciA9IHJhZGl1cyA9PSBudWxsID8gTWF0aC5zcXJ0IDogdHlwZW9mIHJhZGl1cyA9PT0gXCJmdW5jdGlvblwiID8gcmFkaXVzIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByYWRpdXM7XG4gICAgICB9O1xuICAgICAgcm9vdC54ID0gcm9vdC55ID0gMDtcbiAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEFmdGVyKHJvb3QsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgZC5yID0gK3IoZC52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEFmdGVyKHJvb3QsIGQzX2xheW91dF9wYWNrU2libGluZ3MpO1xuICAgICAgaWYgKHBhZGRpbmcpIHtcbiAgICAgICAgdmFyIGRyID0gcGFkZGluZyAqIChyYWRpdXMgPyAxIDogTWF0aC5tYXgoMiAqIHJvb3QuciAvIHcsIDIgKiByb290LnIgLyBoKSkgLyAyO1xuICAgICAgICBkM19sYXlvdXRfaGllcmFyY2h5VmlzaXRBZnRlcihyb290LCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgZC5yICs9IGRyO1xuICAgICAgICB9KTtcbiAgICAgICAgZDNfbGF5b3V0X2hpZXJhcmNoeVZpc2l0QWZ0ZXIocm9vdCwgZDNfbGF5b3V0X3BhY2tTaWJsaW5ncyk7XG4gICAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEFmdGVyKHJvb3QsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkLnIgLT0gZHI7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZDNfbGF5b3V0X3BhY2tUcmFuc2Zvcm0ocm9vdCwgdyAvIDIsIGggLyAyLCByYWRpdXMgPyAxIDogMSAvIE1hdGgubWF4KDIgKiByb290LnIgLyB3LCAyICogcm9vdC5yIC8gaCkpO1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgICBwYWNrLnNpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaXplO1xuICAgICAgc2l6ZSA9IF87XG4gICAgICByZXR1cm4gcGFjaztcbiAgICB9O1xuICAgIHBhY2sucmFkaXVzID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFkaXVzO1xuICAgICAgcmFkaXVzID0gXyA9PSBudWxsIHx8IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogK187XG4gICAgICByZXR1cm4gcGFjaztcbiAgICB9O1xuICAgIHBhY2sucGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHBhZGRpbmc7XG4gICAgICBwYWRkaW5nID0gK187XG4gICAgICByZXR1cm4gcGFjaztcbiAgICB9O1xuICAgIHJldHVybiBkM19sYXlvdXRfaGllcmFyY2h5UmViaW5kKHBhY2ssIGhpZXJhcmNoeSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9wYWNrU29ydChhLCBiKSB7XG4gICAgcmV0dXJuIGEudmFsdWUgLSBiLnZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9wYWNrSW5zZXJ0KGEsIGIpIHtcbiAgICB2YXIgYyA9IGEuX3BhY2tfbmV4dDtcbiAgICBhLl9wYWNrX25leHQgPSBiO1xuICAgIGIuX3BhY2tfcHJldiA9IGE7XG4gICAgYi5fcGFja19uZXh0ID0gYztcbiAgICBjLl9wYWNrX3ByZXYgPSBiO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9wYWNrU3BsaWNlKGEsIGIpIHtcbiAgICBhLl9wYWNrX25leHQgPSBiO1xuICAgIGIuX3BhY2tfcHJldiA9IGE7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3BhY2tJbnRlcnNlY3RzKGEsIGIpIHtcbiAgICB2YXIgZHggPSBiLnggLSBhLngsIGR5ID0gYi55IC0gYS55LCBkciA9IGEuciArIGIucjtcbiAgICByZXR1cm4gLjk5OSAqIGRyICogZHIgPiBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfcGFja1NpYmxpbmdzKG5vZGUpIHtcbiAgICBpZiAoIShub2RlcyA9IG5vZGUuY2hpbGRyZW4pIHx8ICEobiA9IG5vZGVzLmxlbmd0aCkpIHJldHVybjtcbiAgICB2YXIgbm9kZXMsIHhNaW4gPSBJbmZpbml0eSwgeE1heCA9IC1JbmZpbml0eSwgeU1pbiA9IEluZmluaXR5LCB5TWF4ID0gLUluZmluaXR5LCBhLCBiLCBjLCBpLCBqLCBrLCBuO1xuICAgIGZ1bmN0aW9uIGJvdW5kKG5vZGUpIHtcbiAgICAgIHhNaW4gPSBNYXRoLm1pbihub2RlLnggLSBub2RlLnIsIHhNaW4pO1xuICAgICAgeE1heCA9IE1hdGgubWF4KG5vZGUueCArIG5vZGUuciwgeE1heCk7XG4gICAgICB5TWluID0gTWF0aC5taW4obm9kZS55IC0gbm9kZS5yLCB5TWluKTtcbiAgICAgIHlNYXggPSBNYXRoLm1heChub2RlLnkgKyBub2RlLnIsIHlNYXgpO1xuICAgIH1cbiAgICBub2Rlcy5mb3JFYWNoKGQzX2xheW91dF9wYWNrTGluayk7XG4gICAgYSA9IG5vZGVzWzBdO1xuICAgIGEueCA9IC1hLnI7XG4gICAgYS55ID0gMDtcbiAgICBib3VuZChhKTtcbiAgICBpZiAobiA+IDEpIHtcbiAgICAgIGIgPSBub2Rlc1sxXTtcbiAgICAgIGIueCA9IGIucjtcbiAgICAgIGIueSA9IDA7XG4gICAgICBib3VuZChiKTtcbiAgICAgIGlmIChuID4gMikge1xuICAgICAgICBjID0gbm9kZXNbMl07XG4gICAgICAgIGQzX2xheW91dF9wYWNrUGxhY2UoYSwgYiwgYyk7XG4gICAgICAgIGJvdW5kKGMpO1xuICAgICAgICBkM19sYXlvdXRfcGFja0luc2VydChhLCBjKTtcbiAgICAgICAgYS5fcGFja19wcmV2ID0gYztcbiAgICAgICAgZDNfbGF5b3V0X3BhY2tJbnNlcnQoYywgYik7XG4gICAgICAgIGIgPSBhLl9wYWNrX25leHQ7XG4gICAgICAgIGZvciAoaSA9IDM7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICBkM19sYXlvdXRfcGFja1BsYWNlKGEsIGIsIGMgPSBub2Rlc1tpXSk7XG4gICAgICAgICAgdmFyIGlzZWN0ID0gMCwgczEgPSAxLCBzMiA9IDE7XG4gICAgICAgICAgZm9yIChqID0gYi5fcGFja19uZXh0OyBqICE9PSBiOyBqID0gai5fcGFja19uZXh0LCBzMSsrKSB7XG4gICAgICAgICAgICBpZiAoZDNfbGF5b3V0X3BhY2tJbnRlcnNlY3RzKGosIGMpKSB7XG4gICAgICAgICAgICAgIGlzZWN0ID0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc2VjdCA9PSAxKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSBhLl9wYWNrX3ByZXY7IGsgIT09IGouX3BhY2tfcHJldjsgayA9IGsuX3BhY2tfcHJldiwgczIrKykge1xuICAgICAgICAgICAgICBpZiAoZDNfbGF5b3V0X3BhY2tJbnRlcnNlY3RzKGssIGMpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzZWN0KSB7XG4gICAgICAgICAgICBpZiAoczEgPCBzMiB8fCBzMSA9PSBzMiAmJiBiLnIgPCBhLnIpIGQzX2xheW91dF9wYWNrU3BsaWNlKGEsIGIgPSBqKTsgZWxzZSBkM19sYXlvdXRfcGFja1NwbGljZShhID0gaywgYik7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGQzX2xheW91dF9wYWNrSW5zZXJ0KGEsIGMpO1xuICAgICAgICAgICAgYiA9IGM7XG4gICAgICAgICAgICBib3VuZChjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGN4ID0gKHhNaW4gKyB4TWF4KSAvIDIsIGN5ID0gKHlNaW4gKyB5TWF4KSAvIDIsIGNyID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICBjID0gbm9kZXNbaV07XG4gICAgICBjLnggLT0gY3g7XG4gICAgICBjLnkgLT0gY3k7XG4gICAgICBjciA9IE1hdGgubWF4KGNyLCBjLnIgKyBNYXRoLnNxcnQoYy54ICogYy54ICsgYy55ICogYy55KSk7XG4gICAgfVxuICAgIG5vZGUuciA9IGNyO1xuICAgIG5vZGVzLmZvckVhY2goZDNfbGF5b3V0X3BhY2tVbmxpbmspO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9wYWNrTGluayhub2RlKSB7XG4gICAgbm9kZS5fcGFja19uZXh0ID0gbm9kZS5fcGFja19wcmV2ID0gbm9kZTtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfcGFja1VubGluayhub2RlKSB7XG4gICAgZGVsZXRlIG5vZGUuX3BhY2tfbmV4dDtcbiAgICBkZWxldGUgbm9kZS5fcGFja19wcmV2O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9wYWNrVHJhbnNmb3JtKG5vZGUsIHgsIHksIGspIHtcbiAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIG5vZGUueCA9IHggKz0gayAqIG5vZGUueDtcbiAgICBub2RlLnkgPSB5ICs9IGsgKiBub2RlLnk7XG4gICAgbm9kZS5yICo9IGs7XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICB2YXIgaSA9IC0xLCBuID0gY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGQzX2xheW91dF9wYWNrVHJhbnNmb3JtKGNoaWxkcmVuW2ldLCB4LCB5LCBrKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3BhY2tQbGFjZShhLCBiLCBjKSB7XG4gICAgdmFyIGRiID0gYS5yICsgYy5yLCBkeCA9IGIueCAtIGEueCwgZHkgPSBiLnkgLSBhLnk7XG4gICAgaWYgKGRiICYmIChkeCB8fCBkeSkpIHtcbiAgICAgIHZhciBkYSA9IGIuciArIGMuciwgZGMgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgIGRhICo9IGRhO1xuICAgICAgZGIgKj0gZGI7XG4gICAgICB2YXIgeCA9IC41ICsgKGRiIC0gZGEpIC8gKDIgKiBkYyksIHkgPSBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgMiAqIGRhICogKGRiICsgZGMpIC0gKGRiIC09IGRjKSAqIGRiIC0gZGEgKiBkYSkpIC8gKDIgKiBkYyk7XG4gICAgICBjLnggPSBhLnggKyB4ICogZHggKyB5ICogZHk7XG4gICAgICBjLnkgPSBhLnkgKyB4ICogZHkgLSB5ICogZHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGMueCA9IGEueCArIGRiO1xuICAgICAgYy55ID0gYS55O1xuICAgIH1cbiAgfVxuICBkMy5sYXlvdXQudHJlZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoaWVyYXJjaHkgPSBkMy5sYXlvdXQuaGllcmFyY2h5KCkuc29ydChudWxsKS52YWx1ZShudWxsKSwgc2VwYXJhdGlvbiA9IGQzX2xheW91dF90cmVlU2VwYXJhdGlvbiwgc2l6ZSA9IFsgMSwgMSBdLCBub2RlU2l6ZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gdHJlZShkLCBpKSB7XG4gICAgICB2YXIgbm9kZXMgPSBoaWVyYXJjaHkuY2FsbCh0aGlzLCBkLCBpKSwgcm9vdDAgPSBub2Rlc1swXSwgcm9vdDEgPSB3cmFwVHJlZShyb290MCk7XG4gICAgICBkM19sYXlvdXRfaGllcmFyY2h5VmlzaXRBZnRlcihyb290MSwgZmlyc3RXYWxrKSwgcm9vdDEucGFyZW50Lm0gPSAtcm9vdDEuejtcbiAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEJlZm9yZShyb290MSwgc2Vjb25kV2Fsayk7XG4gICAgICBpZiAobm9kZVNpemUpIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEJlZm9yZShyb290MCwgc2l6ZU5vZGUpOyBlbHNlIHtcbiAgICAgICAgdmFyIGxlZnQgPSByb290MCwgcmlnaHQgPSByb290MCwgYm90dG9tID0gcm9vdDA7XG4gICAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEJlZm9yZShyb290MCwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIGlmIChub2RlLnggPCBsZWZ0LngpIGxlZnQgPSBub2RlO1xuICAgICAgICAgIGlmIChub2RlLnggPiByaWdodC54KSByaWdodCA9IG5vZGU7XG4gICAgICAgICAgaWYgKG5vZGUuZGVwdGggPiBib3R0b20uZGVwdGgpIGJvdHRvbSA9IG5vZGU7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgdHggPSBzZXBhcmF0aW9uKGxlZnQsIHJpZ2h0KSAvIDIgLSBsZWZ0LngsIGt4ID0gc2l6ZVswXSAvIChyaWdodC54ICsgc2VwYXJhdGlvbihyaWdodCwgbGVmdCkgLyAyICsgdHgpLCBreSA9IHNpemVbMV0gLyAoYm90dG9tLmRlcHRoIHx8IDEpO1xuICAgICAgICBkM19sYXlvdXRfaGllcmFyY2h5VmlzaXRCZWZvcmUocm9vdDAsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICBub2RlLnggPSAobm9kZS54ICsgdHgpICoga3g7XG4gICAgICAgICAgbm9kZS55ID0gbm9kZS5kZXB0aCAqIGt5O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gd3JhcFRyZWUocm9vdDApIHtcbiAgICAgIHZhciByb290MSA9IHtcbiAgICAgICAgQTogbnVsbCxcbiAgICAgICAgY2hpbGRyZW46IFsgcm9vdDAgXVxuICAgICAgfSwgcXVldWUgPSBbIHJvb3QxIF0sIG5vZGUxO1xuICAgICAgd2hpbGUgKChub2RlMSA9IHF1ZXVlLnBvcCgpKSAhPSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIGNoaWxkcmVuID0gbm9kZTEuY2hpbGRyZW4sIGNoaWxkLCBpID0gMCwgbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgIHF1ZXVlLnB1c2goKGNoaWxkcmVuW2ldID0gY2hpbGQgPSB7XG4gICAgICAgICAgICBfOiBjaGlsZHJlbltpXSxcbiAgICAgICAgICAgIHBhcmVudDogbm9kZTEsXG4gICAgICAgICAgICBjaGlsZHJlbjogKGNoaWxkID0gY2hpbGRyZW5baV0uY2hpbGRyZW4pICYmIGNoaWxkLnNsaWNlKCkgfHwgW10sXG4gICAgICAgICAgICBBOiBudWxsLFxuICAgICAgICAgICAgYTogbnVsbCxcbiAgICAgICAgICAgIHo6IDAsXG4gICAgICAgICAgICBtOiAwLFxuICAgICAgICAgICAgYzogMCxcbiAgICAgICAgICAgIHM6IDAsXG4gICAgICAgICAgICB0OiBudWxsLFxuICAgICAgICAgICAgaTogaVxuICAgICAgICAgIH0pLmEgPSBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290MS5jaGlsZHJlblswXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmlyc3RXYWxrKHYpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHYuY2hpbGRyZW4sIHNpYmxpbmdzID0gdi5wYXJlbnQuY2hpbGRyZW4sIHcgPSB2LmkgPyBzaWJsaW5nc1t2LmkgLSAxXSA6IG51bGw7XG4gICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIGQzX2xheW91dF90cmVlU2hpZnQodik7XG4gICAgICAgIHZhciBtaWRwb2ludCA9IChjaGlsZHJlblswXS56ICsgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0ueikgLyAyO1xuICAgICAgICBpZiAodykge1xuICAgICAgICAgIHYueiA9IHcueiArIHNlcGFyYXRpb24odi5fLCB3Ll8pO1xuICAgICAgICAgIHYubSA9IHYueiAtIG1pZHBvaW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHYueiA9IG1pZHBvaW50O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHcpIHtcbiAgICAgICAgdi56ID0gdy56ICsgc2VwYXJhdGlvbih2Ll8sIHcuXyk7XG4gICAgICB9XG4gICAgICB2LnBhcmVudC5BID0gYXBwb3J0aW9uKHYsIHcsIHYucGFyZW50LkEgfHwgc2libGluZ3NbMF0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZWNvbmRXYWxrKHYpIHtcbiAgICAgIHYuXy54ID0gdi56ICsgdi5wYXJlbnQubTtcbiAgICAgIHYubSArPSB2LnBhcmVudC5tO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhcHBvcnRpb24odiwgdywgYW5jZXN0b3IpIHtcbiAgICAgIGlmICh3KSB7XG4gICAgICAgIHZhciB2aXAgPSB2LCB2b3AgPSB2LCB2aW0gPSB3LCB2b20gPSB2aXAucGFyZW50LmNoaWxkcmVuWzBdLCBzaXAgPSB2aXAubSwgc29wID0gdm9wLm0sIHNpbSA9IHZpbS5tLCBzb20gPSB2b20ubSwgc2hpZnQ7XG4gICAgICAgIHdoaWxlICh2aW0gPSBkM19sYXlvdXRfdHJlZVJpZ2h0KHZpbSksIHZpcCA9IGQzX2xheW91dF90cmVlTGVmdCh2aXApLCB2aW0gJiYgdmlwKSB7XG4gICAgICAgICAgdm9tID0gZDNfbGF5b3V0X3RyZWVMZWZ0KHZvbSk7XG4gICAgICAgICAgdm9wID0gZDNfbGF5b3V0X3RyZWVSaWdodCh2b3ApO1xuICAgICAgICAgIHZvcC5hID0gdjtcbiAgICAgICAgICBzaGlmdCA9IHZpbS56ICsgc2ltIC0gdmlwLnogLSBzaXAgKyBzZXBhcmF0aW9uKHZpbS5fLCB2aXAuXyk7XG4gICAgICAgICAgaWYgKHNoaWZ0ID4gMCkge1xuICAgICAgICAgICAgZDNfbGF5b3V0X3RyZWVNb3ZlKGQzX2xheW91dF90cmVlQW5jZXN0b3IodmltLCB2LCBhbmNlc3RvciksIHYsIHNoaWZ0KTtcbiAgICAgICAgICAgIHNpcCArPSBzaGlmdDtcbiAgICAgICAgICAgIHNvcCArPSBzaGlmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2ltICs9IHZpbS5tO1xuICAgICAgICAgIHNpcCArPSB2aXAubTtcbiAgICAgICAgICBzb20gKz0gdm9tLm07XG4gICAgICAgICAgc29wICs9IHZvcC5tO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aW0gJiYgIWQzX2xheW91dF90cmVlUmlnaHQodm9wKSkge1xuICAgICAgICAgIHZvcC50ID0gdmltO1xuICAgICAgICAgIHZvcC5tICs9IHNpbSAtIHNvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlwICYmICFkM19sYXlvdXRfdHJlZUxlZnQodm9tKSkge1xuICAgICAgICAgIHZvbS50ID0gdmlwO1xuICAgICAgICAgIHZvbS5tICs9IHNpcCAtIHNvbTtcbiAgICAgICAgICBhbmNlc3RvciA9IHY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhbmNlc3RvcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2l6ZU5vZGUobm9kZSkge1xuICAgICAgbm9kZS54ICo9IHNpemVbMF07XG4gICAgICBub2RlLnkgPSBub2RlLmRlcHRoICogc2l6ZVsxXTtcbiAgICB9XG4gICAgdHJlZS5zZXBhcmF0aW9uID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2VwYXJhdGlvbjtcbiAgICAgIHNlcGFyYXRpb24gPSB4O1xuICAgICAgcmV0dXJuIHRyZWU7XG4gICAgfTtcbiAgICB0cmVlLnNpemUgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBub2RlU2l6ZSA/IG51bGwgOiBzaXplO1xuICAgICAgbm9kZVNpemUgPSAoc2l6ZSA9IHgpID09IG51bGwgPyBzaXplTm9kZSA6IG51bGw7XG4gICAgICByZXR1cm4gdHJlZTtcbiAgICB9O1xuICAgIHRyZWUubm9kZVNpemUgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBub2RlU2l6ZSA/IHNpemUgOiBudWxsO1xuICAgICAgbm9kZVNpemUgPSAoc2l6ZSA9IHgpID09IG51bGwgPyBudWxsIDogc2l6ZU5vZGU7XG4gICAgICByZXR1cm4gdHJlZTtcbiAgICB9O1xuICAgIHJldHVybiBkM19sYXlvdXRfaGllcmFyY2h5UmViaW5kKHRyZWUsIGhpZXJhcmNoeSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX2xheW91dF90cmVlU2VwYXJhdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEucGFyZW50ID09IGIucGFyZW50ID8gMSA6IDI7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3RyZWVMZWZ0KHYpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB2LmNoaWxkcmVuO1xuICAgIHJldHVybiBjaGlsZHJlbi5sZW5ndGggPyBjaGlsZHJlblswXSA6IHYudDtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfdHJlZVJpZ2h0KHYpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB2LmNoaWxkcmVuLCBuO1xuICAgIHJldHVybiAobiA9IGNoaWxkcmVuLmxlbmd0aCkgPyBjaGlsZHJlbltuIC0gMV0gOiB2LnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3RyZWVNb3ZlKHdtLCB3cCwgc2hpZnQpIHtcbiAgICB2YXIgY2hhbmdlID0gc2hpZnQgLyAod3AuaSAtIHdtLmkpO1xuICAgIHdwLmMgLT0gY2hhbmdlO1xuICAgIHdwLnMgKz0gc2hpZnQ7XG4gICAgd20uYyArPSBjaGFuZ2U7XG4gICAgd3AueiArPSBzaGlmdDtcbiAgICB3cC5tICs9IHNoaWZ0O1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF90cmVlU2hpZnQodikge1xuICAgIHZhciBzaGlmdCA9IDAsIGNoYW5nZSA9IDAsIGNoaWxkcmVuID0gdi5jaGlsZHJlbiwgaSA9IGNoaWxkcmVuLmxlbmd0aCwgdztcbiAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgIHcgPSBjaGlsZHJlbltpXTtcbiAgICAgIHcueiArPSBzaGlmdDtcbiAgICAgIHcubSArPSBzaGlmdDtcbiAgICAgIHNoaWZ0ICs9IHcucyArIChjaGFuZ2UgKz0gdy5jKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3RyZWVBbmNlc3Rvcih2aW0sIHYsIGFuY2VzdG9yKSB7XG4gICAgcmV0dXJuIHZpbS5hLnBhcmVudCA9PT0gdi5wYXJlbnQgPyB2aW0uYSA6IGFuY2VzdG9yO1xuICB9XG4gIGQzLmxheW91dC5jbHVzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhpZXJhcmNoeSA9IGQzLmxheW91dC5oaWVyYXJjaHkoKS5zb3J0KG51bGwpLnZhbHVlKG51bGwpLCBzZXBhcmF0aW9uID0gZDNfbGF5b3V0X3RyZWVTZXBhcmF0aW9uLCBzaXplID0gWyAxLCAxIF0sIG5vZGVTaXplID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gY2x1c3RlcihkLCBpKSB7XG4gICAgICB2YXIgbm9kZXMgPSBoaWVyYXJjaHkuY2FsbCh0aGlzLCBkLCBpKSwgcm9vdCA9IG5vZGVzWzBdLCBwcmV2aW91c05vZGUsIHggPSAwO1xuICAgICAgZDNfbGF5b3V0X2hpZXJhcmNoeVZpc2l0QWZ0ZXIocm9vdCwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgbm9kZS54ID0gZDNfbGF5b3V0X2NsdXN0ZXJYKGNoaWxkcmVuKTtcbiAgICAgICAgICBub2RlLnkgPSBkM19sYXlvdXRfY2x1c3RlclkoY2hpbGRyZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUueCA9IHByZXZpb3VzTm9kZSA/IHggKz0gc2VwYXJhdGlvbihub2RlLCBwcmV2aW91c05vZGUpIDogMDtcbiAgICAgICAgICBub2RlLnkgPSAwO1xuICAgICAgICAgIHByZXZpb3VzTm9kZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGxlZnQgPSBkM19sYXlvdXRfY2x1c3RlckxlZnQocm9vdCksIHJpZ2h0ID0gZDNfbGF5b3V0X2NsdXN0ZXJSaWdodChyb290KSwgeDAgPSBsZWZ0LnggLSBzZXBhcmF0aW9uKGxlZnQsIHJpZ2h0KSAvIDIsIHgxID0gcmlnaHQueCArIHNlcGFyYXRpb24ocmlnaHQsIGxlZnQpIC8gMjtcbiAgICAgIGQzX2xheW91dF9oaWVyYXJjaHlWaXNpdEFmdGVyKHJvb3QsIG5vZGVTaXplID8gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBub2RlLnggPSAobm9kZS54IC0gcm9vdC54KSAqIHNpemVbMF07XG4gICAgICAgIG5vZGUueSA9IChyb290LnkgLSBub2RlLnkpICogc2l6ZVsxXTtcbiAgICAgIH0gOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUueCA9IChub2RlLnggLSB4MCkgLyAoeDEgLSB4MCkgKiBzaXplWzBdO1xuICAgICAgICBub2RlLnkgPSAoMSAtIChyb290LnkgPyBub2RlLnkgLyByb290LnkgOiAxKSkgKiBzaXplWzFdO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICAgIGNsdXN0ZXIuc2VwYXJhdGlvbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNlcGFyYXRpb247XG4gICAgICBzZXBhcmF0aW9uID0geDtcbiAgICAgIHJldHVybiBjbHVzdGVyO1xuICAgIH07XG4gICAgY2x1c3Rlci5zaXplID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbm9kZVNpemUgPyBudWxsIDogc2l6ZTtcbiAgICAgIG5vZGVTaXplID0gKHNpemUgPSB4KSA9PSBudWxsO1xuICAgICAgcmV0dXJuIGNsdXN0ZXI7XG4gICAgfTtcbiAgICBjbHVzdGVyLm5vZGVTaXplID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbm9kZVNpemUgPyBzaXplIDogbnVsbDtcbiAgICAgIG5vZGVTaXplID0gKHNpemUgPSB4KSAhPSBudWxsO1xuICAgICAgcmV0dXJuIGNsdXN0ZXI7XG4gICAgfTtcbiAgICByZXR1cm4gZDNfbGF5b3V0X2hpZXJhcmNoeVJlYmluZChjbHVzdGVyLCBoaWVyYXJjaHkpO1xuICB9O1xuICBmdW5jdGlvbiBkM19sYXlvdXRfY2x1c3RlclkoY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gMSArIGQzLm1heChjaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIHJldHVybiBjaGlsZC55O1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9jbHVzdGVyWChjaGlsZHJlbikge1xuICAgIHJldHVybiBjaGlsZHJlbi5yZWR1Y2UoZnVuY3Rpb24oeCwgY2hpbGQpIHtcbiAgICAgIHJldHVybiB4ICsgY2hpbGQueDtcbiAgICB9LCAwKSAvIGNoaWxkcmVuLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBkM19sYXlvdXRfY2x1c3RlckxlZnQobm9kZSkge1xuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgcmV0dXJuIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA/IGQzX2xheW91dF9jbHVzdGVyTGVmdChjaGlsZHJlblswXSkgOiBub2RlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX2xheW91dF9jbHVzdGVyUmlnaHQobm9kZSkge1xuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4sIG47XG4gICAgcmV0dXJuIGNoaWxkcmVuICYmIChuID0gY2hpbGRyZW4ubGVuZ3RoKSA/IGQzX2xheW91dF9jbHVzdGVyUmlnaHQoY2hpbGRyZW5bbiAtIDFdKSA6IG5vZGU7XG4gIH1cbiAgZDMubGF5b3V0LnRyZWVtYXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGllcmFyY2h5ID0gZDMubGF5b3V0LmhpZXJhcmNoeSgpLCByb3VuZCA9IE1hdGgucm91bmQsIHNpemUgPSBbIDEsIDEgXSwgcGFkZGluZyA9IG51bGwsIHBhZCA9IGQzX2xheW91dF90cmVlbWFwUGFkTnVsbCwgc3RpY2t5ID0gZmFsc2UsIHN0aWNraWVzLCBtb2RlID0gXCJzcXVhcmlmeVwiLCByYXRpbyA9IC41ICogKDEgKyBNYXRoLnNxcnQoNSkpO1xuICAgIGZ1bmN0aW9uIHNjYWxlKGNoaWxkcmVuLCBrKSB7XG4gICAgICB2YXIgaSA9IC0xLCBuID0gY2hpbGRyZW4ubGVuZ3RoLCBjaGlsZCwgYXJlYTtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGFyZWEgPSAoY2hpbGQgPSBjaGlsZHJlbltpXSkudmFsdWUgKiAoayA8IDAgPyAwIDogayk7XG4gICAgICAgIGNoaWxkLmFyZWEgPSBpc05hTihhcmVhKSB8fCBhcmVhIDw9IDAgPyAwIDogYXJlYTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3F1YXJpZnkobm9kZSkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBwYWQobm9kZSksIHJvdyA9IFtdLCByZW1haW5pbmcgPSBjaGlsZHJlbi5zbGljZSgpLCBjaGlsZCwgYmVzdCA9IEluZmluaXR5LCBzY29yZSwgdSA9IG1vZGUgPT09IFwic2xpY2VcIiA/IHJlY3QuZHggOiBtb2RlID09PSBcImRpY2VcIiA/IHJlY3QuZHkgOiBtb2RlID09PSBcInNsaWNlLWRpY2VcIiA/IG5vZGUuZGVwdGggJiAxID8gcmVjdC5keSA6IHJlY3QuZHggOiBNYXRoLm1pbihyZWN0LmR4LCByZWN0LmR5KSwgbjtcbiAgICAgICAgc2NhbGUocmVtYWluaW5nLCByZWN0LmR4ICogcmVjdC5keSAvIG5vZGUudmFsdWUpO1xuICAgICAgICByb3cuYXJlYSA9IDA7XG4gICAgICAgIHdoaWxlICgobiA9IHJlbWFpbmluZy5sZW5ndGgpID4gMCkge1xuICAgICAgICAgIHJvdy5wdXNoKGNoaWxkID0gcmVtYWluaW5nW24gLSAxXSk7XG4gICAgICAgICAgcm93LmFyZWEgKz0gY2hpbGQuYXJlYTtcbiAgICAgICAgICBpZiAobW9kZSAhPT0gXCJzcXVhcmlmeVwiIHx8IChzY29yZSA9IHdvcnN0KHJvdywgdSkpIDw9IGJlc3QpIHtcbiAgICAgICAgICAgIHJlbWFpbmluZy5wb3AoKTtcbiAgICAgICAgICAgIGJlc3QgPSBzY29yZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93LmFyZWEgLT0gcm93LnBvcCgpLmFyZWE7XG4gICAgICAgICAgICBwb3NpdGlvbihyb3csIHUsIHJlY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIHUgPSBNYXRoLm1pbihyZWN0LmR4LCByZWN0LmR5KTtcbiAgICAgICAgICAgIHJvdy5sZW5ndGggPSByb3cuYXJlYSA9IDA7XG4gICAgICAgICAgICBiZXN0ID0gSW5maW5pdHk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyb3cubGVuZ3RoKSB7XG4gICAgICAgICAgcG9zaXRpb24ocm93LCB1LCByZWN0LCB0cnVlKTtcbiAgICAgICAgICByb3cubGVuZ3RoID0gcm93LmFyZWEgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goc3F1YXJpZnkpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdGlja2lmeShub2RlKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICB2YXIgcmVjdCA9IHBhZChub2RlKSwgcmVtYWluaW5nID0gY2hpbGRyZW4uc2xpY2UoKSwgY2hpbGQsIHJvdyA9IFtdO1xuICAgICAgICBzY2FsZShyZW1haW5pbmcsIHJlY3QuZHggKiByZWN0LmR5IC8gbm9kZS52YWx1ZSk7XG4gICAgICAgIHJvdy5hcmVhID0gMDtcbiAgICAgICAgd2hpbGUgKGNoaWxkID0gcmVtYWluaW5nLnBvcCgpKSB7XG4gICAgICAgICAgcm93LnB1c2goY2hpbGQpO1xuICAgICAgICAgIHJvdy5hcmVhICs9IGNoaWxkLmFyZWE7XG4gICAgICAgICAgaWYgKGNoaWxkLnogIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zaXRpb24ocm93LCBjaGlsZC56ID8gcmVjdC5keCA6IHJlY3QuZHksIHJlY3QsICFyZW1haW5pbmcubGVuZ3RoKTtcbiAgICAgICAgICAgIHJvdy5sZW5ndGggPSByb3cuYXJlYSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goc3RpY2tpZnkpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB3b3JzdChyb3csIHUpIHtcbiAgICAgIHZhciBzID0gcm93LmFyZWEsIHIsIHJtYXggPSAwLCBybWluID0gSW5maW5pdHksIGkgPSAtMSwgbiA9IHJvdy5sZW5ndGg7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBpZiAoIShyID0gcm93W2ldLmFyZWEpKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHIgPCBybWluKSBybWluID0gcjtcbiAgICAgICAgaWYgKHIgPiBybWF4KSBybWF4ID0gcjtcbiAgICAgIH1cbiAgICAgIHMgKj0gcztcbiAgICAgIHUgKj0gdTtcbiAgICAgIHJldHVybiBzID8gTWF0aC5tYXgodSAqIHJtYXggKiByYXRpbyAvIHMsIHMgLyAodSAqIHJtaW4gKiByYXRpbykpIDogSW5maW5pdHk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvc2l0aW9uKHJvdywgdSwgcmVjdCwgZmx1c2gpIHtcbiAgICAgIHZhciBpID0gLTEsIG4gPSByb3cubGVuZ3RoLCB4ID0gcmVjdC54LCB5ID0gcmVjdC55LCB2ID0gdSA/IHJvdW5kKHJvdy5hcmVhIC8gdSkgOiAwLCBvO1xuICAgICAgaWYgKHUgPT0gcmVjdC5keCkge1xuICAgICAgICBpZiAoZmx1c2ggfHwgdiA+IHJlY3QuZHkpIHYgPSByZWN0LmR5O1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIG8gPSByb3dbaV07XG4gICAgICAgICAgby54ID0geDtcbiAgICAgICAgICBvLnkgPSB5O1xuICAgICAgICAgIG8uZHkgPSB2O1xuICAgICAgICAgIHggKz0gby5keCA9IE1hdGgubWluKHJlY3QueCArIHJlY3QuZHggLSB4LCB2ID8gcm91bmQoby5hcmVhIC8gdikgOiAwKTtcbiAgICAgICAgfVxuICAgICAgICBvLnogPSB0cnVlO1xuICAgICAgICBvLmR4ICs9IHJlY3QueCArIHJlY3QuZHggLSB4O1xuICAgICAgICByZWN0LnkgKz0gdjtcbiAgICAgICAgcmVjdC5keSAtPSB2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZsdXNoIHx8IHYgPiByZWN0LmR4KSB2ID0gcmVjdC5keDtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBvID0gcm93W2ldO1xuICAgICAgICAgIG8ueCA9IHg7XG4gICAgICAgICAgby55ID0geTtcbiAgICAgICAgICBvLmR4ID0gdjtcbiAgICAgICAgICB5ICs9IG8uZHkgPSBNYXRoLm1pbihyZWN0LnkgKyByZWN0LmR5IC0geSwgdiA/IHJvdW5kKG8uYXJlYSAvIHYpIDogMCk7XG4gICAgICAgIH1cbiAgICAgICAgby56ID0gZmFsc2U7XG4gICAgICAgIG8uZHkgKz0gcmVjdC55ICsgcmVjdC5keSAtIHk7XG4gICAgICAgIHJlY3QueCArPSB2O1xuICAgICAgICByZWN0LmR4IC09IHY7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyZWVtYXAoZCkge1xuICAgICAgdmFyIG5vZGVzID0gc3RpY2tpZXMgfHwgaGllcmFyY2h5KGQpLCByb290ID0gbm9kZXNbMF07XG4gICAgICByb290LnggPSByb290LnkgPSAwO1xuICAgICAgaWYgKHJvb3QudmFsdWUpIHJvb3QuZHggPSBzaXplWzBdLCByb290LmR5ID0gc2l6ZVsxXTsgZWxzZSByb290LmR4ID0gcm9vdC5keSA9IDA7XG4gICAgICBpZiAoc3RpY2tpZXMpIGhpZXJhcmNoeS5yZXZhbHVlKHJvb3QpO1xuICAgICAgc2NhbGUoWyByb290IF0sIHJvb3QuZHggKiByb290LmR5IC8gcm9vdC52YWx1ZSk7XG4gICAgICAoc3RpY2tpZXMgPyBzdGlja2lmeSA6IHNxdWFyaWZ5KShyb290KTtcbiAgICAgIGlmIChzdGlja3kpIHN0aWNraWVzID0gbm9kZXM7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICAgIHRyZWVtYXAuc2l6ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNpemU7XG4gICAgICBzaXplID0geDtcbiAgICAgIHJldHVybiB0cmVlbWFwO1xuICAgIH07XG4gICAgdHJlZW1hcC5wYWRkaW5nID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcGFkZGluZztcbiAgICAgIGZ1bmN0aW9uIHBhZEZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIHAgPSB4LmNhbGwodHJlZW1hcCwgbm9kZSwgbm9kZS5kZXB0aCk7XG4gICAgICAgIHJldHVybiBwID09IG51bGwgPyBkM19sYXlvdXRfdHJlZW1hcFBhZE51bGwobm9kZSkgOiBkM19sYXlvdXRfdHJlZW1hcFBhZChub2RlLCB0eXBlb2YgcCA9PT0gXCJudW1iZXJcIiA/IFsgcCwgcCwgcCwgcCBdIDogcCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBwYWRDb25zdGFudChub2RlKSB7XG4gICAgICAgIHJldHVybiBkM19sYXlvdXRfdHJlZW1hcFBhZChub2RlLCB4KTtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlO1xuICAgICAgcGFkID0gKHBhZGRpbmcgPSB4KSA9PSBudWxsID8gZDNfbGF5b3V0X3RyZWVtYXBQYWROdWxsIDogKHR5cGUgPSB0eXBlb2YgeCkgPT09IFwiZnVuY3Rpb25cIiA/IHBhZEZ1bmN0aW9uIDogdHlwZSA9PT0gXCJudW1iZXJcIiA/ICh4ID0gWyB4LCB4LCB4LCB4IF0sIFxuICAgICAgcGFkQ29uc3RhbnQpIDogcGFkQ29uc3RhbnQ7XG4gICAgICByZXR1cm4gdHJlZW1hcDtcbiAgICB9O1xuICAgIHRyZWVtYXAucm91bmQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByb3VuZCAhPSBOdW1iZXI7XG4gICAgICByb3VuZCA9IHggPyBNYXRoLnJvdW5kIDogTnVtYmVyO1xuICAgICAgcmV0dXJuIHRyZWVtYXA7XG4gICAgfTtcbiAgICB0cmVlbWFwLnN0aWNreSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHN0aWNreTtcbiAgICAgIHN0aWNreSA9IHg7XG4gICAgICBzdGlja2llcyA9IG51bGw7XG4gICAgICByZXR1cm4gdHJlZW1hcDtcbiAgICB9O1xuICAgIHRyZWVtYXAucmF0aW8gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYXRpbztcbiAgICAgIHJhdGlvID0geDtcbiAgICAgIHJldHVybiB0cmVlbWFwO1xuICAgIH07XG4gICAgdHJlZW1hcC5tb2RlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbW9kZTtcbiAgICAgIG1vZGUgPSB4ICsgXCJcIjtcbiAgICAgIHJldHVybiB0cmVlbWFwO1xuICAgIH07XG4gICAgcmV0dXJuIGQzX2xheW91dF9oaWVyYXJjaHlSZWJpbmQodHJlZW1hcCwgaGllcmFyY2h5KTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3RyZWVtYXBQYWROdWxsKG5vZGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogbm9kZS54LFxuICAgICAgeTogbm9kZS55LFxuICAgICAgZHg6IG5vZGUuZHgsXG4gICAgICBkeTogbm9kZS5keVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfbGF5b3V0X3RyZWVtYXBQYWQobm9kZSwgcGFkZGluZykge1xuICAgIHZhciB4ID0gbm9kZS54ICsgcGFkZGluZ1szXSwgeSA9IG5vZGUueSArIHBhZGRpbmdbMF0sIGR4ID0gbm9kZS5keCAtIHBhZGRpbmdbMV0gLSBwYWRkaW5nWzNdLCBkeSA9IG5vZGUuZHkgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXTtcbiAgICBpZiAoZHggPCAwKSB7XG4gICAgICB4ICs9IGR4IC8gMjtcbiAgICAgIGR4ID0gMDtcbiAgICB9XG4gICAgaWYgKGR5IDwgMCkge1xuICAgICAgeSArPSBkeSAvIDI7XG4gICAgICBkeSA9IDA7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeSxcbiAgICAgIGR4OiBkeCxcbiAgICAgIGR5OiBkeVxuICAgIH07XG4gIH1cbiAgZDMucmFuZG9tID0ge1xuICAgIG5vcm1hbDogZnVuY3Rpb24owrUsIM+DKSB7XG4gICAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobiA8IDIpIM+DID0gMTtcbiAgICAgIGlmIChuIDwgMSkgwrUgPSAwO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgeCwgeSwgcjtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHggPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XG4gICAgICAgICAgeSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcbiAgICAgICAgICByID0geCAqIHggKyB5ICogeTtcbiAgICAgICAgfSB3aGlsZSAoIXIgfHwgciA+IDEpO1xuICAgICAgICByZXR1cm4gwrUgKyDPgyAqIHggKiBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyKSAvIHIpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGxvZ05vcm1hbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmFuZG9tID0gZDMucmFuZG9tLm5vcm1hbC5hcHBseShkMywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZXhwKHJhbmRvbSgpKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBiYXRlczogZnVuY3Rpb24obSkge1xuICAgICAgdmFyIHJhbmRvbSA9IGQzLnJhbmRvbS5pcndpbkhhbGwobSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByYW5kb20oKSAvIG07XG4gICAgICB9O1xuICAgIH0sXG4gICAgaXJ3aW5IYWxsOiBmdW5jdGlvbihtKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIHMgPSAwLCBqID0gMDsgaiA8IG07IGorKykgcyArPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICBkMy5zY2FsZSA9IHt9O1xuICBmdW5jdGlvbiBkM19zY2FsZUV4dGVudChkb21haW4pIHtcbiAgICB2YXIgc3RhcnQgPSBkb21haW5bMF0sIHN0b3AgPSBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzdGFydCA8IHN0b3AgPyBbIHN0YXJ0LCBzdG9wIF0gOiBbIHN0b3AsIHN0YXJ0IF07XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2NhbGVSYW5nZShzY2FsZSkge1xuICAgIHJldHVybiBzY2FsZS5yYW5nZUV4dGVudCA/IHNjYWxlLnJhbmdlRXh0ZW50KCkgOiBkM19zY2FsZUV4dGVudChzY2FsZS5yYW5nZSgpKTtcbiAgfVxuICBmdW5jdGlvbiBkM19zY2FsZV9iaWxpbmVhcihkb21haW4sIHJhbmdlLCB1bmludGVycG9sYXRlLCBpbnRlcnBvbGF0ZSkge1xuICAgIHZhciB1ID0gdW5pbnRlcnBvbGF0ZShkb21haW5bMF0sIGRvbWFpblsxXSksIGkgPSBpbnRlcnBvbGF0ZShyYW5nZVswXSwgcmFuZ2VbMV0pO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gaSh1KHgpKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX25pY2UoZG9tYWluLCBuaWNlKSB7XG4gICAgdmFyIGkwID0gMCwgaTEgPSBkb21haW4ubGVuZ3RoIC0gMSwgeDAgPSBkb21haW5baTBdLCB4MSA9IGRvbWFpbltpMV0sIGR4O1xuICAgIGlmICh4MSA8IHgwKSB7XG4gICAgICBkeCA9IGkwLCBpMCA9IGkxLCBpMSA9IGR4O1xuICAgICAgZHggPSB4MCwgeDAgPSB4MSwgeDEgPSBkeDtcbiAgICB9XG4gICAgZG9tYWluW2kwXSA9IG5pY2UuZmxvb3IoeDApO1xuICAgIGRvbWFpbltpMV0gPSBuaWNlLmNlaWwoeDEpO1xuICAgIHJldHVybiBkb21haW47XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2NhbGVfbmljZVN0ZXAoc3RlcCkge1xuICAgIHJldHVybiBzdGVwID8ge1xuICAgICAgZmxvb3I6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoeCAvIHN0ZXApICogc3RlcDtcbiAgICAgIH0sXG4gICAgICBjZWlsOiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoeCAvIHN0ZXApICogc3RlcDtcbiAgICAgIH1cbiAgICB9IDogZDNfc2NhbGVfbmljZUlkZW50aXR5O1xuICB9XG4gIHZhciBkM19zY2FsZV9uaWNlSWRlbnRpdHkgPSB7XG4gICAgZmxvb3I6IGQzX2lkZW50aXR5LFxuICAgIGNlaWw6IGQzX2lkZW50aXR5XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX3BvbHlsaW5lYXIoZG9tYWluLCByYW5nZSwgdW5pbnRlcnBvbGF0ZSwgaW50ZXJwb2xhdGUpIHtcbiAgICB2YXIgdSA9IFtdLCBpID0gW10sIGogPSAwLCBrID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKSAtIDE7XG4gICAgaWYgKGRvbWFpbltrXSA8IGRvbWFpblswXSkge1xuICAgICAgZG9tYWluID0gZG9tYWluLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2UgPSByYW5nZS5zbGljZSgpLnJldmVyc2UoKTtcbiAgICB9XG4gICAgd2hpbGUgKCsraiA8PSBrKSB7XG4gICAgICB1LnB1c2godW5pbnRlcnBvbGF0ZShkb21haW5baiAtIDFdLCBkb21haW5bal0pKTtcbiAgICAgIGkucHVzaChpbnRlcnBvbGF0ZShyYW5nZVtqIC0gMV0sIHJhbmdlW2pdKSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICB2YXIgaiA9IGQzLmJpc2VjdChkb21haW4sIHgsIDEsIGspIC0gMTtcbiAgICAgIHJldHVybiBpW2pdKHVbal0oeCkpO1xuICAgIH07XG4gIH1cbiAgZDMuc2NhbGUubGluZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NjYWxlX2xpbmVhcihbIDAsIDEgXSwgWyAwLCAxIF0sIGQzX2ludGVycG9sYXRlLCBmYWxzZSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX2xpbmVhcihkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSwgY2xhbXApIHtcbiAgICB2YXIgb3V0cHV0LCBpbnB1dDtcbiAgICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgICAgdmFyIGxpbmVhciA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCkgPiAyID8gZDNfc2NhbGVfcG9seWxpbmVhciA6IGQzX3NjYWxlX2JpbGluZWFyLCB1bmludGVycG9sYXRlID0gY2xhbXAgPyBkM191bmludGVycG9sYXRlQ2xhbXAgOiBkM191bmludGVycG9sYXRlTnVtYmVyO1xuICAgICAgb3V0cHV0ID0gbGluZWFyKGRvbWFpbiwgcmFuZ2UsIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKTtcbiAgICAgIGlucHV0ID0gbGluZWFyKHJhbmdlLCBkb21haW4sIHVuaW50ZXJwb2xhdGUsIGQzX2ludGVycG9sYXRlKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIG91dHB1dCh4KTtcbiAgICB9XG4gICAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIGlucHV0KHkpO1xuICAgIH07XG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluO1xuICAgICAgZG9tYWluID0geC5tYXAoTnVtYmVyKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlO1xuICAgICAgcmFuZ2UgPSB4O1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuICAgIHNjYWxlLnJhbmdlUm91bmQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gc2NhbGUucmFuZ2UoeCkuaW50ZXJwb2xhdGUoZDNfaW50ZXJwb2xhdGVSb3VuZCk7XG4gICAgfTtcbiAgICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYW1wO1xuICAgICAgY2xhbXAgPSB4O1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuICAgIHNjYWxlLmludGVycG9sYXRlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gaW50ZXJwb2xhdGU7XG4gICAgICBpbnRlcnBvbGF0ZSA9IHg7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihtKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfbGluZWFyVGlja3MoZG9tYWluLCBtKTtcbiAgICB9O1xuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihtLCBmb3JtYXQpIHtcbiAgICAgIHJldHVybiBkM19zY2FsZV9saW5lYXJUaWNrRm9ybWF0KGRvbWFpbiwgbSwgZm9ybWF0KTtcbiAgICB9O1xuICAgIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihtKSB7XG4gICAgICBkM19zY2FsZV9saW5lYXJOaWNlKGRvbWFpbiwgbSk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGQzX3NjYWxlX2xpbmVhcihkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSwgY2xhbXApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgfVxuICBmdW5jdGlvbiBkM19zY2FsZV9saW5lYXJSZWJpbmQoc2NhbGUsIGxpbmVhcikge1xuICAgIHJldHVybiBkMy5yZWJpbmQoc2NhbGUsIGxpbmVhciwgXCJyYW5nZVwiLCBcInJhbmdlUm91bmRcIiwgXCJpbnRlcnBvbGF0ZVwiLCBcImNsYW1wXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX2xpbmVhck5pY2UoZG9tYWluLCBtKSB7XG4gICAgZDNfc2NhbGVfbmljZShkb21haW4sIGQzX3NjYWxlX25pY2VTdGVwKGQzX3NjYWxlX2xpbmVhclRpY2tSYW5nZShkb21haW4sIG0pWzJdKSk7XG4gICAgZDNfc2NhbGVfbmljZShkb21haW4sIGQzX3NjYWxlX25pY2VTdGVwKGQzX3NjYWxlX2xpbmVhclRpY2tSYW5nZShkb21haW4sIG0pWzJdKSk7XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuICBmdW5jdGlvbiBkM19zY2FsZV9saW5lYXJUaWNrUmFuZ2UoZG9tYWluLCBtKSB7XG4gICAgaWYgKG0gPT0gbnVsbCkgbSA9IDEwO1xuICAgIHZhciBleHRlbnQgPSBkM19zY2FsZUV4dGVudChkb21haW4pLCBzcGFuID0gZXh0ZW50WzFdIC0gZXh0ZW50WzBdLCBzdGVwID0gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coc3BhbiAvIG0pIC8gTWF0aC5MTjEwKSksIGVyciA9IG0gLyBzcGFuICogc3RlcDtcbiAgICBpZiAoZXJyIDw9IC4xNSkgc3RlcCAqPSAxMDsgZWxzZSBpZiAoZXJyIDw9IC4zNSkgc3RlcCAqPSA1OyBlbHNlIGlmIChlcnIgPD0gLjc1KSBzdGVwICo9IDI7XG4gICAgZXh0ZW50WzBdID0gTWF0aC5jZWlsKGV4dGVudFswXSAvIHN0ZXApICogc3RlcDtcbiAgICBleHRlbnRbMV0gPSBNYXRoLmZsb29yKGV4dGVudFsxXSAvIHN0ZXApICogc3RlcCArIHN0ZXAgKiAuNTtcbiAgICBleHRlbnRbMl0gPSBzdGVwO1xuICAgIHJldHVybiBleHRlbnQ7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2NhbGVfbGluZWFyVGlja3MoZG9tYWluLCBtKSB7XG4gICAgcmV0dXJuIGQzLnJhbmdlLmFwcGx5KGQzLCBkM19zY2FsZV9saW5lYXJUaWNrUmFuZ2UoZG9tYWluLCBtKSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc2NhbGVfbGluZWFyVGlja0Zvcm1hdChkb21haW4sIG0sIGZvcm1hdCkge1xuICAgIHZhciByYW5nZSA9IGQzX3NjYWxlX2xpbmVhclRpY2tSYW5nZShkb21haW4sIG0pO1xuICAgIGlmIChmb3JtYXQpIHtcbiAgICAgIHZhciBtYXRjaCA9IGQzX2Zvcm1hdF9yZS5leGVjKGZvcm1hdCk7XG4gICAgICBtYXRjaC5zaGlmdCgpO1xuICAgICAgaWYgKG1hdGNoWzhdID09PSBcInNcIikge1xuICAgICAgICB2YXIgcHJlZml4ID0gZDMuZm9ybWF0UHJlZml4KE1hdGgubWF4KGFicyhyYW5nZVswXSksIGFicyhyYW5nZVsxXSkpKTtcbiAgICAgICAgaWYgKCFtYXRjaFs3XSkgbWF0Y2hbN10gPSBcIi5cIiArIGQzX3NjYWxlX2xpbmVhclByZWNpc2lvbihwcmVmaXguc2NhbGUocmFuZ2VbMl0pKTtcbiAgICAgICAgbWF0Y2hbOF0gPSBcImZcIjtcbiAgICAgICAgZm9ybWF0ID0gZDMuZm9ybWF0KG1hdGNoLmpvaW4oXCJcIikpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBmb3JtYXQocHJlZml4LnNjYWxlKGQpKSArIHByZWZpeC5zeW1ib2w7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIW1hdGNoWzddKSBtYXRjaFs3XSA9IFwiLlwiICsgZDNfc2NhbGVfbGluZWFyRm9ybWF0UHJlY2lzaW9uKG1hdGNoWzhdLCByYW5nZSk7XG4gICAgICBmb3JtYXQgPSBtYXRjaC5qb2luKFwiXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIiwuXCIgKyBkM19zY2FsZV9saW5lYXJQcmVjaXNpb24ocmFuZ2VbMl0pICsgXCJmXCI7XG4gICAgfVxuICAgIHJldHVybiBkMy5mb3JtYXQoZm9ybWF0KTtcbiAgfVxuICB2YXIgZDNfc2NhbGVfbGluZWFyRm9ybWF0U2lnbmlmaWNhbnQgPSB7XG4gICAgczogMSxcbiAgICBnOiAxLFxuICAgIHA6IDEsXG4gICAgcjogMSxcbiAgICBlOiAxXG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX2xpbmVhclByZWNpc2lvbih2YWx1ZSkge1xuICAgIHJldHVybiAtTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMTAgKyAuMDEpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX2xpbmVhckZvcm1hdFByZWNpc2lvbih0eXBlLCByYW5nZSkge1xuICAgIHZhciBwID0gZDNfc2NhbGVfbGluZWFyUHJlY2lzaW9uKHJhbmdlWzJdKTtcbiAgICByZXR1cm4gdHlwZSBpbiBkM19zY2FsZV9saW5lYXJGb3JtYXRTaWduaWZpY2FudCA/IE1hdGguYWJzKHAgLSBkM19zY2FsZV9saW5lYXJQcmVjaXNpb24oTWF0aC5tYXgoYWJzKHJhbmdlWzBdKSwgYWJzKHJhbmdlWzFdKSkpKSArICsodHlwZSAhPT0gXCJlXCIpIDogcCAtICh0eXBlID09PSBcIiVcIikgKiAyO1xuICB9XG4gIGQzLnNjYWxlLmxvZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zY2FsZV9sb2coZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFsgMCwgMSBdKSwgMTAsIHRydWUsIFsgMSwgMTAgXSk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3NjYWxlX2xvZyhsaW5lYXIsIGJhc2UsIHBvc2l0aXZlLCBkb21haW4pIHtcbiAgICBmdW5jdGlvbiBsb2coeCkge1xuICAgICAgcmV0dXJuIChwb3NpdGl2ZSA/IE1hdGgubG9nKHggPCAwID8gMCA6IHgpIDogLU1hdGgubG9nKHggPiAwID8gMCA6IC14KSkgLyBNYXRoLmxvZyhiYXNlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcG93KHgpIHtcbiAgICAgIHJldHVybiBwb3NpdGl2ZSA/IE1hdGgucG93KGJhc2UsIHgpIDogLU1hdGgucG93KGJhc2UsIC14KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIGxpbmVhcihsb2coeCkpO1xuICAgIH1cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gcG93KGxpbmVhci5pbnZlcnQoeCkpO1xuICAgIH07XG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluO1xuICAgICAgcG9zaXRpdmUgPSB4WzBdID49IDA7XG4gICAgICBsaW5lYXIuZG9tYWluKChkb21haW4gPSB4Lm1hcChOdW1iZXIpKS5tYXAobG9nKSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcbiAgICBzY2FsZS5iYXNlID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICAgIGJhc2UgPSArXztcbiAgICAgIGxpbmVhci5kb21haW4oZG9tYWluLm1hcChsb2cpKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIHNjYWxlLm5pY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBuaWNlZCA9IGQzX3NjYWxlX25pY2UoZG9tYWluLm1hcChsb2cpLCBwb3NpdGl2ZSA/IE1hdGggOiBkM19zY2FsZV9sb2dOaWNlTmVnYXRpdmUpO1xuICAgICAgbGluZWFyLmRvbWFpbihuaWNlZCk7XG4gICAgICBkb21haW4gPSBuaWNlZC5tYXAocG93KTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXh0ZW50ID0gZDNfc2NhbGVFeHRlbnQoZG9tYWluKSwgdGlja3MgPSBbXSwgdSA9IGV4dGVudFswXSwgdiA9IGV4dGVudFsxXSwgaSA9IE1hdGguZmxvb3IobG9nKHUpKSwgaiA9IE1hdGguY2VpbChsb2codikpLCBuID0gYmFzZSAlIDEgPyAyIDogYmFzZTtcbiAgICAgIGlmIChpc0Zpbml0ZShqIC0gaSkpIHtcbiAgICAgICAgaWYgKHBvc2l0aXZlKSB7XG4gICAgICAgICAgZm9yICg7aSA8IGo7IGkrKykgZm9yICh2YXIgayA9IDE7IGsgPCBuOyBrKyspIHRpY2tzLnB1c2gocG93KGkpICogayk7XG4gICAgICAgICAgdGlja3MucHVzaChwb3coaSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpY2tzLnB1c2gocG93KGkpKTtcbiAgICAgICAgICBmb3IgKDtpKysgPCBqOyApIGZvciAodmFyIGsgPSBuIC0gMTsgayA+IDA7IGstLSkgdGlja3MucHVzaChwb3coaSkgKiBrKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyB0aWNrc1tpXSA8IHU7IGkrKykge31cbiAgICAgICAgZm9yIChqID0gdGlja3MubGVuZ3RoOyB0aWNrc1tqIC0gMV0gPiB2OyBqLS0pIHt9XG4gICAgICAgIHRpY2tzID0gdGlja3Muc2xpY2UoaSwgaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGlja3M7XG4gICAgfTtcbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24obiwgZm9ybWF0KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkM19zY2FsZV9sb2dGb3JtYXQ7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIGZvcm1hdCA9IGQzX3NjYWxlX2xvZ0Zvcm1hdDsgZWxzZSBpZiAodHlwZW9mIGZvcm1hdCAhPT0gXCJmdW5jdGlvblwiKSBmb3JtYXQgPSBkMy5mb3JtYXQoZm9ybWF0KTtcbiAgICAgIHZhciBrID0gTWF0aC5tYXgoMSwgYmFzZSAqIG4gLyBzY2FsZS50aWNrcygpLmxlbmd0aCk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgaSA9IGQgLyBwb3coTWF0aC5yb3VuZChsb2coZCkpKTtcbiAgICAgICAgaWYgKGkgKiBiYXNlIDwgYmFzZSAtIC41KSBpICo9IGJhc2U7XG4gICAgICAgIHJldHVybiBpIDw9IGsgPyBmb3JtYXQoZCkgOiBcIlwiO1xuICAgICAgfTtcbiAgICB9O1xuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19zY2FsZV9sb2cobGluZWFyLmNvcHkoKSwgYmFzZSwgcG9zaXRpdmUsIGRvbWFpbik7XG4gICAgfTtcbiAgICByZXR1cm4gZDNfc2NhbGVfbGluZWFyUmViaW5kKHNjYWxlLCBsaW5lYXIpO1xuICB9XG4gIHZhciBkM19zY2FsZV9sb2dGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMGVcIiksIGQzX3NjYWxlX2xvZ05pY2VOZWdhdGl2ZSA9IHtcbiAgICBmbG9vcjogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIC1NYXRoLmNlaWwoLXgpO1xuICAgIH0sXG4gICAgY2VpbDogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIC1NYXRoLmZsb29yKC14KTtcbiAgICB9XG4gIH07XG4gIGQzLnNjYWxlLnBvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zY2FsZV9wb3coZDMuc2NhbGUubGluZWFyKCksIDEsIFsgMCwgMSBdKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2NhbGVfcG93KGxpbmVhciwgZXhwb25lbnQsIGRvbWFpbikge1xuICAgIHZhciBwb3dwID0gZDNfc2NhbGVfcG93UG93KGV4cG9uZW50KSwgcG93YiA9IGQzX3NjYWxlX3Bvd1BvdygxIC8gZXhwb25lbnQpO1xuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBsaW5lYXIocG93cCh4KSk7XG4gICAgfVxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBwb3diKGxpbmVhci5pbnZlcnQoeCkpO1xuICAgIH07XG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluO1xuICAgICAgbGluZWFyLmRvbWFpbigoZG9tYWluID0geC5tYXAoTnVtYmVyKSkubWFwKHBvd3ApKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIGQzX3NjYWxlX2xpbmVhclRpY2tzKGRvbWFpbiwgbSk7XG4gICAgfTtcbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24obSwgZm9ybWF0KSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfbGluZWFyVGlja0Zvcm1hdChkb21haW4sIG0sIGZvcm1hdCk7XG4gICAgfTtcbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIHNjYWxlLmRvbWFpbihkM19zY2FsZV9saW5lYXJOaWNlKGRvbWFpbiwgbSkpO1xuICAgIH07XG4gICAgc2NhbGUuZXhwb25lbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBleHBvbmVudDtcbiAgICAgIHBvd3AgPSBkM19zY2FsZV9wb3dQb3coZXhwb25lbnQgPSB4KTtcbiAgICAgIHBvd2IgPSBkM19zY2FsZV9wb3dQb3coMSAvIGV4cG9uZW50KTtcbiAgICAgIGxpbmVhci5kb21haW4oZG9tYWluLm1hcChwb3dwKSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfcG93KGxpbmVhci5jb3B5KCksIGV4cG9uZW50LCBkb21haW4pO1xuICAgIH07XG4gICAgcmV0dXJuIGQzX3NjYWxlX2xpbmVhclJlYmluZChzY2FsZSwgbGluZWFyKTtcbiAgfVxuICBmdW5jdGlvbiBkM19zY2FsZV9wb3dQb3coZSkge1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIGUpIDogTWF0aC5wb3coeCwgZSk7XG4gICAgfTtcbiAgfVxuICBkMy5zY2FsZS5zcXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KC41KTtcbiAgfTtcbiAgZDMuc2NhbGUub3JkaW5hbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zY2FsZV9vcmRpbmFsKFtdLCB7XG4gICAgICB0OiBcInJhbmdlXCIsXG4gICAgICBhOiBbIFtdIF1cbiAgICB9KTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2NhbGVfb3JkaW5hbChkb21haW4sIHJhbmdlcikge1xuICAgIHZhciBpbmRleCwgcmFuZ2UsIHJhbmdlQmFuZDtcbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gcmFuZ2VbKChpbmRleC5nZXQoeCkgfHwgKHJhbmdlci50ID09PSBcInJhbmdlXCIgPyBpbmRleC5zZXQoeCwgZG9tYWluLnB1c2goeCkpIDogTmFOKSkgLSAxKSAlIHJhbmdlLmxlbmd0aF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0ZXBzKHN0YXJ0LCBzdGVwKSB7XG4gICAgICByZXR1cm4gZDMucmFuZ2UoZG9tYWluLmxlbmd0aCkubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0ICsgc3RlcCAqIGk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluO1xuICAgICAgZG9tYWluID0gW107XG4gICAgICBpbmRleCA9IG5ldyBkM19NYXAoKTtcbiAgICAgIHZhciBpID0gLTEsIG4gPSB4Lmxlbmd0aCwgeGk7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpbmRleC5oYXMoeGkgPSB4W2ldKSkgaW5kZXguc2V0KHhpLCBkb21haW4ucHVzaCh4aSkpO1xuICAgICAgcmV0dXJuIHNjYWxlW3Jhbmdlci50XS5hcHBseShzY2FsZSwgcmFuZ2VyLmEpO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZTtcbiAgICAgIHJhbmdlID0geDtcbiAgICAgIHJhbmdlQmFuZCA9IDA7XG4gICAgICByYW5nZXIgPSB7XG4gICAgICAgIHQ6IFwicmFuZ2VcIixcbiAgICAgICAgYTogYXJndW1lbnRzXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2VQb2ludHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHBhZGRpbmcgPSAwO1xuICAgICAgdmFyIHN0YXJ0ID0geFswXSwgc3RvcCA9IHhbMV0sIHN0ZXAgPSBkb21haW4ubGVuZ3RoIDwgMiA/IChzdGFydCA9IChzdGFydCArIHN0b3ApIC8gMiwgXG4gICAgICAwKSA6IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSAxICsgcGFkZGluZyk7XG4gICAgICByYW5nZSA9IHN0ZXBzKHN0YXJ0ICsgc3RlcCAqIHBhZGRpbmcgLyAyLCBzdGVwKTtcbiAgICAgIHJhbmdlQmFuZCA9IDA7XG4gICAgICByYW5nZXIgPSB7XG4gICAgICAgIHQ6IFwicmFuZ2VQb2ludHNcIixcbiAgICAgICAgYTogYXJndW1lbnRzXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2VSb3VuZFBvaW50cyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcGFkZGluZyA9IDA7XG4gICAgICB2YXIgc3RhcnQgPSB4WzBdLCBzdG9wID0geFsxXSwgc3RlcCA9IGRvbWFpbi5sZW5ndGggPCAyID8gKHN0YXJ0ID0gc3RvcCA9IE1hdGgucm91bmQoKHN0YXJ0ICsgc3RvcCkgLyAyKSwgXG4gICAgICAwKSA6IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSAxICsgcGFkZGluZykgfCAwO1xuICAgICAgcmFuZ2UgPSBzdGVwcyhzdGFydCArIE1hdGgucm91bmQoc3RlcCAqIHBhZGRpbmcgLyAyICsgKHN0b3AgLSBzdGFydCAtIChkb21haW4ubGVuZ3RoIC0gMSArIHBhZGRpbmcpICogc3RlcCkgLyAyKSwgc3RlcCk7XG4gICAgICByYW5nZUJhbmQgPSAwO1xuICAgICAgcmFuZ2VyID0ge1xuICAgICAgICB0OiBcInJhbmdlUm91bmRQb2ludHNcIixcbiAgICAgICAgYTogYXJndW1lbnRzXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2VCYW5kcyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcsIG91dGVyUGFkZGluZykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBwYWRkaW5nID0gMDtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgb3V0ZXJQYWRkaW5nID0gcGFkZGluZztcbiAgICAgIHZhciByZXZlcnNlID0geFsxXSA8IHhbMF0sIHN0YXJ0ID0geFtyZXZlcnNlIC0gMF0sIHN0b3AgPSB4WzEgLSByZXZlcnNlXSwgc3RlcCA9IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSBwYWRkaW5nICsgMiAqIG91dGVyUGFkZGluZyk7XG4gICAgICByYW5nZSA9IHN0ZXBzKHN0YXJ0ICsgc3RlcCAqIG91dGVyUGFkZGluZywgc3RlcCk7XG4gICAgICBpZiAocmV2ZXJzZSkgcmFuZ2UucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2VCYW5kID0gc3RlcCAqICgxIC0gcGFkZGluZyk7XG4gICAgICByYW5nZXIgPSB7XG4gICAgICAgIHQ6IFwicmFuZ2VCYW5kc1wiLFxuICAgICAgICBhOiBhcmd1bWVudHNcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcbiAgICBzY2FsZS5yYW5nZVJvdW5kQmFuZHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nLCBvdXRlclBhZGRpbmcpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcGFkZGluZyA9IDA7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIG91dGVyUGFkZGluZyA9IHBhZGRpbmc7XG4gICAgICB2YXIgcmV2ZXJzZSA9IHhbMV0gPCB4WzBdLCBzdGFydCA9IHhbcmV2ZXJzZSAtIDBdLCBzdG9wID0geFsxIC0gcmV2ZXJzZV0sIHN0ZXAgPSBNYXRoLmZsb29yKChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSBwYWRkaW5nICsgMiAqIG91dGVyUGFkZGluZykpO1xuICAgICAgcmFuZ2UgPSBzdGVwcyhzdGFydCArIE1hdGgucm91bmQoKHN0b3AgLSBzdGFydCAtIChkb21haW4ubGVuZ3RoIC0gcGFkZGluZykgKiBzdGVwKSAvIDIpLCBzdGVwKTtcbiAgICAgIGlmIChyZXZlcnNlKSByYW5nZS5yZXZlcnNlKCk7XG4gICAgICByYW5nZUJhbmQgPSBNYXRoLnJvdW5kKHN0ZXAgKiAoMSAtIHBhZGRpbmcpKTtcbiAgICAgIHJhbmdlciA9IHtcbiAgICAgICAgdDogXCJyYW5nZVJvdW5kQmFuZHNcIixcbiAgICAgICAgYTogYXJndW1lbnRzXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2VCYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmFuZ2VCYW5kO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2VFeHRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19zY2FsZUV4dGVudChyYW5nZXIuYVswXSk7XG4gICAgfTtcbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfb3JkaW5hbChkb21haW4sIHJhbmdlcik7XG4gICAgfTtcbiAgICByZXR1cm4gc2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cbiAgZDMuc2NhbGUuY2F0ZWdvcnkxMCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2UoZDNfY2F0ZWdvcnkxMCk7XG4gIH07XG4gIGQzLnNjYWxlLmNhdGVnb3J5MjAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDMuc2NhbGUub3JkaW5hbCgpLnJhbmdlKGQzX2NhdGVnb3J5MjApO1xuICB9O1xuICBkMy5zY2FsZS5jYXRlZ29yeTIwYiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2UoZDNfY2F0ZWdvcnkyMGIpO1xuICB9O1xuICBkMy5zY2FsZS5jYXRlZ29yeTIwYyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2UoZDNfY2F0ZWdvcnkyMGMpO1xuICB9O1xuICB2YXIgZDNfY2F0ZWdvcnkxMCA9IFsgMjA2MjI2MCwgMTY3NDQyMDYsIDI5MjQ1ODgsIDE0MDM0NzI4LCA5NzI1ODg1LCA5MTk3MTMxLCAxNDkwNzMzMCwgODM1NTcxMSwgMTIzNjkxODYsIDE1NTYxNzUgXS5tYXAoZDNfcmdiU3RyaW5nKTtcbiAgdmFyIGQzX2NhdGVnb3J5MjAgPSBbIDIwNjIyNjAsIDExNDU0NDQwLCAxNjc0NDIwNiwgMTY3NTk2NzIsIDI5MjQ1ODgsIDEwMDE4Njk4LCAxNDAzNDcyOCwgMTY3NTA3NDIsIDk3MjU4ODUsIDEyOTU1ODYxLCA5MTk3MTMxLCAxMjg4NTE0MCwgMTQ5MDczMzAsIDE2MjM0MTk0LCA4MzU1NzExLCAxMzA5MjgwNywgMTIzNjkxODYsIDE0NDA4NTg5LCAxNTU2MTc1LCAxMDQxMDcyNSBdLm1hcChkM19yZ2JTdHJpbmcpO1xuICB2YXIgZDNfY2F0ZWdvcnkyMGIgPSBbIDM3NTA3NzcsIDUzOTU2MTksIDcwNDA3MTksIDEwMjY0Mjg2LCA2NTE5MDk3LCA5MjE2NTk0LCAxMTkxNTExNSwgMTM1NTY2MzYsIDkyMDI5OTMsIDEyNDI2ODA5LCAxNTE4NjUxNCwgMTUxOTA5MzIsIDg2NjYxNjksIDExMzU2NDkwLCAxNDA0OTY0MywgMTUxNzczNzIsIDgwNzc2ODMsIDEwODM0MzI0LCAxMzUyODUwOSwgMTQ1ODk2NTQgXS5tYXAoZDNfcmdiU3RyaW5nKTtcbiAgdmFyIGQzX2NhdGVnb3J5MjBjID0gWyAzMjQ0NzMzLCA3MDU3MTEwLCAxMDQwNjYyNSwgMTMwMzI0MzEsIDE1MDk1MDUzLCAxNjYxNjc2NCwgMTY2MjUyNTksIDE2NjM0MDE4LCAzMjUzMDc2LCA3NjUyNDcwLCAxMDYwNzAwMywgMTMxMDE1MDQsIDc2OTUyODEsIDEwMzk0MzEyLCAxMjM2OTM3MiwgMTQzNDI4OTEsIDY1MTM1MDcsIDk4Njg5NTAsIDEyNDM0ODc3LCAxNDI3NzA4MSBdLm1hcChkM19yZ2JTdHJpbmcpO1xuICBkMy5zY2FsZS5xdWFudGlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM19zY2FsZV9xdWFudGlsZShbXSwgW10pO1xuICB9O1xuICBmdW5jdGlvbiBkM19zY2FsZV9xdWFudGlsZShkb21haW4sIHJhbmdlKSB7XG4gICAgdmFyIHRocmVzaG9sZHM7XG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIHZhciBrID0gMCwgcSA9IHJhbmdlLmxlbmd0aDtcbiAgICAgIHRocmVzaG9sZHMgPSBbXTtcbiAgICAgIHdoaWxlICgrK2sgPCBxKSB0aHJlc2hvbGRzW2sgLSAxXSA9IGQzLnF1YW50aWxlKGRvbWFpbiwgayAvIHEpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICBpZiAoIWlzTmFOKHggPSAreCkpIHJldHVybiByYW5nZVtkMy5iaXNlY3QodGhyZXNob2xkcywgeCldO1xuICAgIH1cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW47XG4gICAgICBkb21haW4gPSB4Lm1hcChkM19udW1iZXIpLmZpbHRlcihkM19udW1lcmljKS5zb3J0KGQzX2FzY2VuZGluZyk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZTtcbiAgICAgIHJhbmdlID0geDtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcbiAgICBzY2FsZS5xdWFudGlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aHJlc2hvbGRzO1xuICAgIH07XG4gICAgc2NhbGUuaW52ZXJ0RXh0ZW50ID0gZnVuY3Rpb24oeSkge1xuICAgICAgeSA9IHJhbmdlLmluZGV4T2YoeSk7XG4gICAgICByZXR1cm4geSA8IDAgPyBbIE5hTiwgTmFOIF0gOiBbIHkgPiAwID8gdGhyZXNob2xkc1t5IC0gMV0gOiBkb21haW5bMF0sIHkgPCB0aHJlc2hvbGRzLmxlbmd0aCA/IHRocmVzaG9sZHNbeV0gOiBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIF07XG4gICAgfTtcbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfcXVhbnRpbGUoZG9tYWluLCByYW5nZSk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9XG4gIGQzLnNjYWxlLnF1YW50aXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NjYWxlX3F1YW50aXplKDAsIDEsIFsgMCwgMSBdKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2NhbGVfcXVhbnRpemUoeDAsIHgxLCByYW5nZSkge1xuICAgIHZhciBreCwgaTtcbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gcmFuZ2VbTWF0aC5tYXgoMCwgTWF0aC5taW4oaSwgTWF0aC5mbG9vcihreCAqICh4IC0geDApKSkpXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIGt4ID0gcmFuZ2UubGVuZ3RoIC8gKHgxIC0geDApO1xuICAgICAgaSA9IHJhbmdlLmxlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfVxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFsgeDAsIHgxIF07XG4gICAgICB4MCA9ICt4WzBdO1xuICAgICAgeDEgPSAreFt4Lmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFuZ2U7XG4gICAgICByYW5nZSA9IHg7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG4gICAgc2NhbGUuaW52ZXJ0RXh0ZW50ID0gZnVuY3Rpb24oeSkge1xuICAgICAgeSA9IHJhbmdlLmluZGV4T2YoeSk7XG4gICAgICB5ID0geSA8IDAgPyBOYU4gOiB5IC8ga3ggKyB4MDtcbiAgICAgIHJldHVybiBbIHksIHkgKyAxIC8ga3ggXTtcbiAgICB9O1xuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM19zY2FsZV9xdWFudGl6ZSh4MCwgeDEsIHJhbmdlKTtcbiAgICB9O1xuICAgIHJldHVybiByZXNjYWxlKCk7XG4gIH1cbiAgZDMuc2NhbGUudGhyZXNob2xkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NjYWxlX3RocmVzaG9sZChbIC41IF0sIFsgMCwgMSBdKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2NhbGVfdGhyZXNob2xkKGRvbWFpbiwgcmFuZ2UpIHtcbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICBpZiAoeCA8PSB4KSByZXR1cm4gcmFuZ2VbZDMuYmlzZWN0KGRvbWFpbiwgeCldO1xuICAgIH1cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW47XG4gICAgICBkb21haW4gPSBfO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZTtcbiAgICAgIHJhbmdlID0gXztcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHkgPSByYW5nZS5pbmRleE9mKHkpO1xuICAgICAgcmV0dXJuIFsgZG9tYWluW3kgLSAxXSwgZG9tYWluW3ldIF07XG4gICAgfTtcbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfdGhyZXNob2xkKGRvbWFpbiwgcmFuZ2UpO1xuICAgIH07XG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG4gIGQzLnNjYWxlLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NjYWxlX2lkZW50aXR5KFsgMCwgMSBdKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc2NhbGVfaWRlbnRpdHkoZG9tYWluKSB7XG4gICAgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgICAgcmV0dXJuICt4O1xuICAgIH1cbiAgICBpZGVudGl0eS5pbnZlcnQgPSBpZGVudGl0eTtcbiAgICBpZGVudGl0eS5kb21haW4gPSBpZGVudGl0eS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbjtcbiAgICAgIGRvbWFpbiA9IHgubWFwKGlkZW50aXR5KTtcbiAgICAgIHJldHVybiBpZGVudGl0eTtcbiAgICB9O1xuICAgIGlkZW50aXR5LnRpY2tzID0gZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIGQzX3NjYWxlX2xpbmVhclRpY2tzKGRvbWFpbiwgbSk7XG4gICAgfTtcbiAgICBpZGVudGl0eS50aWNrRm9ybWF0ID0gZnVuY3Rpb24obSwgZm9ybWF0KSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfbGluZWFyVGlja0Zvcm1hdChkb21haW4sIG0sIGZvcm1hdCk7XG4gICAgfTtcbiAgICBpZGVudGl0eS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZDNfc2NhbGVfaWRlbnRpdHkoZG9tYWluKTtcbiAgICB9O1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBkMy5zdmcgPSB7fTtcbiAgZnVuY3Rpb24gZDNfemVybygpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBkMy5zdmcuYXJjID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlubmVyUmFkaXVzID0gZDNfc3ZnX2FyY0lubmVyUmFkaXVzLCBvdXRlclJhZGl1cyA9IGQzX3N2Z19hcmNPdXRlclJhZGl1cywgY29ybmVyUmFkaXVzID0gZDNfemVybywgcGFkUmFkaXVzID0gZDNfc3ZnX2FyY0F1dG8sIHN0YXJ0QW5nbGUgPSBkM19zdmdfYXJjU3RhcnRBbmdsZSwgZW5kQW5nbGUgPSBkM19zdmdfYXJjRW5kQW5nbGUsIHBhZEFuZ2xlID0gZDNfc3ZnX2FyY1BhZEFuZ2xlO1xuICAgIGZ1bmN0aW9uIGFyYygpIHtcbiAgICAgIHZhciByMCA9IE1hdGgubWF4KDAsICtpbm5lclJhZGl1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSwgcjEgPSBNYXRoLm1heCgwLCArb3V0ZXJSYWRpdXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSksIGEwID0gc3RhcnRBbmdsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC0gaGFsZs+ALCBhMSA9IGVuZEFuZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSBoYWxmz4AsIGRhID0gTWF0aC5hYnMoYTEgLSBhMCksIGN3ID0gYTAgPiBhMSA/IDAgOiAxO1xuICAgICAgaWYgKHIxIDwgcjApIHJjID0gcjEsIHIxID0gcjAsIHIwID0gcmM7XG4gICAgICBpZiAoZGEgPj0gz4TOtSkgcmV0dXJuIGNpcmNsZVNlZ21lbnQocjEsIGN3KSArIChyMCA/IGNpcmNsZVNlZ21lbnQocjAsIDEgLSBjdykgOiBcIlwiKSArIFwiWlwiO1xuICAgICAgdmFyIHJjLCBjciwgcnAsIGFwLCBwMCA9IDAsIHAxID0gMCwgeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCBwYXRoID0gW107XG4gICAgICBpZiAoYXAgPSAoK3BhZEFuZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgMCkgLyAyKSB7XG4gICAgICAgIHJwID0gcGFkUmFkaXVzID09PSBkM19zdmdfYXJjQXV0byA/IE1hdGguc3FydChyMCAqIHIwICsgcjEgKiByMSkgOiArcGFkUmFkaXVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICghY3cpIHAxICo9IC0xO1xuICAgICAgICBpZiAocjEpIHAxID0gZDNfYXNpbihycCAvIHIxICogTWF0aC5zaW4oYXApKTtcbiAgICAgICAgaWYgKHIwKSBwMCA9IGQzX2FzaW4ocnAgLyByMCAqIE1hdGguc2luKGFwKSk7XG4gICAgICB9XG4gICAgICBpZiAocjEpIHtcbiAgICAgICAgeDAgPSByMSAqIE1hdGguY29zKGEwICsgcDEpO1xuICAgICAgICB5MCA9IHIxICogTWF0aC5zaW4oYTAgKyBwMSk7XG4gICAgICAgIHgxID0gcjEgKiBNYXRoLmNvcyhhMSAtIHAxKTtcbiAgICAgICAgeTEgPSByMSAqIE1hdGguc2luKGExIC0gcDEpO1xuICAgICAgICB2YXIgbDEgPSBNYXRoLmFicyhhMSAtIGEwIC0gMiAqIHAxKSA8PSDPgCA/IDAgOiAxO1xuICAgICAgICBpZiAocDEgJiYgZDNfc3ZnX2FyY1N3ZWVwKHgwLCB5MCwgeDEsIHkxKSA9PT0gY3cgXiBsMSkge1xuICAgICAgICAgIHZhciBoMSA9IChhMCArIGExKSAvIDI7XG4gICAgICAgICAgeDAgPSByMSAqIE1hdGguY29zKGgxKTtcbiAgICAgICAgICB5MCA9IHIxICogTWF0aC5zaW4oaDEpO1xuICAgICAgICAgIHgxID0geTEgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4MCA9IHkwID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChyMCkge1xuICAgICAgICB4MiA9IHIwICogTWF0aC5jb3MoYTEgLSBwMCk7XG4gICAgICAgIHkyID0gcjAgKiBNYXRoLnNpbihhMSAtIHAwKTtcbiAgICAgICAgeDMgPSByMCAqIE1hdGguY29zKGEwICsgcDApO1xuICAgICAgICB5MyA9IHIwICogTWF0aC5zaW4oYTAgKyBwMCk7XG4gICAgICAgIHZhciBsMCA9IE1hdGguYWJzKGEwIC0gYTEgKyAyICogcDApIDw9IM+AID8gMCA6IDE7XG4gICAgICAgIGlmIChwMCAmJiBkM19zdmdfYXJjU3dlZXAoeDIsIHkyLCB4MywgeTMpID09PSAxIC0gY3cgXiBsMCkge1xuICAgICAgICAgIHZhciBoMCA9IChhMCArIGExKSAvIDI7XG4gICAgICAgICAgeDIgPSByMCAqIE1hdGguY29zKGgwKTtcbiAgICAgICAgICB5MiA9IHIwICogTWF0aC5zaW4oaDApO1xuICAgICAgICAgIHgzID0geTMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4MiA9IHkyID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChkYSA+IM61ICYmIChyYyA9IE1hdGgubWluKE1hdGguYWJzKHIxIC0gcjApIC8gMiwgK2Nvcm5lclJhZGl1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkgPiAuMDAxKSB7XG4gICAgICAgIGNyID0gcjAgPCByMSBeIGN3ID8gMCA6IDE7XG4gICAgICAgIHZhciByYzEgPSByYywgcmMwID0gcmM7XG4gICAgICAgIGlmIChkYSA8IM+AKSB7XG4gICAgICAgICAgdmFyIG9jID0geDMgPT0gbnVsbCA/IFsgeDIsIHkyIF0gOiB4MSA9PSBudWxsID8gWyB4MCwgeTAgXSA6IGQzX2dlb21fcG9seWdvbkludGVyc2VjdChbIHgwLCB5MCBdLCBbIHgzLCB5MyBdLCBbIHgxLCB5MSBdLCBbIHgyLCB5MiBdKSwgYXggPSB4MCAtIG9jWzBdLCBheSA9IHkwIC0gb2NbMV0sIGJ4ID0geDEgLSBvY1swXSwgYnkgPSB5MSAtIG9jWzFdLCBrYyA9IDEgLyBNYXRoLnNpbihNYXRoLmFjb3MoKGF4ICogYnggKyBheSAqIGJ5KSAvIChNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpICogTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KSkpIC8gMiksIGxjID0gTWF0aC5zcXJ0KG9jWzBdICogb2NbMF0gKyBvY1sxXSAqIG9jWzFdKTtcbiAgICAgICAgICByYzAgPSBNYXRoLm1pbihyYywgKHIwIC0gbGMpIC8gKGtjIC0gMSkpO1xuICAgICAgICAgIHJjMSA9IE1hdGgubWluKHJjLCAocjEgLSBsYykgLyAoa2MgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHgxICE9IG51bGwpIHtcbiAgICAgICAgICB2YXIgdDMwID0gZDNfc3ZnX2FyY0Nvcm5lclRhbmdlbnRzKHgzID09IG51bGwgPyBbIHgyLCB5MiBdIDogWyB4MywgeTMgXSwgWyB4MCwgeTAgXSwgcjEsIHJjMSwgY3cpLCB0MTIgPSBkM19zdmdfYXJjQ29ybmVyVGFuZ2VudHMoWyB4MSwgeTEgXSwgWyB4MiwgeTIgXSwgcjEsIHJjMSwgY3cpO1xuICAgICAgICAgIGlmIChyYyA9PT0gcmMxKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2goXCJNXCIsIHQzMFswXSwgXCJBXCIsIHJjMSwgXCIsXCIsIHJjMSwgXCIgMCAwLFwiLCBjciwgXCIgXCIsIHQzMFsxXSwgXCJBXCIsIHIxLCBcIixcIiwgcjEsIFwiIDAgXCIsIDEgLSBjdyBeIGQzX3N2Z19hcmNTd2VlcCh0MzBbMV1bMF0sIHQzMFsxXVsxXSwgdDEyWzFdWzBdLCB0MTJbMV1bMV0pLCBcIixcIiwgY3csIFwiIFwiLCB0MTJbMV0sIFwiQVwiLCByYzEsIFwiLFwiLCByYzEsIFwiIDAgMCxcIiwgY3IsIFwiIFwiLCB0MTJbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXRoLnB1c2goXCJNXCIsIHQzMFswXSwgXCJBXCIsIHJjMSwgXCIsXCIsIHJjMSwgXCIgMCAxLFwiLCBjciwgXCIgXCIsIHQxMlswXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGgucHVzaChcIk1cIiwgeDAsIFwiLFwiLCB5MCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHgzICE9IG51bGwpIHtcbiAgICAgICAgICB2YXIgdDAzID0gZDNfc3ZnX2FyY0Nvcm5lclRhbmdlbnRzKFsgeDAsIHkwIF0sIFsgeDMsIHkzIF0sIHIwLCAtcmMwLCBjdyksIHQyMSA9IGQzX3N2Z19hcmNDb3JuZXJUYW5nZW50cyhbIHgyLCB5MiBdLCB4MSA9PSBudWxsID8gWyB4MCwgeTAgXSA6IFsgeDEsIHkxIF0sIHIwLCAtcmMwLCBjdyk7XG4gICAgICAgICAgaWYgKHJjID09PSByYzApIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChcIkxcIiwgdDIxWzBdLCBcIkFcIiwgcmMwLCBcIixcIiwgcmMwLCBcIiAwIDAsXCIsIGNyLCBcIiBcIiwgdDIxWzFdLCBcIkFcIiwgcjAsIFwiLFwiLCByMCwgXCIgMCBcIiwgY3cgXiBkM19zdmdfYXJjU3dlZXAodDIxWzFdWzBdLCB0MjFbMV1bMV0sIHQwM1sxXVswXSwgdDAzWzFdWzFdKSwgXCIsXCIsIDEgLSBjdywgXCIgXCIsIHQwM1sxXSwgXCJBXCIsIHJjMCwgXCIsXCIsIHJjMCwgXCIgMCAwLFwiLCBjciwgXCIgXCIsIHQwM1swXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChcIkxcIiwgdDIxWzBdLCBcIkFcIiwgcmMwLCBcIixcIiwgcmMwLCBcIiAwIDAsXCIsIGNyLCBcIiBcIiwgdDAzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aC5wdXNoKFwiTFwiLCB4MiwgXCIsXCIsIHkyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aC5wdXNoKFwiTVwiLCB4MCwgXCIsXCIsIHkwKTtcbiAgICAgICAgaWYgKHgxICE9IG51bGwpIHBhdGgucHVzaChcIkFcIiwgcjEsIFwiLFwiLCByMSwgXCIgMCBcIiwgbDEsIFwiLFwiLCBjdywgXCIgXCIsIHgxLCBcIixcIiwgeTEpO1xuICAgICAgICBwYXRoLnB1c2goXCJMXCIsIHgyLCBcIixcIiwgeTIpO1xuICAgICAgICBpZiAoeDMgIT0gbnVsbCkgcGF0aC5wdXNoKFwiQVwiLCByMCwgXCIsXCIsIHIwLCBcIiAwIFwiLCBsMCwgXCIsXCIsIDEgLSBjdywgXCIgXCIsIHgzLCBcIixcIiwgeTMpO1xuICAgICAgfVxuICAgICAgcGF0aC5wdXNoKFwiWlwiKTtcbiAgICAgIHJldHVybiBwYXRoLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNpcmNsZVNlZ21lbnQocjEsIGN3KSB7XG4gICAgICByZXR1cm4gXCJNMCxcIiArIHIxICsgXCJBXCIgKyByMSArIFwiLFwiICsgcjEgKyBcIiAwIDEsXCIgKyBjdyArIFwiIDAsXCIgKyAtcjEgKyBcIkFcIiArIHIxICsgXCIsXCIgKyByMSArIFwiIDAgMSxcIiArIGN3ICsgXCIgMCxcIiArIHIxO1xuICAgIH1cbiAgICBhcmMuaW5uZXJSYWRpdXMgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBpbm5lclJhZGl1cztcbiAgICAgIGlubmVyUmFkaXVzID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMub3V0ZXJSYWRpdXMgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvdXRlclJhZGl1cztcbiAgICAgIG91dGVyUmFkaXVzID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMuY29ybmVyUmFkaXVzID0gZnVuY3Rpb24odikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29ybmVyUmFkaXVzO1xuICAgICAgY29ybmVyUmFkaXVzID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMucGFkUmFkaXVzID0gZnVuY3Rpb24odikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcGFkUmFkaXVzO1xuICAgICAgcGFkUmFkaXVzID0gdiA9PSBkM19zdmdfYXJjQXV0byA/IGQzX3N2Z19hcmNBdXRvIDogZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMuc3RhcnRBbmdsZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHN0YXJ0QW5nbGU7XG4gICAgICBzdGFydEFuZ2xlID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMuZW5kQW5nbGUgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBlbmRBbmdsZTtcbiAgICAgIGVuZEFuZ2xlID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMucGFkQW5nbGUgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBwYWRBbmdsZTtcbiAgICAgIHBhZEFuZ2xlID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBhcmM7XG4gICAgfTtcbiAgICBhcmMuY2VudHJvaWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByID0gKCtpbm5lclJhZGl1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpICsgK291dGVyUmFkaXVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIC8gMiwgYSA9ICgrc3RhcnRBbmdsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpICsgK2VuZEFuZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIC8gMiAtIGhhbGbPgDtcbiAgICAgIHJldHVybiBbIE1hdGguY29zKGEpICogciwgTWF0aC5zaW4oYSkgKiByIF07XG4gICAgfTtcbiAgICByZXR1cm4gYXJjO1xuICB9O1xuICB2YXIgZDNfc3ZnX2FyY0F1dG8gPSBcImF1dG9cIjtcbiAgZnVuY3Rpb24gZDNfc3ZnX2FyY0lubmVyUmFkaXVzKGQpIHtcbiAgICByZXR1cm4gZC5pbm5lclJhZGl1cztcbiAgfVxuICBmdW5jdGlvbiBkM19zdmdfYXJjT3V0ZXJSYWRpdXMoZCkge1xuICAgIHJldHVybiBkLm91dGVyUmFkaXVzO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19hcmNTdGFydEFuZ2xlKGQpIHtcbiAgICByZXR1cm4gZC5zdGFydEFuZ2xlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19hcmNFbmRBbmdsZShkKSB7XG4gICAgcmV0dXJuIGQuZW5kQW5nbGU7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2FyY1BhZEFuZ2xlKGQpIHtcbiAgICByZXR1cm4gZCAmJiBkLnBhZEFuZ2xlO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19hcmNTd2VlcCh4MCwgeTAsIHgxLCB5MSkge1xuICAgIHJldHVybiAoeDAgLSB4MSkgKiB5MCAtICh5MCAtIHkxKSAqIHgwID4gMCA/IDAgOiAxO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19hcmNDb3JuZXJUYW5nZW50cyhwMCwgcDEsIHIxLCByYywgY3cpIHtcbiAgICB2YXIgeDAxID0gcDBbMF0gLSBwMVswXSwgeTAxID0gcDBbMV0gLSBwMVsxXSwgbG8gPSAoY3cgPyByYyA6IC1yYykgLyBNYXRoLnNxcnQoeDAxICogeDAxICsgeTAxICogeTAxKSwgb3ggPSBsbyAqIHkwMSwgb3kgPSAtbG8gKiB4MDEsIHgxID0gcDBbMF0gKyBveCwgeTEgPSBwMFsxXSArIG95LCB4MiA9IHAxWzBdICsgb3gsIHkyID0gcDFbMV0gKyBveSwgeDMgPSAoeDEgKyB4MikgLyAyLCB5MyA9ICh5MSArIHkyKSAvIDIsIGR4ID0geDIgLSB4MSwgZHkgPSB5MiAtIHkxLCBkMiA9IGR4ICogZHggKyBkeSAqIGR5LCByID0gcjEgLSByYywgRCA9IHgxICogeTIgLSB4MiAqIHkxLCBkID0gKGR5IDwgMCA/IC0xIDogMSkgKiBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgciAqIHIgKiBkMiAtIEQgKiBEKSksIGN4MCA9IChEICogZHkgLSBkeCAqIGQpIC8gZDIsIGN5MCA9ICgtRCAqIGR4IC0gZHkgKiBkKSAvIGQyLCBjeDEgPSAoRCAqIGR5ICsgZHggKiBkKSAvIGQyLCBjeTEgPSAoLUQgKiBkeCArIGR5ICogZCkgLyBkMiwgZHgwID0gY3gwIC0geDMsIGR5MCA9IGN5MCAtIHkzLCBkeDEgPSBjeDEgLSB4MywgZHkxID0gY3kxIC0geTM7XG4gICAgaWYgKGR4MCAqIGR4MCArIGR5MCAqIGR5MCA+IGR4MSAqIGR4MSArIGR5MSAqIGR5MSkgY3gwID0gY3gxLCBjeTAgPSBjeTE7XG4gICAgcmV0dXJuIFsgWyBjeDAgLSBveCwgY3kwIC0gb3kgXSwgWyBjeDAgKiByMSAvIHIsIGN5MCAqIHIxIC8gciBdIF07XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmUocHJvamVjdGlvbikge1xuICAgIHZhciB4ID0gZDNfZ2VvbV9wb2ludFgsIHkgPSBkM19nZW9tX3BvaW50WSwgZGVmaW5lZCA9IGQzX3RydWUsIGludGVycG9sYXRlID0gZDNfc3ZnX2xpbmVMaW5lYXIsIGludGVycG9sYXRlS2V5ID0gaW50ZXJwb2xhdGUua2V5LCB0ZW5zaW9uID0gLjc7XG4gICAgZnVuY3Rpb24gbGluZShkYXRhKSB7XG4gICAgICB2YXIgc2VnbWVudHMgPSBbXSwgcG9pbnRzID0gW10sIGkgPSAtMSwgbiA9IGRhdGEubGVuZ3RoLCBkLCBmeCA9IGQzX2Z1bmN0b3IoeCksIGZ5ID0gZDNfZnVuY3Rvcih5KTtcbiAgICAgIGZ1bmN0aW9uIHNlZ21lbnQoKSB7XG4gICAgICAgIHNlZ21lbnRzLnB1c2goXCJNXCIsIGludGVycG9sYXRlKHByb2plY3Rpb24ocG9pbnRzKSwgdGVuc2lvbikpO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKGRlZmluZWQuY2FsbCh0aGlzLCBkID0gZGF0YVtpXSwgaSkpIHtcbiAgICAgICAgICBwb2ludHMucHVzaChbICtmeC5jYWxsKHRoaXMsIGQsIGkpLCArZnkuY2FsbCh0aGlzLCBkLCBpKSBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgc2VnbWVudCgpO1xuICAgICAgICAgIHBvaW50cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCkgc2VnbWVudCgpO1xuICAgICAgcmV0dXJuIHNlZ21lbnRzLmxlbmd0aCA/IHNlZ21lbnRzLmpvaW4oXCJcIikgOiBudWxsO1xuICAgIH1cbiAgICBsaW5lLnggPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB4O1xuICAgICAgeCA9IF87XG4gICAgICByZXR1cm4gbGluZTtcbiAgICB9O1xuICAgIGxpbmUueSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHk7XG4gICAgICB5ID0gXztcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG4gICAgbGluZS5kZWZpbmVkID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZGVmaW5lZDtcbiAgICAgIGRlZmluZWQgPSBfO1xuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfTtcbiAgICBsaW5lLmludGVycG9sYXRlID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gaW50ZXJwb2xhdGVLZXk7XG4gICAgICBpZiAodHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIikgaW50ZXJwb2xhdGVLZXkgPSBpbnRlcnBvbGF0ZSA9IF87IGVsc2UgaW50ZXJwb2xhdGVLZXkgPSAoaW50ZXJwb2xhdGUgPSBkM19zdmdfbGluZUludGVycG9sYXRvcnMuZ2V0KF8pIHx8IGQzX3N2Z19saW5lTGluZWFyKS5rZXk7XG4gICAgICByZXR1cm4gbGluZTtcbiAgICB9O1xuICAgIGxpbmUudGVuc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRlbnNpb247XG4gICAgICB0ZW5zaW9uID0gXztcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cbiAgZDMuc3ZnLmxpbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc3ZnX2xpbmUoZDNfaWRlbnRpdHkpO1xuICB9O1xuICB2YXIgZDNfc3ZnX2xpbmVJbnRlcnBvbGF0b3JzID0gZDMubWFwKHtcbiAgICBsaW5lYXI6IGQzX3N2Z19saW5lTGluZWFyLFxuICAgIFwibGluZWFyLWNsb3NlZFwiOiBkM19zdmdfbGluZUxpbmVhckNsb3NlZCxcbiAgICBzdGVwOiBkM19zdmdfbGluZVN0ZXAsXG4gICAgXCJzdGVwLWJlZm9yZVwiOiBkM19zdmdfbGluZVN0ZXBCZWZvcmUsXG4gICAgXCJzdGVwLWFmdGVyXCI6IGQzX3N2Z19saW5lU3RlcEFmdGVyLFxuICAgIGJhc2lzOiBkM19zdmdfbGluZUJhc2lzLFxuICAgIFwiYmFzaXMtb3BlblwiOiBkM19zdmdfbGluZUJhc2lzT3BlbixcbiAgICBcImJhc2lzLWNsb3NlZFwiOiBkM19zdmdfbGluZUJhc2lzQ2xvc2VkLFxuICAgIGJ1bmRsZTogZDNfc3ZnX2xpbmVCdW5kbGUsXG4gICAgY2FyZGluYWw6IGQzX3N2Z19saW5lQ2FyZGluYWwsXG4gICAgXCJjYXJkaW5hbC1vcGVuXCI6IGQzX3N2Z19saW5lQ2FyZGluYWxPcGVuLFxuICAgIFwiY2FyZGluYWwtY2xvc2VkXCI6IGQzX3N2Z19saW5lQ2FyZGluYWxDbG9zZWQsXG4gICAgbW9ub3RvbmU6IGQzX3N2Z19saW5lTW9ub3RvbmVcbiAgfSk7XG4gIGQzX3N2Z19saW5lSW50ZXJwb2xhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YWx1ZS5rZXkgPSBrZXk7XG4gICAgdmFsdWUuY2xvc2VkID0gLy1jbG9zZWQkLy50ZXN0KGtleSk7XG4gIH0pO1xuICBmdW5jdGlvbiBkM19zdmdfbGluZUxpbmVhcihwb2ludHMpIHtcbiAgICByZXR1cm4gcG9pbnRzLmxlbmd0aCA+IDEgPyBwb2ludHMuam9pbihcIkxcIikgOiBwb2ludHMgKyBcIlpcIjtcbiAgfVxuICBmdW5jdGlvbiBkM19zdmdfbGluZUxpbmVhckNsb3NlZChwb2ludHMpIHtcbiAgICByZXR1cm4gcG9pbnRzLmpvaW4oXCJMXCIpICsgXCJaXCI7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVTdGVwKHBvaW50cykge1xuICAgIHZhciBpID0gMCwgbiA9IHBvaW50cy5sZW5ndGgsIHAgPSBwb2ludHNbMF0sIHBhdGggPSBbIHBbMF0sIFwiLFwiLCBwWzFdIF07XG4gICAgd2hpbGUgKCsraSA8IG4pIHBhdGgucHVzaChcIkhcIiwgKHBbMF0gKyAocCA9IHBvaW50c1tpXSlbMF0pIC8gMiwgXCJWXCIsIHBbMV0pO1xuICAgIGlmIChuID4gMSkgcGF0aC5wdXNoKFwiSFwiLCBwWzBdKTtcbiAgICByZXR1cm4gcGF0aC5qb2luKFwiXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lU3RlcEJlZm9yZShwb2ludHMpIHtcbiAgICB2YXIgaSA9IDAsIG4gPSBwb2ludHMubGVuZ3RoLCBwID0gcG9pbnRzWzBdLCBwYXRoID0gWyBwWzBdLCBcIixcIiwgcFsxXSBdO1xuICAgIHdoaWxlICgrK2kgPCBuKSBwYXRoLnB1c2goXCJWXCIsIChwID0gcG9pbnRzW2ldKVsxXSwgXCJIXCIsIHBbMF0pO1xuICAgIHJldHVybiBwYXRoLmpvaW4oXCJcIik7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVTdGVwQWZ0ZXIocG9pbnRzKSB7XG4gICAgdmFyIGkgPSAwLCBuID0gcG9pbnRzLmxlbmd0aCwgcCA9IHBvaW50c1swXSwgcGF0aCA9IFsgcFswXSwgXCIsXCIsIHBbMV0gXTtcbiAgICB3aGlsZSAoKytpIDwgbikgcGF0aC5wdXNoKFwiSFwiLCAocCA9IHBvaW50c1tpXSlbMF0sIFwiVlwiLCBwWzFdKTtcbiAgICByZXR1cm4gcGF0aC5qb2luKFwiXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lQ2FyZGluYWxPcGVuKHBvaW50cywgdGVuc2lvbikge1xuICAgIHJldHVybiBwb2ludHMubGVuZ3RoIDwgNCA/IGQzX3N2Z19saW5lTGluZWFyKHBvaW50cykgOiBwb2ludHNbMV0gKyBkM19zdmdfbGluZUhlcm1pdGUocG9pbnRzLnNsaWNlKDEsIC0xKSwgZDNfc3ZnX2xpbmVDYXJkaW5hbFRhbmdlbnRzKHBvaW50cywgdGVuc2lvbikpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lQ2FyZGluYWxDbG9zZWQocG9pbnRzLCB0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIHBvaW50cy5sZW5ndGggPCAzID8gZDNfc3ZnX2xpbmVMaW5lYXJDbG9zZWQocG9pbnRzKSA6IHBvaW50c1swXSArIGQzX3N2Z19saW5lSGVybWl0ZSgocG9pbnRzLnB1c2gocG9pbnRzWzBdKSwgXG4gICAgcG9pbnRzKSwgZDNfc3ZnX2xpbmVDYXJkaW5hbFRhbmdlbnRzKFsgcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSBdLmNvbmNhdChwb2ludHMsIFsgcG9pbnRzWzFdIF0pLCB0ZW5zaW9uKSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVDYXJkaW5hbChwb2ludHMsIHRlbnNpb24pIHtcbiAgICByZXR1cm4gcG9pbnRzLmxlbmd0aCA8IDMgPyBkM19zdmdfbGluZUxpbmVhcihwb2ludHMpIDogcG9pbnRzWzBdICsgZDNfc3ZnX2xpbmVIZXJtaXRlKHBvaW50cywgZDNfc3ZnX2xpbmVDYXJkaW5hbFRhbmdlbnRzKHBvaW50cywgdGVuc2lvbikpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lSGVybWl0ZShwb2ludHMsIHRhbmdlbnRzKSB7XG4gICAgaWYgKHRhbmdlbnRzLmxlbmd0aCA8IDEgfHwgcG9pbnRzLmxlbmd0aCAhPSB0YW5nZW50cy5sZW5ndGggJiYgcG9pbnRzLmxlbmd0aCAhPSB0YW5nZW50cy5sZW5ndGggKyAyKSB7XG4gICAgICByZXR1cm4gZDNfc3ZnX2xpbmVMaW5lYXIocG9pbnRzKTtcbiAgICB9XG4gICAgdmFyIHF1YWQgPSBwb2ludHMubGVuZ3RoICE9IHRhbmdlbnRzLmxlbmd0aCwgcGF0aCA9IFwiXCIsIHAwID0gcG9pbnRzWzBdLCBwID0gcG9pbnRzWzFdLCB0MCA9IHRhbmdlbnRzWzBdLCB0ID0gdDAsIHBpID0gMTtcbiAgICBpZiAocXVhZCkge1xuICAgICAgcGF0aCArPSBcIlFcIiArIChwWzBdIC0gdDBbMF0gKiAyIC8gMykgKyBcIixcIiArIChwWzFdIC0gdDBbMV0gKiAyIC8gMykgKyBcIixcIiArIHBbMF0gKyBcIixcIiArIHBbMV07XG4gICAgICBwMCA9IHBvaW50c1sxXTtcbiAgICAgIHBpID0gMjtcbiAgICB9XG4gICAgaWYgKHRhbmdlbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHQgPSB0YW5nZW50c1sxXTtcbiAgICAgIHAgPSBwb2ludHNbcGldO1xuICAgICAgcGkrKztcbiAgICAgIHBhdGggKz0gXCJDXCIgKyAocDBbMF0gKyB0MFswXSkgKyBcIixcIiArIChwMFsxXSArIHQwWzFdKSArIFwiLFwiICsgKHBbMF0gLSB0WzBdKSArIFwiLFwiICsgKHBbMV0gLSB0WzFdKSArIFwiLFwiICsgcFswXSArIFwiLFwiICsgcFsxXTtcbiAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgdGFuZ2VudHMubGVuZ3RoOyBpKyssIHBpKyspIHtcbiAgICAgICAgcCA9IHBvaW50c1twaV07XG4gICAgICAgIHQgPSB0YW5nZW50c1tpXTtcbiAgICAgICAgcGF0aCArPSBcIlNcIiArIChwWzBdIC0gdFswXSkgKyBcIixcIiArIChwWzFdIC0gdFsxXSkgKyBcIixcIiArIHBbMF0gKyBcIixcIiArIHBbMV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChxdWFkKSB7XG4gICAgICB2YXIgbHAgPSBwb2ludHNbcGldO1xuICAgICAgcGF0aCArPSBcIlFcIiArIChwWzBdICsgdFswXSAqIDIgLyAzKSArIFwiLFwiICsgKHBbMV0gKyB0WzFdICogMiAvIDMpICsgXCIsXCIgKyBscFswXSArIFwiLFwiICsgbHBbMV07XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lQ2FyZGluYWxUYW5nZW50cyhwb2ludHMsIHRlbnNpb24pIHtcbiAgICB2YXIgdGFuZ2VudHMgPSBbXSwgYSA9ICgxIC0gdGVuc2lvbikgLyAyLCBwMCwgcDEgPSBwb2ludHNbMF0sIHAyID0gcG9pbnRzWzFdLCBpID0gMSwgbiA9IHBvaW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIHAwID0gcDE7XG4gICAgICBwMSA9IHAyO1xuICAgICAgcDIgPSBwb2ludHNbaV07XG4gICAgICB0YW5nZW50cy5wdXNoKFsgYSAqIChwMlswXSAtIHAwWzBdKSwgYSAqIChwMlsxXSAtIHAwWzFdKSBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhbmdlbnRzO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lQmFzaXMocG9pbnRzKSB7XG4gICAgaWYgKHBvaW50cy5sZW5ndGggPCAzKSByZXR1cm4gZDNfc3ZnX2xpbmVMaW5lYXIocG9pbnRzKTtcbiAgICB2YXIgaSA9IDEsIG4gPSBwb2ludHMubGVuZ3RoLCBwaSA9IHBvaW50c1swXSwgeDAgPSBwaVswXSwgeTAgPSBwaVsxXSwgcHggPSBbIHgwLCB4MCwgeDAsIChwaSA9IHBvaW50c1sxXSlbMF0gXSwgcHkgPSBbIHkwLCB5MCwgeTAsIHBpWzFdIF0sIHBhdGggPSBbIHgwLCBcIixcIiwgeTAsIFwiTFwiLCBkM19zdmdfbGluZURvdDQoZDNfc3ZnX2xpbmVCYXNpc0JlemllcjMsIHB4KSwgXCIsXCIsIGQzX3N2Z19saW5lRG90NChkM19zdmdfbGluZUJhc2lzQmV6aWVyMywgcHkpIF07XG4gICAgcG9pbnRzLnB1c2gocG9pbnRzW24gLSAxXSk7XG4gICAgd2hpbGUgKCsraSA8PSBuKSB7XG4gICAgICBwaSA9IHBvaW50c1tpXTtcbiAgICAgIHB4LnNoaWZ0KCk7XG4gICAgICBweC5wdXNoKHBpWzBdKTtcbiAgICAgIHB5LnNoaWZ0KCk7XG4gICAgICBweS5wdXNoKHBpWzFdKTtcbiAgICAgIGQzX3N2Z19saW5lQmFzaXNCZXppZXIocGF0aCwgcHgsIHB5KTtcbiAgICB9XG4gICAgcG9pbnRzLnBvcCgpO1xuICAgIHBhdGgucHVzaChcIkxcIiwgcGkpO1xuICAgIHJldHVybiBwYXRoLmpvaW4oXCJcIik7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVCYXNpc09wZW4ocG9pbnRzKSB7XG4gICAgaWYgKHBvaW50cy5sZW5ndGggPCA0KSByZXR1cm4gZDNfc3ZnX2xpbmVMaW5lYXIocG9pbnRzKTtcbiAgICB2YXIgcGF0aCA9IFtdLCBpID0gLTEsIG4gPSBwb2ludHMubGVuZ3RoLCBwaSwgcHggPSBbIDAgXSwgcHkgPSBbIDAgXTtcbiAgICB3aGlsZSAoKytpIDwgMykge1xuICAgICAgcGkgPSBwb2ludHNbaV07XG4gICAgICBweC5wdXNoKHBpWzBdKTtcbiAgICAgIHB5LnB1c2gocGlbMV0pO1xuICAgIH1cbiAgICBwYXRoLnB1c2goZDNfc3ZnX2xpbmVEb3Q0KGQzX3N2Z19saW5lQmFzaXNCZXppZXIzLCBweCkgKyBcIixcIiArIGQzX3N2Z19saW5lRG90NChkM19zdmdfbGluZUJhc2lzQmV6aWVyMywgcHkpKTtcbiAgICAtLWk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIHBpID0gcG9pbnRzW2ldO1xuICAgICAgcHguc2hpZnQoKTtcbiAgICAgIHB4LnB1c2gocGlbMF0pO1xuICAgICAgcHkuc2hpZnQoKTtcbiAgICAgIHB5LnB1c2gocGlbMV0pO1xuICAgICAgZDNfc3ZnX2xpbmVCYXNpc0JlemllcihwYXRoLCBweCwgcHkpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aC5qb2luKFwiXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lQmFzaXNDbG9zZWQocG9pbnRzKSB7XG4gICAgdmFyIHBhdGgsIGkgPSAtMSwgbiA9IHBvaW50cy5sZW5ndGgsIG0gPSBuICsgNCwgcGksIHB4ID0gW10sIHB5ID0gW107XG4gICAgd2hpbGUgKCsraSA8IDQpIHtcbiAgICAgIHBpID0gcG9pbnRzW2kgJSBuXTtcbiAgICAgIHB4LnB1c2gocGlbMF0pO1xuICAgICAgcHkucHVzaChwaVsxXSk7XG4gICAgfVxuICAgIHBhdGggPSBbIGQzX3N2Z19saW5lRG90NChkM19zdmdfbGluZUJhc2lzQmV6aWVyMywgcHgpLCBcIixcIiwgZDNfc3ZnX2xpbmVEb3Q0KGQzX3N2Z19saW5lQmFzaXNCZXppZXIzLCBweSkgXTtcbiAgICAtLWk7XG4gICAgd2hpbGUgKCsraSA8IG0pIHtcbiAgICAgIHBpID0gcG9pbnRzW2kgJSBuXTtcbiAgICAgIHB4LnNoaWZ0KCk7XG4gICAgICBweC5wdXNoKHBpWzBdKTtcbiAgICAgIHB5LnNoaWZ0KCk7XG4gICAgICBweS5wdXNoKHBpWzFdKTtcbiAgICAgIGQzX3N2Z19saW5lQmFzaXNCZXppZXIocGF0aCwgcHgsIHB5KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGguam9pbihcIlwiKTtcbiAgfVxuICBmdW5jdGlvbiBkM19zdmdfbGluZUJ1bmRsZShwb2ludHMsIHRlbnNpb24pIHtcbiAgICB2YXIgbiA9IHBvaW50cy5sZW5ndGggLSAxO1xuICAgIGlmIChuKSB7XG4gICAgICB2YXIgeDAgPSBwb2ludHNbMF1bMF0sIHkwID0gcG9pbnRzWzBdWzFdLCBkeCA9IHBvaW50c1tuXVswXSAtIHgwLCBkeSA9IHBvaW50c1tuXVsxXSAtIHkwLCBpID0gLTEsIHAsIHQ7XG4gICAgICB3aGlsZSAoKytpIDw9IG4pIHtcbiAgICAgICAgcCA9IHBvaW50c1tpXTtcbiAgICAgICAgdCA9IGkgLyBuO1xuICAgICAgICBwWzBdID0gdGVuc2lvbiAqIHBbMF0gKyAoMSAtIHRlbnNpb24pICogKHgwICsgdCAqIGR4KTtcbiAgICAgICAgcFsxXSA9IHRlbnNpb24gKiBwWzFdICsgKDEgLSB0ZW5zaW9uKSAqICh5MCArIHQgKiBkeSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkM19zdmdfbGluZUJhc2lzKHBvaW50cyk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVEb3Q0KGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdICsgYVszXSAqIGJbM107XG4gIH1cbiAgdmFyIGQzX3N2Z19saW5lQmFzaXNCZXppZXIxID0gWyAwLCAyIC8gMywgMSAvIDMsIDAgXSwgZDNfc3ZnX2xpbmVCYXNpc0JlemllcjIgPSBbIDAsIDEgLyAzLCAyIC8gMywgMCBdLCBkM19zdmdfbGluZUJhc2lzQmV6aWVyMyA9IFsgMCwgMSAvIDYsIDIgLyAzLCAxIC8gNiBdO1xuICBmdW5jdGlvbiBkM19zdmdfbGluZUJhc2lzQmV6aWVyKHBhdGgsIHgsIHkpIHtcbiAgICBwYXRoLnB1c2goXCJDXCIsIGQzX3N2Z19saW5lRG90NChkM19zdmdfbGluZUJhc2lzQmV6aWVyMSwgeCksIFwiLFwiLCBkM19zdmdfbGluZURvdDQoZDNfc3ZnX2xpbmVCYXNpc0JlemllcjEsIHkpLCBcIixcIiwgZDNfc3ZnX2xpbmVEb3Q0KGQzX3N2Z19saW5lQmFzaXNCZXppZXIyLCB4KSwgXCIsXCIsIGQzX3N2Z19saW5lRG90NChkM19zdmdfbGluZUJhc2lzQmV6aWVyMiwgeSksIFwiLFwiLCBkM19zdmdfbGluZURvdDQoZDNfc3ZnX2xpbmVCYXNpc0JlemllcjMsIHgpLCBcIixcIiwgZDNfc3ZnX2xpbmVEb3Q0KGQzX3N2Z19saW5lQmFzaXNCZXppZXIzLCB5KSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVTbG9wZShwMCwgcDEpIHtcbiAgICByZXR1cm4gKHAxWzFdIC0gcDBbMV0pIC8gKHAxWzBdIC0gcDBbMF0pO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lRmluaXRlRGlmZmVyZW5jZXMocG9pbnRzKSB7XG4gICAgdmFyIGkgPSAwLCBqID0gcG9pbnRzLmxlbmd0aCAtIDEsIG0gPSBbXSwgcDAgPSBwb2ludHNbMF0sIHAxID0gcG9pbnRzWzFdLCBkID0gbVswXSA9IGQzX3N2Z19saW5lU2xvcGUocDAsIHAxKTtcbiAgICB3aGlsZSAoKytpIDwgaikge1xuICAgICAgbVtpXSA9IChkICsgKGQgPSBkM19zdmdfbGluZVNsb3BlKHAwID0gcDEsIHAxID0gcG9pbnRzW2kgKyAxXSkpKSAvIDI7XG4gICAgfVxuICAgIG1baV0gPSBkO1xuICAgIHJldHVybiBtO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lTW9ub3RvbmVUYW5nZW50cyhwb2ludHMpIHtcbiAgICB2YXIgdGFuZ2VudHMgPSBbXSwgZCwgYSwgYiwgcywgbSA9IGQzX3N2Z19saW5lRmluaXRlRGlmZmVyZW5jZXMocG9pbnRzKSwgaSA9IC0xLCBqID0gcG9pbnRzLmxlbmd0aCAtIDE7XG4gICAgd2hpbGUgKCsraSA8IGopIHtcbiAgICAgIGQgPSBkM19zdmdfbGluZVNsb3BlKHBvaW50c1tpXSwgcG9pbnRzW2kgKyAxXSk7XG4gICAgICBpZiAoYWJzKGQpIDwgzrUpIHtcbiAgICAgICAgbVtpXSA9IG1baSArIDFdID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEgPSBtW2ldIC8gZDtcbiAgICAgICAgYiA9IG1baSArIDFdIC8gZDtcbiAgICAgICAgcyA9IGEgKiBhICsgYiAqIGI7XG4gICAgICAgIGlmIChzID4gOSkge1xuICAgICAgICAgIHMgPSBkICogMyAvIE1hdGguc3FydChzKTtcbiAgICAgICAgICBtW2ldID0gcyAqIGE7XG4gICAgICAgICAgbVtpICsgMV0gPSBzICogYjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8PSBqKSB7XG4gICAgICBzID0gKHBvaW50c1tNYXRoLm1pbihqLCBpICsgMSldWzBdIC0gcG9pbnRzW01hdGgubWF4KDAsIGkgLSAxKV1bMF0pIC8gKDYgKiAoMSArIG1baV0gKiBtW2ldKSk7XG4gICAgICB0YW5nZW50cy5wdXNoKFsgcyB8fCAwLCBtW2ldICogcyB8fCAwIF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGFuZ2VudHM7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2xpbmVNb25vdG9uZShwb2ludHMpIHtcbiAgICByZXR1cm4gcG9pbnRzLmxlbmd0aCA8IDMgPyBkM19zdmdfbGluZUxpbmVhcihwb2ludHMpIDogcG9pbnRzWzBdICsgZDNfc3ZnX2xpbmVIZXJtaXRlKHBvaW50cywgZDNfc3ZnX2xpbmVNb25vdG9uZVRhbmdlbnRzKHBvaW50cykpO1xuICB9XG4gIGQzLnN2Zy5saW5lLnJhZGlhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsaW5lID0gZDNfc3ZnX2xpbmUoZDNfc3ZnX2xpbmVSYWRpYWwpO1xuICAgIGxpbmUucmFkaXVzID0gbGluZS54LCBkZWxldGUgbGluZS54O1xuICAgIGxpbmUuYW5nbGUgPSBsaW5lLnksIGRlbGV0ZSBsaW5lLnk7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3N2Z19saW5lUmFkaWFsKHBvaW50cykge1xuICAgIHZhciBwb2ludCwgaSA9IC0xLCBuID0gcG9pbnRzLmxlbmd0aCwgciwgYTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgcG9pbnQgPSBwb2ludHNbaV07XG4gICAgICByID0gcG9pbnRbMF07XG4gICAgICBhID0gcG9pbnRbMV0gLSBoYWxmz4A7XG4gICAgICBwb2ludFswXSA9IHIgKiBNYXRoLmNvcyhhKTtcbiAgICAgIHBvaW50WzFdID0gciAqIE1hdGguc2luKGEpO1xuICAgIH1cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3N2Z19hcmVhKHByb2plY3Rpb24pIHtcbiAgICB2YXIgeDAgPSBkM19nZW9tX3BvaW50WCwgeDEgPSBkM19nZW9tX3BvaW50WCwgeTAgPSAwLCB5MSA9IGQzX2dlb21fcG9pbnRZLCBkZWZpbmVkID0gZDNfdHJ1ZSwgaW50ZXJwb2xhdGUgPSBkM19zdmdfbGluZUxpbmVhciwgaW50ZXJwb2xhdGVLZXkgPSBpbnRlcnBvbGF0ZS5rZXksIGludGVycG9sYXRlUmV2ZXJzZSA9IGludGVycG9sYXRlLCBMID0gXCJMXCIsIHRlbnNpb24gPSAuNztcbiAgICBmdW5jdGlvbiBhcmVhKGRhdGEpIHtcbiAgICAgIHZhciBzZWdtZW50cyA9IFtdLCBwb2ludHMwID0gW10sIHBvaW50czEgPSBbXSwgaSA9IC0xLCBuID0gZGF0YS5sZW5ndGgsIGQsIGZ4MCA9IGQzX2Z1bmN0b3IoeDApLCBmeTAgPSBkM19mdW5jdG9yKHkwKSwgZngxID0geDAgPT09IHgxID8gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSA6IGQzX2Z1bmN0b3IoeDEpLCBmeTEgPSB5MCA9PT0geTEgPyBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHk7XG4gICAgICB9IDogZDNfZnVuY3Rvcih5MSksIHgsIHk7XG4gICAgICBmdW5jdGlvbiBzZWdtZW50KCkge1xuICAgICAgICBzZWdtZW50cy5wdXNoKFwiTVwiLCBpbnRlcnBvbGF0ZShwcm9qZWN0aW9uKHBvaW50czEpLCB0ZW5zaW9uKSwgTCwgaW50ZXJwb2xhdGVSZXZlcnNlKHByb2plY3Rpb24ocG9pbnRzMC5yZXZlcnNlKCkpLCB0ZW5zaW9uKSwgXCJaXCIpO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKGRlZmluZWQuY2FsbCh0aGlzLCBkID0gZGF0YVtpXSwgaSkpIHtcbiAgICAgICAgICBwb2ludHMwLnB1c2goWyB4ID0gK2Z4MC5jYWxsKHRoaXMsIGQsIGkpLCB5ID0gK2Z5MC5jYWxsKHRoaXMsIGQsIGkpIF0pO1xuICAgICAgICAgIHBvaW50czEucHVzaChbICtmeDEuY2FsbCh0aGlzLCBkLCBpKSwgK2Z5MS5jYWxsKHRoaXMsIGQsIGkpIF0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBvaW50czAubGVuZ3RoKSB7XG4gICAgICAgICAgc2VnbWVudCgpO1xuICAgICAgICAgIHBvaW50czAgPSBbXTtcbiAgICAgICAgICBwb2ludHMxID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludHMwLmxlbmd0aCkgc2VnbWVudCgpO1xuICAgICAgcmV0dXJuIHNlZ21lbnRzLmxlbmd0aCA/IHNlZ21lbnRzLmpvaW4oXCJcIikgOiBudWxsO1xuICAgIH1cbiAgICBhcmVhLnggPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB4MTtcbiAgICAgIHgwID0geDEgPSBfO1xuICAgICAgcmV0dXJuIGFyZWE7XG4gICAgfTtcbiAgICBhcmVhLngwID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geDA7XG4gICAgICB4MCA9IF87XG4gICAgICByZXR1cm4gYXJlYTtcbiAgICB9O1xuICAgIGFyZWEueDEgPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB4MTtcbiAgICAgIHgxID0gXztcbiAgICAgIHJldHVybiBhcmVhO1xuICAgIH07XG4gICAgYXJlYS55ID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geTE7XG4gICAgICB5MCA9IHkxID0gXztcbiAgICAgIHJldHVybiBhcmVhO1xuICAgIH07XG4gICAgYXJlYS55MCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHkwO1xuICAgICAgeTAgPSBfO1xuICAgICAgcmV0dXJuIGFyZWE7XG4gICAgfTtcbiAgICBhcmVhLnkxID0gZnVuY3Rpb24oXykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geTE7XG4gICAgICB5MSA9IF87XG4gICAgICByZXR1cm4gYXJlYTtcbiAgICB9O1xuICAgIGFyZWEuZGVmaW5lZCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRlZmluZWQ7XG4gICAgICBkZWZpbmVkID0gXztcbiAgICAgIHJldHVybiBhcmVhO1xuICAgIH07XG4gICAgYXJlYS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGludGVycG9sYXRlS2V5O1xuICAgICAgaWYgKHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIpIGludGVycG9sYXRlS2V5ID0gaW50ZXJwb2xhdGUgPSBfOyBlbHNlIGludGVycG9sYXRlS2V5ID0gKGludGVycG9sYXRlID0gZDNfc3ZnX2xpbmVJbnRlcnBvbGF0b3JzLmdldChfKSB8fCBkM19zdmdfbGluZUxpbmVhcikua2V5O1xuICAgICAgaW50ZXJwb2xhdGVSZXZlcnNlID0gaW50ZXJwb2xhdGUucmV2ZXJzZSB8fCBpbnRlcnBvbGF0ZTtcbiAgICAgIEwgPSBpbnRlcnBvbGF0ZS5jbG9zZWQgPyBcIk1cIiA6IFwiTFwiO1xuICAgICAgcmV0dXJuIGFyZWE7XG4gICAgfTtcbiAgICBhcmVhLnRlbnNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0ZW5zaW9uO1xuICAgICAgdGVuc2lvbiA9IF87XG4gICAgICByZXR1cm4gYXJlYTtcbiAgICB9O1xuICAgIHJldHVybiBhcmVhO1xuICB9XG4gIGQzX3N2Z19saW5lU3RlcEJlZm9yZS5yZXZlcnNlID0gZDNfc3ZnX2xpbmVTdGVwQWZ0ZXI7XG4gIGQzX3N2Z19saW5lU3RlcEFmdGVyLnJldmVyc2UgPSBkM19zdmdfbGluZVN0ZXBCZWZvcmU7XG4gIGQzLnN2Zy5hcmVhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3N2Z19hcmVhKGQzX2lkZW50aXR5KTtcbiAgfTtcbiAgZDMuc3ZnLmFyZWEucmFkaWFsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZWEgPSBkM19zdmdfYXJlYShkM19zdmdfbGluZVJhZGlhbCk7XG4gICAgYXJlYS5yYWRpdXMgPSBhcmVhLngsIGRlbGV0ZSBhcmVhLng7XG4gICAgYXJlYS5pbm5lclJhZGl1cyA9IGFyZWEueDAsIGRlbGV0ZSBhcmVhLngwO1xuICAgIGFyZWEub3V0ZXJSYWRpdXMgPSBhcmVhLngxLCBkZWxldGUgYXJlYS54MTtcbiAgICBhcmVhLmFuZ2xlID0gYXJlYS55LCBkZWxldGUgYXJlYS55O1xuICAgIGFyZWEuc3RhcnRBbmdsZSA9IGFyZWEueTAsIGRlbGV0ZSBhcmVhLnkwO1xuICAgIGFyZWEuZW5kQW5nbGUgPSBhcmVhLnkxLCBkZWxldGUgYXJlYS55MTtcbiAgICByZXR1cm4gYXJlYTtcbiAgfTtcbiAgZDMuc3ZnLmNob3JkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNvdXJjZSA9IGQzX3NvdXJjZSwgdGFyZ2V0ID0gZDNfdGFyZ2V0LCByYWRpdXMgPSBkM19zdmdfY2hvcmRSYWRpdXMsIHN0YXJ0QW5nbGUgPSBkM19zdmdfYXJjU3RhcnRBbmdsZSwgZW5kQW5nbGUgPSBkM19zdmdfYXJjRW5kQW5nbGU7XG4gICAgZnVuY3Rpb24gY2hvcmQoZCwgaSkge1xuICAgICAgdmFyIHMgPSBzdWJncm91cCh0aGlzLCBzb3VyY2UsIGQsIGkpLCB0ID0gc3ViZ3JvdXAodGhpcywgdGFyZ2V0LCBkLCBpKTtcbiAgICAgIHJldHVybiBcIk1cIiArIHMucDAgKyBhcmMocy5yLCBzLnAxLCBzLmExIC0gcy5hMCkgKyAoZXF1YWxzKHMsIHQpID8gY3VydmUocy5yLCBzLnAxLCBzLnIsIHMucDApIDogY3VydmUocy5yLCBzLnAxLCB0LnIsIHQucDApICsgYXJjKHQuciwgdC5wMSwgdC5hMSAtIHQuYTApICsgY3VydmUodC5yLCB0LnAxLCBzLnIsIHMucDApKSArIFwiWlwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdWJncm91cChzZWxmLCBmLCBkLCBpKSB7XG4gICAgICB2YXIgc3ViZ3JvdXAgPSBmLmNhbGwoc2VsZiwgZCwgaSksIHIgPSByYWRpdXMuY2FsbChzZWxmLCBzdWJncm91cCwgaSksIGEwID0gc3RhcnRBbmdsZS5jYWxsKHNlbGYsIHN1Ymdyb3VwLCBpKSAtIGhhbGbPgCwgYTEgPSBlbmRBbmdsZS5jYWxsKHNlbGYsIHN1Ymdyb3VwLCBpKSAtIGhhbGbPgDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHI6IHIsXG4gICAgICAgIGEwOiBhMCxcbiAgICAgICAgYTE6IGExLFxuICAgICAgICBwMDogWyByICogTWF0aC5jb3MoYTApLCByICogTWF0aC5zaW4oYTApIF0sXG4gICAgICAgIHAxOiBbIHIgKiBNYXRoLmNvcyhhMSksIHIgKiBNYXRoLnNpbihhMSkgXVxuICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLmEwID09IGIuYTAgJiYgYS5hMSA9PSBiLmExO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhcmMociwgcCwgYSkge1xuICAgICAgcmV0dXJuIFwiQVwiICsgciArIFwiLFwiICsgciArIFwiIDAgXCIgKyArKGEgPiDPgCkgKyBcIiwxIFwiICsgcDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3VydmUocjAsIHAwLCByMSwgcDEpIHtcbiAgICAgIHJldHVybiBcIlEgMCwwIFwiICsgcDE7XG4gICAgfVxuICAgIGNob3JkLnJhZGl1cyA9IGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhZGl1cztcbiAgICAgIHJhZGl1cyA9IGQzX2Z1bmN0b3Iodik7XG4gICAgICByZXR1cm4gY2hvcmQ7XG4gICAgfTtcbiAgICBjaG9yZC5zb3VyY2UgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzb3VyY2U7XG4gICAgICBzb3VyY2UgPSBkM19mdW5jdG9yKHYpO1xuICAgICAgcmV0dXJuIGNob3JkO1xuICAgIH07XG4gICAgY2hvcmQudGFyZ2V0ID0gZnVuY3Rpb24odikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGFyZ2V0O1xuICAgICAgdGFyZ2V0ID0gZDNfZnVuY3Rvcih2KTtcbiAgICAgIHJldHVybiBjaG9yZDtcbiAgICB9O1xuICAgIGNob3JkLnN0YXJ0QW5nbGUgPSBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzdGFydEFuZ2xlO1xuICAgICAgc3RhcnRBbmdsZSA9IGQzX2Z1bmN0b3Iodik7XG4gICAgICByZXR1cm4gY2hvcmQ7XG4gICAgfTtcbiAgICBjaG9yZC5lbmRBbmdsZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGVuZEFuZ2xlO1xuICAgICAgZW5kQW5nbGUgPSBkM19mdW5jdG9yKHYpO1xuICAgICAgcmV0dXJuIGNob3JkO1xuICAgIH07XG4gICAgcmV0dXJuIGNob3JkO1xuICB9O1xuICBmdW5jdGlvbiBkM19zdmdfY2hvcmRSYWRpdXMoZCkge1xuICAgIHJldHVybiBkLnJhZGl1cztcbiAgfVxuICBkMy5zdmcuZGlhZ29uYWwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc291cmNlID0gZDNfc291cmNlLCB0YXJnZXQgPSBkM190YXJnZXQsIHByb2plY3Rpb24gPSBkM19zdmdfZGlhZ29uYWxQcm9qZWN0aW9uO1xuICAgIGZ1bmN0aW9uIGRpYWdvbmFsKGQsIGkpIHtcbiAgICAgIHZhciBwMCA9IHNvdXJjZS5jYWxsKHRoaXMsIGQsIGkpLCBwMyA9IHRhcmdldC5jYWxsKHRoaXMsIGQsIGkpLCBtID0gKHAwLnkgKyBwMy55KSAvIDIsIHAgPSBbIHAwLCB7XG4gICAgICAgIHg6IHAwLngsXG4gICAgICAgIHk6IG1cbiAgICAgIH0sIHtcbiAgICAgICAgeDogcDMueCxcbiAgICAgICAgeTogbVxuICAgICAgfSwgcDMgXTtcbiAgICAgIHAgPSBwLm1hcChwcm9qZWN0aW9uKTtcbiAgICAgIHJldHVybiBcIk1cIiArIHBbMF0gKyBcIkNcIiArIHBbMV0gKyBcIiBcIiArIHBbMl0gKyBcIiBcIiArIHBbM107XG4gICAgfVxuICAgIGRpYWdvbmFsLnNvdXJjZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNvdXJjZTtcbiAgICAgIHNvdXJjZSA9IGQzX2Z1bmN0b3IoeCk7XG4gICAgICByZXR1cm4gZGlhZ29uYWw7XG4gICAgfTtcbiAgICBkaWFnb25hbC50YXJnZXQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0YXJnZXQ7XG4gICAgICB0YXJnZXQgPSBkM19mdW5jdG9yKHgpO1xuICAgICAgcmV0dXJuIGRpYWdvbmFsO1xuICAgIH07XG4gICAgZGlhZ29uYWwucHJvamVjdGlvbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHByb2plY3Rpb247XG4gICAgICBwcm9qZWN0aW9uID0geDtcbiAgICAgIHJldHVybiBkaWFnb25hbDtcbiAgICB9O1xuICAgIHJldHVybiBkaWFnb25hbDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc3ZnX2RpYWdvbmFsUHJvamVjdGlvbihkKSB7XG4gICAgcmV0dXJuIFsgZC54LCBkLnkgXTtcbiAgfVxuICBkMy5zdmcuZGlhZ29uYWwucmFkaWFsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRpYWdvbmFsID0gZDMuc3ZnLmRpYWdvbmFsKCksIHByb2plY3Rpb24gPSBkM19zdmdfZGlhZ29uYWxQcm9qZWN0aW9uLCBwcm9qZWN0aW9uXyA9IGRpYWdvbmFsLnByb2plY3Rpb247XG4gICAgZGlhZ29uYWwucHJvamVjdGlvbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gcHJvamVjdGlvbl8oZDNfc3ZnX2RpYWdvbmFsUmFkaWFsUHJvamVjdGlvbihwcm9qZWN0aW9uID0geCkpIDogcHJvamVjdGlvbjtcbiAgICB9O1xuICAgIHJldHVybiBkaWFnb25hbDtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfc3ZnX2RpYWdvbmFsUmFkaWFsUHJvamVjdGlvbihwcm9qZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGQgPSBwcm9qZWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHIgPSBkWzBdLCBhID0gZFsxXSAtIGhhbGbPgDtcbiAgICAgIHJldHVybiBbIHIgKiBNYXRoLmNvcyhhKSwgciAqIE1hdGguc2luKGEpIF07XG4gICAgfTtcbiAgfVxuICBkMy5zdmcuc3ltYm9sID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR5cGUgPSBkM19zdmdfc3ltYm9sVHlwZSwgc2l6ZSA9IGQzX3N2Z19zeW1ib2xTaXplO1xuICAgIGZ1bmN0aW9uIHN5bWJvbChkLCBpKSB7XG4gICAgICByZXR1cm4gKGQzX3N2Z19zeW1ib2xzLmdldCh0eXBlLmNhbGwodGhpcywgZCwgaSkpIHx8IGQzX3N2Z19zeW1ib2xDaXJjbGUpKHNpemUuY2FsbCh0aGlzLCBkLCBpKSk7XG4gICAgfVxuICAgIHN5bWJvbC50eXBlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdHlwZTtcbiAgICAgIHR5cGUgPSBkM19mdW5jdG9yKHgpO1xuICAgICAgcmV0dXJuIHN5bWJvbDtcbiAgICB9O1xuICAgIHN5bWJvbC5zaXplID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2l6ZTtcbiAgICAgIHNpemUgPSBkM19mdW5jdG9yKHgpO1xuICAgICAgcmV0dXJuIHN5bWJvbDtcbiAgICB9O1xuICAgIHJldHVybiBzeW1ib2w7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3N2Z19zeW1ib2xTaXplKCkge1xuICAgIHJldHVybiA2NDtcbiAgfVxuICBmdW5jdGlvbiBkM19zdmdfc3ltYm9sVHlwZSgpIHtcbiAgICByZXR1cm4gXCJjaXJjbGVcIjtcbiAgfVxuICBmdW5jdGlvbiBkM19zdmdfc3ltYm9sQ2lyY2xlKHNpemUpIHtcbiAgICB2YXIgciA9IE1hdGguc3FydChzaXplIC8gz4ApO1xuICAgIHJldHVybiBcIk0wLFwiICsgciArIFwiQVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMSwxIDAsXCIgKyAtciArIFwiQVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMSwxIDAsXCIgKyByICsgXCJaXCI7XG4gIH1cbiAgdmFyIGQzX3N2Z19zeW1ib2xzID0gZDMubWFwKHtcbiAgICBjaXJjbGU6IGQzX3N2Z19zeW1ib2xDaXJjbGUsXG4gICAgY3Jvc3M6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciByID0gTWF0aC5zcXJ0KHNpemUgLyA1KSAvIDI7XG4gICAgICByZXR1cm4gXCJNXCIgKyAtMyAqIHIgKyBcIixcIiArIC1yICsgXCJIXCIgKyAtciArIFwiVlwiICsgLTMgKiByICsgXCJIXCIgKyByICsgXCJWXCIgKyAtciArIFwiSFwiICsgMyAqIHIgKyBcIlZcIiArIHIgKyBcIkhcIiArIHIgKyBcIlZcIiArIDMgKiByICsgXCJIXCIgKyAtciArIFwiVlwiICsgciArIFwiSFwiICsgLTMgKiByICsgXCJaXCI7XG4gICAgfSxcbiAgICBkaWFtb25kOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICB2YXIgcnkgPSBNYXRoLnNxcnQoc2l6ZSAvICgyICogZDNfc3ZnX3N5bWJvbFRhbjMwKSksIHJ4ID0gcnkgKiBkM19zdmdfc3ltYm9sVGFuMzA7XG4gICAgICByZXR1cm4gXCJNMCxcIiArIC1yeSArIFwiTFwiICsgcnggKyBcIiwwXCIgKyBcIiAwLFwiICsgcnkgKyBcIiBcIiArIC1yeCArIFwiLDBcIiArIFwiWlwiO1xuICAgIH0sXG4gICAgc3F1YXJlOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICB2YXIgciA9IE1hdGguc3FydChzaXplKSAvIDI7XG4gICAgICByZXR1cm4gXCJNXCIgKyAtciArIFwiLFwiICsgLXIgKyBcIkxcIiArIHIgKyBcIixcIiArIC1yICsgXCIgXCIgKyByICsgXCIsXCIgKyByICsgXCIgXCIgKyAtciArIFwiLFwiICsgciArIFwiWlwiO1xuICAgIH0sXG4gICAgXCJ0cmlhbmdsZS1kb3duXCI6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciByeCA9IE1hdGguc3FydChzaXplIC8gZDNfc3ZnX3N5bWJvbFNxcnQzKSwgcnkgPSByeCAqIGQzX3N2Z19zeW1ib2xTcXJ0MyAvIDI7XG4gICAgICByZXR1cm4gXCJNMCxcIiArIHJ5ICsgXCJMXCIgKyByeCArIFwiLFwiICsgLXJ5ICsgXCIgXCIgKyAtcnggKyBcIixcIiArIC1yeSArIFwiWlwiO1xuICAgIH0sXG4gICAgXCJ0cmlhbmdsZS11cFwiOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICB2YXIgcnggPSBNYXRoLnNxcnQoc2l6ZSAvIGQzX3N2Z19zeW1ib2xTcXJ0MyksIHJ5ID0gcnggKiBkM19zdmdfc3ltYm9sU3FydDMgLyAyO1xuICAgICAgcmV0dXJuIFwiTTAsXCIgKyAtcnkgKyBcIkxcIiArIHJ4ICsgXCIsXCIgKyByeSArIFwiIFwiICsgLXJ4ICsgXCIsXCIgKyByeSArIFwiWlwiO1xuICAgIH1cbiAgfSk7XG4gIGQzLnN2Zy5zeW1ib2xUeXBlcyA9IGQzX3N2Z19zeW1ib2xzLmtleXMoKTtcbiAgdmFyIGQzX3N2Z19zeW1ib2xTcXJ0MyA9IE1hdGguc3FydCgzKSwgZDNfc3ZnX3N5bWJvbFRhbjMwID0gTWF0aC50YW4oMzAgKiBkM19yYWRpYW5zKTtcbiAgZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGlkID0gZDNfdHJhbnNpdGlvbkluaGVyaXRJZCB8fCArK2QzX3RyYW5zaXRpb25JZCwgbnMgPSBkM190cmFuc2l0aW9uTmFtZXNwYWNlKG5hbWUpLCBzdWJncm91cHMgPSBbXSwgc3ViZ3JvdXAsIG5vZGUsIHRyYW5zaXRpb24gPSBkM190cmFuc2l0aW9uSW5oZXJpdCB8fCB7XG4gICAgICB0aW1lOiBEYXRlLm5vdygpLFxuICAgICAgZWFzZTogZDNfZWFzZV9jdWJpY0luT3V0LFxuICAgICAgZGVsYXk6IDAsXG4gICAgICBkdXJhdGlvbjogMjUwXG4gICAgfTtcbiAgICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTsgKSB7XG4gICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOyApIHtcbiAgICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgZDNfdHJhbnNpdGlvbk5vZGUobm9kZSwgaSwgbnMsIGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCBucywgaWQpO1xuICB9O1xuICBkM19zZWxlY3Rpb25Qcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLmVhY2gobmFtZSA9PSBudWxsID8gZDNfc2VsZWN0aW9uX2ludGVycnVwdCA6IGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHROUyhkM190cmFuc2l0aW9uTmFtZXNwYWNlKG5hbWUpKSk7XG4gIH07XG4gIHZhciBkM19zZWxlY3Rpb25faW50ZXJydXB0ID0gZDNfc2VsZWN0aW9uX2ludGVycnVwdE5TKGQzX3RyYW5zaXRpb25OYW1lc3BhY2UoKSk7XG4gIGZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHROUyhucykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsb2NrLCBhY3RpdmVJZCwgYWN0aXZlO1xuICAgICAgaWYgKChsb2NrID0gdGhpc1tuc10pICYmIChhY3RpdmUgPSBsb2NrW2FjdGl2ZUlkID0gbG9jay5hY3RpdmVdKSkge1xuICAgICAgICBhY3RpdmUudGltZXIuYyA9IG51bGw7XG4gICAgICAgIGFjdGl2ZS50aW1lci50ID0gTmFOO1xuICAgICAgICBpZiAoLS1sb2NrLmNvdW50KSBkZWxldGUgbG9ja1thY3RpdmVJZF07IGVsc2UgZGVsZXRlIHRoaXNbbnNdO1xuICAgICAgICBsb2NrLmFjdGl2ZSArPSAuNTtcbiAgICAgICAgYWN0aXZlLmV2ZW50ICYmIGFjdGl2ZS5ldmVudC5pbnRlcnJ1cHQuY2FsbCh0aGlzLCB0aGlzLl9fZGF0YV9fLCBhY3RpdmUuaW5kZXgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZDNfdHJhbnNpdGlvbihncm91cHMsIG5zLCBpZCkge1xuICAgIGQzX3N1YmNsYXNzKGdyb3VwcywgZDNfdHJhbnNpdGlvblByb3RvdHlwZSk7XG4gICAgZ3JvdXBzLm5hbWVzcGFjZSA9IG5zO1xuICAgIGdyb3Vwcy5pZCA9IGlkO1xuICAgIHJldHVybiBncm91cHM7XG4gIH1cbiAgdmFyIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUgPSBbXSwgZDNfdHJhbnNpdGlvbklkID0gMCwgZDNfdHJhbnNpdGlvbkluaGVyaXRJZCwgZDNfdHJhbnNpdGlvbkluaGVyaXQ7XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuY2FsbCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5jYWxsO1xuICBkM190cmFuc2l0aW9uUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuICBkM190cmFuc2l0aW9uUHJvdG90eXBlLm5vZGUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZTtcbiAgZDNfdHJhbnNpdGlvblByb3RvdHlwZS5zaXplID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemU7XG4gIGQzLnRyYW5zaXRpb24gPSBmdW5jdGlvbihzZWxlY3Rpb24sIG5hbWUpIHtcbiAgICByZXR1cm4gc2VsZWN0aW9uICYmIHNlbGVjdGlvbi50cmFuc2l0aW9uID8gZDNfdHJhbnNpdGlvbkluaGVyaXRJZCA/IHNlbGVjdGlvbi50cmFuc2l0aW9uKG5hbWUpIDogc2VsZWN0aW9uIDogZDMuc2VsZWN0aW9uKCkudHJhbnNpdGlvbihzZWxlY3Rpb24pO1xuICB9O1xuICBkMy50cmFuc2l0aW9uLnByb3RvdHlwZSA9IGQzX3RyYW5zaXRpb25Qcm90b3R5cGU7XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICB2YXIgaWQgPSB0aGlzLmlkLCBucyA9IHRoaXMubmFtZXNwYWNlLCBzdWJncm91cHMgPSBbXSwgc3ViZ3JvdXAsIHN1Ym5vZGUsIG5vZGU7XG4gICAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOyApIHtcbiAgICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47ICkge1xuICAgICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSkge1xuICAgICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgICAgZDNfdHJhbnNpdGlvbk5vZGUoc3Vibm9kZSwgaSwgbnMsIGlkLCBub2RlW25zXVtpZF0pO1xuICAgICAgICAgIHN1Ymdyb3VwLnB1c2goc3Vibm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZDNfdHJhbnNpdGlvbihzdWJncm91cHMsIG5zLCBpZCk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuc2VsZWN0QWxsID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICB2YXIgaWQgPSB0aGlzLmlkLCBucyA9IHRoaXMubmFtZXNwYWNlLCBzdWJncm91cHMgPSBbXSwgc3ViZ3JvdXAsIHN1Ym5vZGVzLCBub2RlLCBzdWJub2RlLCB0cmFuc2l0aW9uO1xuICAgIHNlbGVjdG9yID0gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTsgKSB7XG4gICAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjsgKSB7XG4gICAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgICB0cmFuc2l0aW9uID0gbm9kZVtuc11baWRdO1xuICAgICAgICAgIHN1Ym5vZGVzID0gc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKTtcbiAgICAgICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICAgICAgICBmb3IgKHZhciBrID0gLTEsIG8gPSBzdWJub2Rlcy5sZW5ndGg7ICsrayA8IG87ICkge1xuICAgICAgICAgICAgaWYgKHN1Ym5vZGUgPSBzdWJub2Rlc1trXSkgZDNfdHJhbnNpdGlvbk5vZGUoc3Vibm9kZSwgaywgbnMsIGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgICAgICAgIHN1Ymdyb3VwLnB1c2goc3Vibm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkM190cmFuc2l0aW9uKHN1Ymdyb3VwcywgbnMsIGlkKTtcbiAgfTtcbiAgZDNfdHJhbnNpdGlvblByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgc3ViZ3JvdXBzID0gW10sIHN1Ymdyb3VwLCBncm91cCwgbm9kZTtcbiAgICBpZiAodHlwZW9mIGZpbHRlciAhPT0gXCJmdW5jdGlvblwiKSBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fZmlsdGVyKGZpbHRlcik7XG4gICAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBmaWx0ZXIuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSkge1xuICAgICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCB0aGlzLm5hbWVzcGFjZSwgdGhpcy5pZCk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUudHdlZW4gPSBmdW5jdGlvbihuYW1lLCB0d2Vlbikge1xuICAgIHZhciBpZCA9IHRoaXMuaWQsIG5zID0gdGhpcy5uYW1lc3BhY2U7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gdGhpcy5ub2RlKClbbnNdW2lkXS50d2Vlbi5nZXQobmFtZSk7XG4gICAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIHR3ZWVuID09IG51bGwgPyBmdW5jdGlvbihub2RlKSB7XG4gICAgICBub2RlW25zXVtpZF0udHdlZW4ucmVtb3ZlKG5hbWUpO1xuICAgIH0gOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICBub2RlW25zXVtpZF0udHdlZW4uc2V0KG5hbWUsIHR3ZWVuKTtcbiAgICB9KTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfdHJhbnNpdGlvbl90d2Vlbihncm91cHMsIG5hbWUsIHZhbHVlLCB0d2Vlbikge1xuICAgIHZhciBpZCA9IGdyb3Vwcy5pZCwgbnMgPSBncm91cHMubmFtZXNwYWNlO1xuICAgIHJldHVybiBkM19zZWxlY3Rpb25fZWFjaChncm91cHMsIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gZnVuY3Rpb24obm9kZSwgaSwgaikge1xuICAgICAgbm9kZVtuc11baWRdLnR3ZWVuLnNldChuYW1lLCB0d2Vlbih2YWx1ZS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSk7XG4gICAgfSA6ICh2YWx1ZSA9IHR3ZWVuKHZhbHVlKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgbm9kZVtuc11baWRdLnR3ZWVuLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgfSkpO1xuICB9XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWVOUywgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGZvciAodmFsdWUgaW4gbmFtZU5TKSB0aGlzLmF0dHIodmFsdWUsIG5hbWVOU1t2YWx1ZV0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBpbnRlcnBvbGF0ZSA9IG5hbWVOUyA9PSBcInRyYW5zZm9ybVwiID8gZDNfaW50ZXJwb2xhdGVUcmFuc2Zvcm0gOiBkM19pbnRlcnBvbGF0ZSwgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZU5TKTtcbiAgICBmdW5jdGlvbiBhdHRyTnVsbCgpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhdHRyTnVsbE5TKCkge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXR0clR3ZWVuKGIpIHtcbiAgICAgIHJldHVybiBiID09IG51bGwgPyBhdHRyTnVsbCA6IChiICs9IFwiXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpLCBpO1xuICAgICAgICByZXR1cm4gYSAhPT0gYiAmJiAoaSA9IGludGVycG9sYXRlKGEsIGIpLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgaSh0KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dHJUd2Vlbk5TKGIpIHtcbiAgICAgIHJldHVybiBiID09IG51bGwgPyBhdHRyTnVsbE5TIDogKGIgKz0gXCJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhID0gdGhpcy5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKSwgaTtcbiAgICAgICAgcmV0dXJuIGEgIT09IGIgJiYgKGkgPSBpbnRlcnBvbGF0ZShhLCBiKSwgZnVuY3Rpb24odCkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgaSh0KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkM190cmFuc2l0aW9uX3R3ZWVuKHRoaXMsIFwiYXR0ci5cIiArIG5hbWVOUywgdmFsdWUsIG5hbWUubG9jYWwgPyBhdHRyVHdlZW5OUyA6IGF0dHJUd2Vlbik7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuYXR0clR3ZWVuID0gZnVuY3Rpb24obmFtZU5TLCB0d2Vlbikge1xuICAgIHZhciBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lTlMpO1xuICAgIGZ1bmN0aW9uIGF0dHJUd2VlbihkLCBpKSB7XG4gICAgICB2YXIgZiA9IHR3ZWVuLmNhbGwodGhpcywgZCwgaSwgdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSkpO1xuICAgICAgcmV0dXJuIGYgJiYgZnVuY3Rpb24odCkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBmKHQpKTtcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dHJUd2Vlbk5TKGQsIGkpIHtcbiAgICAgIHZhciBmID0gdHdlZW4uY2FsbCh0aGlzLCBkLCBpLCB0aGlzLmdldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpKTtcbiAgICAgIHJldHVybiBmICYmIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCBmKHQpKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnR3ZWVuKFwiYXR0ci5cIiArIG5hbWVOUywgbmFtZS5sb2NhbCA/IGF0dHJUd2Vlbk5TIDogYXR0clR3ZWVuKTtcbiAgfTtcbiAgZDNfdHJhbnNpdGlvblByb3RvdHlwZS5zdHlsZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAobiA8IDMpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBpZiAobiA8IDIpIHZhbHVlID0gXCJcIjtcbiAgICAgICAgZm9yIChwcmlvcml0eSBpbiBuYW1lKSB0aGlzLnN0eWxlKHByaW9yaXR5LCBuYW1lW3ByaW9yaXR5XSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHByaW9yaXR5ID0gXCJcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3R5bGVOdWxsKCkge1xuICAgICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3R5bGVTdHJpbmcoYikge1xuICAgICAgcmV0dXJuIGIgPT0gbnVsbCA/IHN0eWxlTnVsbCA6IChiICs9IFwiXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IGQzX3dpbmRvdyh0aGlzKS5nZXRDb21wdXRlZFN0eWxlKHRoaXMsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSksIGk7XG4gICAgICAgIHJldHVybiBhICE9PSBiICYmIChpID0gZDNfaW50ZXJwb2xhdGUoYSwgYiksIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIGkodCksIHByaW9yaXR5KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX3RyYW5zaXRpb25fdHdlZW4odGhpcywgXCJzdHlsZS5cIiArIG5hbWUsIHZhbHVlLCBzdHlsZVN0cmluZyk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuc3R5bGVUd2VlbiA9IGZ1bmN0aW9uKG5hbWUsIHR3ZWVuLCBwcmlvcml0eSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgcHJpb3JpdHkgPSBcIlwiO1xuICAgIGZ1bmN0aW9uIHN0eWxlVHdlZW4oZCwgaSkge1xuICAgICAgdmFyIGYgPSB0d2Vlbi5jYWxsKHRoaXMsIGQsIGksIGQzX3dpbmRvdyh0aGlzKS5nZXRDb21wdXRlZFN0eWxlKHRoaXMsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSkpO1xuICAgICAgcmV0dXJuIGYgJiYgZnVuY3Rpb24odCkge1xuICAgICAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIGYodCksIHByaW9yaXR5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnR3ZWVuKFwic3R5bGUuXCIgKyBuYW1lLCBzdHlsZVR3ZWVuKTtcbiAgfTtcbiAgZDNfdHJhbnNpdGlvblByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZDNfdHJhbnNpdGlvbl90d2Vlbih0aGlzLCBcInRleHRcIiwgdmFsdWUsIGQzX3RyYW5zaXRpb25fdGV4dCk7XG4gIH07XG4gIGZ1bmN0aW9uIGQzX3RyYW5zaXRpb25fdGV4dChiKSB7XG4gICAgaWYgKGIgPT0gbnVsbCkgYiA9IFwiXCI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IGI7XG4gICAgfTtcbiAgfVxuICBkM190cmFuc2l0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBucyA9IHRoaXMubmFtZXNwYWNlO1xuICAgIHJldHVybiB0aGlzLmVhY2goXCJlbmQudHJhbnNpdGlvblwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwO1xuICAgICAgaWYgKHRoaXNbbnNdLmNvdW50IDwgMiAmJiAocCA9IHRoaXMucGFyZW50Tm9kZSkpIHAucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfSk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuZWFzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGlkID0gdGhpcy5pZCwgbnMgPSB0aGlzLm5hbWVzcGFjZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHJldHVybiB0aGlzLm5vZGUoKVtuc11baWRdLmVhc2U7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGQzLmVhc2UuYXBwbHkoZDMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIG5vZGVbbnNdW2lkXS5lYXNlID0gdmFsdWU7XG4gICAgfSk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuZGVsYXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBpZCA9IHRoaXMuaWQsIG5zID0gdGhpcy5uYW1lc3BhY2U7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSByZXR1cm4gdGhpcy5ub2RlKClbbnNdW2lkXS5kZWxheTtcbiAgICByZXR1cm4gZDNfc2VsZWN0aW9uX2VhY2godGhpcywgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBmdW5jdGlvbihub2RlLCBpLCBqKSB7XG4gICAgICBub2RlW25zXVtpZF0uZGVsYXkgPSArdmFsdWUuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKTtcbiAgICB9IDogKHZhbHVlID0gK3ZhbHVlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICBub2RlW25zXVtpZF0uZGVsYXkgPSB2YWx1ZTtcbiAgICB9KSk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBpZCA9IHRoaXMuaWQsIG5zID0gdGhpcy5uYW1lc3BhY2U7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSByZXR1cm4gdGhpcy5ub2RlKClbbnNdW2lkXS5kdXJhdGlvbjtcbiAgICByZXR1cm4gZDNfc2VsZWN0aW9uX2VhY2godGhpcywgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBmdW5jdGlvbihub2RlLCBpLCBqKSB7XG4gICAgICBub2RlW25zXVtpZF0uZHVyYXRpb24gPSBNYXRoLm1heCgxLCB2YWx1ZS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICB9IDogKHZhbHVlID0gTWF0aC5tYXgoMSwgdmFsdWUpLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICBub2RlW25zXVtpZF0uZHVyYXRpb24gPSB2YWx1ZTtcbiAgICB9KSk7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGlkID0gdGhpcy5pZCwgbnMgPSB0aGlzLm5hbWVzcGFjZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHZhciBpbmhlcml0ID0gZDNfdHJhbnNpdGlvbkluaGVyaXQsIGluaGVyaXRJZCA9IGQzX3RyYW5zaXRpb25Jbmhlcml0SWQ7XG4gICAgICB0cnkge1xuICAgICAgICBkM190cmFuc2l0aW9uSW5oZXJpdElkID0gaWQ7XG4gICAgICAgIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUsIGksIGopIHtcbiAgICAgICAgICBkM190cmFuc2l0aW9uSW5oZXJpdCA9IG5vZGVbbnNdW2lkXTtcbiAgICAgICAgICB0eXBlLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaik7XG4gICAgICAgIH0pO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZDNfdHJhbnNpdGlvbkluaGVyaXQgPSBpbmhlcml0O1xuICAgICAgICBkM190cmFuc2l0aW9uSW5oZXJpdElkID0gaW5oZXJpdElkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkM19zZWxlY3Rpb25fZWFjaCh0aGlzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9uID0gbm9kZVtuc11baWRdO1xuICAgICAgICAodHJhbnNpdGlvbi5ldmVudCB8fCAodHJhbnNpdGlvbi5ldmVudCA9IGQzLmRpc3BhdGNoKFwic3RhcnRcIiwgXCJlbmRcIiwgXCJpbnRlcnJ1cHRcIikpKS5vbih0eXBlLCBsaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGQzX3RyYW5zaXRpb25Qcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpZDAgPSB0aGlzLmlkLCBpZDEgPSArK2QzX3RyYW5zaXRpb25JZCwgbnMgPSB0aGlzLm5hbWVzcGFjZSwgc3ViZ3JvdXBzID0gW10sIHN1Ymdyb3VwLCBncm91cCwgbm9kZSwgdHJhbnNpdGlvbjtcbiAgICBmb3IgKHZhciBqID0gMCwgbSA9IHRoaXMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICAgIHRyYW5zaXRpb24gPSBub2RlW25zXVtpZDBdO1xuICAgICAgICAgIGQzX3RyYW5zaXRpb25Ob2RlKG5vZGUsIGksIG5zLCBpZDEsIHtcbiAgICAgICAgICAgIHRpbWU6IHRyYW5zaXRpb24udGltZSxcbiAgICAgICAgICAgIGVhc2U6IHRyYW5zaXRpb24uZWFzZSxcbiAgICAgICAgICAgIGRlbGF5OiB0cmFuc2l0aW9uLmRlbGF5ICsgdHJhbnNpdGlvbi5kdXJhdGlvbixcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0cmFuc2l0aW9uLmR1cmF0aW9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCBucywgaWQxKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfdHJhbnNpdGlvbk5hbWVzcGFjZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgPT0gbnVsbCA/IFwiX190cmFuc2l0aW9uX19cIiA6IFwiX190cmFuc2l0aW9uX1wiICsgbmFtZSArIFwiX19cIjtcbiAgfVxuICBmdW5jdGlvbiBkM190cmFuc2l0aW9uTm9kZShub2RlLCBpLCBucywgaWQsIGluaGVyaXQpIHtcbiAgICB2YXIgbG9jayA9IG5vZGVbbnNdIHx8IChub2RlW25zXSA9IHtcbiAgICAgIGFjdGl2ZTogMCxcbiAgICAgIGNvdW50OiAwXG4gICAgfSksIHRyYW5zaXRpb24gPSBsb2NrW2lkXSwgdGltZSwgdGltZXIsIGR1cmF0aW9uLCBlYXNlLCB0d2VlbnM7XG4gICAgZnVuY3Rpb24gc2NoZWR1bGUoZWxhcHNlZCkge1xuICAgICAgdmFyIGRlbGF5ID0gdHJhbnNpdGlvbi5kZWxheTtcbiAgICAgIHRpbWVyLnQgPSBkZWxheSArIHRpbWU7XG4gICAgICBpZiAoZGVsYXkgPD0gZWxhcHNlZCkgcmV0dXJuIHN0YXJ0KGVsYXBzZWQgLSBkZWxheSk7XG4gICAgICB0aW1lci5jID0gc3RhcnQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0YXJ0KGVsYXBzZWQpIHtcbiAgICAgIHZhciBhY3RpdmVJZCA9IGxvY2suYWN0aXZlLCBhY3RpdmUgPSBsb2NrW2FjdGl2ZUlkXTtcbiAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgYWN0aXZlLnRpbWVyLmMgPSBudWxsO1xuICAgICAgICBhY3RpdmUudGltZXIudCA9IE5hTjtcbiAgICAgICAgLS1sb2NrLmNvdW50O1xuICAgICAgICBkZWxldGUgbG9ja1thY3RpdmVJZF07XG4gICAgICAgIGFjdGl2ZS5ldmVudCAmJiBhY3RpdmUuZXZlbnQuaW50ZXJydXB0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgYWN0aXZlLmluZGV4KTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGNhbmNlbElkIGluIGxvY2spIHtcbiAgICAgICAgaWYgKCtjYW5jZWxJZCA8IGlkKSB7XG4gICAgICAgICAgdmFyIGNhbmNlbCA9IGxvY2tbY2FuY2VsSWRdO1xuICAgICAgICAgIGNhbmNlbC50aW1lci5jID0gbnVsbDtcbiAgICAgICAgICBjYW5jZWwudGltZXIudCA9IE5hTjtcbiAgICAgICAgICAtLWxvY2suY291bnQ7XG4gICAgICAgICAgZGVsZXRlIGxvY2tbY2FuY2VsSWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aW1lci5jID0gdGljaztcbiAgICAgIGQzX3RpbWVyKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGltZXIuYyAmJiB0aWNrKGVsYXBzZWQgfHwgMSkpIHtcbiAgICAgICAgICB0aW1lci5jID0gbnVsbDtcbiAgICAgICAgICB0aW1lci50ID0gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSwgMCwgdGltZSk7XG4gICAgICBsb2NrLmFjdGl2ZSA9IGlkO1xuICAgICAgdHJhbnNpdGlvbi5ldmVudCAmJiB0cmFuc2l0aW9uLmV2ZW50LnN0YXJ0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSk7XG4gICAgICB0d2VlbnMgPSBbXTtcbiAgICAgIHRyYW5zaXRpb24udHdlZW4uZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9IHZhbHVlLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSkpIHtcbiAgICAgICAgICB0d2VlbnMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZWFzZSA9IHRyYW5zaXRpb24uZWFzZTtcbiAgICAgIGR1cmF0aW9uID0gdHJhbnNpdGlvbi5kdXJhdGlvbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gdGljayhlbGFwc2VkKSB7XG4gICAgICB2YXIgdCA9IGVsYXBzZWQgLyBkdXJhdGlvbiwgZSA9IGVhc2UodCksIG4gPSB0d2VlbnMubGVuZ3RoO1xuICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIHR3ZWVuc1stLW5dLmNhbGwobm9kZSwgZSk7XG4gICAgICB9XG4gICAgICBpZiAodCA+PSAxKSB7XG4gICAgICAgIHRyYW5zaXRpb24uZXZlbnQgJiYgdHJhbnNpdGlvbi5ldmVudC5lbmQuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpKTtcbiAgICAgICAgaWYgKC0tbG9jay5jb3VudCkgZGVsZXRlIGxvY2tbaWRdOyBlbHNlIGRlbGV0ZSBub2RlW25zXTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgdGltZSA9IGluaGVyaXQudGltZTtcbiAgICAgIHRpbWVyID0gZDNfdGltZXIoc2NoZWR1bGUsIDAsIHRpbWUpO1xuICAgICAgdHJhbnNpdGlvbiA9IGxvY2tbaWRdID0ge1xuICAgICAgICB0d2VlbjogbmV3IGQzX01hcCgpLFxuICAgICAgICB0aW1lOiB0aW1lLFxuICAgICAgICB0aW1lcjogdGltZXIsXG4gICAgICAgIGRlbGF5OiBpbmhlcml0LmRlbGF5LFxuICAgICAgICBkdXJhdGlvbjogaW5oZXJpdC5kdXJhdGlvbixcbiAgICAgICAgZWFzZTogaW5oZXJpdC5lYXNlLFxuICAgICAgICBpbmRleDogaVxuICAgICAgfTtcbiAgICAgIGluaGVyaXQgPSBudWxsO1xuICAgICAgKytsb2NrLmNvdW50O1xuICAgIH1cbiAgfVxuICBkMy5zdmcuYXhpcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLCBvcmllbnQgPSBkM19zdmdfYXhpc0RlZmF1bHRPcmllbnQsIGlubmVyVGlja1NpemUgPSA2LCBvdXRlclRpY2tTaXplID0gNiwgdGlja1BhZGRpbmcgPSAzLCB0aWNrQXJndW1lbnRzXyA9IFsgMTAgXSwgdGlja1ZhbHVlcyA9IG51bGwsIHRpY2tGb3JtYXRfO1xuICAgIGZ1bmN0aW9uIGF4aXMoZykge1xuICAgICAgZy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZyA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgdmFyIHNjYWxlMCA9IHRoaXMuX19jaGFydF9fIHx8IHNjYWxlLCBzY2FsZTEgPSB0aGlzLl9fY2hhcnRfXyA9IHNjYWxlLmNvcHkoKTtcbiAgICAgICAgdmFyIHRpY2tzID0gdGlja1ZhbHVlcyA9PSBudWxsID8gc2NhbGUxLnRpY2tzID8gc2NhbGUxLnRpY2tzLmFwcGx5KHNjYWxlMSwgdGlja0FyZ3VtZW50c18pIDogc2NhbGUxLmRvbWFpbigpIDogdGlja1ZhbHVlcywgdGlja0Zvcm1hdCA9IHRpY2tGb3JtYXRfID09IG51bGwgPyBzY2FsZTEudGlja0Zvcm1hdCA/IHNjYWxlMS50aWNrRm9ybWF0LmFwcGx5KHNjYWxlMSwgdGlja0FyZ3VtZW50c18pIDogZDNfaWRlbnRpdHkgOiB0aWNrRm9ybWF0XywgdGljayA9IGcuc2VsZWN0QWxsKFwiLnRpY2tcIikuZGF0YSh0aWNrcywgc2NhbGUxKSwgdGlja0VudGVyID0gdGljay5lbnRlcigpLmluc2VydChcImdcIiwgXCIuZG9tYWluXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRpY2tcIikuc3R5bGUoXCJvcGFjaXR5XCIsIM61KSwgdGlja0V4aXQgPSBkMy50cmFuc2l0aW9uKHRpY2suZXhpdCgpKS5zdHlsZShcIm9wYWNpdHlcIiwgzrUpLnJlbW92ZSgpLCB0aWNrVXBkYXRlID0gZDMudHJhbnNpdGlvbih0aWNrLm9yZGVyKCkpLnN0eWxlKFwib3BhY2l0eVwiLCAxKSwgdGlja1NwYWNpbmcgPSBNYXRoLm1heChpbm5lclRpY2tTaXplLCAwKSArIHRpY2tQYWRkaW5nLCB0aWNrVHJhbnNmb3JtO1xuICAgICAgICB2YXIgcmFuZ2UgPSBkM19zY2FsZVJhbmdlKHNjYWxlMSksIHBhdGggPSBnLnNlbGVjdEFsbChcIi5kb21haW5cIikuZGF0YShbIDAgXSksIHBhdGhVcGRhdGUgPSAocGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIikuYXR0cihcImNsYXNzXCIsIFwiZG9tYWluXCIpLCBcbiAgICAgICAgZDMudHJhbnNpdGlvbihwYXRoKSk7XG4gICAgICAgIHRpY2tFbnRlci5hcHBlbmQoXCJsaW5lXCIpO1xuICAgICAgICB0aWNrRW50ZXIuYXBwZW5kKFwidGV4dFwiKTtcbiAgICAgICAgdmFyIGxpbmVFbnRlciA9IHRpY2tFbnRlci5zZWxlY3QoXCJsaW5lXCIpLCBsaW5lVXBkYXRlID0gdGlja1VwZGF0ZS5zZWxlY3QoXCJsaW5lXCIpLCB0ZXh0ID0gdGljay5zZWxlY3QoXCJ0ZXh0XCIpLnRleHQodGlja0Zvcm1hdCksIHRleHRFbnRlciA9IHRpY2tFbnRlci5zZWxlY3QoXCJ0ZXh0XCIpLCB0ZXh0VXBkYXRlID0gdGlja1VwZGF0ZS5zZWxlY3QoXCJ0ZXh0XCIpLCBzaWduID0gb3JpZW50ID09PSBcInRvcFwiIHx8IG9yaWVudCA9PT0gXCJsZWZ0XCIgPyAtMSA6IDEsIHgxLCB4MiwgeTEsIHkyO1xuICAgICAgICBpZiAob3JpZW50ID09PSBcImJvdHRvbVwiIHx8IG9yaWVudCA9PT0gXCJ0b3BcIikge1xuICAgICAgICAgIHRpY2tUcmFuc2Zvcm0gPSBkM19zdmdfYXhpc1gsIHgxID0gXCJ4XCIsIHkxID0gXCJ5XCIsIHgyID0gXCJ4MlwiLCB5MiA9IFwieTJcIjtcbiAgICAgICAgICB0ZXh0LmF0dHIoXCJkeVwiLCBzaWduIDwgMCA/IFwiMGVtXCIgOiBcIi43MWVtXCIpLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIik7XG4gICAgICAgICAgcGF0aFVwZGF0ZS5hdHRyKFwiZFwiLCBcIk1cIiArIHJhbmdlWzBdICsgXCIsXCIgKyBzaWduICogb3V0ZXJUaWNrU2l6ZSArIFwiVjBIXCIgKyByYW5nZVsxXSArIFwiVlwiICsgc2lnbiAqIG91dGVyVGlja1NpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpY2tUcmFuc2Zvcm0gPSBkM19zdmdfYXhpc1ksIHgxID0gXCJ5XCIsIHkxID0gXCJ4XCIsIHgyID0gXCJ5MlwiLCB5MiA9IFwieDJcIjtcbiAgICAgICAgICB0ZXh0LmF0dHIoXCJkeVwiLCBcIi4zMmVtXCIpLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgc2lnbiA8IDAgPyBcImVuZFwiIDogXCJzdGFydFwiKTtcbiAgICAgICAgICBwYXRoVXBkYXRlLmF0dHIoXCJkXCIsIFwiTVwiICsgc2lnbiAqIG91dGVyVGlja1NpemUgKyBcIixcIiArIHJhbmdlWzBdICsgXCJIMFZcIiArIHJhbmdlWzFdICsgXCJIXCIgKyBzaWduICogb3V0ZXJUaWNrU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGluZUVudGVyLmF0dHIoeTIsIHNpZ24gKiBpbm5lclRpY2tTaXplKTtcbiAgICAgICAgdGV4dEVudGVyLmF0dHIoeTEsIHNpZ24gKiB0aWNrU3BhY2luZyk7XG4gICAgICAgIGxpbmVVcGRhdGUuYXR0cih4MiwgMCkuYXR0cih5Miwgc2lnbiAqIGlubmVyVGlja1NpemUpO1xuICAgICAgICB0ZXh0VXBkYXRlLmF0dHIoeDEsIDApLmF0dHIoeTEsIHNpZ24gKiB0aWNrU3BhY2luZyk7XG4gICAgICAgIGlmIChzY2FsZTEucmFuZ2VCYW5kKSB7XG4gICAgICAgICAgdmFyIHggPSBzY2FsZTEsIGR4ID0geC5yYW5nZUJhbmQoKSAvIDI7XG4gICAgICAgICAgc2NhbGUwID0gc2NhbGUxID0gZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHgoZCkgKyBkeDtcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHNjYWxlMC5yYW5nZUJhbmQpIHtcbiAgICAgICAgICBzY2FsZTAgPSBzY2FsZTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGlja0V4aXQuY2FsbCh0aWNrVHJhbnNmb3JtLCBzY2FsZTEsIHNjYWxlMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGlja0VudGVyLmNhbGwodGlja1RyYW5zZm9ybSwgc2NhbGUwLCBzY2FsZTEpO1xuICAgICAgICB0aWNrVXBkYXRlLmNhbGwodGlja1RyYW5zZm9ybSwgc2NhbGUxLCBzY2FsZTEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGF4aXMuc2NhbGUgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcbiAgICAgIHNjYWxlID0geDtcbiAgICAgIHJldHVybiBheGlzO1xuICAgIH07XG4gICAgYXhpcy5vcmllbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XG4gICAgICBvcmllbnQgPSB4IGluIGQzX3N2Z19heGlzT3JpZW50cyA/IHggKyBcIlwiIDogZDNfc3ZnX2F4aXNEZWZhdWx0T3JpZW50O1xuICAgICAgcmV0dXJuIGF4aXM7XG4gICAgfTtcbiAgICBheGlzLnRpY2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aWNrQXJndW1lbnRzXztcbiAgICAgIHRpY2tBcmd1bWVudHNfID0gZDNfYXJyYXkoYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBheGlzO1xuICAgIH07XG4gICAgYXhpcy50aWNrVmFsdWVzID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGlja1ZhbHVlcztcbiAgICAgIHRpY2tWYWx1ZXMgPSB4O1xuICAgICAgcmV0dXJuIGF4aXM7XG4gICAgfTtcbiAgICBheGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aWNrRm9ybWF0XztcbiAgICAgIHRpY2tGb3JtYXRfID0geDtcbiAgICAgIHJldHVybiBheGlzO1xuICAgIH07XG4gICAgYXhpcy50aWNrU2l6ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmICghbikgcmV0dXJuIGlubmVyVGlja1NpemU7XG4gICAgICBpbm5lclRpY2tTaXplID0gK3g7XG4gICAgICBvdXRlclRpY2tTaXplID0gK2FyZ3VtZW50c1tuIC0gMV07XG4gICAgICByZXR1cm4gYXhpcztcbiAgICB9O1xuICAgIGF4aXMuaW5uZXJUaWNrU2l6ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGlubmVyVGlja1NpemU7XG4gICAgICBpbm5lclRpY2tTaXplID0gK3g7XG4gICAgICByZXR1cm4gYXhpcztcbiAgICB9O1xuICAgIGF4aXMub3V0ZXJUaWNrU2l6ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG91dGVyVGlja1NpemU7XG4gICAgICBvdXRlclRpY2tTaXplID0gK3g7XG4gICAgICByZXR1cm4gYXhpcztcbiAgICB9O1xuICAgIGF4aXMudGlja1BhZGRpbmcgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aWNrUGFkZGluZztcbiAgICAgIHRpY2tQYWRkaW5nID0gK3g7XG4gICAgICByZXR1cm4gYXhpcztcbiAgICB9O1xuICAgIGF4aXMudGlja1N1YmRpdmlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggJiYgYXhpcztcbiAgICB9O1xuICAgIHJldHVybiBheGlzO1xuICB9O1xuICB2YXIgZDNfc3ZnX2F4aXNEZWZhdWx0T3JpZW50ID0gXCJib3R0b21cIiwgZDNfc3ZnX2F4aXNPcmllbnRzID0ge1xuICAgIHRvcDogMSxcbiAgICByaWdodDogMSxcbiAgICBib3R0b206IDEsXG4gICAgbGVmdDogMVxuICB9O1xuICBmdW5jdGlvbiBkM19zdmdfYXhpc1goc2VsZWN0aW9uLCB4MCwgeDEpIHtcbiAgICBzZWxlY3Rpb24uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgdjAgPSB4MChkKTtcbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIChpc0Zpbml0ZSh2MCkgPyB2MCA6IHgxKGQpKSArIFwiLDApXCI7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZDNfc3ZnX2F4aXNZKHNlbGVjdGlvbiwgeTAsIHkxKSB7XG4gICAgc2VsZWN0aW9uLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIHYwID0geTAoZCk7XG4gICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArIChpc0Zpbml0ZSh2MCkgPyB2MCA6IHkxKGQpKSArIFwiKVwiO1xuICAgIH0pO1xuICB9XG4gIGQzLnN2Zy5icnVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBldmVudCA9IGQzX2V2ZW50RGlzcGF0Y2goYnJ1c2gsIFwiYnJ1c2hzdGFydFwiLCBcImJydXNoXCIsIFwiYnJ1c2hlbmRcIiksIHggPSBudWxsLCB5ID0gbnVsbCwgeEV4dGVudCA9IFsgMCwgMCBdLCB5RXh0ZW50ID0gWyAwLCAwIF0sIHhFeHRlbnREb21haW4sIHlFeHRlbnREb21haW4sIHhDbGFtcCA9IHRydWUsIHlDbGFtcCA9IHRydWUsIHJlc2l6ZXMgPSBkM19zdmdfYnJ1c2hSZXNpemVzWzBdO1xuICAgIGZ1bmN0aW9uIGJydXNoKGcpIHtcbiAgICAgIGcuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcImFsbFwiKS5zdHlsZShcIi13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvclwiLCBcInJnYmEoMCwwLDAsMClcIikub24oXCJtb3VzZWRvd24uYnJ1c2hcIiwgYnJ1c2hzdGFydCkub24oXCJ0b3VjaHN0YXJ0LmJydXNoXCIsIGJydXNoc3RhcnQpO1xuICAgICAgICB2YXIgYmFja2dyb3VuZCA9IGcuc2VsZWN0QWxsKFwiLmJhY2tncm91bmRcIikuZGF0YShbIDAgXSk7XG4gICAgICAgIGJhY2tncm91bmQuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJjbGFzc1wiLCBcImJhY2tncm91bmRcIikuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpLnN0eWxlKFwiY3Vyc29yXCIsIFwiY3Jvc3NoYWlyXCIpO1xuICAgICAgICBnLnNlbGVjdEFsbChcIi5leHRlbnRcIikuZGF0YShbIDAgXSkuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJjbGFzc1wiLCBcImV4dGVudFwiKS5zdHlsZShcImN1cnNvclwiLCBcIm1vdmVcIik7XG4gICAgICAgIHZhciByZXNpemUgPSBnLnNlbGVjdEFsbChcIi5yZXNpemVcIikuZGF0YShyZXNpemVzLCBkM19pZGVudGl0eSk7XG4gICAgICAgIHJlc2l6ZS5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIHJlc2l6ZS5lbnRlcigpLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gXCJyZXNpemUgXCIgKyBkO1xuICAgICAgICB9KS5zdHlsZShcImN1cnNvclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQzX3N2Z19icnVzaEN1cnNvcltkXTtcbiAgICAgICAgfSkuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwieFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIC9bZXddJC8udGVzdChkKSA/IC0zIDogbnVsbDtcbiAgICAgICAgfSkuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiAvXltuc10vLnRlc3QoZCkgPyAtMyA6IG51bGw7XG4gICAgICAgIH0pLmF0dHIoXCJ3aWR0aFwiLCA2KS5hdHRyKFwiaGVpZ2h0XCIsIDYpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcbiAgICAgICAgcmVzaXplLnN0eWxlKFwiZGlzcGxheVwiLCBicnVzaC5lbXB0eSgpID8gXCJub25lXCIgOiBudWxsKTtcbiAgICAgICAgdmFyIGdVcGRhdGUgPSBkMy50cmFuc2l0aW9uKGcpLCBiYWNrZ3JvdW5kVXBkYXRlID0gZDMudHJhbnNpdGlvbihiYWNrZ3JvdW5kKSwgcmFuZ2U7XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgcmFuZ2UgPSBkM19zY2FsZVJhbmdlKHgpO1xuICAgICAgICAgIGJhY2tncm91bmRVcGRhdGUuYXR0cihcInhcIiwgcmFuZ2VbMF0pLmF0dHIoXCJ3aWR0aFwiLCByYW5nZVsxXSAtIHJhbmdlWzBdKTtcbiAgICAgICAgICByZWRyYXdYKGdVcGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgcmFuZ2UgPSBkM19zY2FsZVJhbmdlKHkpO1xuICAgICAgICAgIGJhY2tncm91bmRVcGRhdGUuYXR0cihcInlcIiwgcmFuZ2VbMF0pLmF0dHIoXCJoZWlnaHRcIiwgcmFuZ2VbMV0gLSByYW5nZVswXSk7XG4gICAgICAgICAgcmVkcmF3WShnVXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZWRyYXcoZ1VwZGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgYnJ1c2guZXZlbnQgPSBmdW5jdGlvbihnKSB7XG4gICAgICBnLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudF8gPSBldmVudC5vZih0aGlzLCBhcmd1bWVudHMpLCBleHRlbnQxID0ge1xuICAgICAgICAgIHg6IHhFeHRlbnQsXG4gICAgICAgICAgeTogeUV4dGVudCxcbiAgICAgICAgICBpOiB4RXh0ZW50RG9tYWluLFxuICAgICAgICAgIGo6IHlFeHRlbnREb21haW5cbiAgICAgICAgfSwgZXh0ZW50MCA9IHRoaXMuX19jaGFydF9fIHx8IGV4dGVudDE7XG4gICAgICAgIHRoaXMuX19jaGFydF9fID0gZXh0ZW50MTtcbiAgICAgICAgaWYgKGQzX3RyYW5zaXRpb25Jbmhlcml0SWQpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykudHJhbnNpdGlvbigpLmVhY2goXCJzdGFydC5icnVzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHhFeHRlbnREb21haW4gPSBleHRlbnQwLmk7XG4gICAgICAgICAgICB5RXh0ZW50RG9tYWluID0gZXh0ZW50MC5qO1xuICAgICAgICAgICAgeEV4dGVudCA9IGV4dGVudDAueDtcbiAgICAgICAgICAgIHlFeHRlbnQgPSBleHRlbnQwLnk7XG4gICAgICAgICAgICBldmVudF8oe1xuICAgICAgICAgICAgICB0eXBlOiBcImJydXNoc3RhcnRcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkudHdlZW4oXCJicnVzaDpicnVzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB4aSA9IGQzX2ludGVycG9sYXRlQXJyYXkoeEV4dGVudCwgZXh0ZW50MS54KSwgeWkgPSBkM19pbnRlcnBvbGF0ZUFycmF5KHlFeHRlbnQsIGV4dGVudDEueSk7XG4gICAgICAgICAgICB4RXh0ZW50RG9tYWluID0geUV4dGVudERvbWFpbiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICB4RXh0ZW50ID0gZXh0ZW50MS54ID0geGkodCk7XG4gICAgICAgICAgICAgIHlFeHRlbnQgPSBleHRlbnQxLnkgPSB5aSh0KTtcbiAgICAgICAgICAgICAgZXZlbnRfKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImJydXNoXCIsXG4gICAgICAgICAgICAgICAgbW9kZTogXCJyZXNpemVcIlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkuZWFjaChcImVuZC5icnVzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHhFeHRlbnREb21haW4gPSBleHRlbnQxLmk7XG4gICAgICAgICAgICB5RXh0ZW50RG9tYWluID0gZXh0ZW50MS5qO1xuICAgICAgICAgICAgZXZlbnRfKHtcbiAgICAgICAgICAgICAgdHlwZTogXCJicnVzaFwiLFxuICAgICAgICAgICAgICBtb2RlOiBcInJlc2l6ZVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV2ZW50Xyh7XG4gICAgICAgICAgICAgIHR5cGU6IFwiYnJ1c2hlbmRcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXZlbnRfKHtcbiAgICAgICAgICAgIHR5cGU6IFwiYnJ1c2hzdGFydFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXZlbnRfKHtcbiAgICAgICAgICAgIHR5cGU6IFwiYnJ1c2hcIixcbiAgICAgICAgICAgIG1vZGU6IFwicmVzaXplXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBldmVudF8oe1xuICAgICAgICAgICAgdHlwZTogXCJicnVzaGVuZFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgZnVuY3Rpb24gcmVkcmF3KGcpIHtcbiAgICAgIGcuc2VsZWN0QWxsKFwiLnJlc2l6ZVwiKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeEV4dGVudFsrL2UkLy50ZXN0KGQpXSArIFwiLFwiICsgeUV4dGVudFsrL15zLy50ZXN0KGQpXSArIFwiKVwiO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlZHJhd1goZykge1xuICAgICAgZy5zZWxlY3QoXCIuZXh0ZW50XCIpLmF0dHIoXCJ4XCIsIHhFeHRlbnRbMF0pO1xuICAgICAgZy5zZWxlY3RBbGwoXCIuZXh0ZW50LC5uPnJlY3QsLnM+cmVjdFwiKS5hdHRyKFwid2lkdGhcIiwgeEV4dGVudFsxXSAtIHhFeHRlbnRbMF0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWRyYXdZKGcpIHtcbiAgICAgIGcuc2VsZWN0KFwiLmV4dGVudFwiKS5hdHRyKFwieVwiLCB5RXh0ZW50WzBdKTtcbiAgICAgIGcuc2VsZWN0QWxsKFwiLmV4dGVudCwuZT5yZWN0LC53PnJlY3RcIikuYXR0cihcImhlaWdodFwiLCB5RXh0ZW50WzFdIC0geUV4dGVudFswXSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJydXNoc3RhcnQoKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcywgZXZlbnRUYXJnZXQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KSwgZXZlbnRfID0gZXZlbnQub2YodGFyZ2V0LCBhcmd1bWVudHMpLCBnID0gZDMuc2VsZWN0KHRhcmdldCksIHJlc2l6aW5nID0gZXZlbnRUYXJnZXQuZGF0dW0oKSwgcmVzaXppbmdYID0gIS9eKG58cykkLy50ZXN0KHJlc2l6aW5nKSAmJiB4LCByZXNpemluZ1kgPSAhL14oZXx3KSQvLnRlc3QocmVzaXppbmcpICYmIHksIGRyYWdnaW5nID0gZXZlbnRUYXJnZXQuY2xhc3NlZChcImV4dGVudFwiKSwgZHJhZ1Jlc3RvcmUgPSBkM19ldmVudF9kcmFnU3VwcHJlc3ModGFyZ2V0KSwgY2VudGVyLCBvcmlnaW4gPSBkMy5tb3VzZSh0YXJnZXQpLCBvZmZzZXQ7XG4gICAgICB2YXIgdyA9IGQzLnNlbGVjdChkM193aW5kb3codGFyZ2V0KSkub24oXCJrZXlkb3duLmJydXNoXCIsIGtleWRvd24pLm9uKFwia2V5dXAuYnJ1c2hcIiwga2V5dXApO1xuICAgICAgaWYgKGQzLmV2ZW50LmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgIHcub24oXCJ0b3VjaG1vdmUuYnJ1c2hcIiwgYnJ1c2htb3ZlKS5vbihcInRvdWNoZW5kLmJydXNoXCIsIGJydXNoZW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHcub24oXCJtb3VzZW1vdmUuYnJ1c2hcIiwgYnJ1c2htb3ZlKS5vbihcIm1vdXNldXAuYnJ1c2hcIiwgYnJ1c2hlbmQpO1xuICAgICAgfVxuICAgICAgZy5pbnRlcnJ1cHQoKS5zZWxlY3RBbGwoXCIqXCIpLmludGVycnVwdCgpO1xuICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgIG9yaWdpblswXSA9IHhFeHRlbnRbMF0gLSBvcmlnaW5bMF07XG4gICAgICAgIG9yaWdpblsxXSA9IHlFeHRlbnRbMF0gLSBvcmlnaW5bMV07XG4gICAgICB9IGVsc2UgaWYgKHJlc2l6aW5nKSB7XG4gICAgICAgIHZhciBleCA9ICsvdyQvLnRlc3QocmVzaXppbmcpLCBleSA9ICsvXm4vLnRlc3QocmVzaXppbmcpO1xuICAgICAgICBvZmZzZXQgPSBbIHhFeHRlbnRbMSAtIGV4XSAtIG9yaWdpblswXSwgeUV4dGVudFsxIC0gZXldIC0gb3JpZ2luWzFdIF07XG4gICAgICAgIG9yaWdpblswXSA9IHhFeHRlbnRbZXhdO1xuICAgICAgICBvcmlnaW5bMV0gPSB5RXh0ZW50W2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoZDMuZXZlbnQuYWx0S2V5KSBjZW50ZXIgPSBvcmlnaW4uc2xpY2UoKTtcbiAgICAgIGcuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIikuc2VsZWN0QWxsKFwiLnJlc2l6ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XG4gICAgICBkMy5zZWxlY3QoXCJib2R5XCIpLnN0eWxlKFwiY3Vyc29yXCIsIGV2ZW50VGFyZ2V0LnN0eWxlKFwiY3Vyc29yXCIpKTtcbiAgICAgIGV2ZW50Xyh7XG4gICAgICAgIHR5cGU6IFwiYnJ1c2hzdGFydFwiXG4gICAgICB9KTtcbiAgICAgIGJydXNobW92ZSgpO1xuICAgICAgZnVuY3Rpb24ga2V5ZG93bigpIHtcbiAgICAgICAgaWYgKGQzLmV2ZW50LmtleUNvZGUgPT0gMzIpIHtcbiAgICAgICAgICBpZiAoIWRyYWdnaW5nKSB7XG4gICAgICAgICAgICBjZW50ZXIgPSBudWxsO1xuICAgICAgICAgICAgb3JpZ2luWzBdIC09IHhFeHRlbnRbMV07XG4gICAgICAgICAgICBvcmlnaW5bMV0gLT0geUV4dGVudFsxXTtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBrZXl1cCgpIHtcbiAgICAgICAgaWYgKGQzLmV2ZW50LmtleUNvZGUgPT0gMzIgJiYgZHJhZ2dpbmcgPT0gMikge1xuICAgICAgICAgIG9yaWdpblswXSArPSB4RXh0ZW50WzFdO1xuICAgICAgICAgIG9yaWdpblsxXSArPSB5RXh0ZW50WzFdO1xuICAgICAgICAgIGRyYWdnaW5nID0gMDtcbiAgICAgICAgICBkM19ldmVudFByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGJydXNobW92ZSgpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gZDMubW91c2UodGFyZ2V0KSwgbW92ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG9mZnNldCkge1xuICAgICAgICAgIHBvaW50WzBdICs9IG9mZnNldFswXTtcbiAgICAgICAgICBwb2ludFsxXSArPSBvZmZzZXRbMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkcmFnZ2luZykge1xuICAgICAgICAgIGlmIChkMy5ldmVudC5hbHRLZXkpIHtcbiAgICAgICAgICAgIGlmICghY2VudGVyKSBjZW50ZXIgPSBbICh4RXh0ZW50WzBdICsgeEV4dGVudFsxXSkgLyAyLCAoeUV4dGVudFswXSArIHlFeHRlbnRbMV0pIC8gMiBdO1xuICAgICAgICAgICAgb3JpZ2luWzBdID0geEV4dGVudFsrKHBvaW50WzBdIDwgY2VudGVyWzBdKV07XG4gICAgICAgICAgICBvcmlnaW5bMV0gPSB5RXh0ZW50WysocG9pbnRbMV0gPCBjZW50ZXJbMV0pXTtcbiAgICAgICAgICB9IGVsc2UgY2VudGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzaXppbmdYICYmIG1vdmUxKHBvaW50LCB4LCAwKSkge1xuICAgICAgICAgIHJlZHJhd1goZyk7XG4gICAgICAgICAgbW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNpemluZ1kgJiYgbW92ZTEocG9pbnQsIHksIDEpKSB7XG4gICAgICAgICAgcmVkcmF3WShnKTtcbiAgICAgICAgICBtb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgICAgcmVkcmF3KGcpO1xuICAgICAgICAgIGV2ZW50Xyh7XG4gICAgICAgICAgICB0eXBlOiBcImJydXNoXCIsXG4gICAgICAgICAgICBtb2RlOiBkcmFnZ2luZyA/IFwibW92ZVwiIDogXCJyZXNpemVcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBtb3ZlMShwb2ludCwgc2NhbGUsIGkpIHtcbiAgICAgICAgdmFyIHJhbmdlID0gZDNfc2NhbGVSYW5nZShzY2FsZSksIHIwID0gcmFuZ2VbMF0sIHIxID0gcmFuZ2VbMV0sIHBvc2l0aW9uID0gb3JpZ2luW2ldLCBleHRlbnQgPSBpID8geUV4dGVudCA6IHhFeHRlbnQsIHNpemUgPSBleHRlbnRbMV0gLSBleHRlbnRbMF0sIG1pbiwgbWF4O1xuICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgICByMCAtPSBwb3NpdGlvbjtcbiAgICAgICAgICByMSAtPSBzaXplICsgcG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgbWluID0gKGkgPyB5Q2xhbXAgOiB4Q2xhbXApID8gTWF0aC5tYXgocjAsIE1hdGgubWluKHIxLCBwb2ludFtpXSkpIDogcG9pbnRbaV07XG4gICAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICAgIG1heCA9IChtaW4gKz0gcG9zaXRpb24pICsgc2l6ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY2VudGVyKSBwb3NpdGlvbiA9IE1hdGgubWF4KHIwLCBNYXRoLm1pbihyMSwgMiAqIGNlbnRlcltpXSAtIG1pbikpO1xuICAgICAgICAgIGlmIChwb3NpdGlvbiA8IG1pbikge1xuICAgICAgICAgICAgbWF4ID0gbWluO1xuICAgICAgICAgICAgbWluID0gcG9zaXRpb247XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1heCA9IHBvc2l0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXh0ZW50WzBdICE9IG1pbiB8fCBleHRlbnRbMV0gIT0gbWF4KSB7XG4gICAgICAgICAgaWYgKGkpIHlFeHRlbnREb21haW4gPSBudWxsOyBlbHNlIHhFeHRlbnREb21haW4gPSBudWxsO1xuICAgICAgICAgIGV4dGVudFswXSA9IG1pbjtcbiAgICAgICAgICBleHRlbnRbMV0gPSBtYXg7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGJydXNoZW5kKCkge1xuICAgICAgICBicnVzaG1vdmUoKTtcbiAgICAgICAgZy5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpLnNlbGVjdEFsbChcIi5yZXNpemVcIikuc3R5bGUoXCJkaXNwbGF5XCIsIGJydXNoLmVtcHR5KCkgPyBcIm5vbmVcIiA6IG51bGwpO1xuICAgICAgICBkMy5zZWxlY3QoXCJib2R5XCIpLnN0eWxlKFwiY3Vyc29yXCIsIG51bGwpO1xuICAgICAgICB3Lm9uKFwibW91c2Vtb3ZlLmJydXNoXCIsIG51bGwpLm9uKFwibW91c2V1cC5icnVzaFwiLCBudWxsKS5vbihcInRvdWNobW92ZS5icnVzaFwiLCBudWxsKS5vbihcInRvdWNoZW5kLmJydXNoXCIsIG51bGwpLm9uKFwia2V5ZG93bi5icnVzaFwiLCBudWxsKS5vbihcImtleXVwLmJydXNoXCIsIG51bGwpO1xuICAgICAgICBkcmFnUmVzdG9yZSgpO1xuICAgICAgICBldmVudF8oe1xuICAgICAgICAgIHR5cGU6IFwiYnJ1c2hlbmRcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYnJ1c2gueCA9IGZ1bmN0aW9uKHopIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHg7XG4gICAgICB4ID0gejtcbiAgICAgIHJlc2l6ZXMgPSBkM19zdmdfYnJ1c2hSZXNpemVzWyF4IDw8IDEgfCAheV07XG4gICAgICByZXR1cm4gYnJ1c2g7XG4gICAgfTtcbiAgICBicnVzaC55ID0gZnVuY3Rpb24oeikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geTtcbiAgICAgIHkgPSB6O1xuICAgICAgcmVzaXplcyA9IGQzX3N2Z19icnVzaFJlc2l6ZXNbIXggPDwgMSB8ICF5XTtcbiAgICAgIHJldHVybiBicnVzaDtcbiAgICB9O1xuICAgIGJydXNoLmNsYW1wID0gZnVuY3Rpb24oeikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4geCAmJiB5ID8gWyB4Q2xhbXAsIHlDbGFtcCBdIDogeCA/IHhDbGFtcCA6IHkgPyB5Q2xhbXAgOiBudWxsO1xuICAgICAgaWYgKHggJiYgeSkgeENsYW1wID0gISF6WzBdLCB5Q2xhbXAgPSAhIXpbMV07IGVsc2UgaWYgKHgpIHhDbGFtcCA9ICEhejsgZWxzZSBpZiAoeSkgeUNsYW1wID0gISF6O1xuICAgICAgcmV0dXJuIGJydXNoO1xuICAgIH07XG4gICAgYnJ1c2guZXh0ZW50ID0gZnVuY3Rpb24oeikge1xuICAgICAgdmFyIHgwLCB4MSwgeTAsIHkxLCB0O1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgaWYgKHhFeHRlbnREb21haW4pIHtcbiAgICAgICAgICAgIHgwID0geEV4dGVudERvbWFpblswXSwgeDEgPSB4RXh0ZW50RG9tYWluWzFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4MCA9IHhFeHRlbnRbMF0sIHgxID0geEV4dGVudFsxXTtcbiAgICAgICAgICAgIGlmICh4LmludmVydCkgeDAgPSB4LmludmVydCh4MCksIHgxID0geC5pbnZlcnQoeDEpO1xuICAgICAgICAgICAgaWYgKHgxIDwgeDApIHQgPSB4MCwgeDAgPSB4MSwgeDEgPSB0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeSkge1xuICAgICAgICAgIGlmICh5RXh0ZW50RG9tYWluKSB7XG4gICAgICAgICAgICB5MCA9IHlFeHRlbnREb21haW5bMF0sIHkxID0geUV4dGVudERvbWFpblsxXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeTAgPSB5RXh0ZW50WzBdLCB5MSA9IHlFeHRlbnRbMV07XG4gICAgICAgICAgICBpZiAoeS5pbnZlcnQpIHkwID0geS5pbnZlcnQoeTApLCB5MSA9IHkuaW52ZXJ0KHkxKTtcbiAgICAgICAgICAgIGlmICh5MSA8IHkwKSB0ID0geTAsIHkwID0geTEsIHkxID0gdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggJiYgeSA/IFsgWyB4MCwgeTAgXSwgWyB4MSwgeTEgXSBdIDogeCA/IFsgeDAsIHgxIF0gOiB5ICYmIFsgeTAsIHkxIF07XG4gICAgICB9XG4gICAgICBpZiAoeCkge1xuICAgICAgICB4MCA9IHpbMF0sIHgxID0gelsxXTtcbiAgICAgICAgaWYgKHkpIHgwID0geDBbMF0sIHgxID0geDFbMF07XG4gICAgICAgIHhFeHRlbnREb21haW4gPSBbIHgwLCB4MSBdO1xuICAgICAgICBpZiAoeC5pbnZlcnQpIHgwID0geCh4MCksIHgxID0geCh4MSk7XG4gICAgICAgIGlmICh4MSA8IHgwKSB0ID0geDAsIHgwID0geDEsIHgxID0gdDtcbiAgICAgICAgaWYgKHgwICE9IHhFeHRlbnRbMF0gfHwgeDEgIT0geEV4dGVudFsxXSkgeEV4dGVudCA9IFsgeDAsIHgxIF07XG4gICAgICB9XG4gICAgICBpZiAoeSkge1xuICAgICAgICB5MCA9IHpbMF0sIHkxID0gelsxXTtcbiAgICAgICAgaWYgKHgpIHkwID0geTBbMV0sIHkxID0geTFbMV07XG4gICAgICAgIHlFeHRlbnREb21haW4gPSBbIHkwLCB5MSBdO1xuICAgICAgICBpZiAoeS5pbnZlcnQpIHkwID0geSh5MCksIHkxID0geSh5MSk7XG4gICAgICAgIGlmICh5MSA8IHkwKSB0ID0geTAsIHkwID0geTEsIHkxID0gdDtcbiAgICAgICAgaWYgKHkwICE9IHlFeHRlbnRbMF0gfHwgeTEgIT0geUV4dGVudFsxXSkgeUV4dGVudCA9IFsgeTAsIHkxIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gYnJ1c2g7XG4gICAgfTtcbiAgICBicnVzaC5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFicnVzaC5lbXB0eSgpKSB7XG4gICAgICAgIHhFeHRlbnQgPSBbIDAsIDAgXSwgeUV4dGVudCA9IFsgMCwgMCBdO1xuICAgICAgICB4RXh0ZW50RG9tYWluID0geUV4dGVudERvbWFpbiA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnJ1c2g7XG4gICAgfTtcbiAgICBicnVzaC5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEheCAmJiB4RXh0ZW50WzBdID09IHhFeHRlbnRbMV0gfHwgISF5ICYmIHlFeHRlbnRbMF0gPT0geUV4dGVudFsxXTtcbiAgICB9O1xuICAgIHJldHVybiBkMy5yZWJpbmQoYnJ1c2gsIGV2ZW50LCBcIm9uXCIpO1xuICB9O1xuICB2YXIgZDNfc3ZnX2JydXNoQ3Vyc29yID0ge1xuICAgIG46IFwibnMtcmVzaXplXCIsXG4gICAgZTogXCJldy1yZXNpemVcIixcbiAgICBzOiBcIm5zLXJlc2l6ZVwiLFxuICAgIHc6IFwiZXctcmVzaXplXCIsXG4gICAgbnc6IFwibndzZS1yZXNpemVcIixcbiAgICBuZTogXCJuZXN3LXJlc2l6ZVwiLFxuICAgIHNlOiBcIm53c2UtcmVzaXplXCIsXG4gICAgc3c6IFwibmVzdy1yZXNpemVcIlxuICB9O1xuICB2YXIgZDNfc3ZnX2JydXNoUmVzaXplcyA9IFsgWyBcIm5cIiwgXCJlXCIsIFwic1wiLCBcIndcIiwgXCJud1wiLCBcIm5lXCIsIFwic2VcIiwgXCJzd1wiIF0sIFsgXCJlXCIsIFwid1wiIF0sIFsgXCJuXCIsIFwic1wiIF0sIFtdIF07XG4gIHZhciBkM190aW1lX2Zvcm1hdCA9IGQzX3RpbWUuZm9ybWF0ID0gZDNfbG9jYWxlX2VuVVMudGltZUZvcm1hdDtcbiAgdmFyIGQzX3RpbWVfZm9ybWF0VXRjID0gZDNfdGltZV9mb3JtYXQudXRjO1xuICB2YXIgZDNfdGltZV9mb3JtYXRJc28gPSBkM190aW1lX2Zvcm1hdFV0YyhcIiVZLSVtLSVkVCVIOiVNOiVTLiVMWlwiKTtcbiAgZDNfdGltZV9mb3JtYXQuaXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgJiYgK25ldyBEYXRlKFwiMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaXCIpID8gZDNfdGltZV9mb3JtYXRJc29OYXRpdmUgOiBkM190aW1lX2Zvcm1hdElzbztcbiAgZnVuY3Rpb24gZDNfdGltZV9mb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgZDNfdGltZV9mb3JtYXRJc29OYXRpdmUucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHN0cmluZyk7XG4gICAgcmV0dXJuIGlzTmFOKGRhdGUpID8gbnVsbCA6IGRhdGU7XG4gIH07XG4gIGQzX3RpbWVfZm9ybWF0SXNvTmF0aXZlLnRvU3RyaW5nID0gZDNfdGltZV9mb3JtYXRJc28udG9TdHJpbmc7XG4gIGQzX3RpbWUuc2Vjb25kID0gZDNfdGltZV9pbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIG5ldyBkM19kYXRlKE1hdGguZmxvb3IoZGF0ZSAvIDFlMykgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyBNYXRoLmZsb29yKG9mZnNldCkgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0U2Vjb25kcygpO1xuICB9KTtcbiAgZDNfdGltZS5zZWNvbmRzID0gZDNfdGltZS5zZWNvbmQucmFuZ2U7XG4gIGQzX3RpbWUuc2Vjb25kcy51dGMgPSBkM190aW1lLnNlY29uZC51dGMucmFuZ2U7XG4gIGQzX3RpbWUubWludXRlID0gZDNfdGltZV9pbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIG5ldyBkM19kYXRlKE1hdGguZmxvb3IoZGF0ZSAvIDZlNCkgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyBNYXRoLmZsb29yKG9mZnNldCkgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TWludXRlcygpO1xuICB9KTtcbiAgZDNfdGltZS5taW51dGVzID0gZDNfdGltZS5taW51dGUucmFuZ2U7XG4gIGQzX3RpbWUubWludXRlcy51dGMgPSBkM190aW1lLm1pbnV0ZS51dGMucmFuZ2U7XG4gIGQzX3RpbWUuaG91ciA9IGQzX3RpbWVfaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciB0aW1lem9uZSA9IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgIHJldHVybiBuZXcgZDNfZGF0ZSgoTWF0aC5mbG9vcihkYXRlIC8gMzZlNSAtIHRpbWV6b25lKSArIHRpbWV6b25lKSAqIDM2ZTUpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyBNYXRoLmZsb29yKG9mZnNldCkgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldEhvdXJzKCk7XG4gIH0pO1xuICBkM190aW1lLmhvdXJzID0gZDNfdGltZS5ob3VyLnJhbmdlO1xuICBkM190aW1lLmhvdXJzLnV0YyA9IGQzX3RpbWUuaG91ci51dGMucmFuZ2U7XG4gIGQzX3RpbWUubW9udGggPSBkM190aW1lX2ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlID0gZDNfdGltZS5kYXkoZGF0ZSk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICAgIHJldHVybiBkYXRlO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRNb250aCgpO1xuICB9KTtcbiAgZDNfdGltZS5tb250aHMgPSBkM190aW1lLm1vbnRoLnJhbmdlO1xuICBkM190aW1lLm1vbnRocy51dGMgPSBkM190aW1lLm1vbnRoLnV0Yy5yYW5nZTtcbiAgZnVuY3Rpb24gZDNfdGltZV9zY2FsZShsaW5lYXIsIG1ldGhvZHMsIGZvcm1hdCkge1xuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBsaW5lYXIoeCk7XG4gICAgfVxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBkM190aW1lX3NjYWxlRGF0ZShsaW5lYXIuaW52ZXJ0KHgpKTtcbiAgICB9O1xuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxpbmVhci5kb21haW4oKS5tYXAoZDNfdGltZV9zY2FsZURhdGUpO1xuICAgICAgbGluZWFyLmRvbWFpbih4KTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHRpY2tNZXRob2QoZXh0ZW50LCBjb3VudCkge1xuICAgICAgdmFyIHNwYW4gPSBleHRlbnRbMV0gLSBleHRlbnRbMF0sIHRhcmdldCA9IHNwYW4gLyBjb3VudCwgaSA9IGQzLmJpc2VjdChkM190aW1lX3NjYWxlU3RlcHMsIHRhcmdldCk7XG4gICAgICByZXR1cm4gaSA9PSBkM190aW1lX3NjYWxlU3RlcHMubGVuZ3RoID8gWyBtZXRob2RzLnllYXIsIGQzX3NjYWxlX2xpbmVhclRpY2tSYW5nZShleHRlbnQubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGQgLyAzMTUzNmU2O1xuICAgICAgfSksIGNvdW50KVsyXSBdIDogIWkgPyBbIGQzX3RpbWVfc2NhbGVNaWxsaXNlY29uZHMsIGQzX3NjYWxlX2xpbmVhclRpY2tSYW5nZShleHRlbnQsIGNvdW50KVsyXSBdIDogbWV0aG9kc1t0YXJnZXQgLyBkM190aW1lX3NjYWxlU3RlcHNbaSAtIDFdIDwgZDNfdGltZV9zY2FsZVN0ZXBzW2ldIC8gdGFyZ2V0ID8gaSAtIDEgOiBpXTtcbiAgICB9XG4gICAgc2NhbGUubmljZSA9IGZ1bmN0aW9uKGludGVydmFsLCBza2lwKSB7XG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksIGV4dGVudCA9IGQzX3NjYWxlRXh0ZW50KGRvbWFpbiksIG1ldGhvZCA9IGludGVydmFsID09IG51bGwgPyB0aWNrTWV0aG9kKGV4dGVudCwgMTApIDogdHlwZW9mIGludGVydmFsID09PSBcIm51bWJlclwiICYmIHRpY2tNZXRob2QoZXh0ZW50LCBpbnRlcnZhbCk7XG4gICAgICBpZiAobWV0aG9kKSBpbnRlcnZhbCA9IG1ldGhvZFswXSwgc2tpcCA9IG1ldGhvZFsxXTtcbiAgICAgIGZ1bmN0aW9uIHNraXBwZWQoZGF0ZSkge1xuICAgICAgICByZXR1cm4gIWlzTmFOKGRhdGUpICYmICFpbnRlcnZhbC5yYW5nZShkYXRlLCBkM190aW1lX3NjYWxlRGF0ZSgrZGF0ZSArIDEpLCBza2lwKS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2NhbGUuZG9tYWluKGQzX3NjYWxlX25pY2UoZG9tYWluLCBza2lwID4gMSA/IHtcbiAgICAgICAgZmxvb3I6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICB3aGlsZSAoc2tpcHBlZChkYXRlID0gaW50ZXJ2YWwuZmxvb3IoZGF0ZSkpKSBkYXRlID0gZDNfdGltZV9zY2FsZURhdGUoZGF0ZSAtIDEpO1xuICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9LFxuICAgICAgICBjZWlsOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgd2hpbGUgKHNraXBwZWQoZGF0ZSA9IGludGVydmFsLmNlaWwoZGF0ZSkpKSBkYXRlID0gZDNfdGltZV9zY2FsZURhdGUoK2RhdGUgKyAxKTtcbiAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgfVxuICAgICAgfSA6IGludGVydmFsKSk7XG4gICAgfTtcbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKGludGVydmFsLCBza2lwKSB7XG4gICAgICB2YXIgZXh0ZW50ID0gZDNfc2NhbGVFeHRlbnQoc2NhbGUuZG9tYWluKCkpLCBtZXRob2QgPSBpbnRlcnZhbCA9PSBudWxsID8gdGlja01ldGhvZChleHRlbnQsIDEwKSA6IHR5cGVvZiBpbnRlcnZhbCA9PT0gXCJudW1iZXJcIiA/IHRpY2tNZXRob2QoZXh0ZW50LCBpbnRlcnZhbCkgOiAhaW50ZXJ2YWwucmFuZ2UgJiYgWyB7XG4gICAgICAgIHJhbmdlOiBpbnRlcnZhbFxuICAgICAgfSwgc2tpcCBdO1xuICAgICAgaWYgKG1ldGhvZCkgaW50ZXJ2YWwgPSBtZXRob2RbMF0sIHNraXAgPSBtZXRob2RbMV07XG4gICAgICByZXR1cm4gaW50ZXJ2YWwucmFuZ2UoZXh0ZW50WzBdLCBkM190aW1lX3NjYWxlRGF0ZSgrZXh0ZW50WzFdICsgMSksIHNraXAgPCAxID8gMSA6IHNraXApO1xuICAgIH07XG4gICAgc2NhbGUudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9O1xuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkM190aW1lX3NjYWxlKGxpbmVhci5jb3B5KCksIG1ldGhvZHMsIGZvcm1hdCk7XG4gICAgfTtcbiAgICByZXR1cm4gZDNfc2NhbGVfbGluZWFyUmViaW5kKHNjYWxlLCBsaW5lYXIpO1xuICB9XG4gIGZ1bmN0aW9uIGQzX3RpbWVfc2NhbGVEYXRlKHQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodCk7XG4gIH1cbiAgdmFyIGQzX3RpbWVfc2NhbGVTdGVwcyA9IFsgMWUzLCA1ZTMsIDE1ZTMsIDNlNCwgNmU0LCAzZTUsIDllNSwgMThlNSwgMzZlNSwgMTA4ZTUsIDIxNmU1LCA0MzJlNSwgODY0ZTUsIDE3MjhlNSwgNjA0OGU1LCAyNTkyZTYsIDc3NzZlNiwgMzE1MzZlNiBdO1xuICB2YXIgZDNfdGltZV9zY2FsZUxvY2FsTWV0aG9kcyA9IFsgWyBkM190aW1lLnNlY29uZCwgMSBdLCBbIGQzX3RpbWUuc2Vjb25kLCA1IF0sIFsgZDNfdGltZS5zZWNvbmQsIDE1IF0sIFsgZDNfdGltZS5zZWNvbmQsIDMwIF0sIFsgZDNfdGltZS5taW51dGUsIDEgXSwgWyBkM190aW1lLm1pbnV0ZSwgNSBdLCBbIGQzX3RpbWUubWludXRlLCAxNSBdLCBbIGQzX3RpbWUubWludXRlLCAzMCBdLCBbIGQzX3RpbWUuaG91ciwgMSBdLCBbIGQzX3RpbWUuaG91ciwgMyBdLCBbIGQzX3RpbWUuaG91ciwgNiBdLCBbIGQzX3RpbWUuaG91ciwgMTIgXSwgWyBkM190aW1lLmRheSwgMSBdLCBbIGQzX3RpbWUuZGF5LCAyIF0sIFsgZDNfdGltZS53ZWVrLCAxIF0sIFsgZDNfdGltZS5tb250aCwgMSBdLCBbIGQzX3RpbWUubW9udGgsIDMgXSwgWyBkM190aW1lLnllYXIsIDEgXSBdO1xuICB2YXIgZDNfdGltZV9zY2FsZUxvY2FsRm9ybWF0ID0gZDNfdGltZV9mb3JtYXQubXVsdGkoWyBbIFwiLiVMXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRNaWxsaXNlY29uZHMoKTtcbiAgfSBdLCBbIFwiOiVTXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRTZWNvbmRzKCk7XG4gIH0gXSwgWyBcIiVJOiVNXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRNaW51dGVzKCk7XG4gIH0gXSwgWyBcIiVJICVwXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRIb3VycygpO1xuICB9IF0sIFsgXCIlYSAlZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0RGF5KCkgJiYgZC5nZXREYXRlKCkgIT0gMTtcbiAgfSBdLCBbIFwiJWIgJWRcIiwgZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBkLmdldERhdGUoKSAhPSAxO1xuICB9IF0sIFsgXCIlQlwiLCBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0TW9udGgoKTtcbiAgfSBdLCBbIFwiJVlcIiwgZDNfdHJ1ZSBdIF0pO1xuICB2YXIgZDNfdGltZV9zY2FsZU1pbGxpc2Vjb25kcyA9IHtcbiAgICByYW5nZTogZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICAgIHJldHVybiBkMy5yYW5nZShNYXRoLmNlaWwoc3RhcnQgLyBzdGVwKSAqIHN0ZXAsICtzdG9wLCBzdGVwKS5tYXAoZDNfdGltZV9zY2FsZURhdGUpO1xuICAgIH0sXG4gICAgZmxvb3I6IGQzX2lkZW50aXR5LFxuICAgIGNlaWw6IGQzX2lkZW50aXR5XG4gIH07XG4gIGQzX3RpbWVfc2NhbGVMb2NhbE1ldGhvZHMueWVhciA9IGQzX3RpbWUueWVhcjtcbiAgZDNfdGltZS5zY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkM190aW1lX3NjYWxlKGQzLnNjYWxlLmxpbmVhcigpLCBkM190aW1lX3NjYWxlTG9jYWxNZXRob2RzLCBkM190aW1lX3NjYWxlTG9jYWxGb3JtYXQpO1xuICB9O1xuICB2YXIgZDNfdGltZV9zY2FsZVV0Y01ldGhvZHMgPSBkM190aW1lX3NjYWxlTG9jYWxNZXRob2RzLm1hcChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIFsgbVswXS51dGMsIG1bMV0gXTtcbiAgfSk7XG4gIHZhciBkM190aW1lX3NjYWxlVXRjRm9ybWF0ID0gZDNfdGltZV9mb3JtYXRVdGMubXVsdGkoWyBbIFwiLiVMXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgfSBdLCBbIFwiOiVTXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRVVENTZWNvbmRzKCk7XG4gIH0gXSwgWyBcIiVJOiVNXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRVVENNaW51dGVzKCk7XG4gIH0gXSwgWyBcIiVJICVwXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZC5nZXRVVENIb3VycygpO1xuICB9IF0sIFsgXCIlYSAlZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDRGF5KCkgJiYgZC5nZXRVVENEYXRlKCkgIT0gMTtcbiAgfSBdLCBbIFwiJWIgJWRcIiwgZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBkLmdldFVUQ0RhdGUoKSAhPSAxO1xuICB9IF0sIFsgXCIlQlwiLCBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDTW9udGgoKTtcbiAgfSBdLCBbIFwiJVlcIiwgZDNfdHJ1ZSBdIF0pO1xuICBkM190aW1lX3NjYWxlVXRjTWV0aG9kcy55ZWFyID0gZDNfdGltZS55ZWFyLnV0YztcbiAgZDNfdGltZS5zY2FsZS51dGMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfdGltZV9zY2FsZShkMy5zY2FsZS5saW5lYXIoKSwgZDNfdGltZV9zY2FsZVV0Y01ldGhvZHMsIGQzX3RpbWVfc2NhbGVVdGNGb3JtYXQpO1xuICB9O1xuICBkMy50ZXh0ID0gZDNfeGhyVHlwZShmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuICB9KTtcbiAgZDMuanNvbiA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZDNfeGhyKHVybCwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGQzX2pzb24sIGNhbGxiYWNrKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfanNvbihyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICB9XG4gIGQzLmh0bWwgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGQzX3hocih1cmwsIFwidGV4dC9odG1sXCIsIGQzX2h0bWwsIGNhbGxiYWNrKTtcbiAgfTtcbiAgZnVuY3Rpb24gZDNfaHRtbChyZXF1ZXN0KSB7XG4gICAgdmFyIHJhbmdlID0gZDNfZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICByYW5nZS5zZWxlY3ROb2RlKGQzX2RvY3VtZW50LmJvZHkpO1xuICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICB9XG4gIGQzLnhtbCA9IGQzX3hoclR5cGUoZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LnJlc3BvbnNlWE1MO1xuICB9KTtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB0aGlzLmQzID0gZDMsIGRlZmluZShkMyk7IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZDM7IGVsc2UgdGhpcy5kMyA9IGQzO1xufSgpOyIsInZhciBUcmVlID0gcmVxdWlyZSgnLi4vZDMtY29sbGFwc2libGUtdHJlZS5qcycpO1xuXG52YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbi8vIHlvdSBjYW4gYWxzbyBzZXQgYSBjb3VwbGUgb2Ygb3RoZXIgdGhpbmdzIGxpa2UgZGltZW5zaW9ucyBpbiB0aGlzIG9iamVjdFxudmFyIG9wdGlvbnMgPSB7XG4gICAgZWxlbWVudDogZWxcbn07XG5cbnZhciB0cmVlID0gbmV3IFRyZWUob3B0aW9ucyk7XG5cbi8vIEdldCBzb21lIHNhbXBsZSBkYXRhXG50cmVlLmdldERhdGEoXCJkYXRhL2ZsYXJlLmpzb25cIik7XG4iXX0=
