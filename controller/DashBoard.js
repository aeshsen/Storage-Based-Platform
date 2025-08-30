import FileModel from "../models/File.model.js";
import mongoose from "mongoose";

const Dashboard = async (req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.user.id);
         
        const data = await FileModel.aggregate([
            {
                $match: {
                    user: objectId
                }
            },
            {
                $group: {
                    _id: "$type", // group by type
                    totalsize: { $sum: "$Size" } // sum of Size field
                }
            }
        ]);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No data is found" });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Dashboard error:", error); // log the real error
        res.status(500).send("something went wrong");
    }
};

export default Dashboard;
