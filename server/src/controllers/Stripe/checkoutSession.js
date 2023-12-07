const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const infoProducts = require('../Stripe/infoProduct');
const {Products} = require('../../db'); // Importa tu modelo de productos

async function crearPago(req, res) {
    try {
        const productId = req.body.productId;
        const quantity = req.body.quantity; 

        const producto = await infoProducts(productId);

        if (!producto || !producto.available || producto.stock < quantity) {
            return res.status(400).json({ error: 'Producto no válido o no disponible' });
        }

        const updatedProduct = await Products.findByPk(productId);
        if (!updatedProduct) {
            return res.status(400).json({ error: 'Producto no encontrado' });
        }

        if (updatedProduct.stock < quantity) {
            return res.status(400).json({ error: 'No hay suficiente stock disponible.' });
        }

        updatedProduct.stock -= quantity;
        await updatedProduct.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: producto.title,
                            images: [producto.image],
                        },
                        unit_amount: Math.round(producto.price * 100),
                    },
                    quantity: quantity, 
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/user',
            cancel_url: 'http://localhost:5173/home',
        });

        res.json({ id: session.id, price: producto.price });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear sesión de pago');
    }
}

module.exports = {
    crearPago,
};
