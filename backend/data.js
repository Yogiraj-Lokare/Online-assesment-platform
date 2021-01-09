const _ = require("lodash");
function lodashtrial() {
  var dta = [
    {
      name: "uesms",
      age: 12,
      active: true,
    },
    {
      name: "fdmdkdo",
      age: 32,
      active: false,
    },
    {
      name: "newname",
      age: 12,
      active: true,
    },
    {
      name: "modkdmf",
      age: 39,
      active: false,
    },
  ];
  var res = _.result(_.find(dta, { active: true }), "name");
  console.log(res);
  var f1 = _.shuffle(dta);
  var f2 = _.shuffle(dta);
  console.log(f1, f2);
}
lodashtrial();
