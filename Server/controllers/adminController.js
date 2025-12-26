import Trainer from "../models/Trainer.js";
import Payment from "../models/Payment.js";

export const approveTrainer = async (req, res) => {
  const trainer = await Trainer.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  res.json(trainer);
};

export const getReports = async (req, res) => {
  const payments = await Payment.find();
  res.json({ totalPayments: payments.length });
};
