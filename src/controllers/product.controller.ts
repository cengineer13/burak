import { Request, Response } from "express";
import Errors from "../libs/errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequests } from "../libs/types/member";

const productService = new ProductService();


const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts ");
        res.render("products")
    } catch (err) {
        console.log("Error on getAllProducts page", err);

        // Agar err biz hosil qilgan class ichidagi errolardan bolsa jsonga ogirib uni qayta jonatadi
        if (err instanceof Errors) res.status(err.code).json(err);
        // customized error classda mavjud bolmagan error bolsa shu qator ishlaydi
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewProduct ");
        res.send("createNewProduct");
    } catch (err) {
        console.log("Error on createNewProduct page", err);

        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct ");
        res.send("updateChosenProduct");
    } catch (err) {
        console.log("Error on updateChosenProduct page", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

















export default productController;