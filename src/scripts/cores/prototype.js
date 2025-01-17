const PI = Math.PI;

String.prototype.toCamelCase = function () {
  return this.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

String.prototype.toKebabCase = function () {
  return this.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

String.prototype.toCapitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Number.prototype.toRad = function () {
  return this * PI / 180;
};

Number.prototype.toDeg = function () {
  return this * 180 / PI;
};
