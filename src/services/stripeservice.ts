import { stripe } from "../utils/stripe"
import { CourseModel } from "../models/coursemodel"

export const createCheckoutSession = async (courseId: string, successUrl: string, cancelUrl: string) => {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new Error('Course not found');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: course.title, description: course.description },
                unit_amount: Math.round(course.price * 100)
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl
    });

    return session;
};
