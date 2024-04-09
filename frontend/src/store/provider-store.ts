import { createStore } from 'zustand/vanilla'

export interface IProduct {
    id: number
    name: string
    price: number
    image: string
    available: boolean
  }

export type ProductState = {
    products: IProduct[]
}

export type ProductActions = {
    listProducts: () => Promise<void>
}

export type ProductStore = ProductState & ProductActions


export const defaultInitState: ProductState = {
    products: [
        {
            id: 1,
            name: 'Coca cola sem açucar lata 310 ml unidade',
            price: 5.5,
            image: '/coca.png',
            available: true,
        },
        {
            id: 2,
            name: 'Fanta laranja lata 310 ml unidade',
            price: 4.5,
            image: '/fanta.png',
            available: true,
        },
        {
            id: 3,
            name: 'Guaraná lata 350 ml unidade',
            price: 3.5,
            image: '/guarana.png',
            available: true,
        },
    ]
}

export const createProductStore = (
    initState: ProductState = defaultInitState,
) => {
    return createStore<ProductStore>()((set) => ({
        ...initState,
        listProducts: async () => {
            

        },
    }
    ))
}