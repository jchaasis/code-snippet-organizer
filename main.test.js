// test/hello_test.js
// const request = require("supertest");
// const server = require("server");
//
// describe("GET /login", function () {
//   test("should return successfully", function () {
//     return request(server)
//       .get("/login")
//       .expect(200)
//
//       });
//   });
//


//
function splitString(stringToSplit, separator) {
  var array = stringToSplit.split(separator);

}


// tags.split(' ');
// splitTags();

test('the string splits', function(){
  return splitString("this,is,a,test" , ',').then(function(array){
    expect(array.length).toBe(4);
  })
})
