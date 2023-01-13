import mongoose from 'mongoose';

// An interface that describes the properties required to create a new order
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// an interface that describes the properties that a order document has
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// An interface that describes the propeties
// that a order model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
