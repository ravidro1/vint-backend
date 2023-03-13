const {
  GetProductFromProductArray,
  GetUnseen,
  AddSeen,
  CalcSummary,
  GetProductTags,
  GetRandomizedProducts,
  SortByTags,
  GetSeen,
  GetScore,
  sortAndRemoveDuplicate,
  GetTag,
  SumSellers,
} = require("./analytics_assest");
//test when analytics updates
test("get single user unseen products", async () => {
  const userId = "640df10ba218e7a354e1afeb";
  // returns undefined because analytics is not initialized
  expect(await GetUnseen(userId)).toEqual();
}, 10000);
test("add seen", async () => {
  //update when data arrive
  const productId = "640df10ba218e7a354";
  expect(await GetProductTags(productId)).toEqual([]);
});
// non dependent tests
test("get single user seen products", async () => {
  const userId = "640df10ba218e7a354e1afeb";
  // returns undefined because analytics is not initialized
  expect(await GetSeen(userId)).toEqual();
}, 10000);
test("get products ids from products array", () => {
  const products = [
    { _id: "640df10ba218e7a354", name: "hey" },
    { _id: "640df10ba27a354", name: "ey" },
  ];
  expect(GetProductFromProductArray(products)).toEqual([
    "640df10ba218e7a354",
    "640df10ba27a354",
  ]);
});
test("get single user seen products", async () => {
  const array = [1, 2, 1, 2, 3];
  expect(sortAndRemoveDuplicate(array)).toEqual([
    {
      count: 2,
      value: 1,
    },
    {
      count: 2,
      value: 2,
    },
    {
      count: 1,
      value: 3,
    },
  ]);
});
test("get Score", () => {
  expect(GetScore({ tag: "hey", score: 100 })).toBe(100);
});
test("get Tag", () => {
  expect(GetTag({ tag: "hey", score: 100 })).toBe("hey");
});
