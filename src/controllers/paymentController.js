export const paymentCallback = (req, res) => {
    const form = Formidable();
    form.parse(req, (err, fields, files) => {
      if (fields) {
        console.log("FIELDS", fields);
        const hash = crypto
          .createHmac("sha256", process.env.SECREAT_KEY)
          .update(orderId + "|" + fields.razorpay_payment_id)
          .digest("hex");
  
        if (fields.razorpay_signature === hash) {
          const info = {
            _id: fields.razorpay_payment_id,
            razorpay_order_id: fields.razorpay_order_id,
          };
          const order = new orderSchema({
            _id: info._id,
            orders: fields.razorpay_order_id,
          });
  
        } else {
          res.send("ERROR");
        }
      }
    });
  };