import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema({
    totalSales: Number,
    products: Number,
    sellers: Number,
    orders: Number,
});

const DashboardData = mongoose.models.DashboardData || mongoose.model('DashboardData', DashboardSchema);

export default DashboardData;
