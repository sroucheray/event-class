System.config({
  "transpiler": "traceur",
  "baseURL": "/",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "jquery/qunit": "github:jquery/qunit@1.18.0",
    "traceur": "github:jmcriffey/bower-traceur@0.0.89",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.89"
  }
});

