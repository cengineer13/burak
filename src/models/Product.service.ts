import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/errors";
import { ProductInput, Product, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /** SPA */

    /** SSR */
    public async getAllProducts(): Promise<Product[]> {

        const result = await this.productModel.find().exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            return await this.productModel.create(input);

        } catch (err) {
            console.error("Error, model: createNewProduct:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChosenProduct(id: string, input: ProductUpdateInput): Promise<Product> {

        // Kirib kelgan user url strin formatda uni  Mongo Db object id ga o'zgartiramiz. by custom method
        id = shapeIntoMongooseObjectId(id); //param.id -> Mongoose Object id -> DB dan izlash uchun

        const result = await this.productModel.findOneAndUpdate(
            // 1-Db dagi id, 2-input - qaysi malumotni edit qilish, 3-new:true yangi malumotni qaytarish
            { _id: id }, input, { new: true })
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;
    }

}
export default ProductService;