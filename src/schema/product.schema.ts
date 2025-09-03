import { TypeOf, z } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Product:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *           default: "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *         description:
 *           type: string
 *           default: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *         price:
 *           type: number
 *           default: 879.99
 *         image:
 *           type: string
 *           default: "https://i.imgur.com/QlRphfQ.jpg"
 *     productResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         productId:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         __v:
 *           type: number
 *
 */
const payload = {
  body: z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(120, {
      message: "Description should be at least 120 characters long",
    }),

    price: z.number().min(1, { message: "price is required" }),
    image: z.string().min(1, { message: "image is required" }),
  }),
};

const params = {
  params: z.object({
    productId: z.string().min(1, { message: "productid is required" }),
  }),
};

export const createProductSchema = z.object({
  ...payload,
});

export const updateProductSchema = z.object({
  ...payload,
  ...params,
});

export const deleteProductSchema = z.object({
  ...params,
});

export const getProductSchema = z.object({
  ...params,
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type ReadProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
