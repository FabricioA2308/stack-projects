import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import _ from "lodash";
import { Product } from "./product.model";

declare var GLOBAL: string;

const products = [
  { title: "Carpet", price: 29.99 },
  { title: "Book", price: 10.99 },
];

const newProd = new Product("", -5.99);
validate(newProd).then((errors) => {
  if (errors.length > 0) {
    console.timeLog("Validation error!");
    console.log(errors);
  } else {
    console.log(newProd.getInformation());
  }
});

const transformedProducts = plainToClass(Product, products);

for (const prod of transformedProducts) {
  console.log(prod.getInformation());
}

// console.log(_.shuffle([1, 2, 3]));
// console.log(GLOBAL);

// const p1 = new Product("A book", 12.99);
// console.log(p1.getInformation());
