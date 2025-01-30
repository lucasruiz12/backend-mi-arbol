const { stripe } = require('../../config/stripe');
const PaymentModel = require('../../models/paymentModel');
const UserModel = require('../../models/userModel');
const { formatDate } = require('../../utils/functions');

const createCheckoutSession = async (req, res) => {
    const { amount, userId, email } = req.body;

    try {
        // Verifica usuario
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Busca el último pago del usuario
        const getPayments = await PaymentModel.getPaymentByUserId(userId);
        const existingPayment = getPayments[getPayments.length - 1];

        // Si el usuario tiene un pago registrado y una suscripción activa
        if (existingPayment && existingPayment.stripe_payment_id) {
            try {
                const subscription = await stripe.subscriptions.retrieve(existingPayment.stripe_payment_id);

                if (subscription && subscription.status === 'active') {
                    // Cancela la suscripción existente con reembolso parcial
                    await stripe.subscriptions.cancel(subscription.id, {
                        prorate: true, // Aplica prorrateo para el reembolso
                    });

                    // Crea un nuevo precio para el "upgrade"
                    const newPrice = await stripe.prices.create({
                        unit_amount: amount * 100, // Convierte el monto a centavos
                        currency: 'mxn',
                        recurring: { interval: 'month' },
                        product_data: { name: 'Upgrade mensual para reforestación' },
                    });

                    // Crea una sesión de checkout para el "upgrade"
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: [{
                            price: newPrice.id,
                            quantity: 1,
                        }],
                        mode: 'subscription',
                        customer: subscription.customer, // Usa el cliente existente
                        success_url: `${process.env.CLIENT_URL}/successPayment`,
                        cancel_url: `${process.env.CLIENT_URL}/failurePayment`,
                        metadata: { userId },
                    });
                    return res.status(200).json({ url: session.url, id: session.id });
                };
            } catch (error) {
                console.error('Error al recuperar o actualizar la suscripción:', error);
                // Si hay un error, continuamos con la creación de una nueva sesión de checkout
            };
        };

        // Si no tiene una suscripción activa, crea una nueva sesión de checkout
        const price = await stripe.prices.create({
            unit_amount: amount * 100, // Convierte el monto a centavos
            currency: 'mxn',
            recurring: { interval: 'month' },
            product_data: { name: 'Suscripción mensual para reforestación' },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: price.id,
                quantity: 1,
            }],
            mode: 'subscription',
            customer_email: email.includes("@") ? email : undefined,
            success_url: `${process.env.CLIENT_URL}/successPayment`,
            cancel_url: `${process.env.CLIENT_URL}/failurePayment`,
            metadata: { userId },
        });

        res.status(201).json({ url: session.url, id: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de suscripción:', error);
        res.status(500).json({ message: 'Error al crear la sesión de suscripción' });
    };
};

const verifyPayment = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verifica si el pago fue exitoso
        if (session.payment_status === 'paid') {
            // Aquí puedes realizar el impacto en tu base de datos
            await PaymentModel.createPayment(
                session.subscription,
                session.amount_total / 100,
                session.currency,
                session.payment_status,
                session.metadata.userId
            );

            const subscriptionDate = formatDate(session.created);

            const userEmail = session.customer_details.email;

            const paymentData = {
                amount: session.amount_total / 100,
                currency: session.currency,
                subscriptionDate,
                paid: session.payment_status === 'paid',
            };

            return res.status(200).json({ success: true, message: "Pago realizado exitosamente", paymentData, userEmail });
        } else {
            return res.status(304).json({ success: false, message: "No se efectuó correctamente el pago" });
        }
    } catch (error) {
        console.error('Error verificando el pago:', error);
        return res.status(500).json({ success: false });
    };
};

const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Error verificando webhook:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Guarda el pago en la base de datos
        try {
            await PaymentModel.createPayment(
                session.payment_intent,
                session.amount_total / 100,
                session.currency,
                session.payment_status,
                session.metadata.userId
            );
            console.log('Pago registrado exitosamente');
        } catch (error) {
            console.error('Error al guardar el pago:', error);
        };
    };

    res.status(200).send('Evento recibido');
};

module.exports = { createCheckoutSession, stripeWebhook, verifyPayment };
