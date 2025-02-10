import { User } from "../models/user.model.js";

export const authCallBack = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      const newUser = new User({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
      await newUser.save();
      return res.status(201).json(newUser);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in auth callback ->  ", error);

    next(error);
  }
};
