import Hotel from "../models/Hotel.js";

import user from "../models/userModel.js";

export const registerHotel = async (req, res) => {
    try {

        console.log(req.user);
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        //check if the user is already registered
        const hotel = await Hotel.findOne({ owner })
        if (hotel) {
            return res.json({ success: false, message: "Hotel Already Registered" })
        }
        await Hotel.create({ name, address, contact, city, owner });

        await user.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({ success: true, message: "Hotel Registered Successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
