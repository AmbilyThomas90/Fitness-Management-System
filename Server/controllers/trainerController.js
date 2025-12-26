import Trainer from "../models/Trainer.js";

export const createTrainer = async (req, res) => {
  const trainer = await Trainer.create({
    userId: req.user.id,
    certifications: req.body.certifications
  });
  res.json(trainer);
};
