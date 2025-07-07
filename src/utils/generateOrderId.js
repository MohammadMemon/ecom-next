import counterModel from "@/models/counterModel";

export const generateOrderId = async () => {
  const counter = await counterModel.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const padded = counter.value.toString().padStart(4, "0");
  return `CD-ODR-${padded}`;
};
