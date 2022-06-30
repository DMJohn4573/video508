var types = require('node-sass').types;

module.exports = {
  "encodeBase64($string)": function encodeBase64($string) {
    var buffer = new Buffer($string.getValue());
    return new types.String(buffer.toString('base64'));
  },
  "sqrt($number)": function sqrt($number) {
    var $root = Math.sqrt($number.getValue());
    return new types.Number($root);
  },
  "pow($base, $exp)": function pow($base, $exp) {
    var $pow = Math.pow($base.getValue(), $exp.getValue());
    return new types.Number($pow);
  },
  "calcRel($dx: '1px', $base: '1px', $units: 'vw')": function calcRel($dx, $base, $units) {
    var $rel = ($dx.getValue() * 100) / $base.getValue();
    var $res = new types.Number($rel);
    return new types.Number($rel, $units.getValue());
  }
};
